<template>
  <div>
    <navbar></navbar>
    <main class="py-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import navbar from "./components/Navbar";
import './static/app.css'

export default {
  components: {
    navbar
  },
  watch: {
    '$route' (to) {
      document.title = to.meta.title || 'Recipe Planner'
    }
  }
};
</script>
