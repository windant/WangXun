/*右侧属性变更 触发回调事件 页面跳转回调*/
function RightCallbackHrefUrl(api, pageParams) {
    this.api = api;
    this.pageParams = pageParams;
    this.tableUtil = new Table();//工具类
    this.constant = this.api.getConstant();
    this.codeUtil = new CodeUtil();
}
RightCallbackHrefUrl.prototype.change = function (rightObj) {
    var parentId = rightObj.focusNode.magicalCoder.parentId;
    var hrefNode = this.api.searchNodes(null,{id:parentId})[0];
    var children = hrefNode.magicalCoder.children;
    var pageUrl = rightObj.changeAttrValue;
    if(!pageUrl){
        return;
    }
    var arr = pageUrl.split("/");
    var pageId = arr[arr.length-1];
    //查找孩子
    for(var i=0;i<children.length;i++){
        var child = children[i];
        if(child.magicalCoder.identifier == 'mc-href-params'){
            this.priAjaxSetDynamicHtml(pageId,child,rightObj);
        }
    }
}
RightCallbackHrefUrl.prototype.priAjaxSetDynamicHtml = function(pageId,hrefParamsNode,rightObj){
    var _t = this;
    $.getJSON(commonUtil.ctx+"deployer/project/page/"+pageId,{time:new Date().getTime()},function (data) {
        if(data.flag){
            var entity = data.data;
            var pageHtml = entity.pageHtml;
            var pageRootNode = _t.pageParams.api.htmlToRootNode(pageHtml);//必须用父页面的api来转换 因为mc-window在page的constant.js
            var paramOptionList = _t.codeUtil.findPageHrefParamList(pageRootNode,false);
            var html = _t.priBuildParamsHtml(paramOptionList);
            var childrenNodes = _t.api.htmlToRootNode(html).magicalCoder.children;
            _t.api.resetChildren(hrefParamsNode.magicalCoder.id,childrenNodes);
        }else {
            layer.msg(data.desc);
        }
    })
}
RightCallbackHrefUrl.prototype.priBuildParamsHtml = function (paramOptionList) {
    var html = [];
    if(paramOptionList && paramOptionList.length>0){
        for(var i=0;i<paramOptionList.length;i++){
            var map = paramOptionList[i];
            for(var key in map){
                var paramName = map[key];
                var paramHtml = '<div class="layui-col-xs12 mc-href-param">' +
                    '<input class="layui-input mc-href-param-name" type="text" placeholder="参数名" value="'+paramName+'"/>' +
                    '<input class="layui-input mc-href-param-value" type="text" mc-is-variable placeholder="参数值" />' +
                    '</div>';
                html.push(paramHtml);
            }
        }
    }
    return html.join('');
}
