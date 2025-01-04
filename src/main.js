import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Include bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// Include fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faToolbox, faBars, faUser, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faToolbox, faBars, faUser, faPencilAlt, faTrashAlt);


const app = createApp(App);
app.use(router);
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon);
app.config.productionTip = false;

document.title = 'Recipe Planner';

app.mount('#app');
