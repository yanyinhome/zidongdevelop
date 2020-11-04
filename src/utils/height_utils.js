import KmcEnv from "@utils/kmc/kmc-env.js";

export default {
    common_height: function () {
        let passData = {height: 40};
        if (window.AlipayJSBridge) {
            let type = KmcEnv.platform.type;
            if (type === 'Android') {
                console.error('android,startupParams', window.AlipayJSBridge.startupParams);
                //android高度计算
                try {
                    let passDataStr = window.AlipayJSBridge.startupParams.passData || JSON.parse(window.AlipayJSBridge.startupParams.startupParams).passData;
                    console.error('passDataStr', passDataStr);
                    let temp;
                    try {
                        temp = JSON.parse(passDataStr);
                    } catch (e) {
                        console.error('passDataStr转换异常,直接使用passDataStr');
                    }
                    passData = temp ? temp : passDataStr;
                } catch (e) {
                    console.error('android获取高度失败', e);
                }
            } else if (type === 'iOS') {
                console.error('ios,startupParams', window.AlipayJSBridge.startupParams);
                //ios高度计算
                try {
                    let passDataStr = window.AlipayJSBridge.startupParams.passData || window.AlipayJSBridge.startupParams.startupParams.passData;
                    console.error('passDataStr', passDataStr);
                    let temp;
                    try {
                        temp = JSON.parse(passDataStr);
                    } catch (e) {
                        console.error('passDataStr转换异常,直接使用passDataStr');
                    }
                    passData = temp ? temp : passDataStr;
                } catch (e) {
                    console.error('ios获取高度失败', e);
                }
            }
        }
        console.error('passData', passData);
        return passData;
    },
    // 生成样式map
    createClassMap: function () {
        let passData = this.common_height();
        if (!passData) {
            passData = {height: 40};
        }
        if (KmcEnv.platform.type === 'iOS') {
            return {
                // 导航栏上padding高度，等于电池栏高度
                "navPadTop": `padtop${parseInt(passData.height)}`,
                // ios导航栏高度
                "navHeight": passData.navheight?`navHeight${parseInt(passData.navheight)}`:"",
                "bodypadtop":`padtop${parseInt(passData.height)+parseInt(passData.navheight)+1}`
            }
        } else if (KmcEnv.platform.type === 'Android') {
            return {
                // 导航栏上padding高度，等于电池栏高度
                "navPadTop": `padtop${parseInt(passData.height)}`,
                "bodypadtop":`padtop${parseInt(passData.height)+93}`,
            }
        } else {
            return passData;
        }
    },
    // 获取样式
    getStyle: function (className) {
        return className ? this.createClassMap()[className] : ""
    }

}
