<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 no-print">
        <div>
          <div class="text-sm text-gray-500 mb-1">
            <router-link to="/recipe-instructions" class="hover:text-blue-600">Recipe Instructions</router-link>
            <span class="mx-2">›</span>
            <span>{{ instruction.name || 'View' }}</span>
          </div>
          <h1 class="text-2xl font-bold">{{ instruction.name }}</h1>
          <p v-if="instruction.servings" class="text-gray-500 text-sm mt-0.5">Servings: {{ instruction.servings }}</p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <button
            @click="printPage"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
          >
            <i class="pi pi-print"></i> Print
          </button>
          <button
            v-if="instruction.id"
            @click="removeInstruction"
            :disabled="deleting"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-50"
          >
            <i class="pi pi-trash"></i> Delete
          </button>
          <router-link
            v-if="instruction.id"
            :to="`/recipe-instructions/${instruction.id}/edit`"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            <i class="pi pi-pencil"></i> Edit
          </router-link>
          <router-link
            to="/recipe-instructions"
            class="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
          >
            Back
          </router-link>
        </div>
      </div>

      <!-- Linked recipe notice -->
      <div
        v-if="linkedRecipeName"
        class="mb-5 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700 flex items-center gap-2 no-print"
      >
        <i class="pi pi-link"></i>
        <span>These instructions are linked to <strong>{{ linkedRecipeName }}</strong>.</span>
        <router-link to="/manage-recipes" class="underline hover:text-blue-900 ml-1">View Recipes →</router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 text-gray-400">
        <i class="pi pi-spin pi-spinner text-3xl mb-3"></i>
        <p>Loading…</p>
      </div>

      <!-- Instruction content -->
      <div v-if="!loading && instruction.components" class="bg-white border border-gray-200 rounded-lg shadow p-6 print-card">
        <!-- Title shown only in print (screen header has no-print) -->
        <div class="print-title">
          <h1>{{ instruction.name }}</h1>
          <p v-if="instruction.servings">Servings: {{ instruction.servings }}</p>
        </div>
        <RecipeInstructionViewer :recipe="instruction" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth, db } from '@/plugins/firebase';
import RecipeInstructionViewer from '@/components/RecipeInstructionViewer.vue';

export default defineComponent({
  name: 'RecipeInstructionView',
  components: { RecipeInstructionViewer },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(true);
    const instruction = ref({});
    const linkedRecipeName = ref('');
    const deleting = ref(false);
    let groupId = '';

    onMounted(async () => {
      const user = auth.currentUser;
      if (!user) return;
      const allow = await db.collection('allow-users').doc(user.uid).get();
      if (!allow.exists) return;
      groupId = allow.data().groupId;

      const doc = await db.collection(`recipe-instructions-${groupId}`).doc(route.params.id).get();
      if (doc.exists) {
        instruction.value = { id: doc.id, ...doc.data() };
        // Resolve linked recipe name
        if (instruction.value.linkedRecipeId) {
          const rDoc = await db.collection(`recipes-${groupId}`).doc(instruction.value.linkedRecipeId).get();
          if (rDoc.exists) {
            const rd = rDoc.data();
            linkedRecipeName.value = rd.name || rd.recipe;
          }
        }
      }
      loading.value = false;

      // Auto print support (used by Print action in list view)
      if (route.query.print === '1') {
        await nextTick();
        setTimeout(() => window.print(), 100);
      }
    });

    const printPage = () => window.print();

    const removeInstruction = async () => {
      if (!instruction.value?.id) return;
      if (!confirm('Delete these recipe instructions?')) return;
      deleting.value = true;
      try {
        await db.collection(`recipe-instructions-${groupId}`).doc(instruction.value.id).delete();
        router.push('/recipe-instructions');
      } catch (err) {
        console.error('Error deleting instruction:', err);
        alert('Failed to delete. Please try again.');
      } finally {
        deleting.value = false;
      }
    };

    return { loading, instruction, linkedRecipeName, printPage, removeInstruction, deleting };
  }
});
</script>

<style scoped>
.container { max-width: 900px; }
.min-h-screen { min-height: 100vh; }

@media print {
  @page {
    size: landscape;
    margin: 0.5cm;
  }

  /* Hide all app chrome */
  .no-print { display: none !important; }

  /* Remove card shadow/border, fill full width */
  .container {
    max-width: 100% !important;
    padding: 0 !important;
  }
  .min-h-screen {
    min-height: unset !important;
  }

  /* Print title block (shown instead of the screen header) */
  .print-title {
    display: block !important;
    margin-bottom: 6px;
  }
  .print-title h1 {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 2px;
  }
  .print-title p {
    font-size: 11px;
    color: #555;
    margin: 0;
  }

  /* Strip card styling */
  .print-card {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    border-radius: 0 !important;
  }
}

/* Hide print-only title on screen */
.print-title { display: none; }
</style>
