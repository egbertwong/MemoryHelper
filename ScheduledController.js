function loadScheduledInterface() {
    html = ``
}

function initScheduledPage(db) {
    console.log('initScheduledPage')
    loadScheduledInterface()
    loadScheduledFilter(db)
    loadScheduledList(db, 0)
}

function loadScheduledFilter(db) {
    $('#scheduled-filter').html(`<a class="dropdown-item" href="javascript:loadScheduledList(db, 0)">全部</a>`)
    db.getAllTypes((type) => {
        $('#scheduled-filter').append(`
            <a class="dropdown-item" href="javascript:loadScheduledList(db, ${type.id})">${type.name}</a>
        `)
    })
}

function loadScheduledList(db, cur_type) {
    $('#scheduled-list').html(``)

    db.loadScheduleds((scheduled) => {
        if (cur_type == 0 || cur_type == scheduled.type_id) {
            db.queryType(scheduled.type_id, (type) => {
                db.getTask(scheduled.name_id, (task) => {
                    $('#scheduled-list').append(`
                        <div class="div-list-item" onclick="loadScheduledItemDetails(db, ${scheduled.id})">
                            <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                                ${task.name}
                                <span class="badge badge-type">${type.name}</span>
                            </p>
                        </div>
                    `)
                })
            })
        }
        db.queryType(scheduled.type_id, (type) => {
            if (cur_type == 0 || cur_type == scheduled.type_id) {
                db.getTask(scheduled.name_id, (task) => {
                    $('#scheduled-list').append(`
                        <div class="div-list-item" onclick="loadScheduledItemDetails(db, ${scheduled.id})">
                            <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                                ${task.name}
                                <span class="badge badge-type">${type.name}</span>
                            </p>
                        </div>
                    `)
                })
            }

        })
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
        loadAddScheduledNamesByType(db, $('#add-scheduled-choose-type').val())
    })
}

function loadAddScheduledNamesByType(db, cur_type) {
    $('#add-scheduled-choose-task').html(``)
    isFirst_Name = true
    db.loadTasks((task) => {
        console.log('name:' + task.name + ' type:' + task.type_id)
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
        loadAddScheduledStatusByTask(db, $('#add-scheduled-choose-task').val())
    })
}

function loadAddScheduledStatusByTask(db, task_id) {
    let cur_task_id = parseInt(task_id, 10)
    console.log('taskid:' + cur_task_id)
    $('#add-scheduled-status').html(``)
    db.getTask(cur_task_id, (task) => {
        console.log('status:' + task.status)
        $('#add-scheduled-status').html(`
            <option value=${task.status}>${getStatusById(task.status)}</option>
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
        </form>
    `)
    loadAddScheduledTypes(db)
}

function loadScheduledItemDetails(db, id) {
    $('#scheduled-details').css("display", "")

}

function commitAddScheduledDetails(db) {
    $('#scheduled-details').css("display", "")
}

function hidescheduledItemDetails() {
    $('#scheduled-details').css("display", "none")
}
