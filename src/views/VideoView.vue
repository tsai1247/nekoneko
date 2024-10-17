<template>
  <div
    :class="`${isRecording ? 'position-fixed ma-2' : ''}`"
    :style="{bottom: '55px'}"
  >
    <div ref="playerRef"></div>
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
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  videoId: {
    type: String,
    default: null
  },
  isRecording: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits([
  'video-ready',
  'update-recording',
  'reset-record',
  'add-timeline',
  'step-back',
  'save-record',
  'update-current-second',
])

const playerRef = ref(null);
const player = ref(null);

const loadYouTubeIframeAPI = () => {
  return new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = resolve;
  });
};

const createYouTubePlayer = () => {
  player.value = new YT.Player(playerRef.value, {
    height: '100%',
    width: '100%',
    videoId: props.videoId,
    playerVars: {
      showinfo: 0,  // 隱藏視頻信息
      controls: 1,  // 顯示播放器控件
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: endLoop
    },
  });
};

const onPlayerReady = (event) => {
  console.log('Player is ready');
  emits('video-ready');

  setInterval(() => {
    if(player.value) {
      const currentTime = player.value.getCurrentTime();
      if(currentTime) {
        emits('update-current-second', currentTime);
      }
    }
  }, 200);
};

const endLoop = (e) => {
  if (e.data === YT.PlayerState.ENDED) {
    if(props.isRecording) {
      // show save hint dialog
      emits('save-record');
    }
    else {
      playVideo();
    }
  }
}

const seekTo = (seconds) => {
  if (player.value) {
    player.value.seekTo(seconds, true);
  }
};

const playVideo = () => {
  if (player.value) {
    player.value.playVideo();
  }
};

const pauseVideo = () => {
  if (player.value) {
    player.value.pauseVideo();
  }
};

const replayVideo = () => {
  if (player.value) {
    player.value.seekTo(0, true);
    player.value.playVideo();
  }
}

const loadVideo = () => {
  if (player.value && props.videoId) {
    player.value.loadVideoById({
      videoId: props.videoId,
      playerVars: {
        showinfo: 0,  // 隱藏視頻信息
        controls: 1,  // 顯示播放器控件
        loop: 1,
        playlist: props.videoId,
      },
    });
    player.value.setLoop(true);
  }
  else {
    pauseVideo();
  }
};

watch(() => props.videoId, () => {
  loadVideo();
})

onMounted(async () => {
  await loadYouTubeIframeAPI();
  createYouTubePlayer();

});

const updateRecordStatus = () => {
  if(!props.isRecording) {
    seekTo(0);
    playVideo();
  }
  emits('update-recording', !props.isRecording);
}

const resetRecord = () => {
  seekTo(0);
  emits('reset-record');
}

const setRecord = () => {
  emits('add-timeline', player.value.getCurrentTime());
}

const stepBack = () => {
  emits('step-back');
}

const saveRecord = () => {
  pauseVideo();
  emits('save-record');
  emits('update-recording', !props.isRecording);
}

const stepForward = () => {
  seekTo(player.value.getCurrentTime() + 5);
}

defineExpose({
  seekTo,
  replayVideo,
});

</script>
