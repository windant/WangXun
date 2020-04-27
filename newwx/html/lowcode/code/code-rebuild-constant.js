/*重新构造constant.js中部分内容 这块是智能的关键 早晚要仔细拆分*/
function CodeRebuildConstant(api,pageParams) {
    this.api = api;
    this.constant = api.getConstant();
    this.pageParams = pageParams;
    this.pageRootNode = pageParams.rootNode;

    this.pageIframeUi = this.pageParams.iframeUi;
    this.pageRightPanelItemObj = this.pageParams.rightPanelItemObj;//父页面触发进来此页面的右侧属性配置
    this.tableUtil = new Table();
    this.lowCodeConstant = new LowCodeConstant();
    this.lowCodeUtil = new LowCodeUtil();
    this.codeUtil = new CodeUtil();
    this.apiList = null;
    this.pageList = null;
}
/*绑定右侧属性配置*/
CodeRebuildConstant.prototype.rejectConstant = function(apiList,pageList){
    this.apiList = apiList;
    this.pageList = pageList;
}
/**
 * 自动构建左侧自定义组件中可能出现的各种变量
 */
CodeRebuildConstant.prototype.pubLeftComponents = function () {
    var vueData = this.pageIframeUi.getVueData();
    for(var i=0;i< this.constant.components.length;i++){
        if(this.constant.components[i].id=='hrefVariable'){//跳转地址参数
            var paramsOptions = this.hrefParamsToOptions();
            if(paramsOptions && paramsOptions.length>0){
                for(var j=0;j<paramsOptions.length;j++){
                    var map = paramsOptions[j];
                    for(var key in map){
                        var item = {
                            name:map[key],
                            icon:"assets/drag/img/left/import1.png",
                            html:"<var class='mc-href-field'>"+key+"</var>",
                        }
                        this.constant.components[i].children.push(item);
                    }
                }
            }
        }else if(this.constant.components[i].id=='pageVariable'){//页面参数
            for(var key in vueData){//追加到布局器左侧可拖拽组件中
                var item = {
                    name:key,
                    icon:"assets/drag/img/left/import1.png",
                    html:"<var class='mc-page-field'>vueData."+key+"</var>",
                }
                this.constant.components[i].children.push(item);
            }
        }else if(this.constant.components[i].id=='functionVariable'){
            var methodParams = this.pageParams.extra.methodParams;
            if(methodParams && methodParams.length>0){//自定义了入参
                for(var n=0;n<methodParams.length;n++){
                    var idx = n+1;
                    var item = {
                        name:"方法参数"+idx,
                        icon:"assets/drag/img/left/import1.png",
                        html:"<var class='mc-function-field'>_param"+idx+"</var>",
                    }
                    this.constant.components[i].children.push(item);
                }
            }else {
                var functionParams = this.pageRightPanelItemObj.functionParams;//方法级别的参数
                if(functionParams){
                    for(var j=0;j<functionParams.length;j++){//追加到布局器左侧可拖拽组件中
                        var param = functionParams[j];
                        var subParams = param.subParams;
                        if(subParams &&subParams.length>0){
                            for(var k=0;k<subParams.length;k++){
                                var subParam = subParams[k];
                                var item = {
                                    name:subParam.title,
                                    icon:"assets/drag/img/left/import1.png",
                                    html:"<var class='mc-function-field'>"+subParam.name+"</var>",
                                }
                                this.constant.components[i].children.push(item);
                            }
                        }else {
                            var item = {
                                name:param.title,
                                icon:"assets/drag/img/left/import1.png",
                                html:"<var class='mc-function-field'>"+param.name+"</var>",
                            }
                            this.constant.components[i].children.push(item);
                        }

                    }
                }
            }

        }
    }

    this.api.rebuildLeftComponents();
}

CodeRebuildConstant.prototype.pubRefreshConstant=function(focusNode){
    var  idenfier = focusNode.magicalCoder.identifier;
    if(",mc-ajax-url,mc-ajax-param-value,mc-find-page-num,mc-ajax-then-page-field-not-array,mc-ajax-then-page-field-array," +
        "mc-ajax-then-page-field-page-total,mc-href-url,mc-href-param-value,mc-set-value,mc-set-variable,mc-href-field,mc-function-field,mc-page-field,".indexOf(","+idenfier+",")==-1){
        return;
    }
    this.priRefreshRightConfig(this.apiList,this.pageList);
}
/*右侧属性刷新*/
CodeRebuildConstant.prototype.priRefreshRightConfig = function(apiList,pageList){
    var rightPanel = this.constant.getRightPanel();
    for(var i=0;i<rightPanel.length;i++){
        var content = rightPanel[i].content;
        for(var identifier in content){
            var configs = content[identifier];
            for(var j=0;j<configs.length;j++){
                var config = configs[j];
                if("mc-ajax-url" == identifier){//ajax请求的地址
                    if(config['attrName'] == 'value' &&
                        config['type']==this.constant.type.SELECT){
                        config.options = this.apiListToAjaxUrlOptions(apiList);
                    }
                }else if("mc-ajax-param-value" == identifier){//ajax参数的值
                    if(config['attrName'] == 'value' &&
                        config['type']==this.constant.type.SELECT){
                        config.options = this.lowCodeUtil.arrayUtil.copyArray(this.pageVueDataToAjaxValueOptions(null,'el-table','value'),this.functionParamsToOptions());
                        this.lowCodeUtil.arrayUtil.copyArray(config.options,this.hrefParamsToOptions());
                        this.lowCodeUtil.arrayUtil.copyArray(config.options,this.searchUserDefinedVariableOptions());
                    }
                }
                else if("mc-find-page-num" == identifier){//ajax参数的值
                    if(config['attrName'] == 'value' &&
                        config['type']==this.constant.type.SELECT){
                        config.options = this.functionParamsToOptions();
                    }
                }else if("mc-ajax-then-page-field-not-array" == identifier){//ajax返回页面变量非数组
                    if(config['attrName'] == 'value' &&
                        config['type']==this.constant.type.SELECT){
                        config.options = this.pageVueDataToAjaxValueOptions(null,'el-table','field');
                    }
                }else if("mc-ajax-then-page-field-array" == identifier){//ajax返回页面变量数组
                    if(config['attrName'] == 'value' &&
                        config['type']==this.constant.type.SELECT){
                        config.options = this.pageVueDataArrayToAjaxValueOptions();
                    }
                }else if("mc-ajax-then-page-field-page-total" == identifier){//ajax返回页面记录条数
                    if(config['attrName'] == 'value' &&
                        config['type']==this.constant.type.SELECT){
                        config.options = this.pageVueDataToAjaxValueOptions('el-pagination',null,'field');
                    }
                }else if("mc-href-url" == identifier){//页面跳转请求的地址
                    if(config['attrName'] == 'value' &&
                        config['type']==this.constant.type.SELECT){
                        config.options = this.pageListToAjaxUrlOptions(pageList);
                    }
                }
                else if("mc-href-param-value" == identifier){//页面跳转参数的值
                    if(config['attrName'] == 'value' &&
                        config['type']==this.constant.type.SELECT){
                        config.options = this.lowCodeUtil.arrayUtil.copyArray(this.pageVueDataToAjaxValueOptions(null,'el-table','value'),this.functionParamsToOptions());
                        this.lowCodeUtil.arrayUtil.copyArray(config.options,this.hrefParamsToOptions());
                        this.lowCodeUtil.arrayUtil.copyArray(config.options,this.searchUserDefinedVariableOptions());
                    }
                }else if("mc-set-value" == identifier||"mc-function-field" == identifier||"mc-page-field" == identifier||"mc-href-field" == identifier ){//设置值
                    if(config['type']==this.constant.type.SELECT && config['identifier']=='variable'){//变量
                        config.options = this.lowCodeUtil.arrayUtil.copyArray(this.pageVueDataToAjaxValueOptions(null,'el-table','value'),this.functionParamsToOptions());
                        this.lowCodeUtil.arrayUtil.copyArray(config.options,this.hrefParamsToOptions());
                        this.lowCodeUtil.arrayUtil.copyArray(config.options,this.searchUserDefinedVariableOptions());
                    }
                }else if("mc-set-variable" == identifier ){//设置变量名
                    if(config['type']==this.constant.type.SELECT){
                        config.options = this.lowCodeUtil.arrayUtil.copyArray(this.pageVueDataToAjaxValueOptions(null,'el-table','value'),this.functionParamsToOptions());
                        this.lowCodeUtil.arrayUtil.copyArray(config.options,this.hrefParamsToOptions());
                        this.lowCodeUtil.arrayUtil.copyArray(config.options,this.searchUserDefinedVariableOptions());
                    }
                }
            }
        }
    }
}
/*接口地址下拉*/
CodeRebuildConstant.prototype.apiListToAjaxUrlOptions = function(apiList){
    var options = [];
    if(apiList!=null && apiList.length>0){
        for(var i=0;i<apiList.length;i++){
            var api = apiList[i];
            var map = {};
            map["web/api/"+api.id]=api.apiName;
            options.push(map)
        }
    }
    return options;
}
/*可跳转地址下拉*/
CodeRebuildConstant.prototype.pageListToAjaxUrlOptions = function(pageList){
    var options = [];
    if(pageList!=null && pageList.length>0){
        for(var i=0;i<pageList.length;i++){
            var page = pageList[i];
            var map = {};
            map["web/page/"+page.id]=page.pageName;
            options.push(map)
        }
    }
    return options;
}

/*页面地址入参*/
CodeRebuildConstant.prototype.hrefParamsToOptions = function(){
    return this.codeUtil.findPageHrefParamList(this.pageRootNode,true);
}

/*页面级变量名下拉*/
CodeRebuildConstant.prototype.pageVueDataToAjaxValueOptions = function(eqIdentifier,notEqIdentifier,useType){
    var options = [];
    var vueDataMapping = this.pageIframeUi.getVueDataMapping();
    var mapping = vueDataMapping.mapping;
    for(var key in mapping) {
        var map = {};
        var node = mapping[key].node;
        if(eqIdentifier){
            if(node.magicalCoder.identifier === eqIdentifier){
                switch (useType) {
                    case 'value':
                        if(node.magicalCoder.identifier=='el-upload'){
                            map["commonUtil.elUploadFileList(_vueThis.$refs."+key+".uploadFiles)"]="页面参数:"+key;//文件上传组件特殊处理 值是非动态的 所以用这个方法转 ref取得是el-upload的ref属性 跟:file-list一致
                        }else {
                            map["vueData."+key]="页面参数:"+key;
                        }
                        break;
                    case 'field':
                        map["vueData."+key]="页面参数:"+key;
                        break;
                }
                options.push(map)
            }
        }else if(notEqIdentifier){
            if(node.magicalCoder.identifier!==notEqIdentifier){
                switch (useType) {
                    case 'value':
                        if(node.magicalCoder.identifier=='el-upload'){
                            map["commonUtil.elUploadFileList(_vueThis.$refs."+key+".uploadFiles)"]="页面参数:"+key;//文件上传组件特殊处理 值是非动态的 所以用这个方法转 ref取得是el-upload的ref属性 跟:file-list一致
                        }else {
                            map["vueData."+key]="页面参数:"+key;
                        }
                        break;
                    case 'field':
                        map["vueData."+key]="页面参数:"+key;
                        break;
                }
                options.push(map)
            }
        }
    }
    return options;
}
//哪些是可能数组数据
CodeRebuildConstant.prototype.pageVueDataArrayToAjaxValueOptions = function(){
    var options = [];
    var vueDataMapping = this.pageIframeUi.getVueDataMapping();
    var mapping = vueDataMapping.mapping;
    for(var key in mapping) {
        var map = {};
        map["vueData."+key]=key;
        if(mapping[key].node.magicalCoder.identifier == 'el-table' || mapping[key].attrName =='v-for'){
            options.push(map)
        }
    }
    return options;
}
//方法级的参数转换成下拉
CodeRebuildConstant.prototype.functionParamsToOptions = function(){
    var options = [];
    var methodParams = this.pageParams.extra.methodParams;
    if(methodParams && methodParams.length>0){//自定义了入参
        for(var n=0;n<methodParams.length;n++){
            var idx = n+1;
            var map = {};
            map["_param"+idx]="方法参数:第"+idx+"个参数";
            options.push(map);
        }
    }else {
        var functionParams = this.pageRightPanelItemObj.functionParams;//方法级别的参数
        if(functionParams){
            for(var j=0;j<functionParams.length;j++){//追加到布局器左侧可拖拽组件中
                var map = {}
                var param = functionParams[j];
                var subParams = param.subParams;
                if(subParams &&subParams.length>0){//还有子参数
                    for(var k=0;k<subParams.length;k++){
                        var subParam = subParams[k];
                        map[subParam.name]=subParam.title;
                    }
                }else{
                    map[param.name]="方法参数:"+param.title;
                }
                options.push(map);
            }
        }
    }

    return options;
}
//用户自定义变量变成下拉使用 注意还有一个可见域功能没做 就是不能随便选 可能会出现选了后面出现的变量
CodeRebuildConstant.prototype.searchUserDefinedVariableOptions = function () {
    var rootNode = this.api.getRootNode();
    var variableList = this.lowCodeUtil.nodeUtil.pubSearchNodeList(rootNode,{'identifier':'mc-defined-variable'});
    var options = [];
    if(variableList){
        for(var i=0;i<variableList.length;i++){
            var map = {};
            var name = this.lowCodeUtil.nodeUtil.pubGetNodeContent(variableList[i]);
            if(name){
                map[name]="自定义变量:"+name;
                options.push(map);
            }
        }
    }
    return options;
}

CodeRebuildConstant.prototype.searchAllVariableMap = function () {
    var options = this.lowCodeUtil.arrayUtil.copyArray(this.pageVueDataToAjaxValueOptions(null,'el-table','value'),this.functionParamsToOptions());
    this.lowCodeUtil.arrayUtil.copyArray(options,this.hrefParamsToOptions());
    this.lowCodeUtil.arrayUtil.copyArray(options,this.searchUserDefinedVariableOptions());
    var map = {};
    if(options){
        for(var i=0;i<options.length;i++){
            var item = options[i];
            for(var key in item){
                map[key]=item[key];
            }
        }
    }
    return map;
}
