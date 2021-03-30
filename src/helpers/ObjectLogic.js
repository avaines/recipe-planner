export default {
    getUniqueIngredients(l) {
        const ingredients = [];
        l.forEach(function (item) {
            item.ingredients.forEach(function (listItem) {
                if (listItem != '' && !ingredients.includes(listItem) ) {
                    ingredients.push(listItem);
                }
            });
        });

        return ingredients.sort();
    }

}