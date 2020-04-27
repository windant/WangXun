/*给用户主动调用的 您不需要改动 或者重写
* 只要 var api = new MagicalApi();
* 即可使用api.getHtml();等各种方法
* */
function MagicalApi() {

}

/**
 * 获取布局器HTML源码
 */
MagicalApi.prototype.getHtml=function () {}
/**
 * 获取布局器脚本
 */
MagicalApi.prototype.getJavascript=function () {}
/**
 * 获取布局器根节点json
 */
MagicalApi.prototype.getRootNode=function () {}
/**
 * 能获取表单条目下的控件数据
 */
MagicalApi.prototype.getFormItemNodes = function (){}
/**
 * 插入源码到布局器
 * @param html
 */
MagicalApi.prototype.insertHtml=function (html) {}
/**
 * 插入javascript脚本 请尽量在insertHtml方法之后执行 因为大部分脚本操作的是html 必须先有html
 * @param javascript
 */
MagicalApi.prototype.insertJavascript=function (javascript) {}
/**
 * 插入html javascript 常用于初始化布局器
 * @param html
 * @param javascript
 */
MagicalApi.prototype.insert=function (html,javascript) {}

/*根据root 还原布局器*/
MagicalApi.prototype.insertNode=function (rootNode) {}
/**
 * 聚焦某个结构
 * @param magicalCoderIds 数组[] 结构的唯一magicalCoder.id
 */
MagicalApi.prototype.focus = function (magicalCoderIds) {}
/**
 * 获取constatn.js实例
 * 这样就可以灵活的根据事件情况来调整配置
 */
MagicalApi.prototype.getConstant = function () {}
/**
 * 获取iframe-ui.js实例
 * 这样就可以灵活的根据事件情况来调整配置
 */
MagicalApi.prototype.getIframeUi = function () {}
/**
 * 把html转换成magicalCoderNode数据
 * @param html
 */
MagicalApi.prototype.htmlToRootNode = function (html) {}
/**
 * 把magicalCoder node数据转换成html
 * @param nodes [] 数组 可以通过rootNode.magicalCoder.children传入
 * @param htmlWithMagicalCoderAttr true|false 是否包含magicalcode属性 默认false
 */
MagicalApi.prototype.nodesToHtml = function (nodes,htmlWithMagicalCoderAttr) {}
/**
 * 重新设置孩子节点 比如您想在某个节点插入html 那么可以先把html调用htmlToRootNode得到node,
 * 然后childrenNodes = node.magicalCoder.children; 然后就可以调用此方法了 一般用在回调处理上
 * @param parentId 父节点magicalCoder.Id string
 * @param childrenNodes 子节点数组 []
 */
MagicalApi.prototype.resetChildren = function(parentId,childrenNodes){}
/**
 * 主动触发布局器重绘工作区
 */
MagicalApi.prototype.refreshWorkspace = function () {}

/**
 * 仅仅把中间html重绘 并不触发节点变更
 */
MagicalApi.prototype.onlyCenterRefreshHtml = function(){}

/**
 * 根据magicalCoderParam查询结构
 * @param fromNode 从哪个节点开始往下搜索 如果为null 则默认从根节点
 * @param magicalCoderParam 查询参数例如 查看node.magicalCoder属性即可得知参数 {id:1,....}
 * return []
 */
MagicalApi.prototype.searchNodes = function (fromNode,magicalCoderParam) {}
/**
 * 重新构造左侧组件列表:如果您动态的向左侧增删组件 可以使用此方法
 * 您只需要修改完constant中的配置后 直接调用此方法 无法额外调用constant.refresh();
 */
MagicalApi.prototype.rebuildLeftComponents = function () {}
/**
 * 刷新拖拽事件
 */
MagicalApi.prototype.refreshDragEvent = function () {}
/**
 * 刷新右侧属性面板
 * @param magicalCoderId
 */
MagicalApi.prototype.refreshRightAttrPane = function (magicalCoderId) {}
/**
 * 在节点中追加html
 * @param node
 * @param html
 * @return true|false
 */
MagicalApi.prototype.appendHtml = function (parentNode,html,preNode) {}
/**
 * 删除多个节点
 * @param nodes []
 */
MagicalApi.prototype.deleteNodes = function (nodes) {}
/**
 * 查找前置节点
 * @param node
 */
MagicalApi.prototype.findPreNode = function (magicalCoderId) {}
/**
 * 查找后置节点
 * @param node
 */
MagicalApi.prototype.findNextNode = function (magicalCoderId) {}
/**
 * 查找父亲节点
 * @param magicalCoderId
 */
MagicalApi.prototype.findParentNode = function (magicalCoderId) {}
/**
 * 移动节点
 * @param dragMcId 要移动的id
 * @param targetMcId 目标id
 * @param moveType inner prev next
 */
MagicalApi.prototype.moveExistNode = function (dragMcId, targetMcId, moveType) {}

