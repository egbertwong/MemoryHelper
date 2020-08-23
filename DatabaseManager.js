const Dexie = require('dexie')

class DBManager {

    #db
    #dbName

    constructor(dbName) {
        this.#dbName = dbName
        this.#db = new Dexie(dbName)
        this.#db.version(1).stores({
            types: '++id, name',
            tasks: '++id, name, type, status, first_date, last_date, next_date, complete_times, delayed_times, rate',
            scheduled: '++id, name, type, status, scheduled_date',
            completed: '++id, name, type, status, scheduled_date, completed_date, rate'
        })
        console.log('db created')
        this.#db.open().then(result => {
            //打开成功后，将version存下来
            version = db.verno;
            console.log('version:' + version)
            resolve(db);
          })
        this.#db.types.put({name: "数学"}).then (function(){
            //
            // Then when data is stored, read from it
            //
            return db.types.get('数学')
        })
    }
}

module.exports = DBManager