<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import Preloader from "@/components/Preloader.vue";

const { imagesSrc } = defineProps({
  imagesSrc: Array
});

const observer = ref(null);
const lazyObserver = ref(null);
const isLoading = ref(true);
const showPreloader = ref(false);

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

function preloadAllMedia(srcArray) {
  const preloadLimit = 10;
  return Promise.all(
    srcArray.slice(0, preloadLimit).map(src => {
      return new Promise(resolve => {
        if (isVideo(src)) {
          const video = document.createElement("video");
          video.muted = true;
          video.autoplay = false;
          video.playsInline = true;
          video.preload = "auto";
          video.src = src;

          video.onloadeddata = resolve;
          video.onerror = resolve;

          // iOS Safari fix: вызов .load() и добавление в DOM
          video.load();
          document.body.appendChild(video); // добавить в DOM
          setTimeout(() => {
            document.body.removeChild(video); // удалить
          }, 1000);
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

  // IntersectionObserver для появления
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains("in-view")) {
        entry.target.classList.add("in-view");
        observer.value.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".image-box").forEach(el => {
    observer.value.observe(el);
  });

  // Lazy load видео
  lazyObserver.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const videoEl = entry.target.querySelector("video[data-src]");
        if (videoEl && !videoEl.src) {
          videoEl.src = videoEl.dataset.src;
        }
        lazyObserver.value.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".image-box.lazy-video").forEach(el => {
    lazyObserver.value.observe(el);
  });
});

onBeforeUnmount(() => {
  observer.value?.disconnect();
  lazyObserver.value?.disconnect();
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
        :class="{ 'lazy-video': isVideo(src) && ind >= 5 }"
      >
        <div class="image-wrapper">
          <!-- Изображения -->
          <img
            v-if="!isVideo(src)"
            :src="src"
            :loading="ind < 5 ? 'eager' : 'lazy'"
          />

          <!-- Видео (сразу и отложенная загрузка) -->
          <video
            v-else-if="ind < 5"
            :src="src"
            autoplay
            muted
            loop
            playsinline
          />
          <video
            v-else
            :data-src="src"
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
