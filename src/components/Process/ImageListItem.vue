<script setup>
import { useIntersectionObserver } from "@/utils/useIntersectionObserver";
import { computed, ref } from "vue";

const props = defineProps({
  ind: Number,
  src: String,
  alt: String,
  isHide: Boolean,
  orientation: String,
});

const elemRef = ref(null);
const isIntersected = ref(false);
const columns = window.innerWidth <= 600 ? 2 : window.innerWidth <= 1024 ? 3 : 4;
const appearDelay = `${(props.ind % columns) * 45}ms`;

const handleIntersect = (entries) => {
  if (entries[0].isIntersecting) isIntersected.value = true;
};

useIntersectionObserver(elemRef, handleIntersect);

// === Определение типа медиа ===
const isVideo = computed(() => /\.(mp4|webm|ogg)$/i.test(props.src));
const isVimeo = computed(() => /vimeo\.com/i.test(props.src));
const isKinescope = computed(() => /kinescope\.io/i.test(props.src));

/**
 * Преобразует ссылку Vimeo в embed-формат
 */
function toVimeoEmbed(src) {
  if (!src) return src;
  const cleaned = String(src).split(/[?#]/)[0];
  const m = cleaned.match(/(?:player\.vimeo\.com\/video\/|vimeo\.com\/(?:.*\/)?)(\d+)/i);
  if (!m) return src;

  const id = m[1];
  const params = new URLSearchParams({
    autoplay: "1",
    muted: "1",
    loop: "1",
    background: "1",
    controls: "1",
  });
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}

/**
 * Преобразует ссылку Kinescope.io в embed-формат
 * Примеры входа:
 *   https://kinescope.io/embed/xfiUFyVMNiH34SjjBgiLau
 *   https://kinescope.io/xfiUFyVMNiH34SjjBgiLau
 */
function toKinescopeEmbed(src) {
  if (!src) return src;

  const cleaned = String(src).split(/[?#]/)[0];
  const m = cleaned.match(/kinescope\.io\/(?:embed\/)?([a-zA-Z0-9_-]+)/i);
  if (!m) return src;

  const id = m[1];
  const params = new URLSearchParams({
    autoplay: "1",
    muted: "1",
    loop: "1",
    playsinline: "1",
  });

  return `https://kinescope.io/embed/${id}?${params.toString()}`;
}
</script>

<template>
  <button class="item-image-container">
    <div
      class="item-image"
      :class="{
        'item-image_intersected': isIntersected,
        'item-image_hide': isHide,
      }"
      ref="elemRef"
    >
      <!-- Изображение -->
      <img
        v-if="!isVideo && !isVimeo && !isKinescope"
        :src="src"
        :alt="alt || ''"
        :ref="(ref) => $emit('setImageRef', ref)"
      />

      <!-- Видео -->
      <video
        v-else-if="isVideo"
        :src="src"
        autoplay
        muted
        loop
        playsinline
        :ref="(ref) => $emit('setImageRef', ref)"
      />

      <!-- Vimeo iframe -->
      <div
        v-else-if="isVimeo"
        class="iframe-wrapper"
        :class="{ 'iframe-wrapper_portrait': orientation === 'portrait' }"
      >
        <iframe
          :src="toVimeoEmbed(src)"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          loading="lazy"
        />
        <div class="iframe-overlay"></div>
      </div>

      <!-- 🆕 Kinescope iframe -->
      <div
        v-else-if="isKinescope"
        class="iframe-wrapper"
        :class="{ 'iframe-wrapper_portrait': orientation === 'portrait' }"
      >
        <iframe
          :src="toKinescopeEmbed(src)"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          loading="lazy"
        />
        <div class="iframe-overlay"></div>
      </div>
    </div>
  </button>
</template>

<style>
.item-image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
}

.item-image {
  flex: 1 1 auto;
  overflow: hidden;
  height: 100%;
  width: 100%;
  opacity: 0;
  transform: translate3d(0, 16px, 0) scale(0.975);
  transition:
    transform var(--motion-media-duration) var(--motion-ease-reveal),
    opacity var(--motion-fade-duration) var(--motion-ease-out);
  transition-delay: v-bind(appearDelay);
}

.item-image_intersected:not(.item-image_hide) {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .item-image {
    transform: none;
    transition: none;
  }
}

.item-image img,
.item-image video,
.item-image iframe {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.item-image img,
.item-image video {
  object-fit: contain;
}

/* фикс для Vimeo и Kinescope player */
.item-image iframe {
  min-height: 100%;
}

.item-image iframe #player {
  height: 100% !important;
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  container-type: size;
}

.iframe-wrapper iframe {
  width: min(100cqw, calc(100cqh * 16 / 9));
  height: min(100cqh, calc(100cqw * 9 / 16));
  aspect-ratio: 16 / 9;
  display: block;
}

.iframe-wrapper_portrait iframe {
  width: min(100cqw, calc(100cqh * 9 / 16));
  height: min(100cqh, calc(100cqw * 16 / 9));
  aspect-ratio: 9 / 16;
}

.iframe-overlay {
  position: absolute;
  inset: 0;
  cursor: pointer;
  background: transparent;
}
</style>
