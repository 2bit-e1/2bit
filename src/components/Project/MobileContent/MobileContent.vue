<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import Preloader from "@/components/Preloader.vue";
import { observeMediaReveal } from "@/utils/mediaReveal";
import { useProjectStore } from "@/stores/project";
import { videoAspectRatios } from "@/data/projects/videoAspectRatios";

const { imagesSrc, hasNextProject, hasPreviousProject, entryIndex, entryDirection } = defineProps({
  imagesSrc: Array,
  hasNextProject: Boolean,
  hasPreviousProject: Boolean,
  entryIndex: Number,
  entryDirection: Number,
  isLeaving: Boolean,
});
const emit = defineEmits(["navigateProject", "ready"]);
const projectStore = useProjectStore();

const scrollerRef = ref(null);
const mediaReveals = [];
const lazyObserver = ref(null);
const isLoading = ref(true);
const showPreloader = ref(false);
let isDisposed = false;
let isNavigating = false;
let navigationTimer;
let lastWheelTime = -Infinity;
let touchStart = null;
let entryAnchorObserver;
let revealDirectionTimer;

function restoreEntryEnd() {
  window.scrollTo({ top: document.scrollingElement.scrollHeight, behavior: 'instant' });
}

function stopEntryAnchor() {
  entryAnchorObserver?.disconnect();
  window.removeEventListener('resize', restoreEntryEnd);
  window.visualViewport?.removeEventListener('resize', restoreEntryEnd);
}

watch(() => projectStore.isInfoOpen, isOpen => {
  if (isOpen) stopEntryAnchor();
});

function atGalleryStart() {
  const firstFrame = scrollerRef.value?.firstElementChild;
  return firstFrame?.getBoundingClientRect().height > 0 && document.scrollingElement?.scrollTop <= 2;
}

function atGalleryEnd() {
  const lastFrame = scrollerRef.value?.lastElementChild;
  const page = document.scrollingElement;
  return lastFrame?.getBoundingClientRect().height > 0 && page &&
    page.scrollHeight - page.clientHeight - page.scrollTop <= 2;
}

function advanceProject(direction) {
  const atBoundary = direction > 0 ? hasNextProject && atGalleryEnd() : hasPreviousProject && atGalleryStart();
  if (isDisposed || isLoading.value || isNavigating || projectStore.isInfoOpen || projectStore.isLeavingProject || !atBoundary) return false;
  isNavigating = true;
  navigationTimer = setTimeout(() => isNavigating = false, 1000);
  emit("navigateProject", direction);
  return true;
}

function handleEndWheel(event) {
  if (event.ctrlKey) return;
  stopEntryAnchor();
  const now = performance.now();
  const newGesture = now - lastWheelTime > 220;
  lastWheelTime = now;
  if (newGesture && Math.abs(event.deltaY) > 20 && advanceProject(event.deltaY > 0 ? 1 : -1)) event.preventDefault();
}

function handleEndTouchStart(event) {
  const touch = event.touches[0];
  stopEntryAnchor();
  touchStart = { x: touch.clientX, y: touch.clientY, atEnd: atGalleryEnd(), atStart: atGalleryStart() };
}

function handleEndTouchEnd(event) {
  const touch = event.changedTouches[0];
  if (touchStart && touch) {
    const delta = touchStart.y - touch.clientY;
    if (Math.abs(delta) > 50 && Math.abs(delta) > Math.abs(touchStart.x - touch.clientX) &&
        (delta > 0 ? touchStart.atEnd : touchStart.atStart)) advanceProject(delta > 0 ? 1 : -1);
  }
  touchStart = null;
}

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

  vimeoMuted.value[iframeId] = !isMuted;
}

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

function isEager(index) {
  return index < 5 || index === entryIndex;
}

function updateVideoRatio(event) {
  const video = event.target;
  if (video.videoWidth && video.videoHeight) video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
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
  const preloadLimit = 3;
  return Promise.all(
    srcArray.slice(0, preloadLimit).map(src => {
      return new Promise(resolve => {
        if (isVideo(src)) {
          const video = document.createElement("video");
          video.muted = true;
          video.autoplay = false;
          video.playsInline = true;
          video.preload = "metadata";
          const finish = () => {
            clearTimeout(timeout);
            video.onloadedmetadata = video.onerror = null;
            video.removeAttribute('src');
            video.load();
            resolve();
          };
          const timeout = setTimeout(finish, 2500);
          video.onloadedmetadata = video.onerror = finish;
          // A body-mounted metadata probe expands the mobile viewport to the video's native width.
          video.src = src;
          video.load();
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
  const delay = setTimeout(() => {
    showPreloader.value = true;
  }, 300);

  await Promise.race([
    preloadAllMedia(entryDirection === -1 ? [imagesSrc[entryIndex]] : imagesSrc),
    new Promise(resolve => setTimeout(resolve, 2500)),
  ]);
  clearTimeout(delay);
  if (isDisposed) return;

  isLoading.value = false;

  await nextTick();
  if (!scrollerRef.value) return;
  if (entryDirection === -1) {
    // Hold the last frame in view as earlier lazy images acquire their height.
    restoreEntryEnd();
    entryAnchorObserver = new ResizeObserver(restoreEntryEnd);
    entryAnchorObserver.observe(scrollerRef.value);
    window.addEventListener('resize', restoreEntryEnd);
    window.visualViewport?.addEventListener('resize', restoreEntryEnd);
  }
  emit('ready');
  window.addEventListener("wheel", handleEndWheel, { passive: false });
  window.addEventListener("touchstart", handleEndTouchStart, { passive: true });
  window.addEventListener("touchend", handleEndTouchEnd, { passive: true });

  scrollerRef.value.querySelectorAll(".image-box").forEach((el, index) => {
    const reveal = observeMediaReveal(el, true, entryDirection === -1 && index === entryIndex ? 'up' : undefined);
    mediaReveals.push(reveal);
  });
  revealDirectionTimer = setTimeout(() => mediaReveals.forEach(reveal => reveal.setDirection(undefined)), 1200);

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

  scrollerRef.value.querySelectorAll(".image-box.lazy-video").forEach(el => {
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
  isDisposed = true;
  clearTimeout(navigationTimer);
  clearTimeout(revealDirectionTimer);
  stopEntryAnchor();
  window.removeEventListener("wheel", handleEndWheel);
  window.removeEventListener("touchstart", handleEndTouchStart);
  window.removeEventListener("touchend", handleEndTouchEnd);
  mediaReveals.forEach(reveal => reveal.disconnect());
  lazyObserver.value?.disconnect();
});
</script>

<template>
  <div class="project-gallery" :class="{ 'project-gallery_leaving': isLeaving }">
    <Transition name="preloader-fade">
      <Preloader v-if="isLoading && showPreloader" />
    </Transition>

    <div v-if="!isLoading" class="scroller-vertical" ref="scrollerRef">
      <div
        v-for="(src, ind) in imagesSrc"
        :key="ind"
        class="image-box media-reveal"
        :data-frame-index="ind"
        :class="{ 'lazy-video': isVideo(src) && !isEager(ind) }"
      >
        <div class="image-wrapper media-reveal-content">
          <!-- Картинки -->
          <img
            class="media-reveal-subject"
            v-if="!isVideo(src) && !isVimeo(src)"
            :src="src"
            :loading="isEager(ind) ? 'eager' : 'lazy'"
          />

          <!-- Видео -->
          <video
            class="media-reveal-subject"
            v-else-if="isVideo(src) && isEager(ind)"
            :style="{ aspectRatio: videoAspectRatios[src] || '16 / 9' }"
            :src="src"
            @loadedmetadata="updateVideoRatio"
            autoplay
            muted
            loop
            playsinline
          />
          <video
            class="media-reveal-subject"
            v-else-if="isVideo(src) && !isEager(ind)"
            :style="{ aspectRatio: videoAspectRatios[src] || '16 / 9' }"
            :data-src="src"
            @loadedmetadata="updateVideoRatio"
            autoplay
            muted
            loop
            playsinline
          />

        <!-- Vimeo iframe с кнопкой поверх -->
        <div v-else-if="isVimeo(src)" class="iframe-wrapper media-reveal-subject">
          <iframe
            :id="`vimeo-${ind}`"
            :src="toVimeoEmbed(src)"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
            @load="handleVimeoLoad"
          />
          <div class="iframe-gesture-surface" aria-hidden="true" />
          <button
            type="button"
            class="sound-btn"
            :aria-pressed="vimeoMuted[`vimeo-${ind}`] === false"
            @click="toggleVimeoSound(`vimeo-${ind}`)"
          >
            {{ vimeoMuted[`vimeo-${ind}`] === false ? "🔊" : "🔇" }}
          </button>
        </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.iframe-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
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

.iframe-gesture-surface {
  position: absolute;
  inset: 0;
  z-index: 2;
  touch-action: pan-y;
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
  overflow-x: clip;
}

.image-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper {
  position: relative;
  min-width: 0;
  width: calc(100% - 66px);
  max-width: calc(100% - 66px);
  height: auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper img,
.image-wrapper video {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  max-width: 100%;
  object-fit: cover;
  object-position: center;
}

.image-wrapper video {
  height: auto;
}

iframe::-webkit-media-controls {
  display: none !important;
}

</style>
