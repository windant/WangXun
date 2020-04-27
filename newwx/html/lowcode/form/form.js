/**
 * 表单处理
 * @constructor
 */
function Form() {
    /*当前编辑的表id*/
    this.tableId = null;
    /*隶属于哪个项目*/
    this.databaseId = null;
    this.table = new Table();
    $("#returnToMyTableList").attr("href","../lowcode/table/list.html?databaseId="+commonUtil.getParameter("databaseId"));
    this.lowCodeConstant = new LowCodeConstant();
    this.lowCodeUtil = new LowCodeUtil();
    this.dbType = this.lowCodeConstant.dbType;
}
Form.prototype.inject = function (api) {
    this.api = api;
    this.tableId = commonUtil.getParameter("tableId");
}

Form.prototype.getDefaultFormHtml = function(){
    var constant = this.api.getConstant();
    var components = constant.components;
    for(var i=0;i<components.length;i++){
        var item = components[i];
        var children = item.children;
        if(children){
            for(var j=0;j<children.length;j++){
                var identifier = children[j].identifier;
                if(identifier == 'formHtml'){
                    return children[j].html;
                }
            }
        }
    }
}
/**
 * 解析formHtml的字段 转换成字段名 字段值
 * @param formHtml
 */
Form.prototype.pubFormHtmlToTableFields = function (rootNode) {
    var allFormItems = this.priSearchFormItems(rootNode);
    var fields = [{name: "id", comment: "唯一主键",dbType:this.dbType.STR,identifier:"el-input"}];
    var identifierDbTypeMap = this.priGetIdentifierDbTypeMap();
    for(var i=0;i<allFormItems.length;i++) {
        var formItem = allFormItems[i];
        var comment = formItem.attributes['label'];
        var name = "";
        var dbType = this.dbType.STR;
        var children = formItem.magicalCoder.children;
        var extra = {};
        var identifier="";
        if (children.length > 0) {
            var node = children[0];
            identifier = node.magicalCoder.identifier;
            var defaultDbType = identifierDbTypeMap[identifier];
            if (defaultDbType===null || defaultDbType) {//null代表el-input 存在默认类型
                if(identifier == 'el-upload'){//这个比较特殊 文件上传组件
                    name = node.attributes[':file-list'];
                }else {//其他基础组件
                    name = node.attributes['v-model'];
                }
                if(!name){
                    layer.alert("错误提示：请为【"+comment+"】右侧的控件取一个唯一的【字段名称】作为后续表的字段名");
                    this.api.focus([node.magicalCoder.id]);
                    return null;
                }
                if(name=='id' || name=='ID'){
                    layer.alert("错误提示：【"+comment+"】右侧的变量名请不要使用保留的id或者ID");
                    this.api.focus([node.magicalCoder.id]);
                    return null;
                }
                if(node.attributes['mc-db-type-v-model']){
                    dbType = node.attributes['mc-db-type-v-model']
                }else {
                    dbType = defaultDbType||dbType;
                }

                if(identifier=='el-date-picker'){//日期格式数据
                    var format = node.attributes['format'];
                    if(format){
                        extra.format = format;//日期格式 存储 方便后端做返回数据处理
                    }
                }

            }
        }
        if (name) {
            fields.push({"name": name, "comment": comment,"dbType":dbType,extra:extra,identifier:identifier});//完成一个字段的搜集
        }
    }
    return fields;
}


Form.prototype.priGetIdentifierDbTypeMap = function () {
    var _t = this;
    var identifierDbTypeMap = {
        "el-input":null,//类型不定由mc-db-type-xxx来定

        "el-select":_t.dbType.STR,
        "el-radio-group":_t.dbType.STR,
        "el-checkbox-group":_t.dbType.STR,
        "el-date-picker":_t.dbType.STR,
        "el-upload":_t.dbType.STR,
        "el-color-picker":_t.dbType.STR,

        "el-switch":_t.dbType.BOOL,
        "el-slider":_t.dbType.INT,
        "el-rate":_t.dbType.INT,
        "el-input-number":_t.dbType.INT,

        "el-date-picker":_t.dbType.DATE,
        "el-checkbox-group":_t.dbType.ARRAY,
        "el-upload":_t.dbType.ARRAY
        ,
    }
    return identifierDbTypeMap;
}

//查找有哪些表单条目 每一个表单条目就是一个表字段
Form.prototype.priSearchFormItems = function(rootNode){
    var allFormItems = [];
    var forms = this.lowCodeUtil.nodeUtil.pubSearchNodeList(rootNode,{tagName:'el-form'});
    for(var i=0;i<forms.length;i++){
        var formItems = this.lowCodeUtil.nodeUtil.pubSearchNodeList(rootNode,{tagName:'el-form-item'});
        for(var j=0;j<formItems.length;j++){
            allFormItems.push(formItems[j]);
        }
    }
    return allFormItems;
}
