<template>
  <div class="container">

  <template v-if="user.loggedIn">

    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Calendar</div>
          <div class="card-body">
            <div class="alert alert-success" role="alert">{{user.data.displayName}}, you are logged in!</div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">Shopping List</div>
          <div class="card-body">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Week 1</th>
                    <th>Week 2</th>
                    <th>Week 3</th>
                    <th>Week 4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Week 1 ingredients</td>
                    <td>Week 2 ingredients</td>
                    <td>Week 3 ingredients</td>
                    <td>Week 4 ingredients</td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>
  </template><template v-else>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Home</div>
          <div class="card-body">
              <router-link to="login" class="nav-link">You are not logged in</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
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