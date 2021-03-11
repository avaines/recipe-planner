import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store";

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
