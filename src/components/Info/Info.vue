<script setup>
import { useProjectStore } from "@/stores/project";
import { CONTENT_TYPES, PAGE_NAMES } from "@/utils/constants";
import { computed, onUnmounted, ref, watch } from "vue";
import RevealText from "@/components/Appear/RevealText.vue";
import ImageItem from "./ImageItem.vue";
import VideoItem from "./VideoItem.vue";
import IframeItem from "./IframeItem.vue";
import { getLocomotiveScrollInstance } from "@/utils/getLocomotiveScrollInstance";
import { useDisableScrollOnInfoOpen } from "../Project/hooks";

const props = defineProps({
  pageName: String,
  content: Array,
});

const projectStore = useProjectStore();
const infoAreaRef = ref(null);
const scrollContainer = ref(null);
const scrollInstance = ref(null);
const isInfoOpen = computed(() =>
  projectStore.isInfoOpen || props.pageName === PAGE_NAMES.me
);
const getRevealDelay = (index) => Math.min(index, 3) * 65;

function toVimeoEmbed(src) {
  if (!src) return src;
  const cleaned = String(src).split(/[?#]/)[0];
  const match = cleaned.match(
    /(?:player\.vimeo\.com\/video\/|vimeo\.com\/(?:.*\/)?)(\d+)/i
  );
  if (!match) return src;
  const params = new URLSearchParams({
    autoplay: "1",
    loop: "1",
    background: "1",
  });
  return `https://player.vimeo.com/video/${match[1]}?${params}`;
}

watch(isInfoOpen, (isOpen) => {
  if (props.pageName === PAGE_NAMES.me) return;
  if (isOpen) {
    projectStore.showFooterData();
    scrollInstance.value = getLocomotiveScrollInstance(scrollContainer.value);
  } else {
    if (window.innerWidth <= 1024) projectStore.hideFooterData();
    scrollInstance.value?.destroy();
    scrollInstance.value = null;
    scrollContainer.value?.style.removeProperty("pointer-events");
  }
}, { flush: "post" });

useDisableScrollOnInfoOpen();

onUnmounted(() => scrollInstance.value?.destroy());
</script>

<template>
  <div
    class="info"
    :aria-hidden="!isInfoOpen"
    :class="{
      info_open: isInfoOpen,
      info_me: pageName == PAGE_NAMES.me,
      info_project: pageName == PAGE_NAMES.project,
    }"
  >
    <div class="info-inner hide-scrollbar" ref="infoAreaRef">
      <div class="text-container" ref="scrollContainer">
        <template v-if="isInfoOpen">
          <template v-for="(item, ind) in content" :key="ind">
            <h3
              v-if="item.type === CONTENT_TYPES.title"
              class="info-text info-text_title"
            >
              <RevealText :text="item.text" :delay="getRevealDelay(ind)" />
            </h3>
            <p v-else-if="item.type === CONTENT_TYPES.paragraph" class="info-text">
              <RevealText :text="item.text" :delay="getRevealDelay(ind)" />
            </p>
            <p
              v-else-if="item.type === CONTENT_TYPES.extraParagraph"
              class="info-text info-text_extra"
            >
              <RevealText :text="item.text" :delay="getRevealDelay(ind)" />
            </p>
            <ImageItem
              v-else-if="item.type === CONTENT_TYPES.image"
              :pageName="pageName"
              :src="item.link"
              :isAppear="isInfoOpen"
              :initialDelay="getRevealDelay(ind)"
            />
            <VideoItem
              v-else-if="item.type === CONTENT_TYPES.video"
              :src="item.link"
              :poster="item.poster"
              :name="item.name"
              :author="item.author"
              :isAppear="isInfoOpen"
              :initialDelay="getRevealDelay(ind)"
            />
            <IframeItem
              v-else-if="item.type === CONTENT_TYPES.iframe"
              :src="toVimeoEmbed(item.link)"
              :isAppear="isInfoOpen"
              :initialDelay="getRevealDelay(ind)"
              :name="item.name || 'Iframe project'"
              :author="item.author || '2bit'"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info {
  opacity: 0;
  transition: opacity var(--motion-exit-duration) ease-out;
  pointer-events: none;
  display: flex;  
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: calc(var(--footer-z-index) - 1);
  background-color: var(--bg-clr-white);
  --content-width: calc(100% - var(--page-padding-x) * 2);
}

/* .info_me {
  height: auto;
} */

.info_open {
  opacity: 1;
  pointer-events: initial;
}

/* Locomotive sets inline pointer-events on its section, even after destroy(). */
.info:not(.info_open) .text-container {
  pointer-events: none !important;
}

.info-inner {
  width: 100%;
  height: 100%;
  max-height: 100%;
  /*overflow: auto;*/
  width: calc(100% - var(--page-padding-x) * 2);
  grid-template-columns: repeat(5, var(--column-width));
  display: grid;
  justify-content: center;
  overscroll-behavior: contain;
}

.info_me .info-inner {
  overflow: initial;
  padding-bottom: 80px;
  height: auto;
}

.text-container {
  grid-column: 2 / 4;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: end;
  height: 100%;
  padding-bottom: 157px;
}

.info_me .text-container {
  padding-top: calc(var(--header-height) + 100vh / 6);
}

.scroll-info {
  position: absolute;
  bottom: 24px;
  left: calc(var(--content-width) / 5 + var(--page-padding-x));
  z-index: calc(var(--footer-z-index) + 1);
  color: var(--clr-gray);
}
.scroll-mask {
  display: block;
  position: absolute;
  left: calc(var(--content-width) / 5 + var(--page-padding-x));
  width: 100%;
}
.scroll-mask_bottom {
  height: 70px;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    var(--bg-clr-white) 30%
  );
}
.scroll-mask_top {
  height: calc(var(--footer-height) + 10px);
  top: 0;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0) 0%,
    var(--bg-clr-white) 30%
  );
}

.info-text {
  text-indent: var(--text-indent);
  color: var(--clr-gray);
  grid-column: 1 / 2;
  position: relative;
}

.info-image, .info-video {
  position: relative;
  margin: 25px 0;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 4.5 / 2.5;
  grid-column: 1 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 10px;
}

.info-image:deep(.media-reveal-content),
.info-video:deep(.media-reveal-content) {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.info-video {
  cursor: pointer;
}

.info-image:deep(img), .info-video:deep(video) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.info-image_me, .info-video {
  grid-column: 1 / 2;
  aspect-ratio: 2.3 / 1.3;
  margin: 0 0 90px 0;
  padding-right: 0;
}
.info-text_extra {
  color: var(--clr-black);
  grid-column-end: 3;
  margin: 22px 0;
  padding-right: 10px;
}
.info-text_title {
  color: var(--clr-black);
  margin: 22px 0 6px;
}

.info-text_extra:has(+ :is(.info-text_title, .info-image)) {
  margin-bottom: 0;
}

.info-text_title:has(+ :is(.info-text_extra, .info-image)) {
  margin-bottom: 0;
}

.info-image:has(+ :is(.info-text_extra, .info-text_title)) {
  margin-bottom: 0;
}

@media (min-width: 1920px) {
  .text-container {
    grid-template-columns: repeat(12, var(--column-width));
    padding-bottom: 193px;
  }
  .info-text {
    max-width: 287px;
    height: 169px;
  }
  .info-text_extra {
    max-width: 575px;
    height: 25px;
  }
  .info_project .info-video.media-reveal_visible {
    margin-bottom: 150px;
  }
}

@media (max-height: 768px) {
  .info-image_me, .info-video {
    margin: 0 0 50px 0;
  }
}

@media (max-width: 1024px) {
  .info-inner {
    display: block;
    overflow: auto;
  }

  .text-container {
    grid-template-columns: repeat(12, var(--column-width));
    padding-bottom: 240px;
  }

  .info_me .text-container {
    padding-top: calc((100vh - 240px) / 6 + 120px);
  }

  .info-text {
    grid-column: 2 / 6;
  }

  .info-text_extra {
    grid-column: 2 / 8;
  }

  .info-image, .info-video {
    grid-column: 2 / 8;
  }

  .info-image_me, .info-video {
    grid-column: 2 / 6;
    margin: 0 0 calc((100vh - 240px) / 3) 0;
  }
}

@media (max-width: 820px) {
  .text-container {
    padding-bottom: 180px;
  }

  .info_me .text-container {
    padding-bottom: 0;
  }

  .info-text {
    grid-column: 2 / 7;
  }

  .info-text_extra {
    grid-column: 2 / 9;
  }

  .info-image, .info-video {
    grid-column: 2 / 9;
  }

  .info-image_me, .info-video {
    grid-column: 2 / 7;
  }
}

@media (max-width: 768px) {
  .text-container {
    padding-top: 93px;
    align-content: start;
  }

  .info_me .text-container {
    padding-top: 170px;
  }

  .info-text {
    grid-column: 2 / 10;
  }

  .info-text_extra {
    grid-column: 2 / 12;
  }

  .info-image, .info-video {
    grid-column: 2 / 12;
  }

  .info-image_me, .info-video {
    grid-column: 2 / 9;
    margin: 0 0 60px 0;
  }
}

@media (max-height: 720px) and (max-width: 768px) {
  .info_me {
    position: relative;
  }

  .info_me .info-inner {
    padding-bottom: 0px;
  }
}
</style>
