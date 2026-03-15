<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-2">Recipe Instructions</h1>
          <p class="text-gray-600">Build and manage step-by-step visual recipe instructions</p>
        </div>
        <router-link
          to="/recipe-instructions/new"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow"
        >
          <i class="pi pi-plus"></i><span>Add Instructions</span>
        </router-link>
      </div>

      <!-- Search -->
      <div class="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow">
        <input
          v-model="search"
          type="text"
          placeholder="Search instructions…"
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Empty state -->
      <div v-if="!loading && filtered.length === 0" class="text-center py-20 text-gray-400">
        <i class="pi pi-book text-5xl mb-4"></i>
        <p class="text-lg font-medium mb-1">No recipe instructions yet</p>
        <p class="text-sm mb-6">Build your first visual recipe instruction to get started.</p>
        <router-link
          to="/recipe-instructions/new"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <i class="pi pi-plus"></i> Add Instructions
        </router-link>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-20 text-gray-400">
        <i class="pi pi-spin pi-spinner text-3xl mb-3"></i>
        <p>Loading…</p>
      </div>

      <!-- Cards grid -->
      <div v-if="!loading && filtered.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="instr in filtered"
          :key="instr.id"
          class="group bg-white border border-gray-200 rounded-lg shadow overflow-hidden flex flex-col"
        >
          <!-- Card header -->
          <div class="p-2 border-b border-gray-100">
            <h3 class="font-semibold text-sm text-gray-700 truncate" :title="instr.name">{{ instr.name }}</h3>
          </div>

          <!-- Card body -->
          <div class="p-4 flex-1 flex flex-col">
            <p class="text-sm text-gray-500 mb-2">Servings: {{ instr.servings }}</p>

            <!-- Component summary -->
            <div class="mb-3">
              <div class="flex flex-wrap gap-1 text-xs">
                <span
                  v-for="(comp, ci) in (instr.components || []).slice(0, 4)"
                  :key="ci"
                  class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                >
                  {{ comp.name }}
                </span>
                <span
                  v-if="(instr.components || []).length > 4"
                  class="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full"
                >
                  +{{ instr.components.length - 4 }} more
                </span>
              </div>
            </div>

            <!-- Linked recipe badge -->
            <div class="mt-auto pt-3 border-t border-gray-100">
              <div v-if="instr.linkedRecipeId && recipeMap[instr.linkedRecipeId]" class="flex items-center gap-1.5 text-xs text-blue-600">
                <i class="pi pi-link"></i>
                <span>Linked: {{ recipeMap[instr.linkedRecipeId] }}</span>
              </div>
              <div v-else class="text-xs text-gray-400 italic">Not linked to a recipe</div>
            </div>

            <!-- Card actions (bottom) -->
            <div class="pt-3 mt-3 border-t border-gray-100 flex items-center gap-2">
              <router-link
                :to="`/recipe-instructions/${instr.id}/view`"
                class="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                title="View"
                aria-label="View"
              >
                View
              </router-link>
              <router-link
                :to="`/recipe-instructions/${instr.id}/edit`"
                class="px-2 py-1 text-xs rounded border border-blue-200 text-blue-700 hover:bg-blue-50"
                title="Edit"
                aria-label="Edit"
              >
                Edit
              </router-link>
              <button
                @click="printInstruction(instr.id)"
                class="px-2 py-1 text-xs rounded border border-purple-200 text-purple-700 hover:bg-purple-50"
                title="Print"
                aria-label="Print"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '@/plugins/firebase';

export default defineComponent({
  name: 'RecipeInstructionsManage',
  setup() {
    const router = useRouter();
    const search = ref('');
    const loading = ref(true);
    const instructions = ref([]);
    const recipeMap = ref({});   // { recipeId: recipeName }
    let groupId = '';

    const filtered = computed(() => {
      const term = search.value.toLowerCase();
      if (!term) return instructions.value;
      return instructions.value.filter(i =>
        i.name.toLowerCase().includes(term) ||
        (i.components || []).some(c => c.name.toLowerCase().includes(term))
      );
    });

    const load = async () => {
      loading.value = true;
      const user = auth.currentUser;
      if (!user) return;
      const allow = await db.collection('allow-users').doc(user.uid).get();
      if (!allow.exists) return;
      groupId = allow.data().groupId;

      // Load instructions
      const snap = await db.collection(`recipe-instructions-${groupId}`).get();
      instructions.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Load recipes for name mapping
      const rSnap = await db.collection(`recipes-${groupId}`).get();
      const map = {};
      rSnap.docs.forEach(d => {
        const data = d.data();
        map[d.id] = data.name || data.recipe;
      });
      recipeMap.value = map;

      loading.value = false;
    };

    const printInstruction = (id) => {
      const { href } = router.resolve({ path: `/recipe-instructions/${id}/view`, query: { print: '1' } });
      window.open(href, '_blank');
    };

    onMounted(load);

    return { search, loading, filtered, recipeMap, printInstruction };
  }
});
</script>

<style scoped>
.container { max-width: 1200px; }
.min-h-screen { min-height: 100vh; }
</style>
