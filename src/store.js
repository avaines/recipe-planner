import Vue from "vue";
import Vuex from "vuex";
const firebase = require('@/plugins/firebase.js');
import rndHelpers from '@/helpers/random';

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
    setWeekRecipes: (state, {daysPerWeek, recipes}) => {
      state.weekRecipes.w1 = recipes.slice(0, daysPerWeek);
      state.weekRecipes.w2 = recipes.slice(daysPerWeek, daysPerWeek*2);
      state.weekRecipes.w3 = recipes.slice(daysPerWeek*2, daysPerWeek*3);
      state.weekRecipes.w4 = recipes.slice(daysPerWeek*3, daysPerWeek*20);
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
      const requiredRecipes = 20 // This will eventually move to a variable when it becomes an option for the user, currently static at 20
      const daysPerWeek = requiredRecipes/4

      let snapshot = await firebase.db.collection('recipes').get()
      // if length is more than requiredRecipes then ensure unique, else duplicates are fine

      const recipes = []
      if (snapshot.size <= requiredRecipes) {
        // There are less than or equal to the number of recipes that are needed, so just return all of them
        snapshot.forEach(doc => {
          let appData = doc.data()
          appData.id = doc.id
          recipes.push(appData)
        })
        context.commit('setWeekRecipes', requiredRecipes/4 ,recipes)

      } else {
        // There are more recipes in the database that are needed, so get a list of unique numbers between 0 and the total number of records. then obtain those particular records only.
        let indexes = rndHelpers.uniqueRandomNumbers(0, snapshot.size, requiredRecipes)
        // console.log("numbers: ", indexes)

        indexes.forEach(i=> {
          let doc = snapshot.docs[i]
          let appData = doc.data()
          appData.id = doc.id

          recipes.push(appData)
        })

        context.commit('setWeekRecipes', {daysPerWeek, recipes})
      }
    }
  }
});
