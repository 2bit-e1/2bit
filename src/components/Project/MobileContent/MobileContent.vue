<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import Preloader from "@/components/Preloader.vue";
import { observeMediaReveal } from "@/utils/mediaReveal";
import { useProjectStore } from "@/stores/project";
import { mediaDimensions } from '@/data/mediaDimensions';
import { createMediaWindow } from '@/utils/mediaWindow';
import MediaLoadingState from '@/components/MediaLoadingState.vue';

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
const mediaReveals = new Map();
let mediaWindow;
const isLoading = ref(true);
const loadingState = ref('loading');
const frameStates = ref({});
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
  mediaWindow?.setSuspended(isOpen);
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

onMounted(async () => {
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
  window.addEventListener("wheel", handleEndWheel, { passive: false });
  window.addEventListener("touchstart", handleEndTouchStart, { passive: true });
  window.addEventListener("touchend", handleEndTouchEnd, { passive: true });

  scrollerRef.value.querySelectorAll(".image-box").forEach((el, index) => {
    const reveal = observeMediaReveal(el, false, entryDirection === -1 && index === entryIndex ? 'up' : undefined);
    mediaReveals.set(el, reveal);
  });
  revealDirectionTimer = setTimeout(() => mediaReveals.forEach(reveal => reveal.setDirection(undefined)), 1200);

  mediaWindow = createMediaWindow({
    reserveRatio: true,
    onInitialStateChange: state => { loadingState.value = state; },
    onStateChange: (element, state, info) => {
      frameStates.value[element.dataset.frameIndex] = { state, ...info };
      mediaReveals.get(element)?.setEnabled(!isLoading.value && info.ready);
    },
    onInitialReady: () => {
      if (isDisposed) return;
      isLoading.value = false;
      mediaReveals.forEach((reveal, element) => reveal.setEnabled(element.dataset.mediaReady === 'true'));
      emit('ready', entryIndex || 0);
    },
  });
  mediaWindow.setFrames(scrollerRef.value.children);
  mediaWindow.setSuspended(projectStore.isInfoOpen);
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
  mediaWindow?.destroy();
});
</script>

<template>
  <div class="project-gallery" :class="{ 'project-gallery_leaving': isLeaving }">
    <Transition name="preloader-fade">
      <Preloader v-if="isLoading" :state="loadingState" @retry="mediaWindow?.retry()" />
    </Transition>

    <div class="scroller-vertical" ref="scrollerRef">
      <div
        v-for="(src, ind) in imagesSrc"
        :key="ind"
        class="image-box media-reveal"
        :data-frame-index="ind"
      >
        <div class="image-wrapper media-reveal-content">
          <!-- Картинки -->
          <img
            class="media-reveal-subject"
            v-if="!isVideo(src) && !isVimeo(src)"
            :data-media-src="src"
            :style="{ aspectRatio: (mediaDimensions[src] || [16, 9]).join(' / ') }"
          />

          <!-- Видео -->
          <video
            class="media-reveal-subject"
            v-else-if="isVideo(src)"
            :style="{ aspectRatio: (mediaDimensions[src] || [16, 9]).join(' / ') }"
            :data-media-src="src"
            muted
            loop
            playsinline
          />

        <!-- Vimeo iframe с кнопкой поверх -->
        <div v-else-if="isVimeo(src)" class="iframe-wrapper media-reveal-subject">
          <iframe
            :id="`vimeo-${ind}`"
            :data-media-src="toVimeoEmbed(src)"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
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
        <MediaLoadingState v-if="!isLoading" :visible="!!frameStates[ind]?.active" :state="frameStates[ind]?.state || 'loading'"
          @retry="mediaWindow?.retry(scrollerRef.children[ind])" />
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
  position: relative;
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

.image-wrapper img {
  height: auto;
}

iframe::-webkit-media-controls {
  display: none !important;
}

</style>
