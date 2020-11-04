import { isEmpty } from "./libs";
const now = new Date();

export default {
    /*获取当前日期前一年|后三月的日期数据*/
    getDayBetween: function () {
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let min = 0;
        // 闰年
        if ((year % 4) === 0 && (year % 100) !== 0 && month === 2 && date === 29) {
            min = (year - 1) + '/' + month + '/' + 28;
        } else {
            min = (year - 1) + '/' + month + '/' + date;
        }
        // 10+ 月
        if (month + 3 > 12) {
            year += 1;
            month = month + 3 - 12;
        } else {
            month = month + 3
        }
        let max = year + '/' + month + '/' + date;

        let minDate = new Date(min);
        let maxDate = new Date(max);

        let dateArr = [];
        for (let ts = minDate.getTime(); ts <= maxDate.getTime(); ts += 60 * 60 * 24 * 1000) {
            let ress = {};
            let day = new Date(ts);
            ress.week = this.dateWeek(day.getDay());
            ress.y_m_d = day.getFullYear() + '/' + this.formatZero((day.getMonth() + 1)) + '/' + this.formatZero(day.getDate());
            ress.isDay = false;
            ress.isCheck = false;
            if (this.today() === ts) {
                ress.date = '今';
                ress.isDay = true;
                ress.isCheck = true;
            } else {
                ress.date = day.getDate();
            }
            dateArr.push(ress)
        }
        return dateArr;
    },

    today: function () {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = now.getDate();
        return new Date(year + '/' + month + '/' + date).getTime();
    },

    dateWeek: function (date) {
        let week;
        if (date === 0) week = "日";
        if (date === 1) week = "一";
        if (date === 2) week = "二";
        if (date === 3) week = "三";
        if (date === 4) week = "四";
        if (date === 5) week = "五";
        if (date === 6) week = "六";
        return week;
    },
    formatZero: function (num) {
        if (num < 10) return '0' + num;
        else return '' + num;
    },
    /*机构APP 定制日历 月视图*/
    getOAMonthBetween: function () {
        let startdate = new Date(+now - 31536000000);
        let enddate = new Date(+now + 7776000000);
        var year = startdate.getFullYear();
        let start = startdate.getFullYear() + '/' + (startdate.getMonth() + 1) + '/' + startdate.getDate();
        let end = enddate.getFullYear() + '/' + (enddate.getMonth() + 1) + '/' + enddate.getDate();
        let datenum = this.MonthsBetw(start, end);
        var month = startdate.getMonth();
        let dateArr = [];
        let index = 0;
        for (var i = 0; i < datenum; i++) {
            if (month > 0 || month <= 12) {
                month++
            } else {
                month = 1; year++
            }
            var dayCount;
            var data = new Date(year, month, 0);
            dayCount = data.getDate();
            let res = {};
            res.title = data.getFullYear() + '年' + this.formatZero((data.getMonth() + 1)) + '月';
            res.month = [];
            for (let j = 0; j < dayCount; j++) {
                let ress = {};
                ress.y_m_d = data.getFullYear() + '/' + this.formatZero((data.getMonth() + 1)) + '/' + this.formatZero((j + 1));
                ress.date = j + 1;
                ress.index = index;
                ress.isDay = false;
                ress.isCheck = false;
                ress.wknum = new Date(data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + (j + 1)).getDay();
                ress.week = this.dateWeek(new Date(data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + (j + 1)).getDay());
                if (new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()).getTime() ===
                    new Date(data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + (j + 1)).getTime()
                ) {
                    ress.isDay = true;
                    ress.isCheck = true;
                    ress.date = '今';
                }
                index++;
                res.month.push(ress)
            }
            dateArr.push(res)
        }
        return dateArr
    },
    /*固收定制日历 月视图*/
    getMonthBetween: function (startStr, endStr) {
        /*默认当前日期，起始前半年、结束为发行项目最后一个日期所在月份  + 7776000000*/
        let startdate = !isEmpty(startStr) ? startStr : new Date(+now - 15552000000);
        let enddate = !isEmpty(endStr) ? endStr : new Date(+now);
        /*获取当前日期，比较发行项目超出前6个月，渲染前半年的数据*/
        let nowYMD = now.getFullYear() + '/' + this.formatZero((now.getMonth() + 1)) + '/' + this.formatZero(now.getDate());
        let startYMD = startdate.getFullYear() + '/' + this.formatZero((startdate.getMonth() + 1)) + '/' + this.formatZero(startdate.getDate());
        if (this.MonthsBetw(startYMD, nowYMD) && this.MonthsBetw(startYMD, nowYMD) > 6) {
            startdate = new Date(+now - 15552000000);
        }
        /*生成日历数据*/
        let nowYM = now.getFullYear() + '/' + this.formatZero((now.getMonth() + 1));
        var year = startdate.getFullYear();
        let start = startdate.getFullYear() + '/' + this.formatZero((startdate.getMonth() + 1)) + '/' + this.formatZero(startdate.getDate());
        let end = enddate.getFullYear() + '/' + this.formatZero((enddate.getMonth() + 1)) + '/' + this.formatZero(enddate.getDate());
        let datenum = this.MonthsBetw(start, end);
        var month = startdate.getMonth();
        let dateArr = [];
        let index = 0;
        for (var i = 0; i < datenum; i++) {
            if (month > 0 || month <= 12) {
                month++
            } else {
                month = 1; year++
            }
            var dayCount;
            var data = new Date(year, month, 0);
            dayCount = data.getDate();
            let res = {};
            res.years = data.getFullYear() + '年' + this.formatZero((data.getMonth() + 1)) + '月';
            let ym = data.getFullYear() + '/' + this.formatZero((data.getMonth() + 1));
            if (nowYM === ym) {
                res.fix = i;
            }
            res.month = [];
            for (let j = 0; j < dayCount; j++) {
                let ress = {};
                ress.y_m_d = data.getFullYear() + '/' + this.formatZero((data.getMonth() + 1)) + '/' + this.formatZero((j + 1));
                ress.date = j + 1;
                ress.index = index;
                ress.isDay = false;
                ress.isCheck = false;
                ress.seat = '';
                ress.wknum = new Date(data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + (j + 1)).getDay();
                ress.week = this.dateWeek(new Date(data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + (j + 1)).getDay());
                if (new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()).getTime() ===
                    new Date(data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + (j + 1)).getTime()
                ) {
                    ress.isDay = true;
                    ress.isCheck = true;
                    ress.date = '今';
                }
                index++;
                res.month.push(ress)
            }
            dateArr.push(res)
        }
        return dateArr
    },
    /*获取日期区间的日历周视图*/
    getMonthBetweenWeekView: function (startdate, enddate) {
        if (isEmpty(startdate)) startdate = new Date(+now - 1536000000);
        if (isEmpty(enddate)) enddate = new Date(+now + 7776000000);
        var year = startdate.getFullYear();
        let start = startdate.getFullYear() + '/' + (startdate.getMonth() + 1) + '/' + startdate.getDate();
        let end = enddate.getFullYear() + '/' + (enddate.getMonth() + 1) + '/' + enddate.getDate();
        let datenum = this.MonthsBetw(start, end);
        var month = now.getMonth();
        let dateArr = [];
        let index = 0;
        for (var i = 0; i < datenum; i++) {
            if (month > 0 || month <= 12) {
                month++
            } else {
                month = 1; year++
            }
            var dayCount;
            var data = new Date(year, month, 0);
            dayCount = data.getDate();
            // let res = {};
            // res.title = data.getFullYear() + '年' + this.formatZero((data.getMonth()+1)) + '月';
            // let month = [];
            for (let j = 0; j < dayCount; j++) {
                let ress = {};
                ress.y_m_d = data.getFullYear() + '/' + this.formatZero((data.getMonth() + 1)) + '/' + this.formatZero((j + 1));
                ress.date = j + 1;
                ress.index = index;
                ress.isDay = false;
                ress.isCheck = false;
                ress.wknum = new Date(data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + (j + 1)).getDay();
                ress.week = this.dateWeek(new Date(data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + (j + 1)).getDay());
                if (new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()).getTime() ===
                    new Date(data.getFullYear() + '/' + (data.getMonth() + 1) + '/' + (j + 1)).getTime()
                ) {
                    ress.isDay = true;
                    ress.isCheck = true;
                    ress.date = '今';
                }
                index++;
                dateArr.push(ress)
            }
        }
        // console.error(dateArr)
        return dateArr
    },
    /*返回两个日期相差的月数*/
    MonthsBetw: function (date1, date2) {
        //用-分成数组
        date1 = date1.split("/");
        date2 = date2.split("/");
        //获取年,月数
        var year1 = parseInt(date1[0]),
            month1 = parseInt(date1[1]),
            year2 = parseInt(date2[0]),
            month2 = parseInt(date2[1]),
            //通过年,月差计算月份差
            months = (year2 - year1) * 12 + (month2 - month1) + 1;
        return months;
    },
    /*判断是否闰年*/
    isLeapYear() {
        let year = new Date(now).getFullYear();
        if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) return true
        else return false
    }
}
