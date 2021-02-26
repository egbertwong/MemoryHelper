const Dexie = require('dexie')
const { contains } = require('jquery')
const { call } = require('sql.js')

/**
 * Database manager. Pack my function of database.
 */
class DBManager {

    db
    #dbName

    constructor(dbName) {
        this.#dbName = dbName
        this.db = new Dexie(dbName)
        this.db.version(1).stores({
            types: '++id, name, inValid',
            tasks: '++id, name, type_id, status, first_date, last_date, next_date, complete_times, delayed_times, rate, inValid',
            scheduled: '++id, name_id, type_id, status, scheduled_date',
            completed: '++id, name_id, type_id, status, scheduled_date, completed_date, delay_days, rate'
        })
        console.log('db created')
        this.db.open().then(result => {
            //打开成功后，将version存下来
            version = this.db.verno;
            console.log('version:' + version)
            resolve(this.db);
        })

        // return this.db
        // this.#db.types.put({name: "数学"}).then (function(){
        //     //
        //     // Then when data is stored, read from it
        //     //
        //     return db.types.get('数学')
        // })
    }

    /************************ functions of types *************************/
    addType(name, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function* () {

            if ((yield this.db.types.where('name').equals(name).count()) === 0) {
                let id = yield this.db.types.add({ name: name });
                let myType = yield this.db.types.get(id)

                callback(myType)
            } else (
                callback(null)
            )

        }).catch(e => {
            console.error(e.stack);
        });
    }

    updateTypes(id, newName, callback) {
        id = parseInt(id)

        this.db.types.update(id, { name: newName }).then((updated) => {
            callback(updated)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    inValidTypes(id, callback) {
        id = parseInt(id)

        this.db.types.update(id, { inValid: 0 }).then((updated) => {
            callback(updated)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    getAllTypes(callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function* () {
            this.db.types.each(function (type) {
                if (type.inValid != null) {
                    return
                }

                callback(type)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    queryType(id, callback) {
        id = parseInt(id)
        this.db.types.get(id, (type) => {
            // console.log('type:' + )
            callback(type)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    /******************************* functions of tasks *******************************/
    addTask(name, type_id, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function* () {
            // Make sure we have something in DB:
            if ((yield this.db.tasks.where('name').equals(name).count()) === 0) {
                let id = yield this.db.tasks.add({
                    name: name,
                    type_id: type_id,
                    status: 0,
                    complete_times: 0,
                    delayed_times: 0
                });
                console.log(`Added tasks with id ${id}`);
                let myTasks = yield this.db.tasks.get(id)

                callback(myTasks)
            } else {
                callback(null)
            }
        }).catch(e => {
            console.error(e.stack);
        });
    }

    updateTask(task, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function* () {
            this.db.tasks.update(task.id, task).then(function (updated) {
                callback(updated)
                console.log('isUpdated:' + updated)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    inValidTask(id, callback) {
        id = parseInt(id)

        this.db.tasks.update(id, { inValid: 0 }).then(function (updated) {
            callback(updated)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    getTask(id, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function* () {
            let myTask = yield this.db.tasks.get(id)
            callback(myTask)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    loadTasks(callback) {
        console.log('loadTasks')
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function () {

            console.log('loadTasks transaction')
            this.db.tasks.each(function (task) {
                console.log('loadTasks each')
                if (task.inValid == 0) {
                    return;
                }
                callback(task)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    /******************************* functions of scheduled *******************************/
    addScheduled(name_id, type_id, status, scheduled_date, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function* () {
            if ((yield this.db.scheduled.where('name_id').equals(name_id).count()) === 0) {
                let id = yield this.db.scheduled.add({
                    name_id: name_id,
                    type_id: type_id,
                    status: parseInt(status),
                    scheduled_date: scheduled_date
                });
                let myScheduled = yield this.db.scheduled.get(id)

                callback(myScheduled)
            } else (
                callback(null)
            )
        }).catch(e => {
            console.error(e.stack);
        });
    }

    updateScheduled(scheduled, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function* () {
            this.db.scheduled.update(scheduled.id, scheduled).then(function (updated) {
                callback(updated)
                console.log('isUpdated:' + updated)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    deleteScheduled(id, callback) {
        console.log('deleta id:' + id)
        id = parseInt(id)

        this.db.scheduled.where('id').equals(id).delete()
            .then(function (deleteCount) {
                console.log("Deleted " + deleteCount + " objects");
                if (deleteCount > 0) {
                    callback(true)
                } else {
                    callback(false)
                }
            });
    }

    loadScheduleds(callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function () {
            this.db.scheduled.each(function (scheduled) {
                callback(scheduled)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    getScheduled(id, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function* () {
            let scheduled = yield this.db.scheduled.get(id)
            callback(scheduled)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    /******************************* functions of completed *******************************/
    addCompleted(name_id, type_id, status, scheduled_date, completed_date, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function* () {
            let id = yield this.db.completed.add({
                name_id: name_id,
                type_id: type_id,
                status: status,
                scheduled_date: scheduled_date,
                completed_date: completed_date,
                delay_days: calculateDays(scheduled_date, completed_date)
            });
            let myCompleted = yield this.db.completed.get(id)

            callback(myCompleted)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    loadCompleteds(callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function () {
            this.db.completed.each(function (completed) {
                callback(completed)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    getCompleted(id, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, this.db.scheduled, this.db.completed, function* () {
            let completed = yield this.db.completed.get(id)
            callback(completed)
        }).catch(e => {
            console.error(e.stack);
        });
    }
}

module.exports = DBManager