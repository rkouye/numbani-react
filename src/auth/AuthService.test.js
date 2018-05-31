import AuthService from './AuthService'
import expect from 'expect';

describe('AuthServiceBuilder', ()=>{
    it('provide a unusable default implementation', ()=>{
        const service = new AuthService();
        expect(()=>service.getUser()).toThrow();
        expect(()=>service.userIsConnected()).toThrow();
        expect(()=>service.signOut()).toThrow();
        
    });
});