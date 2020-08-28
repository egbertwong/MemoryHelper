const Dexie = require('dexie')
const { contains } = require('jquery')

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
            types: '++id, name',
            tasks: '++id, name, type_id, status, first_date, last_date, next_date, complete_times, delayed_times, rate',
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
        this.db.transaction('rw', this.db.types, function* () {

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

    updateTypes(oldName, newName) {

    }

    deleteTypes(name) {

    }

    getAllTypes(callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, function* () {
            this.db.types.each(function (type) {
                callback(type)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    queryType(id, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, function* () {
            // Query:
            let myType = yield this.db.types.get(id)

            callback(myType)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    /******************************* functions of tasks *******************************/
    addTask(name, type_id, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, function* () {
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
        this.db.transaction('rw', this.db.types, this.db.tasks, function* () {
            this.db.tasks.update(task.id, task).then(function (updated) {
                console.log('isUpdated:' + updated)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    testupdateTask(task, callback) {
        this.db.transaction('rw', this.db.types, this.db.tasks, function* () {
            this.db.tasks.update(1, task).then(function (updated) {
                console.log('isUpdated:' + updated)
                // let myTasks = yield this.db.tasks.get(1)
                // callback(myTasks)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    getTask(id, callback) {
        this.db.transaction('rw', this.db.tasks, this.db.types, function* () {
            let myTask = yield this.db.tasks.get(id)
            console.log('status:' + myTask)
            callback(myTask)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    loadTasks(callback) {
        // this.db.tasks.each((task) => {
        //     console.log('loadTasks:' + task.name)
        //     callback(task)
        // })
        console.log('loadTasks')
        this.db.transaction('rw', this.db.tasks, this.db.types, function () {
            // // Make sure we have something in DB:
            // if ((yield this.db.tasks.where('name').equals(name).count()) === 0) {
            //     let id = yield this.db.tasks.add({ name: name, type_id: type_id, status: 0 });
            //     alert(`Added tasks with id ${id}`);
            // }
            console.log('loadTasks transaction')
            this.db.tasks.each(function (task) {
                console.log('loadTasks each')
                callback(task)
                // let type = db.types.where('id').equals(task.type_id)
                // console.log('loadTasks111:' + type.name)
                // if (type != null) {
                //     task.type_id = type.name
                // }
                // console.log('loadTasks:' + task)
                // callback(task)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    /******************************* functions of scheduled *******************************/
    addScheduled(name_id, type_id, status, scheduled_date, callback) {
        this.db.transaction('rw', this.db.scheduled, this.db.tasks, this.db.types, function* () {
            if ((yield this.db.scheduled.where('name_id').equals(name_id).count()) === 0) {
                let id = yield this.db.scheduled.add({
                    name_id: name_id,
                    type_id: type_id,
                    status: status,
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

    deleteScheduled(id, callback) {
        console.log('deleta id:' + id)
        id = parseInt(id)
        // this.db.transaction('rw', this.db.tasks, this.db.types, this.db.scheduled, function () {
        //     this.db.scheduled.where(indexId).equals(id).delete()
        // }).catch(e => {
        //     console.error(e.stack);
        // });
        this.db.scheduled.where('id').equals(id).delete()
        // this.db.scheduled.delete(id)
    }

    loadScheduleds(callback) {
        this.db.transaction('rw', this.db.tasks, this.db.types, this.db.scheduled, function () {
            this.db.scheduled.each(function (scheduled) {
                callback(scheduled)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    getScheduled(id, callback) {
        this.db.transaction('rw', this.db.completed, this.db.tasks, this.db.types, this.db.scheduled, function* () {
            let scheduled = yield this.db.scheduled.get(id)
            callback(scheduled)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    /******************************* functions of completed *******************************/
    addCompleted(name_id, type_id, status, scheduled_date, completed_date, callback) {
        this.db.transaction('rw', this.db.completed, this.db.scheduled, this.db.tasks, this.db.types, function* () {
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
}

module.exports = DBManager