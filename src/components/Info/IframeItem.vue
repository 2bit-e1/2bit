<script setup>
import { useIntersectionObserver } from '@/utils/useIntersectionObserver'
import { ref, watchEffect } from 'vue'
import { useMediaPopupStore } from '@/stores/mediaPopup'

const props = defineProps({
  src: String,
  isAppear: Boolean,
  initialDelay: String,
  name: { type: String, default: 'Iframe project' },
  author: { type: String, default: '2bit' }
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
    >
    <div class="iframe-wrapper">
      <iframe
        :src="src"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        loading="lazy"
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
