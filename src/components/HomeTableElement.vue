<template>
  <div class="col border">
    <div class="row">
      <div class="col-md-10">
        <b>{{ book }}</b>
      </div>
      <div class="col-md-2">
        <span v-if="lunch == 'Yes'">
          x
          <i class="far fa-toolbox"></i>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
      {{ recipe }}
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data: function() {
    return {
      // nothing
    }
  },
  props: ['book', 'lunch', 'recipe'],
};

</script>
