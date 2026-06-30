<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useProjectStore } from "@/stores/project";
import Preloader from "@/components/Preloader.vue";

const projectStore = useProjectStore();
const { imagesSrc } = defineProps({ imagesSrc: Array });

const activeIndex = ref(0);
const direction = ref(0);
const scrollerRef = ref(null);
let isThrottled = false;

const isMuted = ref(true);                 // состояние mute (true = выключено)
const currentIsIframeWithSound = ref(false); // показывать ли кнопку mute
const iframeRef = ref(null);               // текущий iframe
const iframeEls = [];                      // все iframe DOM-элементы

const shouldShowFirstImage = ref(false);
const isLoading = ref(true);
const showPreloader = ref(false);

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
      const m = src.match(/(?:vimeo\.com\/(?:.*\/)?)(\d+)/);
      if (!m) return src;
      const id = m[1];
      const params = new URLSearchParams({
        autoplay: "1",
        muted: "1",
        loop: "1",
        background: "1",
        controls: "1",
        api: "1",
      });
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
function setIframe(el, idx) {
  iframeEls[idx] = el || null;
  if (idx === activeIndex.value) {
    iframeRef.value = el || null;
  }
}

// ---------------------------
// Управление скроллом и свайпами
// ---------------------------
function handleTouchStart(e) { touchStartY = e.touches[0].clientY; }
function handleTouchMove(e) { touchEndY = e.touches[0].clientY; }
function handleTouchEnd() {
  const deltaY = touchStartY - touchEndY;
  if (Math.abs(deltaY) < 20) return;
  const dir = deltaY > 0 ? 1 : -1;
  const nextIndex = activeIndex.value + dir;
  if (nextIndex < 0 || nextIndex >= imagesSrc.length) return;
  direction.value = dir;
  activeIndex.value = nextIndex;
  projectStore.setCurrentImage(nextIndex);
  isThrottled = true;
  setTimeout(() => isThrottled = false, 1000);
}

function handleScroll(event) {
  event.preventDefault();
  if (isThrottled) return;
  const deltaY = event.deltaY;
  if (Math.abs(deltaY) < 20) return;
  const dir = deltaY > 0 ? 1 : -1;
  const nextIndex = activeIndex.value + dir;
  if (nextIndex < 0 || nextIndex >= imagesSrc.length) return;
  direction.value = dir;
  activeIndex.value = nextIndex;
  projectStore.setCurrentImage(nextIndex);
  isThrottled = true;
  setTimeout(() => isThrottled = false, 1000);
}

function addScrollListeners() {
  if (!scrollerRef.value) return;
  scrollerRef.value.addEventListener("wheel", handleScroll, { passive: false });
  scrollerRef.value.addEventListener("touchstart", handleTouchStart, { passive: true });
  scrollerRef.value.addEventListener("touchmove", handleTouchMove, { passive: true });
  scrollerRef.value.addEventListener("touchend", handleTouchEnd, { passive: true });
}

// ---------------------------
// Следим за изменением активного слайда
// ---------------------------
watch(
  activeIndex,
  (newIndex) => {
    const type = getMediaType(imagesSrc[newIndex]);
    currentIsIframeWithSound.value = ["vimeo", "kinescope"].includes(type);
    iframeRef.value = iframeEls[newIndex] || null;
  },
  { immediate: true }
);

// ---------------------------
// Mute/unmute (Vimeo + Kinescope)
// ---------------------------
function toggleSound() {
  const iframe = iframeRef.value;
  if (!iframe || !iframe.contentWindow) return;

  const type = getMediaType(imagesSrc[activeIndex.value]);
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
// Прелоадер
// ---------------------------
function preloadAllMedia(srcArray) {
  return Promise.all(
    srcArray.map((src) => {
      return new Promise((resolve) => {
        const type = getMediaType(src);
        if (type === "video") {
          const video = document.createElement("video");
          video.src = src;
          video.onloadeddata = resolve;
          video.onerror = resolve;
        } else if (type === "image") {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        } else resolve();
      });
    })
  );
}

// ---------------------------
// Lifecycle
// ---------------------------
onMounted(async () => {
  showPreloader.value = true;
  document.body.style.overflow = "hidden";

  await nextTick();
  projectStore.setCurrentImage(0);

  const type = getMediaType(imagesSrc[0]);
  currentIsIframeWithSound.value = ["vimeo", "kinescope"].includes(type);
  iframeRef.value = iframeEls[0] || null;

  const delay = setTimeout(() => {
    showPreloader.value = true;
  }, 300);

  await preloadAllMedia(imagesSrc);
  clearTimeout(delay);

  isLoading.value = false;
  direction.value = 1;

  await nextTick();
  requestAnimationFrame(() => {
    shouldShowFirstImage.value = true;
    addScrollListeners();
  });

  // Safari / Magic Mouse фиксы
  const globalWheelHandler = (e) => {
    if (!scrollerRef.value) return;
    const elUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    if (scrollerRef.value.contains(elUnderCursor)) {
      e.preventDefault();
      handleScroll(e);
    }
  };

  window.addEventListener("wheel", globalWheelHandler, { passive: false });
  window.addEventListener("mousewheel", globalWheelHandler, { passive: false });
  window.addEventListener("DOMMouseScroll", globalWheelHandler, { passive: false });
  window.addEventListener("gesturechange", (e) => e.preventDefault(), { passive: false });
  window.addEventListener("touchmove", (e) => {
    if (
      scrollerRef.value &&
      scrollerRef.value.contains(document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY))
    ) {
      e.preventDefault();
    }
  }, { passive: false });
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  if (scrollerRef.value) {
    scrollerRef.value.removeEventListener("wheel", handleScroll);
    scrollerRef.value.removeEventListener("touchstart", handleTouchStart);
    scrollerRef.value.removeEventListener("touchmove", handleTouchMove);
    scrollerRef.value.removeEventListener("touchend", handleTouchEnd);
  }
});
</script>

<template>
  <div>
    <Preloader v-if="isLoading && showPreloader" />

    <div v-else class="scroller-vertical" ref="scrollerRef">
      <div
        v-for="(src, ind) in imagesSrc"
        :key="ind"
        class="image-box"
        :class="{
          'in-view': (ind === activeIndex) && (ind !== 0 || shouldShowFirstImage),
          'above': ind < activeIndex,
          'below': ind > activeIndex,
          'from-top': direction === -1 && ind === activeIndex,
          'from-bottom': direction === 1 && ind === activeIndex,
        }"
      >
        <div class="image-wrapper">
          <div class="media">
            <img v-if="getMediaType(src) === 'image'" :src="src" />
            <video v-else-if="getMediaType(src) === 'video'" :src="src" autoplay muted loop playsinline />
            <div
              v-else-if="['vimeo', 'kinescope'].includes(getMediaType(src))"
              class="iframe-wrapper"
            >
              <iframe
                :ref="el => setIframe(el, ind)"
                :src="toEmbedUrl(src)"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
              />
              <div class="iframe-overlay"></div>
            </div>
          </div>
          <div class="mask" />
        </div>
      </div>
    </div>

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
  opacity: 0;
  transition: opacity 0.8s ease, translate 0.8s ease;
  pointer-events: none;
}
.image-box.in-view {
  opacity: 1;
  pointer-events: auto;
  z-index: 2;
}
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
.image-box.above { translate: 0 -100%; }
.image-box.below { translate: 0 100%; }

.image-wrapper {
  position: relative;
  width: 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  padding: 60px;
}

.image-wrapper img,
.image-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: scale(1.2);
  transition: transform 1s ease;
}
.image-box.in-view img,
.image-box.in-view video {
  transform: scale(1);
}

.mask {
  position: absolute;
  inset: 0;
  background: #f8f8f8;
  z-index: 2;
  transform: translateY(0%);
  transition: transform 1s ease;
}
.image-box.in-view .mask {
  transform: translateY(-100%);
}
</style>
