<template>
  <div class="ma-2">
    <v-row>
      <v-col cols="*">
        <v-autocomplete
          v-model="selectedSongId"
          label="search your song..."
          :items="songList"
          :item-title="item => `${item.name} - ${item.singer}`"
          item-value="id"
          clearable
        >
        </v-autocomplete>
      </v-col>

      <v-col
        cols="auto"
        align="end"
      >
        <v-btn
          class="mr-4"
          icon
          @click="openNewSongDialog"
        >
          <v-icon>mdi-plus-thick</v-icon>
        </v-btn>

        <v-btn
          class="mr-4"
          :disabled="!selectedSongId"
          icon
          @click="deleteSong"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <new-song-dialog
      :value="showNewSongDialog"
      @close-dialog="showNewSongDialog = false"
      @refresh="refresh"
    ></new-song-dialog>
  </div>
</template>

<script setup>
import { lyricsDB } from '@/common/indexedDB';
import newSongDialog from './NewSongDialog.vue';
import { ref, onMounted, computed, watch } from 'vue';

const emits = defineEmits(['update-selected-song']);

const songList = ref([]);
const selectedSongId = ref(null);

watch(() => selectedSongId.value, async () => {
  const selectedSong = await lyricsDB.getById(selectedSongId.value);
  emits('update-selected-song', selectedSong);
}, {deep: true});

const refresh = async () => {
  const result = await lyricsDB.getAll();
  songList.value = result;
}

onMounted(async () => {
  refresh();
});

const showNewSongDialog = ref(false);
const openNewSongDialog = () => {
  showNewSongDialog.value = true;
}

const deleteSong = async () => {
  if(!selectedSongId.value) return;
  return lyricsDB.delete(selectedSongId.value);
}

</script>

<style>
</style>
