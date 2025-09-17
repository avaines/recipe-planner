<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-8">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-6 text-gray-800">Recipe Management System</h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Plan your weekly meals, generate shopping lists, and manage your recipe collection with ease.
          Create a 4-week meal plan covering Monday to Friday, with automatic shopping list generation.
        </p>
        <div class="flex justify-center gap-4">
          <button @click="$router.push('/auth')" class="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow">
            <i class="pi pi-arrow-right"></i>
            <span>Get Started</span>
          </button>
          <button v-if="isAuthenticated" @click="$router.push('/menu')" class="inline-flex items-center gap-2 px-8 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium shadow">
            <i class="pi pi-calendar"></i>
            <span>View Menu</span>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="text-center h-full bg-white rounded-lg shadow p-6 flex flex-col">
          <i class="pi pi-calendar text-5xl text-blue-500 mb-4"></i>
            <h3 class="text-xl font-semibold mb-3">Weekly Menu Planning</h3>
            <p class="text-gray-600 leading-relaxed flex-1">
              Create a 5×4 weekly menu grid covering Monday to Friday for 4 weeks.
              Perfect for organized meal planning without weekend stress.
            </p>
        </div>
        <div class="text-center h-full bg-white rounded-lg shadow p-6 flex flex-col">
          <i class="pi pi-shopping-cart text-5xl text-green-500 mb-4"></i>
            <h3 class="text-xl font-semibold mb-3">Smart Shopping Lists</h3>
            <p class="text-gray-600 leading-relaxed flex-1">
              Automatically generate weekly shopping lists with consolidated
              and deduplicated ingredients from your planned recipes.
            </p>
        </div>
        <div class="text-center h-full bg-white rounded-lg shadow p-6 flex flex-col">
          <i class="pi pi-book text-5xl text-orange-500 mb-4"></i>
            <h3 class="text-xl font-semibold mb-3">Recipe Management</h3>
            <p class="text-gray-600 leading-relaxed flex-1">
              Store recipes with cookbook references, ingredients, and special
              tags like gluten-free, leftovers, marinade required, and time-consuming.
            </p>
        </div>
      </div>
      <div class="bg-gray-50 rounded-lg p-8">
        <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center" v-for="step in steps" :key="step.number">
            <div :class="['rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4', step.bg]">
              <span :class="['text-2xl font-bold', step.color]">{{ step.number }}</span>
            </div>
            <h3 class="font-semibold mb-2 text-lg">{{ step.title }}</h3>
            <p class="text-gray-600">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import { isAuthenticated } from '@/stores/auth';
export default defineComponent({
  components: {},
  setup(){
    const steps = [
      { number: 1, title: 'Add Recipes', text: 'Input your favorite recipes with ingredients and special requirements.', bg: 'bg-blue-100', color: 'text-blue-600' },
      { number: 2, title: 'Plan Menu', text: 'View your 4-week menu with randomly selected recipes for each weekday.', bg: 'bg-green-100', color: 'text-green-600' },
      { number: 3, title: 'Generate Lists', text: 'Get organized shopping lists for each week automatically.', bg: 'bg-orange-100', color: 'text-orange-600' },
      { number: 4, title: 'Print & Shop', text: 'Print your menu and shopping lists for easy reference.', bg: 'bg-purple-100', color: 'text-purple-600' }
    ];
    return { steps, isAuthenticated };
  }
});
</script>
<style scoped>
.container { max-width: 1200px; }
.min-h-screen { min-height: 100vh; }
.grid { display: grid; }
.md\:grid-cols-3 { }
</style>
