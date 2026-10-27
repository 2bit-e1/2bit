<script setup>
import { computed, nextTick, onUnmounted, watchEffect, ref, watch } from 'vue';
import RevealText from '../Appear/RevealText.vue';
import { useDisableScroll } from '@/utils/useDisableScroll';
import { getMotionDuration } from '@/utils/motion';

const props = defineProps({
  imageSrc: String,
  imageDescription: String,
  imageOrientation: String,
  isOpen: Boolean,
  hasPrevious: Boolean,
  hasNext: Boolean,
});

const emits = defineEmits(['closePopup', 'navigate']);

const isPopupOpen = computed(() => props.isOpen);

// === Определение типа медиа ===
const isVideo = computed(() => /\.(mp4|webm|ogg)$/i.test(props.imageSrc));
const isVimeo = computed(() => /vimeo\.com/i.test(props.imageSrc));
const isKinescope = computed(() => /kinescope\.io/i.test(props.imageSrc));

/**
 * Универсальный embed-конструктор для Vimeo и Kinescope
 */
function toEmbed(src) {
  if (!src) return src;
  const cleaned = String(src).split(/[?#]/)[0];

  // Vimeo
  const vimeoMatch = cleaned.match(/(?:player\.vimeo\.com\/video\/|vimeo\.com\/(?:.*\/)?)(\d+)/i);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    const params = new URLSearchParams({
      autoplay: '1',
      muted: '1',
      loop: '1',
      background: '1',
      controls: '1'
    });
    return `https://player.vimeo.com/video/${id}?${params.toString()}`;
  }

  // Kinescope
  const kineMatch = cleaned.match(/(?:kinescope\.io\/)(?:embed\/)?([a-zA-Z0-9_-]+)/i);
  if (kineMatch) {
    const id = kineMatch[1];
    const params = new URLSearchParams({
      autoplay: '1',
      muted: '1',
      loop: '1',
      controls: '1'
    });
    return `https://kinescope.io/embed/${id}?${params.toString()}`;
  }

  return src;
}

// === Управление звуком ===
const iframeRef = ref(null);
const popupRef = ref(null);
const isMuted = ref(true);
const popupTop = ref('0px');
const navigationDirection = ref('down');
let navigationLocked = false;
let unlockTimer;
let gesture = null;

function resetNavigation() {
  clearTimeout(unlockTimer);
  navigationLocked = false;
  gesture = null;
}

function navigate(direction) {
  if (!props.isOpen || navigationLocked || (direction > 0 ? !props.hasNext : !props.hasPrevious)) return;
  navigationLocked = true;
  navigationDirection.value = direction > 0 ? 'down' : 'up';
  muteCurrentMedia();
  emits('navigate', direction);
  unlockTimer = setTimeout(() => navigationLocked = false, getMotionDuration('--motion-subject-duration', 1200));
}

function muteCurrentMedia() {
  const win = iframeRef.value?.contentWindow;
  if (isVimeo.value) win?.postMessage(JSON.stringify({ method: 'setVolume', value: 0 }), '*');
  else if (isKinescope.value) win?.postMessage(JSON.stringify({ event: 'setVolume', data: 0 }), '*');
  isMuted.value = true;
}

function handleWheel(event) {
  if (!props.isOpen || event.ctrlKey) return;
  event.preventDefault();
  event.stopPropagation();
  if (Math.abs(event.deltaY) >= 20) navigate(event.deltaY > 0 ? 1 : -1);
}

function handlePointerDown(event) {
  if (!props.isOpen || event.target.closest('.sound-btn')) return;
  gesture = {
    id: event.pointerId, x: event.clientX, y: event.clientY,
    touch: event.pointerType === 'touch' || event.pointerType === 'pen',
    backdrop: event.target === popupRef.value || event.target.classList.contains('media-backdrop'),
  };
  if (gesture.touch) popupRef.value.setPointerCapture(event.pointerId);
}

function handlePointerUp(event) {
  const start = gesture;
  gesture = null;
  if (!start || start.id !== event.pointerId) return;
  const deltaY = start.y - event.clientY;
  const deltaX = start.x - event.clientX;
  if (start.touch && Math.abs(deltaY) >= 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
    navigate(deltaY > 0 ? 1 : -1);
  } else if (start.backdrop && Math.hypot(deltaX, deltaY) < 10) {
    emits('closePopup');
  }
}

function toggleSound() {
  if (!iframeRef.value) return;
  const win = iframeRef.value.contentWindow;
  if (!win) return;

  if (isVimeo.value) {
    win.postMessage(JSON.stringify({ method: 'setVolume', value: isMuted.value ? 1 : 0 }), '*');
  } else if (isKinescope.value) {
    win.postMessage(JSON.stringify({ event: 'setVolume', data: isMuted.value ? 1 : 0 }), '*');
  }

  isMuted.value = !isMuted.value;
}

// === Клавиша Escape для закрытия ===
const keydownHandler = (event) => {
  if (event.key === 'Escape') emits('closePopup');
};

// === Watch ===
watchEffect(() => {
  if (props.isOpen) {
    window.addEventListener('keydown', keydownHandler);
  } else {
    window.removeEventListener('keydown', keydownHandler);
  }
});

// === При закрытии сбрасываем звук ===
watch(() => props.isOpen, async (newVal) => {
  resetNavigation();
  navigationDirection.value = 'down';
  popupTop.value = '0px';

  if (newVal) {
    await nextTick();
    const offsetTop = popupRef.value?.getBoundingClientRect().y || 0;
    popupTop.value = offsetTop ? `${-offsetTop}px` : '0px';
  }

  if (!newVal && iframeRef.value) {
    const win = iframeRef.value.contentWindow;
    if (isVimeo.value) {
      win?.postMessage(JSON.stringify({ method: 'setVolume', value: 0 }), '*');
    } else if (isKinescope.value) {
      win?.postMessage(JSON.stringify({ event: 'setVolume', data: 0 }), '*');
    }
    isMuted.value = true;
  }
});

watch(() => props.imageSrc, () => { isMuted.value = true; });

useDisableScroll(isPopupOpen);

onUnmounted(() => {
  resetNavigation();
  window.removeEventListener('keydown', keydownHandler);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <div
      ref="popupRef"
      class="image-popup"
      :class="{ 'image-popup_open': isOpen }"
      :data-navigation-direction="navigationDirection"
      :style="{ top: popupTop, '--text-reveal-offset': navigationDirection === 'up' ? '-105%' : '105%' }"
      @wheel="handleWheel"
      @pointerdown="handlePointerDown"
      @pointerup="handlePointerUp"
      @pointercancel="gesture = null"
    >
      <div class="popup-stage">
      <Transition name="process-frame" :duration="getMotionDuration('--motion-subject-duration', 1200)" @before-leave="el => el.setAttribute('aria-hidden', 'true')">
      <div :key="imageSrc" class="image-popup-inner media-reveal"
        :class="{ 'media-reveal_visible': isOpen }" :data-reveal-direction="navigationDirection">
        <div class="image-container media-reveal-content">
          <!-- Перехватчик кликов по медиа -->
          <div class="media-backdrop" />

          <!-- Изображение -->
          <img
            v-if="!isVideo && !isVimeo && !isKinescope"
            class="image media-reveal-subject"
            :src="imageSrc"
            alt=""
          />

          <!-- Видео-файл -->
          <video
            v-else-if="isVideo"
            class="image media-reveal-subject"
            :src="imageSrc"
            autoplay
            muted
            loop
            playsinline
          />

          <!-- Vimeo / Kinescope -->
          <div
            v-else-if="isVimeo || isKinescope"
            class="iframe-wrapper media-reveal-subject"
            :class="{ 'iframe-wrapper_portrait': imageOrientation === 'portrait' }"
          >
            <iframe
              ref="iframeRef"
              class="iframe"
              :src="toEmbed(imageSrc)"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            />
            <div class="iframe-gesture-surface" aria-hidden="true" />
            <button class="sound-btn" :aria-label="isMuted ? 'Включить звук' : 'Выключить звук'" :aria-pressed="!isMuted" @click.stop="toggleSound">
              {{ isMuted ? '🔇' : '🔊' }}
            </button>
          </div>
        </div>

        <p class="description">
          <RevealText
            :text="imageDescription || ''"
            :delay="100"
            :isAppear="isOpen"
          />
        </p>
      </div>
      </Transition>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  container-type: size;
  z-index: 3;
}

.iframe-wrapper .iframe {
  width: min(100cqw, calc(100cqh * 16 / 9));
  height: min(100cqh, calc(100cqw * 9 / 16));
  aspect-ratio: 16 / 9;
  display: block;
  position: relative;
  z-index: 1;
}

.iframe-wrapper_portrait .iframe {
  width: min(100cqw, calc(100cqh * 9 / 16));
  height: min(100cqh, calc(100cqw * 16 / 9));
  aspect-ratio: 9 / 16;
}

/* кнопка поверх */
.sound-btn {
  position: absolute;
  bottom: 0;
  right: 10px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.image-popup {
  touch-action: none;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: var(--bg-clr-white);
  z-index: var(--media-popup-z-index);
  --popup-x-padding: 60px;
  padding: var(--header-height) var(--popup-x-padding) 0;
  transition: opacity var(--motion-exit-duration) ease-out;
}

.image-popup_open {
  opacity: 1;
  pointer-events: initial;
}

.image-popup-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.popup-stage {
  position: relative;
  height: 100%;
}

.image-popup .process-frame-leave-active {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  --media-exit-inset: inset(0 0 100% 0);
  --media-exit-offset: -12%;
  --caption-exit-offset: -105%;
}

.image-popup[data-navigation-direction="up"] .process-frame-leave-active {
  --media-exit-inset: inset(100% 0 0 0);
  --media-exit-offset: 12%;
  --caption-exit-offset: 105%;
}

.process-frame-leave-active > .image-container {
  animation: media-frame-out var(--motion-frame-duration) var(--motion-ease-reveal) both;
}

.process-frame-leave-active > .image-container > .media-reveal-subject {
  animation: media-subject-out var(--motion-subject-duration) var(--motion-ease-reveal) both;
}

.process-frame-leave-active .description:deep(.reveal-text-word) {
  animation: media-caption-out var(--motion-scene-text-exit-duration) var(--motion-ease-reveal) both;
}

@media (prefers-reduced-motion: reduce) {
  .process-frame-leave-active > .image-container,
  .process-frame-leave-active > .image-container > .media-reveal-subject,
  .process-frame-leave-active .description:deep(.reveal-text-word) {
    animation: none;
  }
}

.image-container {
  background-color: var(--bg-clr-white);
  position: relative;
  flex: 1 1 auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.media-backdrop {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: transparent;
}

/* Capture gallery gestures over cross-origin players; keep sound above it. */
.iframe-gesture-surface {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.image {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  position: relative;
  z-index: 1;
}

.description {
  display: block;
  position: relative;
  flex: 0 0 65px;
  padding: 25px 0 5px;
  margin-left: calc(-1 * var(--popup-x-padding) + var(--page-padding-x) + var(--column-width));
  width: calc(var(--column-width) * 3);
  color: var(--clr-black);
  text-indent: var(--text-indent);
}

@media (max-width: 1024px) {
  .image-popup {
    --popup-mobile-side-padding: 33px;
    --popup-mobile-top-offset: 102px;
    --popup-mobile-description-height: 86px;
    padding: var(--popup-mobile-top-offset) 0 0;
  }

  .image-popup-inner {
    height: calc(100dvh - var(--popup-mobile-top-offset));
    justify-content: flex-start;
  }

  .image-container {
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
  }

  .image {
    width: auto;
    height: auto;
    max-width: calc(100% - var(--popup-mobile-side-padding) * 2);
    max-height: 100%;
  }

  .iframe-wrapper {
    width: calc(100% - var(--popup-mobile-side-padding) * 2);
    height: 100%;
    aspect-ratio: auto;
  }

  .iframe-wrapper .iframe {
    width: min(100cqw, calc(100cqh * 16 / 9));
    height: min(100cqh, calc(100cqw * 9 / 16));
  }

  .iframe-wrapper_portrait .iframe {
    width: min(100cqw, calc(100cqh * 9 / 16));
    height: min(100cqh, calc(100cqw * 16 / 9));
  }

  .description {
    flex: 0 0 var(--popup-mobile-description-height);
    padding: 35px 0 0;
    margin-left: var(--popup-mobile-side-padding);
    width: calc(100% - var(--popup-mobile-side-padding) * 2);
  }
}

@media (max-width: 820px) {
  .image-popup {
    padding: var(--popup-mobile-top-offset) 0 0;
  }
  .description {
    flex-basis: var(--popup-mobile-description-height);
    margin-left: var(--popup-mobile-side-padding);
    width: calc(100% - var(--popup-mobile-side-padding) * 2);
  }
}

@media (max-width: 768px) {
  .image-popup {
    padding: var(--popup-mobile-top-offset) 0 0;
  }
  .description {
    flex-basis: var(--popup-mobile-description-height);
    padding: 35px 0 0;
    margin-left: var(--popup-mobile-side-padding);
    width: calc(100% - var(--popup-mobile-side-padding) * 2);
  }
}

@media (max-width: 500px) {
  .description {
    padding-top: 35px;
  }
}
</style>
