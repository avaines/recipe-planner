<template>
  <nav class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between no-print">
    <div class="flex items-center gap-2">
      <router-link to="/" class="flex items-center gap-2 font-bold text-xl text-gray-800">
        <span>Recipe Planner</span>
      </router-link>
      <div v-if="user.loggedIn" class="hidden md:flex items-center gap-5 ml-8 text-sm font-medium">
        <router-link to="/menu" class="hover:text-blue-600" :class="{ 'text-blue-600': $route.path === '/menu' }">Menu</router-link>
  <router-link to="/manage-recipes" class="hover:text-blue-600" :class="{ 'text-blue-600': $route.path === '/manage-recipes' && !$route.query.add }">Manage Recipes</router-link>
  <router-link :to="{ path: '/manage-recipes', query: { add: '1' } }" class="hover:text-blue-600" :class="{ 'text-blue-600': $route.path === '/manage-recipes' && $route.query.add }">Add Recipe</router-link>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button v-if="!user.loggedIn" @click="$router.push('/auth')" class="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50">Sign In</button>
      <!-- Removed separate Profile & Add buttons; username becomes profile link -->
      <button v-if="$route.path === '/menu'" @click="handlePrint" class="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50">Print Menu</button>
  <router-link v-if="user.loggedIn && user.data" to="/profile" class="text-sm text-gray-600 hover:text-blue-600 font-medium">Hi, {{ user.data.displayName }}</router-link>
      <button v-if="user.loggedIn" @click="signOut" class="px-3 py-1.5 text-sm rounded bg-red-500 text-white hover:bg-red-600">Logout</button>
    </div>
  </nav>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { auth } from '@/plugins/firebase.js';

export default defineComponent({
  setup() {
    const store = useStore();
    const user = computed(() => store.getters.user);

    const signOut = () => {
      auth.signOut().then(() => {
        // state managed via onAuthStateChanged already
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      });
    };

    const handlePrint = () => window.print();
    return { user, signOut, handlePrint };
  }
});
</script>

<style scoped>
/* Tailwind handles styles; minimal overrides below */
</style>
