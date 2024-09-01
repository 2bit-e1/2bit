<script setup>
import { useIntersectionObserver } from "@/utils/useIntersectionObserver";
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  ind: Number,
  imagesInRow: Number,
  src: String,
  alt: String,
});

const elemRef = ref(null);
const isIntersected = ref(false);

const isImageAppearOnPageLoad = ref(true);
const appearDelayStep = 50;
const appearDelay = ref((props.ind * appearDelayStep) + "ms");

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting) isIntersected.value = true;
};

useIntersectionObserver(elemRef, handleIntersect);

onMounted(() => {
  setTimeout(() => {
    appearDelay.value = ((props.ind % 4) * appearDelayStep) + "ms"
  }, 1000);
});
</script>

<template>
  <button
    class="item-image"
    :class="{ 'item-image_intersected': isIntersected }"
    ref="elemRef"
  >
    <img :src="src" :alt="alt || ''" />
  </button>
</template>

<style>
.item-image {
  flex: 1 1 auto;
  height: auto;
  overflow: hidden;
  opacity: 0;
  translate: 0 10px;
  transition: opacity 200ms v-bind(appearDelay), translate 400ms calc(100ms + v-bind(appearDelay)) cubic-bezier(.16,1,.3,1);
}

.item-image_intersected {
  translate: 0 0;
  opacity: 1;
}

.item-image img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
