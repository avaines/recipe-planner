import Vue from "vue";
import App from "./App.vue";
import router from "./routes/index";
import firebase from "firebase";
import store from "./store";

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
});

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

document.title = 'Recipe Planner'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
