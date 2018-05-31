/**
 * Allow access to user login state,
 * logout user, etc...
 * 
 * @export
 * @class AuthService
 */
export default class AuthService {
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
     * Called when there is a change in auth state. The callback should not expect a param.
     * @param {function} callback 
     * @memberof AuthService
     * @return {function} A function to unsubscribe from this
     */
    onAuthStateChanged(callback){
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