import types from './'
import expect from 'expect';

describe("Types", ()=>{

    describe("String", ()=>{

        it('validates string', ()=>{
            expect(types.String.accepts(35)).toBe(false);
            expect(types.String.accepts(new Date())).toBe(false);
            expect(types.String.accepts("What's upppp")).toBe(true);
        });
        
        it('validates max length', ()=>{
            expect(types.String.max(0).accepts("")).toBe(true);
            expect(types.String.max(1).accepts("Oups")).toBe(false);
            expect(types.String.max(5).accepts("Noups")).toBe(true);
            expect(types.String.max(5).accepts(null)).toBe(true);
            expect(types.String.max(5).accepts(undefined)).toBe(true);
            expect(types.String.max(5).required().accepts(undefined)).toBe(false);
            expect(types.String.max(5).required().accepts("Bla  bla")).toBe(false);
            expect(types.String.max(2).required().accepts("OK")).toBe(true);

            expect(types.String.max(5).getInfo("string.max")).toBe(5);
            expect(types.String.max(5).max(2).getInfo("string.max")).toBe(2);
            expect(types.String.max(2).max(5).getInfo("string.max")).toBe(2);
            expect(types.String.max(2).min(5).getInfo("string.max")).toBe(2);
            expect(types.String.min(2).max(5).getInfo("string.max")).toBe(5);
            expect(types.String.required().getInfo("string.max")).toBe(undefined);
        });

        it('validates min length', ()=>{
            expect(types.String.min(0).accepts("")).toBe(true);
            expect(types.String.min(1).accepts("")).toBe(false);
            expect(types.String.min(5).accepts("Cool !")).toBe(true);
            expect(types.String.min(5).accepts("Cool!")).toBe(true);
            expect(types.String.min(5).accepts(null)).toBe(true);
            expect(types.String.min(5).accepts(undefined)).toBe(true);
            expect(types.String.min(5).required().accepts(undefined)).toBe(false);
            expect(types.String.min(5).required().accepts("NOK")).toBe(false);
            expect(types.String.min(2).required().accepts("OK")).toBe(true);

            expect(types.String.min(5).getInfo("string.min")).toBe(5);
            expect(types.String.min(3).min(5).getInfo("string.min")).toBe(5);
            expect(types.String.min(5).min(3).getInfo("string.min")).toBe(5);
            expect(types.String.max(5).min(3).getInfo("string.min")).toBe(3);
            expect(types.String.min(5).max(3).getInfo("string.min")).toBe(5);
            expect(types.String.getInfo("string.min")).toBe(undefined);
        });


        it('validates pattern', ()=>{
            expect(types.String.pattern(/world/).accepts("Hello world !")).toBe(true);
            expect(types.String.pattern(/World/).accepts("Hello world !")).toBe(false);
            expect(types.String.pattern(/World/i).accepts("Hello world !")).toBe(true);            
            expect(types.String.pattern(/^A/).accepts("A")).toBe(true);
            expect(types.String.pattern(/^A/).accepts(" A")).toBe(false);
            expect(types.String.pattern(/\d+/).accepts("13")).toBe(true);
            expect(types.String.pattern(/\d+/).accepts("Thirteen")).toBe(false);
        });
    });
});