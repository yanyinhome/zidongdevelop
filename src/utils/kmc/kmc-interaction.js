import KmcEnv from './kmc-env';
import $ from 'jquery';

window.handleKeyBoard = null;
window.handleShowDateDialog = null;
document.addEventListener('fillInputContent', function (t) {
    KmcInteraction.log('键盘返回的data： ' + t.data.data);
    KmcInteraction.log('键盘返回的marketId： ' + t.data.marketId);
    KmcInteraction.log('键盘返回的subtype： ' + t.data.subtype);
    window.handleKeyboard(t.data.data, t.data.marketId, t.data.subtype);
});
document.addEventListener('fillDate', function (t) {
    KmcInteraction.log('键盘返回的data： ' + t.data.data);
    window.handleShowDateDialog(t.data.data);
});
window.handlePageBack = null;
let KmcInteraction = {
    /**
     *    URL 跳转界面——用于mpaas的应用包之间的页面跳转
     *    @param url    url地址
     *    @param hasRefresh    标识有无刷新按钮 0：显示，4：隐藏(占空间),8:隐藏(不占空间)
     *    @param direction    1：下一级界面；-1：返回上一级界面  0：在原生覆盖掉当前页面  -100：直接成为顶层页面
     *    @param handlePageBack
     */
    switchWebView: function (url, hasRefresh, direction, handlePageBack) {
        if (handlePageBack) {
            window.handlePageBack = handlePageBack;
        }
        if (KmcEnv.platform.isPhone) {
            // if(!KmcEnv.platform.isBrower){
            // 未传第2个参数时默认为0
            hasRefresh = hasRefresh === undefined ? 0 : hasRefresh;
            // 未传第3个参数时默认为1
            direction = direction === undefined ? 1 : direction;
            // hasRefresh 参数值不是数字，使用默认值 0
            hasRefresh = !isNaN(hasRefresh) ? parseInt(hasRefresh) : 0;
            // direction 参数值不是数字，使用默认值 1
            direction = !isNaN(direction) ? parseInt(direction) : 1;
            this.sendInteraction("switchWebView", [url, hasRefresh, direction]);
        } else {
            url = this.getFirstHref() + url;
            // console.log("跳转地址：" + url);
            // 平级页面之间的跳转
            if (direction === 0) {
                window.location.replace(url)
            } else {
                window.location.href = url;
            }
        }
    },
    /**
     * 通过原生打开 H5页面
     * @param type yw(优问) local(本地H5页面) third(其他第三方页面)
     * @param url 打开的地址（优问页面不需要传地址）
     * @param  {String} functionCode   [功能Code]
     *    以 KDS_TICKET_NO_JSSWITCH 为前缀: 跳转时不不需要先登录资⾦金金账号等,在⻚面loadUrl 完成后调⽤用JS⽅方法( setUserData函数 ), 传递相关⽤用户数据;
     *    以 KDS_TICKET_NO_LOGINED_JSSWITCH 为前缀: 跳转前先登录资⾦金金账号及获取Ticket等 , 在⻚页⾯面loadUrl完成后调⽤用JS⽅方法( setUserData函数 ), 传递相关⽤用户数据;
     *    传 KDS_WEB_STOCK_WARN : 需要先登录⼿手机号, 跳转第三⽅方Web⻚页⾯面, 在⻚页⾯面loadUrl完 成时, 调⽤用JS⽅方法( setDeviceAndMobileData函数 ), 传递deviceId(设备号)、mobileNO(⼿手 机号); *    传 KDS_F10_NEWS_DETAILS : 供个股详情 F10 Web 跳转⾄至资讯详情界⾯面(传递接⼝口 url 及⼊入参供请求解析);
     *    以 KDS_Trade_Web_SwitchStack 为前缀: 供内部交易易H5调⽤用的功能Key,在⼆二级交易易Web 界⾯面打开指定H5⻚页⾯面(传递内部交易易H5的相对url路路径);
     * @param  {String} userDataJson   [需要转发的用户信息JSON数据]
     *    扩展参数示例例: {"custid":"客户 代码","fundid":"资⾦金金账号","userrole":"⽤用户⻆角⾊色","orgid":"操作机构","ticket":"tick et票据"}
     */
    openWebPageByNative: function (type, url, functionCode, userDataJson) {
        // console.log(' openWebPageByNative type: ', type, ' url:', url, 'functionCode:', functionCode, 'userDataJson:', userDataJson);
        window.AlipayJSBridge && window.AlipayJSBridge.call(
            'openWebPageByNative',
            {
                type: type,
                url: url,
                functionCode: functionCode,
                userDataJson: userDataJson
            },
            function (result) {
                if (result) {
                    KmcInteraction.log("h5:openWebPageByNative:return=>" + JSON.stringify(result));
                }
            }
        );
    },
    //打开自定义原生键盘
    showKeyBoard: function (id, type, handleKeyBoardClick, getY) {
        window.handleKeyboard = handleKeyBoardClick;
        if (id === undefined) {
            return;
        }
        let inputObj = $("[id='" + id + "']");
        if (inputObj.length === 0) {
            return;
        } else {
            console.log("文本输入框 id=" + id);
        }
        //inputObj.focus();
        if (type === undefined) {
            return;
        }
        let X = inputObj.offset().left;
        let Y = inputObj.offset().top;
        // 兼容 ios，获取弹框可见区域的位置
        if (KmcEnv.platform.isPhone && !KmcEnv.platform.isAndroid) {
            let e = window.event;
            Y = e.clientY || Y;
        }
        Y += inputObj.height();            // 加上文本框高度
        Y += 80;                           // 额外加 80 像素, 可以显示出下一个输入框或按钮
        // 系数 = 输入框底部到页面顶部的高度 / 页面可见区域高度
        if (KmcEnv.platform.isAndroid) {
            Y = Y / (window.document.body.clientHeight === 0 ? window.screen.availHeight : window.document.body.clientHeight);
            // 检测是否是需要处理的特殊设备型号
            if (this.specialDeviceDisplay()) {
                Y = 0;
            }
        }
        if (typeof getY === 'function') {
            Y = getY(id);
        }
        this.log("h5:showKeyBoard=>type:" + type + ",Y:" + Y);
        window.AlipayJSBridge && window.AlipayJSBridge.call(
            'showKeyBoard',
            {
                type: type,
                Y: Y
            },
            function (result) {
                if (result) {
                    KmcInteraction.log("h5:showKeyBoard:return=>" + JSON.stringify(result));
                }
            }
        );
    },
    // 检测是否是需要处理的特殊设备型号，是则反回 true , 否则返回 false
    specialDeviceDisplay: function () {
        let ua, start_index, version;
        ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("huawei")) {
            start_index = ua.indexOf('huawei');
            version = ua.substring(start_index, start_index + 15);
        } else if (ua.indexOf("zte")) {
            start_index = ua.indexOf('zte');
            version = ua.substring(start_index, start_index + 8);
        }
        version = version.replace("/", " ");
        if (version === "huawei p6 s-u06" || version === "zte v975") {
            return true;
        }
        return false;
    },
    //隐藏自定义键盘
    hideKeyBoard: function () {
        this.sendInteraction("hideKeyBoard");
    },
    //自助开户功能
    selfserviceAccount: function () {
        this.sendInteraction("selfserviceAccount");
    },
    //资金账号绑定
    backZjzhBind: function (zjzh) {
        this.sendInteraction("backZjzhBind", [zjzh]);
    },
    //调用手机号码注册界面
    showRegisterView: function () {
        this.sendInteraction("ShowRegisterView");
    },
    //添加自选股
    addUserStock: function (stockName, stockCode, marketId) {
        this.sendInteraction("addUserStock", [stockName, stockCode, marketId]);
    },
    //保存数据到本地
    saveOrUpdateLocalData: function (key, value) {
        this.sendInteraction("saveOrUpdateLocalData", [key, value]);
    },
    //返回当前登录的资金账号
    onLoginAccount: function (loginAccount) {
        this.sendInteraction("onLoginAccount", [loginAccount]);
    },
    //打印日志
    log: function (content) {
        window.AlipayJSBridge && window.AlipayJSBridge.call(
            'log',
            {
                content: content
            },
            function (result) {
            }
        );
    },
    //显示日期控件
    showDateDialog: function (time, min, max, method, handleShowDateDialog) {
        window.handleShowDateDialog = handleShowDateDialog;
        this.sendInteraction("showDateDialog", [time, min, max, method]);
    },
    //隐藏日期控件
    hideDateDialog: function () {
        this.sendInteraction("hideDateDialog", []);
    },
    getStockData: function (type, handler, ...rest) {
        this.sendInteractionWithCallback("getStockData", handler, [type, ...rest]);
    },
    // 获取股票分时数据 {type: 'fs|fivefs', stockId: '000001', markId: '0'}
    getStockDataFenShi: function (json) {
        this.sendInteraction("getStockDataFenShi", [json]);
    },
    //跳转到个股行情接口
    jumpStockDetailInterface: function (stockCode, marketId) {
        this.sendInteraction("jumpStockDetailInterface", [stockCode, marketId]);
    },
    // 设置顶部栏个性化样式
    setActionBarStyle: function (funKey, barBgColor, titleColor, paramsJson) {
        this.sendInteraction("setActionBarStyle", [funKey, barBgColor, titleColor, paramsJson]);
    },
    // 点击/页面事件统计（埋点）
    onAgentEvent: function (eventId, eventLabel, kvJson) {
        console.log(['onAgentEvent', eventId, eventLabel, kvJson].join(','));
        this.sendInteraction('onAgentEvent', [eventId, eventLabel, kvJson]);
    },
    /**
     * 点击/页面事件统计（埋点）
     * @param eventId     可为简单事件, 或以Event ID为目录名，而Label标签用于区分事件
     * @param eventLabel  事件标签(子事件)
     * @param kvJson      数据统计记录 Map 格式的 JSON 字符串数据
     */
    onAgentEventMpaas: function (eventId, eventLabel, kvJson) {

        //不是mpaas环境不处理
        if (!window.AlipayJSBridge) {
            return;
        }

        // 微信上不需要与原生 APP 接口交互
        if (KmcEnv.platform.isWeixin) {
            return;
        }
        // 判断如果是 PC, 则不处理
        // if (KmcEnv.platform.isBrower) {
        // }
        // 将数组参数改成对象
        let params = {};
        params["EVENT_ID"] = eventId + '_' + window.AlipayJSBridge.startupParams.version;
        params["EVENT_LABEL"] = eventLabel;
        params["kvJson"] = kvJson;
        this.log("event tigger");
        window.AlipayJSBridge && window.AlipayJSBridge.call(
            "onAgentEvent",
            params,
            function (data) {
                console.log('调用结果' + JSON.stringify(data));
            });
    },
    /**
     * 页面打开关闭统计（埋点）
     * @param pageName  页面名称(中文), 例: 国债逆回购首页、港股通委托买卖界面等
     * @param eventType 页面变为可见(PAGE_START), 页面变为不可见(PAGE_END)
     *
     */
    onAgentPageMpaas: function (pageName, eventType) {
        console.log(pageName+"页面曝光")
        //不是mpaas环境不处理
        if (!window.AlipayJSBridge) {
            return;
        }

        // 微信上不需要与原生 APP 接口交互
        if (KmcEnv.platform.isWeixin) {
            return;
        }
        // 判断如果是 PC, 则不处理
        // if (KmcEnv.platform.isBrower) {
        // }
        // 将数组参数改成对象
        let params = {};
        params["pageName"] = pageName + '_' + window.AlipayJSBridge.startupParams.version;
        params["eventType"] = eventType;
        window.AlipayJSBridge && window.AlipayJSBridge.call(
            "onAgentPage",
            params,
            function (data) {
                console.log('调用结果' + JSON.stringify(data));
            });
    },
    //交易退出时回调原生的方法  [ptjy: 普通交易, rzrq: 融资融券]
    logoutTrade: function (tradeType) {
        this.sendInteraction("logoutTrade", [tradeType]);
    },
    //获取设备 ID
    getDeveiceID: function () {
        this.sendInteraction("getDeveiceID");
    },
    //获取本地存储
    getLocalData: function (key) {
        return this.sendInteraction("getLocalData", [key]);
    },
    //设置标题栏背景颜色的 URL 列表
    setActionBarUrls: function (urls) {
        this.sendInteraction("setActionBarUrls", [urls]);
    },
    // 设置历史登录账号
    setHistoricalLoginAccount: function (jsonStr) {
        this.sendInteraction("setHistoricalLoginAccount", [jsonStr]);
    },
    //回调 APP 方法
    callbackTradeFunction: function (functionKey, jsonStr) {
        this.sendInteraction("callbackTradeFunction", [functionKey, jsonStr]);
    },
    //回调 APP 方法
    callbackAppTradeFunction: function (functionKey, jsonStr) {
        this.sendInteractionNew("callbackAppTradeFunction", [functionKey, jsonStr]);
    },
    // 点击盈亏分析调用原生
    jumpToNativeInterface: function (isCloseCurrent, pageKey, paramJson) {
        this.sendInteraction('jumpToNativeInterface', [isCloseCurrent, pageKey, paramJson]);
    },
    /**
     * 打开第三方 WEB 界面
     * @param  {[String]} closeCurrent [关闭当前界面 0: 不关闭 1: 关闭]
     * @param  {[string]} url          [第三方应用的地址]
     */
    openThirdPartyWebInterface: function (closeCurrent, url) {
        this.sendInteraction('openThirdPartyWebInterface', [closeCurrent, url]);
    },
    /**
     * go交易登录
     * @param  {[String]}   url     [登录完成之后跳转的链接地址,url为空时,原生需要登录后跳转到相应的首页]
     * @param  {[String]}   type    [0: 无需登录, 1: 手机号登录, 2: 普通交易登录 3: 融资融券登录]
     * @param  {[String]}   json    [传递的扩展参数，保留字段]
     */
    loginToLocalWeb: function (url, type, json = '{}') {
        if (KmcEnv.platform.isPhone) {
            this.sendInteraction('loginToLocalWeb', [url, type, json]);
        } else {
            url = this.getFirstHref() + 'ptjy/login/ptjy_login.html';
            window.location.replace(url);
        }
    },
    /**
     * 通用基于mpaas架构的函数调用方法
     * @param  {String} apiName 方法名
     * @param  {JSON} params 参数
     */
    call: function (apiName, params) {
        window.AlipayJSBridge && window.AlipayJSBridge.call(
            apiName,
            params,
            function (data) {
                console.log('调用结果' + JSON.stringify(data));
            });
    },
    /**
     * 通用基于mpaas架构的函数调用方法
     * @param  {String} methodName 方法名
     * @param  {Array} parameters 参数数组
     */
    sendInteraction: function (methodName, parameters) {
        // 微信上不需要与原生 APP 接口交互
        if (KmcEnv.platform.isWeixin) {
            return;
        }
        // 判断如果是 PC, 则不处理
        if (KmcEnv.platform.isBrower) {
        }
        // 将数组参数改成json格式
        let paramJson = {};
        if (parameters) {
            for (let i = 0; i < parameters.length; i++) {
                paramJson["key" + i] = parameters[i];
            }
        }
        window.AlipayJSBridge && window.AlipayJSBridge.call(
            methodName,
            paramJson,
            function (data) {
                console.log('调用结果' + JSON.stringify(data));
            });
    },
    /**
     * 通用基于mpaas架构的函数调用方法
     * @param  {String} methodName 方法名
     * @param  {Array} parameters 参数数组
     * @param {function} handler 回调函数
     */
    sendInteractionWithCallback: function (methodName, handler, parameters) {
        // 微信上不需要与原生 APP 接口交互
        if (KmcEnv.platform.isWeixin) {
            return;
        }
        // 判断如果是 PC, 则不处理
        if (KmcEnv.platform.isBrower) {
        }
        // 将数组参数改成json格式
        let paramJson = {};
        if (parameters) {
            for (let i = 0; i < parameters.length; i++) {
                paramJson["key" + i] = parameters[i];
            }
        }
        window.AlipayJSBridge && window.AlipayJSBridge.call(
            methodName,
            paramJson,
            function (data) {
                console.log('调用结果' + JSON.stringify(data));
                handler(data);
            });
    },
    /**
     * 函数功能：获取当前URL地址前半部分
     */
    getFirstHref: function () {
        let searchKey = ["view/", "views/"];
        let _url = window.location.href;
        let _index = _url.indexOf(searchKey[0]);
        if (_index > -1) {
            _url = _url.substring(0, _index + searchKey[0].length);
            return _url;
        }
        _index = _url.indexOf(searchKey[1]);
        if (_index > -1) {
            _url = _url.substring(0, _index + searchKey[1].length);
            return _url;
        }
    },
    /**
     * 函数功能：获取当前URL地址后半部分
     */
    getlasthref: function () {
        let searchKey = ["view/", "views/"];
        let _url = window.location.href;
        let _index = _url.indexOf(searchKey[0]);
        if (_index > -1) {
            _url = _url.substring(_index + 5);
            return _url;
        }
        _index = _url.indexOf(searchKey[1]);
        if (_index > -1) {
            _url = _url.substring(_index + 6);
            return _url;
        }
    },
    /**
     * Javascript语言
     * 通知iPhone UIWebView 加载url对应的资源
     * @param url
     */
    loadURL: function (url) {
        let iFrame;
        iFrame = document.createElement("iframe");
        iFrame.setAttribute("src", url);
        iFrame.setAttribute("style", "display:none;");
        iFrame.setAttribute("height", "0px");
        iFrame.setAttribute("width", "0px");
        iFrame.setAttribute("frameborder", "0");
        document.body.appendChild(iFrame);
        // 发起请求后这个iFrame就没用了，所以把它从dom上移除掉
        iFrame.parentNode.removeChild(iFrame);
        iFrame = null;
    }
};
export default KmcInteraction;
