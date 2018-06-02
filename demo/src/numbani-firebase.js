import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAEimivowRPliJkAdr7RhYvzaunoD2b9W0",
    authDomain: "numbani-framework.firebaseapp.com",
    databaseURL: "https://numbani-framework.firebaseio.com",
    projectId: "numbani-framework",
    storageBucket: "numbani-framework.appspot.com",
    messagingSenderId: "146150168433"
};

firebase.initializeApp(config);

export default firebase;