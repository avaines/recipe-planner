<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Forgot Password</div>

          <div class="card-body">

            <form @submit.prevent="forgetPassword">
              <div class="row mb-3">
                <label for="email" class="col-md-4 col-form-label text-md-end">Email</label>

                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    required
                    autofocus
                    v-model="user.email"
                  />
                </div>
              </div>
              <div class="row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Reset password</button>
                </div>
              </div>
            </form>
            <p class="text-end">
              <router-link :to="{name: 'ForgotPassword'}">Forgot Password?</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { defineComponent } from 'vue';
import firebase from "firebase";

export default defineComponent({
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
  },
});
</script>