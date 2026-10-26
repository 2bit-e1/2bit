<script setup>
import { useIntersectionObserver } from '@/utils/useIntersectionObserver'
import { ref } from 'vue'
import { useMediaPopupStore } from '@/stores/mediaPopup'
import Video from '@/components/Video.vue'

const props = defineProps({
  src: String,
  isAppear: Boolean,
  initialDelay: { type: Number, default: 0 },
})

const mediaPopupStore = useMediaPopupStore()

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

</script>

<template>
  <div
    class="info-video"
    :class="(isAppear && isIntersected) ? 'info-video_appear' : '' "
    :style="{ '--reveal-delay': `${initialDelay}ms` }"
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
