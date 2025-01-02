import Vue from "vue";
import Vuex from "vuex";
const firebase = require('@/plugins/firebase.js');
import rndHelpers from '@/helpers/RandomFunctions';
import objHelpers from '@/helpers/ObjectFunctions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    recipes: [],
    weekRecipes:{
      w1:[],
      w2:[],
      w3:[],
      w4:[]
    },
    user: {
      loggedIn: false,
      data: null
    }
  },
  getters: {
    user(state){
      return state.user
    },
    recipes(state){
      return state.recipes
    },
    weekRecipes(state){
      return state.weekRecipes
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    setRecipes: (state, recipes) => {
      state.recipes = recipes;
    },
    setWeekRecipes: (state, { daysPerWeek, recipes }) => {
      const uniqueRecipes = recipes.map((recipe, index) => ({
        ...recipe,
        id: `${recipe.id}-${index}`
      }));

      const ensureArrayIngredients = recipes => recipes.map(recipe => ({
        ...recipe,
        ingredients: Array.isArray(recipe.ingredients) 
          ? recipe.ingredients 
          : recipe.ingredients.split(",").map(item => item.trim())
      }));

      state.weekRecipes.w1 = ensureArrayIngredients(uniqueRecipes.slice(0, daysPerWeek));
      state.weekRecipes.w1.shoppinglist = objHelpers.getUniqueIngredients(state.weekRecipes.w1);

      state.weekRecipes.w2 = ensureArrayIngredients(uniqueRecipes.slice(daysPerWeek, daysPerWeek * 2));
      state.weekRecipes.w2.shoppinglist = objHelpers.getUniqueIngredients(state.weekRecipes.w2);

      state.weekRecipes.w3 = ensureArrayIngredients(uniqueRecipes.slice(daysPerWeek * 2, daysPerWeek * 3));
      state.weekRecipes.w3.shoppinglist = objHelpers.getUniqueIngredients(state.weekRecipes.w3);

      state.weekRecipes.w4 = ensureArrayIngredients(uniqueRecipes.slice(daysPerWeek * 3, daysPerWeek * 4));
      state.weekRecipes.w4.shoppinglist = objHelpers.getUniqueIngredients(state.weekRecipes.w4);
    }
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        commit("SET_USER", null);
      }
    },
    loadRecipes: async context => {
      let snapshot = await firebase.db.collection('recipes').get()
      const recipes = []
      snapshot.forEach(doc => {
        let appData = doc.data()
        appData.id = doc.id
        recipes.push(appData)
      })
      context.commit('setRecipes', recipes)
    },
    loadWeeksRecipes: async context => {
      const requiredRecipes = 20; // This will eventually move to a variable when it becomes an option for the user, currently static at 20
      const daysPerWeek = requiredRecipes / 4;

      let snapshot = await firebase.db.collection('recipes').get();
      const recipes = [];

      if (snapshot.size <= requiredRecipes) {
        // There are less than or equal to the number of recipes that are needed, so reuse them to reach the required number
        snapshot.forEach(doc => {
          let appData = doc.data();
          appData.id = doc.id;
          recipes.push(appData);
        });

        // Reuse recipes to reach the required number
        while (recipes.length < requiredRecipes) {
          recipes.push(...recipes.slice(0, requiredRecipes - recipes.length));
        }

        context.commit('setWeekRecipes', { daysPerWeek, recipes });
      } else {
        // There are more recipes in the database that are needed, so get a list of unique numbers between 0 and the total number of records. then obtain those particular records only.
        let indexes = rndHelpers.uniqueRandomNumbers(0, snapshot.size, requiredRecipes);

        indexes.forEach(i => {
          let doc = snapshot.docs[i];
          let appData = doc.data();
          appData.id = doc.id;

          appData.ingredients = appData.ingredients.split(",").map(item => item.trim());

          recipes.push(appData);
        });

        context.commit('setWeekRecipes', { daysPerWeek, recipes });
      }
    }
  }
});
