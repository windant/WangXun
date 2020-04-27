/*页面模块牵扯到的远程接口*/
function PageAjax(){
    this.lowCodeUtil = new LowCodeUtil();
    this.lowCodeConstant = new LowCodeConstant();
}

/**
 * 保存页面数据 id为空则insert数据库 否则update数据库
 * @param pageEntity {id:页面id,pageHtml:页面html,pageJs:页面脚本}
 * @param callback 回调函数
 */
PageAjax.prototype.savePageData = function (pageEntity,callback) {
    if(this.lowCodeConstant.remote){
        $.post(commonUtil.ctx+"deployer/project/save_page",pageEntity,function (data) {
            if(data.flag){
                layer.msg("保存成功");
                callback();
            }else {
                layer.msg("保存失败"+data.desc);
            }
        })
    }else {//注意这只是个演示 请走上面逻辑 自己后端持久化实现
        if(!pageEntity.id){
            pageEntity.id = new Date().getTime();
        }
        this.lowCodeUtil.daoUtil().localSetItem("page"+pageEntity.id,pageEntity);
    }

}
/**
 * 布局器加载后 自动 初始化页面的html js
 * @param pageId
 * @param callback 回调
 */
PageAjax.prototype.initPageData = function (pageId,callback) {
    if(!pageId){
        return;
    }
    if(this.lowCodeConstant.remote){
        $.getJSON(commonUtil.ctx+"deployer/project/page/"+pageId,{},function (data) {
            //是如果您的data {flag:true,data:{pageHtml:'',pageJs:''}} 否则请您自行控制data结构
            if(data.flag){
                var item = data.data;
                //pageHtml是页面的html pageJs是页面的js projectId根据您的需求自行控制 也可以不传
                callback(item.pageHtml,item.pageJs,item.projectId);
            }else {
                layer.msg(data.desc)
            }
        })
    }else {//注意这只是个演示 请走上面逻辑 自己后端持久化实现
        this.lowCodeUtil.daoUtil().localGetItem("page"+pageId);
    }
}
/**
 * 初始化页面依赖的所有动态js方法 因为js方法是可视化的，存在页面不合适
 * 所以一堆数据都存储在数据库 这里我们重新编辑页面的时候 需要拿出来初始化一下
 * 当然实际访问页面的时候 不需要再初始化了 方法都在页面 无性能压力
 * @param methodIds [1,2] 当前页面涉及到的方法id
 * @param callback 回调
 */
PageAjax.prototype.initPageDependOnMethods = function (methodIds,callback) {
    if(this.lowCodeConstant.remote){
        $.getJSON(commonUtil.ctx+"deployer/project/page_method_list",{methodIds:methodIds.join(",")},function(data){
            if(data.flag){
                var methodList = data.data;//[{id:主键,functionJs:保存的方法注意不是html而是实际可用的方法}]
                callback(methodList);
            }else{
                layer.msg(data.desc);
            }
        })
    }else {//注意这只是个演示 请走上面逻辑 自己后端持久化实现
        var methodList = [];
        for(var i=0;i<methodIds.length;i++){
            var methodId = methodIds[i];
            var method = this.lowCodeUtil.daoUtil().localGetItem("method"+methodId);
            methodList.push(method);
        }
        callback(methodList);
    }

}
