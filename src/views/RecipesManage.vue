<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card">
          <div class="card-header">Recipe List</div>
          <div class="card-body">
            <div class="col-md-12">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Recipe</th>
                    <th>Lunch</th>
                    <th>Ingredients</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="recipe in recipes" :key="recipe.id">
                    <td>{{ recipe.book }}</td>
                    <td>{{ recipe.recipe }}</td>
                    <td>{{ recipe.lunch }}</td>
                    <td>{{ recipe.ingredients }}</td>
                    <td>
                      <router-link :to="{name: 'edit', params: { id: recipe.id }}" class="btn btn-primary mr-2">Edit</router-link>
                      <button class="btn btn-danger" @click.prevent="deleteRecipe(recipe.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const firebase = require('@/plugins/firebase.js');
import { mapGetters } from "vuex";

export default {
  data() {
    return {}
  },
  mounted () {
    this.getRecipes()
  },
  methods: {
    getRecipes () {
      this.$store.dispatch('loadRecipes')
    },
    async deleteRecipe(id) {
      console.log("Test")
      await firebase.db.collection('recipes').doc(id).delete()
      this.getRecipes()
    }
  },
  computed: {
    ...mapGetters({
      recipes: "recipes"
    })
  }
};
</script>
