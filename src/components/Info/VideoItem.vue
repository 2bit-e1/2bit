<script setup>
import { vMediaReveal } from '@/utils/mediaReveal'
import { useMediaPopupStore } from '@/stores/mediaPopup'
import Video from '@/components/Video.vue'

const props = defineProps({
  src: String,
  poster: String,
  name: { type: String, default: 'Showreel' },
  author: { type: String, default: '2bit ‘24' },
  isAppear: Boolean,
  initialDelay: { type: Number, default: 0 },
})

const mediaPopupStore = useMediaPopupStore()

const handleVideoClick = () => {
  mediaPopupStore.openPopup(props.src, props.name, props.author, 'video')
}

</script>

<template>
  <div
    class="info-video"
    v-media-reveal="isAppear"
    :style="{ '--reveal-delay': `${initialDelay}ms` }"
    tabindex="0"
    role="button"
    :aria-label="`Открыть: ${name}`"
    @click="handleVideoClick"
    @keydown.enter.prevent="handleVideoClick"
    @keydown.space.prevent="handleVideoClick"
  >
    <div class="media-reveal-content">
      <Video class="media-reveal-subject" :muted="true" playsinline isPlaying :videoSrc="src" :poster="poster" loop/>
    </div>
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
