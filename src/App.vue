<template>
  <div>
    <navbar></navbar>
    <main class="py-4">
      <router-view></router-view>
    </main>
  </div>
</template>
<script>
import { defineComponent } from 'vue';

import navbar from "@/components/Navbar";

export default defineComponent({
  components: {
    navbar
  },
});
</script>
