var $ = layui.jquery,layer=layui.layer;
function IframeUi() {
    //默认脚本
    this.defaultJavascript = '//以下脚本为标签属性转换成layui组件的还原过程\n//调试:打开浏览器控制台(F12),在代码中某行增加 debugger 即可调试\n        var $ = layui.jquery\n        ,laytpl = layui.laytpl\n        ,laydate = layui.laydate\n        ,form=layui.form\n        ,layedit = layui.layedit\n        ,slider=layui.slider\n        ,element=layui.element\n        ,colorpicker=layui.colorpicker\n        ,upload=layui.upload\n        ,rate=layui.rate\n        ,carousel=layui.carousel\n        ,table=layui.table\n        ,flow=layui.flow;\n        var magicalDragLayuiUtil = {\n        rebuildLayUiControls: function () {\n            var _t = this;\n            //日期\n            $(".magicalcoder-laydate").each(function (idx, item) {\n                laydate.render(_t.iteratorAttr({elem: item}, item));\n            })\n            //富文本\n            $(".magicalcoder-layedit").each(function (idx, item) {\n                var mcDataId = $(item).attr("id");\n                if (mcDataId) {\n                    layedit.build(mcDataId, {\n                        height: 300\n                    });\n                }\n            })\n            //外键\n            $(".magicalcoder-foreign-select2").each(function (idx, item) {\n                var mcDataId = $(item).attr("id");\n                if (mcDataId) {\n                    $("#" + mcDataId).select2({\n                        allowClear: true,\n                        width: "150px",\n                        delay: 500,\n                    });\n                }\n            })\n            //颜色选择器\n            $(".magicalcoder-color-picker").each(function (idx, item) {\n                colorpicker.render(_t.iteratorAttr({elem: $(item)}, item));\n            })\n            //上传组件\n            $(".magicalcoder-layupload").each(function (idx, item) {\n                upload.render(_t.iteratorAttr({elem: $(item)}, item));\n            })\n            //滑块\n            $(".magicalcoder-slider").each(function (idx, item) {\n                slider.render(_t.iteratorAttr({elem: $(item)}, item));\n            })\n            //评分\n            $(".magicalcoder-rate").each(function (idx, item) {\n                rate.render(_t.iteratorAttr({elem: $(item)}, item));\n            })\n            //轮播\n            $(".layui-carousel").each(function (idx, item) {\n                carousel.render(_t.iteratorAttr({elem: $(item)}, item));\n            })\n            //流加载\n            $(".magicalcoder-flow").each(function (idx, item) {\n                flow.load(_t.iteratorAttr({elem: $(item)}, item));\n            })\n            //代码\n            $(".magicalcoder-code").each(function (idx, item) {\n                layui.code(_t.iteratorAttr({elem: $(item)}, item));\n            })\n            //弹窗\n            $(".magicalcoder-layer").each(function (idx, item) {\n                //先隐藏起来\n                $(this).next().hide();\n                $(this).click(function () {\n                    var config = _t.iteratorAttr({elem: $(item)}, item);\n                    var type = config.type;\n                    if (type + \'\' == 1) {\n                        config.content = $(this).next();\n                    }\n                    if (config.btn) {\n                        config.btn = config.btn.split(",")\n                    }\n                    if (config.area) {\n                        config.area = config.area.split(",")\n                    }\n                    layer.open(config)\n                })\n            })\n            //动态表格 我们单独封装了layui-table的初始化方式 至于数据排序 返回格式 等操作请根据你的具体环境自行封装\n            $(".magicalcoder-table").each(function (idx, item) {\n                var cols = [];\n                //读取列配置\n                $(this).find(".magicalcoder-table-th").each(function (i, th) {\n                    cols.push(_t.iteratorAttr({title: $(this).text()}, th));\n                })\n                var tableConfig = _t.iteratorAttr({elem: $(item), cols: [cols]}, item);\n                //初始化表格 至于返回的数据格式 您可以根据自己的系统自行改造 这里仅做一个示例 参考js\\\\data\\\\list.json\n                table.render(tableConfig);\n            })\n            //部分组件初始化\n            element.init();\n            //表单初始化\n            form.render();\n        },\n        //将标签上的属性 转换成layui函数初始化时的参数名:参数值\n        iteratorAttr: function (renderConfig, dom) {\n            var attrs = dom.attributes;\n            for (var i = 0; i < attrs.length; i++) {\n                var attr = attrs[i];\n                var name = attr.name;\n                var value = attr.value;\n                if (name.indexOf("mc-") === 0) {\n                    name = name.replace("mc-attr-", \'\');\n                    name = name.replace("mc-event-", \'\');\n                    if (name.indexOf(\'str-\') === 0) {\n                        name = name.replace(\'str-\', \'\');\n                    } else if (name.indexOf(\'bool-\') === 0) {\n                        name = name.replace(\'bool-\', \'\');\n                        value == \'true\' || value === \'\' ? value = true : value = value;\n                        value == \'false\' ? value = false : value = value;\n                    } else if (name.indexOf(\'num-\') === 0) {\n                        name = name.replace(\'num-\', \'\');\n                        if (value !== \'\' && !isNaN(value)) {\n                            value = parseFloat(value);\n                        }\n                    } else if (name.indexOf(\'json-\') === 0) {\n                        name = name.replace(\'json-\', \'\');\n                        if (value !== \'\') {\n                            value = JSON.parse(value);\n                        }\n                    }\n                    renderConfig[this.htmlAttrNameToTuoFeng(name)] = value;\n                }\n            }\n            return renderConfig;\n        },\n\t    //user-name -> userName html上的标签名转换成驼峰名称\n        htmlAttrNameToTuoFeng: function (name) {\n            var arr = name.split("-");\n            var newArr = []\n            for (var i = 0; i < arr.length; i++) {\n                if (i != 0) {\n                    if (arr[i] != \'\') {\n                        newArr.push(this.firstCharToUpLower(arr[i]));\n                    }\n                } else {\n                    newArr.push(arr[i]);\n                }\n            }\n            return newArr.join(\'\');\n        },\n        //首字母大写\n        firstCharToUpLower: function (name) {\n            var arr = name.split("");\n            arr[0] = arr[0].toUpperCase();\n            return arr.join(\'\');\n        },\n        //初始化图表 如果您未使用echarts可以删除此方法\n        renderEcharts: function () {\n            // 基于准备好的dom，初始化echarts实例\n            var echartsBars = document.getElementsByClassName(\'echarts-bar\');\n            if (echartsBars && echartsBars.length > 0) {\n                for (var i = 0; i < echartsBars.length; i++) {\n                    var myChart = echarts.init(echartsBars[i]);\n                    // 指定图表的配置项和数据\n                    var option = {\n                        title: {\n                            text: \'集成ECharts 入门示例\'\n                        },\n                        tooltip: {},\n                        legend: {\n                            data: [\'销量\']\n                        },\n                        xAxis: {\n                            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]\n                        },\n                        yAxis: {},\n                        series: [{\n                            name: \'销量\',\n                            type: \'bar\',\n                            data: [5, 20, 36, 10, 10, 20]\n                        }]\n                    };\n                    // 使用刚指定的配置项和数据显示图表。\n                    myChart.setOption(option);\n                }\n            }\n        }\n    }\n    magicalDragLayuiUtil.rebuildLayUiControls();\n    magicalDragLayuiUtil.renderEcharts();';
    //布局器的脚本
    this.javascript = this.defaultJavascript;
    //是否开启javascript调试
    this.debug = false;

}

IframeUi.prototype.inject = function(SINGLETON){
    this.fastKey = SINGLETON.getFastKey();
    this.jsonFactory = SINGLETON.getJsonFactory();
}

IframeUi.prototype.getJavascript = function(){
    return this.javascript;
}
IframeUi.prototype.setJavascript = function(javascript){
    if(javascript==null){//恢复一下默认脚本
        javascript = this.defaultJavascript;
    }
    this.javascript = javascript;
    this.jsonFactory.setJavascript(javascript);//额外在主面板备份一份
}


/*此方法不要改名 初始化组件的方法 每次代码重绘 会调用此方法 来重新初始化组件*/
IframeUi.prototype.render=function (html,jsonFactory,globalConstant) {
    if(html==null){
        html = "";
    }
    var magicalDragScene = document.getElementById("magicalDragScene");
    if(typeof magicalDragScene == 'undefined' || magicalDragScene == null){
        document.getElementById("iframeBody").innerHTML = '<div class="drag-mc-pane" id="magicalDragScene" magical_-coder_-id="Root"></div>';
    }
    //追加结构 支持结构中掺杂script标签
    $("#magicalDragScene").html(html);

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
        var iconArr = ["layui-icon-rate-half","layui-icon-rate","layui-icon-rate-solid","layui-icon-cellphone","layui-icon-vercode","layui-icon-login-wechat","layui-icon-login-qq","layui-icon-login-weibo","layui-icon-password","layui-icon-username","layui-icon-refresh-3","layui-icon-auz","layui-icon-spread-left","layui-icon-shrink-right","layui-icon-snowflake","layui-icon-tips","layui-icon-note","layui-icon-home","layui-icon-senior","layui-icon-refresh","layui-icon-refresh-1","layui-icon-flag","layui-icon-theme","layui-icon-notice","layui-icon-website","layui-icon-console","layui-icon-face-surprised","layui-icon-set","layui-icon-template-1","layui-icon-app","layui-icon-template","layui-icon-praise","layui-icon-tread","layui-icon-male","layui-icon-female","layui-icon-camera","layui-icon-camera-fill","layui-icon-more","layui-icon-more-vertical","layui-icon-rmb","layui-icon-dollar","layui-icon-diamond","layui-icon-fire","layui-icon-return","layui-icon-location","layui-icon-read","layui-icon-survey","layui-icon-face-smile","layui-icon-face-cry","layui-icon-cart-simple","layui-icon-cart","layui-icon-next","layui-icon-prev","layui-icon-upload-drag","layui-icon-upload","layui-icon-download-circle","layui-icon-component","layui-icon-file-b","layui-icon-user","layui-icon-find-fill","layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop","layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop","layui-icon-add-1","layui-icon-play","layui-icon-pause","layui-icon-headset","layui-icon-video","layui-icon-voice","layui-icon-speaker","layui-icon-fonts-del","layui-icon-fonts-code","layui-icon-fonts-html","layui-icon-fonts-strong","layui-icon-unlink","layui-icon-picture","layui-icon-link","layui-icon-face-smile-b","layui-icon-align-left","layui-icon-align-right","layui-icon-align-center","layui-icon-fonts-u","layui-icon-fonts-i","layui-icon-tabs","layui-icon-radio","layui-icon-circle","layui-icon-edit","layui-icon-share","layui-icon-delete","layui-icon-form","layui-icon-cellphone-fine","layui-icon-dialogue","layui-icon-fonts-clear","layui-icon-layer","layui-icon-date","layui-icon-water","layui-icon-code-circle","layui-icon-carousel","layui-icon-prev-circle","layui-icon-layouts","layui-icon-util","layui-icon-templeate-1","layui-icon-upload-circle","layui-icon-tree","layui-icon-table","layui-icon-chart","layui-icon-chart-screen","layui-icon-engine","layui-icon-triangle-d","layui-icon-triangle-r","layui-icon-file","layui-icon-set-sm","layui-icon-add-circle","layui-icon-404","layui-icon-about","layui-icon-up","layui-icon-down","layui-icon-left","layui-icon-right","layui-icon-circle-dot","layui-icon-search","layui-icon-set-fill","layui-icon-group","layui-icon-friends","layui-icon-reply-fill","layui-icon-menu-fill","layui-icon-log","layui-icon-picture-fine","layui-icon-face-smile-fine","layui-icon-list","layui-icon-release","layui-icon-ok","layui-icon-help","layui-icon-chat","layui-icon-top","layui-icon-star","layui-icon-star-fill","layui-icon-close-fill","layui-icon-close","layui-icon-ok-circle","layui-icon-add-circle-fine","layui-icon-table","layui-icon-upload","layui-icon-slider"]
        var html = [];
        html.push('<ul class="magicalcoder-extend-icons">')
        for(var i=0;i<iconArr.length;i++){
            html.push("<li><i class='layui-icon "+iconArr[i]+"'></i></li>")
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
/*下载代码*/
IframeUi.prototype.download = function(html){
    var layuiTable = '<!--layui的table col操作列自定义的模板 您可以根据自己的实际情况改动-->\n  <script type="text/html" id="tableToolbar">\n    <div class="layui-inline" lay-event="add"><i class="layui-icon layui-icon-add-1"></i></div>\n    <div class="layui-inline" lay-event="update"><i class="layui-icon layui-icon-edit"></i></div>\n    <div class="layui-inline" lay-event="delete"><i class="layui-icon layui-icon-delete"></i></div>\n  </script>\n';
    var layuiTableCols = '  <script type="text/html" id="tableColToolbar">\n    <a class="layui-btn layui-btn-xs" lay-event="detail">查看</a>\n    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>\n    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>\n  </script>\n';
    var head = '<head>\n  <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">\n  <title>layui</title>\n  <link rel="stylesheet" type="text/css" href="https://www.layuicdn.com/layui-v2.5.4/css/layui.css" />\n  <script src="https://lib.baomitu.com/json3/3.3.3/json3.min.js"></script>\n  <script src="https://www.layuicdn.com/layui-v2.5.4/layui.all.js"></script>\n  <script src="https://lib.baomitu.com/echarts/4.2.1/echarts.min.js"></script>\n'+layuiTable+layuiTableCols+'</head>\n';
    var body = '<body class="layui-form" style="background-color:#eee;padding: 20px;">'+html+'<script>'+this.getJavascript()+'\n            </script>\n    </body>\n';
    return {
        htmlBefore:"<!DOCTYPE html>\n<!--代码由www.magicalcoder.com可视化布局器拖拽生成-->\n",
        head:head,
        body:body,
        htmlEnd:"\n</html>",
    }
}
