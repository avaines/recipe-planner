<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Forgot Password</div>

          <div class="card-body">

            <form @submit.prevent="forgetPassword">
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
              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Reset password</button>
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
        email: ''
      }
    };
  },
  methods: {
    forgetPassword() {
        firebase
        .auth()
        .sendPasswordResetEmail(this.user.email)
        .then(() => {
            alert('Check your registered email to reset the password!')
            this.user = {
              email: ''
            }
        }).catch((error) => {
          alert(error)
        })
    }
  }
};
</script>