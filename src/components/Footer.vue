<!-- src/components/Footer.vue -->
<template>
  <hr>
  <footer class="footer d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-to col-md-10">
      <div class="col-md-2"></div>
      <div class="col-md-4 d-flex align-items-center">
        <a href="/" class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
          <svg class="bi" width="30" height="24"><use xlink:href="#bootstrap"></use></svg>
        </a>
        <span class="mb-3 mb-md-0 text-body-secondary">All rights reserved, <a href='https://www.vaines.org'>Vaines.org</a></span>
      </div>

      <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li class="ms-3"><a class="text-body-secondary" href="https://github.com/avaines/recipe-planner/" target="_blank"><i class="bi bi-github"></i></a></li>
        <li class="ms-3"><a class="text-body-secondary" href="https://www.vaines.org" target="_blank"><i class="bi bi-house"></i></a></li>
      </ul>
  </footer>
<br>

</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer'
});
</script>

<style scoped>
.footer {
  background-color: #f8f9fa;
  padding: 1rem 0;
  text-align: center;
}
</style>