<script setup>
import { computed } from "vue";
import { wordAppearDelayStep } from "@/utils/constants";

const props = defineProps({
  word: String,
  delayOrder: Number,
  isAppear: Boolean,
});

const appearDelay = computed(() =>
  `${Math.min(Math.max((props.delayOrder || 1) - 1, 0) * wordAppearDelayStep, 140)}ms`
);
</script>

<template>
  <span
    class="appear-word"
    :class="{ 'appear-word_appear': isAppear }"
    :aria-hidden="!isAppear"
    :style="{ '--word-delay': appearDelay }"
  >
    <span class="appear-word-inner">{{ word }}</span>
  </span>
</template>

<style>
.appear-word {
  display: inline-block;
  overflow: hidden;
}

.appear-word-inner {
  display: inline-block;
  line-height: 15px !important;
  opacity: 0;
  transform: translate3d(0, 105%, 0);
  transition:
    transform var(--motion-exit-duration) var(--motion-ease-out),
    opacity var(--motion-exit-duration) ease-out;
}

.appear-word_appear .appear-word-inner {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  transition-duration: var(--motion-label-duration), 280ms;
  transition-delay: var(--word-delay, 0ms);
}

@media (prefers-reduced-motion: reduce) {
  .appear-word-inner,
  .appear-word_appear .appear-word-inner {
    transform: none;
    transition: none;
  }
}
</style>
