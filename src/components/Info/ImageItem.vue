<script setup>
import { PAGE_NAMES } from '@/utils/constants';
import { vMediaReveal } from '@/utils/mediaReveal';
import { ref } from 'vue';

const props = defineProps({
  src: String,
  pageName: String,
  isAppear: Boolean,
  initialDelay: { type: Number, default: 0 },
})

const isLoaded = ref(false);

</script>

<template>
  <div
    v-media-reveal="isAppear && isLoaded"
    class="info-image"
    :class="{ 'info-image_me': pageName == PAGE_NAMES.me }"
    :style="{ '--reveal-delay': `${initialDelay}ms` }"
  >
    <div class="media-reveal-content">
      <img class="media-reveal-subject" :src="src" alt="" @load="isLoaded = true" @error="isLoaded = true" />
    </div>
  </div>
</template>

<style scoped></style>
