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
                            id="taskDropdownButton" data-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                            全部
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" id="tasks-filter"
                            aria-labelledby="dropdownMenuButton">
                        </div>
                    </div>
                    <div class="dropdown" id="myDropdown"
                        style="float:right; margin-top: 16px; margin-bottom: 8px; margin-right: 8px;">
                        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button"
                            id="taskDropdownButton" data-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                            编辑类型
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" id="edit-type-options"
                            aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" href="javascript:loadAddTypeDetails(db)">新增</a>
                            <a class="dropdown-item" href="javascript:loadUpdateTypeDetails(db)">修改</a>
                        </div>
                    </div>
                </div>
    
                <div class="table-area noselect" id="tasks-list">
                </div>
            </div>
            <div class="div-details noselect" id="task-details" style="display: none;">
                <p class="detail-name" id="task-details-title"></p>
                <div class="divider"></div>
                <div class="detail-content" id="task-detail-content"></div>
                <div class="divider"></div>
                <div class="detail-foot">
                    <img src="../../res/close.svg" style="margin: 12px;" onclick="hideTaskItemDetails()">
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
    $('#tasks-filter').html(`<a class="dropdown-item" href="javascript:onClickTaskDropdown(db, 0, '全部')">全部</a>`)
    db.getAllTypes((type) => {
        if (type.inValid != null) {
            return
        }

        $('#tasks-filter').append(`
            <a class="dropdown-item" href="javascript:onClickTaskDropdown(db, ${type.id}, '${type.name}')">${type.name}</a>
        `)
    })
}

function onClickTaskDropdown(db, id, name) {
    $('#taskDropdownButton').html(name)
    loadTasksList(db, id)
}

function addTaskListItem(task_id, task_name, type_name) {
    $('#tasks-list').append(`
        <div class="div-list-item" onclick="loadTaskItemDetails(db, ${task_id})">
            <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                ${task_name}
                <span class="badge badge-type">${type_name}</span>
            </p>
        </div>
    `)
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
                addTaskListItem(task.id, task.name, type.name)
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
                <label for="add-type-typein-name">类型名称</label>
                <input class="form-control" type="text" id="add-type-typein-name"
                    placeholder="类型名称">
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

function loadUpdateTypeDetails(db) {
    $('#task-details').css("display", "")
    $('#task-details-title').html('修改类型')

    $('#task-detail-content').html(`
    <form style="margin: 8px;">
        <div class="form-group">
            <label for="edit-choose-type">类型</label>
            <select class="form-control" id="edit-choose-type">
            </select>
        </div>
        <div class="form-group">
            <label for="edit-typein-type-name">修改名称</label>
            <input class="form-control" type="text" id="edit-typein-type-name"
                placeholder="修改名称">
        </div>
        <button type="button" class="btn btn-primary"
            onclick="commitUpdateTypeDetails(db)">
            提交
        </button>
        <button type="button" class="btn btn-primary"
            onclick="commitDeleteTypeDetails(db)">
            删除
        </button>
    </form>
    `)
    db.getAllTypes((type) => {
        if (type.inValid != null) {
            return
        }

        $('#edit-choose-type').append(`
            <option value=${type.id}>${type.name}</option>
        `)
    })
}

function commitUpdateTypeDetails(db) {
    id = $('#edit-choose-type').val()
    newName = $('#edit-typein-type-name').val()

    if (id == null || newName == null) {
        return
    }

    db.updateTypes(id, newName, (updated) => {
        if (updated) {
            loadUpdateTypeDetails(db)
        } else {
            // error
        }
    })
}

function commitDeleteTypeDetails(db) {
    id = $('#edit-choose-type').val()

    if (id == null) {
        return
    }

    db.inValidTypes(id, (updated) => {
        if (updated) {
            loadUpdateTypeDetails(db)
        } else {
            // error
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
                <label for="add-task-choose-type">类型</label>
                <select class="form-control" id="add-task-choose-type">
                </select>
            </div>
            <div class="form-group">
                <label for="add-task-typein-name">任务名称</label>
                <input class="form-control" type="text" id="add-task-typein-name"
                    placeholder="任务名称">
            </div>
            <button type="button" class="btn btn-primary" onclick="commitAddTaskDetails(db)">提交</button>
        </form>`)
    db.getAllTypes((type) => {
        if (type.inValid != null) {
            return
        }

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
                addTaskListItem(task.id, task.name, type.name)
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
                        完成次数：${task.complete_times ? task.complete_times : 0}
                    </div>
                    <div class="divider"></div>
                    <div class="detail-item">
                        延迟次数：${task.delayed_times ? task.delayed_times : 0}
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