export default{
    timeout:1000*8,
    enableTips:true,
    token2Login:true,
    contentType:"application/json;",
    baseUrl:"https://zs-test.csc108.com/rest",
    // baseUrl:"/api", //使用代理时启用
    NoticeBaseUrl:"https://teste.csc108.com",  
    // NoticeBaseUrl:"/notice", //消息中心使用代理时使用
    resea: '/institution/resea',
    coupon: "/institution/coupon",
    insti: '/institution/insti',
    es: '/institution/es',                                                     
    operation: '/institution/operation',
    otctrading: '/institution/derivative',
    derivative: '/institution/derivative',
}
const CONSTANT={
    ENABLE: {
        tips: true,
    },
    TIME: {
        timeout: 8000,
    },
    HEADER:{
        POST:{
            CONTENTTYPE:"application/json;"
        }
    },
    CODE: {
        success: 200,
        succesies: [200, 203, 204],
        // 自定义code
        tokenInvalid: 555,
        timeout: 666,
        networkError: -666,
        arriveError: 777,
        codeError:770,
        nodataError:771,
        signError:771,
    },
    TIPS: {
        nodata: '未找到数据',
        errorCode: 'Code不存在或不匹配成功Code',
        timeout: '请求超时',
        networkError: '网络连接不可用',
        responseError: '网络请求异常',
        serverError: '服务器异常',
        clientError: '程序异常',
        tokenError: 'Token失效',
        signError:"签名验证异常"
    },
    KEYS:{
        loginCount: 'loginCount'
    }
}
export {CONSTANT};