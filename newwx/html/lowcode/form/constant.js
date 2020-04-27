/*常量池*/
function Constant(){
    var env = APPLICATION_ENV.getEnv();

    /*全局设置*/
    this.settings = {
        /*导航树*/
        navigateTree:{
            /*是否启用*/
            enable:true,
        },
        /*样式工具箱*/
        styleTool:{
            /*是否启用*/
            enable:false,
        },
        /*文件上传*/
        file:{
            /*上传地址*/
            action:env.serverPath+"web/common_file_rest/upload",
            name:"file",
            /*返回数据处理*/
            callback:function (res) {
                if(res.flag){
                    return res.data.src;
                }
                return "";
            }
        },
        /*javascript脚本 <script>标签是否开启*/
        javascript:{
            enable:false
        },
        html:{
            enable:false
        },
        /*代码调试 采用打开新连接方式 输出一个新页面，把用户的html放在新页面 这样就可以利用浏览器的调试功能 */
        debug:{
            //必须是post接口 请自行接收head body参数 然后redirect到一个新页面 处理 切记将"&lt;"转成"<" 因为浏览器检查发现脚本就报xss攻击
            // action:"http://localhost/debug_form",
            action:env.serverPath+"drag/debug_form",
        },
        /*缓存 比如刷新浏览器 可以自动恢复*/
        cache:{
            enable:false,/*是否启用本地缓存*/
            /*存储数据到本地缓存位置*/
            storeLocation:'localStorage',//localStorage(刷新或关闭重启浏览器可恢复) sessionStorage(仅刷新可恢复)
        }
    }
    this.UI_TYPE = 4;
    this.type = {
        TEXT:"text",
        TEXTAREA:"textarea",
        SELECT:"select",
        TEXT:"text",
        CHECKBOX:"checkbox",
        SWITCH:"switch",
        COLOR_PICKER:"colorpicker",
        FILEUPLOAD:"fileupload",
        HTML:"html",
        SLIDER:"slider",
    }
    this.change = {
        ATTR:"attr",
        CLASS:"class",
        TEXT:"text",
    }
    /*响应式布局*/
    this.responsive = {
        XS:"xs",
        SM:"sm",
        MD:"md",
        LG:"lg",
        XL:"xl",
    }
    this.responsiveList = [
        {id:this.responsive.XS,name:"手机",width:"588px",icon:"assets/drag/img/header/phone1.png"},
        {id:this.responsive.SM,name:"手机到平板",width:"768px",icon:"assets/drag/img/header/paid1.png"},
        {id:this.responsive.MD,name:"平板",width:"992px",icon:"assets/drag/img/header/notebook2.png"},
        {id:this.responsive.LG,name:"笔记本",width:"1200px",icon:"assets/drag/img/header/pc1.png"},
        {id:this.responsive.XL,name:"电脑",width:"100%",icon:"assets/drag/img/header/pc1.png",checked:true}
    ]

    /*自定义的组件*/
    this.components = [
        {
            name:"表单容器",
            children:[
                {
                    identifier:"formHtml",
                    name:"表单容器",
                    icon:"assets/drag/img/left/clauses1.png",
                    html:"<el-form label-width='100px'><el-form-item label='单行标题'></el-form-item><el-row><el-col :xs='24' :md='12'><el-form-item label='左标题'></el-form-item></el-col><el-col :xs='24' :md='12'><el-form-item label='右标题'></el-form-item></el-col></el-row><el-form-item label='单选'><el-radio-group v-model='radioGroup'><el-radio label='1'>单选项1</el-radio><el-radio label='2'>单选项2</el-radio></el-radio-group></el-form-item><el-form-item label='多选'><el-checkbox-group v-model='checkboxGroup'><el-checkbox label='1'>多选项</el-checkbox></el-checkbox-group></el-form-item></el-form>"
                },{
                    name:"行列",
                    icon:"assets/drag/img/left/around1.png",
                    html:"<el-row><el-col :xs='24' :md='12'></el-col><el-col :xs='24' :md='12'></el-col></el-row>",
                }
            ]
        },
        {
            name:"表单容器子条目",
            children:[
                {
                    name:"普通条目",
                    icon:"assets/drag/img/left/menu1.png",
                    html:"<el-form-item label='标题'></el-form-item>"
                },
                {
                    name:"单选条目",
                    icon:"assets/drag/img/left/menu1.png",
                    html:"<el-form-item label='单选'><el-radio-group v-model='radioGroup'><el-radio label='1'>单选项1</el-radio><el-radio label='2'>单选项2</el-radio></el-radio-group></el-form-item>"
                },
                {
                    name:"多选条目",
                    icon:"assets/drag/img/left/menu1.png",
                    html:"<el-form-item label='多选'><el-checkbox-group v-model='checkboxGroup'><el-checkbox label='1'>多选项</el-checkbox></el-checkbox-group></el-form-item>"
                }

            ]
        },{
            name:"表单基础控件",
            children:[
                {
                    name:"输入框",
                    icon:"assets/drag/img/left/import1.png",
                    html:"<el-input v-model='input' placeholder='请输入内容'></el-input>",
                },{
                    name:"下拉框",
                    icon:"assets/drag/img/left/pull1.png",
                    html:"<el-select v-model='select' @focus='focus'><el-option label='选择1' value='1'></el-option></el-select>"
                },
                {
                    name:"单选框",
                    icon:"assets/drag/img/left/choice1.png",
                    html:"<el-radio-group v-model='radioGroup'><el-radio label='1'>单选项1</el-radio><el-radio label='2'>单选项2</el-radio></el-radio-group>"
                },
                {
                    name:"多选框",
                    icon:"assets/drag/img/left/multiple1.png",
                    html:"<el-checkbox-group v-model='checkboxGroup'><el-checkbox label='1'>多选项1</el-checkbox></el-checkbox-group>"
                },{
                    name:"开关",
                    icon:"assets/drag/img/left/onoff1.png",
                    html:"<el-switch v-model='kaiguan' ></el-switch>"
                },{
                    name:"滑块",
                    icon:"assets/drag/img/left/sliding1.png",
                    html:"<el-slider v-model='slider'></el-slider>"
                },{
                    name:"日期",
                    icon:"assets/drag/img/left/day1.png",
                    html:"<el-date-picker v-model='datePicker'   :editable='true' :clearable='true' type='datetime' format='yyyy-MM-dd HH:mm:ss'></el-date-picker>"
                },{
                    name:"文件上传",
                    icon:"assets/drag/img/left/uploading1.png",
                    html:"<el-upload action='"+commonUtil.ctx+"web/common_file_rest/upload' ref='fileList' :file-list='fileList' :show-file-list='true' :auto-upload='true' list-type='picture'><el-button size='small' type='primary'>点击上传</el-button></el-upload>"
                },{
                    name:"评分",
                    icon:"assets/drag/img/left/grade1.png",
                    html:"<el-rate v-model='rate'></el-rate>"
                },{
                    name:"颜色",
                    icon:"assets/drag/img/left/color1.png",
                    html:"<el-color-picker  v-model='colorPicker'></el-color-picker>"
                }
                ,{
                    name:"计数器",
                    icon:"assets/drag/img/left/other1.png",
                    html:"<el-input-number v-model='inputNumber'></el-input-number>",
                },{
                    name:"计数器",
                    icon:"assets/drag/img/left/other1.png",
                    html:"<el-input-number v-model='inputNumber'></el-input-number>",
                }
            ],
        }
        /*,{
            name: "系统控件",
            children: [
                {
                    name: "用户ID",
                    icon: "assets/drag/img/left/import1.png",
                    html: "<el-input placeholder='请输入内容' ></el-input>",
                }
            ]
        }*/
    ]
    this.tagClassMapping = {
        /*容器*/
        "el-row":           {name:"行",       dragInto:true,      duplicate:true,assistDuplicate:true,duplicateAttr:[],        copy:true,       paste:false, canDelete:true,assistDelete:true,onlyParents:["root","el-form"] ,onlyChildren:["el-col"],        assistAdd:true,addOneItems:[{"":[{html:"<el-col :xs='24' :md='12'></el-col>",focus:false}]}]          },
        "el-col":           {name:"列",       dragInto:true,       duplicate:true,assistDuplicate:true,duplicateAttr:[],        copy:false,      paste:true,  canDelete:true,assistDelete:true,onlyParents:["el-row"],onlyChildren:["el-form-item"] ,bind:{"v-text":'',"v-html":'',"v-for":[]}                                                              },
        "el-radio-group":   {name:"单选框组",treeExtraName:{attr:["v-model"]},    dragInto:true,      duplicate:false,assistDuplicate:false,duplicateAttr:[],         copy:true,      paste:true,    canDelete:true,assistDelete:true,     onlyChildren:["el-radio"],     bind:{"v-model":''} ,assistAdd:true,addOneItems:[{"":[{html:"<el-radio label='1'>单选项1</el-radio>",focus:false}]}]                          },
        "el-checkbox-group":{name:"多选框组",treeExtraName:{attr:["v-model"]},    dragInto:true,      duplicate:false,assistDuplicate:false,duplicateAttr:[],         copy:true,      paste:true,    canDelete:true,assistDelete:true,     onlyChildren:["el-checkbox"],  bind:{"v-model":[]}  ,assistAdd:true,addOneItems:[{"":[{html:"<el-checkbox label='1'>多选项1</el-checkbox>",focus:false}]}]                    },
        "el-form":          {name:"表单容器",      dragInto:true,      duplicate:true,assistDuplicate:true,duplicateAttr:[],         copy:true,      paste:true,    canDelete:true,assistDelete:true,onlyParents:["root"],     onlyChildren:["el-row","el-form-item"], assistAdd:true,addOneItems:[{"":[{html:"<el-form-item label='标题'></el-form-item>",focus:false}]}]},
        "el-form-item":     {name:"表单条目",treeExtraName:{attr:["label"]},   dragInto:true,      duplicate:true,assistDuplicate:true,duplicateAttr:[],         copy:true,      paste:true,    canDelete:true,assistDelete:true,     onlyParents:["el-form","el-col"], childrenLimit:1  },
        /*表单*/
        "el-radio":         {name:"单选框",treeExtraName:{attr:[],text:true},    dragInto:false,     duplicate:false,assistDuplicate:false,duplicateAttr:["label"], copy:true,      paste:false,   canDelete:true,assistDelete:true,      onlyParents:["el-radio-group"]  },
        "el-radio-button":  {name:"单选按钮",   dragInto:false,    duplicate:false,assistDuplicate:false,duplicateAttr:[],         copy:true,      paste:false,    canDelete:true,assistDelete:true,     },
        "el-checkbox":      {name:"多选框",treeExtraName:{attr:[],text:true},    dragInto:false,     duplicate:false,assistDuplicate:false,duplicateAttr:["label"],         copy:true,      paste:false,   canDelete:true,assistDelete:true,     onlyParents:["el-checkbox-group"], },
        "el-input":         {name:"输入框",treeExtraName:{attr:["v-model"]},    dragInto:false,     duplicate:false,assistDuplicate:false,duplicateAttr:[],         copy:true,      paste:false,   canDelete:true,assistDelete:true,    bind:{"v-model":''} },
        "el-input-number":  {name:"计数器",treeExtraName:{attr:["v-model"]},    dragInto:false,     duplicate:false,duplicateAttr:[],         copy:false,      paste:false,   canDelete:true,assistDelete:true,     bind:{"v-model":0},tmpWrapTag:'span'},
        "el-select":        {name:"下拉框",treeExtraName:{attr:["v-model"]},    dragInto:false,     duplicate:false,assistDuplicate:false,duplicateAttr:[],         copy:true,      paste:false,   canDelete:true,assistDelete:true,    onlyChildren:["el-option"], bind:{"v-model":''}, assistAdd:true,addOneItems:[{"":[{html:"<el-option label='选择1' value='1'></el-option>",focus:true}]}]       },
        "el-option":        {name:"下拉框选项",treeExtraName:{attr:["label"]},dragInto:false,      duplicate:true,assistDuplicate:true,duplicateAttr:["value"],  copy:false,      paste:false,   canDelete:true,assistDelete:true,    onlyParents:["el-select"]         },
        "el-switch":        {name:"开关",treeExtraName:{attr:["v-model"]},     dragInto:false,     duplicate:false,assistDuplicate:false,duplicateAttr:[],          copy:true,      paste:false,  canDelete:true,assistDelete:true,      bind:{"v-model":false}},
        "el-slider":        {name:"滑块",treeExtraName:{attr:["v-model"]},     dragInto:false,     duplicate:false,assistDuplicate:false,duplicateAttr:[],          copy:true,      paste:false,  canDelete:true,assistDelete:true,      bind:{"v-model":0}},
        /*组件*/
        "el-time-select":   {name:"时间选择器",treeExtraName:{attr:["v-model"]}, dragInto:false,    duplicate:false,assistDuplicate:false,                           copy:false,     paste:true,   canDelete:true,assistDelete:true,    bind:{"v-model":''}},
        "el-date-picker":   {name:"日期选择器",treeExtraName:{attr:["v-model"]}, dragInto:false,    duplicate:false,assistDuplicate:false,                           copy:false,     paste:true,   canDelete:true,assistDelete:true,    bind:{"v-model":''}},
        "el-upload":        {name:"文件上传",treeExtraName:{attr:[":file-list"]},   dragInto:false,    duplicate:false,assistDuplicate:false,                           copy:true,      paste:false,  canDelete:true,assistDelete:true,    bind:{":file-list":[]}    },
        "el-rate":          {name:"评分",treeExtraName:{attr:["v-model"]},      dragInto:false,    duplicate:false,assistDuplicate:false,                           copy:true,      paste:false,  canDelete:true,assistDelete:true,    bind:{"v-model":0}       },
        "el-color-picker":  {name:"颜色选择器",treeExtraName:{attr:["v-model"]}, dragInto:false,    duplicate:false,assistDuplicate:false,                           copy:true,      paste:false,  canDelete:true,assistDelete:true,   bind:{"v-model":''} },
        "el-calendar":      {name:"日历",treeExtraName:{attr:["v-model"]},dragInto:false,  duplicate:false,assistDuplicate:false,   copy:true,      paste:true,  canDelete:true,assistDelete:true,bind:{'v-model':new Date()}},

        /*样式*/
        "root":{name:"根面板",dragInto:true,duplicate:false, copy:false,      paste:true,    canDelete:false,childrenLimit:1,onlyChildren:['el-form']},
        "magical-coder-tmp":{name:"临时包裹",dragInto:false,duplicate:false,assistDuplicate:false, copy:true,      paste:false,    canDelete:true},
        "magical-drag-tmp-submenu-name":{name:"子菜单名称",dragInto:false,duplicate:false, copy:false,      paste:false,    canDelete:false},
    }
    //拷贝一下api的key 千万别去否则ai辅助编程就找不到identifier了
    var apiConstantTagClassMapping = commonUtil.apiConstantTagClassMapping();
    for(var key in apiConstantTagClassMapping){
        this.tagClassMapping[key]=apiConstantTagClassMapping[key];
    }

    /*右侧面板绘制*/
    this.rightPanel =
        [
            {
                title:"属性",
                active:true,/*默认聚焦*/
                width:"100%",
                content: {
                    "el-row":[
                        /*clearAttr:删除按钮 extend:扩展配置按 extra:layui组件对应的扩展配置  attrName:属性名 oneLine:是否在一行 options: [n:name(属性名|样式名) t:title（标题） c:checked时候的值(string|boolean) u:unchecked时候的值(string|boolean)]  extend:true是否启用扩展配置 ,extendKey:"icon",如果是扩展配置icon；*/
                        {type:this.type.SLIDER    ,clearAttr:true       ,oneLine:false     ,change:this.change.ATTR    ,title:'栅格间隔'         ,attrName:':gutter'           ,extra:{min:0,max:2000}          , extend:true},
                        {type:this.type.CHECKBOX  ,clearAttr:true       ,oneLine:false     ,change:this.change.ATTR    ,title:'布局模式(现代浏览器下有效)'                                       ,options:[{n:"type",t:"FLEX",c:"flex",u:""}]},
                        {type:this.type.SELECT    ,clearAttr:true       ,oneLine:false     ,change:this.change.ATTR    ,title:'水平对齐(当FLEX模式选中时有效)'     ,attrName:'justify'          ,options:[{"start":"头部"},{"end":"尾部"},{"center":"居中"},{"space-around":"环绕"},{"space-between":"间隔"}]},
                        {type:this.type.SELECT    ,clearAttr:true       ,oneLine:false     ,change:this.change.ATTR    ,title:'垂直对齐(当FLEX模式选中时有效)'     ,attrName:'align'            ,options:[{"top":"顶部对齐"},{"middle":"居中对齐"},{"bottom":"底部对齐"}]},
                        {type:this.type.TEXT      ,clearAttr:true       ,oneLine:false     ,change:this.change.ATTR    ,title:'自定义元素标签'    ,attrName:'tag'              },
                    ],
                    "el-col":[
                        {type:this.type.TEXT      ,clearAttr:true       ,oneLine:true       ,change:this.change.TEXT	,title:'文本'                },
                        {type:this.type.SLIDER    ,clearAttr:true       ,oneLine:false      ,change:this.change.ATTR    ,title:'栅格占据的列数'     ,attrName:':span'          ,extra:{min:0,max:24}                                               },
                        {type:this.type.SLIDER    ,clearAttr:true       ,oneLine:false      ,change:this.change.ATTR    ,title:'栅格左侧的间隔格数'   ,attrName:':offset'       ,extra:{min:0,max:24}                                                },
                        {type:this.type.SLIDER    ,clearAttr:true       ,oneLine:false      ,change:this.change.ATTR    ,title:'栅格向右移动格数'     ,attrName:':push'        ,extra:{min:0,max:24}                                               },
                        {type:this.type.SLIDER    ,clearAttr:true       ,oneLine:false      ,change:this.change.ATTR    ,title:'栅格向左移动格数'     ,attrName:':pull'        ,extra:{min:0,max:24}                                               },
                        {type:this.type.SLIDER    ,clearAttr:true       ,oneLine:false      ,change:this.change.ATTR    ,title:'xs栅格数'       ,attrName:':xs'              ,extra:{min:0,max:24}  ,responsive:this.responsive.XS                    },
                        {type:this.type.SLIDER    ,clearAttr:true       ,oneLine:false      ,change:this.change.ATTR    ,title:'sm栅格数'       ,attrName:':sm'              ,extra:{min:0,max:24}  ,responsive:this.responsive.SM                    },
                        {type:this.type.SLIDER    ,clearAttr:true       ,oneLine:false      ,change:this.change.ATTR    ,title:'md栅格数'       ,attrName:':md'              ,extra:{min:0,max:24}  ,responsive:this.responsive.MD                    },
                        {type:this.type.SLIDER    ,clearAttr:true       ,oneLine:false      ,change:this.change.ATTR    ,title:'lg栅格数'       ,attrName:':lg'              ,extra:{min:0,max:24}  ,responsive:this.responsive.LG                    },
                        {type:this.type.SLIDER    ,clearAttr:true       ,oneLine:false      ,change:this.change.ATTR    ,title:'xl栅格数'       ,attrName:':xl'              ,extra:{min:0,max:24}  ,responsive:this.responsive.XL                    },
                        {type:this.type.TEXT      ,clearAttr:true       ,oneLine:true       ,change:this.change.ATTR    ,title:'自定义元素标签'      ,attrName:':tag'                                                         },
                    ],
                    "el-form":[
                    ],
                    "el-form-item":[
                        {type:this.type.TEXT            ,clearAttr:true       ,oneLine:true      ,change:this.change.ATTR    ,title:'标题'     ,attrName:'label'                                                          },
                    ],
                    "el-radio":[
                        {type:this.type.TEXT      ,clearAttr:true       ,oneLine:true       ,change:this.change.ATTR    ,title:'值'       ,attrName:'label'                                                                                  },
                        {type:this.type.TEXT      ,clearAttr:true       ,oneLine:true       ,change:this.change.TEXT	,title:'文本'                },
                    ],
                    "el-radio-button":[
                        {type:this.type.TEXT      ,clearAttr:true       ,oneLine:true        ,change:this.change.ATTR    ,title:'值'       ,attrName:'label'                                                                                },
                        {type:this.type.TEXT      ,clearAttr:true       ,oneLine:true        ,change:this.change.TEXT	,title:'文本'                },
                    ],
                    "el-radio-group":[
                        {type:this.type.TEXT         ,clearAttr:true    ,oneLine:true        ,change:this.change.ATTR    ,title:'字段名称*'     ,attrName:'v-model',validate:{"(^[a-zA-Z][a-zA-Z0-9_]*$)":"请输入字母数字或者下划线,以英文字母开头"}  },
                    ],
                    "el-checkbox-group":[
                        {type:this.type.TEXT         ,clearAttr:true    ,oneLine:true        ,change:this.change.ATTR    ,title:'字段名称*'     ,attrName:'v-model',validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}},
                    ],
                    "el-checkbox":[
                        {type:this.type.TEXT         ,clearAttr:true   ,oneLine:true         ,change:this.change.ATTR    ,title:'值'       ,attrName:'label'                                                              },
                        {type:this.type.TEXT         ,clearAttr:true       ,oneLine:true     ,change:this.change.TEXT	,title:'文本'    },
                    ],
                    "el-input":[
                        {type:this.type.TEXT       ,clearAttr:true     ,oneLine:true         ,change:this.change.ATTR    ,title:'字段名称*'     ,attrName:'v-model' ,validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}                       },
                        {type:this.type.SELECT     ,clearAttr:true     ,oneLine:true         ,change:this.change.ATTR    ,title:'数据类型*'    ,attrName:'mc-db-type-v-model'                              ,options:[{"str":"字符串","int":"整数","long":"长整数","decimal":"小数","objectId":"外键id"}]                              },
                    ],
                    "el-input-number":[
                        {type:this.type.TEXT       ,clearAttr:true     ,oneLine:true         ,change:this.change.ATTR    ,title:'字段名称*'     ,attrName:'v-model' ,validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}                       },
                    ],
                    "el-select":[
                        {type:this.type.TEXT      ,clearAttr:true      ,oneLine:true         ,change:this.change.ATTR    ,title:'字段名称*'       ,attrName:'v-model' ,validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}               },
                        {type:this.type.SELECT     ,clearAttr:true     ,oneLine:true         ,change:this.change.ATTR    ,title:'数据类型*'    ,attrName:'mc-db-type-v-model'                              ,options:[{"str":"字符串","objectId":"外键id"}]                              },
                    ],
                    "el-option":[
                        {type:this.type.TEXT      ,clearAttr:true      ,oneLine:true         ,change:this.change.ATTR    ,title:'值'      ,attrName:'value'                                                      },
                        {type:this.type.TEXT      ,clearAttr:true      ,oneLine:true         ,change:this.change.ATTR    ,title:'文本'      ,attrName:'label'                                                      },
                    ],
                    "el-switch":[
                        {type:this.type.TEXT      ,clearAttr:true      ,oneLine:true         ,change:this.change.ATTR    ,title:'字段名称*'     ,attrName:'v-model' ,validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}               },
                    ],
                    "el-slider":[
                        {type:this.type.TEXT      ,clearAttr:true      ,oneLine:true         ,change:this.change.ATTR    ,title:'字段名称*'     ,attrName:'v-model' ,validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}               },
                    ],
                    "el-upload":[
                        {type:this.type.TEXT      ,clearAttr:true      ,oneLine:true         ,change:this.change.ATTR    ,title:'字段名称*'      ,attrName:':file-list' ,validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}               },
                    ],
                    "el-rate":[
                        {type:this.type.TEXT      ,clearAttr:true      ,oneLine:true         ,change:this.change.ATTR    ,title:'字段名称*'     ,attrName:'v-model' ,validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}               },
                    ],
                    "el-color-picker":[
                        {type:this.type.TEXT      ,clearAttr:true      ,oneLine:true         ,change:this.change.ATTR    ,title:'字段名称*'     ,attrName:'v-model' ,validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}               },
                    ],
                    "el-time-select":[
                        {type:this.type.TEXT            ,clearAttr:true     ,oneLine:true     ,change:this.change.ATTR     ,title:'字段名称*'    ,attrName:'v-model',validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}},
                    ],
                    "el-date-picker":[
                        {type:this.type.TEXT            ,clearAttr:true     ,oneLine:true     ,change:this.change.ATTR     ,title:'字段名称*'    ,attrName:'v-model',validate:{"^[a-zA-Z][a-zA-Z0-9_]*$":"请输入字母数字或者下划线,以英文字母开头"}},
                        {type:this.type.SELECT          ,clearAttr:true     ,oneLine:true     ,change:this.change.ATTR     ,title:'显示类型'    ,attrName:'type'    ,options:[{"year":"年"},{"month":"年月"},{"date":"年月日"}/*,{"dates":"dates"},{"week":"周"}*/,{"datetime":"年月日时分秒"}/*,{"datetimerange":"日期时间范围"},{"daterange":"日期范围"},{"monthrange":"月范围"}*/]},
                    ],
                    "el-image":[
                        {type:this.type.CHECKBOX        ,clearAttr:true     ,oneLine:true     ,change:this.change.ATTR     ,title:'状态'    ,options:[{"c":true,"n":"lazy","t":"是否开启懒加载","u":false}]},
                        {type:this.type.SELECT          ,clearAttr:true     ,oneLine:false     ,change:this.change.ATTR     ,title:'适应容器框'    ,tooltip:'确定图片如何适应容器框，同原生object-fit'    ,attrName:'fit'    ,options:[{"fill":"填充"},{"contain":"包含"},{"cover":"覆盖"},{"none":"无"},{"scale-down":"缩减"}]},
                        {type:this.type.SLIDER          ,clearAttr:true     ,oneLine:false     ,change:this.change.ATTR     ,title:'设置图片预览的 z-index'    ,tooltip:'设置图片预览的 z-index'    ,attrName:'z-index'    ,extra:{"min":0,"max":2000}},
                        {type:this.type.TEXT            ,clearAttr:true     ,oneLine:true     ,change:this.change.ATTR     ,title:'原生alt'    ,attrName:'alt'},
                    ],
                    "magical-drag-tmp-submenu-name":[
                        {type:this.type.TEXT      ,clearAttr:true       ,oneLine:true     ,change:this.change.TEXT	,title:'文本'                ,callback:function (data) {}},
                    ]
                    ,
                    "el-calendar":[
                        {type:this.type.SLIDER          ,clearAttr:true     ,oneLine:false     ,change:this.change.ATTR     ,title:'起始周'    ,tooltip:'起始周'    ,attrName:':first-day-of-week'    ,extra:{"min":1,"max":7}},
                    ],
    /*必须从api的constant.js里拷贝过来 否则转换的attribute属性值就不是true|false了*/
                    "mc-db-value":[
                        {type:this.type.SWITCH,clearAttr:true     ,oneLine:true     ,change:this.change.ATTR     ,title:'动态传参',tooltip:'配合接口调用动态接收客户端传的参数'    ,options:[{"c":true,"n":"mc-is-variable","t":"是|否","u":false}]},
                        {type:this.type.TEXTAREA,clearAttr:true       ,oneLine:false,change:this.change.ATTR,attrName:'value',title:'自定义值',tooltip:"",},
                        {type:this.type.SWITCH,clearAttr:true     ,oneLine:true     ,change:this.change.ATTR     ,title:'必填项',tooltip:'客户端传的参数不能缺失或者空字符串'    ,options:[{"c":true,"n":"mc-is-require","t":"是|否","u":false}]},
                    ],

                }
        }]

}
Constant.prototype.refresh = function(){
    this._autoSetComponentId();
    this.componentMap = this.setComponentMap();
}
Constant.prototype.getComponents = function(){
    return this.components;
}
/**
 * 自动设置id 避免再手动配置
 * @private
 */
Constant.prototype._autoSetComponentId = function(){
    var idx = 1;
    for(var i=0;i<this.components.length;i++){
        var item = this.components[i];
        var children = item.children;
        if(children!=null && children.length>0){
            for(var j=0;j<children.length;j++){
                var child = children[j];
                child.id = (idx++)+"";
            }
        }
    }
}


Constant.prototype.getRightPanel = function(){
    return this.rightPanel;
}
Constant.prototype.getSettings = function(){
    return this.settings;
}

Constant.prototype.setComponentMap = function(){
    var mapping = {}
    for(var i=0;i<this.components.length;i++){
        var item = this.components[i];
        var children = item.children;
        if(children!=null && children.length>0){
            for(var j=0;j<children.length;j++){
                var child = children[j];
                mapping[child.id] = child;
            }
        }
    }
    return mapping;
}
Constant.prototype.getComponentMap = function(){
    return this.componentMap;
}

Constant.prototype.getRightPanel = function(){
    return this.rightPanel;
}

Constant.prototype.getTagClassMapping = function(){
    return this.tagClassMapping;
}
Constant.prototype.getChange = function () {
    return this.change;
}
Constant.prototype.getType = function () {
    return this.type;
}
Constant.prototype.getResponsiveList = function () {
    return this.responsiveList;
}
Constant.prototype.getResponsive = function () {
    return this.responsive;
}
Constant.prototype.getUiType = function () {
    return this.UI_TYPE;
}
