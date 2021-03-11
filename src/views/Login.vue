<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Login</div>

          <div class="card-body">

            <form action="#" @submit.prevent="signInWithGoogle">
              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-light btn-outline-primary"><img src="https://img.icons8.com/color/16/000000/google-logo.png"> Sign in with Google</button>
                </div>
              </div>
            </form>
          </div>

          <hr>

          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <form action="#" @submit.prevent="userLogin">
              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>

                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    value
                    required
                    autofocus
                    v-model="user.email"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>

                <div class="col-md-6">
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    v-model="user.password"
                  />
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Login</button>
                </div>
              </div>
            </form>
            <p class="text-right">
                <router-link :to="{name: 'forgot-password'}">Forgot Password?</router-link>
              </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import firebase from "firebase";

export default {
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      error: '',
    };
  },
  methods: {
    signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider()

      firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        this.$store.commit('SET_LOGGED_IN', true)
        this.$router.push('/')
      })
      .catch((error) => {
        alert(error.message);
      });
    },

    userLogin() {
      firebase
      .auth()
      .signInWithEmailAndPassword(this.user.email, this.user.password)
      .then(() => {
        this.$store.commit('SET_LOGGED_IN', true)
        this.$router.push('/')
      })
      .catch((error) => {
        alert(error.message);
      });
    }
  }
};
</script>