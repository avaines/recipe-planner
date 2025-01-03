<template>
  <div id="app">
    <div class="shadow">
      <b-navbar toggleable="lg" type="light">
        <b-navbar-brand href="#"><router-link to="/" class="navbar-brand">Recipe Planner</router-link></b-navbar-brand>
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <template v-if="user.loggedIn">

          <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
              <b-nav-item href="/">Create Menu</b-nav-item>
              <b-nav-item href="/add">Add Recipe</b-nav-item>
              <b-nav-item href="/manage">Manage Recipes</b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <!-- <b-nav-form>
                    <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"></b-form-input>
                    <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                </b-nav-form> -->

              <b-nav-item-dropdown right>
                <!-- Using button-content slot -->
                <template slot="button-content"><em><font-awesome-icon icon="bars"/></em></template>
                <b-dropdown-item ><router-link to="profile" class="nav-link"><font-awesome-icon icon="user"/> {{user.data.displayName}}</router-link></b-dropdown-item>
                <b-dropdown-item ><a class="nav-link" @click="signOut">Sign out</a></b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>

        </template><template v-else>
          <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav class="ml-auto">
              <b-navbar-nav>
                <b-nav-item><router-link to="login" class="nav-link">Login</router-link></b-nav-item>
                <b-nav-item><router-link to="signup" class="nav-link">Register</router-link></b-nav-item>
              </b-navbar-nav>
            </b-navbar-nav>
          </b-collapse>
        </template>
      </b-navbar>
    </div>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import firebase from "firebase";

export default {
  computed: {
    ...mapGetters({
      // map `this.user` to `this.$store.getters.user`
      user: "user"
    })
  },
  methods: {
    signOut() {
      firebase.auth().signOut().then(() => {
        firebase.auth().onAuthStateChanged(() => {
          this.$router.push('/login')
        })
      })
    }
  }
};
</script>