const { name } = require("sql.js")

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
        <li class="div-list-item" onclick="loadTaskItemDetails(db, ${task_id}, this);">
            <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                ${task_name}
                <span class="badge badge-type">${type_name}</span>
            </p>
        </li>
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
            <img src="../../res/error.svg" id="task-error" style="margin: 12px; display: none;">
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
        <img src="../../res/error.svg" id="task-error" style="margin: 12px; display: none;">
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
            loadTasksFilter(db)
            loadTasksList(db, 0)
            loadUpdateTypeDetails(db)
        } else {
            showTaskError()
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
            loadTasksFilter(db)
            loadTasksList(db, 0)
            loadUpdateTypeDetails(db)
        } else {
            showTaskError()
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
            <img src="../../res/error.svg" id="task-error" style="margin: 12px; display: none;">
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
            loadAddTaskDetails(db)
        } else {
            showTaskError()
        }
    })
}

/**
 * Open the detail column on the right and show task details
 * @param {task id} id 
 */
function loadTaskItemDetails(db, id, dom) {
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

            $('#task-detail-content').append(`
            <div style="display: flex; flex-direction: row; margin: 8px;">
                <button type="button" class="btn btn-primary" onclick="loadEditTaskDetails(db, ${task.id}, ${$(dom)});" style="flex: 1; margin: 4px;">修改</button>
                <button type="button" class="btn btn-danger" style="flex: 1; margin: 4px;"
                    data-toggle="modal" data-target="#deleteTaskConfirm">删除</button>
            </div>
            `)

            $('#task-detail-content').append(`
            <div class="modal fade" id="deleteTaskConfirm" tabindex="-1" role="dialog" aria-labelledby="deleteTaskConfirmLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="deleteTaskConfirmLabel">提示</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    确认删除任务吗
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal">删除</button>
                  </div>
                </div>
              </div>
            </div>
            `)

            $('#task-detail-content').append(`
            <div class="modal fade" id="deleteTaskFail" tabindex="-1" role="dialog" aria-labelledby="deleteTaskFailLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="deleteTaskFailLabel">提示</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    删除失败，请重新进入页面查看
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">确认</button>
                  </div>
                </div>
              </div>
            </div>
            `)
        }
    })
}

function loadEditTaskDetails(db, id, dom) {
    dom = JSON.stringify(dom).replace(/""/g,"’")
    id = parseInt(id)
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
            <form style="margin: 8px;">
                <div class="form-group">
                    <label for="edit-task-choose-type">类型</label>
                    <select class="form-control" id="edit-task-choose-type">
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-task-typein-name">旧名称：${task.name}（不填则不修改）</label>
                    <input class="form-control" type="text" id="edit-task-typein-name"
                        placeholder="新名称">
                </div>
                <button type="button" class="btn btn-primary" onclick="commitEditTaskDetails(db, ${id}, ${dom})">提交</button>
                <img src="../../res/error.svg" id="task-error" style="margin: 12px; display: none;">
            </form>
            `)

            db.getAllTypes((type) => {
                if (type.inValid != null) {
                    return
                }
        
                $('#edit-task-choose-type').append(`
                    <option value=${type.id}>${type.name}</option>
                `)

                if (task.type_id == type.id) {
                    $('#edit-task-choose-type').val(task.type_id)
                }
            })  
        }
    })
}

function commitEditTaskDetails(db, id, dom) {
    dom = JSON.stringify(dom).replace(/""/g,"’")
    name = $('#edit-task-typein-name').val()
    type_id = $('#edit-task-choose-type').val()
    if (name == null || type_id == null) {
        return
    }

    db.getTask(id, (task) => {
        if (name != null) {
            task.name = name
        }

        if (type_id != null) {
            task.type_id = type_id
        }

        db.updateTask(task, (updated) => {
            if (updated) {
                db.queryType(task.type_id, (type) => {
                    // $(dom).children('p').html(`
                    //     ${task.name}
                    //     <span class="badge badge-type">${type.name}</span>
                    // `)
                })
                
                loadTaskItemDetails(db, id, dom)
            }
        })
    })
}

function commitDeleteTaskDetails(db, id, dom) {
    dom = JSON.stringify(dom).replace(/""/g,"’")
    db.inValidTask(id, (updated) => {
        if (updated) {
            //
        } else {
            $('#deleteTaskFail').modal('show')
        }
    })
}

function chooseTaskItem(id) {

}

function addTask(name, type_id, status) {
    //
}

function showTaskError() {
    $('#task-error').css("display", "")
}

function hideTaskItemDetails() {
    $('#task-details').css("display", "none")
}