import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated, loading } from '@/stores/auth';

// New UI Views (will be created/ported)
import LandingHome from '../views/HomeLanding.vue';
import AuthView from '../views/Auth.vue';
import Profile from '../views/Profile.vue';
import Menu from '../views/Menu.vue';
import ManageRecipes from '../views/ManageRecipes.vue';

const routes = [
  { path: '/', name: 'LandingHome', component: LandingHome },
  { path: '/auth', name: 'Auth', component: AuthView },
  { path: '/menu', name: 'Menu', component: Menu, meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/manage-recipes', name: 'ManageRecipes', component: ManageRecipes, meta: { requiresAuth: true } },
  // Legacy routes redirecting
  { path: '/login', redirect: '/auth' },
  { path: '/signup', redirect: '/auth' },
  { path: '/addRecipe', redirect: '/manage-recipes' },
  { path: '/manageRecipes', redirect: '/manage-recipes' }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  // Wait for reactive auth initialization
  if (loading.value) {
    await new Promise(resolve => {
      const check = () => { if (!loading.value) resolve(); else setTimeout(check, 50); };
      check();
    });
  }
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated.value) {
    return next('/auth');
  }
  if (to.path === '/auth' && isAuthenticated.value) {
    return next('/menu');
  }
  next();
});

export default router;
