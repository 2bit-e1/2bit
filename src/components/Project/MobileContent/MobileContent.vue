<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useProjectStore } from "@/stores/project";

const { imagesSrc } = defineProps({
  imagesSrc: Array,
});

const projectStore = useProjectStore();
const currentIndex = ref(0);
projectStore.setCurrentImage(0);

let isScrolling = false;
let touchStartY = 0;

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
  } else {
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
  const deltaY = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(deltaY) < 50 || isScrolling) return;

  isScrolling = true;
  if (deltaY > 0) {
    scrollToIndex(currentIndex.value + 1);
  } else {
    scrollToIndex(currentIndex.value - 1);
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
  <div class="mobile-scroller">
    <div
      v-for="(src, ind) in imagesSrc"
      :key="ind"
      class="mobile-image-box"
      :class="{
        'mobile-image-box_active': currentIndex === ind,
        'mobile-image-box_above': ind < currentIndex,
        'mobile-image-box_below': ind > currentIndex,
      }"
    >
      <img :src="src" />
    </div>
  </div>
</template>

<style scoped>
.mobile-scroller {
  position: fixed;
  top: 65px; /* header height */
  left: 0;
  width: 100%;
  height: calc(100vh - 65px - 45px); /* 65px header, 45px footer */
  overflow: hidden;
}

.mobile-image-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh - 65px - 45px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  transition: transform 0.6s ease;
  z-index: 1;
}

.mobile-image-box img {
  max-height: 100%;
  width: auto;
  max-width: calc(100% - 40px); /* немного отступов по бокам */
  object-fit: cover;
  object-position: bottom;
}

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
