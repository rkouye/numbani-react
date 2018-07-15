import Persistence from "../Persistence";

class InMemoryPersistence extends Persistence {
    constructor({ initialDB, logger }={}){
        super();
        this.logger = logger;
        this.db = initialDB || {};
    }

    at(context){
        this.db[context] = this.db[context] || {};
        const clone = new InMemoryPersistence({initialDB : this.db[context], logger : this.logger});
        return clone;
    }

    save(value, at){
        this.db[at] = value;
        this.logger.log(`${this} : Saved ${value} at ${at}`);
        return Promise.resolve(at);
    }

    async read(ref){
        if(this.db[ref] === undefined) throw new Error("Missing value");
        return this.db[ref];
    }

    delete(ref){
        delete this.db[ref];
        this.logger.log(`${this} : Deleted value at ${ref}`);
        return Promise.resolve();
    }
}

export default InMemoryPersistence;