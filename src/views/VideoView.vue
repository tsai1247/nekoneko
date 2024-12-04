<template>
  <div ref="videoViewRef">
    <v-row>
      <v-col cols="12">
        <yt-frame
          ref="playerRef"
          @on-ended="playerRef?.replayVideo"
          :style="{
            height: videoHeight + 'px',
          }"
        ></yt-frame>
      </v-col>
      <v-col cols="12">
        <div>
          <v-tooltip location="right">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                @click="updateRecordStatus"
                :color="isRecording && videoId ? `red`: `grey`"
                :disabled="videoId === null"
              >
                <v-icon size="large">
                  mdi-radiobox-marked
                </v-icon>
              </v-btn>
            </template>
            <span>Click to record lyrics timeline.</span>
          </v-tooltip>

          <span
            v-if="isRecording"
            class="mx-2"
          >
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-large"
                  class="mx-1"
                  @click="resetRecord"
                >mdi-home</v-icon>
              </template>
              <span>Start from 00:00</span>
            </v-tooltip>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-large"
                  class="mx-1"
                  @click="stepBack"
                >mdi-step-backward</v-icon>
              </template>
              <span>Back to privious lyrics</span>
            </v-tooltip>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-large"
                  class="mx-1"
                  @click="setRecord"
                >mdi-play</v-icon>
              </template>
              <span>Record current time</span>
            </v-tooltip>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-large"
                  class="mx-1"
                  @click="stepForward(5)"
                >mdi-step-forward</v-icon>
              </template>
              <span>Fast forward for 5 seconds</span>
            </v-tooltip>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-large"
                  class="mx-1"
                  @click="saveRecord"
                >mdi-content-save</v-icon>
              </template>
              <span>Save record</span>
            </v-tooltip>
          </span>
          <span
            v-else
            class="mx-2"
          >
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-large"
                  class="mx-1"
                  @click="seekTo(lyricSchedule?.at(0))"
                >mdi-numeric-1-circle-outline</v-icon>
              </template>
              <span>Start from first line</span>
            </v-tooltip>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-large"
                  class="mx-1"
                  @click="rewind"
                >mdi-step-backward</v-icon>
              </template>
              <span>Rewind for 5 seconds</span>
            </v-tooltip>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-if="isPlaying()"
                  v-bind="props"
                  size="x-large"
                  class="mx-1"
                  @click="switchVideo"
                >mdi-pause-circle-outline</v-icon>
                <v-icon
                  v-else
                  v-bind="props"
                  size="x-large"
                  class="mx-1"
                  @click="switchVideo"
                >mdi-play-circle-outline</v-icon>
              </template>
              <span v-if="isPlaying()">Pause</span>
              <span v-else>Play</span>
            </v-tooltip>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-large"
                  class="mx-1"
                  @click="fastForward"
                >mdi-step-forward</v-icon>
              </template>
              <span>Fast forward for 5 seconds</span>
            </v-tooltip>
          </span>
        </div>
      </v-col>
    </v-row>

    <save-recoding-dialog
      :value="showSaveRecodingDialog"
      :lyricsId="lyricsId"
      :timelineList="timelineList"
      @close-dialog="showSaveRecodingDialog = false"
      @refresh="timelineListConfirmed"
    ></save-recoding-dialog>
  </div>
</template>

<script setup>
import { useElementSize } from '@vueuse/core'
import { computed, ref, watch } from 'vue';
import ytFrame from '@/components/ytFrame.vue';
import saveRecodingDialog from './SaveRecodingDialog.vue';

const props = defineProps({
  videoId: {
    type: String,
    default: null
  },
  lyricsId: {
    type: Number,
    default: null
  },
  lyricSchedule: {
    type: Array,
    default: null
  }
})

const emits = defineEmits([
  'update-schedule',
])

const videoViewRef = ref(null);
const { width: videoWidth } = useElementSize(videoViewRef);

const videoHeight = computed(() => {
  const result = videoWidth.value * 9.0 / 16.0;
  return result;
});

watch(() => props.videoId, () => {
  playerRef.value.loadVideo(props.videoId);
})

const playerRef = ref(null);

const isRecording = ref(false);
const timelineList = ref([]);
const updateRecordStatus = () => {
  if(!isRecording.value) {
    playerRef.value.replayVideo();
    timelineList.value = [];
  }
  isRecording.value = !isRecording.value;
}

const resetRecord = () => {
  playerRef.value.seekTo(0);
  timelineList.value = [];
}

const setRecord = () => {
  timelineList.value.push(Math.max(0, playerRef.value.currentTime - 0.2));
}

const stepBack = () => {
  // remove the last timeline record
  if(timelineList.value.length > 0) {
    timelineList.value.pop();
  }

  // seek to last timeline record if exists.
  if(timelineList.value.length > 0) {
    playerRef.value.seekTo(timelineList.value.at(-1));
  }
  else {
    playerRef.value.seekTo(0);
  }
}

const showSaveRecodingDialog = ref(false);
const saveRecord = () => {
  playerRef.value.pauseVideo();
  showSaveRecodingDialog.value = true;
}

const timelineListConfirmed = () => {
  emits('update-schedule', timelineList.value);
  playerRef.value.replayVideo();
  isRecording.value = false;
}

const stepForward = () => {
  playerRef.value.fastForward();
}

const fastForward = () => {
  playerRef.value.fastForward();
}

const rewind = () => {
  playerRef.value.rewind();
}

const seekTo = (seconds) => {
  if(seconds) {
    return playerRef.value?.seekTo(seconds);
  }
}

const isPlaying = () => {
  return playerRef.value?.isPlaying();
}

const pauseVideo = () => {
  return playerRef.value?.pauseVideo();
}

const playVideo = () => {
  return playerRef.value?.playVideo();
}

const switchVideo = () => {
  if(isPlaying()) {
    pauseVideo();
  }
  else {
    playVideo();
  }
}

const currentTime = computed(
  () => playerRef.value?.currentTime
);

defineExpose({
  seekTo,
  currentTime,
  isRecording,
  timelineList,
});

</script>
