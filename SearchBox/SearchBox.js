DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Web.NavControls");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");


DBFX.Web.Controls.SearchBox = function () {
    var sbv = new DBFX.Web.Controls.Control("SearchBox");
    sbv.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.SearchBoxDesigner");
    sbv.ClassDescriptor.Serializer = "DBFX.Serializer.SearchBoxSerializer";
    sbv.VisualElement = document.createElement("DIV");
    sbv.VisualElement.className = "SearchBox";

    //输入框提示文字
    sbv.placeholder = "";
    Object.defineProperty(sbv, "Placeholder", {
        get: function () {
            return sbv.placeholder;
        },
        set: function (v) {
            sbv.placeholder = v;
            sbv.setTipText();

            //另一种实现效果：激活输入框  提示文字不消失
            // sbv.SearchInput.placeholder = v;
        }
    });

    //按钮文字
    sbv.btnText = "搜索";
    Object.defineProperty(sbv, "BtnText", {
        get: function () {
            return sbv.btnText;
        },
        set: function (v) {
            sbv.btnText = v;
            sbv.SearchBtnText.innerText = v;
        }
    });

    //图标图片
    sbv.imageUrl = "";
    Object.defineProperty(sbv, "ImageUrl", {
        get: function () {
            return sbv.imageUrl;
        },
        set: function (v) {
            sbv.imageUrl = v;
            //FIXME:
            if(v==""){
                sbv.SearchIcon.src = "Themes/" + app.CurrentTheme + "/Images/SearchBox/searchIcon.png";
            }else {
                sbv.SearchIcon.src = v;
            }

            // sbv.SearchBtnImg.src = v;
        }
    });


    sbv.inputText = "";
    sbv.SetText = function (v) {
        sbv.inputText = v;
    }

    sbv.GetText = function () {
        return sbv.inputText;
    }

    //搜索结果展示页面资源
    sbv.resultResourceUri = "";
    Object.defineProperty(sbv, "ResultResourceUri", {
        get: function () {
            return sbv.resultResourceUri;
        },
        set: function (v) {
            sbv.resultResourceUri = v;
        }
    });

    //触发搜索事件  事件处理程序 开发者执行存储过程
    sbv.OnSearchingFor = function () {

        if (sbv.Command != undefined && sbv.Command != null) {
            sbv.Command.Sender = sbv;
            sbv.Command.Execute();
        }

        if(sbv.SearchingFor != undefined && sbv.SearchingFor.GetType() == "Command"){
            sbv.SearchingFor.Sender = sbv;
            sbv.SearchingFor.Execute();
        }

        if(sbv.SearchingFor != undefined && sbv.SearchingFor.GetType() == "function"){
            sbv.SearchingFor(e,sbv);
        }
    }

    //单行选中事件 事件处理程序
    sbv.OnItemSelected = function () {
        if (sbv.Command != undefined && sbv.Command != null) {
            sbv.Command.Sender = sbv;
            sbv.Command.Execute();
        }

        if(sbv.ItemSelected != undefined && sbv.ItemSelected.GetType() == "Command"){
            sbv.ItemSelected.Sender = sbv;
            sbv.ItemSelected.Execute();
        }

        if(sbv.ItemSelected != undefined && sbv.ItemSelected.GetType() == "function"){
            sbv.ItemSelected(e,sbv);
        }

        //调用点击行事件后 应该关闭popUpPanel
        sbv.ResultPanel.Close();
    }

    //页面资源是否加载
    sbv.hasLoad = false;
    //TODO:展示搜索结果列表的方法  开发者在搜索事件里调用
    //obj对象包含数据列表Items 搜索到的数据集合
    sbv.Show = function (obj) {

        if(sbv.hasLoad == false){
            //PopUpPanel的属性FormContext赋值
            sbv.ResultPanel.FormContext = {Form:sbv.ResultPanel};
            sbv.ResultPanel.FormControls = {};
            //TODO:加载页面资源
            DBFX.Resources.LoadResource(sbv.resultResourceUri,function (sbvv) {
                sbvv.DataContext = obj;
                sbvv.SearchBar = sbv;
            },sbv.ResultPanel);

            sbv.hasLoad = true;
        }else {
            sbv.ResultPanel.DataContext = obj;
            sbv.ResultPanel.SearchBar = sbv;
        }

        //展示结果界面
        sbv.ResultPanel.Show(sbv);
    }

    sbv.OnCreateHandle();
    sbv.OnCreateHandle = function () {
        sbv.Class = "SearchBox";
        sbv.VisualElement.innerHTML =
            "<DIV class=\"SearchBoxContainer\">" +"<DIV class=\"SearchBoxSearchIcon\">"+
            "<IMG class=\"SearchBoxSearchIconImg\">" +
            "</DIV>"+
            "<DIV class=\"SearchBoxSearchBox\">" +
            "<INPUT class=\"SearchBoxSearchInputBox\" type='text'>" +
            "</DIV>" +
            "<DIV class=\"SearchBoxSearchButton\">" +
            "<IMG class=\"SearchBoxSearchButtonImg\">" +
            "<SPAN class=\"SearchBoxSearchButtonText\"></SPAN>" +
            "</DIV>" +
            "<DIV class=\"SearchBoxResultsList\">" +
            "</DIV>" +
            "</DIV>";
        sbv.SearchV = sbv.VisualElement.querySelector("DIV.SearchBoxContainer");
        sbv.SearchIcon = sbv.VisualElement.querySelector("IMG.SearchBoxSearchIconImg");
        sbv.SearchBox = sbv.VisualElement.querySelector("DIV.SearchBoxSearchBox");
        sbv.SearchInput = sbv.VisualElement.querySelector("INPUT.SearchBoxSearchInputBox");
        sbv.SearchBtn = sbv.VisualElement.querySelector("DIV.SearchBoxSearchButton");
        sbv.SearchBtnImg = sbv.VisualElement.querySelector("IMG.SearchBoxSearchButtonImg");
        sbv.SearchBtnText = sbv.VisualElement.querySelector("SPAN.SearchBoxSearchButtonText");
        sbv.SearchResultDiv = sbv.VisualElement.querySelector("DIV.SearchBoxResultsList");

        //设置图片
        sbv.SearchIcon.src = "Themes/" + app.CurrentTheme + "/Images/SearchBox/searchIcon.png";
        // sbv.SearchBtnImg.src = "Themes/" + app.CurrentTheme + "/Images/SearchBox/searchIcon.png";
        sbv.SearchBtnText.innerText = sbv.btnText;

        //不检查拼写错误
        sbv.SearchInput.spellcheck = false;
        //事件绑定
        sbv.SearchBtn.onmousedown = sbv.searchBtnClick;
        sbv.SearchInput.onfocus = sbv.searchInputFocus;
        sbv.SearchInput.onblur = sbv.searchInputBlur;
        sbv.SearchInput.onkeypress = sbv.searchInputKeypress;
        sbv.SearchInput.oninput = sbv.searchInputInput;


        //创建PopupPanel，用于展示结果列表
        sbv.ClientDiv = sbv.VisualElement;
        //popupPanel
        sbv.ResultPanel = new DBFX.Web.Controls.PopupPanel();
    }

    //搜索框事件处理
    sbv.searchInputFocus = function (e) {
        // console.log("onfocus");
        sbv.btnFlag = 0;
        if(sbv.SearchInput.value == sbv.placeholder){
            sbv.removeTipText();
        }else {
            //TODO:执行搜索事件
            //显示结果列表
            sbv.ShowResultList();
            sbv.btnFlag = 0;
        }
    }
    sbv.searchInputBlur = function (e) {
        console.log("onblur");
        console.log(sbv.btnFlag);
        if(sbv.SearchInput.value == ""){
            sbv.setTipText();
        }else  if(sbv.btnFlag != 1){
            sbv.HideResultList();
            sbv.btnFlag = 0;
        }

    }


    //回车键按下
    sbv.searchInputKeypress = function (e) {
        console.log("searchInputKeypress");
        //按回车键
        if(e.keyCode == 13){
            console.log("回车键 调用搜索事件");
            sbv.inputText = sbv.SearchInput.value==sbv.placeholder ? "":sbv.SearchInput.value;
            console.log(sbv.Text);
            //执行搜索事件
            sbv.OnSearchingFor();
        }
    }

    //搜索按钮点击处理
    sbv.searchBtnClick = function (event) {
        console.log("搜索按钮点击 调用搜索事件");
        sbv.btnFlag = 1;
        sbv.inputText = sbv.SearchInput.value==sbv.placeholder ? "":sbv.SearchInput.value;
        console.log(sbv.Text);
        //执行搜索事件
        sbv.OnSearchingFor();
    }

    //实时监听输入框内文字
    sbv.searchInputInput = function (e) {
        sbv.inputText = sbv.SearchInput.value;

        // console.log(sbv.Text);
        if(sbv.Text.length>0 && sbv.Text != ""){
            // console.log("输入字符 调用搜索事件");
            //TODO:执行搜索事件 但是会多次调用 慎用！！
            //显示结果列表
            // sbv.ShowResultList();
        }else{
            // sbv.HideResultList();
        }
    }

    //显示/隐藏 结果列表
    sbv.ShowResultList = function () {
        // sbv.SearchResultDiv.style.display = "block";
    }

    sbv.HideResultList = function () {
        // sbv.SearchResultDiv.style.display = "none";
    }

    //设置与移除提示文字
    sbv.setTipText = function () {
        sbv.SearchInput.value = sbv.placeholder;
        sbv.SearchInput.style.color = "#3c3f41";
    }

    sbv.removeTipText = function () {
        sbv.SearchInput.value = "";
        sbv.SearchInput.style.color = sbv.inputColor;
    }

    sbv.SetColor = function (v) {
        sbv.inputColor = v;
        if(sbv.SearchInput.value == sbv.placeholder){
            sbv.SearchInput.style.color = "#3c3f41";
        }else {
            sbv.SearchInput.style.color = v;
        }

    }

    sbv.GetColor = function () {
        return sbv.SearchInput.style.color || sbv.inputColor;
    }

    sbv.SetBorderRadius = function (v) {
        sbv.VisualElement.style.borderRadius = v;
        sbv.SearchBtn.style.borderBottomRightRadius = v;
        sbv.SearchBtn.style.borderTopRightRadius = v;
    }

    sbv.OnCreateHandle();
    return sbv;
}

DBFX.Serializer.SearchBoxSerializer = function () {
    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("Placeholder", c.Placeholder, xe);
        DBFX.Serializer.SerialProperty("ResultResourceUri", c.ResultResourceUri, xe);
        DBFX.Serializer.SerialProperty("BtnText", c.BtnText, xe);
        DBFX.Serializer.SerialProperty("ImageUrl", c.ImageUrl, xe);

        //序列化方法
        DBFX.Serializer.SerializeCommand("SearchingFor", c.SearchingFor, xe);
        DBFX.Serializer.SerializeCommand("ItemSelected", c.ItemSelected, xe);
    }

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("Placeholder", c, xe);
        DBFX.Serializer.DeSerialProperty("ResultResourceUri", c, xe);
        DBFX.Serializer.DeSerialProperty("BtnText", c, xe);
        DBFX.Serializer.DeSerialProperty("ImageUrl", c, xe);

        //对方法反序列化
        DBFX.Serializer.DeSerializeCommand("SearchingFor", xe, c);
        DBFX.Serializer.DeSerializeCommand("ItemSelected", xe, c);
    }

}
DBFX.Design.ControlDesigners.SearchBoxDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {
        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/SearchBoxDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
            //设计器中绑定事件处理
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{EventName:"SearchingFor",EventCode:undefined,Command:od.dataContext.SearchingFor,Control:od.dataContext},{EventName:"ItemSelected",EventCode:undefined,Command:od.dataContext.ItemSelected,Control:od.dataContext}];
        }, obdc);
    }

    //事件处理程序
    obdc.DataContextChanged = function (e) {
        obdc.DataBind(e);
        if(obdc.EventListBox != undefined){
            obdc.EventListBox.ItemSource = [{EventName:"SearchingFor",EventCode:undefined,Command:obdc.dataContext.SearchingFor,Control:obdc.dataContext},{EventName:"ItemSelected",EventCode:undefined,Command:obdc.dataContext.ItemSelected,Control:obdc.dataContext}];
        }
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "搜索控件";
    return obdc;
}