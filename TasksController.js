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
 * 
 */
function loadAddTypeDetails() {
    $('#task-details').css("display", "")
    $('#task-details-title').html('添加类型')
    // 输入类型名称
    // 确定 提交，返回结果
}

/**
 * 
 */
function loadAddTaskDetails(db) {
    $('#task-details').css("display", "")
    $('#task-details-title').html('添加任务')
    $('#detail-content').html(`
        <form style="margin: 8px;">
            <div class="form-group">
                <label for="add-task-choose-type">Type</label>
                <select class="form-control" id="add-task-choose-type">
                </select>
            </div>
            <div class="form-group">
                <label for="add-task-typein-name">Task name</label>
                <input class="form-control" type="text" id="add-task-typein-name"
                    placeholder="Task name">
            </div>
            <button type="button" class="btn btn-primary" onclick="commitAddTaskDetails()">提交</button>
        </form>`)
    db.getAllTypes((type) => {
        $('#add-task-choose-type').append(`
            <option value="${type.id}">${type.name}</option>
        `)
    })

}

function commitAddTaskDetails() {
    let type_id = $('#add-task-choose-type').val()
    let name = $('#add-task-typein-name').val()
    console.log('type:' + type_id + ', name:' + name)
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