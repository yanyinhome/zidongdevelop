import Qs from "qs";
/**
     * 服务器端时间格式化
     * @param timeStr 服务器端的时间字符串
     * @param format  规格
     * @return {string}
     */
function dateFormat(timeStr, format = 'YYYY-mm-dd HH:MM') {
    let str = '1970/01/01 00:00:00';
    if (!isEmpty(timeStr)) {
        str = timeStr.toString().replace(/-/g, "/").replace(".000+0000", "").replace("T", " ").replace(".0", "");
    }
    if (!str) {
        return
    }
    let date = new Date(str);
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    let ret;
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(format);
        if (ret) {
            format = format.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return format;
}
// 浮点数取几位小数
// @params num 要转换的数字
// @params len 保留的长度
function FloatLengthFormat(num, len) {
    const templen = Math.pow(10, parseInt(len));
    const tempNum = Math.round(num * templen) / templen;
    return tempNum;
    // let numStr = num.toString();
    // return parseFloat(numStr.substr(0, numStr.indexOf(".") + len + 1))
}
// js 精确乘法
function accMul(arg1, arg2) {
    var m = 0;
    m += this.deal(arg1);
    m += this.deal(arg2);
    var r1 = Number(arg1.toString().replace(".", ""));
    var r2 = Number(arg2.toString().replace(".", ""));
    return (r1 * r2) / Math.pow(10, m)
}
/**
 * 求小数点后的数据长度
 */
function deal(arg) {
    var t = 0;
    try {
        t = arg.toString().split(".")[1].length
    } catch (e) {
    }
    return t;
}
/**
 * 非空判断-无法判断function
 * @param params
 * @returns {boolean}
 */
function isEmpty(params) {
    return params === null || params === undefined || params === "undefined" || params.length === 0;
    // || Object.keys(params).length === 0;
}

/**
 * 判断是不是一个方法
 * @param obj
 * @return {boolean}
 */
function isFunction(obj) {
    return obj !== null && obj !== 'undefined' && typeof obj === 'function';
}

/**
 * 非空拦截
 * @param param 拦截参数
 * @param defaultValue 空值默认值
 */
function notNull(param, defaultValue) {
    return param ? param : (defaultValue ? defaultValue : '');
}
/**
 * 取出jsonarraystring中的指定key值
 * @param obj
 * @param key
 * @param jsonKey
 * @returns {null|*}
 */
function fetchJsonArrayValue(obj, key, jsonKey) {
    try {
        let jsonValue = obj[key];
        if (!this.isEmpty(jsonValue)) {
            let jsonObj = JSON.parse(jsonValue);

            if (this.isEmpty(jsonKey)) {
                return jsonObj[key][0];
            } else {
                return jsonObj[jsonKey][0];
            }
        }
        return null;
    } catch (e) {
        console.error('json转换异常');
        return null;
    }
}

/**
 * 取出标签
 */
function fetchLabels(str) {
    let labels = [];
    if (!this.isEmpty(str)) {
        labels = str.split("/");
    }
    return labels;
}

/**
 * 取出search url中的参数
 * @param location
 * @returns {any}
 */
function fetchSearchParams(location) {
    if (this.isEmpty(location)) {
        console.error("searchStr is undefined")
        return;
    }
    let searchStr = location.search;
    return this.isEmpty(searchStr) ? {} : Qs.parse(searchStr.split('?')[1]);
}
/**
* 检查分页参数
* @param params
* @param size
* @returns {{pageNo: number, pageSize: number}}
*/
function checkPageParams(params, size) {

    let pageNo = 1;
    let pageSize = 5;

    if (this.isEmpty(size)) {
        size = pageSize;
    }

    if (this.isEmpty(params)) {
        params = {
            pageNo: pageNo,
            pageSize: size
        };
    } else {
        if (this.isEmpty(params.pageNo)) {
            params.pageNo = pageNo;
            params.pageSize = size;
        }
    }

    return params;
}
/** 判断对象是否为空
 * 
 * @param obj
 * @returns true/false
 */
function isEmptyObject(obj) {
    if (Object.prototype.toString(obj)!=="[object Object]"||!obj)return true;
    return Object.keys(obj).length === 0;
}
/** 判断对象是否为空
 *
 * @param obj
 * @param pro
 * @returns true/false
 */
function hasPro(obj,pro) {
    let result=false;
    function  searchProperty(obj,pro) {
        if(Object.prototype.hasOwnProperty.call(obj,pro)){
            result=true;
        }else {
            for (let key in obj){
                searchProperty(obj[key],pro)
            }
        }
    }
    searchProperty(obj,pro)
    return result;
}
/*金额千分位加逗号*/
function amountFormat(num) {
    if (isEmpty(num)) return 0;
    let c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    return c;
}
export {
    dateFormat,
    FloatLengthFormat,
    accMul,
    deal,
    isEmpty,
    isFunction,
    notNull,
    fetchJsonArrayValue,
    fetchLabels,
    fetchSearchParams,
    checkPageParams,
    isEmptyObject,
    amountFormat,
    hasPro,
}