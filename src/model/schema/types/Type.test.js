import types from './'
import { Type } from './Type';
import expect from 'expect';

describe("Type", ()=>{

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

});