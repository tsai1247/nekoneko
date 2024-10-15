<template>
  <div class="ma-2 mt-4">
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
    <v-row>
      <v-col cols="12">
        <search-view
          ref="searchViewRef"
          @update-selected-song="onUpdateSelectedSong"
        ></search-view>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col
        cols="11"
        sm="11"
        md="5"
        lg="5"
      >
        <video-view
          :video-id="videoId"
          @video-ready="showLoad=false"
          :isRecording="isRecording"
          @update-recording="updateRecording"
          @reset-record="resetRecord"
          @add-timeline="addTimeline"
          @step-back="stepBack"
          @save-record="saveRecord"
          @update-current-second="updateCurrentSecond"
          ref="videoViewRef"
          class="ma-1"
          :style="{
            height: videoHeight + 'px',
          }"
        ></video-view>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="7"
        lg="7"
      >
        <lyrics-view
          :lyrics="lyrics"
          :hiragana="hiragana"
          :timeline="timelineList"
          :isRecording="isRecording"
          :lyricSchedule="lyricSchedule"
          :currentSecond="currentSecond"
        ></lyrics-view>
      </v-col>
    </v-row>

    <save-recoding-dialog
      :value="showSaveRecodingDialog"
      :lyricsId="lyricsId"
      :timelineList="timelineList"
      @close-dialog="showSaveRecodingDialog = false"
      @refresh="timelineListConfirmed"
    ></save-recoding-dialog>

    <get-api-key-dialog
      :value="showGetAPIKeyDialog"
      @close-dialog="showGetAPIKeyDialog = false"
    >
    </get-api-key-dialog>
  </div>

</template>

<script setup>
  import { useElementSize } from '@vueuse/core'
  import lyricsView from './LyricsView.vue';
  import videoView from './VideoView.vue';
  import searchView from './SearchView.vue';
  import saveRecodingDialog from './SaveRecodingDialog.vue';
  import getApiKeyDialog from './GetApiKeyDialog.vue';
  import { onMounted, ref, computed } from 'vue';

  const lyricsId = ref(null);
  const youtubeLink = ref(null);
  const lyrics = ref(null);
  const hiragana = ref(null);
  const lyricSchedule = ref(null);

  function onUpdateSelectedSong(selectedSong) {
    lyricsId.value = selectedSong?.id;
    youtubeLink.value = selectedSong?.youtube;
    lyrics.value = selectedSong?.lyrics;
    hiragana.value = selectedSong?.hiragana;
    lyricSchedule.value = selectedSong?.lyricSchedule;
  }

  const videoId = computed(() => {
    return youtubeLink.value ? youtubeLink.value.split("v=")[1] : null
  });

  const showLoad = ref(true);

  const videoViewRef = ref(null);
  const { width: videoWidth } = useElementSize(videoViewRef);

  const videoHeight = computed(() => {
    const result = videoWidth.value * 9.0 / 16.0;
    return result;
  });

  const isRecording = ref(false);
  const timelineList = ref([]);
  const updateRecording = (val) => {
    isRecording.value = val;
    if(isRecording.value) {
      timelineList.value = [];
    }
  }

  const resetRecord = () => {
    isRecording.value = true;
    timelineList.value = [];
  }

  const addTimeline = (val) => {
    timelineList.value.push(val);
  }

  const stepBack = () => {
    if(timelineList.value.length > 0) {
      timelineList.value.pop();
    }

    if(timelineList.value.length > 0) {
      videoViewRef.value.seekTo(timelineList.value.at(-1));
    }
    else {
      videoViewRef.value.seekTo(0);
    }
  }

  const showSaveRecodingDialog = ref(false);
  const saveRecord = () => {
    showSaveRecodingDialog.value = true;
  }

  const searchViewRef = ref(null);
  const timelineListConfirmed = async () => {
    lyricSchedule.value = timelineList.value;
    videoViewRef.value.replayVideo();
  }

  const currentSecond = ref(null);
  const updateCurrentSecond = (val) => {
    currentSecond.value = val;
  }

  const showGetAPIKeyDialog = ref(false);
  onMounted(() => {
    if (localStorage.getItem("hiragana_api_key") === null) {
      showGetAPIKeyDialog.value = true;
    }
  })

</script>

<style scoped>
</style>
