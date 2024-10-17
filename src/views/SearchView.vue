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
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              class="mr-4"
              icon
              v-bind="props"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>

          <v-tooltip location="left">
            <template v-slot:activator="{ props }">
              <div v-bind="props">
                <v-btn
                  class="mt-4"
                  icon
                  @click="openNewSongDialog"
                >
                  <v-icon>mdi-plus-thick</v-icon>
                </v-btn>
              </div>
            </template>
            <span>Add new song</span>
          </v-tooltip>

          <v-tooltip location="left">
            <template v-slot:activator="{ props }">
              <div v-bind="props">
                <v-btn
                  class="mt-4"
                  icon
                  @click="importSong"
                >
                  <v-icon>mdi-import</v-icon>
                </v-btn>
              </div>
            </template>
            <span>Import new songs</span>
          </v-tooltip>

          <v-tooltip location="left">
            <template v-slot:activator="{ props }">
              <div v-bind="props">
                <v-btn
                  class="mt-4"
                  icon
                  @click="exportSong"
                >
                  <v-icon>mdi-export</v-icon>
                </v-btn>
              </div>
            </template>
            <span>Export songs</span>
          </v-tooltip>

          <v-tooltip location="left">
            <template v-slot:activator="{ props }">
              <div v-bind="props">
                <v-btn
                  class="mt-4"
                  :disabled="!selectedSongId"
                  icon
                  @click="deleteSong"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </template>
            <span>Delete current song</span>
          </v-tooltip>

        </v-menu>
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

const importSong = () => {

}

const exportSong = () => {

}

</script>

<style>
</style>
