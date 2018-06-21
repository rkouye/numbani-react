import EntityManagerBuilder from '../EntityManagerBuilder';
import EntitySchemaBuilder from '../schema/EntitySchemaBuilder';
import Persistence from '../persistence/Persistence';
import Types from '../schema/types';
import expect, { createSpy } from 'expect';

describe("EntityRepo", ()=>{
    class MockPersistence extends Persistence {
        constructor(){
            super();
            this.cache = {};
        }
        
        at(name){
            if(this.cache[name] === undefined)
                this.cache[name] = {};
            return this.cache[name];
        }
    };
    
    it('saves', () =>{
        const mockPersistence = new MockPersistence();
        const ref = Symbol("Saved value reference");
        mockPersistence.at("user").save = createSpy().andReturn(Promise.resolve(ref));
    
        const em = new EntityManagerBuilder()
                    .withPersistenceProvider(mockPersistence)
                    .build();
        const userSchema = new EntitySchemaBuilder()
                    .addAttribute("name", Types.String.required())
                    .addAttribute("organization", Types.String)
                    .build();
    
        const entity = em.buildEntity("user", {schema : userSchema});
        return entity.save({name : "Paul", foo : "bar"}).then( testRef => {
            expect(testRef).toBe(ref);
            expect(mockPersistence.at("user").save.calls.length).toEqual(1);
            expect(mockPersistence.at("user").save).toHaveBeenCalledWith({name : "Paul", organization : undefined}, undefined);
        });
    });
    
    it('fail to save with validation error', (done) =>{
        const mockPersistence = new MockPersistence();
        const ref = Symbol("Saved value reference");
        mockPersistence.at("user").save = createSpy().andReturn(Promise.resolve(ref));
    
        const em = new EntityManagerBuilder()
                    .withPersistenceProvider(mockPersistence)
                    .build();
        const userSchema = new EntitySchemaBuilder()
                    .addAttribute("name", Types.String.required())
                    .addAttribute("organization", Types.String.required())
                    .build();
    
        const entity = em.buildEntity("user", {schema : userSchema});
        entity.save({name : "Paul", organization : null}).catch( error => {
            expect(error instanceof Error).toBe(true);
            expect(error.validationErrorsCount).toBe(1);
            expect(error.validationErrors.name.length).toBe(0);
            expect(error.validationErrors.organization.length).toBe(1);
            expect(error.validationErrors.organization[0].message).toBe("validations.required");
            done();
        });
    });
    
    it('fails to save save when persistence is down', (done) =>{
        const mockPersistence = new MockPersistence();
        const error = new Error("Connection failure");
        mockPersistence.at("user").save = createSpy().andCall(() => Promise.reject(error));
    
        const em = new EntityManagerBuilder()
                    .withPersistenceProvider(mockPersistence)
                    .build();
        const userSchema = new EntitySchemaBuilder()
                    .addAttribute("name", Types.String.required())
                    .addAttribute("organization", Types.String)
                    .build();
    
        const entity = em.buildEntity("user", {schema : userSchema});
        entity.save({name : "Paul"}).catch(catchedError => {
            expect(catchedError).toBe(error);
            done();
        });
    });
});