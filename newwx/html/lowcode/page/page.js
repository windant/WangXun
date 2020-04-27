function Page(){
    this.iframeUi = null;
    this.pageId = commonUtil.getParameter("pageId");//从浏览器地址栏获取页面id
    this.api = null;
    this.projectId = null;
    this.tableUtil = new Table();
    this.lowCodeConstant = new LowCodeConstant();
    this.lowCodeUtil = new LowCodeUtil();
    this.rightCallback = null;
    this.rebuildConstant = null;
    this.pageAjax = new PageAjax();

}
Page.prototype.inject = function(api){
    this.api = api;
    //page/iframe-ui.js
    this.iframeUi=api.getIframeUi();
    this.rightCallback = new PageRightCallback(api);
    this.rebuildConstant = new PageRebuildConstant(api);
}
/*加载后要初始化一下vueMethod方法*/
Page.prototype.initVueMethods = function (api,pageHtml) {
    var _t = this;
    var util = {
        priSearch:function (methodMap, node) {
            var identifier = node.magicalCoder.identifier;
            var rightAttrConfigs = _t.tableUtil.pubFindFromRightPanel(identifier,{extendKey:"method"});
            var attributes = node.attributes;
            if(rightAttrConfigs.length>0){
                for(var n=0;n<rightAttrConfigs.length;n++){
                    var config = rightAttrConfigs[n];
                    var attrName = config.attrName;//@click
                    var methodValue = attributes[attrName];//magicalcoder1
                    if(_t.tableUtil.isMagicalDynamicStrMethodName(methodValue)){
                        var methodId = _t.tableUtil.numMethodId(methodValue);
                        if(methodId){
                            methodMap[methodId] = methodValue;
                            if(_t.isMcWindowOnloadMethod(identifier,config)){
                                _t.iframeUi.vueMountedMethodName=methodValue;
                            }
                        }
                    }
                }
            }
            var children = node.magicalCoder.children;
            if(children.length>0){
                for(var i=0;i<children.length;i++){
                    this.priSearch(methodMap,children[i]);
                }
            }
        }
    }
    var methodMap = {};
    var rootNode = api.htmlToRootNode(pageHtml);
    util.priSearch(methodMap,rootNode);
    var methodIds = [];
    for(var methodId in methodMap){
        methodIds.push(methodId);
    }
    if(methodIds.length>0){
        //注意magicaldrag的方法都是存储在数据库的 所以这里请自行获取您
        page.pageAjax.initPageDependOnMethods(methodIds,function (methodList) {
            for(var i=0;i<methodList.length;i++){
                var method = methodList[i];
                var id = method.id;
                var functionJs = method.functionJs ||'function(){}';
                var methods = api.getIframeUi().getMethods();
                methods[_t.tableUtil.strMethodName(id)]=functionJs;
            }
            api.refreshWorkspace();
        })
    }
}
Page.prototype.isMcWindowOnloadMethod = function(identifier,rightConfig){
    if(identifier == 'mc-window' && rightConfig.extendKey=='method' && rightConfig.attrName=='onload'){
        return true;
    }
    return false;
}
