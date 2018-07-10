import types from './'
import expect from 'expect';

describe("Types", ()=>{

    describe("Boolean", ()=>{

        it('accepts only javascript boolean', ()=>{
            
            expect(types.Boolean.accepts(true)).toBe(true);
            expect(types.Boolean.accepts(false)).toBe(true);

            expect(types.Boolean.accepts(-0)).toBe(false);
            expect(types.Boolean.accepts(0.000001)).toBe(false);
            expect(types.Boolean.accepts(Math.PI)).toBe(false);
            expect(types.Boolean.accepts(NaN)).toBe(false);
            expect(types.Boolean.accepts(new Date())).toBe(false);
            expect(types.Boolean.accepts([])).toBe(false);
            expect(types.Boolean.accepts("42")).toBe(false);
            expect(types.Boolean.accepts("NaN")).toBe(false);
            
        });
    });

});