<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Edit Recipe</div>
          <div class="card-body">
            <form @submit.prevent="updateRecipe">
              <div class="mb-3 row">
                <label for="book" class="col-md-4 col-form-label text-md-end">Recipe Book</label>

                <div class="col-md-6">
                  <input
                    id="book"
                    type="text"
                    class="form-control"
                    name="book"
                    required
                    autofocus
                    v-model="recipe.book"
                  />
                </div>
              </div>

              <div class="mb-3 row">
                <label for="recipe" class="col-md-4 col-form-label text-md-end">Recipe</label>

                <div class="col-md-6">
                  <input
                    id="recipe"
                    type="text"
                    class="form-control"
                    name="recipe"
                    required
                    v-model="recipe.recipe"
                  />
                </div>
              </div>

              <div class="mb-3 row">
                <label for="lunch" class="col-md-4 col-form-label text-md-end">Lunch?</label>

                <div class="col-md-1">
                  <input
                    id="lunch"
                    type="checkbox"
                    class="form-check-input"
                    name="lunch"
                    v-model="recipe.lunch"
                  />
                </div>
              </div>

              <div class="mb-3 row">
                <label for="ingredients" class="col-md-4 col-form-label text-md-end">Ingredients</label>

                <div class="col-md-6">
                  <textarea
                    id="ingredients"
                    type="text"
                    class="form-control"
                    name="recipe"
                    required
                    rows="5"
                    :min-height="50"
                    v-model="recipe.ingredients"
                  />
                </div>
              </div>

              <div class="row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Update Recipe</button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const firebase = require('@/plugins/firebase.js');

export default {
  data() {
    return {
      recipe: []
    }
  },
  created () {
    const ref = firebase.db.collection('recipes').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.recipe = doc.data();
      } else {
        alert("No such recipe!");
      }
    });
  },
  methods: {
    async updateRecipe () {
      const updateRef = await firebase.db.collection('recipes').doc(this.$route.params.id)
      updateRef.set({
        book: this.recipe.book,
        recipe: this.recipe.recipe,
        lunch: this.recipe.lunch,
        ingredients: this.recipe.ingredients,
      })
      this.$router.push({ name: 'ManageRecipes' });
    }
  }
}
</script>
