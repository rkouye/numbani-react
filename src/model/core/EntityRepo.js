/**
 * @export
 * @class EntityRepo
 */
class EntityRepo {
    /**
     * Creates an instance of EntityRepo.
     * @param {import("../schema/EntitySchemaBuilder.js").EntitySchema} entitySchema 
     * @param {import("../persistence/Persistence.js").default} persistence 
     * @memberof EntityRepo
     */
    constructor(entitySchema, persistence){
        this.persistence = persistence;
        this.schema = entitySchema;
    }

    save(value, at){
        //TODO: Emit pre-save event
        //TODO: Emit pre-save&pre-validation event
       
        // Perform attributes validation
        /** @type {Object.<string, Array.<import("../schema/types/ValidationError").default>} */
        let validationErrors = {};
        // --Type validation
        for (let attribute in this.schema.typesMap){
            validationErrors[attribute] = [].concat(
                this.schema.typesMap[attribute].getValidationErrors(value[attribute])
            );
        }
        //-- TODO: Cross field validation

        let validationErrorsCount = 0;
        for (let attribute in validationErrors){
            validationErrorsCount += validationErrors[attribute].length;
        }
        if(validationErrorsCount > 0){
            //TODO: Emit on-validation-failure
            const error = new Error('Invalid value');
            error.validationErrors = validationErrors;
            error.validationErrorsCount = validationErrorsCount;
            return Promise.reject(error);
        }
        //TODO: Emit pre-save&post-validation event
        
        const final = {};
        for (let attribute in this.schema.typesMap){
            final[attribute] = value[attribute];
        }
        // Persist in database and return reference
        return this.persistence.save(final,at).then((ref)=>{
            ////TODO: Emit post-save
            return ref;
        });
    }

    read(ref){
        return this.persistence.read(ref);
        //TODO: Emit post read
    }


}

export default  EntityRepo;