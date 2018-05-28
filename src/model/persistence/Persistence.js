class Persistence {
    /**
     * 
     * @param {string} context 
     * @returns {Persistence}
     */
    at(context){
        throw new Error("Not implemented");
    }
    /**
     * 
     * 
     * @param {any} value 
     * @param {any} [at] 
     * @memberof Persistence
     */
    save(value, at){
        throw new Error("Not implemented");
    }

    read(ref){
        throw new Error("Not implemented");
    }

    delete(ref){
        throw new Error("Not implemented");
    }

}

export default Persistence;