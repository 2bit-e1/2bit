<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useIntersectionObserver } from "@/utils/useIntersectionObserver";

const props = defineProps({
  text: { type: String, default: "" },
  isAppear: { type: Boolean, default: true },
  delay: { type: Number, default: 0 },
});

const text = computed(() => props.text.trim().replace(/\s+/g, " "));
const words = computed(() => text.value ? text.value.split(" ") : []);
const root = ref(null);
const lineOrders = ref([]);
const isIntersected = ref(false);
const isMeasured = ref(false);
let resizeObserver;
let frame;
let isDisposed = false;

useIntersectionObserver(root, (entries) => {
  if (entries.some((entry) => entry.isIntersecting)) isIntersected.value = true;
});

function measureLines() {
  if (!root.value || isDisposed) return;
  const tops = [...root.value.querySelectorAll(".reveal-text-mask")]
    .map((word) => word.getBoundingClientRect().top);
  let line = 0;
  lineOrders.value = tops.map((top, index) => {
    if (index && Math.abs(top - tops[index - 1]) > 2) line += 1;
    return line;
  });
  isMeasured.value = true;
}

function scheduleMeasure() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(measureLines);
}

onMounted(async () => {
  await document.fonts?.ready;
  if (isDisposed) return;
  measureLines();
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(root.value.parentElement || root.value);
  }
});

watch(text, async () => {
  await nextTick();
  if (!isDisposed) scheduleMeasure();
});

onBeforeUnmount(() => {
  isDisposed = true;
  resizeObserver?.disconnect();
  cancelAnimationFrame(frame);
});
</script>

<template>
  <span
    ref="root"
    class="reveal-text"
    :class="{ 'reveal-text_visible': isAppear && isIntersected && isMeasured }"
  ><template v-for="(word, index) in words" :key="index"><span
      class="reveal-text-mask"
    ><span
        class="reveal-text-word"
        :style="{ '--reveal-delay': `${delay + Math.min((lineOrders[index] || 0) * 35, 210)}ms` }"
      >{{ word }}</span></span>{{ index < words.length - 1 ? ' ' : '' }}</template></span>
</template>

<style scoped>
.reveal-text-mask {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  text-indent: 0;
}

.reveal-text-word {
  display: inline-block;
  opacity: 0;
  transform: translate3d(0, 105%, 0);
  transition:
    transform var(--motion-text-duration) var(--motion-ease-reveal),
    opacity 400ms var(--motion-ease-out);
  transition-delay: var(--reveal-delay, 0ms);
}

.reveal-text_visible .reveal-text-word {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-text-word,
  .reveal-text_visible .reveal-text-word {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
