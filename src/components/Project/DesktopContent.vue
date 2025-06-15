<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const { imagesSrc } = defineProps({
  imagesSrc: Array
});

const activeIndex = ref(0);
const direction = ref(0); // -1 вверх, 1 вниз
const scrollerRef = ref(null);
let isThrottled = false;

function handleScroll(event) {
  event.preventDefault(); // Блокируем скролл страницы

  if (isThrottled) return;

  const dir = event.deltaY > 0 ? 1 : -1;
  const nextIndex = activeIndex.value + dir;

  if (nextIndex < 0 || nextIndex >= imagesSrc.length) return;

  direction.value = dir;
  isThrottled = true;
  activeIndex.value = nextIndex;

  setTimeout(() => {
    isThrottled = false;
  }, 1000);
}

onMounted(() => {
  document.body.style.overflow = "hidden"; // Блокируем прокрутку страницы

  if (scrollerRef.value) {
    scrollerRef.value.addEventListener("wheel", handleScroll, { passive: false });
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = ""; // Возвращаем прокрутку

  if (scrollerRef.value) {
    scrollerRef.value.removeEventListener("wheel", handleScroll);
  }
});
</script>

<template>
  <div class="scroller-vertical" ref="scrollerRef">
    <div
      v-for="(imageSrc, ind) in imagesSrc"
      :key="ind"
      class="image-box"
      :class="{
        'in-view': ind === activeIndex,
        'above': ind < activeIndex,
        'below': ind > activeIndex,
        'from-top': direction === -1 && ind === activeIndex,
        'from-bottom': direction === 1 && ind === activeIndex,
      }"
    >
      <div class="image-wrapper">
        <img :src="imageSrc" loading="lazy" />
        <div class="mask" />
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

/* Обертка для картинки и маски */
.image-wrapper {
  position: relative;
  width: 80vw;
  height: 80vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Маска поверх картинки */
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

/* Картинка увеличена и масштабируется до нормального размера */
.image-wrapper img {
  position: relative;
  z-index: 1;
  height: 100%;
  width: auto;
  object-fit: cover;
  object-position: center;
  transform: scale(1.2);
  transition: transform 1s ease;
  will-change: transform;
}

.image-box.in-view img {
  transform: scale(1);
}
</style>

<style>
@media (min-width: 1024px) {
   body {
    transition: filter 0s ease;
    will-change: filter;
  }

  body.inverted {
    filter: none;
    transition: none;
  }
}
</style>
