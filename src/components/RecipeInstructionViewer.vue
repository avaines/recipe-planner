<template>
  <div class="recipe-instruction-viewer">
    <div v-if="recipe && recipe.components && recipe.components.length">
      <div v-for="(component, ci) in recipe.components" :key="ci" class="mb-8">
        <h3 class="text-base font-semibold text-gray-700 mb-3 pb-1 border-b border-gray-200">{{ component.name }}</h3>
        <div class="overflow-x-auto">
          <table class="border-collapse text-sm w-auto min-w-full">
            <tbody>
              <tr v-for="(row, ri) in buildRows(component)" :key="ri">
                <template v-for="(cell, ki) in row.cells" :key="ki">
                  <td
                    v-if="!cell.skip"
                    :rowspan="cell.rowspan || 1"
                    :colspan="cell.colspan || 1"
                    :class="cellClass(cell.type)"
                    class="border border-gray-300 px-3 py-2 align-middle"
                  >{{ cell.text || '' }}</td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <p v-else class="text-gray-400 text-sm italic">No components added yet…</p>
  </div>
</template>

<script>
export default {
  name: 'RecipeInstructionViewer',
  props: {
    recipe: { type: Object, default: null }
  },
  methods: {
    buildRows(component) {
      if (!component || !component.ingredients || component.ingredients.length === 0) return [];

      // Deep-clone rows so we don't mutate props
      const rows = component.ingredients.map(ing => {
        const cells = [{ text: ing.item, type: 'ingredient' }];
        if (ing.prep) cells.push({ text: ing.prep, type: 'prep' });
        return { cells };
      });

      const steps = (component.steps || []).filter(s => s.action && s.rows && s.rows.length > 0);

      steps.forEach(step => {
        const sortedRows = [...step.rows].sort((a, b) => a - b);
        const startRow = sortedRows[0];
        const endRow = sortedRows[sortedRows.length - 1];
        const rowSpan = step.rows.length;

        // Determine max column in affected rows
        let maxCol = 0;
        for (let r = startRow; r <= endRow; r++) {
          if (rows[r]) maxCol = Math.max(maxCol, rows[r].cells.length);
        }

        // Pad affected rows to same width
        for (let r = startRow; r <= endRow; r++) {
          if (rows[r]) {
            while (rows[r].cells.length < maxCol) rows[r].cells.push({ type: 'empty' });
          }
        }

        // Add step cell with rowspan to first affected row
        if (rows[startRow]) {
          rows[startRow].cells.push({ text: step.action, type: 'step', rowspan: rowSpan });
        }

        // Mark subsequent rows to skip the spanned column
        for (let r = startRow + 1; r <= endRow; r++) {
          if (rows[r]) rows[r].cells.push({ skip: true });
        }

        // Pad unaffected rows
        const numIngredients = component.ingredients.length;
        for (let r = 0; r < numIngredients; r++) {
          if ((r < startRow || r > endRow) && rows[r]) {
            if (rows[r].cells.length < maxCol + 1) rows[r].cells.push({ type: 'empty' });
          }
        }
      });

      // Equalize all row lengths
      let maxCols = 0;
      rows.forEach(row => { maxCols = Math.max(maxCols, row.cells.length); });
      rows.forEach(row => {
        while (row.cells.length < maxCols) row.cells.push({ type: 'empty' });
      });

      // Merge consecutive empty cells (colspan)
      rows.forEach(row => {
        let i = 0;
        while (i < row.cells.length) {
          const cell = row.cells[i];
          if (!cell.skip && (cell.type === 'empty' || cell.type === 'ingredient' || cell.type === 'prep')) {
            let colspan = 1;
            let j = i + 1;
            while (j < row.cells.length && row.cells[j].type === 'empty' && !row.cells[j].skip) {
              colspan++;
              row.cells[j].skip = true;
              j++;
            }
            if (colspan > 1) cell.colspan = colspan;
            i = j;
          } else {
            i++;
          }
        }
      });

      return rows;
    },

    cellClass(type) {
      switch (type) {
        case 'ingredient': return 'bg-gray-50 text-gray-800';
        case 'prep':       return 'bg-white text-gray-500 italic text-xs text-center whitespace-nowrap';
        case 'step':       return 'bg-blue-50 text-blue-800 text-center font-medium';
        case 'empty':      return 'bg-white border-gray-200';
        default:           return 'bg-white';
      }
    }
  }
};
</script>

<style scoped>
/* Screen styles */
.recipe-instruction-viewer table {
  border-collapse: collapse;
  margin-bottom: 1.25rem;
}
.recipe-instruction-viewer td {
  border: 1px solid #999;
  padding: 4px 8px;
  vertical-align: middle;
  background-color: white;
}
.recipe-instruction-viewer td.ingredient {
  background-color: #f0f0f0;
  text-align: left;
}
.recipe-instruction-viewer td.prep {
  background-color: #f8f8f8;
  text-align: center;
  font-style: italic;
  font-size: 0.9em;
}
.recipe-instruction-viewer td.step {
  background-color: #e0e0e0;
  text-align: center;
}
.recipe-instruction-viewer td.empty {
  border: 1px solid #ccc;
  background-color: #fafafa;
}

/* Print styles — landscape, compact, fits on one page */
@media print {
  .recipe-instruction-viewer {
    width: 100%;
  }
  .recipe-instruction-viewer .mb-8 {
    margin-bottom: 0.75rem;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .recipe-instruction-viewer h3 {
    font-size: 11px;
    margin-bottom: 4px;
    page-break-after: avoid;
  }
  .recipe-instruction-viewer table {
    width: 100%;
    font-size: 8px;
    margin-bottom: 6px;
  }
  .recipe-instruction-viewer td {
    padding: 3px 5px;
    border: 1px solid #666;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .recipe-instruction-viewer td.ingredient { background-color: #f0f0f0 !important; }
  .recipe-instruction-viewer td.prep       { background-color: #f8f8f8 !important; }
  .recipe-instruction-viewer td.step       { background-color: #e0e0e0 !important; }
  .recipe-instruction-viewer td.empty      { background-color: #fafafa !important; }
}
</style>
