export default {
    ADMIN: false,
    VERSION: '@version',
    DATEVERSION: '2020-10-13 1830',
    resea: '/institution/resea',
    coupon: "/institution/coupon",
    insti: '/institution/insti',
    es: '/institution/es',
    operation: '/institution/operation',
    otctrading: '/institution/derivative',
    derivative: '/institution/derivative',
    home_selected_tab: 'home',
    APP: {
        otherUsers: 'otherUsers',
        accountList: 'accountList',
        otherAccount: 'otherAccount',
        userid: '-userid',
        usertype: 'I',
        Alias: {
            research: 'allResearchService'
        },
        ID: {
            prefix: '8888',
            main: '88880000',
            outsource: '88880001',
            research: '88880002',
            derivative: '88880003',
            fixedincome: '88880004',
            // 公共资源，存放md查看，pdf查看及预览
            common: '88881111',
        },
        CODE: {
            main: "9001",
            outsource: "0005",
            research: "0003",
            derivative: "0007",
            fixedincome: "0008",
        }
    },
    KEYS: {
        token: "derivativeToken",
        //research代表机构,历史遗留问题,不建议改动,
        //托管,衍生品用到getResearchUser方法获取机构用户信息.
        user: 'researchAuth',
        userId: 'researchUserId',
        //研究服务
        rsUser: 'rsAuth',
        rsUserId: 'rsAuthId',
        //托管外包
        outsourceUser: 'outsourceAuth',
        outsourceUserId: 'outsourceUserId',
        //衍生品
        derivativeUser: 'derivativeAuth',
        derivativeUserId: 'derivativeUserId',
        //固收
        fixedincomeUser: 'fixedincomeAuth',
        fixedincomeUserId: 'fixedincomeUserId',
        systemCode: '9001',
        derivativeLoginCount: 'derivativeLoginCount',
        loginCount: 'loginCount'
    },
    ENCRYPTED_FIELD: ['researchAuth', 'researchUserId'],
    LOG: {
        componentUpdate: {
            state: true,
            result: true
        }
    },
    POINT: {
        EVENT: {
            class: "event-click",
            id: 'event-id',
            label: 'event-label',
            kv: 'event-kv'
        },
        PAGE: {
            start: 'PAGE_START',
            end: 'PAGE_END',
        }
    },
    HISTORY: {
        "HISTORY_HOT_ACTIVITY": 1011,
        "HISTORY_SUBJECT": 1012,
        "HISTORY_QUICK": 1013,
        "HISTORY_ANALYSER": 1014,
        "HISTORY_REPORT": 1015,
        "HISTORY_PRODUCT_GOLD": 10,
        "HISTORY_PRODUCT_DAYSHARES": 11,
        "HISTORY_PRODUCT_SEATBOOK": 12,
        "HISTORY_PRODUCT_NEWIDEASPRODUCTS": 13,
        "HISTORY_EXPIRED_TIME": 30
    },
    PAGE: {
        guess: '研究-猜你想看'
    },
    ROUTER: {
        search: 0,
        state: 1
    },
    FILTER: {
        noAuth: '403-未登录',
        noPage: '404-页面不存在,请检查跳转URL',
        noRole: '405-无权限',
        noRoleTips: '暂无权限，请联系销售'
    },
    EVENTS: {
        VIEWS: {
            MY: 'my',
            RECOMMEND: 'Recommend',
            ANALYSTSINFO: 'analysts-info'
        },
        LOGINSTATUS: {
            MSG: "login-status",
            IN: 'login',
            OUT: 'logout',
            REINPUT: 're-input'
        },
        FOLLOWSTATUS: {
            MSG: 'follow-status',
            ISFOLLOW: 'isFollow',
            NOTISFOLLOW: 'notIsFollow',
        },
        COMMONTIPS: 'common-tips'
    },
    PDF: {
        TYPE: {
            RES_REPORT: 1,
            RES_PRODUCT: 2,
            OUT_BUESINESS: 3,
            DER_STRATEGY: 4,
            FI_ANNOUNCEMENT: 5 /*固收债券公告pdf*/
        }
    },
    MD: {
        TYPE: {
            OUT_WHITEPAPER: 1,
            DER_USERMANUAL: 2
        }
    },
    PLATFORMMAP: {
        "iPhone1,1": false,
        "iPhone1,2": false,
        "iPhone2,1": false,
        "iPhone3,1": false,
        "iPhone3,2": false,
        "iPhone3,3": false,
        "iPhone4,1": false,
        "iPhone5,1": false,
        "iPhone5,2": false,
        "iPhone5,3": false,
        "iPhone5,4": false,
        "iPhone6,1": false,
        "iPhone6,2": false,
        "iPhone7,1": false,
        "iPhone7,2": false,
        "iPhone8,1": false,
        "iPhone8,2": false,
        "iPhone8,4": false,
        "iPhone9,1": false,
        "iPhone9,2": false,
        "iPhone10,1": false,
        "iPhone10,2": false,
        "iPhone10,3": false,
        "iPhone10,4": false,
        "iPhone10,5": false,
        "iPhone10,6": true,
        "iPhone11,2": true,
        "iPhone11,4": true,
        "iPhone11,6": true,
        "iPhone11,8": true,
        "iPhone12,1": true,
        "iPhone12,3": true,
        "iPhone12,5": true,
    }
}
