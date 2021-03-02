import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login'
import Register from '../components/Register'
import Profile from '../components/Profile'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            auth: false,
            title: 'Login'
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            auth: false,
            title: 'Register'
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {
            auth: true,
            title: 'Profile'
        }
    }
]
});

export default router
