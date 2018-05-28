import EntitySchemaBuilder from './EntitySchemaBuilder';

test('hides implementation details', ()=>{
    expect(new EntitySchemaBuilder().instructions).toBeUndefined();
});