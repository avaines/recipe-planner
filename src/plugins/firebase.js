import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import store from "@/store";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true
};

db.settings(settings);

// Optionally, configure Firebase to use local emulators during development
if (process.env.NODE_ENV === 'development') {
  // Point to the local Firestore emulator
  db.useEmulator('localhost', 9086);

  // Point to the local Firebase Auth emulator
  auth.useEmulator('http://localhost:9099');
}

auth.onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

export {
  db,
  auth
};
