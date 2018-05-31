import AuthService from '../AuthService';

const f_firebase = Symbol("Internal field firebase");

export default class FirebaseAuth extends AuthService {
    /**
     * @param {*} firebase Initialized firebase instance
     */
    constructor(firebase){
        this[f_firebase] = firebase
        const that = firebase.auth();
        this.onAuthStateChanged = that.onAuthStateChanged;
        this.signOut = that.signOut;
    }

    getUser(){
        return this[f_firebase].auth().currentUser;
    }
}