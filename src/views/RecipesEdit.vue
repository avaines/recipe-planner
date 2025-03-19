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

              <div class="mb-2 row">
                <label for="leftovers" class="col-md-4 col-form-label text-md-end">Makes Leftovers?</label>
                <div class="col-md-1">
                  <input id="leftovers" type="checkbox" class="form-check-input" name="leftovers" v-model="recipe.leftovers" />
                </div>

                <label for="timeConsuming" class="col-md-4 col-form-label text-md-end">Time Consuming?</label>
                <div class="col-md-1">
                  <input id="timeConsuming" type="checkbox" class="form-check-input" name="timeConsuming" v-model="recipe.timeConsuming" />
                </div>

                <label for="marinateRequired" class="col-md-4 col-form-label text-md-end">Marinate Required?</label>
                <div class="col-md-1">
                  <input id="marinateRequired" type="checkbox" class="form-check-input" name="marinateRequired" v-model="recipe.marinateRequired" />
                </div>

                <label for="glutenFree" class="col-md-4 col-form-label text-md-end">Gluten Free?</label>
                <div class="col-md-1">
                  <input id="glutenFree" type="checkbox" class="form-check-input" name="glutenFree" v-model="recipe.glutenFree" />
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
import { auth, db } from '@/plugins/firebase.js';

export default {
  data() {
    return {
      recipe: [],
      collectionName: ''
    }
  },
  async created () {
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    const doc = await db.collection('allow-users').doc(user.uid).get();
    if (!doc.exists) {
      return;
    }
    const groupId = doc.data().groupId;
    this.collectionName = `recipes-${groupId}`;

    const ref = db.collection(this.collectionName).doc(this.$route.params.id);
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
      if (!this.recipe.leftovers) {
        this.recipe.leftovers = false;
      }
      if (!this.recipe.timeConsuming) {
        this.recipe.timeConsuming = false;
      }
      if (!this.recipe.marinateRequired) {
        this.recipe.marinateRequired = false;
      }
      if (!this.recipe.glutenFree) {
        this.recipe.glutenFree = false;
      }

      const updateRef = await db.collection(this.collectionName).doc(this.$route.params.id)

      console.log(this.recipe, this.recipe.leftovers, this.recipe.timeConsuming, this.recipe.marinateRequired, this.recipe.glutenFree);
      updateRef.set({
        book: this.recipe.book,
        recipe: this.recipe.recipe,
        leftovers: this.recipe.leftovers,
        timeConsuming: this.recipe.timeConsuming,
        marinateRequired: this.recipe.marinateRequired,
        glutenFree: this.recipe.glutenFree,
        ingredients: this.recipe.ingredients,
      })
      this.$router.push({ name: 'ManageRecipes' });
    }
  }
}
</script>
