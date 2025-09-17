<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-6">
      <div ref="menuSection" class="mb-8 print-section menu-section bg-white border border-gray-200 rounded-lg shadow">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 class="font-semibold">Weekly Menu Plan</h2>
            <p v-if="generatedAt" class="text-xs text-gray-500 mt-1">Generated: {{ formattedGeneratedAt }}</p>
          </div>
          <button @click="regenerate" :disabled="loading" class="no-print inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            <i :class="['pi', loading ? 'pi-spin pi-spinner' : 'pi-refresh']"></i>
            <span>{{ loading ? 'Generating...' : 'Regenerate Menu' }}</span>
          </button>
        </div>
        <div class="p-6">
          <div class="menu-grid">
            <div class="day-header" v-for="day in days" :key="day">{{ day }}</div>
            <div v-for="(recipe,index) in flatRecipes" :key="index" class="menu-recipe-card">
              <div class="recipe-name">{{ recipe.recipe || recipe.name }}</div>
              <div class="recipe-book text-sm text-gray-600">{{ recipe.book }}</div>
              <div class="recipe-tags flex flex-wrap gap-1 mt-1">
                <span v-if="recipe.leftovers" class="badge badge-info">Leftovers</span>
                <span v-if="recipe.glutenFree" class="badge badge-success">GF</span>
                <span v-if="recipe.marinateRequired || recipe.marinade" class="badge badge-warning">Marinade</span>
                <span v-if="recipe.timeConsuming" class="badge badge-danger">Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  <div ref="listsSection" class="bg-white border border-gray-200 rounded-lg shadow print-section lists-section">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="font-semibold">Weekly Shopping Lists</h2>
          <p v-if="generatedAt" class="text-xs text-gray-500 mt-1">Based on menu generated: {{ formattedGeneratedAt }}</p>
        </div>
        <div class="p-6">
          <div class="shopping-grid">
            <div v-for="(week, idx) in normalizedWeeks" :key="idx" class="shopping-week">
              <h3 class="font-semibold mb-2">Week {{ idx+1 }}</h3>
              <ul class="ingredient-list">
                <li v-for="ingredient in week.shoppingList" :key="ingredient">{{ ingredient }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, onUnmounted, ref, inject } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  components: {},
  setup(){
    const store = useStore();
    const loading = ref(false);
    const generatedAt = ref(null);
    const weeks = computed(()=> store.getters.weekRecipes);
    const normalizedWeeks = computed(()=> {
      const w = weeks.value || {};
      // Expect structure { w1:[...], w2:[...], w3:[...], w4:[...] } or already an array of week objects
      if (Array.isArray(w)) return w.map(week => ({ shoppingList: week.shoppingList || [] }));
      const order = ['w1','w2','w3','w4'];
      return order.map(key => {
        const wk = w[key];
        if(!wk) return { shoppingList: [] };
        // If stored week already has shoppingList keep it; else derive from recipes if available
        if (wk.shoppingList) return { shoppingList: wk.shoppingList };
        // Derive: if wk is array of recipe objects with ingredients string, split and aggregate unique
        if (Array.isArray(wk)) {
          const ingredients = new Set();
            wk.forEach(r => {
              if (r && r.ingredients) {
                const parts = Array.isArray(r.ingredients) ? r.ingredients : r.ingredients.split(',');
                parts.forEach(p => { const trimmed = p.trim(); if(trimmed) ingredients.add(trimmed); });
              }
            });
          return { shoppingList: Array.from(ingredients).sort() };
        }
        return { shoppingList: [] };
      });
    });
    const days = ['Day 1','Day 2','Day 3','Day 4','Day 5'];
    const flatRecipes = computed(()=> {
      const wk = weeks.value; // w1..w4 arrays
      return [...wk.w1, ...wk.w2, ...wk.w3, ...wk.w4];
    });
    const toast = inject('toast', null);
    const menuSection = ref(null);
    const listsSection = ref(null);
    const mmToPx = () => {
      const probe = document.createElement('div');
      probe.style.width = '100mm';
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      document.body.appendChild(probe);
      const px = probe.getBoundingClientRect().width;
      probe.remove();
      return px / 100; // px per mm
    };
    const scaleToFit = (el, targetWidthMM, targetHeightMM) => {
      if (!el) return 1;
      const pxPerMm = mmToPx();
      const targetW = targetWidthMM * pxPerMm;
      const targetH = targetHeightMM * pxPerMm;
      // Reset any previous inline transforms to measure natural size
      el.style.transform = 'none';
      el.style.transformOrigin = 'top left';
      el.style.width = `${targetWidthMM}mm`;
      // Measure content size
      const contentW = el.scrollWidth;
      const contentH = el.scrollHeight;
      const s = Math.min(targetW / contentW, targetH / contentH, 1);
      el.style.height = `${targetHeightMM}mm`;
      el.style.overflow = 'hidden';
      el.style.transform = `scale(${s})`;
      return s;
    };
    const clearScale = (el) => {
      if (!el) return;
      el.style.transform = '';
      el.style.height = '';
      el.style.width = '';
      el.style.overflow = '';
      el.style.transformOrigin = '';
    };
    const beforePrint = () => {
      // A4 landscape with 10mm margins defined in @page
      const targetWidthMM = 297 - 20;
      const targetHeightMM = 210 - 20;
      scaleToFit(menuSection.value, targetWidthMM, targetHeightMM);
      scaleToFit(listsSection.value, targetWidthMM, targetHeightMM);
    };
    const afterPrint = () => {
      clearScale(menuSection.value);
      clearScale(listsSection.value);
    };
    const regenerate = async () => {
      if (loading.value) return;
      loading.value = true;
      try {
        await store.dispatch('loadWeeksRecipes');
        generatedAt.value = new Date();
      } catch(e){
        console.error(e);
        toast && toast({ type:'error', title:'Menu', message:'Failed to regenerate menu.' });
      } finally {
        loading.value = false;
      }
    };
    const formattedGeneratedAt = computed(()=> generatedAt.value ? generatedAt.value.toLocaleString() : '');
    onMounted(()=> {
      window.addEventListener('beforeprint', beforePrint);
      window.addEventListener('afterprint', afterPrint);
      if (flatRecipes.value.length === 0) regenerate(); else generatedAt.value = new Date();
    });
    onUnmounted(()=> {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    });
    return { weeks, normalizedWeeks, days, flatRecipes, regenerate, loading, generatedAt, formattedGeneratedAt, menuSection, listsSection };
  }
});
</script>
<style scoped>
.container { max-width:1200px; }
.min-h-screen { min-height:100vh; }
.menu-grid { display:grid; grid-template-columns: repeat(5, 1fr); gap:1rem; }
.day-header { font-weight:600; text-align:center; }
.menu-recipe-card { background:#fff; border:1px solid #e5e7eb; padding:.75rem; border-radius:.5rem; box-shadow:0 1px 2px rgba(0,0,0,.05); }
.recipe-name { font-weight:600; }
.shopping-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }
.shopping-week { background:#fff; border:1px solid #e5e7eb; padding:1rem; border-radius:.5rem; }
.ingredient-list { list-style:none; padding:0; margin:0; font-size:.875rem; }
/* Badge styles replacing PrimeVue Tag */
.badge { display:inline-block; padding:0.15rem 0.5rem; font-size:.65rem; font-weight:600; line-height:1; border-radius:0.375rem; letter-spacing:.5px; text-transform:uppercase; }
.badge-info { background:#0ea5e9; color:#fff; }
.badge-success { background:#16a34a; color:#fff; }
.badge-warning { background:#f59e0b; color:#fff; }
.badge-danger { background:#dc2626; color:#fff; }

/* Print styles */
@media print {
  body, html { background:#fff !important; }
  /* Hide global chrome */
  nav, footer, .no-print, .fixed, header { display:none !important; }
  /* Layout adjustments */
  .container { max-width:100% !important; padding:0 !important; margin:0 !important; }
  .min-h-screen { min-height:auto; }
  /* Sections */
  .print-section { box-shadow:none !important; border: none !important; border-radius:0 !important; }
  /* Force exactly two pages without blank middle */
  .menu-section { page-break-after: always; }
  .lists-section { page-break-after: auto; page-break-before: avoid; }
  /* Grids */
  .menu-grid { grid-template-columns: repeat(5, 1fr); }
  .shopping-grid { grid-template-columns: repeat(4, 1fr); }
  .shopping-week { break-inside: avoid; page-break-inside: avoid; }
  /* Page size: browsers apply single @page per doc; favor landscape for first page via scaling, allow portrait-friendly content using max-width rules */
  @page { size: A4 landscape; margin: 10mm; }
}
</style>
