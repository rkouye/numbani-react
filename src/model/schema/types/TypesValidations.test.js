import types from './'
import { Type } from './Type';
import i18next from "i18next";
import expect from 'expect';

describe("Types", ()=>{
    before(()=>{
        return i18next.init({lng: 'cimode'});
    });
    
    it('type inheritance', ()=>{
        expect(types.String.doExtends(new Type())).toBe(false);
        expect(types.String.max(5).doExtends(types.String)).toBe(true);
        expect(types.String.doExtends(types.String)).toBe(true);
        expect(new Type().doExtends(types.String)).toBe(false);
        expect(types.String.required().doExtends(types.String)).toBe(true);
        expect(types.String.doExtends(types.String.max(5))).toBe(false);
    });
    
    it('validates required', ()=>{
        expect(types.String.required().accepts(null)).toBe(false);
        expect(types.String.required().accepts(undefined)).toBe(false);
        expect(types.String.required().accepts("")).toBe(true);
    });
    
    it('validates string', ()=>{
        expect(types.String.accepts(35)).toBe(false);
        expect(types.String.accepts(new Date())).toBe(false);
        expect(types.String.accepts("What's upppp")).toBe(true);
    });
    
    it('validates length', ()=>{
        expect(types.String.max(0).accepts("")).toBe(true);
        expect(types.String.max(1).accepts("Oups")).toBe(false);
        expect(types.String.max(5).accepts("Noups")).toBe(true);
        expect(types.String.max(5).accepts(null)).toBe(true);
        expect(types.String.max(5).accepts(undefined)).toBe(true);
        expect(types.String.max(5).required().accepts(undefined)).toBe(false);
        expect(types.String.max(5).required().accepts("Bla  bla")).toBe(false);
        expect(types.String.max(2).required().accepts("OK")).toBe(true);
    });
});