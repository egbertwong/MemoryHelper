function loadScheduledInterface() {
    $('#v-pills-scheduled').html(`
    <div style="display: flex; flex-direction: row;">
        <div class="page">
            <div id="content-head">
                <div class="head-title">Scheduled</div>
            </div>

            <div id="table-filter" style="margin-left: 16px; margin-right: 16px; height: 48px;">
                <button type="button" class="btn btn-secondary btn-sm"
                    style="float:left; margin-top: 16px; margin-bottom: 8px;"
                    onclick="loadAddScheduledDetails(db)">添加</button>
                <div class="dropdown" id="myDropdown"
                    style="float:right; margin-top: 16px; margin-bottom: 8px;">
                    <button class="btn btn-secondary btn-sm dropdown-toggle" type="button"
                        id="scheduledDropdownButton" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                        全部
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" id="scheduled-filter"
                        aria-labelledby="dropdownMenuButton">
                    </div>
                </div>
            </div>

            <div class="table-area noselect" id="scheduled-list">
                
            </div>
        </div>
        <div class="div-details noselect" id="scheduled-details" style="display: none;">
            <p class="detail-name" id="scheduled-details-title"></p>
            <div class="divider"></div>
            <div class="detail-content" id="scheduled-detail-content"></div>
            <div class="divider"></div>
            <div class="detail-foot">
                <img src="../../res/close.svg" style="margin: 12px;" onclick="hidescheduledItemDetails()">
            </div>
        </div>
    </div>
    `)
}

function initScheduledPage(db) {
    console.log('initScheduledPage')
    loadScheduledInterface()
    loadScheduledFilter(db)
    loadScheduledList(db, 0)
}

function loadScheduledFilter(db) {
    $('#scheduled-filter').html(`<a class="dropdown-item" href="javascript:onClickScheduledDropdown(db, 0, '全部')">全部</a>`)
    db.getAllTypes((type) => {
        $('#scheduled-filter').append(`
            <a class="dropdown-item" href="javascript:onClickScheduledDropdown(db, ${type.id}, '${type.name}')">${type.name}</a>
        `)
    })
}

function onClickScheduledDropdown(db, id, name) {
    $('#scheduledDropdownButton').html(name)
    loadScheduledList(db, id)
}

function addScheduledListItem(scheduled_id, task_name, type_name) {
    $('#scheduled-list').append(`
        <li class="div-list-item" onclick="loadScheduledItemDetails(db, ${scheduled_id}, this)">
            <img src="../../res/radio-false.svg" style="align-items: center;"
                onclick="finishScheduledItem(db, ${scheduled_id}, this); event.cancelBubble = true">
            <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                ${task_name}
                <span class="badge badge-type">${type_name}</span>
            </p>
        </li>
    `)
}

function loadScheduledList(db, cur_type) {
    $('#scheduled-list').html(``)

    db.loadScheduleds((scheduled) => {
        if (cur_type == 0 || cur_type == scheduled.type_id) {
            db.queryType(scheduled.type_id, (type) => {
                db.getTask(scheduled.name_id, (task) => {
                    addScheduledListItem(scheduled.id, task.name, type.name)
                })
            })
        }
    })
}

function loadAddScheduledTypes(db) {
    $('#add-scheduled-choose-type').html(``)
    isFirst_Types = true
    db.getAllTypes((type) => {
        $('#add-scheduled-choose-type').append(`
            <option value=${type.id}
                herf="javascript:loadAddScheduledNamesByType(db, ${type.id})">${type.name}
            </option>
        `)

        if (isFirst_Types) {
            loadAddScheduledNamesByType(db, type.id)
            isFirst_Types = false
        }
    })

    $('#add-scheduled-choose-type').change(() => {
        loadAddScheduledNamesByType(db, parseInt($('#add-scheduled-choose-type').val()))
    })
}

function loadAddScheduledNamesByType(db, cur_type) {
    $('#add-scheduled-choose-task').html(``)
    isFirst_Name = true
    db.loadTasks((task) => {
        if (cur_type == task.type_id) {
            $('#add-scheduled-choose-task').append(`
                <option value=${task.id} onclick="loadAddScheduledStatusByTask(db, ${task.id})">${task.name}</option>
            `)

            if (isFirst_Name) {
                loadAddScheduledStatusByTask(db, task.id)
                isFirst_Name = false
            }
        }
    })

    $('#add-scheduled-choose-task').change(() => {
        loadAddScheduledStatusByTask(db, parseInt($('#add-scheduled-choose-task').val()))
    })
}

function loadAddScheduledStatusByTask(db, task_id) {
    let cur_task_id = parseInt(task_id, 10)
    $('#add-scheduled-status').html(``)
    db.getTask(cur_task_id, (task) => {
        status_num = parseInt(task.status)
        if (status_num < 4) {
            status_num += 1
        }

        $('#add-scheduled-status').html(`
            <option value=${status_num}>${getStatusById(status_num)}</option>
        `)
    })
}

function loadAddScheduledDetails(db) {
    $('#scheduled-details').css("display", "")
    $('#scheduled-details-title').html('添加安排')
    $('#scheduled-detail-content').html(`
        <form style="margin: 8px;">

            <div class="form-group">
                <label for="add-scheduled-choose-type">类型</label>
                <select class="form-control" id="add-scheduled-choose-type">
                </select>
            </div>

            <div class="form-group">
                <label for="add-scheduled-choose-task">任务</label>
                <select class="form-control" id="add-scheduled-choose-task">
                </select>
            </div>

            <div class="form-group">
                <label for="add-scheduled-status">状态</label>
                <select disabled class="form-control" id="add-scheduled-status">
                </select>
            </div>

            <div class="form-group">
                <label for="add-scheduled-date">计划日期</label>
                <input class="form-control" id="add-scheduled-date" type="date">
            </div>

            <button type="button" class="btn btn-primary"
                onclick="commitAddScheduledDetails(db)">提交</button>
            <img src="../../res/error.svg" id="scheduled-error" style="margin: 12px; display: none;">
        </form>
    `)
    loadAddScheduledTypes(db)
}

function commitAddScheduledDetails(db) {
    name_id = parseInt($('#add-scheduled-choose-task').val())
    type_id = parseInt($('#add-scheduled-choose-type').val())
    status = parseInt($('#add-scheduled-status').val())
    scheduled_date = $('#add-scheduled-date').val()

    db.addScheduled(name_id, type_id, status, scheduled_date, (scheduled) => {
        if (scheduled != null) {
            let cur_type = parseInt($('#scheduled-filter').val())
            db.queryType(scheduled.type_id, (type) => {
                db.getTask(scheduled.name_id, (task) => {
                    addScheduledListItem(scheduled.id, task.name, type.name)
                    task.next_date = scheduled_date

                    db.updateTask(task, (task) => {

                    })
                })
            })
        } else {
            $('#scheduled-error').css("display", "")
        }
    })
}

function loadScheduledItemDetails(db, id, dom, index) {
    if (index == null) {
        index = $("#scheduled-list li").index($(dom))
    }

    $('#scheduled-details').css("display", "")
    $('#scheduled-detail-content').html(``)
    db.getScheduled(id, (scheduled) => {
        db.getTask(scheduled.name_id, (task) => {
            if (task.id != null) {
                $('#scheduled-details-title').html(`
                    ${task.name}
                    <span class="badge badge-status">${getStatusById(task.status)}</span>
                `)
                db.queryType(scheduled.type_id, (type) => {
                    if (type.name != null) {
                        $('#scheduled-details-title').append(`<span class="badge badge-type">${type.name}</span>`)
                    }
                })

                date = getDateStr(new Date())
                let days_left = calculateDays(date, scheduled.scheduled_date)

                $('#scheduled-detail-content').append(`
                    <div class="detail-block">
                        <div class="detail-item">
                            计划进行：${scheduled.scheduled_date ? scheduled.scheduled_date : ''}
                        </div>
                        <div class="divider"></div>
                        <div class="detail-item">
                            距离今天：${days_left} 天
                        </div>
                    </div>
                `)

                $('#scheduled-detail-content').append(`
                    <div style="display: flex; flex-direction: row; margin: 8px;">
                        <button type="button" class="btn btn-primary" onclick="loadEditScheduledDetails(db, ${scheduled.id}, ${index});" style="flex: 1; margin: 4px;">修改</button>
                        <button type="button" class="btn btn-danger" style="flex: 1; margin: 4px;"
                            data-toggle="modal" data-target="#deleteScheduledConfirm">删除</button>
                    </div>
                `)

                $('#scheduled-detail-content').append(`
                <div class="modal fade" id="deleteScheduledConfirm" tabindex="-1" role="dialog" aria-labelledby="deleteScheduledConfirmLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="deleteScheduledConfirmLabel">提示</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        确认删除计划吗
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="commitDeleteScheduledDetails(db, ${scheduled.id}, ${index})">删除</button>
                      </div>
                    </div>
                  </div>
                </div>
                `)

                $('#scheduled-detail-content').append(`
                <div class="modal fade" id="deleteScheduledFail" tabindex="-1" role="dialog" aria-labelledby="deleteScheduledFailLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="deleteScheduledFailLabel">提示</h5>
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
    })

}

function loadEditScheduledDetails(db, id, index) {
    $('#scheduled-details').css("display", "")
    $('#scheduled-detail-content').html(``)
    db.getScheduled(id, (scheduled) => {
        db.getTask(scheduled.name_id, (task) => {
            if (task.id != null) {
                $('#scheduled-details-title').html(`
                    ${task.name}
                    <span class="badge badge-status">${getStatusById(task.status)}</span>
                `)
                db.queryType(scheduled.type_id, (type) => {
                    if (type.name != null) {
                        $('#scheduled-details-title').append(`<span class="badge badge-type">${type.name}</span>`)
                    }
                })

                $('#scheduled-detail-content').html(`
                    <form style="margin: 8px;">

                        <div class="form-group">
                            <label for="edit-scheduled-date">计划日期</label>
                            <input class="form-control" id="edit-scheduled-date"
                                type="date" value="${scheduled.scheduled_date}">
                        </div>

                        <button type="button" class="btn btn-primary"
                            onclick="commitEditScheduledDetails(db, ${id}, ${index})">提交</button>
                        <img src="../../res/error.svg" id="scheduled-error" style="margin: 12px; display: none;">
                    </form>
                `)
            }
        })
    })
}

function commitEditScheduledDetails(db, id, index) {
    index = parseInt(index)
    id = parseInt(id)
    date = $('#edit-scheduled-date').val()

    if (date == null) {
        return
    }

    db.getScheduled(id, (scheduled) => {
        if (date != null) {
            scheduled.scheduled_date = date
        }

        db.updateScheduled(scheduled, (updated) => {
            if (updated) {
                loadScheduledItemDetails(db, id, null, index)
            } else {
                $('#scheduled-error').css("display", "")
            }
        })
    })
}

function commitDeleteScheduledDetails(db, id, index) {
    db.deleteScheduled(id, (updated) => {
        if (updated) {
            $('#scheduled-list li').eq(index).remove()
            $('#scheduled-details').css("display", "none")
        } else {
            $('#deleteScheduledFail').modal('show')
        }
    })
}

function finishScheduledItem(db, id, dom) {
    // 查询 id
    // 写入完成表
    // 从计划表删除
    db.getScheduled(id, (scheduled) => {
        completed_date = getDateStr(new Date())
        db.addCompleted(
            scheduled.name_id,
            scheduled.type_id,
            parseInt(scheduled.status),
            scheduled.scheduled_date,
            completed_date,
            (completed) => {
                if (completed != null) {
                    console.log('addComepeted callback')
                    db.getTask(completed.name_id, (task) => {
                        task.status = completed.status
                        if (completed.status == 1) {
                            task.first_date = completed.completed_date
                        }
                        task.last_date = completed.completed_date
                        if (completed.delay_days > 0) {
                            task.delayed_times = task.delayed_times ? task.delayed_times + 1 : 1
                        }

                        task.complete_times = task.complete_times ? task.complete_times + 1 : 1

                        task.next_date = ''
                        db.updateTask(task, (task) => {
                            console.log('task:' + task.name)
                        })
                        // db.updateTask(task, (newTask) => {
                        //     console.log('isUpdated:' + JSON.stringify(newTask))
                        // })
                    })
                    // 拿到父节点:
                    $(dom).parent().remove();
                }
            })
        db.deleteScheduled(scheduled.id)
    })
}

function hidescheduledItemDetails() {
    $('#scheduled-details').css("display", "none")
}
