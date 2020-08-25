function loadTasksInterface() {
    html = ``
}

function initTasksPage(db) {
    loadTasksInterface()
}

/**
 * 
 * @param {DBManager} db 
 * @param {list} List 
 */
async function loadTasksList(db, tasksList) {
    $('#tasks-list').html(``)
    let html = ``

    for(i = 0; i < tasksList.length; i++) {
        let type = await this.db.types.get(tasksList[i].type_id)
        html += ``
    }
}

function loadTaskItemDetails(task) {
    $('#task-details').css("display", "")
}

function chooseTaskItem(id) {

}

function addTask(name, type_id, status) {
    //
}

function hideTaskItemDetails() {
    $('#task-details').css("display", "none")
}