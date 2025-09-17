<template>
    <div class="vue-tempalte">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">Register</div>
            <div class="card-body">
              <div v-if="error" class="alert alert-danger">{{error}}</div>
              <form action="#" @submit.prevent="userRegistration">
                <div class="mb-3 row">
                  <label for="name" class="col-md-4 col-form-label text-md-right">Name</label>

                  <div class="col-md-6">
                    <input
                      id="name"
                      type="name"
                      class="form-control"
                      name="name"
                      value
                      required
                      autofocus
                      v-model="user.name"
                    />
                  </div>
                </div>

                <div class="mb-3 row">
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

                <div class="mb-3 row">
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

                <div class="mb-3 row mb-0">
                  <div class="col-md-8 offset-md-4">
                    <button type="submit" class="btn btn-primary">Register</button>
                  </div>
                </div>
              </form>
              <p class="forgot-password text-right">
                Already registered
                <router-link :to="{name: 'Login'}">sign in?</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { defineComponent } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { auth, db } from '@/plugins/firebase.js';

export default defineComponent({
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: ''
      },
      error:''
    };
  },

  methods: {
    userRegistration() {
      auth
      .createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then((res) => {
        res.user
          .updateProfile({
            displayName: this.user.name
          })
          .then(() => {
            const userId = res.user.uid;
            const groupId = uuidv4();
            db.collection('allow-users').doc(userId).set({
              displayName: res.user.name,
              email: res.user.email,
              enabled: false,
              csvEnabled: false,
              groupId: groupId
            })
            .then(() => {
              this.$router.push({ name: 'Login' });
            })
            .catch((error) => {
              alert(error.message);
            });
          });
      })
      .catch((error) => {
         alert(error.message);
      });
    }
  }
});
</script>