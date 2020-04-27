/*自动化通用方法*/

function MagicalCoderAi(tableNode) {
    this.api = new MagicalApi();
    this.apiRebuildConstant = new ApiRebuildConstant(this.api);
    this.description = "系统自动生成,如果您不想下次生成时覆盖，请把名称中“-系统生成”删除";
    this.userTableApi = new UserTableApi();
    this.pageRightCallback = new PageRightCallback(this.api);
    this.tableNode = tableNode;
    this.lowCodeConstant = new LowCodeConstant();
    this.lowCodeUtil = new LowCodeUtil();
}

MagicalCoderAi.prototype.autoCreate = function(formTableConstruct,idMap,callback){
    this.apiRebuildConstant.setTableFields(formTableConstruct);
    this.saveApi(idMap,callback);
}

MagicalCoderAi.prototype.buildApi = function(api,html,idMap){
    var rootNode = this.api.htmlToRootNode(html);
    var mongoDocumentJson = this.userTableApi.parseHtmlNodeToMongoData(rootNode);
    api.apiHtml = html;
    api.mongoDocumentJson = JSON.stringify(mongoDocumentJson);
    api.apiDescription = this.description;
    api.tableId=idMap.tableId;
    api.requestPrimary=-1;
    return api;
}
MagicalCoderAi.prototype.identifier = function(idMap){//加上tableId就可以跨库 同表也支持生成
    return idMap.tableName+"-"+idMap.tableId;
}
MagicalCoderAi.prototype.saveApi = function (idMap,callback) {
    var request = {insert:null,update:null,"delete":null,fineOne:null,findList:null};
    request.insert=this.buildApi({apiName:"新增"+this.identifier(idMap)+"-系统生成",},this.apiRebuildConstant.crud().insertHtml(),idMap);
    request.update=this.buildApi({apiName:"修改"+this.identifier(idMap)+"-系统生成",},this.apiRebuildConstant.crud().updateHtml(),idMap);
    request["delete"]=this.buildApi({apiName:"删除"+this.identifier(idMap)+"-系统生成",},this.apiRebuildConstant.crud().deleteHtml(),idMap);
    request.fineOne=this.buildApi({apiName:"查询单条"+this.identifier(idMap)+"-系统生成",},this.apiRebuildConstant.crud().findEntityHtml(),idMap);
    request.findList=this.buildApi({apiName:"查询多条"+this.identifier(idMap)+"-系统生成",},this.apiRebuildConstant.crud().findListHtml(),idMap);

    $.post(commonUtil.ctx+"deployer/ai/sys_auto_api_save",{json:JSON.stringify(request)},function (data) {
        if(data.flag){
            if(callback){
                var apiIdMap = data.data;
                callback(apiIdMap);
            }
        }else {
            layer.msg(data.desc);
        }
    })
}
//保存页面 这个比较麻烦 因为跟api交叉保存了一次
MagicalCoderAi.prototype.savePage = function (formHtml,formTableConstruct,apiIdMap,idMap,saveSuccessCallback) {
    var request = {
        editPage:{projectId:idMap.projectId,pageName:"编辑"+this.identifier(idMap)+"-系统生成",requestPrimary:-1},
        listPage:{projectId:idMap.projectId,pageName:"列表"+this.identifier(idMap)+"-系统生成",requestPrimary:-1},
    }
    var _t =this;
    $.post(commonUtil.ctx+"deployer/ai/sys_auto_page_save",{json:JSON.stringify(request)},function (pageData) {
        if(pageData.flag){
            var pageIdMap = pageData.data;
            var pageEditMethodObj = _t.pageEditMethodObj(formTableConstruct,apiIdMap,pageIdMap);//页面方法
            var pageListMethodObj = _t.pageListMethodObj(formTableConstruct,apiIdMap,pageIdMap);
            var methodRequest = {
                editInit:{pageId:pageIdMap.editPageId,methodName:"初始化"+_t.identifier(idMap)+"-系统生成",methodHtml:pageEditMethodObj.winInitHtml,functionJs:pageEditMethodObj.winInitJs},
                editSave:{pageId:pageIdMap.editPageId,methodName:"保存"+_t.identifier(idMap)+"-系统生成",methodHtml:pageEditMethodObj.saveMethodHtml,functionJs:pageEditMethodObj.saveMethodJs},
                listSubmitQuery:{pageId:pageIdMap.listPageId,methodName:"提交查询"+_t.identifier(idMap)+"-系统生成",methodHtml:pageListMethodObj.submitQueryMethodHtml,functionJs:pageListMethodObj.submitQueryMethodJs},
                listPagingQuery:{pageId:pageIdMap.listPageId,methodName:"分页查询"+_t.identifier(idMap)+"-系统生成",methodHtml:pageListMethodObj.pagingQueryMethodHtml,functionJs:pageListMethodObj.pagingQueryMethodJs},
                listInsert:     {pageId:pageIdMap.listPageId,methodName:"新增"+_t.identifier(idMap)+"-系统生成",methodHtml:pageListMethodObj.insertMethodHtml,functionJs:pageListMethodObj.insertMethodJs},
                listUpdate:     {pageId:pageIdMap.listPageId,methodName:"编辑"+_t.identifier(idMap)+"-系统生成",methodHtml:pageListMethodObj.updateMethodHtml,functionJs:pageListMethodObj.updateMethodJs},
                listDelete:     {pageId:pageIdMap.listPageId,methodName:"删除"+_t.identifier(idMap)+"-系统生成",methodHtml:pageListMethodObj.deleteMethodHtml,functionJs:pageListMethodObj.deleteMethodJs}
            }
            $.post(commonUtil.ctx+"deployer/ai/sys_auto_method_save",{json:JSON.stringify(methodRequest)},function (methodData) {//保存方法
                if(methodData.flag){
                    var methodIdMap = methodData.data;//{editInitId:null,editSaveId:null,listSubmitQueryId:null,ListPagingQueryId:null,ListInsertId:null}
                    //保存页面
                    var pageEditObj = _t.buildPageEditObj(formHtml,formTableConstruct,methodIdMap,methodRequest);
                    var listPageObj = _t.buildPageListObj(formHtml,formTableConstruct,methodIdMap,methodRequest);
                    request = {
                        editPage:{projectId:idMap.projectId,pageName:"编辑"+_t.identifier(idMap)+"-系统生成",requestPrimary:-1,pageHtml:pageEditObj.pageHtml,pageJs:pageEditObj.pageJs},
                        listPage:{projectId:idMap.projectId,pageName:"列表"+_t.identifier(idMap)+"-系统生成",requestPrimary:-1,pageHtml:listPageObj.pageHtml,pageJs:listPageObj.pageJs},
                    }
                    $.post(commonUtil.ctx+"deployer/ai/sys_auto_page_save",{json:JSON.stringify(request)},function (page2Data) {
                        if(page2Data.flag){
                            layer.confirm("生成成功",{btn:['打开生成页面','返回我的表','取消']},function (idx) {
                                commonUtil.openUrl(commonUtil.ctx+'web/page/'+pageIdMap.listPageId,"_blank");
                                layer.close(idx);
                            },function (idx) {
                                window.location.href=commonUtil.ctx+"../lowcode/table/list.html?databaseId="+idMap.databaseId;
                            })
                            if(saveSuccessCallback){
                                saveSuccessCallback();
                            }
                        }else {
                            layer.msg(methodData.desc);
                        }
                    })
                }else {
                    layer.msg(methodData.desc);
                }
            })

        }else {
            layer.msg(pageData.desc);
        }
    })

}
//构建列表页
MagicalCoderAi.prototype.buildPageListObj = function (formHtml,tableFields,methodIdMap,methodRequest)
{
    var formQueryHtml = this.formQueryHtml(formHtml,methodIdMap.listSubmitQueryId,true);
    var tableColumnHtml = this.pageRightCallback.tableHtml(tableFields,'@click.native.prevent="magicalcoder'+methodIdMap.listUpdateId+'(scope.row)"','@click.native.prevent="magicalcoder'+methodIdMap.listDeleteId+'(scope.row)"');
    var pageListHtml =
        "<el-row>" +
        "<el-col :xs='24'><el-card header='查询条件'>"+formQueryHtml+"</el-card></el-col>" +
        "<el-col :xs='24' style='margin-top: 6px; margin-bottom: 6px;'><el-button type='primary' @click='magicalcoder"+(methodIdMap.listInsertId)+"'>新增</el-button></el-col>" +
        "<el-col :xs='24'>" +
        "<el-card>" +
        "<el-table :data='tableList' :fit='true' :show-header='true'>" +
        tableColumnHtml+
        "</el-table>" +
        "<el-pagination style='margin-left: -5px;' layout='prev,pager,next' :total='pageTotal' :current-page.sync='currentPage' :page-size='20' :pager-count='5' @current-change='magicalcoder"+methodIdMap.listPagingQueryId+"' @prev-click='magicalcoder"+methodIdMap.listPagingQueryId+"' @next-click='magicalcoder"+methodIdMap.listPagingQueryId+"'>" +
        "</el-card>" +
        "</el-col>" +
        "</el-row>";
    var pageHtml= '<div class="mc-window"  onload="magicalcoder'+methodIdMap.listSubmitQueryId+'">'+pageListHtml+'</div>';

    var defaultValueMap = {"str":"''","int":"0","array":"[]","bool":"false","date":"''"}
    var pageJs = commonUtil.laytpl('//ajax库采用axios\n' +
        'var _vueThis = null;\n' +
        '//调试:打开浏览器控制台(F12),在代码中某行增加 debugger 即可调试\n' +
        'var vueData = {' +
        '       {{#  layui.each(d.tableFields, function(index, item){ }}' +
        '           "{{item.name}}": {{d.defaultValueMap[item.dbType] }},' +
        '       {{#  }); }} ' +
        '    "tableList": [{}],"pageTotal": 100,"currentPage": 1\n' +
        '};\n' +
        '//注意:vueDate布局器系统变量,请勿更改 此行以上代码不要更改或删除//\n' +
        'var vueMethod = {\n' +
        '    focus: function (e) {\n' +
        '        try {\n' +
        '            _t.fastKey.focusElem(e);\n' +
        '        }catch(e) {}},\n' +
        '    _fileUploadSuccess: function (res, file, fileList) {\n' +
        '        if (res.flag) {}},\n' +
        '    magicalcoder{{d.methodIdMap.listSubmitQueryId}}: {{d.methodRequest.listSubmitQuery.functionJs}},\n' +
        '    magicalcoder{{d.methodIdMap.listPagingQueryId}}: {{d.methodRequest.listPagingQuery.functionJs}}, \n' +
        '    magicalcoder{{d.methodIdMap.listInsertId}}: {{d.methodRequest.listInsert.functionJs}}, \n' +
        '    magicalcoder{{d.methodIdMap.listUpdateId}}: {{d.methodRequest.listUpdate.functionJs}}, \n' +
        '    magicalcoder{{d.methodIdMap.listDeleteId}}: {{d.methodRequest.listDelete.functionJs}} \n' +
        '};\n' +
        '//注意:vueMethod布局器自动维护的系统方法,请勿更改 此行以上代码不要更改或删除//\n' +
        'var vueMounted = function() {if (vueMethod.magicalcoder{{d.methodIdMap.listSubmitQueryId}}) {vueMethod.magicalcoder{{d.methodIdMap.listSubmitQueryId}}()} };\n' +
        '//注意:vueMounted布局器自动维护的页面加载后执行的方法,请勿更改 此行以上代码不要更改或删除//\n' +
        'var myMethod = {}\n' +
        'for (var key in myMethod) {\n' +
        '    vueMethod[key] = myMethod[key];\n' +
        '}\n' +
        '/*您自定义的变量,可以在此处覆盖vueData提供的变量 参照element ui文档*/\n' +
        'var myData = {}\n' +
        '/*把您定义的数据覆盖布局器自动识别的变量,考虑到兼容性，请下载查看head中重写的assign方法*/\n' +
        'Object.assign(vueData, myData);\n' +
        'var _t = this;\n' +
        'var Ctor = Vue.extend({\n' +
        '    //提前绑定的变量\n' +
        '    data: function() {\n' +
        '        return vueData;\n' +
        '    },\n' +
        '    created: function() {\n' +
        '        _vueThis = this;\n' +
        '    },\n' +
        '    //页面加载完 会执行方法 可以做一些初始化操作\n' +
        '    mounted: vueMounted,\n' +
        '    /*当前页面绑定的方法集合 与布局器节点一一映射即可 参照element ui文档*/\n' +
        '    methods: vueMethod\n' +
        '});\n' +
        'new Ctor().$mount(\'#magicalDragScene\');',{tableFields:tableFields,methodRequest:methodRequest,methodIdMap:methodIdMap,defaultValueMap:defaultValueMap});
    return {pageHtml:pageHtml,pageJs:pageJs};
}
//构建编辑页
MagicalCoderAi.prototype.buildPageEditObj = function (formHtml,tableFields,methodIdMap,methodRequest) {
    var formQueryHtml = this.formQueryHtml(formHtml,methodIdMap.editSaveId,false)
    var pageHtml = '<div class="mc-window" params="[{&quot;name&quot;:&quot;id&quot;,&quot;value&quot;:&quot;&quot;}]" onload="magicalcoder'+methodIdMap.editInitId+'">'+formQueryHtml+'</div>';
    var defaultValueMap = {"str":"''","int":"0","array":"[]","bool":"false","date":"''"}
    var pageJs = commonUtil.laytpl('//ajax库采用axios\n' +
        'var _vueThis = null;\n' +
        '//调试:打开浏览器控制台(F12),在代码中某行增加 debugger 即可调试\n' +
        'var vueData = {' +
        '       {{#  layui.each(d.tableFields, function(index, item){ }}' +
        '           "{{item.name}}": {{d.defaultValueMap[item.dbType] }},' +
        '       {{#  }); }} ' +
        '};\n' +
        '//注意:vueDate布局器系统变量,请勿更改 此行以上代码不要更改或删除//\n' +
        'var vueMethod = {\n' +
        '    focus: function (e) {\n' +
        '        try {\n' +
        '            _t.fastKey.focusElem(e);\n' +
        '        }catch(e) {}},\n' +
        '    _fileUploadSuccess: function (res, file, fileList) {\n' +
        '        if (res.flag) {}},\n' +
        '    magicalcoder{{d.methodIdMap.editInitId}}: {{d.methodRequest.editInit.functionJs}},\n' +
        '    magicalcoder{{d.methodIdMap.editSaveId}}: {{d.methodRequest.editSave.functionJs}} \n' +
        '};\n' +
        '//注意:vueMethod布局器自动维护的系统方法,请勿更改 此行以上代码不要更改或删除//\n' +
        'var vueMounted = function() {if (vueMethod.magicalcoder{{d.methodIdMap.editInitId}}) {vueMethod.magicalcoder{{d.methodIdMap.editInitId}}()} };\n' +
        '//注意:vueMounted布局器自动维护的页面加载后执行的方法,请勿更改 此行以上代码不要更改或删除//\n' +
        'var myMethod = {}\n' +
        'for (var key in myMethod) {\n' +
        '    vueMethod[key] = myMethod[key];\n' +
        '}\n' +
        '/*您自定义的变量,可以在此处覆盖vueData提供的变量 参照element ui文档*/\n' +
        'var myData = {}\n' +
        '/*把您定义的数据覆盖布局器自动识别的变量,考虑到兼容性，请下载查看head中重写的assign方法*/\n' +
        'Object.assign(vueData, myData);\n' +
        'var _t = this;\n' +
        'var Ctor = Vue.extend({\n' +
        '    //提前绑定的变量\n' +
        '    data: function() {\n' +
        '        return vueData;\n' +
        '    },\n' +
        '    created: function() {\n' +
        '        _vueThis = this;\n' +
        '    },\n' +
        '    //页面加载完 会执行方法 可以做一些初始化操作\n' +
        '    mounted: vueMounted,\n' +
        '    /*当前页面绑定的方法集合 与布局器节点一一映射即可 参照element ui文档*/\n' +
        '    methods: vueMethod\n' +
        '});\n' +
        'new Ctor().$mount(\'#magicalDragScene\');',{tableFields:tableFields,methodRequest:methodRequest,methodIdMap:methodIdMap,defaultValueMap:defaultValueMap});
    return {pageHtml:pageHtml,pageJs:pageJs};
}
MagicalCoderAi.prototype.formQueryHtml = function(formHtml,submitMethodId,isListQueryArea){
    var rootNode = this.api.htmlToRootNode(formHtml);
    var formNode = rootNode.magicalCoder.children[0];
    var formItems = this.lowCodeUtil.nodeUtil.pubSearchNodeList(formNode,{identifier:"el-form-item"});
    if(isListQueryArea){//列表页
        for(var i=0;i<formItems.length;i++){
            var formItemNode = formItems[i];
            var fieldNode = formItemNode.magicalCoder.children[0];
            var identifier = fieldNode.magicalCoder.identifier;
            if(identifier=='el-checkbox-group' || identifier=='el-upload'|| identifier=='el-switch'){//暂时不支持这2种
                formItems.splice(i,1);
                i--;
            }
        }
        var rowHtml = ['<el-form label-width="100px" :inline="false"><el-form-item label="ID"><el-input placeholder="唯一主键" v-model="id"></el-input></el-form-item>']
        for(var i=0;i<formItems.length;i=i+2){
            var row = ['<el-row>']
            row.push('<el-col :xs="24" :md="12">');
            var formItemLeftNode = formItems[i];
            row.push(this.api.nodesToHtml([formItemLeftNode],false));
            row.push('</el-col>');
            if(i+1<formItems.length){
                row.push('<el-col :xs="24" :md="12">');
                var formItemRightNode = formItems[i+1];
                row.push(this.api.nodesToHtml([formItemRightNode],false));
                row.push('</el-col>');
            }
            row.push('</el-row>');
            rowHtml.push(row.join(''));
        }
        rowHtml.push('<el-form-item><el-button @click="magicalcoder'+(submitMethodId||'')+'">提交</el-button></el-form-item>');
        rowHtml.push('</el-form>');
        return rowHtml.join('\n')
    }else {
        var formChildren = formNode.magicalCoder.children;
        this.api.appendHtml(formNode,'<el-form-item label="ID" v-if="false"><el-input placeholder="唯一主键" v-model="id" ></el-input></el-form-item>',null);
        this.api.appendHtml(formNode,'<el-form-item><el-button @click="magicalcoder'+(submitMethodId||'')+'">提交</el-button></el-form-item>',formChildren[formChildren.length-1]);
        var html = this.api.nodesToHtml(rootNode.magicalCoder.children,false);
        return html;
    }
}
MagicalCoderAi.prototype.pageEditMethodObj = function (tableFields,apiIdMap,pageIdMap) {
    //保存按钮点击
    var saveMethodHtml =
        laytpl('<div class="layui-row mc-if-container">' +
        '    <div class="layui-col-xs12 mc-if">' +
        '        <div class="layui-col-xs12 mc-condition-groups">' +
        '            <div class="layui-inline mc-condition-group">' +
        '                <div class="layui-inline mc-condition">' +
        '                    <div class="layui-inline mc-compare">' +
        '                        <div class="layui-inline mc-set-value">' +
        '                            vueData.id' +
        '                        </div>' +
        '                        <strong class="mc-compare-operator">等于</strong><div class="layui-inline mc-set-value">""</div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '        <div class="layui-col-xs12 mc-if-execute">' +
        '            <div class="layui-row mc-ajax">' +
        '                <input class="layui-input mc-ajax-url" type="text" readonly placeholder="请求地址" value="web/api/{{d.insertApiId}}" /><input class="layui-input mc-ajax-method" type="text" readonly placeholder="请求方法" />' +
        '                <div class="layui-col-xs12 mc-ajax-params">' +
    '                       {{#  layui.each(d.tableFields, function(index, item){ }}' +
    '                       <div class="layui-col-xs12 mc-ajax-param">' +
        '                        <input class="layui-input mc-ajax-param-name" type="text" value="{{item.name}}" readonly placeholder="参数名" /><input class="layui-input mc-ajax-param-value" mc-is-variable type="text" value="{{# if(item.identifier=="el-upload"){ }}commonUtil.elUploadFileList(_vueThis.$refs.{{item.name}}.uploadFiles){{# }else{ }}vueData.{{item.name}}{{# } }}" readonly placeholder="参数值" />' +
        '                    </div>' +
        '                   {{#  }); }}' +
        '                </div>' +
        '                <div class="layui-col-xs12 mc-ajax-thens">' +
        '                    <div class="layui-row mc-href">' +
        '                        <input class="layui-input mc-href-url" type="text" readonly placeholder="跳转地址" value="web/page/{{d.listPageId}}" /><div class="layui-col-xs12 mc-href-params"></div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div class="layui-col-xs12 mc-else">' +
        '        <div class="layui-col-xs12 mc-if-execute">' +
        '            <div class="layui-row mc-ajax">' +
        '                <input class="layui-input mc-ajax-url" type="text" readonly placeholder="请求地址" value="web/api/{{d.updateApiId}}" /><input class="layui-input mc-ajax-method" type="text" readonly placeholder="请求方法" />' +
        '                <div class="layui-col-xs12 mc-ajax-params">' +
        '                    {{#  layui.each(d.tableFields, function(index, item){ }}' +
        '                    <div class="layui-col-xs12 mc-ajax-param">' +
        '                        <input class="layui-input mc-ajax-param-name" type="text" value="{{item.name}}" readonly placeholder="参数名" /><input class="layui-input mc-ajax-param-value" mc-is-variable type="text" value="{{# if(item.identifier=="el-upload"){ }}commonUtil.elUploadFileList(_vueThis.$refs.{{item.name}}.uploadFiles){{# }else{ }}vueData.{{item.name}}{{# } }}" readonly placeholder="参数值" />' +
        '                    </div>' +
        '                   {{#  }); }}' +
        '                </div>' +
        '                <div class="layui-col-xs12 mc-ajax-thens">' +
        '                    <div class="layui-row mc-href">' +
        '                        <input class="layui-input mc-href-url" type="text" readonly placeholder="跳转地址" value="web/page/{{d.listPageId}}" /><div class="layui-col-xs12 mc-href-params"></div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>').render({tableFields:tableFields,listPageId:pageIdMap.listPageId,updateApiId:apiIdMap.updateApiId,insertApiId:apiIdMap.insertApiId});
    //点击保存按钮
    var saveMethodJs = commonUtil.laytpl('function(){\n' +
        '       var _this = this; \n' +
        '       if (vueData.id =="") {\n' +
        '            axios({\n' +
        '                url: commonUtil.ctx+"web/api/{{d.insertApiId}}", method: "post", data: {\n' +
        '                     {{#  layui.each(d.tableFields, function(index, item){ }}' +
        '                           {{item.name}}: {{# if(item.identifier=="el-upload"){ }}commonUtil.elUploadFileList(_vueThis.$refs.{{item.name}}.uploadFiles){{# }else{ }}vueData.{{item.name}}{{# } }}, ' +
        '                     {{#  }); }}' +
        '                },' +
        '            }).then(function(response) {\n' +
        '                var _res = response.data;\n' +
        '                if (!_res.flag) {\n' +
        '                    _vueThis.$message.error(_res.desc);\n' +
        '                    return;\n' +
        '                }\n' +
        '                window.location.href = commonUtil.ctx+"web/page/{{d.listPageId}}";\n' +
        '            });\n' +
        '        } else {\n' +
        '            axios({\n' +
        '                url: commonUtil.ctx+"web/api/{{d.updateApiId}}", method: "post", data: {\n' +
        '                   {{#  layui.each(d.tableFields, function(index, item){ }}' +
        '                    {{item.name}}: {{# if(item.identifier=="el-upload"){ }}commonUtil.elUploadFileList(_vueThis.$refs.{{item.name}}.uploadFiles){{# }else{ }}vueData.{{item.name}}{{# } }},' +
        '                   {{#  }); }}\n' +
        '                },\n' +
        '            }).then(function(response) {\n' +
        '                var _res = response.data;\n' +
        '                if (!_res.flag) {\n' +
        '                    _vueThis.$message.error(_res.desc);\n' +
        '                    return;\n' +
        '                }\n' +
        '                window.location.href = commonUtil.ctx+"web/page/{{d.listPageId}}";\n' +
        '            });\n' +
        '        }}\n',{tableFields:tableFields,listPageId:pageIdMap.listPageId,updateApiId:apiIdMap.updateApiId,insertApiId:apiIdMap.insertApiId});

    //初始化html
    var winInitHtml = laytpl('<div class="layui-row mc-if-container">' +
        '    <div class="layui-col-xs12 mc-if">' +
        '        <div class="layui-col-xs12 mc-condition-groups">' +
        '            <div class="layui-inline mc-condition-group">' +
        '                <div class="layui-inline mc-condition">' +
        '                    <div class="layui-inline mc-compare">' +
        '                        <div class="layui-inline mc-set-value">' +
        '                            commonUtil.getParameter(\'id\')' +
        '                        </div>' +
        '                        <strong class="mc-compare-operator">不等于</strong><div class="layui-inline mc-set-value">""</div>' +
        '                    </div>' +
        '                </div>' +
        '                <strong class="mc-logic-and">并且</strong>' +
        '                <div class="layui-inline mc-condition">' +
        '                    <div class="layui-inline mc-compare">' +
        '                        <div class="layui-inline mc-set-value">' +
        '                            commonUtil.getParameter(\'id\')' +
        '                        </div>' +
        '                        <strong class="mc-compare-operator">不等于</strong><div class="layui-inline mc-set-value">null</div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '        <div class="layui-col-xs12 mc-if-execute">' +
        '            <div class="layui-row mc-ajax">' +
        '                <input class="layui-input mc-ajax-url" type="text" readonly placeholder="请求地址" value="web/api/{{d.findOneApiId}}" /><input class="layui-input mc-ajax-method" type="text" readonly placeholder="请求方法" /><div class="layui-col-xs12 mc-ajax-params">' +
        '                    <div class="layui-col-xs12 mc-ajax-param">' +
        '                        <input class="layui-input mc-ajax-param-name" type="text" value="id" readonly placeholder="参数名" /><input class="layui-input mc-ajax-param-value" mc-is-variable type="text" value="commonUtil.getParameter(\'id\')" readonly placeholder="参数值" />' +
        '                    </div>' +
        '                </div>' +
        '                <div class="layui-col-xs12 mc-ajax-thens">' +
        '               {{#  layui.each(d.tableFields, function(index, item){ }}' +
        '                    <div class="layui-col-xs12 mc-ajax-then">' +
        '                        <input class="layui-input mc-ajax-then-page-field-not-array" type="text" readonly placeholder="页面普通变量" value="vueData.{{item.name}}" /><strong class="mc-math-set">=</strong><input class="layui-input mc-ajax-then-return-name" type="text" value="_res.data.{{item.name}}" readonly placeholder="返回字段" />' +
        '                    </div>' +
        '               {{#  }); }}' +

        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>').render({tableFields:tableFields,findOneApiId:apiIdMap.findOneApiId});
        //初始化js
    var winInitJs = commonUtil.laytpl('function(){\n' +
        '        var _this = this;\n' +
        '        if (commonUtil.getParameter("id") != ""&&commonUtil.getParameter("id") != null) {\n' +
        '            axios({\n' +
        '                url: commonUtil.ctx+"web/api/{{d.findOneApiId}}", method: "post", data: {\n' +
        '                    id: commonUtil.getParameter(\'id\'),' +
        '                },\n' +
        '            }).then(function(response) {\n' +
        '                var _res = response.data;\n' +
        '                if (!_res.flag) {\n' +
        '                    _vueThis.$message.error(_res.desc);\n' +
        '                    return;\n' +
        '                }\n' +
        '               {{#  layui.each(d.tableFields, function(index, item){ }}' +
        '                vueData.{{item.name}}= _res.data.{{item.name}};' +
        '               {{#  }); }}' +
        '            });\n' +
        '        }}\n',{tableFields:tableFields,findOneApiId:apiIdMap.findOneApiId});
    return {
        winInitHtml:winInitHtml,
        winInitJs:winInitJs,
        saveMethodHtml:saveMethodHtml,
        saveMethodJs:saveMethodJs,
    }
}
MagicalCoderAi.prototype.pageListMethodObj = function (tableFields, apiIdMap, pageIdMap) {
    var codeRightCallback = new CodeRightCallback(this.api,null);
    codeRightCallback.tableNode = this.tableNode;
    //提交按钮查询
    var submitQueryObj = this.pageListMethodQueryObj("1",codeRightCallback,tableFields,apiIdMap,pageIdMap);
    var pagingQueryObj = this.pageListMethodQueryObj("_pageNum",codeRightCallback,tableFields,apiIdMap,pageIdMap);
    //新增跳转
    var insertMethodHtml = commonUtil.laytpl(
        '<div class="layui-row mc-href">\n' +
        '    <input class="layui-input mc-href-url" type="text" readonly placeholder="跳转地址" value="web/page/{{d.pageIdMap.editPageId}}" /><div class="layui-col-xs12 mc-href-params"></div>\n' +
        '</div>',{pageIdMap:pageIdMap})
    var insertMethodJs = commonUtil.laytpl(
        ' function() {\n' +
        '        var _this = this; window.location.href = commonUtil.ctx+"web/page/{{d.pageIdMap.editPageId}}";\n' +
        '    }',{pageIdMap:pageIdMap}
    )
    //编辑跳转
    var updateMethodHtml = commonUtil.laytpl(
        '<div class="layui-row mc-href">\n' +
        '    <input class="layui-input mc-href-url" type="text" readonly placeholder="跳转地址" value="web/page/{{d.pageIdMap.editPageId}}" /><div class="layui-col-xs12 mc-href-params">\n' +
        '        <div class="layui-col-xs12 mc-href-param">\n' +
        '            <input class="layui-input mc-href-param-name" type="text" placeholder="参数名" value="id" /><input class="layui-input mc-href-param-value" type="text" mc-is-variable placeholder="参数值" value="_param1.id" />\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>',{pageIdMap:pageIdMap})
    var updateMethodJs = commonUtil.laytpl(
        ' function(_param1) {\n' +
        '        var _this = this; window.location.href = commonUtil.ctx+"web/page/{{d.pageIdMap.editPageId}}?id="+_param1.id;\n' +
        '    }',{pageIdMap:pageIdMap}
    )
    //删除
    var deleteMethodHtml = commonUtil.laytpl(
        '<div class="layui-row mc-ajax">\n' +
        '    <input class="layui-input mc-ajax-url" type="text" readonly placeholder="请求地址" value="web/api/{{d.apiIdMap.deleteApiId}}" /><input class="layui-input mc-ajax-method" type="text" readonly placeholder="请求方法" /><div class="layui-col-xs12 mc-ajax-params">\n' +
        '        <div class="layui-col-xs12 mc-ajax-param">\n' +
        '            <input class="layui-input mc-ajax-param-name" type="text" value="id" readonly placeholder="参数名" /><input class="layui-input mc-ajax-param-value" mc-is-variable type="text" value="_param1.id" readonly placeholder="参数值" />\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="layui-col-xs12 mc-ajax-thens">\n' +
        '        <div class="layui-inline mc-util-reload"></div>\n' +
        '    </div>\n' +
        '</div>',{apiIdMap:apiIdMap})
    var deleteMethodJs = commonUtil.laytpl(
        'function(_param1) {\n' +
        '        var _this = this; axios({\n' +
        '            url: commonUtil.ctx+"web/api/{{d.apiIdMap.deleteApiId}}",\n' +
        '            method: "post",\n' +
        '            data: {\n' +
        '                id: _param1.id,\n' +
        '            },\n' +
        '        }).then(function(response) {\n' +
        '            var _res = response.data;\n' +
        '            if (!_res.flag) {\n' +
        '                _vueThis.$message.error(_res.desc);\n' +
        '                return;\n' +
        '            }\n' +
        '            window.location.reload();\n' +
        '        });\n' +
        '    }',{apiIdMap:apiIdMap}
    )
    return {submitQueryMethodHtml:submitQueryObj.methodHtml,submitQueryMethodJs:submitQueryObj.methodJs,
            pagingQueryMethodHtml:pagingQueryObj.methodHtml,pagingQueryMethodJs:pagingQueryObj.methodJs,
            insertMethodHtml:insertMethodHtml,insertMethodJs:insertMethodJs,
            updateMethodHtml:updateMethodHtml,updateMethodJs:updateMethodJs,
            deleteMethodHtml:deleteMethodHtml,deleteMethodJs:deleteMethodJs,
    };
}

MagicalCoderAi.prototype.pageListMethodQueryObj = function (currentPage,codeRightCallback,tableFields, apiIdMap, pageIdMap) {
    var methodHtml = commonUtil.laytpl('<div class="layui-row mc-ajax">\n' +
        '    <input class="layui-input mc-ajax-url" type="text" readonly placeholder="请求地址" value="web/api/{{d.apiIdMap.findListApiId}}" />' +
        '   <input class="layui-input mc-ajax-method" type="text" readonly placeholder="请求方法" />' +
        '   <div class="layui-col-xs12 mc-ajax-params">\n' +
        '       {{#  layui.each(d.tableFields, function(index, item){ }}' +
        '               {{# if(item.identifier!="el-checkbox-group" && item.identifier!="el-upload" && item.identifier!="el-switch"){ }} '+
        '        <div class="layui-col-xs12 mc-ajax-param">\n' +
        '            <input class="layui-input mc-ajax-param-name" type="text" value="{{item.name}}"" readonly placeholder="参数名" /><input class="layui-input mc-ajax-param-value" mc-is-variable type="text" value="vueData.{{item.name}}" readonly placeholder="参数值" />\n' +
        '        </div>\n' +
        '               {{# } }} '+
        '       {{#  }); }}' +
        '        <div class="layui-col-xs12 mc-ajax-param">\n' +
        '            <input class="layui-input mc-ajax-param-name" type="text" value="returnCount" readonly placeholder="参数名" /><input class="layui-input mc-find-page-total-count" type="text" value="true" readonly placeholder="参数值" />\n' +
        '        </div>\n' +
        '        <div class="layui-col-xs12 mc-ajax-param">\n' +
        '            <input class="layui-input mc-ajax-param-name" type="text" value="limit" readonly placeholder="参数名" /><input class="layui-input mc-find-page-limit" type="text" value="20" readonly placeholder="参数值" />\n' +
        '        </div>\n' +
        '        <div class="layui-col-xs12 mc-ajax-param">\n' +
        '            <input class="layui-input mc-ajax-param-name" type="text" value="currentPage" readonly placeholder="参数名" /><input class="layui-input mc-find-page-num" type="text" value="'+currentPage+'" readonly placeholder="参数值" />\n' +
        '        </div>' +
        '    </div>\n' +
        '    <div class="layui-col-xs12 mc-ajax-thens">\n' +
        codeRightCallback.changeRadioSelectValueToTextJs(this.lowCodeConstant.findReturnType.LIST)+
        '        <div class="layui-col-xs12 mc-ajax-then">\n' +
        '            <input class="layui-input mc-ajax-then-page-field-array" type="text" value="vueData.tableList" readonly placeholder="页面数组变量" /><strong class="mc-math-set">=</strong><input class="layui-input mc-ajax-then-return-name" type="text" value="_res.data" readonly placeholder="返回字段" />\n' +
        '        </div>\n' +
        '        <div class="layui-col-xs12 mc-ajax-then">\n' +
        '            <input class="layui-input mc-ajax-then-page-field-page-total" type="text" value="vueData.pageTotal" readonly placeholder="页面分页总数变量" /><strong class="mc-math-set">=</strong><input class="layui-input mc-ajax-then-return-name" type="text" value="_res.count" readonly placeholder="返回字段" />\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>',{tableFields:tableFields,apiIdMap:apiIdMap});
    //提交按钮查询
    var params = currentPage=='1'?'':currentPage;
    var methodJs = commonUtil.laytpl(
        'function('+params+'){var _this = this; \n' +
        '           axios({\n' +
        '            url: commonUtil.ctx+"web/api/{{d.apiIdMap.findListApiId}}", method: "post", data: {\n' +
        '               {{#  layui.each(d.tableFields, function(index, item){ }}' +
        '               {{# if(item.identifier!="el-checkbox-group" && item.identifier!="el-upload" && item.identifier!="el-switch"){ }} '+
        '                {{item.name}}: vueData.{{item.name}},' +
        '               {{# } }} '+
        '               {{#  }); }}' +
        '               returnCount: true, limit: 20, currentPage: ' +currentPage+
        '            },\n' +
        '        }).then(function(response) {\n' +
        '            var _res = response.data;\n' +
        '            if (!_res.flag) {\n' +
        '                _vueThis.$message.error(_res.desc);\n' +
        '                return;\n' +
        '            }\n' +
        '            if (_res.data) {\n' +
        '                for (var n = 0; n < _res.data.length; n++) {\n' +
        '                    var entity = _res.data[n];\n' +
        codeRightCallback.radioSelectValueToTranselateJs()+
        '                }}\n' +
        '            vueData.tableList = _res.data;\n' +
        '            vueData.pageTotal = _res.count;\n' +
        '        });' +
        '}',{tableFields:tableFields,apiIdMap:apiIdMap});
    return {methodHtml:methodHtml,methodJs:methodJs};
}
