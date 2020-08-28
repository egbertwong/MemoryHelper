function loadTasksInterface() {
    $('#v-pills-tasks').html(`
        <div style="display: flex; flex-direction: row;">
          <div class="page">
                <div id="content-head">
                    <div class="head-title">Tasks</div>
                </div>
    
                <div id="table-filter" style="margin-left: 16px; margin-right: 16px; height: 48px;">
                    <button type="button" class="btn btn-secondary btn-sm"
                        style="float:left; margin-top: 16px; margin-bottom: 8px;"
                        onclick="loadAddTaskDetails(db)">添加</button>
                    <div class="dropdown" id="myDropdown"
                        style="float:right; margin-top: 16px; margin-bottom: 8px;">
                        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button"
                            id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                            全部
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" id="tasks-filter"
                            aria-labelledby="dropdownMenuButton">
                        </div>
                    </div>
                    <button type="button" class="btn btn-secondary btn-sm"
                        style="float:right; margin-top: 16px; margin-bottom: 8px; margin-right: 8px;"
                        onclick="loadAddTypeDetails(db)">编辑类型</button>
                </div>
    
                <div class="table-area noselect" id="tasks-list">
                    <div class="div-list-item" onclick="loadTaskItemDetails(0)">
                        <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                            测试项目
                            <span class="badge badge-type">英语</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="div-details noselect" id="task-details" style="display: none;">
                <p class="detail-name" id="task-details-title"></p>
                <div class="divider"></div>
                <div class="detail-content" id="task-detail-content"></div>
                <div class="divider"></div>
                <div class="detail-foot">
                    <img src="./res/close.svg" style="margin: 12px;" onclick="hideTaskItemDetails()">
                </div>
            </div>
        </div>
    `)
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
async function loadTasksList(db, cur_type) {
    $('#tasks-list').html(``)
    let html = ``

    db.loadTasks((task) => {
        console.log('loadTasksList loadTasks callback')
        db.queryType(task.type_id, (type) => { 
            if (cur_type == 0 || cur_type == type.id) {
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

    $('#task-detail-content').html(`
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
    $('#task-detail-content').html(`
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
                    <div class="div-list-item" onclick="loadTaskItemDetails(db, ${task.id})">
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
    $('#task-detail-content').html(``)
    let task_id = parseInt(id, 10)
    db.getTask(task_id, (task) => {
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

            $('#task-detail-content').append(`
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

            $('#task-detail-content').append(`
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