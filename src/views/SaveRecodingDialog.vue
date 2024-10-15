<template>
  <div>
    <v-dialog
      v-model="showDialog"
      width="100%"
      max-width="400px"
      class="ma-6"
    >
      <v-card>
        <v-card-title>
          Save Recorded TimeLine?
        </v-card-title>
        <v-card-text align="end">
          <v-btn
            class="mr-2 bg-success"
            @click="saveTimeLine"
          >Yes</v-btn>
          <v-btn
            class="bg-warning"
            @click="close"
          >No</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick } from 'vue'
import { lyricsDB } from '@/common/indexedDB';

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  lyricsId: {
    type: Number,
  },
  timelineList: {
    type: Array,
  },
})

const emits = defineEmits(['close-dialog', 'refresh'])
const showDialog = computed({
  get() {
    return props.value;
  },
  set(val) {
    emits("close-dialog");
  }
})

const saveTimeLine = () => {
  lyricsDB.updatelyricSchedule(props.lyricsId, [...props.timelineList]);
  emits('close-dialog');
  emits('refresh');
};

const close = () => {
  emits('close-dialog');
};

</script>

<style>
</style>
