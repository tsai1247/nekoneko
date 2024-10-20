<template>
  <v-overlay
    v-model="showLoad"
    z-index="9999"
    persistent
    class="d-flex align-center justify-center"
  >
    <v-progress-circular
      indeterminate
      :size="100"
      :width="10"
      color="blue-lighten-3"
    ></v-progress-circular>
  </v-overlay>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
});

const showLoad = computed({
  get() {
    return props.value;
  },
})

</script>

<style>
</style>
