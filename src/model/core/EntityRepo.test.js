import EntityManagerBuilder from '../EntityManagerBuilder';
import EntitySchemaBuilder from '../schema/EntitySchemaBuilder';
import Persistence from '../persistence/Persistence';
import Types from '../schema/types';
import i18next from "i18next";

class MockPersistence extends Persistence {
    constructor(){
        super();
        this.cache = {};
    }
    
    at(name){
        if(this.cache[name] === undefined)
            this.cache[name] = {
                save : jest.fn()
            };
        return this.cache[name];
    }
};

beforeAll(()=>{
    return i18next.init({lng: 'cimode'});
});

test('saves', () =>{
    const mockPersistence = new MockPersistence();
    const ref = Symbol("Saved value reference");
    mockPersistence.at("user").save.mockReturnValueOnce(Promise.resolve(ref));

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
        expect(mockPersistence.at("user").save).toHaveBeenCalledTimes(1);
        expect(mockPersistence.at("user").save).toHaveBeenCalledWith({name : "Paul"}, undefined);
    });
});

test('fail to save with validation error', () =>{
    const mockPersistence = new MockPersistence();
    const ref = Symbol("Saved value reference");
    mockPersistence.at("user").save.mockReturnValueOnce(Promise.resolve(ref));

    const em = new EntityManagerBuilder()
                .withPersistenceProvider(mockPersistence)
                .build();
    const userSchema = new EntitySchemaBuilder()
                .addAttribute("name", Types.String.required())
                .addAttribute("organization", Types.String.required())
                .build();

    const entity = em.buildEntity("user", {schema : userSchema});
    expect.assertions(5);
    return entity.save({name : "Paul", organization : null}).catch( error => {
        expect(error instanceof Error).toBe(true);
        expect(error.validationErrorsCount).toBe(1);
        expect(error.validationErrors.name.length).toBe(0);
        expect(error.validationErrors.organization.length).toBe(1);
        expect(error.validationErrors.organization[0].message).toBe("validations.required");
    });
});

test('fails to save save when persistence is down', () =>{
    const mockPersistence = new MockPersistence();
    const error = new Error("Connection failure");
    mockPersistence.at("user").save = jest.fn(() => Promise.reject(error));

    const em = new EntityManagerBuilder()
                .withPersistenceProvider(mockPersistence)
                .build();
    const userSchema = new EntitySchemaBuilder()
                .addAttribute("name", Types.String.required())
                .addAttribute("organization", Types.String)
                .build();

    const entity = em.buildEntity("user", {schema : userSchema});
    expect.assertions(1);
    return entity.save({name : "Paul"}).catch(catchedError => {
        expect(catchedError).toBe(error);
    });
});