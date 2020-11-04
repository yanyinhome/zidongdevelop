import {Toast, Modal} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import '../css/tip.less'

const alert = Modal.alert;
const defaultTime = 2;
const Tip = {
    shows: false,
    info(content = "提示内容", duration = defaultTime) {
        if (!this.shows) {
            this.shows = true;
            Toast.info(content, duration, () => {
                this.shows = false;
            })
        }
    },

    success: function success(content = "success", duration = defaultTime) {
        if (!this.shows) {
            this.shows = true;
            Toast.success(content, duration, () => {
                this.shows = false;
            })
        }
    },
    fail: function fail(content = "失败", duration = defaultTime) {
        if (!this.shows) {
            this.shows = true;
            Toast.fail(content, duration, () => {
                this.shows = false;
            })
        }
    },
    loading: function (duration = defaultTime) {
        if (!this.shows) {
            Toast.loading("加载中...", duration, () => {
                this.shows = false;
            }, true)
        }
    },
    close() {
        if (!this.shows) {
            Toast.hide()
        }
    },
    model(tittle = "确定不再关注？", message = "", sureCallBack, cancelCallBack) {
        alert(tittle, message, [
            {
                text: '取消',
                onPress: () => typeof cancelCallBack === 'function' ? cancelCallBack() : ''
            },
            {text: '确定', onPress: () => typeof sureCallBack === 'function' ? sureCallBack() : ''},
        ])
    }
};

export default Tip;


