export default {
    VERSION: '@version',
    // 存储的键
    KDS_KEY: {
        stockData: 'stockData',    //原生传给H5的股票信息
        stockCode: 'stockCode',    //原生传给H5的股票代码
        hostUrls: 'hostUrls',     //域名地址
        PAGE_PATH: 'PAGE_PATH',    //导航Tab一级路由地址
        JK_PAGE_PATH: 'JK_PAGE_PATH', //简况-二级路由地址
        PAGE_DETAIL: 'PAGE_DETAIL',  //详情页
        KDS_ENCRYPT_DATA: 'KDS_ENCRYPT_DATA', // 加密对象
    },
    // H5 向mpaas存数据的 KEY 值
    h5Key: {},
    // 需要加密的字段
    ENCRYPTED_FIELD: [],
    //SM4 加密密钥
    encrypt: {
        key: "QvAyLz5QqqCHut3vi9hZKzUPrT3Wq5Ab",
        iv: "QvAyLz5QqqCHut3vi9hZK8IAraDsbQFNpwXWXXn+rb4=",
        type: 2,        //0 表示不加密，1 表示3des加密， 2 表示SM4_ECB加密，3 表示SM4_CBC加密
    },
    //错误码
    errorCode: {
        "APCode1": "No available AlipayJSBridge!",
        "APCode2": "Get data failed!",
    },
    // TODO: 致胜接口鉴权需要的key和秘钥
    ZS_AUTHOR_PARAMS: {
        // 测试
        test: {
            apikey: '',
            apisecret: ''
        },
        // 生产
        online: {
            apikey: '',
            apisecret: ''
        }
    },
}
