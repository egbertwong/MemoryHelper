const Dexie = require('dexie')

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
            completed: '++id, name_id, type_id, status, scheduled_date, completed_date, rate'
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
    addTypes(name) {
        this.db.transaction('rw', this.db.types, function* () {

            // Make sure we have something in DB:
            if ((yield this.db.types.where('name').equals(name).count()) === 0) {
                let id = yield this.db.types.add({ name: name });
                // alert(`Added type with id ${id}`);
            }

            // Query:
            let myTypes = yield this.db.types.toArray();

            // Show result:
            // alert("My types: " + JSON.stringify(myTypes));

        }).catch(e => {
            console.error(e.stack);
        });
    }

    updateTypes(oldName, newName) {

    }

    deleteTypes(name) {

    }

    getAllTypes(callback) {
        this.db.transaction('r', this.db.types, function* () {
            this.db.types.each(function (type) {
                callback(type)
            })
        }).catch(e => {
            console.error(e.stack);
        });
    }

    queryType(id, callback) {
        this.db.transaction('r', this.db.types, this.db.tasks, function* () {
            // Query:
            let myType = yield this.db.types.get(id)

            callback(myType)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    /******************************* functions of tasks *******************************/
    addTask(name, type_id, callback) {
        this.db.transaction('rw', this.db.tasks, function* () {
            // Make sure we have something in DB:
            if ((yield this.db.tasks.where('name').equals(name).count()) === 0) {
                let id = yield this.db.tasks.add({ name: name, type_id: type_id, status: 0 });
                alert(`Added tasks with id ${id}`);
            }

            // Query:
            let myTasks = yield this.db.tasks
            .where('name').equals(name)
            .toArray();

            callback(myTasks)
        }).catch(e => {
            console.error(e.stack);
        });
    }

    updateTask(id, name, style, status, callback) {

    }

    async getTasks(callback) {
        let tasks = await this.db.tasks.toArray()
        return tasks
    }

    loadTasks(callback) {
        // this.db.tasks.each((task) => {
        //     console.log('loadTasks:' + task.name)
        //     callback(task)
        // })
        console.log('loadTasks')
        this.db.transaction('r', this.db.tasks, this.db.types, function () {
            // // Make sure we have something in DB:
            // if ((yield this.db.tasks.where('name').equals(name).count()) === 0) {
            //     let id = yield this.db.tasks.add({ name: name, type_id: type_id, status: 0 });
            //     alert(`Added tasks with id ${id}`);
            // }
            console.log('loadTasks transaction')
            this.db.tasks.each(function (task, db) {
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
    addScheduled(name, type, status, scheduled_date) {

    }

    deleteScheduled(id) {

    }

    /******************************* functions of completed *******************************/
    addCompleted(name, type, status, scheduled_date, completed_date, rate) {
        
    }
}

module.exports = DBManager