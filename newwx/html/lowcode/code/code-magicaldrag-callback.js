/*初始化完成操作*/
MagicalCallback.prototype.after_start = function (api) {
    //加载iframe 拿到父窗口参数 具体请参考page-magicaldrag-callback.js的window.pageParams
    CODE.pageParams = window.parent.pageParams || CODE.pageParams;
    CODE.inject(api);
    //左侧可拖拽的各种入参
    CODE.codeRebuildConstant.pubLeftComponents();
    //TODO 初始化接口列表 有些页面要跳转 有些api自动配置  如果您没有可跳转的页面 就忽略此ajax
    $.getJSON(commonUtil.ctx+"deployer/project/code_data/"+CODE.pageParams.extra.pageId,{date:new Date().getTime(),lessData:true},function (data) {
        if (data.flag) {
            var map = data.data;
            var apiList = map.apiList;//api接口 此处过于复杂 请自行阅读代码 也可忽略
            var pageList = map.pageList;//页面结构 用于跳转页面的 [{id:页面ID,pageName:页面名称}] 具体参考code-rebuild-constant.js的pageListToAjaxUrlOptions
            //设置ajax接口
            CODE.codeRebuildConstant.rejectConstant(apiList,pageList);
        }
    });

    //初始化方法数据
    var methodValue = CODE.pageParams.extra.attrValue;
    if(methodValue){//magicalcoder123(param1,param2)
        if(CODE.tableUtil.isMagicalDynamicStrMethodName(methodValue)){
            var methodId = CODE.tableUtil.numMethodId(methodValue);//数字id
            if(methodId!==''){
                CODE.methodId = methodId;
                CODE.codeAjax.initCodeData(methodId,function (methodHtml) {
                    if(methodHtml){
                        api.insertHtml(methodHtml)
                    }else {
                        api.insertHtml('')
                    }
                })
            }
        }
    }
}


/*保存按钮*/
MagicalCallback.prototype.save_html = function (html,rootNode,javascript) {
    var param = {methodHtml:html};
    var extra = CODE.pageParams.extra;
    var methodId = CODE.methodId;
    if(methodId){
        param.id = methodId;
    }
    param.pageId = extra.pageId;
    //追加方法名称
    var nodes = CODE.lowCodeUtil.nodeUtil.pubSearchNodeList(rootNode,{identifier:"mc-method-base"})
    if(nodes && nodes.length>0){
        var children = nodes[0].magicalCoder.children;
        for(var i=0;i<children.length;i++){
            var child = children[i];
            if(child.magicalCoder.identifier == 'mc-method-base-method-name'){
                param.methodName = child.attributes.value;
            }else if(child.magicalCoder.identifier == 'mc-method-base-method-description'){
                param.methodDescription = child.attributes.value;
            }
        }
    }

    /*js方法*/
    var codeTranslate = new CodeTranslate(rootNode,CODE.pageParams);
    var functionJs = codeTranslate.translate();
    param.functionJs = functionJs;
    //远程更新
    CODE.codeAjax.saveCodeData(param,function (id) {
        //更新
        var methodName = CODE.tableUtil.strMethodName(id);
        var methodNameWithParam = methodName;
        if(CODE.pageParams.extra.attrValue){
            if(CODE.tableUtil.isMagicalDynamicStrMethodName(CODE.pageParams.extra.attrValue)){//满足正常方法
                methodNameWithParam = CODE.tableUtil.replaceMethodNameArea(CODE.pageParams.extra.attrValue,id);
            }
        }else {//首次拼装方法
            var functionParams = CODE.pageParams.rightPanelItemObj.functionParams;
            if(functionParams && functionParams.length>0){
                var array = [];
                for(var j=0;j<functionParams.length;j++){
                    var param = functionParams[j];
                    var attrParamName = param.attrParamName;
                    if(attrParamName){
                        array.push(attrParamName);
                    }
                }
                if(array.length>0){
                    methodNameWithParam =methodNameWithParam+"("+array.join(",")+")";
                }
            }
        }

        CODE.pageParams.focusNode.attributes[extra.attrName] = methodNameWithParam;
        var methods = CODE.pageParams.iframeUi.getMethods();
        methods[methodName]=functionJs;
        CODE.methodId = id;//最新id
        //出来初始化方法
        if(CODE.pageParams.focusNode.magicalCoder.identifier=='mc-window'){
            if(extra.attrName=='onload'){
                CODE.pageParams.iframeUi.vueMountedMethodName = methodName;
            }
        }
        var node = CODE.lowCodeUtil.nodeUtil.pubSearchFirstNode(rootNode,{error:true});
        if(node){
            // alert(functionJs);
            layer.msg("您的配置有语法错误,可能无法运行起来,请按照提示仔细修复红色区域的问题,保存成功");
        }else {
            layer.msg("保存成功");
        }
    })
}
MagicalCallback.prototype.after_change_attr_callback = function (obj) {
    var identifier = obj.focusNode.magicalCoder.identifier;
    if( identifier == 'mc-ajax-url'){
        if(obj.itemObj.type == CODE.constant.type.SELECT){
            CODE.codeRightCallback.changeAjax(obj.focusNode,obj.changeAttrValue);
        }
        CODE.api.refreshRightAttrPane([obj.focusNode.magicalCoder.id]);
    }else if(identifier == 'mc-href-url'){
        if(obj.itemObj.type == CODE.constant.type.SELECT) {
            CODE.rightCallbackHrefUrl.change(obj);
        }
        CODE.api.refreshRightAttrPane([obj.focusNode.magicalCoder.id]);
    }else if(identifier == 'mc-ajax-param-value'){
        if(obj.itemObj.type == CODE.constant.type.SELECT){//参数值下拉框
            obj.focusNode.attributes['mc-is-variable']=true;
        }else if(obj.itemObj.type == CODE.constant.type.TEXT){
            obj.focusNode.attributes['mc-is-variable']=false;
        }
        CODE.api.refreshRightAttrPane([obj.focusNode.magicalCoder.id]);
    }else if(
           identifier == 'mc-ajax-then-page-field-array'
        || identifier == 'mc-ajax-then-page-field-page-total'
        || identifier == 'mc-ajax-then-page-field-not-array'
        || identifier == 'mc-href-param-value'
    ){
        CODE.api.refreshRightAttrPane([obj.focusNode.magicalCoder.id]);
    }
}


MagicalCallback.prototype.after_change_text_callback = function (obj) {
    var itemObj = obj.itemObj;
    var identifier = obj.focusNode.magicalCoder.identifier;
    var value = obj.changeAttrValue;
    if(identifier == 'mc-set-value'){
        if(value){
            //检查是不是当前的变量名
            value = CODE.lowCodeUtil.xssUtil.unEscapeXss(value);
            if(value && value!='true'&&value!='false' && isNaN(value)){//不是数字 肯定就是字符串了
                var variableMap = CODE.codeRebuildConstant.searchAllVariableMap();
                if(typeof variableMap[value]!='undefined'){//普通变量

                }else {//可能是普通字符串
                    var fix = false;
                    if(!value.startsWith("\"")){
                        value = "\""+value;
                        fix = true;
                    }
                    if(!value.endsWith("\"")){
                        value = value+"\"";
                        fix = true;
                    }
                    value = CODE.lowCodeUtil.xssUtil.escapeXss(value);
                    if(fix){
                        layer.confirm('检测到您自定义了值,普通字符串需要双引号包裹,是否帮您校正成普通字符串?', function(index){
                            switch (itemObj.change) {
                                case CODE.constant.change.ATTR:
                                    if(obj.changeAttrName){
                                        obj.focusNode.attributes[obj.changeAttrName]=value;
                                    }
                                    break;
                                case CODE.constant.change.TEXT:
                                    CODE.lowCodeUtil.nodeUtil.pubSetNodeContent(obj.focusNode,value);
                                    break;
                            }
                            CODE.api.refreshWorkspace();
                            CODE.api.refreshRightAttrPane([obj.focusNode.magicalCoder.id]);
                            layer.close(index);
                        });
                    }
                }
            }
        }
        CODE.api.refreshRightAttrPane([obj.focusNode.magicalCoder.id]);
    }
}

MagicalCallback.prototype.after_workspace_change = function () {
    if(CODE.codeSyntaxCheck){
        CODE.codeSyntaxCheck.check();

    }

}

MagicalCallback.prototype.pre_build_attrs = function (focusNode) {
    CODE.codeRebuildConstant.pubRefreshConstant(focusNode);
    return true;
}
