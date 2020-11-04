
import md5 from "js-md5"
import stoage from "./storage";
import CONSTANTS from "./constants";
import Tip from "@components/tip";
import router from "../router/router";
import {isEmptyObject,isEmpty} from "@utils/libs";
export default {
    /**
     * 登陆密码加密
     * @param pwd
     * @returns {*}
     */
    encryptionPwd: function (pwd) {
        return md5(pwd + '_csc', 32)
    },
    md5Pwd: function (pwd) {
        return md5(pwd, 32).toUpperCase()
    },
    toekn2Login: function () {
        router.push('login').then(() => {
            stoage.getStorage().setItem(CONSTANTS.KEYS.loginCount, "open");
        });
    },
    clearLoginCount: function () {
        stoage.getStorage().setItem(CONSTANTS.KEYS.loginCount, "");
    },
    /**
     * 异步获取用户信息
     * @returns {string|*}
     */
    getAsynUser: async function (userId, key) {
        if (window.AlipayJSBridge) {
            return this.getEncUser(userId, key).then((user) => {
                if (isEmptyObject(user) || isEmptyObject(user.users)) {
                    user = null;
                }
                return user;
            })
        } else {
            return stoage.get(key).then(user => {
                return new Promise((resolve) => {
                    if (isEmptyObject(user) || isEmptyObject(user.users)) {
                        user = null;
                    }
                    resolve(user);
                });
            })
        }
    },

    /**
     * 获取机构用户信息
     * @param history
     * @return {*}
     */
    getResearchUser: async function () {
        let userid = await stoage.get(CONSTANTS.APP.CODE.main + CONSTANTS.APP.userid);
        return this.getAsynUser(userid, CONSTANTS.APP.CODE.main).then(user => {
            if (isEmpty(user)) {
                //todo:关闭托管外包
                Tip.warning('获取机构账户信息失败', '', () => {
                    router.exiTApp();
                })
                return;
            }
            return user;
        });
    },

    /**
     * 获取托管外包用户
     * @param history
     * @return {*}
     */
    getUser: async function (history) {
        let userid = await stoage.get(CONSTANTS.APP.CODE.outsource + CONSTANTS.APP.userid);
        return this.getAsynUser(userid, CONSTANTS.APP.CODE.outsource).then(user => {
            if (isEmpty(user) && !isEmpty(history)) {
                // 没有用户信息,去登陆界面
                router.push('login');
                return;
            }
            return user;
        });
    },

    /**
     * 获取加密用户信息
     * @param userId 用户id
     * @param key
     */
    getEncUser: function (userId, key) {
        if (window.AlipayJSBridge) {
            return new Promise(function (resolve, reject) {
                window.AlipayJSBridge && window.AlipayJSBridge.call('getUserDataEnc', {
                        userType: CONSTANTS.APP.usertype,
                        userId: userId,
                        key: key
                    },
                    function (result) {
                        let user = null;
                        if (!isEmptyObject(result) && !isEmptyObject(result.data)) {
                            user = stoage.objectification(null, result.data);
                        }
                        resolve(user);
                    });
            });
        }
    },

    /**
     * 删除加密用户信息
     * @param userId 用户id
     * @param key
     * @param callBack
     */
    removeUser: async function (userId, key, callBack) {
        if (window.AlipayJSBridge) {
            window.AlipayJSBridge.call('removeUserDataEnc', {
                    userId: userId,
                    key: key,
                    userType: CONSTANTS.APP.usertype,
                },
                function (result) {
                    if (callBack) {
                        callBack(result);
                    }
                });
        }
        stoage.set(key, '', true);
    },

    /**
     * 存储加密用户信息
     * @param userId 用户id
     * @param key
     * @param params 用户信息
     * @param both
     */
    setUser: async function (userId, key, params, both = false) {
        let hasWindowJSBridge = false;
        if (window.AlipayJSBridge) {
            hasWindowJSBridge = true;
            window.AlipayJSBridge && window.AlipayJSBridge.call(
                'setUserDataEnc', {
                    userType: CONSTANTS.APP.usertype,
                    userId: userId,
                    key: key,
                    value: params
                }, function (result) {
                    console.log('setUser result:', result);
                });
        }

        if (!hasWindowJSBridge || both) {
            stoage.set(key, params);
        }
    },

    /**
     * 获取用户机构id
     * @param user
     * @return {*}
     */
    getCPID: function (user) {
        return user.users.thirdId ? user.users.thirdId : null;
    },

    /**
     *
     * @param menus     菜单列表
     * @param menuName  菜单名称
     * @param history
     * @return {boolean}
     */
    permiMenuname: function (menus, menuName, history) {
        for (let i = 0; i < menus.length; i++) {
            if (menus[i].menuName === menuName) {
                return true;
            }
        }
        if (history) {
            Tip.info(CONSTANTS.FILTER.noRoleTips);
            return;
        }
        return false;
    },

    /**
     * 界面更新逻辑封装与日志打印
     * @param Clazz            界面类名
     * @param nextProps        nextProps
     * @param nextState        nextState
     * @param currentState     this.state
     * @returns {boolean}
     */
    shouldComponentUpdate: function (Clazz, nextProps, nextState, currentState) {
        let enableUpdate = (currentState !== nextState);
        if (CONSTANTS.LOG.componentUpdate.state) {

        }
        if (CONSTANTS.LOG.componentUpdate.result) {

        }
        return enableUpdate;
    },

    /**
     * 预留本地缓存用户浏览历史记录接口
     * 当用户进入活动详情，专题详情，速评详情，分析师详情，研报详情，特色产品详情页面上调用。
     * 分类前端暂定分类key：
     * 10---活动详情
     * 20---专题详情
     * 30---速评详情
     * 40---分析师详情
     * 50---研报详情
     * 60---特色产品详情
     * 参数说明：anonymous---用户，categoryCode---分类，targetId---详情id
     * {time}~{userId}~{categoryCode}~{targetId},{time}~{userId}~{categoryCode}~{targetId},...
     *
     * browser_histories_[anonymous] = "2020-04-29 16:27:29~[anonymous]~研报~21,2020-04-29 16:31:16~[anonymous]~研报~21,2020-04-29 16:49:31~[anonymous]~专题~542233"
     */
    set: function (categoryCode, targetInfo) {
        let currentIndex = stoage.get("currentIndex", true);
        let index = currentIndex ? parseInt(currentIndex) + 1 : 0;
        let earliests = stoage.get("BrowserHistoryEarliest", true);
        earliests = earliests ? earliests : [];
        const today = new Date();
        const time = this.getCurrentTime(today);
        targetInfo.index = index;
        const record = {id: index, time: time, categoryCode: categoryCode, extra: targetInfo};
        stoage.set("BrowserHistoryRecord_" + index + "_" + categoryCode, record, true);
        const o = {
            id: index,
            category: categoryCode,
            expiredTime: this.getTimeByDay(today, CONSTANTS.HISTORY.HISTORY_EXPIRED_TIME)
        };
        earliests.push(o);
        stoage.set("BrowserHistoryEarliest", earliests, true);
        stoage.set("currentIndex", index, true);
    },

    /*根据过期时间删除过期的浏览记录*/
    removeByIds: function () {
        const currentTime = new Date().getTime();
        const expiredRecords = [];
        const earliests = stoage.get("BrowserHistoryEarliest", true);
        if (earliests) {
            earliests.map(o => {
                if (currentTime >= o.expiredTime) {
                    console.log("expired:", o);
                    expiredRecords.push(o)
                }
            });

            expiredRecords.map(o => {
                let index = earliests.findIndex(t => t.id === o.id)
                if (index !== -1) {
                    earliests.splice(index, 1);
                    stoage.remove("BrowserHistoryRecord_" + o.id + "_" + o.category)
                }
            });
            stoage.set("BrowserHistoryEarliest", earliests, true);
        }
    },

    getMyBsData: function (pageSize, category, id) {
        const arr = [];
        const records = [];
        const earliests = stoage.get("BrowserHistoryEarliest", true);
        if (!earliests) {
            return records;
        }
        earliests.sort().reverse();
        if (id === null || id === undefined || id === 'undefined') {
            earliests.map(item => {
                if (arr.length >= pageSize) {
                    return
                }
                if (item.category === category) {
                    arr.push(item)
                }
            });
            arr.map(item => {
                const record = stoage.get("BrowserHistoryRecord_" + item.id + "_" + item.category, true);
                if (record) {
                    records.push(record.extra)
                }
            });
        } else {
            earliests.map(o => {
                if (arr.length >= pageSize) {
                    return
                }
                if (o.id < id && o.category === category) {
                    arr.push(o)
                }
            });
            arr.map(item => {
                const record = stoage.get("BrowserHistoryRecord_" + item.id + "_" + item.category, true);
                if (record) {
                    records.push(record.extra)
                }
            });
        }
        return records;
    },
    /*
       num 获取当天多少天后的日期
       */
    getTimeByDay: function (today, num) {
        const nextTime = new Date(today.getTime() + 60 * 60 * 1000 * 24 * num).getTime();
        //const nextTime = new Date(today.getTime() + 2 * 60 * 1000).getTime();
        return nextTime

    },
    formatTime: function (time) {
        if (time) {
            return new Date(time).toISOString().split('T')[0];
        }
        return ''
    },

    getCurrentTime: function (date) {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s;
    },

    test: function () {
        if (!window.localStorage) {
            console.log('当前浏览器不支持localStorage!')
        }
        let test = '0123456789';
        let add = function (num) {
            num += num;
            if (num.length === 10240) {
                test = num;
                return;
            }
            add(num);
        }
        add(test);
        let sum = test;
        let show = setInterval(function () {
            sum += test;
            try {
                window.localStorage.removeItem('test');
                window.localStorage.setItem('test', sum);
            } catch (e) {
                alert(sum.length / 1024 + 'KB超出最大限制');
                clearInterval(show);
            }
        }, 0.1)
    },

    /* 判断是否是图片 */
    judgeIsHeadPhoto(portrait) {
        const reg = RegExp(/.png/);
        if (portrait.match(reg)) {
            return true
        }
        return false
    },
    /*
 * formatMoney(s,type)
 * 功能：金额按千位逗号分割
 * 参数：s，需要格式化的金额数值.
 * 参数：type,判断格式化后的金额是否需要小数位.
 * 返回：返回格式化后的数值字符串.
 */
    formatMoney: function (s, type) {
        s = Math.abs(s);
        if (/[^0-9\.]/.test(s))
            return "0";
        if (s == null || s == "")
            return "0";
        s = s.toString().replace(/^(\d*)$/, "$1.");
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        s = s.replace(".", ",");
        var re = /(\d)(\d{3},)/;
        while (re.test(s))
            s = s.replace(re, "$1,$2");
        s = s.replace(/,(\d\d)$/, ".$1");
        s = s.replace(/,(\d\d)$/, "");
        if (type == 0) {// 不带小数位(默认是有小数位)
            var a = s.split(".");
            if (a[1] == "00") {
                s = a[0];
            }
        }
        return s;
    },
    /*  通过天数计算开始时间 */
    calculateTime: function (days) {
        if (days !== null && days !== undefined) {
            var format = "YYYY-mm-dd";
            let endTime = new Date();
            var startTime = endTime - days * 1000 * 60 * 60 * 24;
            var date = new Date(startTime);
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
        } else {
            return "1970-01-01";
        }
    },
    /* 获取本周起始时间 */
    CurrentWeekStartEndTime: function (callback) {
        // 按周日为一周的最后一天计算
        var date = new Date();
        var today = date.getDay()
        var stepSunDay = -today + 1;
        // 如果今天是周日
        if (today === 0) {
            stepSunDay = -7;
        }
        // 周一距离今天的天数（负数表示）
        var stepMonday = 7 - today;
        var time = date.getTime();
        var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
        var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);
        return callback(monday, sunday) && callback;
    },
    /*判断是否有服务权限*/
    isService(code) {
        //获取用户信息
        this.getResearchUser().then(user => {
            if (isEmpty(user)) {
                return false
            }
            let menusData = user.menus;
            if (code) {
                for (let i = 0; i < menusData.length; i++) {
                    if (menusData[i].menuCode === code) {
                        return true;
                    }
                }
            }
            return false;
        });
    },

    // 邮箱解析
    analysisEmaile(str) {
        if (isEmpty(str) || typeof str !== "string") return [];
        const resultEmaile = str.split(",");
        return resultEmaile;
    },
    /**
     * 取出search url中的参数
     * @returns {any}
     */
    fetchSearchs: function () {
        return this.fetchSearchParams(window.location);
    },

    logout: async function (callback) {
        let userid = await stoage.get(CONSTANTS.APP.CODE.outsource + CONSTANTS.APP.userid);
        await this.removeUser(userid, CONSTANTS.APP.CODE.outsource);
        await stoage.set(CONSTANTS.APP.CODE.outsource + CONSTANTS.APP.userid, '');
        let otherUsers = await stoage.get(CONSTANTS.APP.otherUsers);
        if (otherUsers) {
            let index = otherUsers.indexOf(CONSTANTS.APP.CODE.outsource);
            if (index !== -1) {
                otherUsers.splice(index, 1)
                await stoage.set(CONSTANTS.APP.otherUsers, otherUsers);
            }
        }
        if (callback) {
            callback();
        }
    },

    /*返回时间戳：2020/08/23*/
    returnTime(date) {
        if (!isEmpty(date)) return new Date(date).getTime()
    },
}


