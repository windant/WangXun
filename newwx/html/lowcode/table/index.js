/*通用工具解析类*/
function Table() {
    this.api = new MagicalApi();
    this.methodPrefix = "magicalcoder";
    this.methodReg = new RegExp("^"+this.methodPrefix+"(\\d*)(\\(?(.*)\\)?)");
    this.methodNameReg = new RegExp("^"+this.methodPrefix+"\\d*");

}
/*把数据库字段变成下拉*/
Table.prototype.dbFieldSelectConfig = function (tableFields) {
    var options = [];
    for(var i = 0;i<tableFields.length;i++){
        var field = tableFields[i];
        var map = {}
        map[field.name] = field.comment;
        options.push(map);
    }
    var config = {type:"select",clearAttr:true,oneLine:true,change:"attr",title:'绑定数据库字段名',attrName:'v-model' ,options:options};
    return config;
}
/*在常量右侧属性栏数据查找满足条件的数据*/
Table.prototype.pubFindFromRightPanel = function (identifier,queryMap) {
    var configs = [];
    var rightPane = this.api.getConstant().rightPanel;
    for(var i=0;i<rightPane.length;i++){
        var tab = rightPane[i];
        var list = tab.content[identifier];
        if(list){
            for(var j=0;j<list.length;j++){
                if(this.matchQueryMap(list[j],queryMap)){
                    configs.push(list[j]);
                }
            }
        }
    }
    return configs;
}
Table.prototype.matchQueryMap = function(item,queryMap){
    if(queryMap==null){
        return true;
    }
    var find = true;
    for(var key in queryMap){
        if(item[key] != queryMap[key]){
            find = false;
            break;
        }
    }
    return find;
}
//数字型 方法id
Table.prototype.numMethodId = function (methodAttrValue) {
    if(this.methodReg.test(methodAttrValue)) {
        this.methodReg.exec(methodAttrValue);
        var methodId = RegExp.$1;//数字id
        return methodId;
    }
    return '';
}
//字符串型 方法id
Table.prototype.strMethodName = function (methodId) {
    var methodName = this.methodPrefix+methodId;
    return methodName;
}
Table.prototype.isMagicalDynamicStrMethodName = function (methodValue) {
    return this.methodReg.test(methodValue);
}
Table.prototype.replaceMethodNameArea = function(originMethodValue,methodId){
    return originMethodValue.replace(this.methodNameReg,this.strMethodName(methodId));
}
//找到方法内部的参数
Table.prototype.findMethodParams = function (originMethodValue) {
    var params = [];
    if(this.methodReg.test(originMethodValue)) {
        this.methodReg.exec(originMethodValue);
        var methodParamStr = RegExp.$2;//参数
        if(methodParamStr){
            methodParamStr=methodParamStr.replace('(','').replace(')','');
            if(methodParamStr.trim()==""){
                return [];
            }
            return methodParamStr.split(/[,，]/);//逗号分隔
        }
    }
    return params;
}
