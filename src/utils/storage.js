import user_utils from "./user_utils";
import {isEmpty} from "./libs";
import kmcLocalStorage from "./kmc/kmc-localStorage";
import KmcEnv from "./kmc/kmc-env";
import constants from "./constants";

const storage = window.localStorage;

export default {
    /**
     * 增
     * @param key
     * @param value
     * @param both  是否存两份
     */
    set: async function (key, value, both = false) {
        if (isEmpty(key)) {
            return;
        }

        value = typeof (value) == "string" ? value : JSON.stringify(value);
        //加密逻辑
        // if (this.isEncryptedField(key)) {
        // console.log(['加密前：key=', key, '，value=', value].join(''));
        // value = kmcLocalStorage.encryptData(value);
        // console.log(['加密前：key=', key, '，value=', value].join(''));
        // }
        // if (key === constants.KEYS.user) {
        //     storage.setItem(key, value);
        //     return;
        // }
        let hasAlipayJSBridge = false;
        if (window.AlipayJSBridge) {
            kmcLocalStorage.setLocalData(key, value, (KmcEnv.platform.isPhone ? 1 : 0));
            hasAlipayJSBridge = true;
        }

        if (!hasAlipayJSBridge || both) {
            storage.setItem(key, value);
        }
    },

    /**
     * 删
     * @param key
     */
    remove: function (key) {
        if (isEmpty(key)) {
            console.error('key is undefined');
            return;
        }
        if (window.AlipayJSBridge) {
            kmcLocalStorage.setLocalData(key, '', (KmcEnv.platform.isPhone ? 1 : 0))
        }
        storage.removeItem(key);
    },

    /**
     * 清除全部缓存
     */
    clearAll: function () {
        storage.clear();
    },

    /**
     * 查
     * @param key
     * @param local
     * @returns {string|any}
     */
    get: function (key, local = false) {
        if (local) {
            return this.fromLocalStorage(key);
        }
        if (window.AlipayJSBridge) {
            return kmcLocalStorage.getApDataPromise(key);
        } else {
            return new Promise((resolve) => {
                resolve(this.fromLocalStorage(key));
            });
        }
    },

    getStorage: function () {
        return storage;
    },

    /**
     * LocalStorage同步取数据
     * @param key
     * @return {any}
     */
    fromLocalStorage: function (key) {
        let dataStr = storage.getItem(key);
        return this.objectification(key, dataStr);
    },

    /**
     * 尝试对象化缓存数据,失败就返回string
     * @param key
     * @param dataStr 缓存string
     * @return {any}
     */
    objectification: function (key, dataStr) {
        try {
            let data = JSON.parse(dataStr);
            if (typeof data == 'object' && data) {
                return data;
            } else {
                return dataStr;
            }
        } catch (e) {
            console.error('缓存数据 JSON.parse() 转换异常')
            return dataStr;
        }
    },

    /**
     * 是否是加密字段
     * @param  {[type]}  key [description]
     * @return {Boolean}     [description]
     */
    isEncryptedField: function (key) {
        return constants.ENCRYPTED_FIELD.indexOf(key) > -1;
    },
}
