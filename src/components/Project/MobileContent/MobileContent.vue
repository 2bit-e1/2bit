<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import Preloader from "@/components/Preloader.vue";

const { imagesSrc } = defineProps({
  imagesSrc: Array
});

const observer = ref(null);
const isLoading = ref(true);
const showPreloader = ref(false);

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

function preloadAllMedia(srcArray) {
  return Promise.all(
    srcArray.map(src => {
      return new Promise(resolve => {
        if (isVideo(src)) {
          const video = document.createElement("video");
          video.src = src;
          video.onloadeddata = resolve;
          video.onerror = resolve;
        } else {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        }
      });
    })
  );
}

onMounted(async () => {
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
    if (timeToWait > 0) {
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }
  }

  isLoading.value = false;

  await nextTick();

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("in-view")) {
          entry.target.classList.add("in-view");
          observer.value.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll(".image-box").forEach((el) => {
    observer.value.observe(el);
  });
});

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<template>
  <div>
    <Preloader v-if="isLoading && showPreloader" />

    <div v-else class="scroller-vertical">
      <div
        v-for="(src, ind) in imagesSrc"
        :key="ind"
        class="image-box"
      >
        <div class="image-wrapper">
          <img
            v-if="!isVideo(src)"
            :src="src"
          />
          <video
            v-else
            :src="src"
            autoplay
            muted
            loop
            playsinline
          />
          <div class="mask" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroller-vertical {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 102px 0;
  background: #f8f8f8;
}

.image-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mask {
  position: absolute;
  inset: 0;
  background: #f8f8f8;
  z-index: 2;
  transform: translateY(0%);
  transition: transform 0.8s ease;
  will-change: transform;
}

.image-wrapper img,
.image-wrapper video {
  position: relative;
  z-index: 1;
  width: auto;
  height: 100%;
  max-width: calc(100% - 40px);
  object-fit: cover;
  object-position: center;
  transform: scale(1.2);
  transition: transform 0.8s ease;
  will-change: transform;
}

.image-box.in-view .mask {
  transform: translateY(-100%);
}

.image-box.in-view img,
.image-box.in-view video {
  transform: scale(1);
}

@media (max-width: 1024px) {
  .image-wrapper img,
  .image-wrapper video {
    width: 860px;
  }
}
</style>
