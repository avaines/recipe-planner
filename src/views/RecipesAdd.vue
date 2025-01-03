<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Add A Recipe</div>
          <div class="card-body">
            <form @submit.prevent="addRecipe">
              <div class="form-group row">
                <label for="book" class="col-md-4 col-form-label text-md-right">Recipe Book</label>

                <div class="col-md-6">
                  <input id="book" type="text" class="form-control" name="book" required autofocus v-model="book" />
                </div>
              </div>

              <div class="form-group row">
                <label for="recipe" class="col-md-4 col-form-label text-md-right">Recipe</label>

                <div class="col-md-6">
                  <input id="recipe" type="text" class="form-control" name="recipe" required v-model="recipe" />
                </div>
              </div>

              <div class="form-group row">
                <label for="lunch" class="col-md-4 col-form-label text-md-right">Lunch?</label>

                <div class="col-md-1">
                  <input id="lunch" type="checkbox" class="form-control" name="lunch" v-model="lunch" />
                </div>
              </div>
                  <div class="form-group row">
                    <label for="ingredientsInput" class="col-md-4 col-form-label text-md-right">Add Ingredient:</label>
                    <div class="col-md-6">
                      <input type="text" class="form-control" @keydown.enter.prevent="addItem" v-model="newItem" ref="ingredientsInput" id="ingredientsInput">
                    </div>
                    <div class="col-sm-2">
                      <button type="button" @click="addItem" class="btn btn-success">Add</button>
                    </div>
                  </div>

                  <div v-for="(item, index) in ingredients" :key="index" class="form-group row">
                    <label class="col-md-4 col-form-label text-md-right">{{ item }}</label>
                    <div class="col-md-6 row">
                      <div class="col-md-2">
                        <button type="button" @click="editItem(index)" class="btn btn-primary">Edit</button>
                      </div>
                      <div class="col-md-2">
                        <button type="button" @click="deleteItem(index)" class="btn btn-danger">Delete</button>
                      </div>
                    </div>
                  </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Create</button>
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
      book: null,
      recipe: null,
      lunch: false,
      ingredients: [],
      newItem: ''
    }
  },
  methods: {
    async addRecipe() {
      const joinedIngredients = this.ingredients.join(', ');

      await firebase.db.collection('recipes').add({
        book: this.book,
        recipe: this.recipe,
        lunch: this.lunch,
        ingredients: joinedIngredients
      })
      this.$router.push({ name: 'manageRecipes' });
    },
    toSentenceCase(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    addItem() {
      const value = this.newItem.trim();
      if (value) {
        const sentenceCaseValue = this.toSentenceCase(value);

        // Avoid adding anything that already exists
        if (!this.ingredients.includes(sentenceCaseValue)) {
          this.ingredients.push(sentenceCaseValue);
          this.newItem = '';
        } else{
          alert(sentenceCaseValue + ' is/are already in the list');
        }
      }
      this.$refs.ingredientsInput.focus();
    },
    editItem(index) {
      const newItem = prompt('Edit item:', this.ingredients[index]);
      if (newItem !== null) {
        this.$set(this.ingredients, index, this.toSentenceCase(newItem.trim()));
      }
    },
    deleteItem(index) {
      this.ingredients.splice(index, 1);
    }
  }
}
</script>
