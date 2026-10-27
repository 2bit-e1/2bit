<script setup>
import { vMediaReveal } from '@/utils/mediaReveal'
import { useMediaPopupStore } from '@/stores/mediaPopup'
import Video from '@/components/Video.vue'
import { ref } from 'vue'
import MediaLoadingState from '@/components/MediaLoadingState.vue'
import { mediaDimensions } from '@/data/mediaDimensions'
const videoRef = ref(null)
const mediaState = ref({ state: 'loading', ready: false, active: false })

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
    v-media-reveal="isAppear && mediaState.ready"
    :style="{ '--reveal-delay': `${initialDelay}ms` }"
    tabindex="0"
    role="button"
    :aria-label="`Открыть: ${name}`"
    @click="handleVideoClick"
    @keydown.enter.prevent="handleVideoClick"
    @keydown.space.prevent="handleVideoClick"
  >
    <div class="media-reveal-content">
      <Video ref="videoRef" class="media-reveal-subject" :style="{ aspectRatio: (mediaDimensions[src] || [16, 9]).join(' / ') }" :muted="true" playsinline :isPlaying="isAppear && !mediaPopupStore.popupData.isOpen" :videoSrc="src" loop @state-change="mediaState = $event" />
    </div>
    <MediaLoadingState :visible="mediaState.active" :state="mediaState.state" @keydown.stop @retry="videoRef?.retry()" />
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
