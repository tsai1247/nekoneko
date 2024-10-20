<template>
  <div>
    <v-dialog
      v-model="showDialog"
      width="100%"
    >
      <v-card width="100%">
        <v-card-title>
          <v-row>
            <v-col
              cols="*"
              align-self="center"
              class="font-weight-bold"
            >
              Add New Song
            </v-col>
            <v-col cols="auto">
              <v-btn
                icon
                class="mx-2"
                :disabled="!youtubeLinkRule(youtubeLink) || !songName || !singerName || !lyrics"
                @click="save"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>

              <v-btn
                icon
                @click="close"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Song name*"
            v-model="songName"
            :rules="[requiredRule]"
          ></v-text-field>
          <v-text-field
            label="Author*"
            v-model="singerName"
            :rules="[requiredRule]"
          ></v-text-field>

          <div class="text-subtitle-2">* Maximum of 15 full-width characters per line is recommended.</div>
          <div class="text-subtitle-2">　　　　　　　　　　　　　about here↓</div>
          <v-textarea
            label="Lyrics*"
            v-model="lyrics"
            :rules="[requiredRule]"
            auto-grow
          ></v-textarea>
          <v-text-field
            label="YoutubeLink*"
            :rules="[youtubeLinkRule]"
            v-model="youtubeLink"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { lyricsDB } from '@/common/indexedDB';
import toHiragana from '@/common/API/hiragana';

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
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

const songName = ref('');
const singerName = ref('');
const lyrics = ref('');
const youtubeLink = ref('');

watch(() => showDialog.value, () => {
  if(showDialog.value) {
    songName.value = '';
    singerName.value = '';
    lyrics.value = '';
    youtubeLink.value = '';
  }
})

const youtubeLinkRule = (val) => {
  const testResult =  /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|shorts\/|embed\/|v\/)?(?:(?:\w+\/)?)?(?<id>[\w-]{11})(?:[^\s]*)?$/.test(val);
  return testResult || 'https://www.youtube.com/watch?v=xxxxxxxxxxx';
}

const requiredRule = (val) => val != '' || 'Required';

const save = async () => {
  emits('close-dialog');
  const formattedLyrics = lyrics.value.replaceAll('。', '').replaceAll('\r\n', '。').replaceAll('\n', '。')
  let hiragana = (await toHiragana(formattedLyrics))?.converted;
  hiragana = hiragana?.replaceAll('。', '\n').split('\n').map((item => item.trim()));
  await lyricsDB.add(songName.value, singerName.value, 'docs', lyrics.value, hiragana, youtubeLink.value);
  emits('refresh');
};

const close = () => {
  emits('close-dialog');
};

</script>

<style>
</style>
