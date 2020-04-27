/*给用户回调处理*/
function MagicalCallback() {

}
/**
 * 初始化布局器成功后执行：您可以调用api.insert(html,javascript)来初始化布局器的默认数据
 * @param api 接口api对象 具体方法参考api.js
 */
MagicalCallback.prototype.after_start = function (api) {
}


/**
 * 保存按钮
 * @param html 源码部分
 * @param rootNode 当前布局器JSON
 * @param javascript 脚本
 */
MagicalCallback.prototype.save_html = function (html,rootNode,javascript) {
}
/**
 * 扩展配置钩子 这里做一些demo 注意请不要删除此demo 因为是图标的扩展配置
 * @param uiType 当前ui类型 在Constant.getUiType配置
 * @param configElem 右侧面板中 当前扩展配置按钮 左侧的dom结构
 * @param rightPanelItemObj 配置条目  {type:this.type.TEXT      ,clearAttr:true       ,oneLine:true     ,change:this.change.CLASS   ,title:'图标',extend:true    }
 * @param focusNode 聚焦结构 调试查看 attributes是结构的各种属性
 * @param callback(attrName,attrValue) 记得回调
 */
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

    }else {

    }


}
/**
 * 右侧属性配置属性变更前的回调事件 变更非文本
 * @param obj.focusNode 当前聚焦的节点
 * @param obj.changeAttrName 修改的属性名
 * @param obj.changeAttrValue 修改后的属性值
 * @param obj.originAttrValue 修改前的属性值
 * @param obj.itemObj 配置属性
 */
MagicalCallback.prototype.before_change_attr_callback = function (obj) {return true;}
/**
 * 右侧属性配置属性变更后的回调事件 变更非文本
 * @param obj.focusNode 当前聚焦的节点
 * @param obj.changeAttrName 修改的属性名
 * @param obj.changeAttrValue 修改后的属性值
 * @param obj.originAttrValue 修改前的属性值
 * @param obj.itemObj 配置属性
 */
MagicalCallback.prototype.after_change_attr_callback = function (obj) {}
/**
 * 右侧属性配置属性变更前的回调事件 注意变更文本（就是结构内的文本 change:this.change.TEXT）
 * @param obj.focusNode 当前聚焦的节点
 * @param obj.changeAttrName null
 * @param obj.changeAttrValue 修改后的文本值
 * @param obj.originAttrValue 修改前的文本值
 * @param obj.itemObj 配置属性
 */
MagicalCallback.prototype.before_change_text_callback = function (obj) {return true;}
/**
 * 右侧属性配置属性变更后的回调事件 注意变更文本（就是结构内的文本 change:this.change.TEXT）
 * @param obj.focusNode 当前聚焦的节点
 * @param obj.changeAttrName null
 * @param obj.changeAttrValue 修改后的文本值
 * @param obj.originAttrValue 修改前的文本值
 * @param obj.itemObj 配置属性
 */
MagicalCallback.prototype.after_change_text_callback = function (obj) {}

/**
 * 布局器顶端重置按钮点击之前
 */
MagicalCallback.prototype.reset_before = function () {}
/**
 * 布局器顶端重置按钮点击后
 */
MagicalCallback.prototype.reset_after = function () {}
/**
 * 构建右侧属性面板
 * @param focusNode
 * @return  true:继续构建 false:终止构建
 */
MagicalCallback.prototype.pre_build_attrs = function (focusNode) {
    return true;
}
/**
 * 当工作区变更后：比如拖拽 删除 等操作触发的
 * 请不要跟api.refreshWorkspace()配合使用 否则就会无限递归死循环
 * 可配合onlyCenterRefreshHtml把您修改的节点属性绘制出来
 */
MagicalCallback.prototype.after_workspace_change = function () {}
