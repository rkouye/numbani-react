import EntitySchemaBuilder from './EntitySchemaBuilder';
import expect from 'expect';

describe("EntitySchemaBuidler", ()=>{
    it('hides implementation details', ()=>{
        expect(new EntitySchemaBuilder().instructions).toBe(undefined);
    });
});