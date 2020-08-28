function loadCompletedInterface() {
    $('#v-pills-completed').html(`
    <div style="display: flex; flex-direction: row;">
        <div class="page">
            <div id="content-head">
                <div class="head-title">Completed</div>
            </div>

            <div id="table-filter" style="margin-left: 16px; margin-right: 16px; height: 48px;">
                <div class="dropdown" id="myDropdown"
                    style="float:right; margin-top: 16px; margin-bottom: 8px;">
                    <button class="btn btn-secondary btn-sm dropdown-toggle" type="button"
                        id="completedFilterButton" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                        全部
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" id="completed-filter"
                        aria-labelledby="completedFilterButton">
                    </div>
                </div>
            </div>

            <div class="table-area noselect" id="completed-list">

            </div>
        </div>
        <div class="div-details noselect" id="completed-details" style="display: none;">
            <p class="detail-name" id="completed-details-title"></p>
            <div class="divider"></div>
            <div class="detail-content" id="completed-detail-content"></div>
            <div class="divider"></div>
            <div class="detail-foot">
                <img src="./res/close.svg" style="margin: 12px;" onclick="hideCompletedItemDetails()">
            </div>
        </div>
    </div>
    `)
}

function initCompletedPage(db) {
    console.log('initCompletedPage')
    loadCompletedInterface()
    loadCompletedFilter(db)
    loadCompletedList(db, 0)
}

function loadCompletedFilter(db) {
    $('#completed-filter').html(`<a class="dropdown-item" href="javascript:loadCompletedList(db, 0)">全部</a>`)
    db.getAllTypes((type) => {
        $('#completed-filter').append(`
            <a class="dropdown-item" href="javascript:loadCompletedList(db, ${type.id})">${type.name}</a>
        `)
    })
}

function addCompletedListItem(completed_id, task_name, type_name) {
    $('#completed-list').append(`
        <div class="div-list-item" onclick="loadCompletedItemDetails(db, ${completed_id})">
            <img src="./res/radio-true.svg" style="align-items: center;"
                onclick="event.cancelBubble = true">
            <p style="margin-left: 16px; height: 45px; line-height: 45px;">
                ${task_name}
                <span class="badge badge-type">${type_name}</span>
            </p>
        </div>
    `)
}

function loadCompletedList(db, cur_type) {
    $('#completed-list').html(``)

    db.loadCompleteds((completed) => {
        if (cur_type == 0 || cur_type == completed.type_id) {
            db.queryType(completed.type_id, (type) => {
                db.getTask(completed.name_id, (task) => {
                    addCompletedListItem(completed.id, task.name, type.name)
                })
            })
        }
    })
}

function loadCompletedItemDetails(db, id) {
    $('#completed-details').css("display", "")
    $('#completed-detail-content').html(``)
    db.getCompleted(id, (completed) => {
        db.getTask(completed.name_id, (task) => {
            if (task.id != null) {
                $('#completed-details-title').html(`
                    ${task.name}
                    <span class="badge badge-status">${getStatusById(task.status)}</span>
                `)
                db.queryType(completed.type_id, (type) => {
                    if (type.name != null) {
                        $('#completed-details-title').append(`<span class="badge badge-type">${type.name}</span>`)
                    }
                })

                date = getDateStr(new Date())
                let days_left = calculateDays(completed.completed_date, date)

                $('#completed-detail-content').append(`
                    <div class="detail-block">
                        <div class="detail-item">
                            计划日期：${completed.scheduled_date ? completed.scheduled_date : ''}
                        </div>
                        <div class="divider"></div>
                        <div class="detail-item">
                            完成日期：${completed.completed_date ? completed.completed_date : ''}
                        </div>
                        <div class="divider"></div>
                        <div class="detail-item">
                            延迟天数：${completed.delay_days ? completed.delay_days : 0} 天
                        </div>
                        <div class="divider"></div>
                        <div class="detail-item">
                            效果评级：${completed.rate ? completed.rate : ''}
                        </div>
                    </div>
                `)
            }

        })
    })
}