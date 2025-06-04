<script setup>
import { PAGE_NAMES } from '@/utils/constants';
import { useIntersectionObserver } from '@/utils/useIntersectionObserver';
import { ref, watchEffect } from 'vue';

const props = defineProps({
  src: String,
  pageName: String,
  isAppear: Boolean,
  initialDelay: Number,
})

const appearDelay = ref(null);
const elemRef = ref(null);
const isIntersected = ref(false);

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting) isIntersected.value = true;
};

useIntersectionObserver(elemRef, handleIntersect);

watchEffect(() => {
  if (props.isAppear) {
    setTimeout(() => {
      appearDelay.value = '200ms';
    }, 1000);
  }
});
</script>

<template>
  <div
    v-if="pageName == PAGE_NAMES.me"
    class="info-image info-image_me"
    :class="(isAppear && isIntersected) ? 'info-image_appear' : '' "
    :style="{ 'animation-delay': (appearDelay == null ? initialDelay : appearDelay) }"
    ref="elemRef"
  >
    <img :src="src" alt="" />
  </div>

  <div
    v-else
    :style="{ 'animation-delay': (appearDelay == null ? initialDelay : appearDelay) }"
    class="info-image"
    :class="(isAppear && isIntersected) ? 'info-image_appear' : '' "
    ref="elemRef"
  >
    <img :src="src" alt="" />
  </div>
</template>

<style scoped>
</style>
