import Qs from "qs";
import user_utils from "@utils/user_utils";
import {isEmpty} from "@utils/libs";
import Tip from "../components/tip";
import constants from "../utils/constants";
import pathMap from "./pathMap";
import KmcEnv from "../utils/kmc/kmc-env";
import common_api from "@services/api/common_api";
import storage from "@utils/storage.js";
import height_utils from "@utils/height_utils.js";

let passData;

export default {

    getPassData() {
        if (!passData) {
            passData = height_utils.common_height();
        }
        return passData;
    },

    /**
     *  页面跳转
     * @param url           页面地址
     * @param option        可选参数
     */
    push: async function (url, option) {
        option = await this.intercept(url, option);
        //通过权限拦截,选择跳转方式
        this.realPush(url, option);
    },

    /**
     * 打开指定id服务
     * @param id         服务id
     * @param url        url地址
     * @param option     url参数
     * @param indexAlias 首页别名,url与indexAlias会打开index.html
     * @param mult
     */
    go2ByID: async function (url, option, id, indexAlias, mult = true, interceptiId) {
        option = await this.intercept(url, option, id, indexAlias, interceptiId);
        this.gotoApp(id, url, option, indexAlias, mult);
    },

    /**
     * 打开研究服务
     * (研究服务是个特殊的app,它的首页名字不是index,需要别名,且大部分业务与机构服务高度耦合,需特殊处理)
     * @param url       页面地址
     * @param option    url参数
     */
    go2Research: async function (url, option) {
        await this.go2ByID(url, option, constants.APP.ID.research, constants.APP.Alias.research);
    },

    /**
     * 打开固收债券
     * @param url       页面地址
     * @param option    url参数
     */
    go2Fi: async function (url, option) {
        await this.go2ByID(url, option, constants.APP.ID.fixedincome);
    },
    /**
     * 打开托管外包
     * @param url       页面地址
     * @param option    url参数
     */
    go2Pb: async function (url, option) {
        await this.go2ByID(url, option, constants.APP.ID.outsource);
    },


    /**
     * 打开衍生品界面
     * @param url
     * @param option
     * @return {Promise<void>}
     */
    go2Derivative: async function (url, option) {
        await this.go2ByID(url, option, constants.APP.ID.derivative, null, false);
    },

    /**
     * 登陆与权限拦截
     * @param url           页面地址
     * @param option        可选参数
     * @param appid         跳转目标appid
     * @param indexAlias    首页别名,url与indexAlias会打开index.html
     * @param interceptiId  登陆与权限拦截用户所属APPID(这个参数解决跳转目标如果为88881111但是需要使用88880002权限的问题)
     * @return {Promise<void>}
     */
    intercept: async function (url, option, appid, indexAlias, interceptiId) {

        if (isEmpty(interceptiId)) {
            interceptiId = appid;
        }

        console.info("intercept url", url);
        console.info('intercept menus by appid ', interceptiId ? interceptiId : constants.APP.ID.main);
        if (isEmpty(url)) {
            console.error("url is undefined")
        }

        if (option === null || option === undefined) {
            option = {};
        }

        option.realUrl = url;
        option.indexAlias = indexAlias;

        if (!constants.ADMIN) {
            //登录拦截
            if (option.authFilter === undefined || option.authFilter === null) {
                if (appid) {
                    option.authFilter = async () => {
                        await this.commonAuthFilter(url, option, interceptiId);
                    }
                } else {
                    option.authFilter = async () => {
                        await this.defaultAuthFilter(url, option);
                    }
                }
            }

            //执行权限拦截逻辑
            if (option.roleFilter === undefined || option.roleFilter === null) {
                if (appid) {
                    option.roleFilter = async () => {
                        await this.commonRoleFilter(url, option, interceptiId);
                    };
                } else {
                    option.roleFilter = async () => {
                        await this.defaultRoleFilter(url, option);
                    };
                }
            }

            //执行拦截登陆逻辑
            await option.authFilter();
            //执行权限拦截逻辑
            await option.roleFilter();
        }
        return option;
    },

    /**
     * 实际跳转
     * @param option
     * @param url
     */
    realPush: function (url, option) {
        url = `./${url}.html`;
        let param = {};

        if (KmcEnv.getBrowserType() === 'iOS') {
            param.passData = this.getPassData();
        } else {
            param.param = this.getPassData();
        }

        if (option.type !== null && option.type === constants.ROUTER.state) {
            if (KmcEnv.getBrowserType() === 'iOS') {
                param.passData = Object.assign(param.passData, option.data ? option.data : {});
                param.param = option.param;
            } else {
                param.param = Object.assign(param.param, option.data ? option.data : {});
            }
        } else {
            if (!isEmpty(option.data)) {
                url = url + "?" + Qs.stringify(option.data);
            }
        }
        param.url = url;

        console.error("push url:", url);
        //判断是否是浏览器，走不同的跳转
        if (window.AlipayJSBridge) {
            window.AlipayJSBridge.call('pushWindow',
                param,
                (result) => {
                    Tip.info(result ? result.code : "打开失败");
                }
            );
        } else {
            // window.location.href= newulr
            window.open(url, "_blank");
        }
    },


    commonAuthFilter: async function (url, option, appid) {
        //这里使用别名,是因为所有pdf都请求同一个地址,但拥有不同的权限,所以应该有一个别名来区分权限
        if (!isEmpty(option.urlAlias)) {
            //存在别名
            url = option.urlAlias;
        }

        let page = pathMap.pagesMap[url];
        if (isEmpty(page)) {
            //异常，地址在路由中不存在
            Tip.info('页面404');
            return;
        }

        if (!isEmpty(pathMap.pagesMap[url].auth)) {
            //进行登录拦截
            let user = await user_utils.getUser();
            if (isEmpty(user)) {
                //去登录界面
                await this.push('login')
                return;
            }
            if (appid) {
                let appUser = await this.switchUserByAppid(appid);
                console.error('appUser', appUser);
                let systemCode = constants.APP.CODE[this.findKeyByAppid(appid)];
                if (!appUser) {
                    console.error(appid + ' 用户不存在,请调用接口获取')
                    common_api.profession(
                        async (resp) => {
                            let userid = resp.data.users.userId;
                            resp.data.mainToken = user.users.token;
                            resp.data.sysCode = resp.data.users.systemCode;
                            await user_utils.login(userid, systemCode, resp.data);
                            await this.go2ByID(option.realUrl, option, appid, option.indexAlias);
                        },
                        () => {
                            Tip.info('更新用户信息失败');
                        },
                        {
                            phone: user.users.phone,
                            systemCode: systemCode
                        },
                        user.users.token
                    );
                }
            }
        }
    },

    /**
     * 登录过滤器
     */
    defaultAuthFilter: async function (url, option) {
        await this.commonAuthFilter(url, option);
    },

    /**
     * 权限拦截器(新版)
     * @param url       请求地址
     * @param option    参数
     * @param appid     appid
     */
    commonRoleFilter: async function (url, option, appid) {
        if (!isEmpty(option.urlAlias)) {
            //存在别名
            url = option.urlAlias;
            option.urlAlias = null;
            await this.commonRoleFilter(url, option, appid);
            return;
        }
        console.info('intercept role url:' + url);
        let page = pathMap.pagesMap[url];
        if (isEmpty(page)) {
            //异常，地址在路由中不存在
            Tip.info(constants.FILTER.noPage);
            return;
        }

        let needRole = !isEmpty(page.role);

        let hasRole = false;
        if (needRole) {
            //需要权限拦截
            let user = await this.switchUserByAppid(appid);
            console.error('使用user.id为' + user.users.id);
            if (!isEmpty(user)) {
                if (isEmpty(user.menus)) {
                    user.menus = [];
                }
                //权限拦截
                url = `/${url}`;
                for (let i = 0; i < user.menus.length; i++) {
                    if (url === user.menus[i].menuUrl) {
                        //有权限
                        hasRole = true;
                        break;
                    }
                }
            }
        } else {
            hasRole = true;
        }

        if (!hasRole) {
            Tip.info(constants.FILTER.noRoleTips);
        }
    },

    /**
     * 机构权限拦截器(新版)
     * @param url
     * @param option
     */
    defaultRoleFilter: async function (url, option) {
        await this.commonRoleFilter(url, option, constants.APP.ID.main);
    },

    /**
     * 根据appid选择用户信息
     * @param id   appid
     * @return {Promise<void>}
     */
    switchUserByAppid: async function (id) {
        let appkey = this.findKeyByAppid(id);
        let userid = await storage.get(constants.APP.CODE[appkey] + constants.APP.userid);
        return await user_utils.getAsynUser(userid, constants.APP.CODE[appkey]);
    },

    /**
     * 通过appid查询key
     * @return {string}
     */
    findKeyByAppid(id) {
        let appids = constants.APP.ID;
        let appkey = 'main';
        for (let key in appids) {
            if (id === appids[key]) {
                appkey = key;
                break;
            }
        }
        return appkey;
    },

    // 关闭当前页面
    goback: function () {
        // alert('goback');
        //判断是否是浏览器，走不同的跳转
        if (window.AlipayJSBridge) {
            window.AlipayJSBridge.call('popWindow');
        } else {
            window.close()
        }
    },

    /*退出当前应用*/
    exiTApp: function () {
        if (window.AlipayJSBridge) {
            window.AlipayJSBridge.call('exitApp');
        }
    },

    close: function () {
        //判断是否是浏览器，走不同的跳转
        if (window.AlipayJSBridge) {
            window.AlipayJSBridge.call('popTo', {index: -1})
        }
    },

    /**
     * 打开app
     * @param id         appid
     * @param url        app里的页面url(可以url传参)
     * @param option     url参数放置在option.data中
     * @param indexAlias   要打开的app首页index.html的别名,这个值是为了统一在本app中进行登陆权限拦截
     * @param mult       是否打开多实例
     */
    gotoApp: function (id, url, option, indexAlias, mult = true) {
        if (id === null || id === undefined) {
            return;
        }

        if (option === null || option === undefined) {
            option = {};
        }
        let param = {
            url: 'index',
            st: 'NO',
            pd: 'NO',
            bb: 'auto',
            closeCurrentWindow: false,
            startupParams: {passData: this.getPassData()}
        };

        if (mult === true) {
            param.appClearTop = false;
            param.startMultApp = 'YES';
        }

        if (isEmpty(url) || url === indexAlias) {
            url = param.url;
        }
        url = `/${url}.html`;
        if (!isEmpty(option.data)) {
            url = url + "?" + Qs.stringify(option.data);
        }
        param.url = url;
        console.error("gotoApp:" + id + " url", url);
        console.error('params', param);
        if (window.AlipayJSBridge) {
            window.AlipayJSBridge.call('startApp', {
                appId: id,
                param: param
            }, function (result) {
                Tip.info(result ? result.code : "打开失败");
            });
        }
    },

    /**
     * 跳转特色产品详情
     * @param url
     * @return {Promise<void>}
     */
    async go2featproductsDetail(url, dfTitle) {
        await this.AliPushWindow('featproducts-detail', url, constants.APP.ID.research, dfTitle);
    },

    /*通过url跳转到进门财经活动、专题详情AlipayJSBridge pushWindow*/
    async AliPushWindow(roleurl, url, appid, dfTitle) {
        await this.intercept(roleurl, null, appid);
        if (isEmpty(url)) return;
        if (window.AlipayJSBridge) {
            let params = {url: url + '&ua=cscics'};
            if (KmcEnv.getBrowserType() === 'iOS') {
                params.param = {
                    readTitle: "NO",
                    defaultTitle: dfTitle ? dfTitle : '详情',
                    showTitleBar: "YES",
                    canPullDown: 'YES',
                }
            } else {
                params.param = {
                    readTitle: false,
                    defaultTitle: dfTitle ? dfTitle : '详情',
                    st: "YES",
                    canPullDown: 'YES'
                }
            }
            window.AlipayJSBridge.call('pushWindow',
                params,
                (result) => {
                    Tip.info(result ? result.code : "打开失败");
                }
            );
        }
    },
    /**
     * 跳转活动详情
     */
    async go2hotDetails(item, dtTitle) {
        item.isActivity = true;
        console.error(item);
        // router.push(this.props.parentProps.history, '/hotdetail', {data: item, isActivity:true});
        if (window.AlipayJSBridge) {
            const targetInfo = {
                id: item.id,
                logoweb: item.logoweb ? item.logoweb : item.logo,
                membercount: item.membercount,
                playcount: item.playcount,
                presenturl: item.presenturl,
                status: item.status,
                stime: item.stime,
                title: item.title,
                uname: item.uname
            };
            await this.AliPushWindow('hotdetail', item.presenturl, constants.APP.ID.research, dtTitle);
            user_utils.set(constants.HISTORY.HISTORY_HOT_ACTIVITY, targetInfo)
        } else {
            item.outside = true;
            // router.push('hotdetail', {data: item});
            await this.go2Research('hotdetail', {data: item});
        }
    }

}
