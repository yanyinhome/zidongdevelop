import {request} from '../utils/bd_request';
import constants from "../utils/constants";

/* 服务研究通用数据接口 导出引用时，统一使用CommonService命名*/
export default {
    /**首页轮播图**/
    get_banners: function (success, fail, params) {
        request('get', '/api', constants.resea + '/tSlideShow/slideShowList', params, success, fail);
    },
}
