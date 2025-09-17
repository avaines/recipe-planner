<template>
  <div :class="[darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-800', 'min-h-screen flex flex-col']">
    <Navbar />
    <main class="flex-1 py-4">
      <router-view />
    </main>
    <Footer />
    <!-- Toasts -->
    <div class="fixed z-50 top-4 right-4 space-y-3 w-80" v-if="toasts.length">
      <div v-for="t in toasts" :key="t.id" :class="toastClass(t.type)" class="px-4 py-3 rounded-lg shadow flex items-start gap-3 text-sm border">
        <i :class="['pi', iconFor(t.type)]"></i>
        <div class="flex-1">
          <p class="font-semibold" v-if="t.title">{{ t.title }}</p>
          <p class="leading-snug whitespace-pre-line">{{ t.message }}</p>
        </div>
        <button @click="dismiss(t.id)" class="text-xs opacity-60 hover:opacity-100"><i class="pi pi-times"></i></button>
      </div>
    </div>
    <!-- Dark mode toggle floating button
    <button @click="toggleDark" class="fixed bottom-4 left-4 inline-flex items-center gap-2 px-3 py-2 rounded-full shadow bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-800 hover:opacity-90 transition text-sm">
      <i :class="['pi', darkMode ? 'pi-sun' : 'pi-moon']"></i>
      <span>{{ darkMode ? 'Light' : 'Dark' }}</span>
    </button> -->
  </div>
</template>

<script>
import { defineComponent, reactive, ref, provide, onMounted } from 'vue';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default defineComponent({
  components: { Navbar, Footer },
  setup(){
    const toasts = reactive([]);
    let seed = 0;
    const pushToast = (payload) => {
      const id = ++seed;
      const t = { id, type: payload.type||'info', title: payload.title||'', message: payload.message||'', life: payload.life||3000 };
      toasts.push(t);
      if(t.life>0) setTimeout(()=> dismiss(id), t.life);
    };
    const dismiss = (id) => {
      const idx = toasts.findIndex(t=> t.id===id);
      if(idx>-1) toasts.splice(idx,1);
    };
    const iconFor = (type) => ({ success:'pi-check-circle', error:'pi-times-circle', warn:'pi-exclamation-triangle', info:'pi-info-circle' }[type] || 'pi-info-circle');
    const toastClass = (type) => {
      const base = 'border-l-4';
      switch(type){
        case 'success': return base + ' bg-green-50 border-green-500 text-green-800 dark:bg-green-600/20 dark:text-green-200';
        case 'error': return base + ' bg-red-50 border-red-500 text-red-800 dark:bg-red-600/20 dark:text-red-200';
        case 'warn': return base + ' bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-600/20 dark:text-yellow-200';
        default: return base + ' bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-600/20 dark:text-blue-200';
      }
    };
    // Dark mode
    const darkMode = ref(false);
    const toggleDark = () => { darkMode.value = !darkMode.value; localStorage.setItem('rp_dark', darkMode.value? '1':'0'); };
    onMounted(()=> { darkMode.value = localStorage.getItem('rp_dark')==='1'; });
    provide('toast', pushToast);
    return { toasts, pushToast, dismiss, iconFor, toastClass, darkMode, toggleDark };
  }
});
</script>

<style>
html.dark { color-scheme: dark; }
@media print {
  nav, footer { display:none !important; }
}
</style>

