<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useProjectStore } from "@/stores/project";
import Preloader from "@/components/Preloader.vue";

const projectStore = useProjectStore();

const { imagesSrc } = defineProps({ imagesSrc: Array });

const activeIndex = ref(0);
const direction = ref(0);
const scrollerRef = ref(null);
let isThrottled = false;

const shouldShowFirstImage = ref(false);
const isLoading = ref(true);
const showPreloader = ref(false);

let touchStartY = 0;
let touchEndY = 0;

// Определяем Vimeo и локальные видео
function isVimeo(src) {
  return /vimeo\.com/i.test(src);
}

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

// Скролл/тач обработчики
function handleTouchStart(e) { touchStartY = e.touches[0].clientY; }
function handleTouchMove(e) { touchEndY = e.touches[0].clientY; }
function handleTouchEnd() {
  const deltaY = touchStartY - touchEndY;
  if (Math.abs(deltaY) < 20) return;
  const dir = deltaY > 0 ? 1 : -1;
  const nextIndex = activeIndex.value + dir;
  if (nextIndex < 0 || nextIndex >= imagesSrc.length) return;
  direction.value = dir;
  activeIndex.value = nextIndex;
  projectStore.setCurrentImage(nextIndex);
  isThrottled = true;
  setTimeout(() => isThrottled = false, 1000);
}

function handleScroll(event) {
  event.preventDefault();
  if (isThrottled) return;
  const deltaY = event.deltaY;
  if (Math.abs(deltaY) < 20) return;
  const dir = deltaY > 0 ? 1 : -1;
  const nextIndex = activeIndex.value + dir;
  if (nextIndex < 0 || nextIndex >= imagesSrc.length) return;
  direction.value = dir;
  activeIndex.value = nextIndex;
  projectStore.setCurrentImage(nextIndex);
  isThrottled = true;
  setTimeout(() => isThrottled = false, 1000);
}

function addScrollListeners() {
  if (!scrollerRef.value) return;
  scrollerRef.value.removeEventListener("wheel", handleScroll);
  scrollerRef.value.removeEventListener("touchstart", handleTouchStart);
  scrollerRef.value.removeEventListener("touchmove", handleTouchMove);
  scrollerRef.value.removeEventListener("touchend", handleTouchEnd);

  scrollerRef.value.addEventListener("wheel", handleScroll, { passive: false });
  scrollerRef.value.addEventListener("touchstart", handleTouchStart, { passive: true });
  scrollerRef.value.addEventListener("touchmove", handleTouchMove, { passive: true });
  scrollerRef.value.addEventListener("touchend", handleTouchEnd, { passive: true });
}

// Прелоад картинок/видео
function preloadAllMedia(srcArray) {
  return Promise.all(
    srcArray.map(src => {
      return new Promise(resolve => {
        if (isVideo(src)) {
          const video = document.createElement("video");
          video.src = src;
          video.onloadeddata = resolve;
          video.onerror = resolve;
        } else if (!isVimeo(src)) {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        } else resolve(); // Vimeo iframe загружается асинхронно
      });
    })
  );
}

onMounted(async () => {
  showPreloader.value = true;
  document.body.style.overflow = "hidden";

  await nextTick();
  projectStore.setCurrentImage(0);

  let preloaderStartTime = null;
  const delay = setTimeout(() => {
    showPreloader.value = true;
    preloaderStartTime = performance.now();
  }, 300);

  await preloadAllMedia(imagesSrc);
  clearTimeout(delay);

  if (preloaderStartTime) {
    const now = performance.now();
    const timeShown = now - preloaderStartTime;
    const timeToWait = 3000 - timeShown;
    if (timeToWait > 0) await new Promise(r => setTimeout(r, timeToWait));
  }

  isLoading.value = false;
  direction.value = 1;

  await nextTick();
  requestAnimationFrame(() => {
    shouldShowFirstImage.value = true;
    addScrollListeners();
  });
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  if (scrollerRef.value) {
    scrollerRef.value.removeEventListener("wheel", handleScroll);
    scrollerRef.value.removeEventListener("touchstart", handleTouchStart);
    scrollerRef.value.removeEventListener("touchmove", handleTouchMove);
    scrollerRef.value.removeEventListener("touchend", handleTouchEnd);
  }
});
</script>

<template>
  <div>
    <Preloader v-if="isLoading && showPreloader" />

    <div v-else class="scroller-vertical" ref="scrollerRef">
      <div
        v-for="(src, ind) in imagesSrc"
        :key="ind"
        class="image-box"
        :class="{
          'in-view': (ind === activeIndex) && (ind !== 0 || shouldShowFirstImage),
          'above': ind < activeIndex,
          'below': ind > activeIndex,
          'from-top': direction === -1 && ind === activeIndex,
          'from-bottom': direction === 1 && ind === activeIndex,
        }"
      >
        <div class="image-wrapper">
          <div class="media">
            <img v-if="!isVideo(src) && !isVimeo(src)" :src="src" />
            <video v-else-if="isVideo(src)" :src="src" autoplay muted loop playsinline />
            <iframe 
              v-else-if="isVimeo(src)"
              :src="`${src}?autoplay=1&muted=1&loop=1&background=0`"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            />
          </div>
          <div class="mask" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

/* оставляем все стили как у тебя, iframe тоже растягивается по media */
.media iframe {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.media {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media img,
.media video {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.scroller-vertical {
  position: relative;
  height: 100dvh;
  overflow: hidden;
  background: #f8f8f8;
}

.image-box {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.8s ease, translate 0.8s ease;
  will-change: transform, opacity, translate;
  pointer-events: none;
  z-index: 1;
}

.image-box.in-view {
  opacity: 1;
  pointer-events: auto;
  z-index: 2;
}

.image-box.from-top {
  translate: 0 -100%;
}

.image-box.from-bottom {
  translate: 0 100%;
}

.image-box.in-view.from-top,
.image-box.in-view.from-bottom {
  translate: 0 0;
}

.image-box.above {
  translate: 0 -100%;
}

.image-box.below {
  translate: 0 100%;
}

.image-wrapper {
  position: relative;
  width: 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  padding: 60px;
}

.image-wrapper img,
.image-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(1.2);
  transition: transform 1s ease;
  will-change: transform;
}

.image-box.in-view img,
.image-box.in-view video {
  transform: scale(1);
}

.mask {
  position: absolute;
  inset: 0;
  background: #f8f8f8;
  z-index: 2;
  transform: translateY(0%);
  transition: transform 1s ease;
  will-change: transform;
}

.image-box.in-view .mask {
  transform: translateY(-100%);
}

@media (max-width: 1368px) {
  .image-wrapper {
    width: 90vw;
  }
}

@media (max-width: 1366px) and (max-height: 950px) {

}
</style>
