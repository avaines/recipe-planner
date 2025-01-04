<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <br>
        <div class="card">
          <div class="card-header">Recipe List</div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                  <button class="btn btn-primary" onclick="location.href='/add'" type="button">Add Recipe</button>
              </div>
              <div class="col-md-4">
                <input type="text" v-model="filterText" placeholder="Filter by recipe name" class="form-control mb-2" />
              </div>
              <div class="col-md-2">
                <select v-model="sortKey" class="form-control mb-2">
                  <option value="book">Sort by Book</option>
                  <option value="recipe">Sort by Recipe</option>
                  <option value="lunch">Sort by Lunch</option>
                </select>
              </div>
              <div class="col-md-1">
                <button class="btn btn-primary" @click="sortOrderAsc = !sortOrderAsc">
                  {{ sortOrderAsc ? 'Asc' : 'Desc' }}
                </button>
              </div>
            </div>
            <br>
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
                  <tr v-for="recipe in filteredAndSortedRecipes" :key="recipe.id">
                    <td>{{ recipe.book }}</td>
                    <td>{{ recipe.recipe }}</td>
                    <td>{{ recipe.lunch }}</td>
                    <td>{{ recipe.ingredients }}</td>
                    <td class="col-md-2">
                      <router-link :to="{name: 'edit', params: { id: recipe.id }}" class="btn btn-primary mr-2"><font-awesome-icon icon="pencil-alt"/></router-link>
                      <button class="btn btn-danger" @click.prevent="deleteRecipe(recipe.id)"><font-awesome-icon icon="trash-alt"/></button>
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
import { defineComponent } from 'vue';

const firebase = require('@/plugins/firebase.js');
import { mapGetters } from "vuex";

export default defineComponent({
  data() {
    return {
      filterText: '',
      sortKey: 'recipe',
      sortOrderAsc: true
    }
  },

  mounted () {
    this.getRecipes()
  },

  methods: {
    getRecipes () {
      this.$store.dispatch('loadRecipes')
    },
    async deleteRecipe(id) {
      if (confirm("Are you sure?") == true) {
        await firebase.db.collection('recipes').doc(id).delete()
        this.getRecipes()
      }
    }
  },

  computed: {
    ...mapGetters({
      recipes: "recipes"
    }),
    filteredAndSortedRecipes() {
      let filteredRecipes = this.recipes.filter(recipe =>
        recipe.recipe.toLowerCase().includes(this.filterText.toLowerCase())
      );

      let sortedRecipes = filteredRecipes.sort((a, b) => {
        let modifier = this.sortOrderAsc ? 1 : -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });

      return sortedRecipes;
    }
  },
});
</script>
