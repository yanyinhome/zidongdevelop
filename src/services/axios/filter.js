import {isEmpty} from "@utils/libs";
import {CONSTANT} from "./config"
import resError from "./resError";


    /**
     * http请求响应过滤器=>不拦截直接返回整个响应体
     * @param response http响应体
     * @param success  成功回调
     */
    const noFilter=(response, success)=> {
        //不进行过滤,直接返回整个response
        success(response);
        return;
    }

    /**
     * http请求默认响应过滤器=>无data响应过滤器
     * @param response http响应体
     * @param success  成功回调
     * @return {*}
     */
    const defaultFilter=(response, success) =>{
        if (!isEmpty(response.code)) {
            if (response.code >=200 && response.code < 300) {
                if (response.hasOwnProperty("data")) {
                    //成功的请求 
                    success(response);
                } else {
                    //没有data
                   throw new resError(CONSTANT.CODE.nodata,CONSTANT.TIPS.nodata)
                }
            } else {
               throw new resError(response.code,response.message)
            }
        } else {
           throw new resError(CONSTANT.CODE.codeError,CONSTANT.TIPS.errorCode)
        }
    }

    /**
     * http请求响应过滤器=>不判断data是否为空
     * @param response
     * @param success
     * @return {*}
     */
    const responseFilter=(response, success) =>{
        if (!isEmpty(response.code)) {
            if (CONSTANT.CODE.succesies.includes(parseInt(response.code))) {
                //成功的请求
                success(response);
                return;
            } else {
                console.error(CONSTANT.TIPS.errorCode, response);
                if (response.message === '程序异常') {
                    response.message = '服务器异常';
                }
                return response.message;
            }
        } else {
            console.error(CONSTANT.TIPS.errorCode, response);
            return response.errmsg;
        }
    }

    export {noFilter,defaultFilter,responseFilter}


