<template>
  <div>
    <Navbar></Navbar>
    <main class="py-4">
      <router-view></router-view>
    </main>
    <Footer></Footer>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default defineComponent({
  components: {
    Navbar,
    Footer
  },
});
</script>
