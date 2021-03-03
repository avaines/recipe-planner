<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Home</div>
          <div class="card-body">

            <template v-if="user.loggedIn">
              <div class="alert alert-success" role="alert">{{user.data.displayName}}, you are logged in!</div>
              <!-- {{user}} -->
            </template>
            <template v-else>
              <div class="alert alert-danger" role="alert">
                <router-link to="login" class="nav-link">You are not logged in</router-link>
              </div>
            </template>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  }
};
</script>