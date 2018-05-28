import EntityManagerBuilder from './EntityManagerBuilder';
import Persistence from './persistence/Persistence';
import expect from 'expect';

describe("EntityManagerBuilder", ()=>{
    it('should prevent invalid persistence provider', ()=>{
        expect(()=>{
            new EntityManagerBuilder().withPersistenceProvider(null);
        }).toThrow();
    });
    
    it('hides implementation details', ()=>{
        expect(new EntityManagerBuilder().instructions).toBe(undefined);
    });
    
    it('is immutable', ()=>{
        const builder = new EntityManagerBuilder();
        const builderBis = builder.withPersistenceProvider(new Persistence());
        expect(builder).toNotBe(builderBis);
        expect(() => builder.build()).toThrow();
        expect(builderBis.build()).toExist();
    });
});