import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);
app.use(router);
app.use(store);
app.config.productionTip = false;
document.title = 'Recipe Planner';
app.mount('#app');
