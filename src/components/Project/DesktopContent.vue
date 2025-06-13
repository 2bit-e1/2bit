<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const { imagesSrc } = defineProps({
  imagesSrc: Array
});

const activeIndex = ref(0);
const direction = ref(0); // -1 (вверх), 1 (вниз)
const scrollerRef = ref(null);
let isThrottled = false;

function handleScroll(event) {
  event.preventDefault(); // предотвращаем скролл страницы

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
  // блокируем scroll страницы
  document.body.style.overflow = "hidden";

  if (scrollerRef.value) {
    scrollerRef.value.addEventListener("wheel", handleScroll, { passive: false });
  }
});

onBeforeUnmount(() => {
  // возвращаем scroll
  document.body.style.overflow = "";

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
      <img :src="imageSrc" loading="lazy" />
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

/* базовый блок */
.image-box {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scaleY(0.5);
  opacity: 0;
  transition:
    transform 0.8s ease,
    opacity 0.8s ease,
    translate 0.8s ease;
  will-change: transform, opacity, translate;
  pointer-events: none;
  z-index: 1;
}

/* активный */
.image-box.in-view {
  transform: scaleY(1);
  opacity: 1;
  pointer-events: auto;
  z-index: 2;
}

/* откуда появляется */
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

/* старые картинки уезжают вверх или вниз */
.image-box.above {
  translate: 0 -100%;
}
.image-box.below {
  translate: 0 100%;
}

.image-box img {
  height: 80%;
  max-width: 80vw;
  object-fit: cover;
  object-position: center;
}
</style>
