function loadTodayInterface() {
    html = ``


}

/**
 * Call this function at the beginning of the page to load the today interface.
 */
async function initTodayPage(db) {
    loadTodayInterface()
    loadTodayTypes(db)
}

function loadTodayTypes(db) {
    $('#today-filter').html(`<a class="dropdown-item" href="javascript:onClickDropdown('全部')">全部</a>`)
    db.getAllTypes(function (type) {
        $('#today-filter').append(`<a class="dropdown-item" href="javascript:onClickDropdown(${type.id})">${type.name}</a>`)
        filterHtml = `<a class="dropdown-item" href="javascript:onClickDropdown('全部')">全部</a>`
        for (i = 0; i < myTypes.length; i++) {
            filterHtml += `<a class="dropdown-item" href="javascript:onClickDropdown('${myTypes[i].name}')">${myTypes[i].name}</a>`
        }
        $('#today-filter').html(filterHtml)
    })
}

/**
 * Call this function when switched in Today page.
 * @param {DBManager} db 
 * @param {scheduled list} todayList Filter out today's tasks from the scheduled list
 */
async function loadTodayList(db, todayList) {
    $('#today-list').html(``)
    let html = ``

    for (i = 0; i < todayList.length; i++) {
        let type = await db.queryType(todayList[i].id)
        html += `
        <div class="div-list-item" onclick="chooseTodayItem(${todayList[i].id})">
            <img src="./res/radio-false.svg" style="align-items: center;"
                onclick="finishTodayItem(${todayList[i].id}); event.cancelBubble = true">
            <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                ${todayList[i].name}
                <span class="badge badge-type">${type.name}</span>
                <span class="badge badge-status">${todayList[i].status}</span>
            </p>
        </div>
        `
    }
}

/**
 * Call this function when switched in Today page.
 * @param {DBManager} db 
 * @param {scheduled list} todayList Filter out today's tasks from the scheduled list
 */
async function addTodayList(db, todayItem) {
    $('#today-list').html(``)
    let html = ``

    if (1) {
        let type = await db.queryType(todayList[i].id)
        html += `
        <div class="div-list-item" onclick="chooseTodayItem(${todayList[i].id})">
            <img src="./res/radio-false.svg" style="align-items: center;"
                onclick="finishTodayItem(${todayList[i].id}); event.cancelBubble = true">
            <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                ${todayList[i].name}
                <span class="badge badge-type">${type.name}</span>
                <span class="badge badge-status">${todayList[i].status}</span>
            </p>
        </div>
        `
    }
}

/**
 * Open detail column and show the details of the clicking item.
 * @param {DBManager} db 
 * @param {item id} id 
 */
function loadTodayItemDetails(db, id) {
    $('#today-details').css("display", "")
}

function chooseTodayItem(id) {

}

/**
 * Remove the finishing task from page and move task in the database.
 * @param {int} id Id of the task
 */
function finishTodayItem(id) {
    console.log(id)
}

function hideTodayItemDetails() {
    $('#today-details').css("display", "none")
}