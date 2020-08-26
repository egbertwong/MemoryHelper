function loadTasksInterface() {
    html = ``
}

function initTasksPage(db) {
    console.log('initTasksPage')
    loadTasksInterface()
    loadTasksList(db)
}

function loadListFilter(db) {
    
}

/**
 * 
 * @param {DBManager} db 
 */
async function loadTasksList(db) {
    $('#tasks-list').html(``)
    let html = ``

    db.loadTasks((task) => {
        console.log('loadTasksList loadTasks callback')
        db.queryType(task.type_id, (type) => { 
            $('#tasks-list').append(`
                <div class="div-list-item" onclick="loadTaskItemDetails(${task.id})">
                    <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                        ${task.name}
                        <span class="badge badge-type">${type.name}</span>
                    </p>
                </div>
        `)
        })
    })
}

/**
 * Open the detail column on the right and show task details
 * @param {task item} task 
 */
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