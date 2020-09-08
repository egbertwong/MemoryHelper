function loadTodayInterface() {
    $('#v-pills-today').html(`
    <div style="display: flex; flex-direction: row;">
        <div class="page">
            <div id="content-head">
                <div class="head-title">Today</div>
                <div class="head-date" id="today-date"></div>
            </div>

            <div id="table-filter" style="margin-right: 16px; height: 48px;">
                <div class="dropdown" id="myDropdown"
                    style="float:right; margin-top: 16px; margin-bottom: 8px;">
                    <button class="btn btn-secondary btn-sm dropdown-toggle" type="button"
                        id="todayDropdownButton" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                        全部
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" id="today-filter"
                        aria-labelledby="dropdownMenuButton">
                    </div>
                </div>
            </div>

            <div class="table-area noselect" id="today-list">
            </div>
        </div>
        <div class="div-details noselect" id="today-details" style="display: none;">
            <p class="detail-name" id="today-details-title"></p>
            <div class="divider"></div>
            <div class="detail-content" id="today-detail-content"></div>
            <div class="divider"></div>
            <div class="detail-foot">
                <img src="../../res/close.svg" style="margin: 12px;" onclick="hideTodayItemDetails()">
            </div>
        </div>
    </div>
    `)
    $('#today-date').html(getTodayDate())


}

/**
 * Call this function at the beginning of the page to load the today interface.
 */
function initTodayPage(db) {
    loadTodayInterface()
    loadTodayFilter(db)
    loadTodayList(db, 0)
}

function loadTodayFilter(db) {
    $('#today-filter').html(`<a class="dropdown-item" href="javascript:onClickTodayDropdown(db, 0, '全部')">全部</a>`)
    db.getAllTypes((type) => {
        $('#today-filter').append(`<a class="dropdown-item" href="javascript:onClickTodayDropdown(db, ${type.id}, '${type.name}')">${type.name}</a>`)
    })
}

function onClickTodayDropdown(db, id, name) {
    $('#todayDropdownButton').html(name)
    loadTodayList(db, id)
}

function addTodayListItem(scheduled_id, task_name, type_name) {
    $('#today-list').append(`
        <div class="div-list-item" onclick="loadTodayItemDetails(db, ${scheduled_id})">
            <img src="../../res/radio-false.svg" style="align-items: center;"
                onclick="finishTodayItem(db, ${scheduled_id}, this); event.cancelBubble = true">
            <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                ${task_name}
                <span class="badge badge-type">${type_name}</span>
            </p>
        </div>
    `)
}

/**
 * Call this function when switched in Today page.
 * @param {DBManager} db 
 * @param {type_id} cur_type Filter out today's tasks from the scheduled list
 */
function loadTodayList(db, cur_type) {
    $('#today-list').html(``)
    console.log('cur_type:' + cur_type)
    db.loadScheduleds((scheduled) => {
        console.log('scheduled.scheduled_date:' + scheduled.scheduled_date)
        delay_days = calculateDays(getDateStr(new Date()), scheduled.scheduled_date)
        console.log('delay_days:' + delay_days)
        if ((cur_type == 0 || cur_type == scheduled.type_id) && delay_days <= 0) {
            db.queryType(scheduled.type_id, (type) => {
                db.getTask(scheduled.name_id, (task) => {
                    addTodayListItem(scheduled.id, task.name, type.name)
                })
            })
        }
    })
}

/**
 * Open detail column and show the details of the clicking item.
 * @param {DBManager} db 
 * @param {item id} id 
 */
function loadTodayItemDetails(db, id) {
    $('#today-details').css("display", "")
    $('#today-detail-content').html(``)
    db.getScheduled(id, (scheduled) => {
        db.getTask(scheduled.name_id, (task) => {
            if (task.id != null) {
                $('#today-details-title').html(`
                    ${task.name}
                    <span class="badge badge-status">${getStatusById(task.status)}</span>
                `)
                db.queryType(scheduled.type_id, (type) => {
                    if (type.name != null) {
                        $('#today-details-title').append(`<span class="badge badge-type">${type.name}</span>`)
                    }
                })

                date = getDateStr(new Date())
                let days_left = calculateDays(date, scheduled.scheduled_date)

                $('#today-detail-content').append(`
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
            }

        })
    })
}

/**
 * Remove the finishing task from page and move task in the database.
 * @param {int} id Id of the task
 */
function finishTodayItem(db, id, dom) {
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

function hideTodayItemDetails() {
    $('#today-details').css("display", "none")
}