<template>
  <ruby :class="`${isFirst || !showRt ? 'mr-1' : 'mx-1'} text-${textColor}`">
    {{ displayedValue }}<rp>(</rp>
    <rt
      v-if="showRt"
      :class="`text-subtitle-1 text-${textColor}`"
    >{{ rt }}</rt>
    <rp>)</rp>
  </ruby>
</template>

<script setup>
import { computed } from 'vue'

  const props = defineProps({
    value: {
      type: String,
      required: true
    },
    rt: {
      type: String,
      default: ''
    },
    showRt: {
      type: Boolean,
      default: true
    },
    isFirst: {
      type: Boolean,
      default: false
    },
    spaceEmphasize: {
      type: Boolean,
      default: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isReading: {
      type: Boolean,
      default: false
    }
  })

  const textColor = computed(() => {
    if (props.isReading) {
      return 'indigo-darken-1';
    }
    if (props.isRead) {
      return 'blue-grey-darken-1';
    }
    return 'black';
  })

  const displayedValue = computed(() => {
    if(props.spaceEmphasize) {
      return props.value.replace(' ', '　');
    }
    else {
      return props.value;
    }
  })
</script>

<style>
</style>
