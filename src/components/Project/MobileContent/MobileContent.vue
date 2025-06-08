<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useProjectStore } from '@/stores/project'

const { imagesSrc } = defineProps({
  imagesSrc: Array,
})

const projectStore = useProjectStore()
const currentIndex = ref(0)
projectStore.setCurrentImage(0)

let isScrolling = false
let touchStartY = 0
let touchEndY = 0

const scrollToIndex = (index) => {
  if (index < 0 || index >= imagesSrc.length) return
  currentIndex.value = index
  projectStore.setCurrentImage(index)
}

const handleWheel = (e) => {
  if (isScrolling) return

  isScrolling = true
  if (e.deltaY > 0) {
    scrollToIndex(currentIndex.value + 1)
  } else if (e.deltaY < 0) {
    scrollToIndex(currentIndex.value - 1)
  }

  setTimeout(() => {
    isScrolling = false
  }, 700)
}

const handleTouchStart = (e) => {
  touchStartY = e.changedTouches[0].clientY
}

const handleTouchEnd = (e) => {
  touchEndY = e.changedTouches[0].clientY
  const deltaY = touchStartY - touchEndY

  if (Math.abs(deltaY) < 50 || isScrolling) return

  isScrolling = true

  if (deltaY > 0) {
    scrollToIndex(currentIndex.value + 1)
  } else {
    scrollToIndex(currentIndex.value - 1)
  }

  setTimeout(() => {
    isScrolling = false
  }, 700)
}

onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchend', handleTouchEnd, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <div class="mobile-scroller">
    <div
      v-for="(imageSrc, ind) in imagesSrc"
      :key="ind"
      class="mobile-image-box"
      :class="{
        'mobile-image-box_active': currentIndex === ind,
        'mobile-image-box_above': ind < currentIndex,
        'mobile-image-box_below': ind > currentIndex
      }"
    >
      <img :src="imageSrc" />
    </div>
  </div>
</template>

<style scoped>
.mobile-scroller {
  position: fixed;
  top: 65px; /* header height */
  left: 0;
  width: 100%;
  height: calc(100vh - 65px - 45px); /* full viewport minus header and footer */
  overflow: hidden;
}

/* Raise the scroller 50px from the bottom on mobile */
@media (max-width: 768px) {
  .mobile-scroller {
    bottom: 50px;
    height: calc(100vh - 65px - 45px - 50px);
  }
}

.mobile-image-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  transition: transform 0.6s ease;
  z-index: 1;
}

.mobile-image-box img {
  max-height: 100%;
  width: auto;
  max-width: calc(100% - 40px);
  object-fit: cover;
  object-position: bottom;
}

/* Active/transition states */
.mobile-image-box_active {
  transform: translateY(0%);
  z-index: 2;
}

.mobile-image-box_above {
  transform: translateY(-100%);
}

.mobile-image-box_below {
  transform: translateY(100%);
}
</style>

<style>
body {
  transition: none;
  will-change: unset;
}
</style>
