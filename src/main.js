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
import { library } from '@fortawesome/fontawesome-svg-core'
import { faToolbox } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faToolbox)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

document.title = 'Recipe Planner'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
