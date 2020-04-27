/*每一种Ui的个性处理 比如各种组件初始化 重绘*/
function IframeUi() {
    this.ieVersion = ieVersion();
    this.defaultJavascript = '//ajax库采用axios 注意本脚本需要下载我们的...lowcode/common/lowcode-util.js配合方可运行\n' +
        'var _vueThis = null;\n' +
        '//调试:打开浏览器控制台(F12),在代码中某行增加 debugger 即可调试\n' +
        'var vueData = {\n' +
        '    "radioGroup": "",\n' +
        '    "checkboxGroup": []};\n' +
        '//注意:vueDate布局器系统变量,请勿更改 此行以上代码不要更改或删除//\n' +
        'var vueMethod = {}\n' +
        '//注意:vueMethod布局器自动维护的系统方法,请勿更改 此行以上代码不要更改或删除//\n' +
        'var vueMounted = function () {}\n' +
        '//注意:vueMounted布局器自动维护的页面加载后执行的方法,请勿更改 此行以上代码不要更改或删除//\n' +
        'var myMethod = {}\n' +
        'for (var key in myMethod) {\n' +
        '    vueMethod[key] = myMethod[key];\n' +
        '}\n' +
        '/*您自定义的变量,可以在此处覆盖vueData提供的变量 参照element ui文档*/\n' +
        'var myData = {}\n' +
        '/*把您定义的数据覆盖布局器自动识别的变量*/\n' +
        'Object.assign(vueData, myData);\n' +
        'var _t = this;\n' +
        'var Ctor = Vue.extend({\n' +
        '    //提前绑定的变量\n' +
        '    data: function() {\n' +
        '        return vueData;\n' +
        '    },\n' +
        '    created: function() {\n' +
        '        _vueThis=this;\n' +
        '    },\n' +
        '    //页面加载完 会执行方法 可以做一些初始化操作\n' +
        '    mounted: vueMounted,\n' +
        '    /*当前页面绑定的方法集合 与布局器节点一一映射即可 参照element ui文档*/\n' +
        '    methods: vueMethod\n' +
        '});\n' +
        'new Ctor().$mount(\'#magicalDragScene\');\n' ;

    this.javascript = this.defaultJavascript;
    //是否开启javascript调试
    this.debug = false;
    this.methods={"focus":"function (e) {try {_t.fastKey.focusElem(e);}catch(e) {}}","_fileUploadSuccess":"function (res, file, fileList) {if(res.flag){}}"}//动态方法 会根据index-code.html的保存而变化
    this.vueMountedMethodName='';//页面初始化后执行的方法
}

IframeUi.prototype.resetMethods = function(){
    //默认的函数 多跟系统自动化处理有关 注意上面的也要同步
    this.methods={"focus":"function (e) {try {_t.fastKey.focusElem(e);}catch(e) {}}","_fileUploadSuccess":"function (res, file, fileList) {if(res.flag){}}"}//动态方法 会根据index-code.html的保存而变化
}
IframeUi.prototype.getMethods = function(){
    return this.methods;
}
IframeUi.prototype.resetVueMountedMethodName = function(){
    this.vueMountedMethodName='';
}

IframeUi.prototype.inject = function(SINGLETON){
    this.fastKey = SINGLETON.getFastKey();
    this.jsonFactory = SINGLETON.getJsonFactory();
}
/*返回vue数据*/
IframeUi.prototype.getVueData = function(){
    var root = this.jsonFactory.getRoot();
    var vueData = {};
    this.dealVmodel(vueData,root,null);
    return vueData;
}
/*返回vue数据映射*/
IframeUi.prototype.getVueDataMapping = function(){
    var root = this.jsonFactory.getRoot();
    var vueData = {};
    var mapping = {};//变量名：{node:,value:}
    this.dealVmodel(vueData,root,mapping);
    return {vueData:vueData,mapping:mapping};
}

IframeUi.prototype.getJavascript = function(){
    /*自动获取当前结构的跟节点*/
    var root = this.jsonFactory.getRoot();
    var vueData = {};
    this.dealVmodel(vueData,root);
    var vueDataStr = JSON.stringify(vueData);
    this.javascript = this.javascript.replace(/var vueData[\s\S]*?\/\/注意:vueDate布局器系统变量,请勿更改 此行以上代码不要更改或删除\/\//g,"var vueData = "+vueDataStr+";\n        //注意:vueDate布局器系统变量,请勿更改 此行以上代码不要更改或删除//");

    var vueMethodStr = []
    for(var key in this.methods){
        var method = [];
        var functionStr = this.methods[key];
        method.push(key);
        method.push(":");
        method.push(functionStr);
        vueMethodStr.push(method.join(''))
    }

    this.javascript = this.javascript.replace(/var vueMethod[\s\S]*?\/\/注意:vueMethod布局器自动维护的系统方法,请勿更改 此行以上代码不要更改或删除\/\//g,"var vueMethod = {"+vueMethodStr.join(',\n')+"\n};\n        //注意:vueMethod布局器自动维护的系统方法,请勿更改 此行以上代码不要更改或删除//");
    var name = this.vueMountedMethodName;
    var executeName = this.vueMountedMethodName;
    if(this.vueMountedMethodName && this.vueMountedMethodName.indexOf("(")!=-1){
        name = this.vueMountedMethodName.substring(0,this.vueMountedMethodName.indexOf("("));
    }else {
        executeName +="()";
    }
    var vueMountedContent = this.vueMountedMethodName?"if(vueMethod."+name+"){vueMethod."+executeName+"}":"";
    this.javascript = this.javascript.replace(/var vueMounted[\s\S]*?\/\/注意:vueMounted布局器自动维护的页面加载后执行的方法,请勿更改 此行以上代码不要更改或删除\/\//g,"var vueMounted = function(){"+vueMountedContent+"}\n        //注意:vueMounted布局器自动维护的页面加载后执行的方法,请勿更改 此行以上代码不要更改或删除//");

    return this.javascript;
}
IframeUi.prototype.setJavascript = function(javascript){
    if(javascript==null){//恢复一下默认脚本
        javascript = this.defaultJavascript;
    }
    this.javascript = javascript;
    this.jsonFactory.setJavascript(javascript);//额外在主面板备份一份
}
//这样不管怎么样都会有默认值 mapping:多放些数据给外面 比vueData的多一些
IframeUi.prototype.dealVmodel = function(vueData,node,mapping){
    var bind = node.magicalCoder.bind;
    if(typeof bind!='undefined'){
        for(var attrName in bind) {

            //默认的变量值 []
            var defaultVariableValue = bind[attrName];
            //用户配置的变量名 userName
            var userConfigVariableName = node.attributes[attrName];

            {//特殊处理来自特殊标签下的变量名 比如v-for
                if (attrName =='v-for'){
                    if(userConfigVariableName){
                        var reg = new RegExp("\\((.*),?(.*)\\)\\s+in\\s+(\\w+)");
                        if(reg.test(userConfigVariableName)){
                            reg.exec(userConfigVariableName);
                            userConfigVariableName = RegExp.$3;
                        }
                    }
                }
            }
            //自动放到vueData
            if(typeof userConfigVariableName !='undefined'
                && userConfigVariableName!==''
                &&userConfigVariableName.indexOf(".")==-1//v-for下的子变量里面才用. 不放进去
            ){
                //根据用户配置的字段属性 修正一下最终的取值类型
                var dbTypePrefix = "mc-db-type-";//此变量对应的数据类型前缀
                var dbTypeAttrName = dbTypePrefix+attrName;//mc-db-type-v-model
                var dbTypeAttrValue = node.attributes[dbTypeAttrName];//str int ...
                if(dbTypeAttrValue!==''){
                    //{"str":"字符串","int":"整数","long":"长整数","decimal":"小数","bool":"真假","date":"日期","array":"数组"}
                    if(typeof defaultVariableValue!='object'){//数组暂时不用改
                        switch (dbTypeAttrValue) {
                            case 'str':
                                if(typeof defaultVariableValue!='string'){//只有当默认值类型与用户所选类型不匹配 才考虑用新默认值
                                    vueData[userConfigVariableName] = '';
                                }
                                break;
                            case 'int':
                            case 'long':
                            case 'decimal':
                                if(typeof defaultVariableValue!='number') {
                                    vueData[userConfigVariableName] = 0;
                                }
                                break;
                            case 'bool':
                                if(typeof defaultVariableValue!='boolean'){
                                    vueData[userConfigVariableName] = false;
                                }
                                break;
                        }
                    }
                }
                vueData[userConfigVariableName] = defaultVariableValue;
                if(mapping!=null){
                    mapping[userConfigVariableName] = {node:node,value:defaultVariableValue,attrName:attrName};
                }
            }
        }
    }
    var children = node.magicalCoder.children;
    for(var i=0;i<children.length;i++){
        this.dealVmodel(vueData,children[i],mapping);
    }
}


/*此方法不要改名 初始化组件的方法 每次代码重绘 会调用此方法 来重新初始化组件*/
IframeUi.prototype.render=function (html,jsonFactory,globalConstant) {
    if(html==null){
        return;
    }
    var magicalDragScene = document.getElementById("magicalDragScene");
    if(typeof magicalDragScene == 'undefined' || magicalDragScene == null){
        document.getElementById("iframeBody").innerHTML = '<div class="drag-mc-pane" id="magicalDragScene" magical_-coder_-id="Root"></div>';
    }
    magicalDragScene = document.getElementById("magicalDragScene");
    magicalDragScene.innerHTML = "<template>"+html+"</template>";

    var javascript = this.getJavascript();

    try {
        if(this.debug){
            javascript = "debugger\n" + javascript;
        }
        //使用eval才行
        eval(javascript);
    }catch (e) {
        var msgHtml = '<div class="layui-row"><div class="layui-col-xs12" style="font-size: 17px; font-weight: bolder;">'+e.message+'</div><div class="layui-col-xs12" style="color: rgb(221, 32, 32);">'+e.stack+'</div></div>';
        parent.window.layui.layer.open({
            type:1,
            title:"您编写的脚本编译错误-非布局器报错",
            area: ['800px', '400px'],
            shadeClose:true,
            content:msgHtml,
        })

        console.log(e);
        eval("var Ctor = Vue.extend({});new Ctor().$mount('#magicalDragScene');");//容错
    }
    //做一些优化 比如删除一些不需要的结构
    this.deleteClasssNameWithoutChildrenDoms(["el-form-item__content","el-card__body"]);
}

IframeUi.prototype.deleteClasssNameWithoutChildrenDoms = function(classNames){
    for(var i=0;i<classNames.length;i++){
        var doms = document.getElementsByClassName(classNames[i]);
        if(doms && doms.length>0){
            for(var j=0;j<doms.length;j++){
                var children = doms[j].children;
                if(!children || children.length<=0){
                    if(this.ieVersion!=-1 && this.ieVersion!=100){
                        doms[j].removeNode(true);
                    }else {
                        doms[j].remove();
                    }
                }
            }
        }
    }

}

IframeUi.prototype.util = function(){
    var util = {
        removeClass:function (elem, str){
            var cName=elem.className;
            var arrClassName=cName.split(" ");
            var newArr=[ ];
            for(var i=0;i<arrClassName.length;i++){
                if(arrClassName[i]!=str){
                    newArr. push(arrClassName[i]);
                }
            }
            var str=newArr.join(" ");
            elem. className =str;
        }
    }
    return util;
}

IframeUi.prototype.iconList = function(){
    if(window.location.href.indexOf("from=icon_list")!=-1){
        var util = this.util();
        var iconArr = ['el-icon-platform-eleme','el-icon-eleme','el-icon-delete-solid','el-icon-delete','el-icon-s-tools','el-icon-setting','el-icon-user-solid','el-icon-user','el-icon-phone','el-icon-phone-outline','el-icon-more','el-icon-more-outline','el-icon-star-on','el-icon-star-off','el-icon-s-goods','el-icon-goods','el-icon-warning','el-icon-warning-outline','el-icon-question','el-icon-info','el-icon-remove','el-icon-circle-plus','el-icon-success','el-icon-error','el-icon-zoom-in','el-icon-zoom-out','el-icon-remove-outline','el-icon-circle-plus-outline','el-icon-circle-check','el-icon-circle-close','el-icon-s-help','el-icon-help','el-icon-minus','el-icon-plus','el-icon-check','el-icon-close','el-icon-picture','el-icon-picture-outline','el-icon-picture-outline-round','el-icon-upload','el-icon-upload2','el-icon-download','el-icon-camera-solid','el-icon-camera','el-icon-video-camera-solid','el-icon-video-camera','el-icon-message-solid','el-icon-bell','el-icon-s-cooperation','el-icon-s-order','el-icon-s-platform','el-icon-s-fold','el-icon-s-unfold','el-icon-s-operation','el-icon-s-promotion','el-icon-s-home','el-icon-s-release','el-icon-s-ticket','el-icon-s-management','el-icon-s-open','el-icon-s-shop','el-icon-s-marketing','el-icon-s-flag','el-icon-s-comment','el-icon-s-finance','el-icon-s-claim','el-icon-s-custom','el-icon-s-opportunity','el-icon-s-data','el-icon-s-check','el-icon-s-grid','el-icon-menu','el-icon-share','el-icon-d-caret','el-icon-caret-left','el-icon-caret-right','el-icon-caret-bottom','el-icon-caret-top','el-icon-bottom-left','el-icon-bottom-right','el-icon-back','el-icon-right','el-icon-bottom','el-icon-top','el-icon-top-left','el-icon-top-right','el-icon-arrow-left','el-icon-arrow-right','el-icon-arrow-down','el-icon-arrow-up','el-icon-d-arrow-left','el-icon-d-arrow-right','el-icon-video-pause','el-icon-video-play','el-icon-refresh','el-icon-refresh-right','el-icon-refresh-left','el-icon-finished','el-icon-sort','el-icon-sort-up','el-icon-sort-down','el-icon-rank','el-icon-loading','el-icon-view','el-icon-c-scale-to-original','el-icon-date','el-icon-edit','el-icon-edit-outline','el-icon-folder','el-icon-folder-opened','el-icon-folder-add','el-icon-folder-remove','el-icon-folder-delete','el-icon-folder-checked','el-icon-tickets','el-icon-document-remove','el-icon-document-delete','el-icon-document-copy','el-icon-document-checked','el-icon-document','el-icon-document-add','el-icon-printer','el-icon-paperclip','el-icon-takeaway-box','el-icon-search','el-icon-monitor','el-icon-attract','el-icon-mobile','el-icon-scissors','el-icon-umbrella','el-icon-headset','el-icon-brush','el-icon-mouse','el-icon-coordinate','el-icon-magic-stick','el-icon-reading','el-icon-data-line','el-icon-data-board','el-icon-pie-chart','el-icon-data-analysis','el-icon-collection-tag','el-icon-film','el-icon-suitcase','el-icon-suitcase-1','el-icon-receiving','el-icon-collection','el-icon-files','el-icon-notebook-1','el-icon-notebook-2','el-icon-toilet-paper','el-icon-office-building','el-icon-school','el-icon-table-lamp','el-icon-house','el-icon-no-smoking','el-icon-smoking','el-icon-shopping-cart-full','el-icon-shopping-cart-1','el-icon-shopping-cart-2','el-icon-shopping-bag-1','el-icon-shopping-bag-2','el-icon-sold-out','el-icon-sell','el-icon-present','el-icon-box','el-icon-bank-card','el-icon-money','el-icon-coin','el-icon-wallet','el-icon-discount','el-icon-price-tag','el-icon-news','el-icon-guide','el-icon-male','el-icon-female','el-icon-thumb','el-icon-cpu','el-icon-link','el-icon-connection','el-icon-open','el-icon-turn-off','el-icon-set-up','el-icon-chat-round','el-icon-chat-line-round','el-icon-chat-square','el-icon-chat-dot-round','el-icon-chat-dot-square','el-icon-chat-line-square','el-icon-message','el-icon-postcard','el-icon-position','el-icon-turn-off-microphone','el-icon-microphone','el-icon-close-notification','el-icon-bangzhu','el-icon-time','el-icon-odometer','el-icon-crop','el-icon-aim','el-icon-switch-button','el-icon-full-screen','el-icon-copy-document','el-icon-mic','el-icon-stopwatch','el-icon-medal-1','el-icon-medal','el-icon-trophy','el-icon-trophy-1','el-icon-first-aid-kit','el-icon-discover','el-icon-place','el-icon-location','el-icon-location-outline','el-icon-location-information','el-icon-add-location','el-icon-delete-location','el-icon-map-location','el-icon-alarm-clock','el-icon-timer','el-icon-watch-1','el-icon-watch','el-icon-lock','el-icon-unlock','el-icon-key','el-icon-service','el-icon-mobile-phone','el-icon-bicycle','el-icon-truck','el-icon-ship','el-icon-basketball','el-icon-football','el-icon-soccer','el-icon-baseball','el-icon-wind-power','el-icon-light-rain','el-icon-lightning','el-icon-heavy-rain','el-icon-sunrise','el-icon-sunrise-1','el-icon-sunset','el-icon-sunny','el-icon-cloudy','el-icon-partly-cloudy','el-icon-cloudy-and-sunny','el-icon-moon','el-icon-moon-night','el-icon-dish','el-icon-dish-1','el-icon-food','el-icon-chicken','el-icon-fork-spoon','el-icon-knife-fork','el-icon-burger','el-icon-tableware','el-icon-sugar','el-icon-dessert','el-icon-ice-cream','el-icon-hot-water','el-icon-water-cup','el-icon-coffee-cup','el-icon-cold-drink','el-icon-goblet','el-icon-goblet-full','el-icon-goblet-square','el-icon-goblet-square-full','el-icon-refrigerator','el-icon-grape','el-icon-watermelon','el-icon-cherry','el-icon-apple','el-icon-pear','el-icon-orange','el-icon-coffee','el-icon-ice-tea','el-icon-ice-drink','el-icon-milk-tea','el-icon-potato-strips','el-icon-lollipop','el-icon-ice-cream-square','el-icon-ice-cream-round']
        var html = [];
        html.push('<ul class="magicalcoder-extend-icons">')
        for(var i=0;i<iconArr.length;i++){
            html.push("<li><i class='"+iconArr[i]+"'></i></li>")
        }
        html.push('</ul>')
        document.getElementById("iframeBody").innerHTML = html.join('');

        var lis = document.getElementsByTagName("li");
        for(var i=0;i<lis.length;i++){
            lis[i].addEventListener('click',function () {
                var icon = this.childNodes[0]
                var active = true;
                if(icon.className.indexOf("active")==-1){
                    active = false;
                }
                var actives = document.getElementsByClassName("active");
                for(var j=0;j<actives.length;j++){
                    util.removeClass(actives[j],"active");
                }
                if(!active){
                    icon.className = icon.className +" active";
                }

            })
        }
        return true;
    }
    return false;
}
IframeUi.prototype.download = function(html){
    var head = '<head>\n    <meta charset="UTF-8">\n    <title>element-ui-代码由www.magicalcoder.com可视化布局器生成</title>\n    <link href="https://lib.baomitu.com/element-ui/2.10.1/theme-chalk/index.css" rel="stylesheet">   \n<script src="http://www.magicalcoder.com/assets/ui/element/2.10.1/browser.min.js"></script>   \n<script src="http://www.magicalcoder.com/assets/ui/element/2.10.1/browser-polyfill.min.js"></script>\n    <script src="https://lib.baomitu.com/json3/3.3.3/json3.min.js"></script>\n    <script src="https://lib.baomitu.com/vue/2.6.10/vue.min.js"></script>\n    <script src="https://lib.baomitu.com/element-ui/2.10.1/index.js"></script>\n    <script src="https://lib.baomitu.com/echarts/4.2.1/echarts.min.js"></script>\n    <script src="https://lib.baomitu.com/axios/latest/axios.min.js"></script>\n <script src="http://www.magicalcoder.com/assets/js/common.js"></script>\n</head>\n';
    var body = '<body style="background-color:#eee;padding: 20px;">\n        \n            <div id="magicalDragScene">\n                <template>\n                    '+html+'\n                </template>\n            </div>\n        \n            <script>\n                '+this.getJavascript()+'            </script>\n        </body>\n';
    body = body.replace("_t.fastKey.focusElem(e);",'');
    return {
        htmlBefore:"<!DOCTYPE html>\n<!--代码由www.magicalcoder.com可视化布局器拖拽生成-->\n",
        head:head,
        body:body,
        htmlEnd:"\n</html>",
    }
}
