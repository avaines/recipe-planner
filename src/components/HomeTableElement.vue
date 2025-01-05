<template>
  <div class="col border">
    <div class="row">
      <div class="col-10">
        <b>{{ book }}</b>
      </div>
      <div class="col-2 justify-content-right">
        <span v-if="lunch == true">
          <i class="bi bi-box2-heart"></i>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
      {{ recipe }}
      <p></p>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data: function() {
    return {}
  },
  props: ['book', 'lunch', 'recipe'],
};

</script>
