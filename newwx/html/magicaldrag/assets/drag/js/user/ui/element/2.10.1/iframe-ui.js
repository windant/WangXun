/*每一种Ui的个性处理 比如各种组件初始化 重绘*/
function IframeUi() {
    this.ieVersion = ieVersion();
    this.defaultJavascript = '//ajax库采用axios\n' +
        '//调试:打开浏览器控制台(F12),在代码中某行增加 debugger 即可调试\n' +
        'var vueData = {\n' +
        '    "radioGroup": "",\n' +
        '    "checkboxGroup": []};\n' +
        '//注意:vueDate布局器系统变量,请勿更改 此行以上代码不要更改或删除//\n' +
        'var vueMethod = {\n' +
        '    //为了能协助布局器聚焦 element阻止了冒泡\n' +
        '    focus: function (e) {\n' +
        '        try {\n' +
        '            _t.fastKey.focusElem(e);\n' +
        '        }catch(e) {}//开发阶段别删除此行代码\n' +
        '    }\n' +
        '}\n' +
        'var myMethod = {}\n' +
        'for (var key in myMethod) {\n' +
        '    vueMethod[key] = myMethod[key];\n' +
        '}\n' +
        '/*您自定义的变量,可以在此处覆盖vueData提供的变量 参照element ui文档*/\n' +
        'var myData = {}\n' +
        '/*把您定义的数据覆盖布局器自动识别的变量,考虑到兼容性，请下载查看head中重写的assign方法*/\n' +
        'Object.assign(vueData, myData);\n' +
        'var _t = this;\n' +
        'var Ctor = Vue.extend({\n' +
        '    //提前绑定的变量\n' +
        '    data: function() {\n' +
        '        return vueData;\n' +
        '    },\n' +
        '    //页面加载完 会执行方法 可以做一些初始化操作\n' +
        '    mounted: function () {},\n' +
        '    /*当前页面绑定的方法集合 与布局器节点一一映射即可 参照element ui文档*/\n' +
        '    methods: vueMethod\n' +
        '});\n' +
        'new Ctor().$mount(\'#magicalDragScene\');\n' +
        '// 基于准备好的dom，初始化echarts实例 如果您未使用echarts 请将此模块代码删除 此模块提供示例给需要嵌入布局器到项目中并自动完成统计功能的用户\n' +
        'var echartsBars = document.getElementsByClassName(\'echarts-bar\');\n' +
        'if (echartsBars && echartsBars.length > 0) {\n' +
        '    for (var i = 0; i < echartsBars.length; i++) {\n' +
        '        var myChart = echarts.init(echartsBars[i]);\n' +
        '        // 指定图表的配置项和数据\n' +
        '        var option = {\n' +
        '            title: {\n' +
        '                text: \'集成ECharts 入门示例\'\n' +
        '            },\n' +
        '            tooltip: {},\n' +
        '            legend: {\n' +
        '                data: [\'销量\']\n' +
        '            },\n' +
        '            xAxis: {\n' +
        '                data: ["衬衫",\n' +
        '                    "羊毛衫",\n' +
        '                    "雪纺衫",\n' +
        '                    "裤子",\n' +
        '                    "高跟鞋",\n' +
        '                    "袜子"]\n' +
        '            },\n' +
        '            yAxis: {},\n' +
        '            series: [{\n' +
        '                name: \'销量\',\n' +
        '                type: \'bar\',\n' +
        '                data: [5,\n' +
        '                    20,\n' +
        '                    36,\n' +
        '                    10,\n' +
        '                    10,\n' +
        '                    20]\n' +
        '            }]\n' +
        '        };\n' +
        '        // 使用刚指定的配置项和数据显示图表。\n' +
        '        myChart.setOption(option);\n' +
        '    }\n' +
        '}\n' +
        '//echarts 初始化完成';
    this.javascript = this.defaultJavascript;
    //是否开启javascript调试
    this.debug = false;
}

IframeUi.prototype.inject = function(SINGLETON){
    this.fastKey = SINGLETON.getFastKey();
    this.jsonFactory = SINGLETON.getJsonFactory();
}

IframeUi.prototype.getJavascript = function(){
    /*自动获取当前结构的跟节点*/
    var root = this.jsonFactory.getRoot();
    var vueData = {};
    this.dealVmodel(vueData,root);
    var vueDataStr = JSON.stringify(vueData);
    this.javascript = this.javascript.replace(/var vueData[\s\S]*?\/\/注意:vueDate布局器系统变量,请勿更改 此行以上代码不要更改或删除\/\//g,"var vueData = "+vueDataStr+";\n        //注意:vueDate布局器系统变量,请勿更改 此行以上代码不要更改或删除//");
    return this.javascript;
}
IframeUi.prototype.setJavascript = function(javascript){
    if(javascript==null){//恢复一下默认脚本
        javascript = this.defaultJavascript;
    }
    this.javascript = javascript;
    this.jsonFactory.setJavascript(javascript);//额外在主面板备份一份
}
//这样不管怎么样都会有默认值
IframeUi.prototype.dealVmodel = function(vueData,node){
    var bind = node.magicalCoder.bind;
    if(typeof bind!='undefined'){
        for(var variableName in bind){
            //默认的变量值 []
            var defaultVariableValue = bind[variableName];
            //用户配置的变量名 userName
            var userConfigVariableName = node.attributes[variableName];
            //自动放到vueData
            if(typeof userConfigVariableName !='undefined' && userConfigVariableName!==''){
                vueData[userConfigVariableName] = defaultVariableValue;
                //根据用户配置的字段属性 修正一下最终的取值类型
                var dbTypePrefix = "mc-db-type-";//此变量对应的数据类型前缀
                var dbTypeAttrName = dbTypePrefix+variableName;//mc-db-type-v-model
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
            }
        }
    }
    var children = node.magicalCoder.children;
    for(var i=0;i<children.length;i++){
        this.dealVmodel(vueData,children[i]);
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
        eval("var Ctor = Vue.extend({});new Ctor().$mount('#magicalDragScene');");//兼容一下js错误 给出渲染界面
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
                    if(this.ieVersion!=-1 && this.ieVersion!=100){//ie
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
    var head = '<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">\n    <title>element-ui-代码由www.magicalcoder.com可视化布局器生成</title>\n    <link href="https://lib.baomitu.com/element-ui/2.10.1/theme-chalk/index.css" rel="stylesheet">\n    <script src="https://lib.baomitu.com/json3/3.3.3/json3.min.js"></script>\n    <script src="https://lib.baomitu.com/vue/2.6.10/vue.min.js"></script>\n    <script src="https://lib.baomitu.com/element-ui/2.10.1/index.js"></script>\n    <script src="https://lib.baomitu.com/echarts/4.2.1/echarts.min.js"></script>\n    <script src="https://lib.baomitu.com/axios/latest/axios.min.js"></script>\n    <script>\n       if (typeof Object.assign != "function") {\n        Object.assign = function(target) {\n            "use strict";\n            if (target == null) {\n                throw new TypeError("Cannot convert undefined or null to object");\n            }\n    \n            target = Object(target);\n            for (var index = 1; index < arguments.length; index++) {\n                var source = arguments[index];\n                if (source != null) {\n                    for (var key in source) {\n                        if (Object.prototype.hasOwnProperty.call(source, key)) {\n                            target[key] = source[key];\n                        }\n                    }\n                }\n            }\n            return target;\n        };\n    }</script>\n<!--请自行下载www.magicalcoder.com/assets/js/common.js--></head>\n';
    var body = '<body style="background-color:#eee;padding: 20px;">\n        \n            <div id="magicalDragScene">\n                <template>\n                    '+html+'\n                </template>\n            </div>\n        \n            <script>\n                '+this.getJavascript()+'            </script>\n        </body>\n';
    body = body.replace("_t.fastKey.focusElem(e);",'');
    return {
        htmlBefore:"<!DOCTYPE html>\n<!--代码由www.magicalcoder.com可视化布局器拖拽生成-->\n",
        head:head,
        body:body,
        htmlEnd:"\n</html>",
    }
}
