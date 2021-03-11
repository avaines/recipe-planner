import Vue from "vue";
import Vuex from "vuex";
const firebase = require('@/plugins/firebase.js');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    recipes: [],
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
      state.recipes = recipes
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
    }
  }
});
