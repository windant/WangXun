/*右侧属性变更 触发回调事件 如果您希望右侧属性是个从数据库获取的下拉，不同的下拉 动态改造布局器工作区的变化 可以参考*/
function PageRightCallback(api) {
    this.api = api;
    this.constant = this.api.getConstant();
    this.lowCodeConstant = new LowCodeConstant();
    this.lowCodeUtil = new LowCodeUtil();
}

/**
 * 自动改造表格的内容
 * @param obj
 */
PageRightCallback.prototype.changeTableByMcFormData = function (obj) {
    if(obj.changeAttrValue){
        var _t = this;
        var identifier = obj.focusNode.magicalCoder.identifier;
        if(identifier=='el-table'){
            $.getJSON(commonUtil.ctx+"deployer/db/table_info/construct/"+obj.changeAttrValue,
                {data:new Date().getTime()}
                ,function (data) {
                    if(data.flag){
                        if(data.data){
                            var tableFields = JSON.parse(data.data.formTableConstruct);
                            var html = _t.tableHtml(tableFields);
                            var childrenNodes = _t.api.htmlToRootNode(html).magicalCoder.children;
                            _t.api.resetChildren(obj.focusNode.magicalCoder.id,childrenNodes);
                        }
                    }
                })
        }else if(identifier=='el-form'){//自动填充表单html
            $.getJSON(commonUtil.ctx+"deployer/db/table_info/form_data/"+obj.changeAttrValue,
                {data:new Date().getTime()}
                ,function (data) {
                    if(data.flag){
                        if(data.data){
                            var childrenNodes = _t.api.htmlToRootNode(data.data.formHtml).magicalCoder.children;
                            var newChildren = [];
                            if(childrenNodes){
                                for(var i=0;i<childrenNodes.length;i++){
                                    var child = childrenNodes[i];
                                    if(child.magicalCoder.identifier=='el-form'){
                                        _t.lowCodeUtil.arrayUtil.copyArray(newChildren,child.magicalCoder.children);
                                    }
                                }
                            }
                            var submitNodes = _t.api.htmlToRootNode(_t.formOperateHtml()).magicalCoder.children;
                            _t.lowCodeUtil.arrayUtil.copyArray(newChildren,submitNodes);
                            _t.api.resetChildren(obj.focusNode.magicalCoder.id,newChildren);
                        }
                    }
                })
        }
    }
}

PageRightCallback.prototype.tableHtml = function (tableFields,updateMethod,deleteMethod) {
    var html =[];
    if(tableFields){
        for(var i=0;i<tableFields.length;i++){
            var field = tableFields[i];
            if(field.identifier!='el-upload'){
                if(field.dbType=='bool'){
                    html.push('<el-table-column label="'+field.comment+'"><template slot-scope="scope"><el-switch v-model="scope.row.'+field.name+'" disabled></el-switch></template></el-table-column>');
                }else {
                    html.push('<el-table-column prop="'+field.name+'" label="'+field.comment+'"></el-table-column>');
                }
            }
        }
    }
    var oprateHtml = '<el-table-column label="操作" fixed="right" width="200px">' +
        '<template slot-scope="scope">' +
        '<el-button mc-type="column-el-button" size="mini" type="primary" '+(updateMethod||'')+'>编辑</el-button>' +
        '<el-button mc-type="column-el-button" size="mini" type="danger" '+(deleteMethod||'')+'>删除</el-button>' +
        '</template>' +
        '</el-table-column>';
    html.push(oprateHtml);
    return html.join('');
}

PageRightCallback.prototype.formOperateHtml = function () {
    return '<el-form-item><el-button>提交</el-button></el-form-item>';
}
