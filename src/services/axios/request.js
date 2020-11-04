import service from "./axiosDefault"
import user_utils from "@utils/user_utils";
import { isEmpty, isFunction } from "@utils/libs";
import storage from "@utils/storage";
import Tip from "@components/tip";
import resError from "./resError";
import config, { CONSTANT } from "./config";
import { defaultFilter } from './filter'
import SignFactory from './sign'
/**
 * 通用请求
 * @param method     请求方法
 * @param proxyName  代理名称
 * @param url        请求地址
 * @param params     请求参数
 * @param success    成功执行函数
 * @param fail       失败执行函数
 * @param option     请求选项(postbody等需要添加请求头,有特殊定制的时候添加)
 * @param filter     是否进行统一过滤(默认为ture,会对response进行response.code判断,然后返回response)
 * @param control    控制选项 {push:true}
 */
export async function request(method, url, data, success, fail, option, filter, control) {

    if (success === null || typeof success !== "function") {
        console.error('请传入成功回调函数success()');
        return;
    }
    let appInfo = {};
    let baseUrl = "";
    // 从壳子获取appid和secret
    // getISTPKey 参数 type	string  值 "inst"：机构；"push"：推送
    if (window.AlipayJSBridge) {
        const res = await new Promise(function (resolve, reject) {
            window.AlipayJSBridge.call("getISTPKey", { type: control && control.push ? "push" : "inst" }, function (result) {
                resolve(result)
            })
        })
        if (res.error == "0") {
            appInfo = res.data
            baseUrl = appInfo.apiurl;
        } else {
            console.error(res)
        }
        // 如果需要使用代理进行调试打开
        // baseUrl = control && control.push?config.NoticeBaseUrl:config.baseUrl;
    } else {
        if (control && control.push) {
            appInfo = {
                apikey: 'test_client',
                apisecret: 'Jwch7QKEmdbIvGkxViPB'
            }
            baseUrl=config.NoticeBaseUrl
        } else {
            appInfo = {
                apikey: 'icsapp',
                apisecret: 'NPbv0msgxDBUMlax'
            }
            baseUrl=config.baseUrl
        }
    }
    /* 数据签名 */
    let sign = SignFactory(url, data, method, appInfo, option && option.params ? option.params : null, control);
    let requestConfig = {
        url: baseUrl + url,
        data,
        method,
        params: sign,
        ...option
    }
    control = { enableTips: config.enableTips, token2Login: config.token2Login, ...control };
    service(requestConfig).then(response => {
        if (!isEmpty(response)) {
            if (isFunction(filter)) {
                filter(response, success);
            } else {
                defaultFilter(response, success);
            }
        } else {
            throw new resError(200, "response为空")
        }
    }).catch(err => {
        console.error(err.message, "errmessage")
        console.error(err.response, "res")
        console.error(err, "reserr")
        //错误捕获
        if (err && err.code) {
            switch (err.code) {
                case CONSTANT.CODE.tokenInvalid:
                    user_utils.logout(() => {
                        if (control.token2Login && storage.getStorage().getItem(CONSTANT.KEYS.loginCount) !== "open") {
                            user_utils.toekn2Login();
                        }
                    })
                    break;
                default:
                    if (!err.message) {
                        err.message = CONSTANT.TIPS.serverError
                    }
                    break;
            }
        } else {
            err.message = CONSTANT.TIPS.clientError;
        }
        //执行错误提示
        if (CONSTANT.ENABLE.tips && control.enableTips) {
            Tip.info(err.message);
        }

        //执行失败回调
        if (fail !== null && typeof fail === "function") {
            fail(err);
        }
        //错误打印
        console.error(err.message + '\n' + err.code + '\n' + err.response);
    })
}