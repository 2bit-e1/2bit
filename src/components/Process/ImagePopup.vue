<script setup>
import { computed, onUnmounted, watchEffect } from 'vue';
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

function toVimeoEmbed(src) {
  if (!src) return src;
  // убираем query/hash, если они есть
  const cleaned = String(src).split(/[?#]/)[0];

  // ловим id в формах:
  // player.vimeo.com/video/ID
  // vimeo.com/ID
  // vimeo.com/channels/.../ID
  const m = cleaned.match(/(?:player\.vimeo\.com\/video\/|vimeo\.com\/(?:.*\/)?)(\d+)/i);
  if (!m) return src; // fallback — возвращаем как есть

  const id = m[1];
  // нужные параметры (autoplay только будет работать если muted=1)
  const params = new URLSearchParams({
    autoplay: "1",
    muted: "1",
    loop: "1",
    background: "1",
    controls: "1"
  });
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}

// === Клавиши для закрытия (Escape) ===
const keydownHandler = (event) => {
  if (event.key === 'Escape') emits('closePopup');
};

// === Обработчики кликов/пойнтеров ===
// Клик по бэкдропу (вне .image-popup-inner)
const onBackdropPointerDown = (e) => {
  // срабатывает только если клик был по самому бэкдропу (не по внутренним элементам)
  if (e.target === e.currentTarget) emits('closePopup');
};

// "Невидимый" перехватчик над медиа (чтобы поймать клики по iframe)
const onMediaBackdropPointerDown = (e) => {
  // останавливаем всплытие чтобы не доходило до onBackdropPointerDown дважды
  e.stopPropagation();
  emits('closePopup');
};

watchEffect(() => {
  if (props.isOpen) {
    window.addEventListener('keydown', keydownHandler);
  } else {
    window.removeEventListener('keydown', keydownHandler);
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
        <!-- Невидимый перехватчик над медиа: ловит и закрывает клики по image/video/iframe -->
        <div class="media-backdrop" @pointerdown="onMediaBackdropPointerDown" />

        <!-- Изображение -->
        <img v-if="!isVideo && !isVimeo" class="image" :src="imageSrc" alt="" />

        <!-- Видео -->
        <video
          v-else-if="isVideo"
          class="image"
          :src="imageSrc"
          autoplay
          muted
          loop
          playsinline
        />

        <!-- Vimeo iframe -->
        <iframe
          v-else-if="isVimeo"
          class="iframe"
          :src="toVimeoEmbed(imageSrc)"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
        />

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

/* Добавил только position:relative чтобы media-backdrop корректно располагался поверх медиа */
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

/* Невидимый перехватчик кликов — визуально не меняет дизайн */
.media-backdrop {
  position: absolute;
  inset: 0;
  z-index: 2;
  /* прозрачный, но принимает события */
  background: transparent;
}

/* Задал z-index чтобы медиа было под перехватчиком */
.image,
.iframe {
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

/* Медиазапросы оставляем как было */
@media (max-width: 1024px) {
  .image-popup { padding: 120px var(--popup-x-padding) 0; }
  .description { flex: 0 0 130px; padding-top: 55px; margin-left: calc(-1 * var(--popup-x-padding) + var(--column-width)); width: calc(var(--column-width) * 10); }
}
@media (max-width: 820px) {
  .image-popup { padding: 86px var(--popup-x-padding) 0; }
  .description { flex: 0 0 86px; padding: 35px 0 0; margin-left: calc(-1 * var(--popup-x-padding) + var(--column-width)); width: calc(var(--column-width) * 10); }
}
@media (max-width: 768px) {
  .image-popup-inner { width: 324px; }
  .image-popup { padding: 170px 33px 0; }
  .description { flex: 0 0 130px; padding-top: 50px; padding-left: 33px; margin-left: calc(-1 * var(--popup-x-padding) + var(--column-width)); width: calc(var(--column-width) * 10); }
}
@media (max-width: 500px) {
  .description { padding-top: 45px; }
}
</style>
