<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div class="text-sm text-gray-500 mb-1">
            <router-link to="/recipe-instructions" class="hover:text-blue-600">Recipe Instructions</router-link>
            <span class="mx-2">›</span>
            <span>{{ isEditing ? 'Edit' : 'New' }}</span>
          </div>
          <h1 class="text-2xl font-bold">{{ isEditing ? 'Edit Recipe Instructions' : 'New Recipe Instructions' }}</h1>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <button
            v-if="isEditing"
            @click="removeInstruction"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-50"
          >
            Delete
          </button>
          <router-link
            to="/recipe-instructions"
            class="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
          >
            Cancel
          </router-link>
          <button
            @click="save"
            :disabled="saving"
            class="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm disabled:opacity-50"
          >
            <i class="pi pi-save"></i>
            {{ saving ? 'Saving…' : 'Save Instructions' }}
          </button>
        </div>
      </div>

      <!-- Link to recipe (optional) -->
      <div class="mb-5 bg-white border border-gray-200 rounded-lg p-4 shadow">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1" for="linkedRecipe">Link to Recipe <span class="text-gray-400 font-normal">(optional)</span></label>
            <select
              id="linkedRecipe"
              v-model="linkedRecipeId"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Not linked to a recipe —</option>
              <option v-for="r in recipes" :key="r.id" :value="r.id">{{ r.name || r.recipe }}</option>
            </select>
          </div>
          <p class="text-xs text-gray-400 max-w-xs">Linking connects these instructions to a recipe in your collection so you can navigate between them.</p>
        </div>
      </div>

      <!-- Builder + Preview split -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Editor panel -->
        <div class="bg-white border border-gray-200 rounded-lg shadow flex flex-col">
          <div class="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <i class="pi pi-pencil text-blue-600"></i>
            <h2 class="font-semibold text-base">Editor</h2>
          </div>
          <div class="p-5 overflow-y-auto" style="max-height: calc(100vh - 280px)">
            <RecipeInstructionBuilder v-model="recipeData" />
          </div>
        </div>

        <!-- Preview panel -->
        <div class="bg-white border border-gray-200 rounded-lg shadow flex flex-col" style="position: sticky; top: 20px; align-self: start;">
          <div class="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <i class="pi pi-eye text-purple-600"></i>
            <h2 class="font-semibold text-base">Live Preview</h2>
          </div>
          <div class="p-5 overflow-y-auto" style="max-height: calc(100vh - 280px)">
            <div v-if="recipeData.name || (recipeData.components && recipeData.components.length > 0)">
              <h3 class="text-xl font-bold mb-0.5">{{ recipeData.name || 'Untitled Recipe' }}</h3>
              <p class="text-sm text-gray-500 mb-4">Servings: {{ recipeData.servings }}</p>
              <RecipeInstructionViewer :recipe="recipeData" />
            </div>
            <div v-else class="flex flex-col items-center justify-center text-center py-12 text-gray-400">
              <i class="pi pi-book text-4xl mb-3"></i>
              <p class="text-sm">Start building your recipe instructions on the left and the preview will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth, db } from '@/plugins/firebase';
import RecipeInstructionBuilder from '@/components/RecipeInstructionBuilder.vue';
import RecipeInstructionViewer from '@/components/RecipeInstructionViewer.vue';

const emptyRecipe = () => ({
  name: '',
  servings: 4,
  components: []
});

export default defineComponent({
  name: 'RecipeInstructionEdit',
  components: { RecipeInstructionBuilder, RecipeInstructionViewer },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const isEditing = ref(false);
    const saving = ref(false);
    const linkedRecipeId = ref('');
    const recipes = ref([]);
    const recipeData = ref(emptyRecipe());
    let groupId = '';
    let instructionId = null;

    const getGroup = async () => {
      const user = auth.currentUser;
      if (!user) return null;
      const allow = await db.collection('allow-users').doc(user.uid).get();
      if (!allow.exists) return null;
      return allow.data().groupId;
    };

    const loadRecipesList = async (gId) => {
      const snap = await db.collection(`recipes-${gId}`).get();
      recipes.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    };

    const loadInstruction = async (gId, id) => {
      const doc = await db.collection(`recipe-instructions-${gId}`).doc(id).get();
      if (!doc.exists) return;
      const data = doc.data();
      linkedRecipeId.value = data.linkedRecipeId || '';
      // Replace recipe object and trigger builder reset via _reset flag
      recipeData.value = {
        name: data.name || '',
        servings: data.servings || 4,
        components: data.components || [],
        _reset: true
      };
    };

    onMounted(async () => {
      groupId = await getGroup();
      if (!groupId) {
        router.push('/auth');
        return;
      }

      await loadRecipesList(groupId);

      // Check if editing existing instruction
      if (route.params.id) {
        isEditing.value = true;
        instructionId = route.params.id;
        await loadInstruction(groupId, instructionId);
      } else {
        // Pre-fill from query params (coming from ManageRecipes "Add Instructions")
        if (route.query.name) recipeData.value.name = route.query.name;
        if (route.query.linkedRecipeId) linkedRecipeId.value = route.query.linkedRecipeId;
      }
    });

    const save = async () => {
      if (!recipeData.value.name || !recipeData.value.name.trim()) {
        alert('Please enter a recipe name.');
        return;
      }
      saving.value = true;
      try {
        const collection = db.collection(`recipe-instructions-${groupId}`);
        const payload = {
          name: recipeData.value.name,
          servings: recipeData.value.servings,
          components: recipeData.value.components,
          linkedRecipeId: linkedRecipeId.value || null,
          updatedAt: new Date()
        };

        if (isEditing.value && instructionId) {
          await collection.doc(instructionId).update(payload);
        } else {
          payload.createdAt = new Date();
          await collection.add(payload);
        }
        router.push('/recipe-instructions');
      } catch (err) {
        console.error('Error saving instruction:', err);
        alert(`Failed to save: ${err?.message || 'Please try again.'}`);
      } finally {
        saving.value = false;
      }
    };

    const removeInstruction = async () => {
      if (!isEditing.value || !instructionId) return;
      if (!confirm('Delete these recipe instructions?')) return;
      saving.value = true;
      try {
        await db.collection(`recipe-instructions-${groupId}`).doc(instructionId).delete();
        router.push('/recipe-instructions');
      } catch (err) {
        console.error('Error deleting instruction:', err);
        alert(`Failed to delete: ${err?.message || 'Please try again.'}`);
      } finally {
        saving.value = false;
      }
    };

    return { isEditing, saving, linkedRecipeId, recipes, recipeData, save, removeInstruction };
  }
});
</script>

<style scoped>
.container { max-width: 1400px; }
</style>
