import types from './'
import expect from 'expect';

describe("Types", ()=>{

    describe("Number", ()=>{

        it('validates number, min and max', ()=>{
            
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

            expect(types.Number.min(10).accepts(9)).toBe(false);
            expect(types.Number.min(10).accepts(10)).toBe(true);
            expect(types.Number.min(10).accepts(11)).toBe(true);

            expect(types.Number.max(18).accepts(19)).toBe(false);
            expect(types.Number.max(18).accepts(18)).toBe(true);
            expect(types.Number.max(18).accepts(11)).toBe(true);

        });
    });

});