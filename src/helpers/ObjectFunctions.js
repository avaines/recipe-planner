export default {
    getUniqueIngredients(l) {
        const ingredients_raw = [];
        // Create a list object of ingredients from the csv list
        l.forEach(function (item) {
            item.ingredients.forEach(function (listItem) {
                if (listItem != '') {
                    ingredients_raw.push(listItem);
                }
            });
        });

        // Get the list of how many times a unique ingredient appears in the list
        const ingredient_counts = {};
        ingredients_raw.forEach(function(x) {
            ingredient_counts[x] = (ingredient_counts[x] || 0)+1;
        });

        const ingredients = [];
        for (const [key, value] of Object.entries(ingredient_counts)) {
            ingredients.push(`${key} (${value})`)
            // console.log(`${key} (${value})`);
          }

        return ingredients.sort();
    }

}