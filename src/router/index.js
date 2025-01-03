import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      auth: false,
      title: 'Home'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      auth: false,
      title: 'Login'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: {
      auth: false,
      title: 'Forgot Password'
   }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/Signup.vue'),
    meta: {
      auth: false,
      title: 'Signup'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      auth: true,
      title: 'Profile'
    }
  },
  {
    name: 'create',
    path: '/create',
    component: () => import('@/views/RecipesAdd'),
    meta: {
      auth: true,
      title: 'Add Recipe'
    }
  },
  {
    name: 'manageRecipes',
    path: '/manage',
    component: () => import('@/views/RecipesManage'),
    meta: {
      auth: true,
      title: 'Manage Recipes'
    }
  },
  {
    name: 'edit',
    path: '/edit/:id',
    component: () => import('@/views/RecipesEdit'),
    meta: {
      auth: true,
      title: 'Edit Recipes'
    }
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
