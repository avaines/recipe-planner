<template>
  <nav class="bg-white border-b border-gray-200 px-4 py-3 no-print">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <router-link to="/" class="flex items-center gap-2 font-bold text-xl text-gray-800">
          <span>Recipe Planner</span>
        </router-link>
      </div>
      <div class="flex items-center gap-2 md:hidden">
        <button @click="mobileOpen = !mobileOpen" class="p-2 rounded border border-gray-300 hover:bg-gray-50" aria-label="Toggle navigation" :aria-expanded="mobileOpen.toString()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      <div class="hidden md:flex items-center gap-5 text-sm font-medium">
        <router-link v-if="user.loggedIn" to="/menu" class="hover:text-blue-600" :class="{ 'text-blue-600': $route.path === '/menu' }">Menu</router-link>
        <router-link v-if="user.loggedIn" to="/manage-recipes" class="hover:text-blue-600" :class="{ 'text-blue-600': $route.path === '/manage-recipes' && !$route.query.add }">Manage Recipes</router-link>
        <router-link v-if="user.loggedIn" :to="{ path: '/manage-recipes', query: { add: '1' } }" class="hover:text-blue-600" :class="{ 'text-blue-600': $route.path === '/manage-recipes' && $route.query.add }">Add Recipe</router-link>
        <button v-if="$route.path === '/menu'" @click="handlePrint" class="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50">Print Menu</button>
        <router-link v-if="user.loggedIn && user.data" to="/profile" class="text-sm text-gray-600 hover:text-blue-600 font-medium">Hi, {{ user.data.displayName }}</router-link>
        <button v-if="user.loggedIn" @click="signOut" class="px-3 py-1.5 text-sm rounded bg-red-500 text-white hover:bg-red-600">Logout</button>
        <button v-if="!user.loggedIn" @click="$router.push('/auth')" class="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50">Sign In</button>
      </div>
    </div>
    <!-- Mobile Menu -->
    <div v-if="mobileOpen" class="md:hidden mt-3 border-t border-gray-200 pt-3 space-y-2">
      <div class="flex flex-col gap-2 text-sm font-medium">
        <router-link v-if="user.loggedIn" to="/menu" class="py-1 hover:text-blue-600" :class="{ 'text-blue-600': $route.path === '/menu' }" @click="mobileOpen=false">Menu</router-link>
        <router-link v-if="user.loggedIn" to="/manage-recipes" class="py-1 hover:text-blue-600" :class="{ 'text-blue-600': $route.path === '/manage-recipes' && !$route.query.add }" @click="mobileOpen=false">Manage Recipes</router-link>
        <router-link v-if="user.loggedIn" :to="{ path: '/manage-recipes', query: { add: '1' } }" class="py-1 hover:text-blue-600" :class="{ 'text-blue-600': $route.path === '/manage-recipes' && $route.query.add }" @click="mobileOpen=false">Add Recipe</router-link>
        <button v-if="$route.path === '/menu'" @click="handlePrint(); mobileOpen=false" class="text-left px-0 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50">Print Menu</button>
        <router-link v-if="user.loggedIn && user.data" to="/profile" class="py-1 text-gray-600 hover:text-blue-600 font-medium" @click="mobileOpen=false">Hi, {{ user.data.displayName }}</router-link>
        <button v-if="user.loggedIn" @click="signOut(); mobileOpen=false" class="px-3 py-1.5 text-sm rounded bg-red-500 text-white hover:bg-red-600 w-full text-left">Logout</button>
        <button v-if="!user.loggedIn" @click="$router.push('/auth'); mobileOpen=false" class="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 w-full text-left">Sign In</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { auth } from '@/plugins/firebase.js';

export default defineComponent({
  setup() {
    const store = useStore();
    const user = computed(() => store.getters.user);
    const mobileOpen = ref(false);

    const signOut = () => {
      auth.signOut().then(() => {
        // state managed via onAuthStateChanged already
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      });
    };

    const handlePrint = () => window.print();
    return { user, signOut, handlePrint, mobileOpen };
  }
});
</script>

<style scoped>
/* Tailwind handles styles; minimal overrides below */
</style>
