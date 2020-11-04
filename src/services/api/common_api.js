import {request} from '@services/axios/request';
import constants from "@utils/constants";
import {noFilter} from "@services/axios/filter";

/* 服务研究通用数据接口 导出引用时，统一使用CommonService命名*/
export default {
    /*二次登录*/
    secondLogin: function (success, fail, body) {
        request('post',  constants.insti + '/user/login/second', body, success, fail)
    },
    /**
     * 债券日历 首页通知消数
     * t	        用户类型  1
     * u	        用户ID    "C10002356"
     * topicType    话题类型  "1"
    */
    getNoticeInfoCount:function (success, fail, body) {
        request('post','/upush/unreadcount',body,success,fail,null,noFilter,{push:true})
    },
}
