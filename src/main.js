import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store";

// import firebase from "firebase";

// Include bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// Include fontawesome
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

// const firebaseConfig = {
//   apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
//   authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.VUE_APP_FIREBASE_APP_ID
// }

// firebase.initializeApp(firebaseConfig);
const firebase = require('@/plugins/firebase.js')

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

// export const db = firebase.firestore();

document.title = 'Recipe Planner'

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.auth)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     if (!store.getters.user.loggedIn) {
//       next({ name: 'login' })
//     } else {
//       next() // go to wherever I'm going
//     }
//   } else {
//     next() // does not require auth, make sure to always call next()!
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
