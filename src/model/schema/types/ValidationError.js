class ValidationError {
    /**
     *Creates an instance of ValidationError.
     * @param {String} message
     * @param {*} info
     * @memberof ValidationError
     */
    constructor(message, info){
        this.message = message;
        this.info = info;
    }
}

export default ValidationError;