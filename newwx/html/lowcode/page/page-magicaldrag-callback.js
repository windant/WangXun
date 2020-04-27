var page = new Page();
/*关于MagicalCallback有哪些回调 请参考*/
/**
 * 布局器初始化完成进入此方法
 * @param api 请参考lowcode/page/magicaldrag/assets/drag/js/user/api.js
 */
MagicalCallback.prototype.after_start = function (api) {
    //注入api
    page.inject(api);
    //刷新右侧属性面板
    page.rebuildConstant.pubReplace();
    page.pageAjax.initPageData(page.pageId,function (pageHtml,pageJs,projectId) {
        //初始化布局器的html js
        api.insert(pageHtml,pageJs);
        //TODO 项目id 根据您的需求可以删除
        page.projectId = projectId;
        //TODO 返回到页面列表
        $("#returnToMyPageList").attr("href","../lowcode/page/list.html?projectId="+projectId);
        //由于加载了element的html所以把页面的脚本也主动执行一下 不然页面不生效
        page.initVueMethods(api,pageHtml);
    })
}
/**
 * 保存按钮点击触发
 * @param html 页面html
 * @param rootNode
 * @param javascript
 */
MagicalCallback.prototype.save_html = function (html,rootNode,javascript) {
    var pageEntity = {id:page.pageId,pageHtml:html,pageJs:javascript};
    page.pageAjax.savePageData(pageEntity,function () {
        //TODO 要往哪里跳转
        window.location.href = "../lowcode/page/list.html?projectId="+page.projectId;
    })
}
MagicalCallback.prototype.extend_config = function (uiType,configElem,rightPanelItemObj,focusNode,callback) {
    //您可以在这里初始化你自己的控件,使用layui.open弹窗方式打开 参考 https://www.layui.com/doc/modules/layer.html
    if(rightPanelItemObj.extendKey =='icon'){
        var iframUrl = '';
        if(uiType==0){
            iframUrl = 'iframe-layui-2.5.4.html';
        }else if(uiType ==4){
            iframUrl = 'iframe-element-2.10.1.html';
        }
        var index = layer.open({
            type: 2,
            content: iframUrl+'?from=icon_list',
            title:'扩展编辑',
            area: ['800px', '600px'],
            maxmin:true,
            btn:['确定'],
            yes:function () {
                var attrName = rightPanelItemObj.attrName;
                var iframe = $("#layui-layer-iframe"+index).contents();
                var activeI = iframe.find(".magicalcoder-extend-icons").find("i.active").first();
                var newAttrValue = "";
                if(uiType==0){//layui
                    var newIconClass =activeI.length>0? activeI.attr("class").replace("active",'').replace("layui-icon",'').trim():"";
                    var attrValue = focusNode.attributes[attrName]||'';
                    if(attrValue.indexOf("layui-icon-")!=-1){
                        newAttrValue = attrValue.replace(/layui-icon-[-\w]+/g,newIconClass);
                    }else {
                        newAttrValue = attrValue + " "+newIconClass;
                    }
                }else if(uiType == 4){//elementui
                    var newIconClass =activeI.length>0? activeI.attr("class").replace("active",'').trim():"";
                    var attrValue = focusNode.attributes[attrName]||'';
                    if(attrValue.indexOf("el-icon-")!=-1){
                        newAttrValue = attrValue.replace(/el-icon-[-\w]+/g,newIconClass);
                    }else {
                        newAttrValue = attrValue + " "+newIconClass;
                    }
                }

                newAttrValue = newAttrValue.trim();
                configElem.val(newAttrValue);
                //记得回调 使生效 此处暂时注释
                callback(attrName,newAttrValue);
                layer.close(index)
            },cancel: function(index, layero){
                //右上角关闭
                //return false 开启该代码可禁止点击该按钮关闭
            }
        });

    }
    else if(rightPanelItemObj.extendKey =='method'){//现在是编写方法 可视化编程了
        var attrName = rightPanelItemObj.attrName;
        var methodStr = focusNode.attributes[attrName];
        //检查一下这个方法名有没有被用过
        var pageId = page.pageId||'';
        var methodParams = page.tableUtil.findMethodParams(methodStr);
        //往编码器页面传参
        window.pageParams = {api:page.api,rootNode:page.api.getRootNode(),focusNode:focusNode,iframeUi:page.iframeUi,extra:{attrName:attrName,attrValue:methodStr,pageId:pageId,methodParams:methodParams},rightPanelItemObj:rightPanelItemObj};
        var index = layer.open({
            type: 2,
            content: 'index-code.html',
            title:'定制动作事件',
            area: ['1000px', '800px'],
            maxmin:true,
            moveOut:true,
            shade:false,
            btn:['关闭'],
            yes:function () {
                page.api.refreshWorkspace();//立即生效
                configElem.val(focusNode.attributes[attrName]);
                layer.close(index);
            },cancel: function(index, layero){
                //右上角关闭
                configElem.val(focusNode.attributes[attrName]);
                //return false 开启该代码可禁止点击该按钮关闭
                page.api.refreshWorkspace();
            }
        });
        layer.full(index);//最大化一下
    }
    else if(rightPanelItemObj.extendKey == 'params'){
        var attrName = rightPanelItemObj.attrName;
        var attrValue = focusNode.attributes[attrName]||'';
        var paramList = [];
        if(attrValue){
            paramList = JSON.parse(page.lowCodeUtil.xssUtil.unEscapeXss(attrValue));
        }
        var extendHrefParams = new ExtendHrefParams(paramList);
        var index = layer.open({
            type: 1,
            content: extendHrefParams.template(),
            title:'扩展编辑',
            area: ['800px', '600px'],
            maxmin:true,
            btn:['确定'],
            yes:function () {
                var data = extendHrefParams.getData();
                var newAttrValue = JSON.stringify(data);
                configElem.val(newAttrValue);
                //记得回调 使生效 此处暂时注释
                callback(attrName,page.lowCodeUtil.xssUtil.escapeXss(newAttrValue));
                layer.close(index)
            },cancel: function(index, layero){
                //右上角关闭
                //return false 开启该代码可禁止点击该按钮关闭
            }
        });
        extendHrefParams.render();
    }
    else if(rightPanelItemObj.extendKey =='selectChannel'){// 网讯选择栏目弹窗
        var attrName = rightPanelItemObj.attrName;
        var attrValue = focusNode.attributes[attrName]||'';
        var paramList = [];
        if(attrValue){
            paramList = JSON.parse(page.lowCodeUtil.xssUtil.unEscapeXss(attrValue));
        }
        // var extendHrefParams = new ExtendHrefParams(paramList);
        
        // var index = layer.open({
        //     type: 1,
        //     //content: extendHrefParams.template(),
        //     //content:'<el-tree :props="props" :load="loadNode" lazy show-checkbox @check-change="handleCheckChange"> </el-tree>',
        //     content:'<el-button>el-Button</el-button><button class="el-button">button</button>',
        //     title:'选择栏目',
        //     area: ['800px', '600px'],
        //     maxmin:true,
        //     btn:['确定'],
        //     yes:function () {
        //         // var data = extendHrefParams.getData();
        //         // var newAttrValue = JSON.stringify(data);
        //         // configElem.val(newAttrValue);
        //         // //记得回调 使生效 此处暂时注释
        //         // callback(attrName,page.lowCodeUtil.xssUtil.escapeXss(newAttrValue));
        //         layer.close(index)
        //     },cancel: function(index, layero){
        //         //右上角关闭
        //         //return false 开启该代码可禁止点击该按钮关闭
        //     }
        // });
        app.dialogVisible = true;
        // extendHrefParams.render();
    }
}

MagicalCallback.prototype.before_change_attr_callback = function (obj) {
    var changeAttrName = obj.changeAttrName;
    var changeAttrValue = obj.changeAttrValue;
    if(obj.itemObj.validate){
        var map = page.lowCodeUtil.mapUtil.coverToKeyValue(obj.itemObj.validate);
        if(map.key == '^[a-zA-Z][a-zA-Z0-9_]*$'){
            if(page.lowCodeConstant.jsKeepName.indexOf(","+changeAttrValue+",")!=-1){
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
    if(identifier == 'mc-window'){//修改页面初始化方法
        if(changeAttrName=='onload'){
            page.iframeUi.vueMountedMethodName = obj.changeAttrValue;
        }
    }else if(identifier == 'el-upload'){//上传
        if(changeAttrName == ':file-list'){//修改:file-list 同步修改ref值
            obj.focusNode.attributes['ref']=obj.changeAttrValue;
        }
    }else if(identifier == 'el-table'||identifier == 'el-form'){//自动设置table的字段
        if(changeAttrName == 'mc-form-data'){//字段读取表单字段填充
            page.rightCallback.changeTableByMcFormData(obj);
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
    //批量处理:src src这种变量常量切换的配置只能同时存在一个
    if(changeAttrName.startsWith(":")){
        var constantAttr = obj.focusNode.attributes[changeAttrName.substr(1)];
        if(constantAttr){
            delete obj.focusNode.attributes[changeAttrName.substr(1)];
            page.api.refreshRightAttrPane([obj.focusNode.magicalCoder.id]);
            page.api.refreshWorkspace();
        }
    }else {
        var constantAttr = obj.focusNode.attributes[":"+changeAttrName];
        if(constantAttr){
            delete obj.focusNode.attributes[":"+changeAttrName];
            page.api.refreshRightAttrPane([obj.focusNode.magicalCoder.id]);
            page.api.refreshWorkspace();
        }
    }
}

MagicalCallback.prototype.reset_before = function () {
    page.iframeUi.resetMethods();
    page.iframeUi.resetVueMountedMethodName();
}

MagicalCallback.prototype.pre_build_attrs = function (focusNode) {
    page.rebuildConstant.pubReplaceFunction(focusNode);
    return true;
}
