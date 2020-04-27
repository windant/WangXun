/*这个是iframeUi通用的功能 结尾 不用每个都写一份了*/
/*是否可以调试*/
IframeUi.prototype.setDebug = function(debug){
    this.debug = debug;
}
/*给父窗口调用 初始化一个实例*/
window.iframeUi = new IframeUi();
window.onload = function () {
    if(!window.iframeUi.iconList()){
        if(typeof parent.iframeFreshTimes=='undefined'){
            parent.iframeFreshTimes = 0;
        }else {
            if(typeof window.localStorage=='object'){
                var magicalDragErrorKey = "magicaldrag_error";
                window.localStorage.setItem(magicalDragErrorKey, "fresh");
            }
            parent.window.layui.layer.msg("工作区发生刷新,3秒后为您恢复布局器");
            setTimeout(function () {
                parent.window.location.reload();
            },3000)
        }
    }

}
