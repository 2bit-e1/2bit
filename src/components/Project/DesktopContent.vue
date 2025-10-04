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

const isMuted = ref(true);                 // состояние mute (true = сейчас выключено)
const currentIsVimeo = ref(false);         // показывать ли кнопку mute
const iframeRef = ref(null);               // текущий активный iframe (DOM element)
const iframeEls = [];                      // хранит все DOM iframe по индексу

const shouldShowFirstImage = ref(false);
const isLoading = ref(true);
const showPreloader = ref(false);

let touchStartY = 0;
let touchEndY = 0;

function isVimeo(src) {
  return /vimeo\.com/i.test(src);
}

function isVideo(src) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

// Преобразуем любую vimeo-ссылку в корректный embed URL (player.vimeo.com)
function toVimeoEmbedUrl(src) {
  if (!src) return src;
  const cleaned = String(src).split(/[?#]/)[0];
  const m = cleaned.match(/(?:player\.vimeo\.com\/video\/|vimeo\.com\/(?:.*\/)?)(\d+)/i);
  if (!m) return src;
  const id = m[1];
  const params = new URLSearchParams({
    autoplay: "1",
    muted: "1",      // начально muted, т.к. иначе autoplay часто блокируется
    loop: "1",
    background: "1",
    controls: "1",
    api: "1",
    player_id: "vimeo_player"
  });
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}

// --- управление рефами iframe в v-for ---
// В шаблоне используем :ref="el => setIframe(el, ind)"
function setIframe(el, idx) {
  // el может быть null при удалении — сохраняем/удаляем
  iframeEls[idx] = el || null;
  // если это активный индекс — обновляем iframeRef
  if (idx === activeIndex.value) {
    iframeRef.value = el || null;
  }
}

// Скролл/тач
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

// Когда меняется активный слайд — обновляем iframeRef и currentIsVimeo
watch(activeIndex, (newIndex) => {
  currentIsVimeo.value = isVimeo(imagesSrc[newIndex]);
  // Обновляем iframeRef на элемент с тем же индексом, если он есть
  iframeRef.value = iframeEls[newIndex] || null;
});

// toggle sound для Vimeo (через postMessage)
// целевой origin указываем правильно для безопасности
function toggleSound() {
  const iframe = iframeRef.value;
  if (!iframe || !iframe.contentWindow) return;

  const newVolume = isMuted.value ? 1 : 0;

  try {
    // Vimeo ожидает сообщения в формате { method: "setVolume", value: 1 }
    iframe.contentWindow.postMessage(
      JSON.stringify({ method: "setVolume", value: newVolume }),
      "https://player.vimeo.com"
    );
    isMuted.value = !isMuted.value;
  } catch (e) {
    // fallback на '*'
    iframe.contentWindow.postMessage(
      JSON.stringify({ method: "setVolume", value: newVolume }),
      "*"
    );
    isMuted.value = !isMuted.value;
  }
}

// Прелоад
function preloadAllMedia(srcArray) {
  return Promise.all(
    srcArray.map((src) => {
      return new Promise((resolve) => {
        if (isVideo(src)) {
          const video = document.createElement("video");
          video.src = src;
          video.onloadeddata = resolve;
          video.onerror = resolve;
        } else if (!isVimeo(src)) {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        } else resolve();
      });
    })
  );
}

onMounted(async () => {
  showPreloader.value = true;
  document.body.style.overflow = "hidden";

  await nextTick();
  projectStore.setCurrentImage(0);

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
            <img v-if="!isVideo(src) && !isVimeo(src)" :src="src" />
            <video v-else-if="isVideo(src)" :src="src" autoplay muted loop playsinline />
            <iframe
              v-else-if="isVimeo(src)"
              :ref="el => setIframe(el, ind)"
              :src="toVimeoEmbedUrl(src)"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            />
          </div>
          <div class="mask" />
        </div>
      </div>
    </div>

    <!-- Кнопка mute — отображаем только если активный слайд Vimeo -->
    <button
      v-if="currentIsVimeo"
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
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mute-btn:hover {
  background: rgba(0,0,0,0.8);
}

/* оставляем все стили как у тебя, iframe тоже растягивается по media */
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
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.scroller-vertical {
  position: relative;
  height: 100dvh;
  overflow: hidden;
  background: #f8f8f8;
}

.image-box {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.8s ease, translate 0.8s ease;
  will-change: transform, opacity, translate;
  pointer-events: none;
  z-index: 1;
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

.image-box.above {
  translate: 0 -100%;
}

.image-box.below {
  translate: 0 100%;
}

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
  will-change: transform;
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
  will-change: transform;
}

.image-box.in-view .mask {
  transform: translateY(-100%);
}

@media (max-width: 1368px) {
  .image-wrapper {
    width: 90vw;
  }
}

@media (max-width: 1366px) and (max-height: 950px) {

}
</style>
