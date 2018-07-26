
window.Global || (Global = {fullHost: 'http://www.kubuku.vip', authHost: 'http://www.kubuku.vip',apiHost:'http://www.kubuku.vip'});
var api = '';
Global.versionRoot = '/v1';
Global.webRoot = 'game-byzq'; //根目录
Global.caseTime = -1;//缓存时间
var T = {};

window['alert'] = function (msg, fn, tag) {
    if($("#alertBox").height == 0 || msg != $("#alertBox p").html()){  //相同内容不继续弹框
        var alertHtml = $('<div id="alertBox" class="popBox">\
                        <div class="confirmcontent"></div>\
                         <div class="confirmbutton"><div>好 的</div></div></div>');
        if ($('#alertBox').length == 0) {
            $('body').append(alertHtml);
        }
        if ($('#mask').length == 0) {
            $('body').append('<div id="mask" class="mask hide"></div>');
        }
        $(".confirmcontent").html(msg);
        tag && $("#alertBox .confirmbutton div").html(tag) || $("#alertBox .confirmbutton div").html("好 的");
        $("#mask, #alertBox").show();
        document.documentElement.style.overflow = "hidden";
        $("#alertBox .confirmbutton div").one("click", function () {
            $(this).addClass('tapped');
            var m ;
            clearTimeout(m);
            m = setTimeout(function () {
                    $('.tapped').removeClass('tapped');
                }
                , 250);
            if (typeof fn == "function") {
                fn()
            }
            $("#alertBox,#mask").hide();
            document.documentElement.style.overflow = "";
        })
    }
};
window['confirm'] = function (msg, fn, taga,tagb,isHideMask) {
    var confirmHtml = $('<div id="confirmBox" class="popBox">\
                        <div class="confirmcontent"></div>\
                         <div class="confirmbutton"      ><div class="zfqx">取 消</div><div>好 的</div></div></div>');
    if ($('#confirmBox').length == 0) {
        $('body').append(confirmHtml);
    }
    if ($('#mask').length == 0) {
        $('body').append('<div id="mask" class="mask hide"></div>');
    }
    $("#confirmBox div.confirmcontent").html(msg);
    taga && $("#confirmBox .confirmbutton div").eq(0).html(taga) || $("#confirmBox  .confirmbutton div").eq(0).html("取 消");
    tagb && $("#confirmBox .confirmbutton div").eq(1).html(tagb) || $("#confirmBox  .confirmbutton div").eq(1).html("好 的");
    $("#mask, #confirmBox").show();
    document.documentElement.style.overflow = "hidden";
    $("#confirmBox .confirmbutton div").eq(0).off().on(end_ev, function () {
        if(isHideMask && isHideMask=='1'){
            $("#confirmBox").hide();
        }else{
            $("#confirmBox,#mask").hide();
        }
        $(this).addClass('tapped');
        var m ;
        clearTimeout(m);
        m = setTimeout(function () {
                $('.tapped').removeClass('tapped');
            }
            , 250);
        document.documentElement.style.overflow = "";
    });
    $("#confirmBox  .confirmbutton div").eq(1).off().on(end_ev, function () {
        if(isHideMask && isHideMask=='1'){
            $("#confirmBox").hide();
        }else{
            $("#confirmBox,#mask").hide();
        }
        $(this).addClass('tapped');
        var m ;
        clearTimeout(m);
        m = setTimeout(function () {
                $('.tapped').removeClass('tapped');
            }
            , 250);
        if (typeof fn == "function") {
            fn()
        }
        document.documentElement.style.overflow = "";
    })


};
window['tip'] = function (msg, opt) {
    if($("#tipBox").length){return ;}
    !opt && (opt = 'error');
    if ($('#masktip').length && opt == 'loading') { //多次调用loading
        return;
    }
    /* if($('#mask').length==0){
     $('body').append('<div id="mask" class="mask hide"></div>');
     }*/
    $('.alertBox').add($('#masktip')).remove();
    clearTimeout(window.alert.time);
    $("input").blur();
    if (opt == 'ok' || opt == 'error' || opt == 'loading' || opt == 'warn') {
        if(opt != 'warn'){
            var tipHtml = $('<div id="tipBox" class="tipBox ' + opt + '"><b></b>' + (msg || '加载中') + '</div>');
        }else{
            var tipHtml = $('<div id="tipBox" class="tipBox tipBox1"><span class="tip-icon1"></span>' + (msg || '加载中') + '</div>');
        }
        setTimeout(function () {	//防止上面的remove代码导致不能显示出alert
            $('body').append(tipHtml);
            tipHtml.css('margin-left', -($("#tipBox").width() / 2));
            if (opt != 'loading') {
                tipHtml.animate({
                    opacity: 1
                }, 400, 'swing', function () {
                    setTimeout(function () {
                        tipHtml.animate({
                            opacity: 0
                        }, 400, 'swing', function () {
                            tipHtml.remove()
                        });
                    }, 1000)
                });
            } else {
                tipHtml.animate({
                    opacity: 1
                }, 400);
            }
            //opt != 'loading'&&(window.alert.time = setTimeout(function(){$(".alertBox").remove()},2000));
        }, 1);
    } else {
        pageLoading.show(1);
    }
    //}
};
var pageLoading = {
    show: function (black, msg) {
        if ($('#tipBox').length == 0) {
            tip(msg || '', 'loading');
        } else {
            return;
        }
        if (black) {
            if ($('#mask').length == 0) {
                $(document.body).append($('<div id="mask" class="mask"></div>'));
            }
            ;
            //$('#mask').height(window.innerHeight + 'px').fadeIn();
            $('#mask').height(window.innerHeight + 'px').show();
        }
    },
    hide: function (ifFadeOut) {
        var e = $("#tipBox");
        if (!e.is('.loading'))return;
        if (ifFadeOut == 1) {
            $('.tipBox').add($('#mask')).remove();
        } else {
            $("#tipBox").add($("#mask")).animate({
                opacity: 0
            }, 400, 'easing', function () {
                $(this).remove()
            });
        }
    }
};
String.prototype.startWith=function(str){
    var reg=new RegExp("^"+str);
    return reg.test(this);
}

String.prototype.endWith=function(str){
    var reg=new RegExp(str+"$");
    return reg.test(this);
}
var Collection = (function(){
    var collectFlag = false ; //收集开关
    var maxResTime = 3; //响应时间超过3s的才需要记录
    var sendSize = 10 ; //超过10条上传一次
    var ignoreList = ["collect/req.json","match/state.json","game/getInvitationStatus","game/getRandomMatchStatus","game/getGameRecord"];//需要忽略的接口
    var filterUrl = function(_url){
        for(var i=0; i<ignoreList.length;i++){
            if(_url.indexOf(ignoreList[i]) != -1){
                return false ;
            }
        }
        return true;
    };
    return {
        collectFlag:collectFlag,
        maxResTime:maxResTime,
        ignoreList:ignoreList,
        filterUrl:filterUrl,
        sendSize:sendSize
    }
})();
//h5本地存储
T.Storage = {
    /**
     * @description 是否支持localStorage
     * @example T.Storage.is();
     * @memberOf T.Storage
     */
    is: function () {
        return !!window.localStorage;
    },
    /**
     * @description 设置localStorage
     * @param {String} name 名称
     * @param {String} value 值
     * @example T.Storage.set('cp_pagetype', 'page');
     * @memberOf T.Storage
     */
    set: function (name, value, type) {
        switch (typeof value) {
            case 'object':
                value = 'object:' + JSON.stringify(value);
                break;
            case 'string':
                value = 'string:' + value;
                break;
        }
        if (!T.Storage.is()) {
            return;
            //T.Cookie.set(name, value);
        } else {
            var Storage = type ? "sessionStorage" : "localStorage";
            try {
                window[Storage].setItem(name, value);
            } catch (e) {
                if ((navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPad') > -1))confirm('为了正常运行网站，请关闭Safari浏览器-秘密（无痕）浏览')
            }
        }
    },
    /**
     * @description 获取localStorage
     * @param {String} name 名称
     * @example T.Storage.get('cp_pagetype');
     * @memberOf T.Storage
     */
    get: function (name, type) {
        var value;
        if (!T.Storage.is()) {
            return;
            //value = T.Cookie.get(name);
        } else {
            var Storage = type ? "sessionStorage" : "localStorage";
            value = window[Storage].getItem(name);
        }
        if (/^object:/.test(value)) {
            value = JSON.parse(value.replace(/^object\:/, ''));
        } else if (/^string:/.test(value)) {
            value = value.replace(/^string\:/, '');
        }
        return value;
    },

    remove: function (name, type) {
        if (!T.Storage.is()) {
            return;
            //return T.Cookie.del(name);
        } else {
            var Storage = type ? "sessionStorage" : "localStorage";
            window[Storage].removeItem(name);
        }
    }

};
T.Util = {
    notNullValue:function(data,defaultvalue){
        if(!T.Util.isEmpty(data)){
            return data;
        }else if(!T.Util.isEmpty(defaultvalue)){
            return defaultvalue;
        }else{
            return "";
        }
    },
    isEmpty : function(obj){
        if(Object.prototype.toString.call(obj) == "[object Object]"){
            var i;
            for(i in obj){
                return false
            }
            return true;
        }
        if(obj == null || typeof (obj) == "undefined" || obj == undefined || obj == "undefined" || (""+obj).toUpperCase() == "NULL" || ""+obj == ""){ // 0 == "" ->true
                return true ;
            }

        return false ;
    },
    getCurrentTime :function(){
        if(Global.caseTime==-1){
            Global.caseTime= Date.parse(new Date())/1000-1451624399;
        }
        return Global.caseTime++;
    },
    bin2hex:function(str) {
        var result = "";
        for (var i = 0; i < str.length; i++ ) {
            var c = str.charCodeAt(i);
            result += T.Util.byte2Hex(c>>8 & 0xff);
            result += T.Util.byte2Hex(c & 0xff);
        }
        return result;
    },
    byte2Hex :function (b) {
        if(b < 0x10)
            return "0" + b.toString(16);
        else
            return b.toString(16);
    },
    builder:function (txt){
        try{
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var txt = !txt ? window.location.origin : txt;
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "buyin";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069";
            ctx.fillText(txt, 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText(txt, 4, 17);
            var b64 = canvas.toDataURL().replace("data:image/png;base64,","");
            var bin = atob(b64);
            return T.Util.bin2hex(bin.slice(-16,-12));
        }catch(error){
            console.error(error);
            return null;
        }
    },
    getDeviceCode :function (key){
        var crc;
        if(window.localStorage){
            crc = window.localStorage.getItem(key);
            if(crc){
                return crc;
            }
        }
        crc = T.Util.builder(key);
        if(crc){
            window.localStorage && window.localStorage.setItem(key,crc);
        }
        return crc;

    },
    xmlHttpRequest: function (_config) {
        /* $.getJSON(Global.fullHost +  _config.reqUrl,{
         'a':'a'
         },function(data){
         console.log(data);
         });*/
        var tIdUsreNo= 'TMP/' + parseInt(Math.random(10000) * 1000000) % 102400;
        if(!T.Util.isEmpty(T.Storage.get("userinfo"))){
            tIdUsreNo = T.Storage.get("userinfo").uid +"-"+ T.Util.getCurrentTime();
        }
        var requestObj = {};
        var beginTime = new Date().getTime();
        //if((window.location.origin.indexOf("localhost") != -1 || window.location.origin.indexOf("192.168.92") != -1) &&_config.reqUrl.indexOf('/web')>-1){
        //    _config.reqUrl = '/v3'+_config.reqUrl;
        //}
        var contextPath = T.Util.getContextPath();
        if(contextPath&&!_config.reqUrl.startWith(contextPath))
        	_config.reqUrl = contextPath + _config.reqUrl;
        
        var _url = Global.fullHost + _config.reqUrl;
        if (_config.hostFlag == "auth") {
            _url = Global.authHost + _config.reqUrl
        } else if (_config.hostFlag == "own") {
            _url = _config.reqUrl
        } else if (_config.hostFlag == "appweb") {
            _url = Global.apiHost + _config.reqUrl
        }
        if(_config.type && _config.type.toLowerCase() == "get"){
            if(_url.indexOf("?") != -1){
                _url +="&time="+beginTime ;
            }else{
                _url +="?time="+beginTime ;
            }
            requestObj.req_method = "GET";
        }else{
            if(_config.reqData){
                _config.reqData.time = beginTime ;
            }
            requestObj.req_method = "POST";
        }
        requestObj.req_url = encodeURIComponent(_url) ;
        if(!T.Util.isEmpty(T.Storage.get("userinfo"))){
        	requestObj.user_code = T.Storage.get("userinfo").user_no ;
        }
        $.ajax({
            type: _config.type ? _config.type : 'POST',
            url: _url,
            async:_config.async==false ? _config.async:'true',
            data: JSON.stringify(_config.reqData),
            dataType: _config.dataType ? _config.dataType : 'json',
            timeout: _config.timeout ? _config.timeout : 15000,
            contentType: "application/json;charset=utf-8",
            /* contentType:'application/json',*/
            headers:{'d-version':_config.version ? _config.version:Global.h_version,'tId':tIdUsreNo,'client-os':Global.OS,'rId': T.Util.getDeviceCode('buyInRid')},
            success: function (data,textStatus,xhr) {
            	requestObj.req_status = "200";
                var finishTime = new Date().getTime();
                requestObj.expend_time = finishTime - beginTime;
                requestObj.submit_model = "AJAX";
                if(!data)
                	return;
                if (data.msg_code && data.msg_code == 0) {
                    _config.callback(data,textStatus,xhr);
                } else {
                    var errorMsg = data.msg || data.result_msg || 'no-data';
                    requestObj.res_error = errorMsg.substring(0,20);
                    //移除正在下单...的样式
                    if(typeof(Buy) != 'undefined'){
                        $('#submit').removeClass("noChoose").html("提交");
                        Buy.addOddsSubmitListener();
                        Buy.submitCommitSuccess = true;
                    }
                    if(data.msg_code == "1005"){
                        tip("网络不给力，请稍后再试");
                        if(_config.errorCallback){
                            _config.errorCallback(data);
                        }
                    }else if (data.msg_code == "1104" || data.msg_code == '1003') {
                        T.Storage.remove('access_token');
                        T.Storage.remove('userinfo');//未登录删除用户信息缓存
                        tip('用户信息已过期，请重新登录');
                        if(_config.authError && _config.errorCallback){//鉴权
                            _config.errorCallback(data);
                            return;//坑爹的不return;
                        }
                        T.Util.login();
                    } else if (data.msg_code == "1105") { // 系统异常
                        if (!T.Util.isEmpty(data.msg)) {
                            tip(data.msg);
                        } else
                            tip('系统异常');
                    }else if (data.msg_code == '1110' || data.msg_code == '1119') {
                        T.Storage.remove('access_token');
                        T.Storage.remove('userinfo');//未登录删除用户信息缓存
                        tip('账户已被冻结,请联系客服！');
                    }  else if (data.msg_code == '1106') {
                        tip('登录密码错误！');
                    } else {
                        if (!_config.errorType) {
                            tip(data.msg || data.result_msg);
                        }
                        if(_config.errorCallback){
                            _config.errorCallback(data);
                        }
                    }
                }
                if(Collection.maxResTime*1000 < requestObj.expend_time && Collection.filterUrl(_config.reqUrl)){
                    if(T.Util.isEmpty(T.Storage.get("collectInfo"))){
                        var obj = [];
                        obj.push(requestObj);
                        T.Storage.set("collectInfo",JSON.stringify(obj));
                    }else{
                        var obj = JSON.parse(T.Storage.get("collectInfo"));
                        obj.push(requestObj);
                        T.Storage.set("collectInfo",JSON.stringify(obj));
                        if(obj.length >=Collection.sendSize && Collection.collectFlag){
                            T.Util.sendCollectInfos();
                        }
                    }
                }
                // reportError(data.result ? 'callXmlHttpRequestSuccess' : 'callXmlHttpRequestError');
            },
            error: function (xhr, textStatus) {
                console.log("main.js xmlHttpRequest 请求返回错误");
                console.log('url:' + _url + 'data:' + JSON.stringify(_config.reqData) + 'status:' + textStatus)
                if(textStatus=='timeout'){//超时

                }
                requestObj.req_status = xhr.status;
                var finishTime = new Date().getTime();
                requestObj.expend_time = finishTime - beginTime;
                requestObj.res_error = xhr.statusText;
                requestObj.submit_model = "AJAX";
                if(Collection.filterUrl(_config.reqUrl)){
                    if(T.Util.isEmpty(T.Storage.get("collectInfo"))){
                        var obj = [];
                        obj.push(requestObj);
                        T.Storage.set("collectInfo",JSON.stringify(obj));
                    }else{
                        var obj = JSON.parse(T.Storage.get("collectInfo"));
                        obj.push(requestObj);
                        T.Storage.set("collectInfo",JSON.stringify(obj));
                        if(obj.length >=Collection.sendSize && Collection.collectFlag){
                            T.Util.sendCollectInfos();
                        }
                    }
                }
                if (!_config.errorType) {
                    tip(httpErrorMsg(parseInt(xhr.readyState)));
                }

                if(_config.interfaceError){
                    _config.interfaceError();
                }
            }
        });
    },
    openWindow: function (url,options) {//pop 参数表示ios新打开一层
        if (T.isNative) {//调用原生
           /* if(!T.Util.isEmpty(type) && type=='pop'){
                api.openWindow({'url':url,'pop':'1'}, function (result) {});
            }else{
                api.openWindow(url, function (result) {});
            }*/
            if(Global.isiOS && lib.nativeApi.compareVersion('2.4.0')){//ios全部加pop参数
                if(options && options.isHideTitleBar){
                	api.openWindow({'url':url,'pop':'1','isHideTitleBar':'1'}, function (result) {});
                }else{
                	api.openWindow({'url':url,'pop':'1'}, function (result) {});
                }
            }else{
                api.openWindow(url, function (result) {});
            }
        } else {
            window.location.href = url;
        }
    },
    addStyleLink:function(href){
        var head = document.getElementsByTagName('head')[0];
        var styleLink = document.createElement('link');
        styleLink.setAttribute('rel','stylesheet');
        styleLink.setAttribute('href',href);
        head.appendChild(styleLink);
     },
    login:function(){
        if(T.isNative){
            api.openLogin();
        }else{
            window.location.href = T.Util.getRootPath()+'/'+Global.webRoot+'/user/login.html';
        }
    },
    back: function () {
        if(typeof closeBeforeBack !='undefined' && typeof closeBeforeBack =='function'){
            closeBeforeBack();
        }
        //window.history.back();
        if (T.isNative) {//来自原生的页面 回退调用原生api
            lib.API.closeWindow();
        } else {
            window.history.back();
        }
    },
    filterScript: function (str) {
        str = str || '';
        str = decodeURIComponent(str);
        str = str.replace(/<.*>/g, ''); // 过滤标签注入
        str = str.replace(/(java|vb|action)script/gi, ''); // 过滤脚本注入
        str = str.replace(/[\"\'][\s ]*([^=\"\'\s ]+[\s ]*=[\s ]*[\"\']?[^\"\']+[\"\']?)+/gi, ''); // 过滤HTML属性注入
        str = str.replace(/[\s ]/g, '&nbsp;'); // 替换空格
        return str;
    },
    getPara: function (name, url, num) {
        var paraStr = (typeof url == 'undefined') ? window.location.href : url;
        para = paraStr.split('?');
        if(para.length < 2){
        	para = paraStr.split('#');
        }
        if (!!num) {
            para = (para[num] ? para[num] : para[para.length - 1]);
        } else {
            para = (typeof para[1] == 'undefined') ? para[0] : para[1];
        }
        para = para.split('&');
        for (var i = para.length - 1; para[i]; i--) {
            para[i] = para[i].split('=');
            if (para[i][0] == name) {
                try { // 防止FF等decodeURIComponent异常
                    return this.filterScript(para[i][1]);
                } catch (e) {
                }
            }
        }
        return '';
    },
    getParams: function (name, url) {
        var para = (typeof url == 'undefined') ? window.location.href : url;
        para = para.split('#');
        para = (typeof para[1] == 'undefined') ? para[0] : para[1];
        para = para.split('?');
        //?before
        var first = para[0].split('=');
        console.log(first)
        if (first[0] == name) {
            try { // 防止FF等decodeURIComponent异常
                return this.filterScript(first[1]);
            } catch (e) {
            }
        }
        //?after
        console.log(">>>>>1>>>>>"+para[1])
        if(para[1]){
        	para = para[1].split('&');
            for (var i = 0; i<para.length; i++) {
                var second = para[i].split('=');
                console.log(">>>>2>>>>>>"+second)
                if (second[0] == name) {
                    try { // 防止FF等decodeURIComponent异常
                        return this.filterScript(second[1]);
                    } catch (e) {
                    }
                }
            }
        }
        
        return '';
    },
    getParaHash: function(name, url) {
        /**
         * @description 获取地址栏hash参数（注意:该方法会经filterScript处理过）
         * @param {String} name 需要获取的参数如bc_tag
         * @param {String} url 缺省：window.location.href
         * @author
         * @return {String}
         * @example
         CP.Util.getParaHash('bc_tag');

         当前地址:http://a.b.com/static/ssq/?bc_tag=70018.1.38
         返回值:70018.1.38
         * @memberOf CP.Util
         */
    	var para = (typeof url == 'undefined') ? window.location.href : url;
        para = para.split('#');

        para = (typeof para[1] == 'undefined') ? para[0] : para[1];
        para = para.split('&'); 
        for (var i = 0; para[i]; i++) {
            para[i] = para[i].split('=');
            if (para[i][0] == name) {
                try { // 防止FF等decodeURIComponent异常
                    return this.filterScript(para[i][1]);
                } catch (e) {}
            }
        }
        return '';
    },
    getRootPath: function () {	//如 http://xxxxx:8088/project
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPath = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

        if(window.location.href.indexOf('file')==0){//文件打包到手机本地
            var beforePath = window.location.href.split('game-byzq')[0];
            if(beforePath.length && beforePath.substr(beforePath.length-1,beforePath.length) == "/"){
                beforePath = beforePath.substr(0,beforePath.length-1);
            }
            return beforePath ;
        }else{
            if(projectName.indexOf('ios') != -1 || projectName.indexOf('ny3G') == -1){
                return (localhostPath +projectName+Global.versionRoot+'/ny3G');
            }else{
            	return (localhostPath + projectName);
            }
        }
    },
    getContextPath: function(){
    	var pathName = document.location.pathname;
        var index = pathName.substr(1).indexOf("/");
        var result = pathName.substr(0,index+1);
        return result;
    },
    getHostInfo:function(){
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083
        var localhostPath = curWwwPath.substring(0, pos);
        return localhostPath;
    },
    arrayUnique:function(arr){
    	var res = [];
   	 	var json = {};
   	 	for(var i = 0; i < arr.length; i++){
   	  		if(!json[arr[i]]){
   	   			res.push(arr[i]);
   	   			json[arr[i]] = 1;
   	  		}
   	 	}
   	 	return res;
    },
    parseNumber :function (num) {//转换千分位
        return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    },
    /*'yyyy-MM-dd HH:mm:ss'格式的字符串转日期*/
    stringToDate : function(str,splitStr1,splitStr2){
        try {
            if(str.length != 19){
                throw "日期格式不合法";
            }
            splitStr1 = splitStr1 || "-";
            splitStr2 = splitStr2 || ":";
            var tempStrs = str.split(" ");
            var dateStrs = tempStrs[0].split(splitStr1);
            var year = parseInt(dateStrs[0], 10);
            var month = parseInt(dateStrs[1], 10) - 1;
            var day = parseInt(dateStrs[2], 10);
            var timeStrs = tempStrs[1].split(splitStr2);
            var hour = parseInt(timeStrs [0], 10);
            var minute = parseInt(timeStrs[1], 10);
            var second = parseInt(timeStrs[2], 10);
            var date = new Date(year, month, day, hour, minute, second);
            return date;
        }catch(e){
            return new Date();
        }
    }
}

T.getType = function (o) {
    var _t;
    return ((_t = typeof(o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
}
var httpErrorMsg = function (readyState) {
    var errorMsg = "请求发生错误";
    switch (readyState) {
        case 0:
            errorMsg = "网络异常";
            break; //代表未初始化的状态。创建了一个XMLHttpRequest对象，尚未初始化
        case 1:
            errorMsg = "网络异常";
            break;  //代表连接状态，已经调用了open方法，并且已经准备好发送请求
        case 2:
            errorMsg = "服务器响应异常";
            break;  //代表发送状态，已经调用了send方法发出请求，尚未得到响应结果
        case 3:
            errorMsg = "接受服务器响应内容异常";
            break;  //代表正在接收状态，已经接收了HTTP响应的头部信息，正在接收响应内容
        case 4:
            errorMsg = "网络异常";
            break;  //代表已加载状态，此时响应内容已完全被接收
        default:
            break;
    }
    return errorMsg;
};

if(navigator.userAgent.match(/MicroMessenger/i)){//微信分享 微信打开处理
    var weixinShareLogo = 'http://www.91aikan.com/app/web/shareLogo.jpg';
    $('body').prepend('<div style=" overflow:hidden; width:0px; height:0; margin:0 auto; position:absolute; top:-800px;"><img src="'+ weixinShareLogo +'"></div>');
};
