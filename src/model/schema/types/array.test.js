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

            expect(types.Array.min(3).max(3).accepts([1,true,"three"])).toBe(true);
            expect(types.Array.min(4).accepts([1,true,"three"])).toBe(false);
            expect(types.Array.max(2).accepts([1,true,"three"])).toBe(false);
        });
    });

    describe("Array.of", ()=>{

        it('its validates string array', ()=>{
            expect(types.Array.of(types.String).accepts([])).toBe(true);
            expect(types.Array.of(types.String).accepts(["bidibi", "bobbidi", "boo"])).toBe(true);
            expect(types.Array.of(types.String).accepts(["answer", 42])).toBe(false);
        });

        it('its validates only one of multiples types', ()=>{
            expect(types.Array.of(types.String.min(4),types.String.min(5)).accepts(["123"])).toBe(false);
            expect(types.Array.of(types.String.min(4),types.String.min(5)).accepts(["1234"])).toBe(true);
        });
    });
});