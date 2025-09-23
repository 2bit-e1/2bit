<script setup>
import { useMediaPopupStore } from "@/stores/mediaPopup";
import Video from "@/components/Video.vue";
import AppearWord from "./Appear/AppearWord.vue";

const mediaPopupStore = useMediaPopupStore();
</script>

<template>
  <div
    class="video-popup"
    :class="{ 'video-popup_open': mediaPopupStore.popupData.isOpen }"
    :aria-hidden="!mediaPopupStore.popupData.isOpen"
  >
    <div class="video-container">
      <!-- Видео -->
      <Video
        v-if="mediaPopupStore.popupData.type === 'video'"
        :videoSrc="mediaPopupStore.popupData.src"
        :isPlaying="mediaPopupStore.popupData.isOpen"
      />

      <!-- Iframe (например Vimeo, YouTube) -->
      <iframe
        v-else-if="mediaPopupStore.popupData.type === 'iframe'"
        :src="mediaPopupStore.popupData.src"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        loading="lazy"
        class="video-iframe"
      />
    </div>

    <h3 class="description">
      <AppearWord
        :word="mediaPopupStore.popupData.name"
        :isAppear="mediaPopupStore.popupData.isOpen"
        :delayOrder="1"
        class="description-name"
      />
      <AppearWord
        :word="mediaPopupStore.popupData.author"
        :isAppear="mediaPopupStore.popupData.isOpen"
        :delayOrder="2"
        class="description-author"
      />
    </h3>
  </div>
</template>

<style scoped>
.video-popup {
  position: fixed;
  z-index: var(--media-popup-z-index);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #0f0f0f;
  opacity: 0;
  pointer-events: none;
  --opacity-delay: 150ms;
  transition: opacity 300ms var(--opacity-delay) var(--timing-func-2);
  --video-popup-x-padding: 107px;
  padding: var(--header-height) var(--video-popup-x-padding) 70px;
}

.video-popup_open {
  --opacity-delay: 0ms;
  opacity: 1;
  pointer-events: initial;
}

.video-container {
  overflow: hidden;
  height: 100%;
  transition: clip-path 400ms ease;
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  display: flex;
  align-items: center;
}

.video-popup_open .video-container {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.video-container:deep(video) {
  object-fit: contain;
  width: 100%;
}

.video-iframe {
  width: 100%;
  height: 100%;
  border: none;
  object-fit: contain;
}

.description {
  position: absolute;
  z-index: 20;
  bottom: 27px;
  display: flex;
  column-gap: var(--text-indent);
  left: calc(var(--page-padding-x) + var(--column-width));
}

.description-author {
  color: var(--bg-clr-white);
}

.description-name {
  color: var(--clr-gray);
}

@media (max-width: 1024px) {
  .video-popup {
    --video-popup-x-padding: var(--column-width);
  }
}
</style>
