<template>
  <div>
    <v-dialog
      persistent
      v-model="showDialog"
      class="ma-4"
      width="100%"
      max-width="750px"
    >
      <v-card width="100%">
        <v-card-title>
          <v-row>
            <v-col
              cols="*"
              align-self="center"
              class="font-weight-bold"
            >
              Get your own api key
            </v-col>
            <v-col cols="auto">
              <v-btn
                icon
                class="mx-2"
                @click="save"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>

            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <div>
            <div>The website depends on "ひらがな化API" provided by Gooラボ.</div>
            <div>You have to sign up with your Github account and get api key in the beginning.</div>
            <div>
              Step 1: Visit GitHub and sign up
              <a
                :href="'//github.com'"
                target="_blank"
              >
                <v-icon size="x-small">mdi-link-variant</v-icon>
              </a>
            </div>
            <div>
              Step 2: Visit Gooラボ
              <a
                :href="'//labs.goo.ne.jp/en/apiregister/'"
                target="_blank"
              >
                <v-icon size="x-small">mdi-link-variant</v-icon>
              </a>
            </div>
            <div>
              Step 3: Scroll to the bottom, and click "Register with GitHub"
            </div>
            <div>
              Step 4: Sign in with your GitHub account
            </div>
            <div>
              Step 5: Copy the application ID in the redirected page, and paste below.
            </div>
            <div>
              Step 6: Click save button at top-right.
            </div>
          </div>
          <v-text-field
            class="mt-2"
            v-model="apiKeyInput"
            label="Your Token"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['close-dialog'])
const showDialog = computed({
  get() {
    return props.value;
  },
  set(val) {
    emits("close-dialog");
  }
})

const apiKeyInput = ref(null);

const save = async () => {
  localStorage.setItem('hiragana_api_key', apiKeyInput.value);
  emits('close-dialog');
};

const close = () => {
  emits('close-dialog');
};

</script>

<style>
</style>
