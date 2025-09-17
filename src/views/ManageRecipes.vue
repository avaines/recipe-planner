<template>
  <div class="min-h-screen">
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-2">Manage Recipes</h1>
          <p class="text-gray-600">Add, edit, and organize your recipe collection</p>
        </div>
        <button @click="openAdd" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow"><i class="pi pi-plus"></i><span>Add Recipe</span></button>
      </div>
      <div class="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input v-model="search" type="text" placeholder="Search recipes..." class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="r in filtered" :key="r.id" class="group recipe-management-card bg-white border border-gray-200 rounded-lg shadow overflow-hidden flex flex-col cursor-pointer"
             @click="edit(r)" @keydown.enter.prevent="edit(r)" tabindex="0" role="button" :aria-label="'Edit ' + (r.recipe || r.name)">
          <div class="flex justify-end p-2 border-b border-gray-100 z-10 relative">
            <button @click.stop="edit(r)" class="text-gray-500 hover:text-blue-600 p-2" aria-label="Edit"><i class="pi pi-pencil"></i></button>
            <button @click.stop="remove(r)" class="text-gray-500 hover:text-red-600 p-2" aria-label="Delete"><i class="pi pi-trash"></i></button>
          </div>
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">{{ r.recipe || r.name }}</h3>
            <p class="text-sm text-gray-500 mb-3">{{ r.book }}</p>
            <div class="mb-4">
              <div class="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
                <span v-if="r.leftovers" class="badge badge-info">Leftovers</span>
                <span v-if="r.glutenFree" class="badge badge-success">Gluten Free</span>
                <span v-if="r.marinateRequired || r.marinade" class="badge badge-warning">Marinade</span>
                <span v-if="r.timeConsuming" class="badge badge-danger">Time Consuming</span>
              </div>
            </div>
            <div class="mt-auto">
              <h4 class="font-semibold mb-2 text-sm">Ingredients:</h4>
              <p class="text-sm text-gray-600 leading-relaxed">{{ (Array.isArray(r.ingredients)? r.ingredients : r.ingredients.split(',')).join(', ') }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="dialog" class="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 p-4 overflow-y-auto">
        <div class="bg-white w-full max-w-2xl rounded-lg shadow-lg animate-fade-in">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="font-semibold text-lg">{{ editing ? 'Edit Recipe' : 'Add New Recipe' }}</h3>
            <button @click="close" class="text-gray-400 hover:text-gray-600" aria-label="Close"><i class="pi pi-times"></i></button>
          </div>
          <form @submit.prevent="save" class="space-y-6 p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2" for="rName">Recipe Name</label>
                <input id="rName" v-model="form.name" type="text" placeholder="Enter recipe name" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2" for="rBook">Cookbook</label>
                <input id="rBook" v-model="form.book" type="text" placeholder="Enter cookbook name" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2" for="ingInput">Ingredients</label>
              <div class="flex gap-2 mb-3">
                <input id="ingInput" v-model="ingredientInput" @keydown.enter.prevent="addIngredient" type="text" placeholder="Type an ingredient and press Add" class="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" ref="ingredientField" />
                <button type="button" @click="addIngredient" class="inline-flex items-center px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium"><i class="pi pi-plus mr-1"></i>Add</button>
              </div>
              <div v-if="ingredientsList.length" class="space-y-2 max-h-48 overflow-y-auto pr-1">
                <div v-for="(ing, idx) in ingredientsList" :key="idx" class="flex items-center gap-2 group border border-gray-200 rounded px-2 py-1 bg-gray-50 hover:bg-white">
                  <template v-if="editingIngredient === idx">
                    <input v-model="editingValue" @keydown.enter.prevent="commitIngredient(idx)" @keydown.esc.prevent="cancelIngredient" class="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" @click="commitIngredient(idx)" class="text-green-600 hover:text-green-700 px-1" aria-label="Save"><i class="pi pi-check"></i></button>
                    <button type="button" @click="cancelIngredient" class="text-gray-500 hover:text-gray-700 px-1" aria-label="Cancel"><i class="pi pi-times"></i></button>
                  </template>
                  <template v-else>
                    <span class="flex-1 text-sm cursor-text" @click="beginIngredientEdit(idx, ing)">{{ ing }}</span>
                    <button type="button" @click="beginIngredientEdit(idx, ing)" class="opacity-60 group-hover:opacity-100 text-blue-600 hover:text-blue-700 px-1" aria-label="Edit"><i class="pi pi-pencil"></i></button>
                    <button type="button" @click="removeIngredient(idx)" class="opacity-60 group-hover:opacity-100 text-red-600 hover:text-red-700 px-1" aria-label="Delete"><i class="pi pi-trash"></i></button>
                  </template>
                </div>
              </div>
              <p v-else class="text-xs text-gray-500">No ingredients added yet.</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.leftovers" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /> <span>Makes Leftovers</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.glutenFree" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /> <span>Gluten Free</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.marinateRequired" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /> <span>Requires Marinade</span></label>
              <label class="flex items-center gap-2"><input type="checkbox" v-model="form.timeConsuming" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /> <span>Time Consuming</span></label>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="close" class="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" class="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium">{{ editing ? 'Save Changes' : 'Add Recipe' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { auth, db } from '@/plugins/firebase';

export default defineComponent({
  components: {},
  setup(){
  const search = ref('');
  const route = useRoute();
    const recipes = ref([]);
    const dialog = ref(false);
    const editing = ref(false);
    const currentId = ref(null);
  const form = reactive({ name:'', book:'', leftovers:false, glutenFree:false, marinateRequired:false, timeConsuming:false });
  const ingredientInput = ref('');
  const ingredientsList = ref([]);
  const ingredientField = ref(null);
  const editingIngredient = ref(null);
  const editingValue = ref('');

    const load = async () => {
      const user = auth.currentUser; if(!user) return;
      const allow = await db.collection('allow-users').doc(user.uid).get(); if(!allow.exists) return;
      const groupId = allow.data().groupId; const collection = `recipes-${groupId}`;
      const snap = await db.collection(collection).get();
      recipes.value = snap.docs.map(d=> ({ id:d.id, ...d.data() }));
    };

    const filtered = computed(()=> recipes.value.filter(r => {
      const term = search.value.toLowerCase();
      if(!term) return true;
      const ing = Array.isArray(r.ingredients)? r.ingredients : r.ingredients.split(',');
      return (r.name||r.recipe||'').toLowerCase().includes(term) || (r.book||'').toLowerCase().includes(term) || ing.some(i=> i.toLowerCase().includes(term));
    }));

    const toSentenceCase = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
    const normalise = (str) => toSentenceCase(str.trim());
    const addIngredient = () => {
      const val = normalise(ingredientInput.value);
      if(!val) return;
      if(!ingredientsList.value.includes(val)) {
        ingredientsList.value.push(val);
        ingredientInput.value='';
      } else {
        alert(val + ' already added');
      }
      ingredientField.value && ingredientField.value.focus();
    };
    const beginIngredientEdit = (idx, ing) => { editingIngredient.value = idx; editingValue.value = ing; }; 
    const commitIngredient = (idx) => { const val = normalise(editingValue.value); if(!val) { cancelIngredient(); return;} ingredientsList.value[idx] = val; cancelIngredient(); };
    const cancelIngredient = () => { editingIngredient.value = null; editingValue.value=''; };
    const removeIngredient = (idx) => { ingredientsList.value.splice(idx,1); };
    const openAdd = () => { editing.value=false; currentId.value=null; Object.assign(form,{ name:'', book:'', leftovers:false, glutenFree:false, marinateRequired:false, timeConsuming:false }); ingredientsList.value=[]; ingredientInput.value=''; dialog.value=true; setTimeout(()=> ingredientField.value && ingredientField.value.focus(), 50); };
  const edit = (r) => { editing.value=true; currentId.value=r.id; Object.assign(form,{ name:r.name||r.recipe, book:r.book||'', leftovers:!!r.leftovers, glutenFree:!!r.glutenFree, marinateRequired:!!(r.marinateRequired||r.marinade), timeConsuming:!!r.timeConsuming }); const ingArr = Array.isArray(r.ingredients)? r.ingredients : r.ingredients.split(','); ingredientsList.value = ingArr.map(i=> normalise(i)); ingredientInput.value=''; editingIngredient.value=null; editingValue.value=''; dialog.value=true; setTimeout(()=> ingredientField.value && ingredientField.value.focus(), 50); };
    const remove = async (r) => { if(!confirm('Delete recipe?')) return; const user = auth.currentUser; if(!user) return; const allow = await db.collection('allow-users').doc(user.uid).get(); const groupId = allow.data().groupId; await db.collection(`recipes-${groupId}`).doc(r.id).delete(); recipes.value = recipes.value.filter(x=> x.id!==r.id); };
    const close = () => { dialog.value=false; };
    const save = async () => {
      const user = auth.currentUser; if(!user) return; const allow = await db.collection('allow-users').doc(user.uid).get(); const groupId = allow.data().groupId; const collection = db.collection(`recipes-${groupId}`);
      const ingredients = ingredientsList.value;
      const data = { name: form.name, book: form.book, ingredients: ingredients.join(', '), leftovers: form.leftovers, glutenFree: form.glutenFree, marinateRequired: form.marinateRequired, timeConsuming: form.timeConsuming };
      if(editing.value && currentId.value){ await collection.doc(currentId.value).update(data); const idx = recipes.value.findIndex(r=> r.id===currentId.value); if(idx>-1) recipes.value[idx] = { id: currentId.value, ...data }; }
      else { const docRef = await collection.add(data); recipes.value.unshift({ id: docRef.id, ...data }); }
      close();
    };

    onMounted(()=> {
      load();
      if(route.query.add==='1') {
        openAdd();
      }
    });
    watch(()=> route.query.add, (val)=> {
      if(val==='1' && !dialog.value) {
        openAdd();
      }
      if(val==null && dialog.value && !editing.value) {
        // if query removed while add dialog open and not editing existing, close it
        // optional: ignore
      }
    });
    return { search, recipes, filtered, dialog, editing, form, ingredientInput, ingredientsList, ingredientField, addIngredient, beginIngredientEdit, commitIngredient, cancelIngredient, removeIngredient, editingIngredient, editingValue, openAdd, edit, remove, close, save };
  }
});
</script>
<style scoped>
.container { max-width:1200px; }
.min-h-screen { min-height:100vh; }
.grid { display:grid; }
.flex { display:flex; }
.flex-col { flex-direction:column; }
.gap-4 { gap:1rem; }
.gap-6 { gap:1.5rem; }
.items-center { align-items:center; }
.justify-between { justify-content:space-between; }
.justify-end { justify-content:flex-end; }
.flex-1 { flex:1 1 0%; }
.w-full { width:100%; }
.max-w-2xl { max-width:42rem; }
.p-2 { padding:.5rem; }
.p-6 { padding:1.5rem; }
.pt-4 { padding-top:1rem; }
.mb-2 { margin-bottom:.5rem; }
.mb-4 { margin-bottom:1rem; }
.mb-6 { margin-bottom:1.5rem; }
.mb-8 { margin-bottom:2rem; }
.mr-2 { margin-right:.5rem; }
.space-x-4 > * + * { margin-left:1rem; }
.space-y-6 > * + * { margin-top:1.5rem; }
.font-bold { font-weight:700; }
.font-semibold { font-weight:600; }
.text-gray-600 { color:#4b5563; }
.recipe-management-card { transition: transform .2s ease, box-shadow .2s ease; }
.recipe-management-card:hover { transform: translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,.15); }
/* Badge styles */
.badge { display:inline-block; padding:0.2rem 0.55rem; font-size:.6rem; font-weight:600; line-height:1; border-radius:0.375rem; letter-spacing:.5px; background:#e5e7eb; color:#374151; }
.badge-info { background:#0ea5e9; color:#fff; }
.badge-success { background:#16a34a; color:#fff; }
.badge-warning { background:#f59e0b; color:#fff; }
.badge-danger { background:#dc2626; color:#fff; }
@keyframes fade-in { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform: translateY(0);} }
.animate-fade-in { animation: fade-in 0.25s ease; }
</style>
