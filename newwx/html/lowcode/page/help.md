PS:请忽略控制台部分接口404拿到源码您可以手动删除此部分 并不影响使用

简介
此模块基于magicaldrag提供的api和callback基础上的二次扩展模块，完美的实现了element-ui的可视化开发 包含js编辑器(开源)
致开发者：布局器采用iframe嵌入方式 外面是layui，jquery的东西自由使用
        内部就是iframe-xxx.html 请根据您的ui自行控制，主要初始化代码在iframe-ui.js


1 主要涉及文件目录 请使用全局搜索方式搜索文件名 这里是主要是文件名称展示
../../magicaldrag/index-page.html
    --constant.js
    --iframe-page-element-2.10.1.html(布局器中的iframe加载了element)
        --iframe-ui.js
        --assets/js/common.js
    --page-rebuild-constant.js (重新改造constant.js中部分控件的属性配置 如果您希望右侧属性是个从后台获取的下拉，可以参考里面的写法)
    --page-right-callback.js   (右侧属性变更时 会触发一些变化布局器工作区的结构 既不同的下拉框选择后 动态改造布局器工作区的变化 可以参考此处的写法)
    --extend-href-params.js    (页面初始化完毕后 控制入参)
    --page.js                   (页面主控类)
    --page-magicaldrag-callback.js (重写callback.js 当布局器加载完 首先进入此类 属于整个页面的触发入口)
    --page-ajax.js              (跟后台交互的接口 请自行实现)
2 页面流程
当index-page.html加载完毕
                |
             会自动调用
                |
 page-magicaldrag-callback.js
                |
                进入after_start()
                |
                后续就看代码吧

3 此模块有操作数据库的接口 请嵌入自己系统后自行实现
    主要参考page-ajax.js 一一实现需要的接口即可


4 数据库实体设计
    page:{id:页面主键,pageHtml:页面html,pageJs:页面脚本}
    method:{id:方法主键,methodHtml:方法的html,functionJs:实际methodHtml转换的可执行js}
