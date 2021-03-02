import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login'
import Register from '../components/Register'
import Dashboard from '../components/Dashboard'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
        path: '/login',
        name: 'login',
        component: Login
        meta: {
            auth: false,
            title: 'Login'
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
        meta: {
            auth: false,
            title: 'Register'
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
        meta: {
            auth: true,
            title: 'Register'
        }
    }
]
});

export default router
