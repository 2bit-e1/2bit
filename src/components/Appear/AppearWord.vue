<script setup>
import { wordAppearDelayStep } from '@/utils/constants';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps({
  word: String,
  delayOrder: Number,
  isAppear: Boolean
})


const isFirstLoad = ref(true);

watchEffect(() => {
  if (props.isAppear) isFirstLoad.value = false
})

const appearDelay = computed(() => ((props.delayOrder || 1) - 1) * wordAppearDelayStep + "ms");
</script>

<template>
  <span
    class="appear-word"
    :class="{ 'appear-word_appear': isAppear, 'appear-word_first-load': isFirstLoad }"
  >
    <span class="appear-word-inner">
      {{ word }}
    </span>
  </span>
</template>

<style>
.appear-word {
  display: inline-block;
  overflow: hidden;
}

.appear-word-inner {
  display: inline-block;
  translate: 0 -100%;
}

.appear-word:not(.appear-word_first-load) .appear-word-inner {
  translate: 0 0;
  /*animation:
    disappear-translate 300ms calc(100ms + v-bind(appearDelay)) forwards var(--timing-func-2),
    disappear-scale 300ms calc(0ms + v-bind(appearDelay)) forwards var(--timing-func-1);*/
    animation:
      disappear-translate 300ms 100ms forwards var(--timing-func-2),
      disappear-scale 300ms 0ms forwards var(--timing-func-1);
}

.appear-word.appear-word_appear .appear-word-inner {
  translate: 0 100%;
  animation:
    appear-translate 300ms calc(100ms + v-bind(appearDelay)) forwards var(--timing-func-2),
    appear-scale 300ms calc(200ms + v-bind(appearDelay)) forwards var(--timing-func-1);
}

@keyframes appear-translate {
  0% { translate: 0 100%; }

  100% { translate: 0 0; }
}

@keyframes appear-scale {
  0% { scale: 0.8; }

  100% { scale: 1; }
}

@keyframes disappear-translate {
  0% { translate: 0 0; }

  100% { translate: 0 -100%; }
}

@keyframes disappear-scale {
  0% { scale: 1; }

  100% { scale: 0.8; }
}
</style>