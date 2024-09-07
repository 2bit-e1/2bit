<script setup>
import { timeForLoadAllImages } from "@/components/Process/utils";
import { useIntersectionObserver } from "@/utils/useIntersectionObserver";
import { onMounted, ref } from "vue";

const { ind } = defineProps({
  src: String,
  isImageHide: Boolean,
  ind: Number,
});

const isIntersected = ref(false);
const elemRef = ref(null);
const appearDelayStep = 50;
const appearDelay = ref(ind * appearDelayStep + "ms");

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting) isIntersected.value = true;
};

useIntersectionObserver(elemRef, handleIntersect);

onMounted(() => {
  setTimeout(() => {
    if (window.innerWidth < 768) {
      appearDelay.value = ((ind % 2) - 1) * appearDelayStep + "ms";
    } else {
      appearDelay.value = "0ms";
    }
  }, timeForLoadAllImages);
});
</script>

<template>
  <li
    class="images-list-item"
    :class="{
      'images-list-item_intersected': isIntersected,
      'images-list-item_hide': isImageHide,
    }"
    ref="elemRef"
  >
    <img
      :src="src"
      class="images-list-image"
      :ref="(ref) => $emit('setImageRef', ref)"
    />
  </li>
</template>

<style scoped>
.images-list-item {
  display: block;
  width: 100%;
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  transition: clip-path 500ms v-bind(appearDelay) ease;
}

.images-list-item_intersected:not(.images-list-item_hide) {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.images-list-image {
  width: 100%;
  object-fit: contain;
}

@media (max-width: 768px) {
  .images-list-item {
    display: flex;
    justify-content: center;
  }

  .images-list-image {
    width: auto;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
  }
}
</style>
