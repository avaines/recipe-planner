import { createRouter, createWebHistory } from 'vue-router';
import { auth, db } from '@/plugins/firebase.js';
import store from '../store';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Profile from '../views/Profile.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import RecipesAdd from '../views/RecipesAdd.vue';
import RecipesEdit from '../views/RecipesEdit.vue';
import RecipesManage from '../views/RecipesManage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: {title: 'Forgot Password'}
  },
  {
    path: '/addRecipe',
    name: 'AddRecipe',
    component: RecipesAdd,
    meta: { requiresAuth: true, title: 'Add Recipes' }
  },
  {
    path: '/manageRecipes',
    name: 'ManageRecipes',
    component: RecipesManage,
    meta: { requiresAuth: true, title: 'Manage Recipes' }
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: RecipesEdit,
    meta: { requiresAuth: true, title: 'Edit Recipes' }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  auth.onAuthStateChanged(async (user) => {
    if (requiresAuth && user) {
      try {
        const doc = await db.collection('allow-users').doc(user.uid).get();
        if (doc.exists && doc.data().enabled) {
          next();
        } else {
          alert('Your account is not enabled. Please contact support.');
          await auth.signOut();
          store.commit('SET_LOGGED_IN', false);
          store.commit('SET_USER', null);
          next({ name: 'Login' });
        }
      } catch (error) {
        console.error("Error checking user enabled status: ", error);
        await auth.signOut();
        store.commit('SET_LOGGED_IN', false);
        store.commit('SET_USER', null);
        next({ name: 'Login' });
      }
    } else if (requiresAuth && !user) {
      next({ name: 'Login' });
    } else {
      next();
    }
  });
});

export default router;
