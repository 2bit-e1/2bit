<script setup>
import { vMediaReveal } from '@/utils/mediaReveal'
import { useMediaPopupStore } from '@/stores/mediaPopup'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { createMediaWindow } from '@/utils/mediaWindow'
import MediaLoadingState from '@/components/MediaLoadingState.vue'

const props = defineProps({
  src: String,
  isAppear: Boolean,
  initialDelay: { type: Number, default: 0 },
  name: { type: String, default: 'Iframe project' },
  author: { type: String, default: '2bit' }
})

const mediaPopupStore = useMediaPopupStore()
const frameRef = ref(null)
const isReady = ref(false)
const mediaState = ref({ state: 'loading', active: false })
let mediaWindow
onMounted(() => {
  mediaWindow = createMediaWindow({ onStateChange: (_element, state, info) => { isReady.value = info.ready; mediaState.value = { state, ...info } } })
  mediaWindow.setFrames([frameRef.value])
  mediaWindow.setSuspended(mediaPopupStore.popupData.isOpen)
})
watch(() => mediaPopupStore.popupData.isOpen, value => mediaWindow?.setSuspended(value))
watch(() => props.src, () => mediaWindow?.setFrames([frameRef.value]), { flush: 'post' })
onBeforeUnmount(() => mediaWindow?.destroy())
const handleIframeClick = (e) => {
  // prevent default just in case, then open popup
  e?.preventDefault?.()
  mediaPopupStore.openPopup(props.src, props.name, props.author, 'iframe')
}

const handleKey = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleIframeClick(e)
  }
}

</script>

<template>
  <div
    ref="frameRef"
    class="info-video"
    v-media-reveal="isAppear && isReady"
    :style="{ '--reveal-delay': `${initialDelay}ms` }"
    >
    <div class="iframe-wrapper media-reveal-content">
      <iframe
        class="media-reveal-subject"
        :data-media-src="src"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      />
      <!-- Полностью прозрачная кнопка-оверлей, ловит клик/тач и клавиши -->
      <button
        class="iframe-overlay"
        @click="handleIframeClick"
        @keydown="handleKey"
        :aria-label="`Открыть: ${props.name}`"
        type="button"
      >
       
      </button>
    </div>
    <MediaLoadingState :visible="mediaState.active" :state="mediaState.state" @retry="mediaWindow?.retry(frameRef)" />
  </div>
</template>

<style scoped>
.info-video {
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  height: 100%;
}

.iframe-wrapper iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
  object-fit: contain;
}

/* полностью прозрачная кнопка */
.iframe-overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
  z-index: 2;
}

/* для accessibility */
.iframe-overlay:focus {
  outline: 2px solid rgba(255,255,255,0.3);
  outline-offset: -2px;
}
</style>
