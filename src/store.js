import Vue from "vue";
import Vuex from "vuex";
import { db } from '@/main'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: {
      loggedIn: false,
      data: null
    }
  },
  getters: {
    user(state){
      return state.user
    },
    posts(state){
      return state.posts
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    setPosts: (state, posts) => {
      state.posts = posts
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
    loadPosts: async context => {
      let snapshot = await db.collection('posts').get()
      const posts = []
      snapshot.forEach(doc => {
        let appData = doc.data()
        appData.id = doc.id
        posts.push(appData)
      })
      context.commit('setPosts', posts)
    }
  }
});
