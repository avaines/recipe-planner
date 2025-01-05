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
                <router-link :to="{name: 'AddRecipe'}" class="btn btn-primary" type="button">Add Recipe</router-link>
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
                      <router-link :to="{name: 'Edit', params: { id: recipe.id }}" class="btn btn-primary mr-2"><font-awesome-icon icon="pencil-alt"/></router-link>
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
      sortOrderAsc: true,
      recipes: [],
      collectionName: ''
    }
  },

  async created () {
    const user = firebase.auth.currentUser;
    if (!user) {
      return;
    }
    const doc = await firebase.db.collection('allow-users').doc(user.uid).get();
    if (!doc.exists) {
      return;
    }
    const groupId = doc.data().groupId;
    this.collectionName = `recipes-${groupId}`;

    const ref = firebase.db.collection(this.collectionName);
    ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.recipes.push({ id: doc.id, ...doc.data() });
      });
    });
  },

  methods: {
    async deleteRecipe(id) {
      if (confirm("Are you sure?") == true) {
        const deleteRef = await firebase.db.collection(this.collectionName).doc(id);
        deleteRef.delete().then(() => {
          this.recipes = this.recipes.filter(recipe => recipe.id !== id);
        }).catch((error) => {
          console.error("Error removing document: ", error);
        });
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
