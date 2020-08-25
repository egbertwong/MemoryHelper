function loadTodayInterface() {
    html = ``
}

/**
 * Call this function at the beginning of the page to load the today interface.
 */
function initTodayPage(db) {
    loadTodayInterface()
    db.addTypes('数学')
    db.addTypes('英语')
    db.addTask('微积分第一章数列部分', '数学', (myTask) => {
        alert("My types: " + JSON.stringify(myTask));
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
        let type = await this.db.types.get(todayList[i].type_id)
        console.log('type name:' + type.name)
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
 * @param {scheduled item} item 
 */
function loadTodayItemDetails(item) {
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