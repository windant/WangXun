function ExtendHrefParams(paramList){
    this.paramList = paramList;
}

ExtendHrefParams.prototype.render = function(){
    var _t = this;
    $("._pageParamAdd").click(function () {
        _t.addLine();
    })
    $("._pageParamDelete").click(function () {
        $(this).parent().parent().parent().remove();
    })
}

ExtendHrefParams.prototype.addLine = function(){
    $("._pageParamRow").append($(this.lineTemplate({name:'',value:''})))
    $("._pageParamDelete").click(function () {
        $(this).parent().parent().parent().remove();
    })
}


ExtendHrefParams.prototype.template = function () {
    var toolbar = '<div class="layui-row layui-col-space10" style="padding:20px 20px 0px 20px;width: 95%;">\n' +
        '    <div class=" layui-col-xs12">\n' +
        '        <a class="layui-btn layui-btn-normal _pageParamAdd" style="margin-bottom: 4px;">新增</a>\n' +
        '    </div>\n' +
        '    <div class=" layui-col-xs5">\n' +
        '        参数名\n' +
        '    </div>\n' +
        '    <div class=" layui-col-xs5">\n' +
        '        测试参数:开发中可动态传参此值便无效\n' +
        '    </div>\n' +
        '    <div class=" layui-col-xs2">\n' +
        '        操作\n' +
        '    </div>\n' +
        '</div>';
    var linesHtml = [];
    if(this.paramList){
        for(var i=0;i<this.paramList.length;i++){
            linesHtml.push(this.lineTemplate(this.paramList[i]));
        }
    }
    var line = '<div class="layui-row layui-col-space10 _pageParamRow" style="padding:20px;width: 95%;">'+linesHtml.join("")+'</div>';
    return toolbar+line;
}
ExtendHrefParams.prototype.lineTemplate = function (param) {
    return  '<div class="layui-col-xs12"><div class="layui-row layui-col-space10">\n' +
        '            <div class=" layui-col-xs5">\n' +
        '                <input class="layui-input _paramName" type="text" autocomplete="off" value="'+param.name+'"/>\n' +
        '            </div>\n' +
        '            <div class=" layui-col-xs5">\n' +
        '                <input class="layui-input _paramValue" type="text" autocomplete="off" value="'+param.value+'"/>\n' +
        '            </div>\n' +
        '            <div class=" layui-col-xs2">\n' +
        '                <a class="layui-btn layui-btn-sm layui-btn-danger _pageParamDelete">删除</a>\n' +
        '            </div>\n' +
        '        </div></div>\n';
}

ExtendHrefParams.prototype.getData = function () {
    var paramList = []
    var lines = $("._pageParamRow").children();
    if(lines.length>0){
        for(var i=0;i<lines.length;i++){
            var line = $(lines[i]);
            var name = line.find("._paramName").val();
            var value = line.find("._paramValue").val();
            if(name){
                paramList.push({name:name,value:value})
            }
        }
    }
    return paramList;
}
