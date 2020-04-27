PS:请忽略控制台部分接口404拿到源码您可以手动删除此部分 并不影响使用

简介
此模块基于magicaldrag提供的api和callback基础上的我们开发的可视化js编写器，您可以自由扩展(开源)

1 主要涉及文件目录 请使用全局搜索方式搜索文件名 这里是主要是文件名称展示
../../magicaldrag/index-code.html
    --constant.js
    --iframe-page-layui-2.10.1.html(布局器中的iframe加载了iframe作为工具使用)
        --iframe-ui.js
        --assets/js/common.js
    --code-rebuild-constant.js (重新改造constant.js中部分控件的属性配置 如果您希望右侧属性是个从后台获取的下拉，可以参考里面的写法)
    --code-right-callback.js   (右侧属性变更时 会触发一些变化布局器工作区的结构 既不同的下拉框选择后 动态改造布局器工作区的变化 可以参考此处的写法)
    --code.js                   (页面主控类)
    --code-magicaldrag-callback.js (重写callback.js 当布局器加载完 首先进入此类 属于整个页面的触发入口)
    --code-ajax.js              (跟后台交互的接口 请自行实现)
    --code-translate.js              (把配置翻译成js脚本)
    --code-syntax-check.js              (语法检查)
2 页面流程
当index-code.html加载完毕
                |
             会自动调用
                |
 code-magicaldrag-callback.js
                |
                进入after_start()
                |
                后续就看代码吧

3 此模块有操作数据库的接口 请嵌入自己系统后自行实现
    主要参考code-ajax.js 一一实现需要的接口即可


4 数据库实体设计
    page:{id:页面主键,pageHtml:页面html,pageJs:页面脚本}
    method:{id:方法主键,methodHtml:方法的html,functionJs:实际methodHtml转换的可执行js}
