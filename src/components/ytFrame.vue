<template>
  <div>
    <core-load v-model="showLoad"></core-load>
    <div ref="playerRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import coreLoad from '@/components/coreLoad.vue';

const emits = defineEmits([
  'on-ended',
]);

const showLoad = ref(false);
const playerRef = ref(null);
const player = ref(null);
const currentTime = ref(null);
const duration = ref(0);

/**
 * Load youtube api scripts
 */
const loadYouTubeIframeAPI = () => {
  return new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = resolve;
  });
};

/**
 * Create youtube player frame element
 */
const createYouTubePlayer = () => {
  player.value = new YT.Player(playerRef.value, {
    height: '100%',
    width: '100%',
    videoId: null,
    playerVars: {
      showinfo: 0,  // 隱藏視頻信息
      controls: 1,  // 顯示播放器控件
    },
    events: {
      onReady: onReady,
      onStateChange: onStateChange
    },
  });
};

onMounted(async () => {
  showLoad.value = true;
  await loadYouTubeIframeAPI();
  return createYouTubePlayer();
});


const playerIsReady = ref(false);
/**
 * When player is ready, update currentTime every 200 ms.
 */
const onReady = (_) => {
  playerIsReady.value = true;
  showLoad.value = false;

  setInterval(() => {
    if(player.value) {
      currentTime.value = getCurrentTime();
    }
  }, 200);
};

/**
 * call emits: ended at the end of youtube player
 */
const onStateChange = (e) => {
  if (e.data === YT.PlayerState.ENDED) {
    emits('on-ended');
  }
}

// controller

/**
 * Get current time with no latency.
 */
const getCurrentTime = () => {
  return player.value.getCurrentTime();
}

/**
 * Get the full time of current video in seconds.
 */
const getDuration = () => {
  return player.value.getDuration();
}

/**
 * Jump to target seconds
 * @param {Number} seconds
 */
const seekTo = (seconds = 0) => {
  const realSeconds = Math.min(
    Math.max(seconds, 0),
    getDuration()
  )

  if (player.value) {
    player.value.seekTo(realSeconds, true);
  }
};

/**
 * Play video.
 */
const playVideo = () => {
  if (player.value) {
    player.value.playVideo();
  }
};

/**
 * Pause video.
 */
const pauseVideo = () => {
  if (player.value) {
    player.value.pauseVideo();
  }
};

/**
 * Stop video.
 */
const stopVideo = () => {
  if (player.value) {
    player.value.stopVideo();
  }
};

/**
 * Jump to 0-second and play video.
 */
const replayVideo = () => {
  if (player.value) {
    player.value.seekTo(0, true);
    player.value.playVideo();
  }
}

/**
 * Load video with video id.
 * @param {String} videoId
 */
const loadVideo = (videoId) => {
  if (player.value && videoId) {
    player.value.loadVideoById({
      videoId: videoId,
      playerVars: {
        showinfo: 0,  // 隱藏視頻信息
        controls: 1,  // 顯示播放器控件
        loop: 1,
        playlist: videoId,
      },
    });
    player.value.setLoop(true);
    duration.value = getDuration();
  }
  else {
    stopVideo();
  }
};

const fastForward = (seconds = 5) => {
  seekTo(getCurrentTime() + seconds);
}

const rewind = (seconds = 5) => {
  seekTo(getCurrentTime() - seconds);
}


defineExpose({
  // Load video
  loadVideo,

  // 指定秒數
  seekTo,

  // 快進(預設5秒)
  fastForward,

  // 快退(預設5秒)
  rewind,

  // 播放
  playVideo,

  // 暫停
  pauseVideo,

  // 回到一開始
  stopVideo,

  // 回到一開始並播放
  replayVideo,

  // 當前秒數(200毫秒更新一次)
  currentTime,

  // 所有秒數
  duration,
});
</script>

<style>
</style>
