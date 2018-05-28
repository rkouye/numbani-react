import AuthServiceBuilder from './AuthServiceBuilder'

test('provide a unusable default implementation', ()=>{
    const service = new (new AuthServiceBuilder().build())();
    expect(()=>service.getUser()).toThrow();
    expect(()=>service.userIsConnected()).toThrow();
    expect(()=>service.signOut()).toThrow();
    
});