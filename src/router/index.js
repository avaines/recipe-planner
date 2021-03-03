import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/Home.vue'),
    meta: {
      auth: true,
      title: 'Home'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login.vue'),
    meta: {
      auth: false,
      title: 'Login'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/components/ForgotPassword.vue'),
    meta: {
      auth: false,
      title: 'Forgot Password'
   }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/components/Signup.vue'),
    meta: {
      auth: false,
      title: 'Signup'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/components/Profile.vue'),
    meta: {
      auth: true,
      title: 'Profile'
    }
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
