function getStatusById(status) {
    switch (status) {
        case 0:
            return '未进行'
        case 1:
            return '首次'
        case 2:
            return '次日'
        case 3:
            return '首周'
        case 4:
            return '循环'
        default:
            return ''
    }
}