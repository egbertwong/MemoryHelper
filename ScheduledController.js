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
        db.queryType(task.type_id, (type) => {
            if (cur_type == 0 || cur_type == type.id) {
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

function loadAddScheduledDetails(db) {
    $('#scheduled-details').css("display", "")
    $('#scheduled-details-title').html('添加安排')
    $('#scheduled-detail-content').html(`
        `)
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
