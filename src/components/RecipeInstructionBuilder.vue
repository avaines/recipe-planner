<template>
  <div class="builder-form space-y-5">
    <!-- Recipe Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Recipe Name</label>
        <input
          type="text"
          v-model="local.name"
          @input="emitUpdate"
          placeholder="e.g. Shepherd's Pie"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Servings</label>
        <input
          type="number"
          v-model.number="local.servings"
          @input="emitUpdate"
          min="1"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Components -->
    <div>
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-sm text-gray-700 uppercase tracking-wide">Components</h4>
        <button
          type="button"
          @click="addComponent"
          class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm"
        >
          <i class="pi pi-plus"></i> Add Component
        </button>
      </div>

      <div v-if="local.components.length === 0" class="text-xs text-gray-500 italic border border-dashed border-gray-300 rounded-lg p-6 text-center">
        No components yet. Add one to get started.
      </div>

      <div
        v-for="(comp, ci) in local.components"
        :key="comp._id"
        class="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
      >
        <!-- Component header -->
        <div class="flex items-center gap-2 mb-4">
          <input
            type="text"
            v-model="comp.name"
            @input="emitUpdate"
            placeholder="Component name (e.g. Mashed Potatoes)"
            class="flex-1 border rounded-md px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            @click="removeComponent(ci)"
            class="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50"
            aria-label="Remove component"
          >
            <i class="pi pi-trash"></i>
          </button>
        </div>

        <!-- Ingredients -->
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center gap-2">
              <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ingredients</h5>
              <span class="text-[11px] text-gray-400">Tip: press Enter to add the next ingredient</span>
            </div>
            <button
              type="button"
              @click="addIngredient(ci)"
              class="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs"
            >
              <i class="pi pi-plus"></i> Add
            </button>
          </div>
          <div v-for="(ing, ii) in comp.ingredients" :key="ii" class="flex gap-2 items-center mb-2">
            <input
              type="text"
              v-model="ing.item"
              @input="emitUpdate"
              @keydown.enter.prevent="handleIngredientEnter(ci, ii)"
              :ref="(el) => setIngredientItemRef(ci, ii, el)"
              placeholder="e.g. 1 cup flour"
              class="w-3/5 border rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <input
              type="text"
              v-model="ing.prep"
              @input="emitUpdate"
              @keydown.enter.prevent="handleIngredientEnter(ci, ii)"
              placeholder="prep (optional)"
              class="w-44 border rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button
              type="button"
              @click="removeIngredient(ci, ii)"
              class="text-red-400 hover:text-red-600 px-1"
              aria-label="Remove ingredient"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
          <p v-if="comp.ingredients.length === 0" class="text-xs text-gray-400 italic">No ingredients yet.</p>
        </div>

        <!-- Steps -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Steps</h5>
            <button
              type="button"
              @click="addStep(ci)"
              class="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs"
            >
              <i class="pi pi-plus"></i> Add
            </button>
          </div>
          <div
            v-for="(step, si) in comp.steps"
            :key="si"
            class="border border-gray-200 rounded-md p-3 mb-2 bg-white"
          >
            <div class="flex gap-2 items-start">
              <div class="flex-1">
                <input
                  type="text"
                  v-model="step.action"
                  @input="emitUpdate"
                  placeholder="e.g. mix together"
                  class="w-full border rounded px-2 py-1.5 text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <div class="flex items-center justify-between mb-1.5">
                  <div class="text-xs text-gray-500">Applies to ingredients:</div>
                  <button
                    type="button"
                    @click="selectAllStepRows(ci, si)"
                    :disabled="comp.ingredients.length === 0"
                    class="text-[11px] text-blue-600 hover:text-blue-700 disabled:text-gray-300"
                  >
                    Select all
                  </button>
                </div>
                <div v-if="comp.ingredients.length === 0" class="text-xs text-gray-400 italic">Add ingredients first.</div>
                <div class="flex flex-wrap gap-x-3 gap-y-1">
                  <label
                    v-for="(ing, ii) in comp.ingredients"
                    :key="ii"
                    class="inline-flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :checked="step.rows.includes(ii)"
                      @change="toggleStepRow(ci, si, ii, $event.target.checked)"
                      class="h-3 w-3 text-blue-600 border-gray-300 rounded"
                    />
                    <span class="truncate max-w-xs" :title="ing.item">{{ ing.item || `Ingredient ${ii + 1}` }}</span>
                  </label>
                </div>
              </div>
              <button
                type="button"
                @click="removeStep(ci, si)"
                class="text-red-400 hover:text-red-600 px-1 mt-1 shrink-0"
                aria-label="Remove step"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>
          <p v-if="comp.steps.length === 0" class="text-xs text-gray-400 italic">No steps yet.</p>
          <div v-if="comp.steps.length > 0" class="flex justify-end mt-2">
            <button
              type="button"
              @click="addStep(ci)"
              class="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs"
            >
              <i class="pi pi-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watch, nextTick } from 'vue';

export default defineComponent({
  name: 'RecipeInstructionBuilder',
  props: {
    modelValue: { type: Object, required: true }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    let idCounter = 0;
    const ingredientItemRefs = new Map();

    const itemRefKey = (ci, ii) => `ing-${ci}-${ii}`;
    const setIngredientItemRef = (ci, ii, el) => {
      const key = itemRefKey(ci, ii);
      if (el) ingredientItemRefs.set(key, el);
      else ingredientItemRefs.delete(key);
    };

    const focusIngredientItem = async (ci, ii) => {
      await nextTick();
      const el = ingredientItemRefs.get(itemRefKey(ci, ii));
      if (el && typeof el.focus === 'function') {
        el.focus();
        if (typeof el.select === 'function') el.select();
      }
    };

    const cloneRecipe = (src) => ({
      name: src.name || '',
      servings: src.servings || 4,
      components: (src.components || []).map(c => ({
        _id: idCounter++,
        name: c.name || '',
        ingredients: (c.ingredients || []).map(i => ({ item: i.item || '', prep: i.prep || '' })),
        steps: (c.steps || []).map(s => ({ action: s.action || '', rows: [...(s.rows || [])] }))
      }))
    });

    const local = reactive(cloneRecipe(props.modelValue));

    // Watch for external resets (e.g. loading saved data)
    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal && newVal._reset) {
          const fresh = cloneRecipe(newVal);
          local.name = fresh.name;
          local.servings = fresh.servings;
          local.components.splice(0, local.components.length, ...fresh.components);
        }
      },
      { deep: false }
    );

    const buildCleanRecipe = () => ({
      name: local.name,
      servings: local.servings,
      components: local.components.map(c => ({
        name: c.name,
        ingredients: c.ingredients
          .filter(i => i.item.trim())
          .map(i => ({ item: i.item.trim(), ...(i.prep.trim() ? { prep: i.prep.trim() } : {}) })),
        steps: c.steps
          .filter(s => s.action.trim() && s.rows.length > 0)
          .map(s => ({ action: s.action.trim(), rows: [...s.rows] }))
      })).filter(c => c.ingredients.length > 0)
    });

    const emitUpdate = () => emit('update:modelValue', buildCleanRecipe());

    const addComponent = () => {
      local.components.push({
        _id: idCounter++,
        name: `Component ${local.components.length + 1}`,
        ingredients: [],
        steps: []
      });
      emitUpdate();
    };

    const removeComponent = (ci) => {
      local.components.splice(ci, 1);
      emitUpdate();
    };

    const addIngredient = (ci) => {
      local.components[ci].ingredients.push({ item: '', prep: '' });
      emitUpdate();
    };

    const handleIngredientEnter = async (ci, ii) => {
      const comp = local.components[ci];
      if (!comp) return;

      // If Enter on the last ingredient row, add a fresh row and focus it.
      if (ii === comp.ingredients.length - 1) {
        addIngredient(ci);
        await focusIngredientItem(ci, ii + 1);
        return;
      }

      // Otherwise move to the next existing ingredient row.
      await focusIngredientItem(ci, ii + 1);
    };

    const removeIngredient = (ci, ii) => {
      const comp = local.components[ci];
      comp.ingredients.splice(ii, 1);
      // Reindex step rows to account for removed ingredient
      comp.steps.forEach(step => {
        step.rows = step.rows
          .filter(r => r !== ii)
          .map(r => r > ii ? r - 1 : r);
      });
      emitUpdate();
    };

    const addStep = (ci) => {
      local.components[ci].steps.push({ action: '', rows: [] });
      emitUpdate();
    };

    const removeStep = (ci, si) => {
      local.components[ci].steps.splice(si, 1);
      emitUpdate();
    };

    const toggleStepRow = (ci, si, rowIndex, checked) => {
      const step = local.components[ci].steps[si];
      if (checked) {
        if (!step.rows.includes(rowIndex)) {
          step.rows.push(rowIndex);
          step.rows.sort((a, b) => a - b);
        }
      } else {
        step.rows = step.rows.filter(r => r !== rowIndex);
      }
      emitUpdate();
    };

    const selectAllStepRows = (ci, si) => {
      const comp = local.components[ci];
      const step = comp?.steps?.[si];
      if (!comp || !step) return;

      const allRows = comp.ingredients.map((_, idx) => idx);
      const allSelected = allRows.length > 0 && allRows.every(idx => step.rows.includes(idx));

      // Toggle behavior: if everything is selected, unselect all; otherwise select all
      step.rows = allSelected ? [] : allRows;
      emitUpdate();
    };

    return {
      local,
      emitUpdate,
      addComponent,
      removeComponent,
      addIngredient,
      handleIngredientEnter,
      setIngredientItemRef,
      removeIngredient,
      addStep,
      removeStep,
      toggleStepRow,
      selectAllStepRows
    };
  }
});
</script>
