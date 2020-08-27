function loadTasksInterface() {
    html = ``
}

function initTasksPage(db) {
    console.log('initTasksPage')
    loadTasksInterface()
    loadTasksFilter(db)
    loadTasksList(db, 0)
}

function loadTasksFilter(db) {
    $('#tasks-filter').html(`<a class="dropdown-item" href="javascript:loadTasksList(db, 0)">全部</a>`)
    db.getAllTypes((type) => {
        $('#tasks-filter').append(`
            <a class="dropdown-item" href="javascript:loadTasksList(db, ${type.id})">${type.name}</a>
        `)
    })
}

/**
 * 
 * @param {DBManager} db 
 */
async function loadTasksList(db, id) {
    $('#tasks-list').html(``)
    let html = ``

    db.loadTasks((task) => {
        console.log('loadTasksList loadTasks callback')
        db.queryType(task.type_id, (type) => { 
            if (id == 0 || id == type.id) {
                $('#tasks-list').append(`
                    <div class="div-list-item" onclick="loadTaskItemDetails(db, ${task.id})">
                        <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                            ${task.name}
                            <span class="badge badge-type">${type.name}</span>
                        </p>
                    </div>
                `)
            }
        })
    })
}

/**
 * 
 */
function loadAddTypeDetails(db) {
    $('#task-details').css("display", "")
    $('#task-details-title').html('添加类型')

    $('#detail-content').html(`
        <form style="margin: 8px;">
            <div class="form-group">
                <label for="add-type-typein-name">Type name</label>
                <input class="form-control" type="text" id="add-type-typein-name"
                    placeholder="Type name">
            </div>
            <button type="button" class="btn btn-primary" onclick="commitAddTypeDetails(db)">提交</button>
        </form>`)
}

function commitAddTypeDetails(db) {
    let name = $('#add-type-typein-name').val()
    db.addType(name, (type) => {
        console.log('type name:' + type.name)
        if (type.name != null) {
            $('#tasks-filter').append(`
            <a class="dropdown-item" href="javascript:loadTasksList(db, ${type.id})">${type.name}</a>
        `)
        }
    })
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
            <button type="button" class="btn btn-primary" onclick="commitAddTaskDetails(db)">提交</button>
        </form>`)
    db.getAllTypes((type) => {
        $('#add-task-choose-type').append(`
            <option value=${type.id}>${type.name}</option>
        `)
    })

}

function commitAddTaskDetails(db) {
    let type_id = parseInt($('#add-task-choose-type').val(), 10)
    let name = $('#add-task-typein-name').val()
    console.log('type:' + type_id + ', name:' + name)
    if (name == null) {
        return
    }

    db.addTask(name, type_id, (task) => {
        if (task.name == name) {
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
        } else {
            console.log('fail')
        }
    })
}

/**
 * Open the detail column on the right and show task details
 * @param {task id} id 
 */
function loadTaskItemDetails(db, id) {
    $('#task-details').css("display", "")
    $('#detail-content').html(``)
    db.getTask(id, (task) => {
        if (task.id != null) {
            $('#task-details-title').html(`
                ${task.name}
                <span class="badge badge-status">${getStatusById(task.status)}</span>
            `)
            db.queryType(task.type_id, (type) => { 
                if (type.name != null) {
                    $('#task-details-title').append(`<span class="badge badge-type">${type.name}</span>`)
                }
            })

            $('#detail-content').append(`
                <div class="detail-block">
                    <div class="detail-item">
                        首次进行：${task.first_date ? task.first_date : ''}
                    </div>
                    <div class="divider"></div>
                    <div class="detail-item">
                        上次进行：${task.last_date ? task.last_date : ''}
                    </div>
                    <div class="divider"></div>
                    <div class="detail-item">
                        计划进行：${task.next_date ? task.next_date : ''}
                    </div>
                </div>
            `)

            $('#detail-content').append(`
                <div class="detail-block">
                    <div class="detail-item">
                        完成次数：${task.complete_times ? task.complete_times : ''}
                    </div>
                    <div class="divider"></div>
                    <div class="detail-item">
                        延迟次数：${task.delayed_times ? task.delayed_times : ''}
                    </div>
                    <div class="divider"></div>
                    <div class="detail-item">
                        效果评级：${task.rate ? task.rate : ''}
                    </div>
                </div>
            `)

        }
    })
}

function chooseTaskItem(id) {

}

function addTask(name, type_id, status) {
    //
}

function hideTaskItemDetails() {
    $('#task-details').css("display", "none")
}