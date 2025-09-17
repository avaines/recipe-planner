<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-6">
      <div class="mb-8 print-section menu-section bg-white border border-gray-200 rounded-lg shadow">
        <div ref="menuFrame" class="print-frame">
          <div ref="menuFrameContent" class="print-frame-content">
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
              <div class="menu-scroll">
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
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg shadow print-section lists-section">
        <div ref="listsFrame" class="print-frame">
          <div ref="listsFrameContent" class="print-frame-content">
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
  const menuFrame = ref(null);
  const listsFrame = ref(null);
  const menuFrameContent = ref(null);
  const listsFrameContent = ref(null);
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
    const scaleToFit = (frameEl, contentEl, targetWidthMM, targetHeightMM) => {
      if (!frameEl || !contentEl) return 1;
      const pxPerMm = mmToPx();
      const targetW = targetWidthMM * pxPerMm;
      const targetH = targetHeightMM * pxPerMm;
      // Reset any previous inline transforms to measure natural size
      contentEl.style.transform = 'none';
      contentEl.style.transformOrigin = 'top left';
      contentEl.style.zoom = '';
      // Force a reflow to ensure measurements are up to date
      // eslint-disable-next-line no-unused-expressions
      contentEl.offsetHeight;
      // Measure content size at its current layout dimensions
      const rect = contentEl.getBoundingClientRect();
      let contentW = rect.width;
      let contentH = rect.height;
      // Compute scale with a small safety margin to avoid edge cropping due to rounding
      const sRaw = Math.min(targetW / contentW, targetH / contentH);
      const s = Math.min(sRaw * 0.98, 1);
      // Size the outer frame and apply scale to inner content
      frameEl.style.width = `${targetWidthMM}mm`;
      frameEl.style.height = `${targetHeightMM}mm`;
      frameEl.style.overflow = 'hidden';
      // Prefer zoom for print pagination in WebKit/Blink; fallback to transform
      const zoomSupported = 'zoom' in contentEl.style;
      if (zoomSupported) {
        contentEl.style.zoom = s;
        contentEl.style.transform = 'none';
      } else {
        contentEl.style.transform = `scale(${s})`;
      }
      return s;
    };
    const clearScale = (frameEl, contentEl) => {
      if (frameEl) {
        frameEl.style.height = '';
        frameEl.style.width = '';
        frameEl.style.overflow = '';
      }
      if (contentEl) {
        contentEl.style.transform = '';
        contentEl.style.transformOrigin = '';
        contentEl.style.zoom = '';
      }
    };
    const beforePrint = () => {
      // A4 landscape with 10mm margins defined in @page
      const marginMM = 10; // matches @page margin
      const fullW = 297 - marginMM*2;
      const fullH = 210 - marginMM*2;
      const FRACTION = 0.9; // scale target area to 90% of page content
      const targetWidthMM = fullW * FRACTION;
      const targetHeightMM = fullH * FRACTION;
      scaleToFit(menuFrame.value, menuFrameContent.value, targetWidthMM, targetHeightMM);
      scaleToFit(listsFrame.value, listsFrameContent.value, targetWidthMM, targetHeightMM);
    };
    const afterPrint = () => {
      clearScale(menuFrame.value, menuFrameContent.value);
      clearScale(listsFrame.value, listsFrameContent.value);
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
    let mql;
    const mqlHandler = (e) => { if (e.matches) beforePrint(); else afterPrint(); };
    onMounted(()=> {
      window.addEventListener('beforeprint', beforePrint);
      window.addEventListener('afterprint', afterPrint);
      // Fallback for Safari and some browsers that only fire matchMedia
      if (window.matchMedia) {
        mql = window.matchMedia('print');
        if (mql && mql.addListener) mql.addListener(mqlHandler);
        else if (mql && mql.addEventListener) mql.addEventListener('change', mqlHandler);
      }
      if (flatRecipes.value.length === 0) regenerate(); else generatedAt.value = new Date();
    });
    onUnmounted(()=> {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
      if (mql) {
        if (mql.removeListener) mql.removeListener(mqlHandler);
        else if (mql.removeEventListener) mql.removeEventListener('change', mqlHandler);
      }
    });
  return { weeks, normalizedWeeks, days, flatRecipes, regenerate, loading, generatedAt, formattedGeneratedAt, menuFrame, listsFrame, menuFrameContent, listsFrameContent };
  }
});
</script>
<style scoped>
.container { max-width:1200px; }
.min-h-screen { min-height:100vh; }
.menu-grid { display:grid; grid-template-columns: repeat(5, 1fr); gap:1rem; }
.menu-scroll { overflow-x:auto; -webkit-overflow-scrolling: touch; }
/* On small screens, give the grid a min-width so it can scroll instead of squashing */
@media (max-width: 768px) {
  .menu-grid { min-width: 700px; }
}
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
  /* Frame centering and sizing */
  .print-frame { margin: 0 auto; display:block; position:relative; break-inside: avoid; page-break-inside: avoid; }
  .print-frame-content { transform-origin: top left; }
  /* Grids */
  .menu-grid { grid-template-columns: repeat(5, 1fr); }
  .shopping-grid { grid-template-columns: repeat(4, 1fr); }
  .shopping-week { break-inside: avoid; page-break-inside: avoid; }
  /* Disable mobile scroll wrapper during print */
  .menu-scroll { overflow: visible !important; }
  /* Page size: browsers apply single @page per doc; favor landscape for first page via scaling, allow portrait-friendly content using max-width rules */
  @page { size: A4 landscape; margin: 10mm; }
}
</style>
