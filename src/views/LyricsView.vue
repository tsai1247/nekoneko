<template>
  <div :style="{height: '100%'}">
    <v-row no-gutters>
      <v-col
        cols="4"
        md="3"
      >
        <v-checkbox
          v-model="showKanjiKana"
          label="Kanji"
          hide-details
        ></v-checkbox>
      </v-col>
      <v-col
        cols="4"
        md="3"
      >
        <v-checkbox
          v-model="showKatakanaKana"
          label="Katakana"
          hide-details
        ></v-checkbox>
      </v-col>
      <v-col
        cols="4"
        md="3"
      >
        <v-checkbox
          v-model="showOtherKana"
          label="Others"
          hide-details
        ></v-checkbox>
      </v-col>
      <v-col
        cols="4"
        md="3"
      >
        <v-checkbox
          v-model="spaceEmphasize"
          label="Space Emphasize"
          hide-details
        ></v-checkbox>
      </v-col>
    </v-row>

    <div :style="{height: '100%'}">
      <v-virtual-scroll
        :style="{height: '100%'}"
        :items="['1']"
      >
        <template v-slot:default="{}">
          <div
            class="playing-lyrics"
            v-for="(line, index) in displayingLyricList"
            :key="index"
          >
            <span v-if="line.length === 0">
              <br />
            </span>
            <span
              v-if="isRecording"
              class="mr-2"
            >
              <v-chip>
                {{ index < timeline.length ? formatTime(timeline[index]) : '00:00' }}
              </v-chip>
            </span>
            <span
              v-for="(lyric, jndex) in line"
              :key="jndex"
              @click="goTo(index)"
              :class="index < lyricSchedule?.length ? 'clickable' : ''"
            >
              <span>
                <core-ruby
                  :value="lyric.kanji"
                  :rt="lyric.hiragana"
                  :showRt="lyric.type === kanaType.KANJI && showKanjiKana
                      || lyric.type === kanaType.KATAKANA && showKatakanaKana
                      || lyric.type === kanaType.OTHERS && showOtherKana"
                  :isFirst="jndex === 0"
                  :space-emphasize="spaceEmphasize"
                  :isRead="isRead(index)"
                  :isReading="isReading(index)"
                ></core-ruby>
              </span>
            </span>
          </div>
        </template>
      </v-virtual-scroll>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import * as wanakana from 'wanakana';
import { kanaType } from '@/common/constant/enums';
import coreRuby from "@/components/coreRuby.vue";

const props = defineProps({
  lyrics: String,
  hiragana: Array,
  isRecording: Boolean,
  timeline: Array,
  lyricSchedule: Array,
  currentTime: Number
});

const emits = defineEmits([
  'seek-to',
])

const defaultShowKanjiKana = localStorage.getItem('lyrics.showKanjiKana');
const showKanjiKana = ref(defaultShowKanjiKana === null || defaultShowKanjiKana === 'true');

const defaultShowKatakanaKana = localStorage.getItem('lyrics.showKatakanaKana');
const showKatakanaKana = ref(defaultShowKatakanaKana === null || defaultShowKatakanaKana === 'true');

const defaultShowOtherKana = localStorage.getItem('lyrics.showOtherKana');
const showOtherKana = ref(defaultShowOtherKana === null || defaultShowOtherKana === 'true');

const defaultSpaceEmphasize = localStorage.getItem('lyrics.spaceEmphasize');
const spaceEmphasize = ref(defaultSpaceEmphasize === null || defaultSpaceEmphasize === 'true');

watch(() => [
  showKanjiKana.value,
  showKatakanaKana.value,
  showOtherKana.value,
  spaceEmphasize.value,
], ()=> {
  localStorage.setItem('lyrics.showKanjiKana', showKanjiKana.value);
  localStorage.setItem('lyrics.showKatakanaKana', showKatakanaKana.value);
  localStorage.setItem('lyrics.showOtherKana', showOtherKana.value);
  localStorage.setItem('lyrics.spaceEmphasize', spaceEmphasize.value);
})

const displayingLyricList = ref([]);
const JPSYMBOLLIST = ['「', '」', '、', '?', '!', '"', '？', '（', '）', '(', ')', '“', '”'];
function parseToken(tokenLine, hiraganaLine)
{
  try {
    hiraganaLine = hiraganaLine.split(' ').reverse();

    const kanaList = [];
    tokenLine.forEach((token) => {
      token = token.trim();
      if(token === '') {
        kanaList.push(null);
      }
      else {
        let currentType = kanaType.HIRAGANA;
        if (wanakana.isKatakana(token)) {
          token = wanakana.toHiragana(token);
          currentType = kanaType.KATAKANA;
        }
        if(JPSYMBOLLIST.indexOf(token) !== -1){
          if(kanaList.length > 0) {
            const last = kanaList.pop();
            if(last != null && last.value.slice(-1) === token) {
              kanaList.push({
                type: last.type,
                value: last.value.substring(0, last.value.length-1)
              })
            }
            else {
              kanaList.push(last);
              let first = hiraganaLine.pop();
              first = first.substring(1);
              if(first.length !== 0) {
                hiraganaLine.push(first);
              }
            }
          }
          else {
            let first = hiraganaLine.pop();
            first = first.substring(1);
            if(first.length !== 0) {
              hiraganaLine.push(first);
            }
          }

          kanaList.push({
            type: kanaType.OTHERS,
            value: ''
          });
        }
        else if(wanakana.isHiragana(token)) {
          if(kanaList.length !== 0) {
            let target = kanaList.pop();
            let spaceBlock = false;
            if(target === null && kanaList.length !== 0) {
              target = kanaList.pop();
              spaceBlock += true;
            }
            if(target === null) {
              kanaList.push(target);
              let rest = token.length;
              while(hiraganaLine.length > 0 && rest > 0) {
                const target = hiraganaLine.pop();
                if(rest >= target.length){
                  rest -= target.length;
                }
                else {
                  hiraganaLine.push(target.substring(rest));
                  break;
                }
              }
              kanaList.push({
                type: currentType,
                value: token
              });
            }
            else {
              const index = target.value.indexOf(token, 1);
              if(index === -1) {
                const index = target.value.indexOf(token[0], 1);
                if(index === -1) {
                  kanaList.push({
                    type: target.type,
                    value: target.value
                  });
                  let rest = token.length;
                  while(hiraganaLine.length > 0 && rest > 0) {
                    const target = hiraganaLine.pop();
                    if(rest >= target.length){
                      rest -= target.length;
                    }
                    else {
                      hiraganaLine.push(target.substring(rest));
                      break;
                    }
                  }
                  kanaList.push({
                    type: currentType,
                    value: token
                  });
                }
                else {
                  kanaList.push({
                    type: target.type,
                    value: target.value.substring(0, index)
                  });
                  let rest = token.length - (target.value.length - index);
                  while(hiraganaLine.length > 0 && rest > 0) {
                    const target = hiraganaLine.pop();
                    if(rest >= target.length){
                      rest -= target.length;
                    }
                    else {
                      hiraganaLine.push(target.substring(rest));
                      break;
                    }
                  }
                  kanaList.push({
                    type: currentType,
                    value: token
                  });
                }
              }
              else {
                kanaList.push({
                  type: target.type,
                  value: target.value.substring(0, index)
                });
                kanaList.push({
                  type: currentType,
                  value: token
                });
                hiraganaLine.push(target.value.substring(index + token.length));
              }
            }
            if(spaceBlock) {
              kanaList.push(null);
            }
          }
          else {
            let rest = token.length;
            while(hiraganaLine.length > 0 && rest > 0) {
              const target = hiraganaLine.pop();
              if(rest >= target.length){
                rest -= target.length;
              }
              else {
                hiraganaLine.push(target.substring(rest));
                break;
              }
            }
            kanaList.push({
              type: currentType,
              value: token
            });
          }
        }
        else {
          let target = '';
          while(target === '') {
            target += hiraganaLine.pop();
          }

          kanaList.push({
            type: wanakana.isKanji(token) ? kanaType.KANJI : kanaType.OTHERS,
            value: target
          });
        }
      }
    })

    return tokenLine.map((item, index) => ({
      kanji: item,
      type: kanaList[index]?.type,
      hiragana: kanaList[index]?.value
    }));
  }
  catch {
    return tokenLine.map((item, index) => ({
      kanji: item,
      type: kanaType.HIRAGANA,
      hiragana: null
    }));
  }
}

watch(() => props.lyrics, () => {
  if(props.lyrics && props.hiragana) {
    let tokenizedText = [];
    tokenizedText = props.lyrics.split('\n').map(item => wanakana.tokenize(item)).map(item =>
      item.reduce((sum, cur) => {
        if(sum.length === 0) {
          sum.push(cur);
          return sum;
        }

        const last = sum.pop();
        if(last.trim() === '' || cur.trim() === '') {
          sum.push(last);
          sum.push(cur);
        }
        else if(/[0-9]+/.test(last)) {
          sum.push(`${last}${cur}`)
        }
        else if(!wanakana.isJapanese(last) && !wanakana.isJapanese(cur) && (/^[^a-zA-Z ]$/.test(cur) || /^[^a-zA-Z ]$/.test(last[last.length - 1]))) {
          sum.push(`${last}${cur}`)
        }
        else {
          sum.push(last);
          sum.push(cur);
        }
        return sum;


      }, [])
    );
    displayingLyricList.value = tokenizedText.map((tokenLine, index) => {
      const hiraganaLine = props.hiragana[index].replace(' ', '');
      const tokens = parseToken(tokenLine, hiraganaLine);
      return tokens;
    });
  }

})

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const readingIndex = computed(() => {
  return null;
});

const isRead = (index) => {
  if(props.isRecording) {
    return index < props.timeline.length - 1;
  }

  if(props.lyricSchedule) {
    if(index+1 < props.lyricSchedule.length) {
      return props.lyricSchedule[index + 1] - LYRIC_FORARD_SECONDS <= props.currentTime;
    }
  }

  return false;
}

const LYRIC_FORARD_SECONDS = 0.7;
const goTo = (index) => {
  if(props.lyricSchedule) {
    if(index < props.lyricSchedule.length) {
      emits('seek-to', props.lyricSchedule[index] - LYRIC_FORARD_SECONDS);
    }
  }
}

const isReading = (index) => {
  if(props.isRecording) {
    return index === props.timeline.length - 1;
  }

  if(props.lyricSchedule) {
    if(index < props.lyricSchedule.length) {
      const lyricSeconds = props.lyricSchedule[index];
      const nextLyricSceonds = (index + 1 < props.lyricSchedule.length)
        ? props.lyricSchedule[index + 1] : Number.MAX_SAFE_INTEGER;

      return lyricSeconds - LYRIC_FORARD_SECONDS <= props.currentTime
        && props.currentTime <= nextLyricSceonds - LYRIC_FORARD_SECONDS;
    }
  }

  return false;
}

</script>

<style scoped>
  .playing-lyrics {
    font-size: 24px;
    line-height: 60px;
    margin-left: 15px;
    white-space: pre-line;
  }

  .clickable {
    cursor: pointer;
    user-select: none;
  }
</style>
