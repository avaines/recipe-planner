<template>
  <div class="col-md-12">

    <template v-if="user.loggedIn">
      <div class="row justify-content-center">
        <div class="col-md-12" style="min-width: 640px;">
          <div class="card">
            <div class="card-header">Calendar</div>
            <div class="card-body">
              <div class="col-md-12 justify-content-center">

                <div class="row">
                  <div class="col border">
                    <h5>Day 1</h5>
                  </div>
                  <div class="col border">
                    <h5>Day 2</h5>
                  </div>
                  <div class="col border">
                    <h5>Day 3</h5>
                  </div>
                  <div class="col border">
                    <h5>Day 4</h5>
                  </div>
                  <div class="col border">
                    <h5>Day 5</h5>
                  </div>
                </div>

                <!-- Week 1 -->
                <div class="row">
                  <HomeTableElement
                    v-for="recipe in weekRecipes.w1"
                    v-bind:key="recipe.id"
                    v-bind:book="recipe.book"
                    v-bind:lunch="recipe.lunch"
                    v-bind:recipe="recipe.recipe"
                  ></HomeTableElement>
                </div>


                <!-- Week 2 -->
                <div class="row">
                  <HomeTableElement
                    v-for="recipe in weekRecipes.w2"
                    v-bind:key="recipe.id"
                    v-bind:book="recipe.book"
                    v-bind:lunch="recipe.lunch"
                    v-bind:recipe="recipe.recipe"
                  ></HomeTableElement>
                </div>

                <!-- Week 3 -->
                <div class="row">
                  <HomeTableElement
                    v-for="recipe in weekRecipes.w3"
                    v-bind:key="recipe.id"
                    v-bind:book="recipe.book"
                    v-bind:lunch="recipe.lunch"
                    v-bind:recipe="recipe.recipe"
                  ></HomeTableElement>
                </div>

                <!-- Week 4 -->
                <div class="row">
                  <HomeTableElement
                    v-for="recipe in weekRecipes.w4"
                    v-bind:key="recipe.id"
                    v-bind:book="recipe.book"
                    v-bind:lunch="recipe.lunch"
                    v-bind:recipe="recipe.recipe"
                  ></HomeTableElement>
                </div>

              </div>

          </div> <!-- card -->
        </div>

      </div>
    </div>
    <hr style="page-break-after: always;">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card">
            <div class="card-header">Shopping List</div>
            <div class="card-body table-responsive">
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
                    <td>
                      <ul class="list-unstyled">
                        <li v-for="ingredient in weekRecipes.w1.shoppinglist" v-bind:key="ingredient.id"> {{ ingredient }} </li>
                      </ul>
                    </td>
                    <td>
                      <ul class="list-unstyled">
                        <li v-for="ingredient in weekRecipes.w2.shoppinglist" v-bind:key="ingredient.id"> {{ ingredient }} </li>
                      </ul>
                    </td>
                    <td>
                      <ul class="list-unstyled">
                        <li v-for="ingredient in weekRecipes.w3.shoppinglist" v-bind:key="ingredient.id"> {{ ingredient }} </li>
                      </ul>
                    </td>
                    <td>
                      <ul class="list-unstyled">
                        <li v-for="ingredient in weekRecipes.w4.shoppinglist" v-bind:key="ingredient.id"> {{ ingredient }} </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">Home</div>
            <div class="card-body">
                <router-link to="Login" class="nav-link">You are not logged in</router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
    </div>
</template>


<script>
import { defineComponent } from 'vue';
import { mapGetters } from "vuex";
import HomeTableElement from "@/components/HomeTableElement.vue";

export default defineComponent({
  data() {
    return {}
  },

  mounted () {
    this.getRecipes()
  },

  methods: {
    getRecipes () {
      this.$store.dispatch('loadWeeksRecipes');
    }
  },

  components: {
    HomeTableElement
  },

  computed: {
    ...mapGetters({
      user: "user",
      weekRecipes: "weekRecipes"
    })
  },
});
</script>