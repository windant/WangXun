function CodeUtil() {
    this.lowCodeConstant = new LowCodeConstant();
    this.lowCodeUtil = new LowCodeUtil();
}
/**
 * 找出入参
 * @param pageRootNode
 * @param withPrefixName bool
 * @returns {Array} [{"commonUtil.getParameter...":"入参名"}]
 */
CodeUtil.prototype.findPageHrefParamList = function (pageRootNode,withPrefixName) {
    var options = [];
    var mcWindowNode = this.lowCodeUtil.nodeUtil.pubSearchFirstNode(pageRootNode,{identifier:"mc-window"});
    if(mcWindowNode){
        var params = mcWindowNode.attributes['params'];
        if(params){
            var paramList = JSON.parse(this.lowCodeUtil.xssUtil.unEscapeXss(params))
            if(paramList!=null && paramList.length>0){
                for(var i=0;i<paramList.length;i++){
                    var param = paramList[i];
                    var map = {};
                    var key = "commonUtil.getParameter('"+param.name+"')";
                    var realName = withPrefixName?"地址参数:"+param.name:param.name;
                    map[key]=realName;
                    options.push(map)
                }
            }
        }
    }
    return options;
}
