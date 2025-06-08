<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useProjectStore } from "@/stores/project";

const { imagesSrc } = defineProps({
  imagesSrc: Array
});

const projectStore = useProjectStore();
const currentIndex = ref(0);
projectStore.setCurrentImage(0);

let isScrolling = false;
let touchStartY = 0;
let touchEndY = 0;

const scrollToIndex = (index) => {
  if (index < 0 || index >= imagesSrc.length) return;
  currentIndex.value = index;
  projectStore.setCurrentImage(index);
};

const handleWheel = (e) => {
  if (isScrolling) return;

  isScrolling = true;

  if (e.deltaY > 0) {
    scrollToIndex(currentIndex.value + 1);
  } else if (e.deltaY < 0) {
    scrollToIndex(currentIndex.value - 1);
  }

  setTimeout(() => {
    isScrolling = false;
  }, 700);
};

const handleTouchStart = (e) => {
  touchStartY = e.changedTouches[0].clientY;
};

const handleTouchEnd = (e) => {
  touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;

  if (Math.abs(deltaY) < 50 || isScrolling) return; // игнорируем мелкие движения

  isScrolling = true;

  if (deltaY > 0) {
    scrollToIndex(currentIndex.value + 1); // свайп вверх → след. слайд
  } else {
    scrollToIndex(currentIndex.value - 1); // свайп вниз → пред. слайд
  }

  setTimeout(() => {
    isScrolling = false;
  }, 700);
};

onMounted(() => {
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchend", handleTouchEnd, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("wheel", handleWheel);
  window.removeEventListener("touchstart", handleTouchStart);
  window.removeEventListener("touchend", handleTouchEnd);
});
</script>



<template>  
   <div class="scroller">
    <div
      v-for="(imageSrc, ind) in imagesSrc"
      :key="ind"
      class="image-box"
      :class="{
        'image-box_active': currentIndex === ind,
        'image-box_above': ind < currentIndex,
        'image-box_below': ind > currentIndex
      }"
    >
      <img :src="imageSrc" />
    </div>
  </div>
</template>


<style scoped>

.scroller {
  position: fixed; /* это нужно, если ещё не было */
  top: var(--header-height);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--header-height) - var(--footer-height));
  overflow: hidden;
}

.image-box {
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100vh - var(--header-height) - var(--footer-height));
  width: 100%;
  display: flex;
  justify-content: center; /* центр по горизонтали */
  align-items: flex-end;   /* или center — если хочешь по центру по вертикали */
  transition: transform 0.6s ease;
  z-index: 1;
}

.image-box img {
  max-height: 100%;
  width: auto;
  max-width: calc(100% - 214px); /* или убери это, если мешает на мобилках */
  object-fit: cover;
  object-position: bottom;
}

/* Transition states */
.image-box_active {
  transform: translateY(0%);
  z-index: 2;
}

.image-box_above {
  transform: translateY(-100%);
}

.image-box_below {
  transform: translateY(100%);
}
</style>

<style>
body {
  transition: none;
  will-change: unset;
}
</style>
