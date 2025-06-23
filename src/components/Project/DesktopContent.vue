<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useProjectStore } from "@/stores/project";
import Preloader from "@/components/Preloader.vue";

const projectStore = useProjectStore();

const { imagesSrc } = defineProps({
  imagesSrc: Array
});

const activeIndex = ref(0);
const direction = ref(0);
const scrollerRef = ref(null);
let isThrottled = false;

const shouldShowFirstImage = ref(false);
const isLoading = ref(true);
const showPreloader = ref(false);

//новинка для айпада снизу
let touchStartY = 0;
let touchEndY = 0;

function handleTouchStart(e) {
  touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
  touchEndY = e.touches[0].clientY;
}

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
  setTimeout(() => {
    isThrottled = false;
  }, 1000);
}
//новинка для айпада сверху

function handleScroll(event) {
  event.preventDefault();
  if (isThrottled) return;

  const deltaY = event.deltaY;
  if (Math.abs(deltaY) < 20) return;

  const dir = deltaY > 0 ? 1 : -1;
  const nextIndex = activeIndex.value + dir;

  if (nextIndex < 0 || nextIndex >= imagesSrc.length) return;

  direction.value = dir;
  isThrottled = true;
  activeIndex.value = nextIndex;
  projectStore.setCurrentImage(nextIndex);

  setTimeout(() => {
    isThrottled = false;
  }, 1000);
}

function preloadAllImages(srcArray) {
  return Promise.all(
    srcArray.map(src => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });
    })
  );
}

onMounted(async () => {
  projectStore.setCurrentImage(0);

  if (scrollerRef.value) {
    scrollerRef.value.addEventListener("wheel", handleScroll, { passive: false });

     //  Добавим слушатели для сенсорных экранов
    scrollerRef.value.addEventListener("touchstart", handleTouchStart, { passive: true });
    scrollerRef.value.addEventListener("touchmove", handleTouchMove, { passive: true });
    scrollerRef.value.addEventListener("touchend", handleTouchEnd, { passive: true });
  }

  // Таймер на 300мс: если загрузка медленная — показываем прелоадер
  let preloaderStartTime = null;

  const delay = setTimeout(() => {
    showPreloader.value = true;
    preloaderStartTime = performance.now(); // засечь время показа
  }, 300);

  await preloadAllImages(imagesSrc);
  clearTimeout(delay);

  if (preloaderStartTime) {
    const now = performance.now();
    const timeShown = now - preloaderStartTime;
    const timeToWait = 3000 - timeShown;

    if (timeToWait > 0) {
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }
  }

  isLoading.value = false;
  direction.value = 1;

  await nextTick();
  requestAnimationFrame(() => {
    shouldShowFirstImage.value = true;
  });
});


onBeforeUnmount(() => {
  document.body.style.overflow = "";

  if (scrollerRef.value) {
    scrollerRef.value.removeEventListener("wheel", handleScroll);
    //для сенсеров
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
        v-for="(imageSrc, ind) in imagesSrc"
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
          <img :src="imageSrc" />
          <div class="mask" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroller-vertical {
  position: relative;
  height: 100vh;
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
  transition:
    opacity 0.8s ease,
    translate 0.8s ease;
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
  height: 80.76%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  box-shadow: 0 -0.5px 0 #f8f8f8;
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

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(1.2);
  transition: transform 1s ease;
  will-change: transform;
}

.image-box.in-view img {
  transform: scale(1);
}

@media (max-width: 1368px) {
  .image-wrapper {
    width: 90vw;
  }
}
</style>
