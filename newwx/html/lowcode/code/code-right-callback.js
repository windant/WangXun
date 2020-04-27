/*右侧属性变更 触发回调事件*/
function CodeRightCallback(api,pageParams) {
    this.api = api;
    this.pageParams = pageParams;
    this.tableNode = null;//当前表对应的节点 需要转换下拉 radio等的值成友好显示值 比如本来1:男 那么返回给table就要是男 而不能是1
    this.constant = this.api.getConstant();
    this.lowCodeConstant = new LowCodeConstant();
    this.lowCodeUtil = new LowCodeUtil();
}
CodeRightCallback.prototype.changeAjax = function (focusNode,apiUrl) {
    if(!apiUrl){
        return;
    }
    var arr = apiUrl.split("/");
    var apiId = arr[arr.length-1];
    var parentId = focusNode.magicalCoder.parentId;
    var ajaxNode = this.api.searchNodes(null,{id:parentId})[0];
    var children = ajaxNode.magicalCoder.children;
    //查找孩子
    for(var i=0;i<children.length;i++){
        var paramsNode = children[i];
        this.ajaxSetDynamicHtml(apiId,paramsNode);
    }
}
CodeRightCallback.prototype.ajaxSetDynamicHtml = function(apiId,paramsNode){
    var _t = this;
    $.getJSON(commonUtil.ctx+"deployer/db/api_mongo_json/"+apiId,{date:new Date().getTime()},function (data) {
        if(data.flag){
            var map = data.data;
            var mongoJson = map.userTableApi.mongoDocumentJson;
            if(mongoJson){
                var tableHtml = map.userTable.formHtml;
                _t.tableNode = _t.api.htmlToRootNode(tableHtml);
                var dynamicList = JSON.parse(mongoJson);
                if(paramsNode.magicalCoder.identifier == 'mc-ajax-params'){//参数组
                    var html = _t.buildAjaxParamsHtml(dynamicList);
                    var childrenNodes = _t.api.htmlToRootNode(html).magicalCoder.children;
                    _t.api.resetChildren(paramsNode.magicalCoder.id,childrenNodes);
                }else if(paramsNode.magicalCoder.identifier == 'mc-ajax-thens'){//返回数据
                    var html = _t.buildAjaxThensHtml(dynamicList);
                    var childrenNodes = _t.api.htmlToRootNode(html).magicalCoder.children;
                    _t.api.resetChildren(paramsNode.magicalCoder.id,childrenNodes);
                }
            }
        }else {
            layer.msg("获取api详情失败");
        }
    })
}
CodeRightCallback.prototype.findRealParamName = function(param){
    if(param){
        var aliasName = param.aliasName;
        if(aliasName){
            return aliasName||'';
        }
        return param.name || '';
    }
    return null;
}
CodeRightCallback.prototype.buildAjaxParamsHtml = function (dynamicList) {
    var params = [];//普通参树
    var findPageParams = [];//查询分页参数
    if(dynamicList!=null && dynamicList.length>0){
        for(var n = 0;n<dynamicList.length;n++){
            var dynamic = dynamicList[n];
            switch (dynamic.type) {
                case 'find':
                case 'groupCount':
                    var paramGroups = dynamic.paramGroups;
                    if(paramGroups!=null && paramGroups.length>0){
                        for(var i=0;i<paramGroups.length;i++){
                            var group = paramGroups[i];
                            if(group){
                                var ps = group.params;
                                if(ps!=null && ps.length>0){
                                    for(var j=0;j<ps.length;j++){
                                        var item = ps[j];
                                        if(item && item.variable){
                                            params.push({name:this.findRealParamName(item),value:'',identifier:''});
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var totalCount = dynamic.totalCount;
                    if(totalCount.paramName){
                        findPageParams.push({name:totalCount.paramName,value:true,identifier:'mc-find-page-total-count'});
                    }
                    var limit = dynamic.limit;
                    if(limit.paramName){
                        findPageParams.push({name:limit.paramName,value:20,identifier:'mc-find-page-limit'});
                    }
                    //动态查找分页 当前页参数是否传进来了
                    var pageNum = dynamic.pageNum;
                    if(pageNum.paramName){
                        var match = false;
                        var pageNumName = commonUtil.functionName._pageNum;
                        //检查是否携带_pageNum参数
                        var functionParams = this.pageParams.rightPanelItemObj.functionParams || [];
                        if(functionParams){
                            for(var i=0;i<functionParams.length;i++){
                                var fp = functionParams[i];
                                if(fp.name == pageNumName){
                                    match = true;
                                    break;
                                }
                            }

                        }
                        if(!match){
                            pageNumName = 1;
                        }
                        findPageParams.push({name:pageNum.paramName,value:pageNumName,identifier:'mc-find-page-num'});
                    }
                    break;
                case 'insert':
                    var insertParams = dynamic.params;
                    if(insertParams!=null && insertParams.length>0){
                        for(var i=0;i<insertParams.length;i++){
                            var item = insertParams[i];
                            if(item && item.variable){
                                params.push({name:this.findRealParamName(item),value:'',identifier:''});
                            }
                        }
                    }
                    break;
                case 'delete':
                    var paramGroups = dynamic.paramGroups;
                    if(paramGroups!=null && paramGroups.length>0){
                        for(var i=0;i<paramGroups.length;i++){
                            var group = paramGroups[i];
                            if(group){
                                var ps = group.params;
                                if(ps!=null && ps.length>0){
                                    for(var j=0;j<ps.length;j++){
                                        var item = ps[j];
                                        if(item && item.variable){
                                            params.push({name:this.findRealParamName(item),value:'',identifier:''});
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 'update':
                    var setParams = dynamic.params;
                    if(setParams!=null && setParams.length>0){
                        for(var i=0;i<setParams.length;i++){
                            var item = setParams[i];
                            if(item && item.variable){
                                params.push({name:this.findRealParamName(item),value:'',identifier:''});
                            }
                        }
                    }
                    var paramGroups = dynamic.paramGroups;
                    if(paramGroups!=null && paramGroups.length>0){
                        for(var i=0;i<paramGroups.length;i++){
                            var group = paramGroups[i];
                            if(group){
                                var ps = group.params;
                                if(ps!=null && ps.length>0){
                                    for(var j=0;j<ps.length;j++){
                                        var item = ps[j];
                                        if(item && item.variable){
                                            params.push({name:this.findRealParamName(item),value:'',identifier:''});
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 'findCount':
                    var paramGroups = dynamic.paramGroups;
                    if(paramGroups!=null && paramGroups.length>0){
                        for(var i=0;i<paramGroups.length;i++){
                            var group = paramGroups[i];
                            if(group){
                                var ps = group.params;
                                if(ps!=null && ps.length>0){
                                    for(var j=0;j<ps.length;j++){
                                        var item = ps[j];
                                        if(item && item.variable){
                                            params.push({name:this.findRealParamName(item),value:'',identifier:''});
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
        }

    }
    //智能填充值 参数名与参数值
    var paramValueOptions = this.findOptionMap("mc-ajax-param-value","value");

    var html = [];
    for(var i =0;i<params.length;i++){
        var param = params[i];
        var defaultValue = param.value||paramValueOptions[param.name]||'';
        var innerHtml =
            '<div class="layui-col-xs12 mc-ajax-param">' +
            '<input class="layui-input mc-ajax-param-name" type="text" value="'+(param.name||'')+'" readonly placeholder="参数名" />'+
            '<input class="layui-input mc-ajax-param-value" mc-is-variable type="text" value="'+defaultValue+'" readonly placeholder="参数值" />'+
            '</div>';
        html.push(innerHtml);
    }
    {
        //find:分页相关参数
        for(var i=0;i<findPageParams.length;i++){
            var param = findPageParams[i];
            var innerHtml =
                '<div class="layui-col-xs12 mc-ajax-param">' +
                '<input class="layui-input mc-ajax-param-name" type="text" value="'+(param.name||'')+'" readonly placeholder="参数名" />'+
                '<input class="layui-input '+param.identifier+'" mc-is-variable type="text" value="'+(param.value||'')+'" readonly placeholder="参数值" />'+
                '</div>';
            html.push(innerHtml);
        }
    }

    return html.join('');
}

CodeRightCallback.prototype.findOptionMap = function(identifier,attrName){
    var paramArrayConfigs = this.constant.getRightConfig(identifier,attrName);
    var paramValueOptions = {};
    if(paramArrayConfigs){
        for(var i=0;i<paramArrayConfigs.length;i++){
            if(paramArrayConfigs[i].type == this.constant.type.SELECT){//config下拉的话 配置的都是变量名 匹配一下
                var options = paramArrayConfigs[i].options;
                for(var j=0;j<options.length;j++){
                    var option = options[j];
                    for(var key in option){
                        var blm = this.findVariableName(option[key]);//变量名 页面参数:userName 这种格式需要改造一下
                        paramValueOptions[blm] = key;//key是真正的可执行代码
                    }
                }
            }
        }
    }
    return paramValueOptions;
}
CodeRightCallback.prototype.findVariableName = function(text){
    var blmArr=text.split(":");
    if(blmArr.length>1){
        return blmArr[1];
    }
    return text;
}


CodeRightCallback.prototype.buildAjaxThensHtml = function (dynamicList) {
    var returnName = [];
    var returnType = '';
    var html = [];
    if(dynamicList!=null && dynamicList.length>0){
        for(var n = 0;n<dynamicList.length;n++){
            var dynamic = dynamicList[n];
            switch (dynamic.type) {
                case 'find':
                    returnName = dynamic.returnName;//['age','name']
                    returnType = dynamic.returnType;//返回类型
                    var radioSelectValueToTextJs = this.changeRadioSelectValueToTextJs(returnType);
                    switch (returnType) {
                        case this.lowCodeConstant.findReturnType.LIST://用于列表
                            var tableArrayConfigs = this.lowCodeUtil.mapUtil.coverToKeyValue(this.findOptionMap("mc-ajax-then-page-field-array","value"));
                            var tableFieldName = tableArrayConfigs?tableArrayConfigs.value:'';

                            html.push(radioSelectValueToTextJs);
                            var listHtml =
                                '<div class="layui-col-xs12 mc-ajax-then">' +
                                '<input class="layui-input mc-ajax-then-page-field-array" type="text" value="'+tableFieldName+'" readonly placeholder="页面数组变量" />' +
                                '<strong class="mc-math-set">=</strong>' +
                                '<input class="layui-input mc-ajax-then-return-name" type="text" value="_res.data" mc-comment="返回的数组" readonly placeholder="返回字段" />\n' +
                                '</div>';

                            var pageTotalConfigs = this.lowCodeUtil.mapUtil.coverToKeyValue(this.findOptionMap("mc-ajax-then-page-field-page-total","value"));
                            var pageTotalFieldName = pageTotalConfigs?pageTotalConfigs.value:'';
                            var pageTotalHtml =
                                '<div class="layui-col-xs12 mc-ajax-then">' +
                                '<input class="layui-input mc-ajax-then-page-field-page-total" type="text" value="'+pageTotalFieldName+'" readonly placeholder="页面分页的总条数变量" />' +
                                '<strong class="mc-math-set">=</strong>' +
                                '<input class="layui-input mc-ajax-then-return-name" type="text" value="_res.count" readonly mc-comment="返回的总条数" placeholder="返回字段" />\n' +
                                '</div>';
                            html.push(listHtml);
                            html.push(pageTotalHtml);
                            break;
                        case this.lowCodeConstant.findReturnType.ENTITY://用于用户自己定义
                            var configMap = this.findOptionMap("mc-ajax-then-page-field-not-array","value");
                            html.push(radioSelectValueToTextJs);
                            for(var i =0;i<returnName.length;i++){
                                var name = returnName[i];
                                var replaceField = configMap[name]||'';
                                var oneHtml =
                                    '<div class="layui-col-xs12 mc-ajax-then">' +
                                    '<input class="layui-input mc-ajax-then-page-field-not-array" type="text" value="'+replaceField+'" readonly placeholder="页面普通变量" />' +
                                    '<strong class="mc-math-set">=</strong>' +
                                    '<input class="layui-input mc-ajax-then-return-name" type="text" value="_res.data.'+name+'" readonly placeholder="返回字段" />\n' +
                                    '</div>';
                                html.push(oneHtml);
                            }
                            break;
                    }
                    break;
                case 'findCount':
                    var countHtml =
                        '<div class="layui-col-xs12 mc-ajax-then">' +
                        '<input class="layui-input mc-ajax-then-page-field-not-array" type="text" value="" readonly placeholder="页面普通变量" />' +
                        '<strong class="mc-math-set">=</strong>' +
                        '<input class="layui-input mc-ajax-then-return-name" type="text" value="_res.data" mc-comment="返回的总条数" readonly placeholder="返回字段" />\n' +
                        '</div>';
                    html.push(countHtml);
                    break;
                case 'groupCount':
                    var tableFieldName = tableArrayConfigs?tableArrayConfigs.value:'';
                    var listHtml =
                        '<div class="layui-col-xs12 mc-ajax-then">' +
                        '<input class="layui-input mc-ajax-then-page-field-array" type="text" value="'+tableFieldName+'" readonly placeholder="页面数组变量" />' +
                        '<strong class="mc-math-set">=</strong>' +
                        '<input class="layui-input mc-ajax-then-return-name" type="text" value="_res.data" mc-comment="返回的数组" readonly placeholder="返回字段" />\n' +
                        '</div>';
                    html.push(listHtml);
                    break;
            }
        }
    }



    return html.join('');
}
/*有时数据返回的不理想 是数字 用户要的应该是配置文本 比如radio select这些*/
CodeRightCallback.prototype.changeRadioSelectValueToTextJs = function (returnType) {
    var js = [];
    switch (returnType) {
        case this.lowCodeConstant.findReturnType.LIST:
            js.push('<div class="layui-col-xs12 mc-ajax-then-translates" mc-return-type="list">');
            break;
        case this.lowCodeConstant.findReturnType.ENTITY:
            js.push('<div class="layui-col-xs12 mc-ajax-then-translates" mc-return-type="entity">');
            break;
    }
    //radio
    var elRadioGroupNodes = this.lowCodeUtil.nodeUtil.pubSearchNodeList(this.tableNode,{tagName:"el-radio-group"});
    if(elRadioGroupNodes.length>0){
        for(var i=0;i<elRadioGroupNodes.length;i++){
            var node = elRadioGroupNodes[i];
            var vModel = node.attributes['v-model'];
            if(vModel){
                var name = vModel;
                var values = []
                var showText = [];
                var children = node.magicalCoder.children;
                for(var j=0;j<children.length;j++){
                    var radio = children[j];
                    var label = radio.attributes['label'];//
                    var text = this.lowCodeUtil.nodeUtil.pubGetNodeContent(radio);//文本
                    values.push('"'+label+'":"'+text+'"');
                    showText.push("如果值为"+label+"则显示"+text);
                }
                var map = this.lowCodeUtil.xssUtil.escapeXss('{'+values.join(',')+'}');
                js.push('<input class="layui-input mc-ajax-then-translate" type="text" mc-data-name="'+name+'" mc-data-map="'+map+'" value="预处理【'+name+'】'+showText+'" readonly placeholder="预处理字段返回数据" />')
            }
        }
    }
    //select
    var elSelectNodes = this.lowCodeUtil.nodeUtil.pubSearchNodeList(this.tableNode,{tagName:"el-select"});
    if(elSelectNodes.length>0){
        for(var i=0;i<elSelectNodes.length;i++){
            var node = elSelectNodes[i];
            var vModel = node.attributes['v-model'];
            if(vModel){
                var name = vModel;
                var values = []
                var showText = []
                var children = node.magicalCoder.children;
                for(var j=0;j<children.length;j++){
                    var radio = children[j];
                    var value = radio.attributes['value'];//1
                    var label = radio.attributes['label'];//类型1
                    values.push('"'+value+'":"'+label+'"');
                    showText.push("如果值为"+value+"则显示"+label);

                }
                var map = this.lowCodeUtil.xssUtil.escapeXss('{'+values.join(',')+'}');
                js.push('<input class="layui-input mc-ajax-then-translate" type="text" mc-data-name="'+name+'" mc-data-map="'+map+'" value="预处理【'+name+'】'+showText+'" readonly placeholder="预处理字段返回数据" />')
            }
        }
    }

    js.push("</div>")
    return js.join('');
}
//转换成js
CodeRightCallback.prototype.radioSelectValueToTranselateJs = function () {
    var js = [];
    //checkbox
    var elCheckboxGroupNodes = this.lowCodeUtil.nodeUtil.pubSearchNodeList(this.tableNode,{tagName:"el-checkbox-group"});
    if(elCheckboxGroupNodes.length>0){
        for(var i=0;i<elCheckboxGroupNodes.length;i++){
            var node = elCheckboxGroupNodes[i];
            var vModel = node.attributes['v-model'];
            if(vModel){
                var name = vModel;
                var values = []
                var children = node.magicalCoder.children;
                for(var j=0;j<children.length;j++){
                    var checkbox = children[j];
                    var label = checkbox.attributes['label'];//
                    var text = this.lowCodeUtil.nodeUtil.pubGetNodeContent(checkbox);//文本
                    values.push('"'+label+'":"'+text+'"');
                }
                var map = '{'+values.join(',')+'}';
                js.push('if (typeof entity["'+name+'"] != "undefiend") {');
                js.push('   var map='+map+';');
                js.push('   var showText = [];');
                js.push('   if (entity.'+name+') {');
                js.push('       for (var i = 0; i < entity.'+name+'.length; i++) {');
                js.push('           showText.push(map[""+entity.'+name+'[i]]);');
                js.push('       }');
                js.push('   }');
                js.push('   entity.'+name+' = showText.join(",");');
                js.push('}');
            }
        }
    }
    //radio
    var elRadioGroupNodes = this.lowCodeUtil.nodeUtil.pubSearchNodeList(this.tableNode,{tagName:"el-radio-group"});
    if(elRadioGroupNodes.length>0){
        for(var i=0;i<elRadioGroupNodes.length;i++){
            var node = elRadioGroupNodes[i];
            var vModel = node.attributes['v-model'];
            if(vModel){
                var name = vModel;
                var values = []
                var children = node.magicalCoder.children;
                for(var j=0;j<children.length;j++){
                    var radio = children[j];
                    var label = radio.attributes['label'];//
                    var text = this.lowCodeUtil.nodeUtil.pubGetNodeContent(radio);//文本
                    values.push('"'+label+'":"'+text+'"');
                }
                var map = '{'+values.join(',')+'}';
                js.push('if (typeof entity["'+name+'"] != "undefiend") {');
                js.push('   var map='+map+';');
                js.push('   entity.'+name+' = map[""+entity.'+name+'];');
                js.push('}');
            }
        }
    }
    //select
    var elSelectNodes = this.lowCodeUtil.nodeUtil.pubSearchNodeList(this.tableNode,{tagName:"el-select"});
    if(elSelectNodes.length>0){
        for(var i=0;i<elSelectNodes.length;i++){
            var node = elSelectNodes[i];
            var vModel = node.attributes['v-model'];
            if(vModel){
                var name = vModel;
                var values = []
                var children = node.magicalCoder.children;
                for(var j=0;j<children.length;j++){
                    var radio = children[j];
                    var value = radio.attributes['value'];//1
                    var label = radio.attributes['label'];//类型1
                    values.push('"'+value+'":"'+label+'"');
                }
                var map = '{'+values.join(',')+'};';
                js.push('if (typeof entity["'+name+'"] != "undefiend") {');
                js.push('   var map='+map+';');
                js.push('   entity.'+name+' = map[""+entity.'+name+'];');
                js.push('}');
            }
        }
    }
    return js.join('\n');
}
