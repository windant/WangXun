/*布局器回调重写*/
var formIndex = new Form();
var isNewForm = false;//新增的还没配置过字段
/*初始化完成操作*/
MagicalCallback.prototype.after_start = function (api) {
    formIndex.inject(api);
    if(formIndex.tableId){
        $.getJSON(commonUtil.ctx+"deployer/db/table_info/form/"+formIndex.tableId,{},function (data) {
            if(data.flag){
                var item = data.data;
                formIndex.databaseId = item.databaseId;
                if(!item.formHtml || item.formHtml==''){
                    item.formHtml = formIndex.getDefaultFormHtml();
                    isNewForm = true;
                }
                if(item.formJs){
                    api.insert(item.formHtml,item.formJs)
                }else {
                    api.insertHtml(item.formHtml)
                }
            }else {
                layer.msg(data.desc);
            }
        })
    }
}

/*保存按钮*/
MagicalCallback.prototype.save_html = function (html,rootNode,javascript) {
    //把结构转成数据库表字段类型
    var formTableConstruct = formIndex.pubFormHtmlToTableFields(rootNode);
    console.log(JSON.stringify(formTableConstruct));
    if(formIndex.tableId){
        if(formTableConstruct==null){
            return;
        }
        $.post(commonUtil.ctx+"deployer/db/table_save",{id:formIndex.tableId,formHtml:html,formJs:javascript,formTableConstruct:JSON.stringify(formTableConstruct)},function (data) {
            if(data.flag){
                $.get(commonUtil.ctx+"deployer/project/project_list",{},function (projectData) {
                    if(projectData.flag){
                        var projectList = projectData.data;
                        //
                        var options = [];
                        if(projectList.length>0){
                            for(var i=0;i<projectList.length;i++){
                                var project = projectList[i];
                                options.push('<option value="'+project.id+'">'+project.projectName+'</option>');
                            }
                        }
                        var projectHtml = '<div class="layui-row layui-form" style="padding: 20px;"><div class="layui-col-xs12">表单保存成功!</div><div class="layui-col-xs12" style="margin-top: 10px;margin-bottom: 10px;">是否继续生成此表单的增删改查功能到以下项目?</div><div class="layui-col-xs12"><select id="magicalCoderAutoCodeProject" lay-search>'+options.join('')+'</select></div></div>';
                        var table = data.data;
                        layer.open({
                            type:1,
                            content:projectHtml,
                            area:["500px","300px"],
                            btn: ['确定', '取消'],
                            yes: function(index, layero){
                                var projectId = $("#magicalCoderAutoCodeProject").val();
                                if(!projectId){
                                    layer.confirm("您还未新建任何项目,生成的页面必须放在项目中,是否为您跳转到新建项目页面？",function (idx) {
                                        window.location.href="../lowcode/project/add.html";
                                        // layer.close(idx);
                                    })
                                    return;
                                }
                                var loading = layer.load(0, {
                                    shade: false,
                                    time: 2*1000
                                });
                                var idMap = {databaseId:formIndex.databaseId,projectId:projectId,tableId:table.id,tableName:table.tableName,insertApiId:null,deleteApiId:null,deleteApiId:null,findListApiId:null,findOneApiId:null};
                                var magicalCoderAi = new MagicalCoderAi(rootNode);
                                magicalCoderAi.autoCreate(formTableConstruct,idMap,function (apiIdMap) {
                                    // alert("接口自动生成完毕")
                                    magicalCoderAi.savePage(html,formTableConstruct,apiIdMap,idMap,function () {
                                        layer.close(loading);
                                        layer.close(index);
                                    });
                                });//自动生成
                            }
                        })
                        form.render();
                        // window.location.href = "../lowcode/table/list.html?databaseId="+formIndex.databaseId;




                    }else {
                        layer.msg(projectData.desc);
                    }
                })
            }else {
                layer.msg(data.desc);
            }
        })
    }
}

MagicalCallback.prototype.before_change_attr_callback = function (obj) {
    var changeAttrName = obj.changeAttrName;
    var changeAttrValue = obj.changeAttrValue;
    if(obj.itemObj.validate){
        var map = formIndex.lowCodeUtil.mapUtil.coverToKeyValue(obj.itemObj.validate);
        if(map.key == commonUtil.regRules.formFieldReg){
            if((",id"+formIndex.lowCodeConstant.jsKeepName).indexOf(","+changeAttrValue+",")!=-1){//不允许取id
                layer.msg(changeAttrValue+"是保留关键字,请换个名字吧");
                return false;
            }
        }
    }
    return true;
}
MagicalCallback.prototype.after_change_attr_callback = function (obj) {
    var identifier = obj.focusNode.magicalCoder.identifier;
    var changeAttrName = obj.changeAttrName;
    var changeAttrValue = obj.changeAttrValue;
    if(identifier == 'el-upload'){//上传
        if(obj.changeAttrName == ':file-list'){//修改:file-list 同步修改ref值
            obj.focusNode.attributes['ref']=obj.changeAttrValue;
        }
    }else if(identifier =='el-date-picker'){
        if(changeAttrName == 'type'){
            switch (changeAttrValue) {
                case 'year':
                    obj.focusNode.attributes['format']='yyyy';
                    break;
                case 'month':
                    obj.focusNode.attributes['format']='yyyy-MM';
                    break;
                case 'date':
                    obj.focusNode.attributes['format']='yyyy-MM-dd';
                    break;
                case 'datetime':
                    obj.focusNode.attributes['format']='yyyy-MM-dd HH:mm:ss';
                    break;
            }
            page.api.refreshWorkspace();

        }
    }
}
