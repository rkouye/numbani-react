import Persitence from "./persistence/Persistence"
import {EntitySchema} from "./schema/EntitySchemaBuilder"
import EntityRepo from "./core/EntityRepo"

const m_getEntityRepo = Symbol("Method getEntityRepo");
const m_setEntityRepo = Symbol("Method setEntityRepo");
const f_EM_private = Symbol("Field private for Entity Manager");

export class EntityManager {
    
    constructor(persistenceProvider){
       this[f_EM_private] = {
           persistenceProvider,
           entitiesReposMap : {}
       };
    }

    /**
     * Build an entity that will be managed by this manager;
     * Returns an entity repository object, to interact with this entity.
     * @param {string} name - Unique name of this entity in the mananger
     * @param {Object} options
     * @param {EntitySchema} options.schema 
     * @returns {EntityRepo}
     * @memberof EntityManager
     */
    buildEntity(name, {schema, behaviours}){
        if(!(schema instanceof EntitySchema))
            throw new Error("entitySchema isn't an instance of class numbani/model/EntitySchema");

        if(this[m_getEntityRepo](name) !== undefined)
            throw new Error("An entity have already been registered with this name");

        this[m_setEntityRepo](name , new EntityRepo(schema, this[f_EM_private].persistenceProvider.at(name)));

        return this[m_getEntityRepo](name);
    }

    [m_setEntityRepo](name, repo){
        this[f_EM_private].entitiesReposMap[name] = repo;
    }

    [m_getEntityRepo](name){
        return this[f_EM_private].entitiesReposMap[name];
    }
}

const m_checkInstructions = Symbol("Method checkInstructions");
const m_apply = Symbol("Method apply");
const f_instructions = Symbol("Field instructions");

export default class EntityManagerBuilder {
    constructor(){
        this[f_instructions] = {
            persistenceProvider : null
        }
    }

    /**
     * 
     * 
     * @param {Persitence} provider 
     * @returns {EntityManagerBuilder}
     * @memberof EntityManagerBuilder
     */
    withPersistenceProvider(provider){
        
        if (!(provider instanceof Persitence)) 
            throw new Error("Provider isn't an instance of class numbani/model/persistence/Persistence");
        
        return this[m_apply](builder => {
            builder[f_instructions].persistenceProvider = provider;
        });
    }

    /**
     * 
     * 
     * @param {Function} change 
     * @returns {EntityManagerBuilder}
     * @memberof EntityManagerBuilder
     */
    [m_apply](change){
        //For immutability
        const newBuilder = new EntityManagerBuilder();
        newBuilder[f_instructions].persistenceProvider = this[f_instructions].persistenceProvider;
        change(newBuilder);
        return newBuilder;
    }

    [m_checkInstructions](){
        if (this[f_instructions].persistenceProvider === null)
        throw new Error("Persitence provider is required");
    }

    build(){
        this[m_checkInstructions]();
        return new EntityManager(this[f_instructions].persistenceProvider);
    }
}