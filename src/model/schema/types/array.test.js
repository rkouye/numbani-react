import types from './'
import expect from 'expect';

describe("Types", ()=>{

    describe("Array", ()=>{

        it('accepts only javascript array', ()=>{
            expect(types.Array.accepts([])).toBe(true);
            expect(types.Array.accepts([1,true,"three"])).toBe(true);
            expect(types.Array.accepts(null)).toBe(true);
            expect(types.Array.accepts(undefined)).toBe(true);
            expect(types.Array.required().accepts(undefined)).toBe(false);
            expect(types.Array.required().accepts(null)).toBe(false);
            expect(types.Array.required().accepts([])).toBe(true);
            expect(types.Array.accepts({})).toBe(false);
            expect(types.Array.accepts(42)).toBe(false);
            expect(types.Array.accepts(new Date())).toBe(false);
            expect(types.Array.accepts("What's upppp")).toBe(false);
        });
    });
});