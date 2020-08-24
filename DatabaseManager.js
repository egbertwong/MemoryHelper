const Dexie = require('dexie')

class DBManager {

    db
    #dbName

    constructor(dbName) {
        this.#dbName = dbName
        this.db = new Dexie(dbName)
        this.db.version(1).stores({
            types: '++id, name',
            tasks: '++id, name, type, status, first_date, last_date, next_date, complete_times, delayed_times, rate',
            scheduled: '++id, name, type, status, scheduled_date',
            completed: '++id, name, type, status, scheduled_date, completed_date, rate'
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
                alert(`Added type with id ${id}`);
            }

            // Query:
            let myTypes = yield this.db.types.toArray();

            // Show result:
            alert("My types: " + JSON.stringify(myTypes));

        }).catch(e => {
            console.error(e.stack);
        });
    }

    deleteTypes(name) {

    }

    getAllTypes(callback) {
        let myTypes

        this.db.transaction('r', this.db.types, function* () {
            myTypes = yield this.db.types.toArray();

            callback(myTypes)
        }).catch(e => {
            console.error(e.stack);
        });

        // alert("My types: " + JSON.stringify(myTypes));
        // return myTypes
    }

    queryType(id, callback) {
        this.db.transaction('r', this.db.types, function* () {
            // Query:
            myTypes = yield this.db.types
            .where('id').equals(id)
            .toArray();

            callback(myTypes)
        }).catch(e => {
            console.error(e.stack);
        });
    }
}

module.exports = DBManager