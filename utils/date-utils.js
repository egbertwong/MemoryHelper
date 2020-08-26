function getDate() {

}

/**
 * Calculate days between date_1 and date_2. (date_2 - date_1)
 * @param {String} date_1 like '2020-01-11'
 * @param {String} date_2 like '2020-01-11'
 */
function calculateDays(date_1, date_2) {
    var aDate, oDate1, oDate2, iDays
    aDate = date_1.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式  
    aDate = date_2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
    return iDays
}