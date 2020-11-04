import axios from 'axios';
import config,{CONSTANT} from "./config"
import Tip from "@components/tip";
import user_utils from "@utils/user_utils"
import {isEmpty} from "@utils/libs"
import resError from "./resError";
axios.defaults.timeout = config.timeout;
axios.defaults.headers.post['Content-Type'] = 'application/json'; 

// 创建axios实例
const sercice = axios.create();

// 请求前拦截
sercice.interceptors.request.use(
   async config => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        await user_utils.getUser().then(
            user => {
               if(!isEmpty(user)) {
                user.users.token && (config.headers.token=user.users.token)
               }
            }
        );
        return config;
    },
    error => Promise.error(error)
)

// 响应前拦截
sercice.interceptors.response.use(response => {
    Tip.close();
    if (response.status===202&&response.data.errcode) { // 签名异常
        const err = new resError(CONSTANT.CODE.signError, response.data.errmsg || CONSTANT.TIPS.signError);
        return Promise.reject(err);
    }
    return response.data;
}, err => {
    Tip.close();
    console.error(err, err.response, 'request fail');
    if (err.message.includes('timeout') || err.message.includes('ERR_CONNECTION_TIMED_OUT')) {   // 判断请求异常信息中是否含有超时timeout字符串
        err.code = CONSTANT.CODE.timeout;
        err.message = CONSTANT.TIPS.timeout;
    } else if (err.message.includes('Network Error')) {
        if (!navigator.onLine) {
            err.code = CONSTANT.CODE.networkError;
            err.message = CONSTANT.TIPS.networkError;
        } else {
            err.code = CONSTANT.CODE.arriveError;
            err.message = CONSTANT.TIPS.responseError;
        }
    } else if (err.message.includes('525') || err.message.includes('535') || err.message.includes('555')) { //token异常问题
        err.code = CONSTANT.CODE.tokenInvalid;
        err.message = err.response.message;
    }
    return Promise.reject(err);
});

export default sercice;