import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBkvRj66JKpqauZpIl5qHOmsDBt-WSjJxk",
    authDomain: "booming-voice-411517.firebaseapp.com",
    databaseURL: "https://booming-voice-411517-default-rtdb.firebaseio.com",
    projectId: "booming-voice-411517",
    storageBucket: "booming-voice-411517.appspot.com",
    messagingSenderId: "11647279445",
    appId: "1:11647279445:web:065a7f23f560b338f10fdc"
  };

  firebase.initializeApp(firebaseConfig);
  export const db = firebase.database()
  export const auth = firebase.auth();
  export const store = firebase.firestore();
  export default firebase
  