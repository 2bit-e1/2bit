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

function isVimeo(src) {
  return /vimeo\.com/i.test(src);
}

function toVimeoEmbed(src) {
  const match = src.match(/vimeo\.com\/(\d+)/);
  if (!match) return src;
  const id = match[1];
  return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`;
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

          video.load();
          document.body.appendChild(video);
          setTimeout(() => {
            document.body.removeChild(video);
          }, 1000);
        } else if (!isVimeo(src)) {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        } else {
          resolve(); // Vimeo iframe не прелоадим
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

  // Принудительный запуск Vimeo после загрузки iframe
  document.querySelectorAll(".image-wrapper iframe").forEach(iframe => {
    iframe.addEventListener("load", () => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ method: "play" }),
        "*"
      );
    });
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
          <!-- Картинки -->
          <img
            v-if="!isVideo(src) && !isVimeo(src)"
            :src="src"
            :loading="ind < 5 ? 'eager' : 'lazy'"
          />

          <!-- Видео -->
          <video
            v-else-if="isVideo(src) && ind < 5"
            :src="src"
            autoplay
            muted
            loop
            playsinline
          />
          <video
            v-else-if="isVideo(src) && ind >= 5"
            :data-src="src"
            autoplay
            muted
            loop
            playsinline
          />

          <!-- Vimeo iframe -->
          <iframe
            v-else-if="isVimeo(src)"
            :src="toVimeoEmbed(src)"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
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
.image-wrapper video,
.image-wrapper iframe {
  position: relative;
  z-index: 1;
  width: 100%;
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
.image-box.in-view video,
.image-box.in-view iframe {
  transform: scale(1);
}

@media (max-width: 1024px) {
  .image-wrapper img,
  .image-wrapper video,
  .image-wrapper iframe {
    width: 860px;
    height: auto;
  }

  .image-wrapper iframe {
    height: 60vh;
  }
}
</style>
