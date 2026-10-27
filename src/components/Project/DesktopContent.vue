<script setup>
import { computed, ref, shallowRef, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useProjectStore } from "@/stores/project";
import Preloader from "@/components/Preloader.vue";
import MediaLoadingState from '@/components/MediaLoadingState.vue';
import { getMotionDuration } from "@/utils/motion";
import { createMediaWindow } from '@/utils/mediaWindow';

const projectStore = useProjectStore();
const props = defineProps({
  imagesSrc: Array,
  projectKey: String,
  hasNextProject: Boolean,
  hasPreviousProject: Boolean,
  entryIndex: Number,
  entryDirection: Number,
  isLeaving: Boolean,
});
const emit = defineEmits(["navigateProject", "ready"]);

function makeFrame(index) {
  return { key: `${props.projectKey}:${index}`, projectKey: props.projectKey, index, src: props.imagesSrc[index] };
}

const activeIndex = ref(props.entryIndex || 0);
const currentFrame = shallowRef(makeFrame(activeIndex.value));
const previousFrame = shallowRef(null);
const pendingFrame = shallowRef(null);
const frameStates = ref({});
const loadingState = ref('loading');
const targetFrame = computed(() => pendingFrame.value || currentFrame.value);
const direction = ref(props.entryDirection || 1);
const frames = computed(() => {
  const result = props.imagesSrc.map((_src, index) => makeFrame(index));
  // Keep only the outgoing media node across a project boundary, not its gallery.
  if (previousFrame.value && previousFrame.value.projectKey !== props.projectKey) result.push(previousFrame.value);
  if (currentFrame.value.projectKey !== props.projectKey) result.push(currentFrame.value);
  return [...new Map(result.map(frame => [frame.key, frame])).values()];
});
const scrollerRef = ref(null);
let isThrottled = false;
let scrollUnlockTimer;
let revealFrame;
let isDisposed = false;
let mediaWindow;

const isMuted = ref(true);                 // состояние mute (true = выключено)
const currentIsIframeWithSound = computed(() => ["vimeo", "kinescope"].includes(getMediaType(currentFrame.value.src)));
const iframeRef = ref(null);               // текущий iframe
const iframeEls = new Map();

const shouldShowFirstImage = ref(false);
const isLoading = ref(true);

let touchStartY = 0;
let touchEndY = 0;

// ---------------------------
// Определение типа контента
// ---------------------------
function getMediaType(src) {
  if (!src) return "unknown";
  if (/\.(mp4|webm|ogg)$/i.test(src)) return "video";
  if (/vimeo\.com/i.test(src)) return "vimeo";
  if (/kinescope\.io/i.test(src)) return "kinescope";
  return "image";
}

// ---------------------------
// Преобразование ссылок в embed
// ---------------------------
function toEmbedUrl(src) {
  const type = getMediaType(src);
  if (!src) return src;

  switch (type) {
    case "vimeo": {
      const cleaned = src.replace(/&amp;/g, "&");
      const m = cleaned.match(/(?:player\.vimeo\.com\/(?:video\/)?|vimeo\.com\/(?:.*\/)?)(\d+)/i);
      if (!m) return src;
      const id = m[1];
      const params = new URLSearchParams();
      try {
        const url = new URL(cleaned);
        url.searchParams.forEach((value, key) => params.set(key, value));
      } catch {}
      params.set("autoplay", "1");
      params.set("muted", "1");
      params.set("loop", "1");
      params.set("background", "1");
      params.set("controls", "1");
      params.set("playsinline", "1");
      params.set("api", "1");
      return `https://player.vimeo.com/video/${id}?${params}`;
    }

    case "kinescope": {
      // Пример: https://kinescope.io/embed/<id>?autoplay=1&muted=1&loop=1
      const idMatch = src.match(/kinescope\.io\/(?:embed\/|)([\w-]+)/);
      const id = idMatch ? idMatch[1] : null;
      if (!id) return src;
      const params = new URLSearchParams({
        autoplay: "1",
        muted: "1",
        loop: "1",
        controls: "1",
      });
      return `https://kinescope.io/embed/${id}?${params}`;
    }

    default:
      return src;
  }
}

// ---------------------------
// Рефы для iframe
// ---------------------------
function setIframe(el, key) {
  if (el) iframeEls.set(key, el);
  else iframeEls.delete(key);
  if (key === currentFrame.value.key) {
    iframeRef.value = el || null;
  }
}

// ---------------------------
// Управление скроллом и свайпами
// ---------------------------
function canNavigate() {
  return !isDisposed && !isLoading.value && scrollerRef.value && !projectStore.isInfoOpen && !projectStore.isLeavingProject;
}

function resetScrollLock() {
  clearTimeout(scrollUnlockTimer);
  isThrottled = false;
  touchStartY = touchEndY = 0;
}

function lockTransition() {
  clearTimeout(scrollUnlockTimer);
  isThrottled = true;
  scrollUnlockTimer = setTimeout(() => {
    isThrottled = false;
    previousFrame.value = null;
  }, getMotionDuration('--motion-subject-duration', 1200));
}

function muteCurrentFrame() {
  const iframe = iframeEls.get(currentFrame.value.key);
  if (!iframe?.contentWindow) return;
  const type = getMediaType(currentFrame.value.src);
  iframe.contentWindow.postMessage(JSON.stringify(type === 'vimeo'
    ? { method: 'setVolume', value: 0 }
    : { method: 'setMuted', value: true }), type === 'vimeo' ? 'https://player.vimeo.com' : 'https://kinescope.io');
}

function changeSlide(dir) {
  if (!canNavigate() || isThrottled) return;
  if (pendingFrame.value) return;
  const nextIndex = activeIndex.value + dir;
  if ((nextIndex === props.imagesSrc.length && props.hasNextProject) ||
      (nextIndex < 0 && props.hasPreviousProject)) {
    lockTransition();
    emit("navigateProject", dir);
    return;
  }
  if (nextIndex < 0 || nextIndex >= props.imagesSrc.length) return;
  muteCurrentFrame();
  direction.value = dir;
  prepareFrame(makeFrame(nextIndex));
}

function commitPending() {
  if (!pendingFrame.value) return;
  previousFrame.value = currentFrame.value;
  currentFrame.value = pendingFrame.value;
  activeIndex.value = currentFrame.value.index;
  pendingFrame.value = null;
  projectStore.isPreparingMedia = false;
  emit('ready', activeIndex.value);
  lockTransition();
}

function prepareFrame(frame) {
  if (frame.key === currentFrame.value.key) {
    pendingFrame.value = null;
    projectStore.isPreparingMedia = false;
    emit('ready', currentFrame.value.index);
    return;
  }
  pendingFrame.value = frame;
  projectStore.isPreparingMedia = true;
  if (frameStates.value[frame.key]?.ready) commitPending();
}

function retryTarget() {
  const element = [...scrollerRef.value.children].find(element => element.dataset.mediaKey === targetFrame.value.key);
  if (element) mediaWindow?.retry(element);
}

function handleFrameExit(event, key) {
  if (event.animationName === 'media-frame-out' && previousFrame.value?.key === key) previousFrame.value = null;
}

function handleTouchStart(e) {
  if (!canNavigate()) return;
  touchStartY = touchEndY = e.touches[0].clientY;
}
function handleTouchMove(e) {
  if (canNavigate()) touchEndY = e.touches[0].clientY;
}
function handleTouchEnd() {
  const deltaY = touchStartY - touchEndY;
  if (Math.abs(deltaY) >= 20) changeSlide(deltaY > 0 ? 1 : -1);
}

function handleScroll(event) {
  if (!canNavigate() || event.ctrlKey) return;
  event.preventDefault();
  const deltaY = event.deltaY;
  if (Math.abs(deltaY) < 20) return;
  changeSlide(deltaY > 0 ? 1 : -1);
}

function preventGalleryGesture(event) {
  if (canNavigate()) event.preventDefault();
}

function preventGalleryTouchScroll(event) {
  if (canNavigate() && event.target instanceof Node && scrollerRef.value.contains(event.target)) {
    event.preventDefault();
  }
}

function addScrollListeners() {
  if (!scrollerRef.value) return;
  // One wheel listener also covers the header/footer after closing Info.
  window.addEventListener("wheel", handleScroll, { passive: false });
  window.addEventListener("gesturechange", preventGalleryGesture, { passive: false });
  window.addEventListener("touchmove", preventGalleryTouchScroll, { passive: false });
  scrollerRef.value.addEventListener("touchstart", handleTouchStart, { passive: true });
  scrollerRef.value.addEventListener("touchmove", handleTouchMove, { passive: true });
  scrollerRef.value.addEventListener("touchend", handleTouchEnd, { passive: true });
}

watch(() => projectStore.isInfoOpen, value => {
  resetScrollLock();
  mediaWindow?.setSuspended(value);
}, { flush: "sync" });

watch([frames, currentFrame, previousFrame, pendingFrame], () => {
  if (scrollerRef.value) mediaWindow?.setFrames(scrollerRef.value.children);
}, { flush: 'post' });

// ---------------------------
// Следим за изменением активного слайда
// ---------------------------
watch(() => props.projectKey, () => {
  muteCurrentFrame();
  direction.value = props.entryDirection || 1;
  resetScrollLock();
  prepareFrame(makeFrame(props.entryIndex || 0));
});

watch(currentFrame, frame => {
  isMuted.value = true;
  iframeRef.value = iframeEls.get(frame.key) || null;
});

// ---------------------------
// Mute/unmute (Vimeo + Kinescope)
// ---------------------------
function toggleSound() {
  const iframe = iframeRef.value;
  if (!iframe || !iframe.contentWindow) return;

  const type = getMediaType(currentFrame.value.src);
  const newMuted = !isMuted.value;

  if (type === "vimeo") {
    iframe.contentWindow.postMessage(
      JSON.stringify({ method: "setVolume", value: newMuted ? 0 : 1 }),
      "https://player.vimeo.com"
    );
  } else if (type === "kinescope") {
    // API Kinescope поддерживает postMessage setMuted
    iframe.contentWindow.postMessage(
      JSON.stringify({ method: "setMuted", value: newMuted }),
      "https://kinescope.io"
    );
  }

  isMuted.value = newMuted;
}

// ---------------------------
// Lifecycle
// ---------------------------
onMounted(async () => {
  document.body.style.overflow = "hidden";

  await nextTick();
  projectStore.setCurrentImage(activeIndex.value);

  mediaWindow = createMediaWindow({
    mode: 'slides',
    onInitialStateChange: state => loadingState.value = state,
    onStateChange: (element, state, info) => {
      const key = element.dataset.mediaKey;
      frameStates.value[key] = { state, ...info };
      if (pendingFrame.value?.key === key && info.ready) commitPending();
    },
    onInitialReady: () => {
      if (isDisposed) return;
      isLoading.value = false;
      revealFrame = requestAnimationFrame(() => {
        if (isDisposed) return;
        shouldShowFirstImage.value = true;
        emit('ready', currentFrame.value.index);
        addScrollListeners();
      });
    },
  });
  mediaWindow.setFrames(scrollerRef.value.children);
  mediaWindow.setSuspended(projectStore.isInfoOpen);
});

onBeforeUnmount(() => {
  isDisposed = true;
  projectStore.isPreparingMedia = false;
  mediaWindow?.destroy();
  resetScrollLock();
  cancelAnimationFrame(revealFrame);
  window.removeEventListener("wheel", handleScroll);
  window.removeEventListener("gesturechange", preventGalleryGesture);
  window.removeEventListener("touchmove", preventGalleryTouchScroll);
  document.body.style.overflow = "";
  if (scrollerRef.value) {
    scrollerRef.value.removeEventListener("touchstart", handleTouchStart);
    scrollerRef.value.removeEventListener("touchmove", handleTouchMove);
    scrollerRef.value.removeEventListener("touchend", handleTouchEnd);
  }
});
</script>

<template>
  <div class="project-gallery" :class="{ 'project-gallery_leaving': isLeaving }">
    <Transition name="preloader-fade">
      <Preloader v-if="isLoading" :state="loadingState" @retry="mediaWindow?.retry()" />
    </Transition>

    <div class="scroller-vertical" ref="scrollerRef">
      <div
        v-for="frame in frames"
        :key="frame.key"
        class="image-box media-reveal"
        :data-project-key="frame.projectKey"
        :data-frame-index="frame.index"
        :data-media-key="frame.key"
        :data-media-active="frame.key === targetFrame.key"
        :data-media-outgoing="frame.key === previousFrame?.key || (!!pendingFrame && frame.key === currentFrame.key)"
        :data-media-retain="frame.key === currentFrame.key || frame.key === previousFrame?.key || (frame.projectKey === props.projectKey && Math.abs(frame.index - targetFrame.index) <= 1)"
        :data-reveal-direction="direction === -1 ? 'up' : 'down'"
        @animationend="handleFrameExit($event, frame.key)"
        :class="{
          'in-view': frame.key === currentFrame.key && shouldShowFirstImage,
          'media-reveal_visible': frame.key === currentFrame.key && shouldShowFirstImage,
          'is-previous': frame.key === previousFrame?.key,
        }"
      >
        <div class="image-wrapper media-reveal-content">
          <div class="media media-reveal-subject">
            <img v-if="getMediaType(frame.src) === 'image'" :data-media-src="frame.src" />
            <video v-else-if="getMediaType(frame.src) === 'video'" :data-media-src="frame.src" muted loop playsinline />
            <div
              v-else-if="['vimeo', 'kinescope'].includes(getMediaType(frame.src))"
              class="iframe-wrapper"
            >
              <iframe
                :ref="el => setIframe(el, frame.key)"
                :data-media-src="toEmbedUrl(frame.src)"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
              />
              <div class="iframe-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <MediaLoadingState v-if="!isLoading" :visible="!projectStore.isInfoOpen && !isLeaving" :state="frameStates[targetFrame.key]?.state || 'loading'" @retry="retryTarget" />

    <!-- mute -->
    <button
      v-if="currentIsIframeWithSound"
      class="mute-btn"
      @click="toggleSound"
      :aria-pressed="!isMuted"
    >
      {{ isMuted ? "🔇" : "🔊" }}
    </button>
  </div>
</template>

<style scoped>
.mute-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 9999;
  background: rgba(0,0,0,0.6);
  border: none;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.mute-btn:hover {
  background: rgba(0,0,0,0.8);
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.iframe-wrapper iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}
.iframe-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: transparent;
  pointer-events: auto;
}
.media iframe {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.media {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.media img,
.media video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.scroller-vertical {
  position: relative;
  height: 100dvh;
  overflow: hidden;
  background: #f8f8f8;
  overscroll-behavior: contain;
}

.image-box {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  pointer-events: none;
}
.image-box.in-view {
  pointer-events: auto;
  z-index: 2;
}
.image-box.is-previous {
  z-index: 1;
}
.image-box.is-previous > .media-reveal-content {
  visibility: visible;
  animation: media-frame-out var(--motion-frame-duration) var(--motion-ease-reveal) both;
}
.image-box.is-previous > .media-reveal-content > .media-reveal-subject {
  animation: media-subject-out var(--motion-subject-duration) var(--motion-ease-reveal) both;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
}

.image-wrapper img,
.image-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (prefers-reduced-motion: reduce) {
  .image-box.is-previous > .media-reveal-content,
  .image-box.is-previous > .media-reveal-content > .media-reveal-subject {
    animation: none;
  }
}
</style>
