import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store";

// Include bootstrap
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
// Vue.use(BootstrapVueIcons)

// Include fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faToolbox, faBars, faUser, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faToolbox, faBars, faUser, faPencilAlt, faTrashAlt);

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

document.title = 'Recipe Planner'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
