<template>
  <div class="col border">
    <div class="row">
      <div class="col-8">
        <b>{{ book }}</b>
      </div>
      <div class="col-4 justify-content-right">
        <span v-if="leftovers == true">
          <i class="bi bi-box2-heart" title="Produces leftovers"></i>
        </span>
        <span v-if="timeConsuming == true">
          <i class="bi bi-hourglass-split" title="Time consuming"></i>
        </span>
        <span v-if="marinateRequired == true">
          <i class="bi bi-droplet-half" title="Requires marinating"></i>
        </span>
        <span v-if="glutenFree == true">
          <i class="bi bi-feather2" title="Gluten free"></i>
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
  props: ['book', 'leftovers', 'timeConsuming', 'marinateRequired', 'glutenFree', 'recipe'],
};

</script>
