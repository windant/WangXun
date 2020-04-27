function PageRebuildConstant(api) {
    this.api = api;
    this.lowCodeConstant = new LowCodeConstant();
    this.lowCodeUtil = new LowCodeUtil();
    this.constant = api.getConstant();

}
PageRebuildConstant.prototype.pubReplace = function () {
    this.priReplaceRightConfig();
}


/**
 * 自动配置右侧属性
 * @param formTableConstructJson
 */
PageRebuildConstant.prototype.priReplaceRightConfig = function () {
    var rightPanel = this.api.getConstant().getRightPanel();
    for(var i=0;i<rightPanel.length;i++){
        var content = rightPanel[i].content;
        for(var identifier in content){
            var configs = content[identifier];
            for(var j=0;j<configs.length;j++){
                var config = configs[j];
                if(",el-table,el-form,".indexOf(identifier)!=-1){//多选
                    if(config.attrName == 'mc-form-data'){//这个是右侧有哪些表单 用于自动填充表单字段的 您可以忽略
                        this.priSetFormListOptions(config);
                    }
                }
            }
        }
    }
}
/*TODO ajax请求后台动态赋值 当前下拉有哪些数据 您的系统可以根据自己需要自行改造 这里也可以不用 */
PageRebuildConstant.prototype.priSetFormListOptions = function (config) {
    $.getJSON(commonUtil.ctx+"deployer/db/all_table_list/",{date:new Date().getTime()},function (data) {
        if(data.flag){
             var list = data.data;
             if(list){
                 var options = [];
                 for(var i=0;i<list.length;i++){
                     var item = list[i];
                     options.push(item);
                 }
                 config.options = options;
             }
        }else {
            layer.msg(data.desc);
        }
    })
}


PageRebuildConstant.prototype.pubReplaceFunction = function (focusNode) {
    this.scopeTemplate(focusNode);

}
PageRebuildConstant.prototype.scopeTemplate=function (focusNode) {
    var identifier = focusNode.magicalCoder.identifier;
    if(identifier == 'el-table-column' || identifier=='template' || identifier=='root'||identifier=='el-table'){
        return;
    }
    this.resetDefaultFunctionsParams(focusNode);
    var rootNode = this.api.getRootNode();
    var nodeMap = this.lowCodeUtil.nodeUtil.nodeToMap(rootNode);
    //检索处理column
    this.dealElTableColumn(nodeMap,focusNode);
}
//当控件在el-table-column中 它的作用就变了 应该是配置当前行的数据
PageRebuildConstant.prototype.dealElTableColumn = function(nodeMap,focusNode){
    var tmpNode = focusNode;
    var identifier = focusNode.magicalCoder.identifier;
    while(true){
        var parentId = tmpNode.magicalCoder.parentId;
        if(!parentId){
            break;
        }
        var parentNode = nodeMap[parentId];
        if(!parentNode || parentNode.magicalCoder.identifier == 'root'){
            break;
        }
        if(parentNode.magicalCoder.identifier == 'el-table-column'){
            //找到了父节点是表格的列 需继承scope.row.xxx
            switch (identifier) {
                case 'el-switch':
                    this.privateResetConfig(identifier,[{
                        compareAttrName:"@change",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"v-model",
                        setAttrName:"placeholder",
                        setValue:"采用scope.row.字段名",
                    }]);
                    break;
                case 'el-radio-group':
                    this.privateResetConfig(identifier,[{
                        compareAttrName:"@change",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"v-model",
                        setAttrName:"placeholder",
                        setValue:"采用scope.row.字段名",
                    }]);
                    break;
                case 'el-checkbox-group':
                    this.privateResetConfig(identifier,[{
                        compareAttrName:"@change",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"v-model",
                        setAttrName:"placeholder",
                        setValue:"采用scope.row.字段名",
                    }]);
                    break;
                case 'el-input':
                    this.privateResetConfig(identifier,[{
                        compareAttrName:"@blur",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"@focus",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"@change",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"@clear",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"v-model",
                        setAttrName:"placeholder",
                        setValue:"采用scope.row.字段名",
                    }]);
                    break;
                case 'el-select':
                    this.privateResetConfig(identifier,[{
                        compareAttrName:"@blur",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"@change",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"@clear",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"v-model",
                        setAttrName:"placeholder",
                        setValue:"采用scope.row.字段名",
                    }]);
                    break;
                case 'el-slider':
                    this.privateResetConfig(identifier,[{
                        compareAttrName:"@change",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"@input",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"v-model",
                        setAttrName:"placeholder",
                        setValue:"采用scope.row.字段名",
                    }]);
                    break;
                case 'el-date-picker':
                    this.privateResetConfig(identifier,[{
                        compareAttrName:"@change",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"@blur",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"@focus",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"v-model",
                        setAttrName:"placeholder",
                        setValue:"采用scope.row.字段名",
                    }]);
                    break;
                case 'el-rate':
                    this.privateResetConfig(identifier,[{
                        compareAttrName:"@change",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"v-model",
                        setAttrName:"placeholder",
                        setValue:"采用scope.row.字段名",
                    }]);
                    break;
                case 'el-color-picker':
                    this.privateResetConfig(identifier,[{
                        compareAttrName:"@change",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"@active-change",
                        setAttrName:"functionParams",
                        setValue:[{attrParamName:"scope.row",name:"scopeRow",title:"当前行数据"}],
                    },{
                        compareAttrName:"v-model",
                        setAttrName:"placeholder",
                        setValue:"采用scope.row.字段名",
                    }]);
                    break;
            }

            break;
        }
        tmpNode = parentNode;
    }
}
//这个是控件最初的原始方法配置 不放constant了 主要为了复原使用
PageRebuildConstant.prototype.resetDefaultFunctionsParams= function (focusNode) {
    var identifier = focusNode.magicalCoder.identifier;
    switch (identifier) {
        case 'el-switch':
            this.privateResetConfig(identifier,[{
                compareAttrName:"@change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"开关新值"}],
            },{
                compareAttrName:"v-model",
                setAttrName:"placeholder",
                setValue:"字段名",
            }]);
            break;
        case 'el-radio-group':
            this.privateResetConfig(identifier,[{
                compareAttrName:"@change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前选中的值"}],
            },{
                compareAttrName:"v-model",
                setAttrName:"placeholder",
                setValue:"字段名",
            }]);
            break;
        case 'el-checkbox-group':
            this.privateResetConfig(identifier,[{
                compareAttrName:"@change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前选中的值"}],
            },{
                compareAttrName:"v-model",
                setAttrName:"placeholder",
                setValue:"字段名",
            }]);
            break;
        case 'el-input':
            this.privateResetConfig(identifier,[{
                compareAttrName:"@blur",
                setAttrName:"functionParams",
                setValue:[{name:"e",title:"event"}],
            },{
                compareAttrName:"@focus",
                setAttrName:"functionParams",
                setValue:[{name:"e",title:"event"}],
            },{
                compareAttrName:"@change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前选中的值"}],
            },{
                compareAttrName:"@clear",
                setAttrName:"functionParams",
                setValue:[{name:"e",title:"event"}],
            },{
                compareAttrName:"v-model",
                setAttrName:"placeholder",
                setValue:"字段名",
            }]);
            break;
        case 'el-input-number':
            this.privateResetConfig(identifier,[{
                compareAttrName:"@blur",
                setAttrName:"functionParams",
                setValue:[{name:"e",title:"event"}],
            },{
                compareAttrName:"@focus",
                setAttrName:"functionParams",
                setValue:[{name:"e",title:"event"}],
            },{
                compareAttrName:"@change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._inputNumberValue,title:"当前的值"},{name:commonUtil.functionName._oldInputNumberValue,title:"旧的值"}],
            },{
                compareAttrName:"v-model",
                setAttrName:"placeholder",
                setValue:"字段名",
            }]);
            break;
        case 'el-select':
            this.privateResetConfig(identifier,[{
                compareAttrName:"@focus",
                setAttrName:"functionParams",
                setValue:[{name:"e",title:"event"}],
            },{
                compareAttrName:"@blur",
                setAttrName:"functionParams",
                setValue:[{name:"e",title:"event"}],
            },/*{
                compareAttrName:"@focus",
                setAttrName:"functionParams",
                setValue:[{name:"e",title:"event"}],
            },*/{
                compareAttrName:"@change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前选中的值"}],
            },{
                compareAttrName:"@clear",
                setAttrName:"functionParams",
                setValue:null,
            },{
                compareAttrName:"v-model",
                setAttrName:"placeholder",
                setValue:"字段名",
            },{
                compareAttrName:":remote-method",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._keywordValue,title:"查询关键词"}],
            }]);
            break;
        case 'el-slider':
            this.privateResetConfig(identifier,[{
                compareAttrName:"@change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前的值"}],
            },{
                compareAttrName:"@input",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前的值"}],
            },{
                compareAttrName:"v-model",
                setAttrName:"placeholder",
                setValue:"字段名",
            }]);
            break;
        case 'el-date-picker':
            this.privateResetConfig(identifier,[{
                compareAttrName:"@blur",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前实例"}],
            },{
                compareAttrName:"@focus",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前实例"}],
            },{
                compareAttrName:"@change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前的值"}],
            },{
                compareAttrName:"v-model",
                setAttrName:"placeholder",
                setValue:"字段名",
            }]);
            break;
        case 'el-rate':
            this.privateResetConfig(identifier,[{
                compareAttrName:"@change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"改变后的分值"}],
            },{
                compareAttrName:"v-model",
                setAttrName:"placeholder",
                setValue:"字段名",
            }]);
            break;
        case 'el-color-picker':
            this.privateResetConfig(identifier,[{
                compareAttrName:"@change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前值"}],
            },{
                compareAttrName:"@active-change",
                setAttrName:"functionParams",
                setValue:[{name:commonUtil.functionName._currentValue,title:"当前显示的颜色值"}],
            },{
                compareAttrName:"v-model",
                setAttrName:"placeholder",
                setValue:"字段名",
            }]);
            break;
    }

}

PageRebuildConstant.prototype.privateResetConfig = function (identifier,setConfigList) {
    var rightAttrs = this.constant.getRightConfig(identifier);
    if(rightAttrs && rightAttrs.length>0){
        for(var i=0;i<rightAttrs.length;i++){
            var attr = rightAttrs[i];
            for(var n=0;n<setConfigList.length;n++){
                var config = setConfigList[n];
                if(attr.attrName == config.compareAttrName){
                    attr[config.setAttrName] = config.setValue;
                }
            }
        }
    }
}
