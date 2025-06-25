<script setup>
import { useIntersectionObserver } from "@/utils/useIntersectionObserver";
import { computed, onMounted, ref } from "vue";
import { timeForLoadAllImages } from "./utils";

const props = defineProps({
  ind: Number,
  src: String,
  alt: String,
  isHide: Boolean,
});

const elemRef = ref(null);
const isIntersected = ref(false);
const appearDelayStep = 50;
const appearDelay = ref(props.ind * appearDelayStep + "ms");

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting) isIntersected.value = true;
};

useIntersectionObserver(elemRef, handleIntersect);

onMounted(() => {
  setTimeout(() => {
    appearDelay.value = ((props.ind % 4) - 1) * appearDelayStep + "ms";
  }, timeForLoadAllImages);
});

// Определение, является ли src видео
const isVideo = computed(() => /\.(mp4|webm|ogg)$/i.test(props.src));
</script>

<template>
  <button class="item-image-container">
    <div
      class="item-image"
      :class="{
        'item-image_intersected': isIntersected,
        'item-image_hide': isHide,
      }"
      ref="elemRef"
    >
      <img
        v-if="!isVideo"
        :src="src"
        :alt="alt || ''"
        :ref="(ref) => $emit('setImageRef', ref)"
      />
      <video
        v-else
        :src="src"
        autoplay
        muted
        loop
        playsinline
        :ref="(ref) => $emit('setImageRef', ref)"
      />
    </div>
  </button>
</template>

<style>
.item-image-container {
  overflow: hidden;
  height: auto;
}

.item-image {
  flex: 1 1 auto;
  overflow: hidden;
  height: 100%;
  width: 100%;
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  transition: clip-path 450ms v-bind(appearDelay) ease;
}

.item-image_intersected:not(.item-image_hide) {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.item-image img,
.item-image video {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
