<script setup>
import { PAGE_NAMES } from '@/utils/constants';
import { useIntersectionObserver } from '@/utils/useIntersectionObserver';
import { ref } from 'vue';

const props = defineProps({
  src: String,
  pageName: String,
  isAppear: Boolean,
  initialDelay: { type: Number, default: 0 },
})

const elemRef = ref(null);
const isIntersected = ref(false);
const isLoaded = ref(false);

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting) isIntersected.value = true;
};

useIntersectionObserver(elemRef, handleIntersect);

</script>

<template>
  <div
    v-if="pageName == PAGE_NAMES.me"
    class="info-image info-image_me"
    :class="(isAppear && isIntersected && isLoaded) ? 'info-image_appear' : '' "
    :style="{ '--reveal-delay': `${initialDelay}ms` }"
    ref="elemRef"
  >
    <img :src="src" alt="" @load="isLoaded = true" @error="isLoaded = true" />
  </div>

  <div
    v-else
    :style="{ '--reveal-delay': `${initialDelay}ms` }"
    class="info-image"
    :class="(isAppear && isIntersected && isLoaded) ? 'info-image_appear' : '' "
    ref="elemRef"
  >
    <img :src="src" alt="" @load="isLoaded = true" @error="isLoaded = true" />
  </div>
</template>

<style scoped></style>
