/*页面模块牵扯到的远程接口*/
function CodeAjax(){
    this.lowCodeUtil = new LowCodeUtil();
    this.lowCodeConstant = new LowCodeConstant();
}

/**
 * 保存方法的数据 自行实现 id为空请insert数据库 否则update数据库
 * @param methodEntity {id:方法id,methodHtml:页面html,functionJs:可执行的js,pageId:方法所属页面ID}
 * @param callback 回调函数
 */
CodeAjax.prototype.saveCodeData = function (methodEntity,callback) {
    if(this.lowCodeConstant.remote) {
        $.post(commonUtil.ctx + "deployer/project/save_page_method", methodEntity, function (data) {
            if (data.flag) {
                var methodId = data.data;//这个要返回保存的方法的主键 因为有时候methodEntity.id可能不存在 就是新增
                callback(methodId);
            } else {
                layer.msg("保存失败" + data.desc);
            }
        })
    }else {//注意这只是个演示 请走上面逻辑 自己后端持久化实现
        if(!methodEntity.id){
            methodEntity.id = new Date().getTime();
        }
        this.lowCodeUtil.daoUtil().localSetItem("method"+methodEntity.id,methodEntity);
        callback(methodEntity.id);
    }
}
/**
 * 布局器加载后 自动 初始化页面的html js
 * @param methodId 方法ID
 * @param callback 回调
 */
CodeAjax.prototype.initCodeData = function (methodId,callback) {
    if(!methodId){
        return;
    }
    //远程获取方法存储的html
    if(this.lowCodeConstant.remote) {
        $.getJSON(commonUtil.ctx + "deployer/project/page_method/" + methodId, {data: new Date().getTime()}, function (data) {
            if (data.flag) {
                var method = data.data;
                if (method == null) {
                    return;
                }
                callback(method.methodHtml);
            } else {
                layer.msg("请求失败" + data.desc)
            }
        })
    }else{//注意这只是个演示 请走上面逻辑 自己后端持久化实现
        var method = this.lowCodeUtil.daoUtil().localGetItem("method"+methodId);
        if(method){
            callback(method.methodHtml);
        }
    }
}
