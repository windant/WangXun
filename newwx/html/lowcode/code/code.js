/*做一个可视化编码工具*/
function Code() {
    //方法ID 为了初始化界面数据的
    this.pageParams = {api:null,rootNode:null,focusNode:null,iframeUi:null,extra:{attrName:null,attrValue:null,pageId:null},rightPanelItemObj:null}
    this.tableUtil = new Table();
    this.methodId = null;
    this.lowCodeConstant = new LowCodeConstant();
    this.lowCodeUtil = new LowCodeUtil();
    this.codeAjax = new CodeAjax();
}
Code.prototype.inject = function(api){
    this.api = api;
    this.constant = api.getConstant();
    this.tableId = commonUtil.getParameter("tableId");
    this.codeRightCallback = new CodeRightCallback(api,this.pageParams);
    this.codeRebuildConstant = new CodeRebuildConstant(api,this.pageParams);
    this.rightCallbackHrefUrl = new RightCallbackHrefUrl(api,this.pageParams);
    this.codeSyntaxCheck = new CodeSyntaxCheck(api);
}

/*构造基础信息数据*/
Code.prototype.buildBaseInfoHtml = function () {
    return "<div class='layui-row mc-method-base'><input class='layui-input mc-method-base-method-name' type='text' readonly placeholder='方法名称'/><input class='layui-input mc-method-base-method-description' type='text' readonly placeholder='方法描述'/></div>";
}
var CODE = new Code();
