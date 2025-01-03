<template>
  <div class="ma-2 mt-4">

    <v-row>
      <v-col cols="12">
        <search-view @update-selected-song="onUpdateSelectedSong"></search-view>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col
        cols="12"
        sm="12"
        md="5"
        lg="5"
      >
        <video-view
          ref="videoViewRef"
          class="ma-1"
          :video-id="videoId"
          :lyricsId="lyricsId"
          :lyricSchedule="lyricSchedule"
          @update-schedule="updateSchedule"
        ></video-view>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="7"
        lg="7"
        :style="{height: '450px'}"
      >
        <lyrics-view
          :id="lyricsId"
          :lyrics="lyrics"
          :hiragana="hiragana"
          :timeline="timelineList"
          :isRecording="isRecording"
          :lyricSchedule="lyricSchedule"
          :currentTime="currentTime"
          @seek-to="seekTo"
          @update:schedule="updateSchedule"
        ></lyrics-view>
      </v-col>
    </v-row>

    <get-api-key-dialog
      :value="showGetAPIKeyDialog"
      @close-dialog="showGetAPIKeyDialog = false"
    >
    </get-api-key-dialog>
  </div>

</template>

<script setup>
  import lyricsView from './LyricsView.vue';
  import videoView from './VideoView.vue';
  import searchView from './SearchView.vue';
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
    if(!youtubeLink.value) return null;

    const regex = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|shorts\/|embed\/|v\/)?(?:(?:\w+\/)?)?(?<id>[\w-]{11})(?:[^\s]*)?$/;

    const match = youtubeLink.value.match(regex);

    return match ? match.groups.id : null;
  });

  const videoViewRef = ref(null);
  const currentTime = computed(
    () => videoViewRef.value?.currentTime
  );

  const isRecording = computed(
    () => videoViewRef.value?.isRecording
  );

  const timelineList = computed(
    () => videoViewRef.value?.timelineList
  );

  const seekTo = (second) => {
    return videoViewRef.value?.seekTo(second);
  }

  const updateSchedule = (schedule) => {
    lyricSchedule.value = schedule;
  }

  const showGetAPIKeyDialog = ref(false);
  onMounted(() => {
    const api_key = localStorage.getItem("hiragana_api_key");
    if ( api_key === null || api_key === '' || api_key === "null" ) {
      showGetAPIKeyDialog.value = true;
    }
  })

</script>

<style scoped>
</style>
