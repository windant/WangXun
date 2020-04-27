/*翻译代码 把配置的可视化方法转换成js代码*/
function CodeTranslate(rootNode,pageParams) {
    this.rootNode = rootNode;
    this.pageParams = pageParams;
    this.functionParams = pageParams.rightPanelItemObj.functionParams||[];
    this.lowCodeUtil = new LowCodeUtil();
    this.lowCodeConstant = new LowCodeConstant();
    this.nodeMap = this.lowCodeUtil.nodeUtil.nodeToMap(rootNode);
    this.code = CODE;
}

CodeTranslate.prototype.functionParamsStr = function(){
    var arr = [];
    var methodParams = this.pageParams.extra.methodParams;
    if(methodParams && methodParams.length>0){
        for(var i=0;i<methodParams.length;i++){
            arr.push("_param"+(i+1));
        }
    }else {
        for(var i=0;i<this.functionParams.length;i++){
            var param = this.functionParams[i];
            arr.push(param.name);
        }
    }
    return arr.join(',');
}

CodeTranslate.prototype.translate = function () {
    var javaScriptArr = [];
    javaScriptArr.push("function("+this.functionParamsStr()+"){var _this = this;");
    for(var i=0;i< this.rootNode.magicalCoder.children.length;i++){
        var node = this.rootNode.magicalCoder.children[i];
        this.nodeToHtml(javaScriptArr,node);
    }
    javaScriptArr.push("}");
    return javaScriptArr.join("")
}

CodeTranslate.prototype.nodeToHtml = function (javaScriptArr,node) {
    javaScriptArr.push(this.startTag(node));
    var children = node.magicalCoder.children;
    if(children.length>0){
        for(var i=0;i<children.length;i++){
            this.nodeToHtml(javaScriptArr,children[i]);
        }
    }
    javaScriptArr.push(this.endTag(node));
}

CodeTranslate.prototype.buildUrl = function(url){
    if(url.startsWith("http")){
        return "\""+url+"\"";
    }else {
        return "commonUtil.ctx+\""+url+"\"";
    }
}

CodeTranslate.prototype.startTag = function (node) {
    var jsArr = [];
    var identifier = node.magicalCoder.identifier;
    switch (identifier) {
        case 'mc-method-base':
        case 'mc-method-base-method-name':
        case 'mc-method-base-method-description':
            break;
        case 'mc-if':
            jsArr.push("if");
            break;
        case 'mc-else-if':
            jsArr.push("else if");
            break;
        case 'mc-else':
            jsArr.push("else");
            break;
        case 'mc-condition-groups':
            jsArr.push("(");
            break;
        case 'mc-block':
        case 'mc-if-execute':
            jsArr.push("{");
            break;
        case 'mc-line':
            jsArr.push("\n");
            break;
        case 'mc-util-parse-int':
            jsArr.push("parseInt(");
            break;
        case 'mc-util-parse-float':
            jsArr.push("parseFloat(");
            break;
        case 'mc-util-alert':
            jsArr.push("alert(");
            break;
        case 'mc-util-reload':
            jsArr.push("window.location.reload();");
            break;
        case 'mc-ajax':
            jsArr.push('axios({');
            break;
        case 'mc-ajax-url':
            jsArr.push("url:");
            jsArr.push(this.buildUrl(this.inputValue(node)));
            jsArr.push(",");
            break;
        case 'mc-ajax-method':
            jsArr.push("method:\"");
            var method = this.inputValue(node);
            if(method===''){
                method = 'post';
            }
            jsArr.push(method);
            jsArr.push("\",");
            break;
        case 'mc-ajax-params':
            var parentNode = this.nodeMap[node.magicalCoder.parentId];
            var methodNode = this.lowCodeUtil.nodeUtil.pubSearchFirstNode(parentNode,{identifier:'mc-ajax-method'});
            if(methodNode){
                var method = this.inputValue(methodNode);
                if(method == 'get'){
                    jsArr.push("params:{");
                }else {
                    jsArr.push("data:{");
                }
            }
            break;
        case 'mc-ajax-param':
            jsArr.push(this.ajaxParam(node));
            break;
        case 'mc-ajax-thens':
            jsArr.push("}).then(function(response) {var _res = response.data;\nif(!_res.flag){\n_vueThis.$message.error(_res.desc);\nreturn;}\n");
            break;
        case 'mc-ajax-then-page-field-not-array':
        case 'mc-ajax-then-page-field-array':
        case 'mc-ajax-then-page-field-page-total':
            jsArr.push(this.inputValue(node));
            break;
        case 'mc-ajax-then-return-name':
            // jsArr.push("_res.");
            jsArr.push(this.inputValue(node));
            break;
        case 'mc-ajax-then-translates':
            var returnType = node.attributes['mc-return-type'];
            switch (returnType) {
                case 'list':
                    jsArr.push('if(_res.data){\n for(var n=0;n<_res.data.length;n++){\nvar entity=_res.data[n];\n');
                    break;
                case 'entity':
                    jsArr.push('if(_res.data){\nvar entity=_res.data;\n');
                    break;
            }
            break;
        case 'mc-ajax-then-translate'://翻译列表
            var dataName = node.attributes['mc-data-name'];
            var dataMap = node.attributes['mc-data-map'];
            jsArr.push('if(typeof entity["'+dataName+'"]!="undefiend"){');
            jsArr.push('var map =');
            jsArr.push(this.lowCodeUtil.xssUtil.unEscapeXss(dataMap));
            jsArr.push(";\n");
            jsArr.push('entity.'+dataName+'=map[""+entity.'+dataName+'];');
            jsArr.push('}\n');
            break;
        case 'mc-href-url':
            jsArr.push("window.location.href=");
            jsArr.push(this.buildUrl(this.inputValue(node)));
            jsArr.push("");
            break;
        case 'mc-href-params':
            jsArr.push(this.hrefParam(node));
            break;
        case 'mc-compare-operator':
            var text = this.lowCodeUtil.nodeUtil.pubGetNodeContent(node);
            var realCompare = this.lowCodeConstant.codeCompare[text]||'';
            jsArr.push(realCompare);
            break;
        case 'mc-logic-and':
        case 'mc-logic-or':
        case 'mc-logic-not':
            var text = this.lowCodeUtil.nodeUtil.pubGetNodeContent(node);
            var realCompare = this.lowCodeConstant.logic[text]||'';
            jsArr.push(realCompare);
            break;
        case 'mc-math':
            jsArr.push('(');
            break;
        case 'mc-defined':
            jsArr.push("var ");
            break;
        case 'mc-kuo-pair':
            jsArr.push("(");
            break;
        default:
            jsArr.push(this.getNodeContent(node));//取内部文本
    }
    return jsArr.join('');
}

CodeTranslate.prototype.endTag = function (node) {
    var jsArr = [];
    var identifier = node.magicalCoder.identifier;
    switch (identifier) {
        case 'mc-condition-groups':
            jsArr.push(")");
            break;
        case 'mc-block':
        case 'mc-if-execute':
            jsArr.push("}\n");
            break;
        case 'mc-line':
            jsArr.push(";\n");
            break;
        case 'mc-util-parse-int':
            jsArr.push(")");
            break;
        case 'mc-util-parse-float':
            jsArr.push(")");
            break;
        case 'mc-util-alert':
            jsArr.push(");");
            break;
        case 'mc-ajax-params':
            jsArr.push("},");
            break;
        case 'mc-ajax-then':
            jsArr.push(";\n");
            break;
        case 'mc-ajax-thens':
            jsArr.push("});\n");
            break;
        case 'mc-ajax-then-translates':
            var returnType = node.attributes['mc-return-type'];
            switch (returnType) {
                case 'list':
                    jsArr.push('}}\n')
                    break;
                case 'entity':
                    jsArr.push('}\n')
                    break;
            }
            break;
        case 'mc-href':
            jsArr.push(";\n");
            break;
        case 'mc-math':
            jsArr.push(')');
            break;
        case 'mc-set':
            jsArr.push(";\n");
            break;
        case 'mc-defined':
            jsArr.push(";\n");
            break;
        case 'mc-kuo-pair':
            jsArr.push(")");
            break;
    }
    return jsArr.join('');
}

CodeTranslate.prototype.getNodeContent = function (node) {
    var parentNode = this.nodeMap[node.magicalCoder.parentId];
    if(parentNode){
        var parentIdentifier = parentNode.magicalCoder.identifier;
        switch (parentIdentifier) {
            case 'mc-compare-operator':
            case 'mc-logic-and':
            case 'mc-logic-or':
            case 'mc-logic-not':
                return '';
        }
    }
    var jsArr = [];
    if(node.magicalCoder.nodeType==3){
        jsArr.push(this.lowCodeUtil.xssUtil.unEscapeXss(node.magicalCoder.textContent));
    }
    return jsArr.join('');
}
CodeTranslate.prototype.inputValue = function(node){
    return this.lowCodeUtil.xssUtil.unEscapeXss(node.attributes['value'])||'';
}

CodeTranslate.prototype.ajaxParam = function (node) {
    var nameNode = this.lowCodeUtil.nodeUtil.pubSearchFirstNode(node,{identifier:'mc-ajax-param-name'});
    var valueNode = this.lowCodeUtil.nodeUtil.pubSearchFirstNode(node,{identifier:'mc-ajax-param-value'});
    var totalNode = this.lowCodeUtil.nodeUtil.pubSearchFirstNode(node,{identifier:'mc-find-page-total-count'});
    var limitNode = this.lowCodeUtil.nodeUtil.pubSearchFirstNode(node,{identifier:'mc-find-page-limit'});
    var pageNumNode = this.lowCodeUtil.nodeUtil.pubSearchFirstNode(node,{identifier:'mc-find-page-num'});
    var jsArr = [];
    jsArr.push(this.inputValue(nameNode));
    jsArr.push(":");
    var value='';
    if(valueNode){
        var isVariable = valueNode.attributes['mc-is-variable'];
        value = this.inputValue(valueNode);
        if(!isVariable){
            value = "\""+value+"\"";
        }

    }else if(totalNode){
        value = this.inputValue(totalNode);
        if(value+''=='true'){
            value = true;
        }else {
            value = false;
        }
    }else if(limitNode){
        value = this.inputValue(limitNode);
        if(value){
            value = parseInt(value);//
        }
    }else if(pageNumNode){
        value = this.inputValue(pageNumNode);
    }

    jsArr.push(value);
    jsArr.push(",");
    return jsArr.join('');
}
CodeTranslate.prototype.hrefParam = function (node) {
    var arr = [];
    var params = node.magicalCoder.children;
    for(var i=0;i<params.length;i++){
        var param = params[i];
        var nameNode = this.lowCodeUtil.nodeUtil.pubSearchFirstNode(param,{identifier:'mc-href-param-name'});
        var valueNode = this.lowCodeUtil.nodeUtil.pubSearchFirstNode(param,{identifier:'mc-href-param-value'});
        var name = this.inputValue(nameNode);
        var value = this.inputValue(valueNode);
        var isVariable = valueNode.attributes['mc-is-variable'];
        if(name){
            if(isVariable){//变量
                var template = "'%n='+%v";
                if(i>0){
                    template="'&%n='+%v";
                }
                arr.push(template.replace("%n",name).replace("%v",value));
            }else {//常量
                var template = "'%n=%v'";
                if(i>0){
                    template = "'&%n=%v'";
                }
                arr.push(template.replace("%n",name).replace("%v",value));
            }
        }
    }
    if(arr.length>0){
        return "+'?'+"+arr.join('+');
    }
    return arr.join('');
}
