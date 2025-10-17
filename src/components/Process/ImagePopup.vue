<script setup>
import { computed, onUnmounted, watchEffect, ref, watch } from 'vue';
import AppearBlocks from '../Info/AppearBlocks.vue';
import { useDisableScroll } from '@/utils/useDisableScroll';

const props = defineProps({
  imageSrc: String,
  imageDescription: String,
  isOpen: Boolean
});

const emits = defineEmits(['closePopup']);

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
const isMuted = ref(true);

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

// === Клик по фону для закрытия ===
const onBackdropPointerDown = (e) => {
  if (e.target === e.currentTarget) emits('closePopup');
};

// Клик по медиаблоку (перехват iframe)
const onMediaBackdropPointerDown = (e) => {
  e.stopPropagation();
  emits('closePopup');
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
watch(() => props.isOpen, (newVal) => {
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

useDisableScroll(isPopupOpen);

onUnmounted(() => {
  window.removeEventListener('keydown', keydownHandler);
  document.body.style.overflow = '';
});
</script>

<template>
  <!-- pointerdown на бэкдроп — закроет при клике по фону -->
  <div
    class="image-popup"
    :class="{ 'image-popup_open': isOpen }"
    @pointerdown="onBackdropPointerDown"
  >
    <div class="image-popup-inner">
      <div class="image-container">
        <!-- Перехватчик кликов по медиа -->
        <div class="media-backdrop" @pointerdown="onMediaBackdropPointerDown" />

        <!-- Изображение -->
        <img
          v-if="!isVideo && !isVimeo && !isKinescope"
          class="image"
          :src="imageSrc"
          alt=""
        />

        <!-- Видео-файл -->
        <video
          v-else-if="isVideo"
          class="image"
          :src="imageSrc"
          autoplay
          muted
          loop
          playsinline
        />

        <!-- Vimeo / Kinescope -->
        <div v-else-if="isVimeo || isKinescope" class="iframe-wrapper">
          <iframe
            ref="iframeRef"
            class="iframe"
            :src="toEmbed(imageSrc)"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
          />
          <button class="sound-btn" @click.stop="toggleSound">
            {{ isMuted ? '🔇' : '🔊' }}
          </button>
        </div>
      </div>

      <p class="description">
        <AppearBlocks
          @setDelay="() => {}"
          :initialDelay="100"
          :isAppearReady="isOpen"
        />
        {{ imageDescription }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.iframe-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 3;
}

.iframe-wrapper .iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: block;
  position: relative;
  z-index: 1;
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
  opacity: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: var(--bg-clr-white);
  --popup-x-padding: 60px;
  padding: var(--header-height) var(--popup-x-padding) 0;
  transition: opacity 300ms var(--timing-func-2);
}

.image-popup_open {
  opacity: 1;
  pointer-events: initial;
}

.image-popup-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.image-container {
  position: relative;
  flex: 1 1 auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  transition: clip-path 400ms ease;
}

.image-popup_open .image-container {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.media-backdrop {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: transparent;
}

.image {
  width: 100%;
  aspect-ratio: 16 / 9;
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
    padding: 120px var(--popup-x-padding) 0;
  }
  .description {
    flex: 0 0 130px;
    padding-top: 55px;
    margin-left: calc(-1 * var(--popup-x-padding) + var(--column-width));
    width: calc(var(--column-width) * 10);
  }
}

@media (max-width: 820px) {
  .image-popup {
    padding: 86px var(--popup-x-padding) 0;
  }
  .description {
    flex: 0 0 86px;
    padding: 35px 0 0;
    margin-left: calc(-1 * var(--popup-x-padding) + var(--column-width));
    width: calc(var(--column-width) * 10);
  }
}

@media (max-width: 768px) {
  .image-popup {
    padding: 170px 33px 0;
  }
  .description {
    flex: 0 0 130px;
    padding-top: 50px;
    padding-left: 33px;
    margin-left: calc(-1 * var(--popup-x-padding) + var(--column-width));
    width: calc(var(--column-width) * 10);
  }
}

@media (max-width: 500px) {
  .description {
    padding-top: 45px;
  }
}
</style>
