<!-- src/components/Footer.vue -->
<template>
  <footer class="mt-16 border-t border-gray-200 bg-white/70 backdrop-blur py-8">
    <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-600">
      <div class="flex items-center gap-2">
        <span class="font-semibold">Recipe Planner</span>
        <span class="opacity-60">© {{ year }}</span>
      </div>
      <div class="flex items-center gap-4">
        <a href="https://github.com/avaines/recipe-planner/" target="_blank" rel="noopener" class="hover:text-gray-900 transition-colors"><i class="bi bi-github text-lg"></i><span class="sr-only">GitHub</span></a>
        <a href="https://www.vaines.org" target="_blank" rel="noopener" class="hover:text-gray-900 transition-colors"><i class="bi bi-house text-lg"></i><span class="sr-only">Website</span></a>
      </div>
      <div class="text-center md:text-right">
        All rights reserved, <a href="https://www.vaines.org" class="text-blue-600 hover:text-blue-700">Vaines.org</a>
      </div>
    </div>
  </footer>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer',
  setup(){
    const year = new Date().getFullYear();
    return { year };
  }
});
</script>

<style scoped>
/* No additional styles; Tailwind utilities used */
</style>