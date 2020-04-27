PS:请忽略控制台部分接口404拿到源码您可以手动删除此部分 并不影响使用

简介
此模块基于magicaldrag提供的api和callback基础上的我们开发的可视化建表，您可以自由扩展(开源)

1 主要涉及文件目录 请使用全局搜索方式搜索文件名 这里是主要是文件名称展示
../../magicaldrag/index-form.html
    --constant.js
    --form.js
    --ai.js                   (可忽略)
    --form-magicaldrag-callback.js (重写callback.js 当布局器加载完 首先进入此类 属于整个页面的触发入口)
2 页面流程
当index-form.html加载完毕
                |
             会自动调用
                |
 form-magicaldrag-callback.js
                |
                进入after_start()
                |
                后续就看代码吧

3 自己查看保存后的数据吧 在MagicalCallback.prototype.save_html
