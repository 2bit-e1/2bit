<script setup>
import { useIntersectionObserver } from '@/utils/useIntersectionObserver'
import { ref, watchEffect } from 'vue'
import { useMediaPopupStore } from '@/stores/mediaPopup'
import Video from '@/components/Video.vue'

const props = defineProps({
  src: String,
  isAppear: Boolean,
  initialDelay: String,
})

const mediaPopupStore = useMediaPopupStore()

const appearDelay = ref(null)
const elemRef = ref(null)
const isIntersected = ref(false)

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting || elemRef.value?.getBoundingClientRect().top < window.innerHeight) {
    isIntersected.value = true
  }
}

useIntersectionObserver(elemRef, handleIntersect)

const handleVideoClick = () => {
  mediaPopupStore.openPopup(props.src, 'Showreel', '2bit ‘24', 'video')
}

watchEffect(() => {
  if (props.isAppear) {
    setTimeout(() => {
      appearDelay.value = '200ms'
    }, 1000)
  }
})
</script>

<template>
  <div
    class="info-video"
    :class="(isAppear && isIntersected) ? 'info-video_appear' : '' "
    :style="{ 'animation-delay': (appearDelay == null ? initialDelay : appearDelay) }"
    ref="elemRef"
    tabindex="0"
    @click="handleVideoClick"
  >
    <Video :muted="true" playsinline isPlaying :videoSrc="src" loop/>
  </div>
</template>

<style scoped>
.info-video {
  z-index: 1;
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
  cursor: pointer;
}
</style>
