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

const vimeoMuted = ref({}); // храню состояние по id

function toggleVimeoSound(iframeId) {
  const iframe = document.getElementById(iframeId);
  if (!iframe) return;

  const isMuted = vimeoMuted.value[iframeId] ?? true;

  iframe.contentWindow?.postMessage(
    JSON.stringify({
      method: "setVolume",
      value: isMuted ? 1 : 0
    }),
    "https://player.vimeo.com"
  );

  // меняем кнопку (иконка)
  const btn = iframe.nextElementSibling;
  if (btn) btn.textContent = isMuted ? "🔊" : "🔇";

  vimeoMuted.value[iframeId] = !isMuted;
}

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

function isVimeo(src) {
  return /vimeo\.com/i.test(src);
}

function toVimeoEmbed(src) {
  const cleaned = src.replace(/&amp;/g, "&");
  const match = cleaned.match(/(?:player\.vimeo\.com\/(?:video\/)?|vimeo\.com\/(?:.*\/)?)(\d+)/i);
  if (!match) return src;
  const id = match[1];
  const params = new URLSearchParams();
  try {
    const url = new URL(cleaned);
    url.searchParams.forEach((value, key) => params.set(key, value));
  } catch {}
  params.set("autoplay", "1");
  params.set("muted", "1");
  params.set("loop", "1");
  params.set("background", "1");
  params.set("playsinline", "1");
  params.set("api", "1");
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}

function handleVimeoLoad(event) {
  event.target.contentWindow?.postMessage(
    JSON.stringify({ method: "play" }),
    "https://player.vimeo.com"
  );
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
        "https://player.vimeo.com"
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

        <!-- Vimeo iframe с кнопкой поверх -->
        <div v-else-if="isVimeo(src)" class="iframe-wrapper">
          <iframe
            :id="`vimeo-${ind}`"
            :src="toVimeoEmbed(src)"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
            @load="handleVimeoLoad"
          />
          <button
            type="button"
            class="sound-btn"
            @click="toggleVimeoSound(`vimeo-${ind}`)"
          >
            🔇
          </button>
        </div>

          <div class="mask" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.iframe-wrapper {
  position: relative;
  width: calc(100% - 66px);
  max-width: calc(100% - 66px);
  height: calc((100vw - 66px) * 9 / 16);
  display: block;
}

.iframe-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}

.sound-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10; /* гарантированно поверх */
  background: rgba(0,0,0,0.6);
  border: none;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}


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
  width: 100%;
  height: 100%;
  max-width: calc(100% - 66px);
  object-fit: cover;
  object-position: center;
  transform: scale(1.2);
  transition: transform 0.8s ease;
  will-change: transform;
}



iframe::-webkit-media-controls {
  display: none !important;
}

.image-box.in-view .mask {
  transform: translateY(-100%);
}

.image-box.in-view img,
.image-box.in-view video,
.image-box.in-view iframe {
  transform: scale(1);
}

</style>
