import firebase from 'firebase/app';
import store from "@/store";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
}

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
};
db.settings(settings);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

export {
    db
};