<template>
  <v-app-bar color="blue-lighten-4">
    <template v-slot:prepend>
      <v-icon icon="mdi-cat" />
    </template>
    <div class="text-h6 mr-3">nekoneko</div>
    <v-spacer></v-spacer>
    <v-text-field
      v-model="keyword"
      label="Search"
      variant="underlined"
      class="mt-4"
      @keyup.enter="search"
      prepend-inner-icon="mdi-magnify"
    ></v-text-field>

    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <div v-bind="props">
          <v-btn
            icon
            @click="search"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </template>
      <span>Search</span>
    </v-tooltip>

    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <div v-bind="props">
          <v-btn
            icon
            @click="gotoSubscription"
          >
            <v-icon>mdi-youtube-subscription</v-icon>
          </v-btn>
        </div>
      </template>
      <span>Youtube Subscription</span>
    </v-tooltip>

    <v-spacer></v-spacer>

    <v-chip>{{ version }}</v-chip>
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <div v-bind="props">
          <v-btn
            icon
            @click="gotoGithub"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </div>
      </template>
      <span>GitHub</span>
    </v-tooltip>

  </v-app-bar>

</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import packageJson from '@/../package.json';

  const keyword = ref('');
  function search() {
    if(keyword.value) {
      window.open(`https://www.youtube.com/results?search_query=${keyword.value}`, '_blank');
    }
  }

  function gotoGithub() {
    window.open('https://github.com/tsai1247/nekoneko', '_blank');
  }

  function gotoSubscription() {
    window.open('https://www.youtube.com/feed/subscriptions', '_blank');
  }

  const version = ref('');

  onMounted(() => {
    version.value = packageJson.version ?? '';
    if(version.value.length == 0 || version.value[0] != 'v') {
      version.value = `v${version.value}`;
    }
  })

</script>
