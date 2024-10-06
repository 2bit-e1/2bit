<script setup>
import { PAGE_NAMES } from '@/utils/constants';
import { useMediaPopupStore } from '@/stores/mediaPopup';
import { useIntersectionObserver } from '@/utils/useIntersectionObserver';
import { ref, watchEffect } from 'vue';
import Video from '@/components/Video.vue';
import VideoPopup from '../VideoPopup.vue';

const props = defineProps({
  src: String,
  isAppear: Boolean,
  initialDelay: String,
})

const mediaPopupStore = useMediaPopupStore();

const appearDelay = ref(null);
const elemRef = ref(null);
const isIntersected = ref(false);

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting) isIntersected.value = true;
};

useIntersectionObserver(elemRef, handleIntersect);

const handleVideoClick = () => {
  mediaPopupStore.openPopup(props.src, 'Showreel', '2bit ‘24');
}

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
    class="info-video"
    :class="(isAppear && isIntersected) ? 'info-video_appear' : '' "
    :style="{ 'animation-delay': (appearDelay == null ? initialDelay : appearDelay) }"
    ref="elemRef"
    tabindex="0"
    @click="handleVideoClick"
    v-bind="$attrs"
  >
    <Video isPlaying :videoSrc="src" />
  </div>
</template>

<style scoped></style>
