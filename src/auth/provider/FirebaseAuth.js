import AuthService from '../AuthService';
import firebase from 'firebase/app';

const f_firebase_auth = Symbol("Internal field firebase.auth.Auth");

export default class FirebaseAuth extends AuthService {
    /**
     * @param {*} firebaseAuth Initialized firebase instance
     */
    constructor(firebaseAuth){
        super();
        if(! firebase.auth)
            throw new Error('Import firebase/auth first');
        if(!(firebaseAuth instanceof firebase.auth.Auth))
            throw new Error('Argument firebaseAuth is not an instance of firebase.auth.Auth.'
            +' Use firebase.auth() to have one');
        this[f_firebase_auth] = firebaseAuth;
    }

    onAuthStateChanged = (callback) => {
        return this[f_firebase_auth].onAuthStateChanged(callback);
    }

    signOut = () => {
        return this[f_firebase_auth].signOut();
    }
    getUser = () => {
        return this[f_firebase_auth].currentUser;
    }
}