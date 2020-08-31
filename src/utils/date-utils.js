/**
 * Get date str 'yyyy-MM-dd' from Date()
 * @param {Date} mydate 
 */
function getDateStr(mydate) {
    year = mydate.getFullYear()
    month = mydate.getMonth() + 1
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    day = mydate.getDate()
    if (day >= 1 && day <= 9) {
        day = '0' + day;
    }
    date = year + '-' + month + '-' + day
    return date
}

/**
 * Calculate days between date_1 and date_2. (date_1 - date_2)
 * @param {String} date_1 like '2020-01-11'
 * @param {String} date_2 like '2020-01-11'
 */
function calculateDays(date_1, date_2) {
    var aDate, oDate1, oDate2, iDays
    aDate = date_1.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式  
    aDate = date_2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt((oDate2 - oDate1) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
    return iDays
}

function getTodayDate() {
    date = new Date()
    year = date.getFullYear()
    month = date.getMonth() + 1
    day = date.getDate()
    weekday = date.getDay()
    return year + '年' + month + '月' + day + '日 ' + getWeekday(weekday)
}

function getWeekday(weekday) {
    switch(weekday) {
        case 0:
            return '星期日'
        case 1:
            return '星期一'
        case 2:
            return '星期二'
        case 3:
            return '星期三'
        case 4:
            return '星期四'
        case 5:
            return '星期五'
        case 6:
            return '星期六'
        default:
            return ''
    }
}