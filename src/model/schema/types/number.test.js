import types from './'
import expect from 'expect';

describe("Types", ()=>{

    describe("Number", ()=>{

        it('accepts only javascript number', ()=>{
            
            expect(types.Number.accepts(42)).toBe(true);
            expect(types.Number.accepts(-42)).toBe(true);
            expect(types.Number.accepts(-0)).toBe(true);
            expect(types.Number.accepts(0.000001)).toBe(true);
            expect(types.Number.accepts(Math.PI)).toBe(true);
            expect(types.Number.accepts(Number.MAX_SAFE_INTEGER)).toBe(true);
            expect(types.Number.accepts(Number.MIN_SAFE_INTEGER)).toBe(true);

            expect(types.Number.accepts(Number.POSITIVE_INFINITY)).toBe(false);
            expect(types.Number.accepts(Number.NEGATIVE_INFINITY)).toBe(false);
            expect(types.Number.accepts(NaN)).toBe(false);
            expect(types.Number.accepts(new Date())).toBe(false);
            expect(types.Number.accepts([])).toBe(false);
            expect(types.Number.accepts("42")).toBe(false);
            expect(types.Number.accepts("NaN")).toBe(false);
            
        });
    });

});