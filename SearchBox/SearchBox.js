DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Web.NavControls");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");


DBFX.Web.Controls.SearchBox = function () {
    var sbx = new DBFX.Web.Controls.Control("SearchBox");
    sbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.SearchBoxDesigner");
    sbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.SearchBoxTemplateDesigner");
    sbx.ClassDescriptor.Serializer = "DBFX.Serializer.SearchBoxSerializer";
    sbx.VisualElement = document.createElement("DIV");
    sbx.VisualElement.className = "SearchBox";


    sbx.Groups = [];
    sbx.Templates = new Object();
    sbx.ClientDiv = sbx.VisualElement;

    //创建ListView，用于展示结果列表
    sbx.ResultList = new DBFX.Web.Controls.ListView();

    sbx.OnCreateHandle();
    sbx.OnCreateHandle = function () {
        sbx.Class = "SearchBox";
        sbx.VisualElement.innerHTML =
            "<DIV class=\"SearchBoxContainer\">" +"<DIV class=\"SearchBoxSearchIcon\">"+
            "<IMG class=\"SearchBoxSearchIconImg\">" +
            "</DIV>"+
            "<DIV class=\"SearchBoxSearchBox\">" +
            "<INPUT class=\"SearchBoxSearchInputBox\" type='text'>" +
            "<button class=\"SearchBoxASRBtn\" >" + "</button>"+
            "<button class=\"SearchBoxCameraBtn\" >" + "</button>"+
            "</DIV>" +
            "<DIV class=\"SearchBoxSearchButton\">" +
            "<IMG class=\"SearchBoxSearchButtonImg\">" +
            "<SPAN class=\"SearchBoxSearchButtonText\"></SPAN>" +
            "</DIV>" +
            "<DIV class=\"SearchBoxResultsList\">" +
            "</DIV>" +
            "</DIV>";
        sbx.SearchV = sbx.VisualElement.querySelector("DIV.SearchBoxContainer");
        sbx.SearchIcon = sbx.VisualElement.querySelector("IMG.SearchBoxSearchIconImg");
        sbx.SearchBox = sbx.VisualElement.querySelector("DIV.SearchBoxSearchBox");
        sbx.SearchInput = sbx.VisualElement.querySelector("INPUT.SearchBoxSearchInputBox");
        sbx.SearchBtn = sbx.VisualElement.querySelector("DIV.SearchBoxSearchButton");
        sbx.SearchBtnImg = sbx.VisualElement.querySelector("IMG.SearchBoxSearchButtonImg");
        sbx.SearchBtnText = sbx.VisualElement.querySelector("SPAN.SearchBoxSearchButtonText");
        sbx.SearchResultDiv = sbx.VisualElement.querySelector("DIV.SearchBoxResultsList");

        //TODO：语音识别按钮 待实现
        sbx.ASRBtn = sbx.VisualElement.querySelector("button.SearchBoxASRBtn");
        //TODO:拍摄照片按钮 待实现
        sbx.CameraBtn = sbx.VisualElement.querySelector("button.SearchBoxCameraBtn");

        //设置图片
        sbx.SearchIcon.src = "Themes/" + app.CurrentTheme + "/Images/SearchBox/searchIcon.png";
        // sbx.SearchBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/SearchBox/searchIcon.png";
        sbx.SearchBtnText.innerText = sbx.btnText;

        //不检查拼写错误
        sbx.SearchInput.spellcheck = false;
        //事件绑定
        sbx.SearchBtn.onmousedown = sbx.searchBtnClick;
        sbx.SearchInput.onfocus = sbx.searchInputFocus;
        sbx.SearchInput.onblur = sbx.searchInputBlur;
        sbx.SearchInput.onkeypress = sbx.searchInputKeypress;
        sbx.SearchInput.oninput = sbx.searchInputInput;

        //创建ListView，用于展示结果列表
        sbx.SearchResultDiv.appendChild(sbx.ResultList.VisualElement);

        sbx.ResultList.Height = "100%";
        sbx.ResultList.Width = "100%";
        sbx.ResultList.VisualElement.style.overflowY = "auto";


    }

    //输入框提示文字
    sbx.placeholder = "";
    Object.defineProperty(sbx, "Placeholder", {
        get: function () {
            return sbx.placeholder;
        },
        set: function (v) {
            sbx.placeholder = v;
            sbx.setTipText();

            //另一种实现效果：激活输入框  提示文字不消失
            // sbx.SearchInput.placeholder = v;
        }
    });

    //按钮文字
    sbx.btnText = "搜索";
    Object.defineProperty(sbx, "BtnText", {
        get: function () {
            return sbx.btnText;
        },
        set: function (v) {
            sbx.btnText = v;
            sbx.SearchBtnText.innerText = v;
        }
    });

    //图标图片
    sbx.imageUrl = "";
    Object.defineProperty(sbx, "ImageUrl", {
        get: function () {
            return sbx.imageUrl;
        },
        set: function (v) {
            sbx.imageUrl = v;
            //FIXME:
            if(v==""){
                sbx.SearchIcon.src = "Themes/" + app.CurrentTheme + "/Images/SearchBox/searchIcon.png";
            }else {
                sbx.SearchIcon.src = v;
            }

            // sbx.SearchBtnImg.src = v;
        }
    });

    sbx.itemTemplate = "ItemTemplate";
    //项目模板
    Object.defineProperty(sbx, "ItemTemplate", {
        get: function () {

            return sbx.itemTemplate;

        }, set: function (v) {

            sbx.itemTemplate = v;
        }
    });

    sbx.itemSelectedTemplate = "SelectedItemTemplate";
    //选定项目模板
    Object.defineProperty(sbx, "ItemSelectedTemplate", {
        get: function () {
            return sbx.itemSelectedTemplate;

        },
        set: function (v) {

            sbx.itemSelectedTemplate = v;
        }
    });

    //数据源
    Object.defineProperty(sbx, "ItemSource", {
        get: function () {

            sbx.itemSource = sbx.ResultList.ItemSource;
            return sbx.itemSource;

        }, set: function (v) {

            sbx.itemSource = v;
            sbx.ResultList.ItemSource = v;
        }
    });

    //搜索结果列表高度
    sbx.resultListH = "200px";
    //项目模板
    Object.defineProperty(sbx, "ResultListH", {
        get: function () {

            return sbx.resultListH;

        }, set: function (v) {

            sbx.resultListH = v;
            sbx.SearchResultDiv.style.height = v;
        }
    });

    //结果列表选中item背景色
    sbx.selectedItemBackColor = "rgba(225,225,225,0.1)";
    Object.defineProperty(sbx, "SelectedItemBackColor", {
        get: function () {

            return sbx.selectedItemBackColor;
        },
        set: function (v) {
                sbx.selectedItemBackColor = v;
                sbx.ResultList.SelectedItemBackColor = v;
            }

    });

    //结果列表选中item前景色
    sbx.selectedItemBackColor = "black";
    Object.defineProperty(sbx, "SelectedItemColor", {
        get: function () {

            return sbx.selectedItemColor;
        },
        set: function (v) {

                sbx.selectedItemColor = v;
                sbx.ResultList.SelectedItemColor = v;
            }

    });

    //结果列表选中item边框颜色
    sbx.selectedItemBorderColor = "white";
    Object.defineProperty(sbx, "SelectedItemBorderColor", {
        get: function () {

            return sbx.selectedItemBorderColor;

        },
        set: function (v) {

                sbx.selectedItemBorderColor = v;
                sbx.ResultList.SelectedItemBorderColor = v;

            }

    });

    //纵向排列项目
    sbx.FillFullRow = true;
    Object.defineProperty(sbx, "FillFullRow", {
        get: function () {
            return sbx.fillFullRow;
        },
        set: function (v) {

            if (v != undefined && (v == "false" || v==false)) {
                v = false;
            }
            else
                v = true;

            sbx.fillFullRow = v;
            sbx.ResultList.FillFullRow = v;
        }

    })



    sbx.inputText = "";
    sbx.SetText = function (v) {
        sbx.inputText = v;
    }

    sbx.GetText = function () {
        return sbx.inputText;
    }


    //触发搜索事件  事件处理程序 开发者执行存储过程
    sbx.OnSearchingFor = function () {

        if (sbx.Command != undefined && sbx.Command != null) {
            sbx.Command.Sender = sbx;
            sbx.Command.Execute();
        }

        if(sbx.SearchingFor != undefined && sbx.SearchingFor.GetType() == "Command"){
            sbx.SearchingFor.Sender = sbx;
            sbx.SearchingFor.Execute();
        }

        if(sbx.SearchingFor != undefined && sbx.SearchingFor.GetType() == "function"){
            sbx.SearchingFor(e,sbx);
        }
    }

    //单行选中事件 事件处理程序
    sbx.OnItemClick = function (item,e) {
        // if (sbx.Command != undefined && sbx.Command != null) {
        //     sbx.Command.Sender = item;
        //     sbx.Command.Execute();
        // }

        if(sbx.ItemClick != undefined && sbx.ItemClick.GetType() == "Command"){
            sbx.ItemClick.Sender = item;
            sbx.ItemClick.Execute();
        }

        if(sbx.ItemClick != undefined && sbx.ItemClick.GetType() == "function"){
            sbx.ItemClick(item,e);
        }

    }

    //添加控件方法 模板设计器文件需要调用
    sbx.AddControl = function (c) {
        sbx.ResultList.VisualElement.appendChild(c.VisualElement);
        c.Parent = sbx;
        sbx.ShowResultList();
    }

    //移除控件的方法 模板设计器文件需要调用
    sbx.Remove = function (c) {
        sbx.ResultList.VisualElement.removeChild(c.VisualElement);
        sbx.HideResultList();
    }



    //TODO:item点击事件
    sbx.ResultList.ItemClick = function (item,e) {
        //列表的item点击事件执行时，调用搜索框控件的item点击事件
        sbx.OnItemClick(item,e);
    }

    //页面资源是否加载
    sbx.hasLoad = false;
    //TODO:展示搜索结果列表的方法  开发者在搜索事件里调用
    //obj对象包含数据列表Items 搜索到的数据集合
    sbx.Show = function (obj) {

    }


    //输入框获取焦点  搜索框事件处理
    sbx.searchInputFocus = function (e) {
        console.log("onfocus");
        sbx.btnFlag = 0;
        if(sbx.SearchInput.value == sbx.placeholder){
            sbx.removeTipText();
        }else {

            sbx.OnSearchingFor();

            //显示结果列表
            sbx.ShowResultList();
            sbx.btnFlag = 0;
        }
    }


    //输入框失去焦点
    sbx.searchInputBlur = function (e) {

        if(sbx.SearchInput.value == ""){
            sbx.setTipText();
        }else  if(sbx.btnFlag != 1){
            sbx.btnFlag = 0;
        }

        sbx.HideResultList();
    }


    //回车键按下
    sbx.searchInputKeypress = function (e) {
        console.log("searchInputKeypress");
        //按回车键
        if(e.keyCode == 13){
            console.log("回车键 调用搜索事件");
            sbx.inputText = sbx.SearchInput.value==sbx.placeholder ? "":sbx.SearchInput.value;
            console.log(sbx.Text);
            //执行搜索事件
            sbx.OnSearchingFor();
        }
    }

    //搜索按钮点击处理
    sbx.searchBtnClick = function (event) {
        console.log("搜索按钮点击 调用搜索事件");
        sbx.btnFlag = 1;
        sbx.inputText = sbx.SearchInput.value==sbx.placeholder ? "":sbx.SearchInput.value;
        console.log(sbx.Text);
        //执行搜索事件
        sbx.OnSearchingFor();
    }

    //实时监听输入框内文字
    sbx.searchInputInput = function (e) {
        sbx.inputText = sbx.SearchInput.value;

        // console.log(sbx.Text);
        if(sbx.Text.length>0 && sbx.Text != ""){
            // console.log("输入字符 调用搜索事件");
            //TODO:执行搜索事件 但是会多次调用 慎用！！
            sbx.OnSearchingFor();

            //显示结果列表
            sbx.ShowResultList();
        }else{
            sbx.HideResultList();
        }
    }

    //TODO:显示/隐藏 结果列表
    sbx.ShowResultList = function () {
        sbx.SearchResultDiv.style.display = "block";
        sbx.SearchResultDiv.style.zIndex = "999";
    }

    //TODO:
    sbx.HideResultList = function () {
        sbx.SearchResultDiv.style.display = "none";
        sbx.SearchResultDiv.style.zIndex = "";
    }

    //设置与移除提示文字
    sbx.setTipText = function () {
        sbx.SearchInput.value = sbx.placeholder;
        sbx.SearchInput.style.color = "#3c3f41";
    }

    sbx.removeTipText = function () {
        sbx.SearchInput.value = "";
        sbx.SearchInput.style.color = sbx.inputColor;
    }

    sbx.SetColor = function (v) {
        sbx.inputColor = v;
        if(sbx.SearchInput.value == sbx.placeholder){
            sbx.SearchInput.style.color = "#3c3f41";
        }else {
            sbx.SearchInput.style.color = v;
        }

    }

    sbx.GetColor = function () {
        return sbx.SearchInput.style.color || sbx.inputColor;
    }

    sbx.SetBorderRadius = function (v) {
        sbx.VisualElement.style.borderRadius = v;
        sbx.SearchBtn.style.borderBottomRightRadius = v;
        sbx.SearchBtn.style.borderTopRightRadius = v;
    }

    sbx.SetHeight = function (v) {
        sbx.VisualElement.style.height = v;
        var cssObj = window.getComputedStyle(sbx.VisualElement,null);
        var h = cssObj.height;
        sbx.SearchResultDiv.style.top = parseFloat(h)+1+"px";
    }

    sbx.OnCreateHandle();
    return sbx;
}

//序列化
DBFX.Serializer.SearchBoxSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {

        //获取文档节点对象
        var xdoc = xe.ownerDocument;
        //序列化模板
        var xtemplates = xdoc.createElement("Templates");
        xe.appendChild(xtemplates);
        //遍历结果列表的Templates对象 序列化模板
        for (var kw in c.Templates) {

            var template = c.Templates[kw];
            if (template.ObjType == "ControlTemplate") {
                var xtemplate = template.XTemplate
                if (xtemplate.parentNode != null ) {

                }
                var xtstr = (new XMLSerializer()).serializeToString(xtemplate);
                var nxtemplate = (new DOMParser()).parseFromString(xtstr, "text/xml");
                xtemplates.appendChild(nxtemplate.documentElement);
            }
        }

        DBFX.Serializer.SerialProperty("ItemTemplate", c.ItemTemplate, xe);
        DBFX.Serializer.SerialProperty("ItemSelectedTemplate", c.ItemSelectedTemplate, xe);
        DBFX.Serializer.SerialProperty("Placeholder", c.Placeholder, xe);
        DBFX.Serializer.SerialProperty("BtnText", c.BtnText, xe);
        DBFX.Serializer.SerialProperty("ImageUrl", c.ImageUrl, xe);
        DBFX.Serializer.SerialProperty("ResultListH", c.ResultListH, xe);

        DBFX.Serializer.SerialProperty("FillFullRow", c.FillFullRow, xe);

        DBFX.Serializer.SerialProperty("SelectedItemBackColor", c.SelectedItemBackColor, xe);
        DBFX.Serializer.SerialProperty("SelectedItemBorderColor", c.SelectedItemBorderColor, xe);
        DBFX.Serializer.SerialProperty("SingleRow", c.singleRow, xe);

        //序列化方法
        DBFX.Serializer.SerializeCommand("SearchingFor", c.SearchingFor, xe);
        DBFX.Serializer.SerializeCommand("ItemClick", c.ItemClick, xe);
    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        var ffr = xe.getAttribute("FillFullRow");
        if (ffr == "false")
            c.FillFullRow = false;
        else
            c.FillFullRow = true;

        //初始化模板
        var xtemplates = xe.querySelector("Templates");
        if (xtemplates != undefined && xtemplates != null) {
            for (var i = 0; i < xtemplates.childNodes.length; i++) {

                var xtemplate = xtemplates.childNodes[i];
                if (xtemplate.localName != "t")
                    continue;

                var template = new DBFX.Web.Controls.ControlTemplate(xtemplate);
                template.Keyword = xtemplate.getAttribute("Key");
                template.Uri = xtemplate.getAttribute("Uri");
                template.Namespaces = ns;
                //
                c.Templates[template.Keyword] = template;
            }
        }
        //为结果列表的模板赋值
        c.ResultList.Templates = c.Templates;


        DBFX.Serializer.DeSerialProperty("ItemTemplate", c, xe);
        DBFX.Serializer.DeSerialProperty("ItemSelectedTemplate", c, xe);
        DBFX.Serializer.DeSerialProperty("Placeholder", c, xe);
        DBFX.Serializer.DeSerialProperty("BtnText", c, xe);
        DBFX.Serializer.DeSerialProperty("ImageUrl", c, xe);
        DBFX.Serializer.DeSerialProperty("ResultListH", c, xe);

        DBFX.Serializer.DeSerialProperty("FillFullRow", c, xe);

        DBFX.Serializer.DeSerialProperty("SelectedItemBackColor", c, xe);
        DBFX.Serializer.DeSerialProperty("SelectedItemBorderColor", c, xe);
        DBFX.Serializer.DeSerialProperty("SingleRow", c, xe);


        //对方法反序列化
        DBFX.Serializer.DeSerializeCommand("SearchingFor", xe, c);
        DBFX.Serializer.DeSerializeCommand("ItemClick", xe, c);
    }

}

//设计文件
DBFX.Design.ControlDesigners.SearchBoxDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/SearchBoxDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{EventName:"SearchingFor",EventCode:undefined,Command:od.dataContext.SearchingFor,Control:od.dataContext},{EventName:"ItemClick",EventCode:undefined,Command:od.dataContext.ItemClick,Control:od.dataContext}];
        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if(obdc.EventListBox != undefined){
            obdc.EventListBox.ItemSource = [{EventName:"SearchingFor",EventCode:undefined,Command:obdc.dataContext.SearchingFor,Control:obdc.dataContext},{EventName:"ItemClick",EventCode:undefined,Command:obdc.dataContext.ItemClick,Control:obdc.dataContext}];
        }
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "搜索控件";
    return obdc;
}

DBFX.Design.ControlDesigners.SearchBoxTemplateDesigner = function () {
    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/SearchBoxTemplateDesigner.scrp", function (od) {
            //obdc.dataContext 指向控件本身SearchBox
            od.DataContext = obdc.dataContext;

            //od指向该控件的设计器
            od.SearchBox = od.dataContext;

            //编辑模板按钮
            od.EDTButton = od.FormContext.Form.FormControls.btnEditDataTemplate;
            //编辑对象分类按钮
            od.EOTButton = od.FormContext.Form.FormControls.btnEditObjTypes;
            //编辑分组按钮
            od.EGButton = od.FormContext.Form.FormControls.btnEditGroup;


            //编辑模板
            od.EDTButton.Click = function (e) {

                od.SearchBox.ItemSource = [];

                var op = Object.getOwnPropertyNames(od.SearchBox.Templates);
                if (op==0) {
                    od.SearchBox.Templates = new Object();
                    od.SearchBox.Templates.ItemTemplate = new DBFX.Web.Controls.ControlTemplate(undefined, "ItemTemplate", "");
                    od.SearchBox.Templates.ItemTemplate.Namespaces = od.SearchBox.DesignView.NS;
                    od.SearchBox.Templates.ItemSelectedTemplate = new DBFX.Web.Controls.ControlTemplate(undefined, "ItemSelectedTemplate", "");
                    od.SearchBox.Templates.ItemSelectedTemplate.Namespaces = od.SearchBox.DesignView.NS;
                }

                if(!od.DataTemplateView){
                    od.DataTemplateView = new DBFX.Design.DataTemplateView();
                }
                od.SearchBox.AddControl(od.DataTemplateView);
                // od.SearchBox.ClientDiv.style.overflowY = "auto";
                od.DataTemplateView.LoadDataTemplates(od.SearchBox);
                od.SearchBox.DesignPan.Visible = "none";

                od.SearchBox.EditMode = 1;
                od.SearchBox.DesignView.ObjectSelector.Hide();
            }

            //编辑数据分组
            od.EGButton.Click = function (e) {

                od.SearchBox.EditMode = 3;

                od.SearchBox.ItemSource = [];
                if (od.SearchBox.Groups == undefined) {

                    od.SearchBox.Groups = [];

                }

                if(DBFX.Design.TypeEditors.DataGroupBuilder.ActivedBuilder==undefined)
                    DBFX.Design.TypeEditors.DataGroupBuilder.ActivedBuilder=new DBFX.Design.TypeEditors.DataGroupBuilder();

                od.DataGroupBuilder =DBFX.Design.TypeEditors.DataGroupBuilder.ActivedBuilder;
                od.SearchBox.AddControl(od.DataGroupBuilder);
                // od.SearchBox.ClientDiv.style.overflowY = "auto";
                od.SearchBox.DesignPan.Visible = "none";
                od.DataGroupBuilder.HostControl = od.SearchBox;
                od.DataGroupBuilder.LoadItemSource(od.SearchBox.Groups);
                od.DataGroupBuilder.ShowModal();
                od.SearchBox.DesignView.ObjectSelector.Hide();

            }
            //编辑对象类型
            od.EOTButton.Click = function (e) {

                od.SearchBox.EditMode = 2;

                od.SearchBox.ItemSource = [];
                if (od.SearchBox.ObjTypes == undefined) {

                    od.SearchBox.ObjTypes = [];

                }

                if(DBFX.Design.TypeEditors.ObjTypesBuilder.ActivedBuilder==undefined)
                    DBFX.Design.TypeEditors.ObjTypesBuilder.ActivedBuilder = new DBFX.Design.TypeEditors.ObjTypesBuilder();

                od.ObjTypesBuilder=DBFX.Design.TypeEditors.ObjTypesBuilder.ActivedBuilder;
                //od.SearchBox.AddControl(od.ObjTypesBuilder);
                // od.SearchBox.ClientDiv.style.overflowY = "auto";
                od.SearchBox.DesignPan.Display = "none";
                od.ObjTypesBuilder.HostControl = od.SearchBox;
                od.ObjTypesBuilder.LoadItemSource(od.SearchBox.ObjTypes);
                //od.SearchBox.DesignView.ObjectSelector.Hide();
                od.ObjTypesBuilder.ShowModal();
            }

            }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);

    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "搜索结果列表模板设计";
    return obdc;
}