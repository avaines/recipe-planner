<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Profile</div>
            <div class="card-body">
              <form @submit.prevent="signOut">
                <div class="form-group row">
                  <label class="col-md-4 h5 text-md-right">Name:</label>
                    <div class="col-md-6">
                      <p>{{user.displayName}}</p>
                    </div>
                </div>

                <div class="form-group row">
                  <label class="col-md-4 h5 text-md-right">Email Address:</label>
                    <div class="col-md-6">
                      <p>{{user.email}}</p>
                    </div>
                </div>

                <div class="form-group row mb-0">
                  <div class="col-md-8 offset-md-4">
                    <button type="submit" class="btn btn-primary">Sign out</button>
                  </div>
                </div>
              </form>
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
      user: null
    };
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
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
