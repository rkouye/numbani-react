import types from './'
import expect from 'expect';

xdescribe("Types", ()=>{

    describe("Date", ()=>{

        it('accepts only javascript Date', ()=>{
            
            expect(types.Date.accepts(new Date())).toBe(true);
            
            expect(types.Date.accepts(true)).toBe(false);
            expect(types.Date.accepts(false)).toBe(false);
            expect(types.Date.accepts(-0)).toBe(false);
            expect(types.Date.accepts(0.000001)).toBe(false);
            expect(types.Date.accepts(Math.PI)).toBe(false);
            expect(types.Date.accepts(NaN)).toBe(false);
            expect(types.Date.accepts([])).toBe(false);
            expect(types.Date.accepts("42")).toBe(false);
            expect(types.Date.accepts("NaN")).toBe(false);
            
        });
    });

});