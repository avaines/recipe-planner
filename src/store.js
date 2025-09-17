import { createStore } from "vuex";
import { auth, db } from '@/plugins/firebase.js';
import rndHelpers from '@/helpers/RandomFunctions';
import objHelpers from '@/helpers/ObjectFunctions';

const store = createStore({
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
    },
    isLoggedIn: false,
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
      state.isLoggedIn = value;
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
      state.weekRecipes.w1.shoppingList = objHelpers.getUniqueIngredients(state.weekRecipes.w1);

      state.weekRecipes.w2 = ensureArrayIngredients(uniqueRecipes.slice(daysPerWeek, daysPerWeek * 2));
      state.weekRecipes.w2.shoppingList = objHelpers.getUniqueIngredients(state.weekRecipes.w2);

      state.weekRecipes.w3 = ensureArrayIngredients(uniqueRecipes.slice(daysPerWeek * 2, daysPerWeek * 3));
      state.weekRecipes.w3.shoppingList = objHelpers.getUniqueIngredients(state.weekRecipes.w3);

      state.weekRecipes.w4 = ensureArrayIngredients(uniqueRecipes.slice(daysPerWeek * 3, daysPerWeek * 4));
      state.weekRecipes.w4.shoppingList = objHelpers.getUniqueIngredients(state.weekRecipes.w4);
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
      const user = auth.currentUser;
      if (!user) {
        return;
      }

      const doc = await db.collection('allow-users').doc(user.uid).get();
      if (!doc.exists) {
        return;
      }

      const groupId = doc.data().groupId;
      const collectionName = `recipes-${groupId}`;
      let snapshot = await db.collection(collectionName).get();
      const recipes = [];
      snapshot.forEach(doc => {
        let appData = doc.data();
        appData.id = doc.id;
        recipes.push(appData);
      });
      context.commit('setRecipes', recipes);
    },
    loadWeeksRecipes: async context => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }

      const doc = await db.collection('allow-users').doc(user.uid).get();
      if (!doc.exists) {
        return;
      }

      const groupId = doc.data().groupId;
      const collectionName = `recipes-${groupId}`;
      const requiredRecipes = 20; // This will eventually move to a variable when it becomes an option for the user, currently static at 20
      const daysPerWeek = requiredRecipes / 4;

      let snapshot = await db.collection(collectionName).get();
      const recipes = [];

      if (snapshot.size <= requiredRecipes) {
        // There are less than or equal to the number of recipes that are needed, so reuse them to reach the required number
        snapshot.forEach(doc => {
          let appData = doc.data();
          appData.id = doc.id;
          recipes.push(appData);
        });
        if (recipes.length !== 0) {
          // Shuffle recipes so each regeneration changes order even with small datasets
          for (let i = recipes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [recipes[i], recipes[j]] = [recipes[j], recipes[i]];
          }
          // Reuse (cycling) to reach the required number while preserving shuffled order pattern
          let idx = 0;
            while (recipes.length < requiredRecipes) {
              recipes.push(recipes[idx % (snapshot.size) ]);
              idx++;
            }
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
    },
    async checkUserAuthentication({ commit }) {
      const user = auth.currentUser;

      if (user) {
        try {
          const doc = await db.collection('allow-users').doc(user.uid).get();
          if (doc.exists && doc.data().enabled) {
            commit('SET_LOGGED_IN', true);
            commit('SET_USER', user);
          } else {
            alert('Your account is not enabled. Please contact support.');
            await auth.signOut();
            commit('SET_LOGGED_IN', false);
            commit('SET_USER', null);
          }
        } catch (error) {
          console.error("Error checking user enabled status: ", error);
          await auth.signOut();
          commit('SET_LOGGED_IN', false);
          commit('SET_USER', null);
        }
      } else {
        commit('SET_LOGGED_IN', false);
        commit('SET_USER', null);
      }
    }
  }
});

export default store;
