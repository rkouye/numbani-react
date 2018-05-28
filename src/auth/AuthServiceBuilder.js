/**
 * Allow access to user login state,
 * logout user, etc...
 * 
 * @export
 * @class AuthService
 */
class AuthService {
    /**
     * Get the actually connected user or
     * null if the user is not connected
     * 
     * @memberof AuthService
     */
    getUser(){
        throw new Error('Not implemented');
    }
    /**
     * Helper for user state
     * 
     * @returns {boolean}
     * @memberof AuthService
     */
    userIsConnected(){
        return this.getUser() !== null;
    }
    /**
     * 
     * @returns {Promise}
     * @memberof AuthService
     */
    signOut(){
        throw new Error('Not implemented');
    }
}

/**
 * 
 * 
 * @export
 * @class AuthServiceBuilder
 */
export default class AuthServiceBuilder {
    /**
     * 
     * 
     * @returns 
     * @memberof AuthServiceBuilder
     */
    build(){
        return AuthService;
    }
}