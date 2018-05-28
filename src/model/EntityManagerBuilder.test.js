import EntityManagerBuilder from './EntityManagerBuilder';
import Persistence from './persistence/Persistence';

test('should prevent invalid persistence provider', ()=>{
    expect(()=>{
        new EntityManagerBuilder().withPersistenceProvider(null);
    }).toThrow();
});

test('hides implementation details', ()=>{
    expect(new EntityManagerBuilder().instructions).toBeUndefined();
});

test('is immutable', ()=>{
    const builder = new EntityManagerBuilder();
    const builderBis = builder.withPersistenceProvider(new Persistence());
    expect(builder).not.toBe(builderBis);
    expect(() => builder.build()).toThrow();
    expect(builderBis.build()).toBeDefined();
});