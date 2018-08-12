import Persistence from "../Persistence";

const LS = window.localStorage;

class LocalStoragePersistence extends Persistence {
    constructor({ path }={}){
        super();
        this.path = path || "persistence";
        this.context = null;
    }

    at(context){
        const clone = new LocalStoragePersistence({ path : this.path});
        clone.context = context;
        return clone;
    }

    loadLS(){
        return JSON.parse(LS.getItem(this.path) || '{}');

    }

    async save(value, at){
        const previous = this.loadLS();
        LS.setItem(this.path,
            JSON.stringify({   ...previous, 
                [this.context] : {
                    ...previous[this.context],
                     [at]: value
                }
            })
        );
        return at;
    }

    async read(ref){
        const previous = this.loadLS();
        if(previous[this.context][ref] === undefined) return null;
        return previous[this.context][ref];
    }

    delete(ref){
        return this.save(undefined, ref);
    }
}

export default LocalStoragePersistence;