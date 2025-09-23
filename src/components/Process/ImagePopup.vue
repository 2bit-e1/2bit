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
    background: "1"
  });
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}

// === Клавиши и клик по фону для закрытия ===
const keydownHandler = (event) => {
  if (event.key === 'Escape') emits('closePopup');
};
const clickHandler = (event) => {
  if (!event.target.closest('.description')) emits('closePopup');
};

watchEffect(() => {
  if (props.isOpen) {
    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('click', clickHandler);
  } else {
    window.removeEventListener('keydown', keydownHandler);
    window.removeEventListener('click', clickHandler);
  }
});

useDisableScroll(isPopupOpen);

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <div class="image-popup" :class="{ 'image-popup_open': isOpen }">
    <div class="image-popup-inner">
      <div class="image-container">
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

.image-container {
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

.image,
.iframe {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
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
  .image-popup { padding: 170px var(--popup-x-padding) 0; }
  .description { flex: 0 0 130px; padding-top: 50px; margin-left: calc(-1 * var(--popup-x-padding) + var(--column-width)); width: calc(var(--column-width) * 10); }
}
@media (max-width: 500px) {
  .description { padding-top: 45px; }
}


</style>
