/**
 * @export
 * @class EntitySchema
 */
export class EntitySchema {
    /**
     * Creates an instance of EntitySchema.
     * @param {Object.<string, import("./types/Type.js").Type>} typesMap 
     * @param {any} validations 
     * @memberof EntitySchema
     */
    constructor(typesMap, validations ){
        this.typesMap = typesMap;
        this.validations = validations;
    }
}

const m_checkInstructions = Symbol("Method checkInstructions");
const m_apply = Symbol("Method apply");
const f_instructions = Symbol("Field instructions");

export default class EntitySchemaBuilder {
    constructor(){
        this[f_instructions] = {
            typesMap : {}
        }
    }

    /**
     * 
     * 
     * @param {any} attribute 
     * @returns {EntitySchemaBuilder}
     * @memberof EntitySchemaBuilder
     */
    addAttribute(name, type){
        
        if(this[f_instructions].typesMap[name] !== undefined)
            throw new Error("There is already an attribute with this name");
        return this[m_apply](builder => {
            builder[f_instructions].typesMap[name] = type;
        });
    }

    /**
     * @param {Function} change 
     * @returns {EntitySchemaBuilder}
     * @memberof EntitySchemaBuilder
     */
    [m_apply](change){
        //For immutability
        const newBuilder = new EntitySchemaBuilder();
        newBuilder[f_instructions].typesMap = {...this[f_instructions].typesMap};
        change(newBuilder);
        return newBuilder;
    }

    [m_checkInstructions](){
        
    }
    
    /**
     * 
     * 
     * @returns {EntitySchema}
     * @memberof EntitySchemaBuilder
     */
    build(){
        this[m_checkInstructions]();
        return new EntitySchema(this[f_instructions].typesMap);
    }
}