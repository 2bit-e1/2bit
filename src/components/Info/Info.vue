<script setup>
import { useProjectStore } from "@/stores/project";
import { CONTENT_TYPES, PAGE_NAMES } from "@/utils/constants";
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { appearDelayStep, useToggleFooterDataOnScroll } from "./utils";
import AppearBlocks from "./AppearBlocks.vue";
import LocomotiveScroll from 'locomotive-scroll';
import ImageItem from "./ImageItem.vue";

const props = defineProps({
  pageName: String,
  content: Array,
});

const contentBlocksDelay = ref({});
const isAppearReady = ref(false)
const scrollContainer = ref(null);
const scrollInstance = ref(null);
const lastScrollTop = ref(0);

const projectStore = useProjectStore();

const infoAreaRef = ref(null);

const isSkipToggleFooterData = computed(
  () => props.pageName != PAGE_NAMES.project || window.innerWidth > 1024
);

props.content.forEach((contentItem, contentInd) => {
  if (contentItem.type == CONTENT_TYPES.image) contentBlocksDelay.value[contentInd] = 1 * appearDelayStep;
})

const scrollListener = (scrollInfo) => {
  if (lastScrollTop.value > 1) projectStore.hideFooterData()
  else projectStore.showFooterData()

  lastScrollTop.value = scrollInfo.scroll.y
}

useToggleFooterDataOnScroll(infoAreaRef, isSkipToggleFooterData);

watchEffect(() => {
  if (Object.values(contentBlocksDelay.value).length == props.content.length) {
    isAppearReady.value = true;
  }
});

const isInfoOpen = computed(() => {
  return projectStore.isInfoOpen || props.pageName == PAGE_NAMES.me;
});

watch(isInfoOpen, (isOpen) => {
  if (props.pageName == PAGE_NAMES.me) return
  
  if (isOpen) {
    scrollInstance.value = new LocomotiveScroll({
      el: scrollContainer.value,
      smooth: true,
      mobile: {
        smooth: true,
        breakpoint: 0,
      },
      tablet: {
        // smooth: true,
      }
    });  

    if (window.innerWidth <= 1024) scrollInstance.value.on('scroll', scrollListener)
  } else {
    scrollInstance.value.destroy();
  }
}, { flush: 'post' })

onUnmounted(() => {
  if (scrollInstance.value) scrollInstance.value.destroy();
})
</script>

<template>
  <div
    class="info"
    :aria-hidden="!(projectStore.isInfoOpen || pageName == PAGE_NAMES.me)"
    :class="{
      info_open: isInfoOpen,
      info_me: pageName == PAGE_NAMES.me,
      info_project: pageName == PAGE_NAMES.project,
    }"
  >
    <!-- <span class="scroll-mask scroll-mask_top"></span> -->

    <div class="info-inner hide-scrollbar" ref="infoAreaRef">
      <div class="text-container" ref="scrollContainer">
        <template v-if="isInfoOpen" v-for="(item, ind) in content">
            <h3
              class="info-text info-text_title"
              v-if="item.type == CONTENT_TYPES.title"
            >
              {{ item.text }}
              <AppearBlocks
                @setDelay="(delay) => (contentBlocksDelay[ind] = delay)"
                :initialDelay="Object.keys(contentBlocksDelay).reduce((acc, key) => {
                  return  +key < ind ? acc + contentBlocksDelay[key] : acc
                } , 0)"
                :isAppearReady="isAppearReady && (projectStore.isInfoOpen || pageName == PAGE_NAMES.me)"
              />
            </h3>

            <p class="info-text" v-if="item.type == CONTENT_TYPES.paragraph">
              {{ item.text }}
              <AppearBlocks
                @setDelay="(delay) => (contentBlocksDelay[ind] = delay)"
                :initialDelay="Object.keys(contentBlocksDelay).reduce((acc, key) => {
                  return  +key < ind ? acc + contentBlocksDelay[key] : acc
                } , 0)"
                :isAppearReady="isAppearReady && (projectStore.isInfoOpen || pageName == PAGE_NAMES.me)"
              />
            </p>

            <p
              class="info-text info-text_extra"
              v-if="item.type == CONTENT_TYPES.extraParagraph"
            >
              {{ item.text }}
              <AppearBlocks
                @setDelay="(delay) => (contentBlocksDelay[ind] = delay)"
                :initialDelay="Object.keys(contentBlocksDelay).reduce((acc, key) => {
                  return  +key < ind ? acc + contentBlocksDelay[key] : acc
                } , 0)"
                :isAppearReady="isAppearReady && (projectStore.isInfoOpen || pageName == PAGE_NAMES.me)"
              />
            </p>

            <ImageItem 
              v-if="item.type == CONTENT_TYPES.image"
              :pageName="pageName"
              :src="item.link"
              :isAppear="isAppearReady && (projectStore.isInfoOpen || pageName == PAGE_NAMES.me)"
              :initialDelay="Object.keys(contentBlocksDelay).reduce((acc, key) => {
                return  +key < ind ? acc + contentBlocksDelay[key] : acc
              } , 0) + 'ms'"
            />
            
            <!-- <template v-if="item.type == CONTENT_TYPES.image">
              <div
                v-if="pageName == PAGE_NAMES.me"
                class="info-image info-image_me"
                :class="isAppearReady && (projectStore.isInfoOpen || pageName == PAGE_NAMES.me) ? 'info-image_appear' : ''"
                :style="{ 'animation-delay': Object.keys(contentBlocksDelay).reduce((acc, key) => {
                  return  +key < ind ? acc + contentBlocksDelay[key] : acc
                } , 0) + 'ms' }"
              >
                <img :src="item.link" alt="" />
              </div>

              <div
                v-else
                :style="{ 'animation-delay': Object.keys(contentBlocksDelay).reduce((acc, key) => {
                  return  +key < ind ? acc + contentBlocksDelay[key] : acc
                } , 0) + 'ms' }"
                class="info-image"
                :class="isAppearReady && (projectStore.isInfoOpen || pageName == PAGE_NAMES.me) ? 'info-image_appear' : ''"
              >
                <img :src="item.link" alt="" />
              </div>
            </template> -->
        </template>
      </div>
    </div>

    <!-- <span class="scroll-mask scroll-mask_bottom"></span> -->
    <!-- <span class="scroll-info  ">Скролл</span> -->
  </div>
</template>

<style scoped>
.info {
  opacity: 0;
  transition: opacity 150ms;
  pointer-events: none;
  display: flex;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: calc(var(--footer-z-index) - 1);
  background-color: var(--bg-clr-white);
  /* display: flex; */
  justify-content: center;
  --content-width: calc(100% - var(--page-padding-x) * 2);
}

.info_me {
  height: auto;
}

.info_open {
  opacity: 1;
  pointer-events: initial;
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
  padding-top: calc(
    (100vh - var(--footer-height) - var(--header-height)) / 6 +
      var(--header-height)
  );
  padding-bottom: calc(var(--footer-height) - 7px);
  grid-column: 2 / 4;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: start;
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

.info-image {
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  
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

.info-image_appear {
  animation: appear-image 300ms forwards ease;
}

@keyframes appear-image {
  0% {
    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  }

  100% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}

.info-image:deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}
.info-image_me {
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

@media (max-height: 768px) {
  .info-image_me {
    margin: 0 0 50px 0;
  }
}

@media (max-width: 1024px) {
  .info-inner {
    display: block;
  }

  .text-container {
    padding-top: 230px;
    grid-template-columns: repeat(12, var(--column-width));
  }

  .info-text {
    grid-column: 2 / 6;
  }

  .info-text_extra {
    grid-column: 2 / 8;
  }

  .info-image {
    grid-column: 2 / 8;
  }

  .info-image_me {
    grid-column: 2 / 6;
    margin: 0 0 120px 0;
  }
}

@media (max-width: 820px) {

  .info-text {
    grid-column: 2 / 7;
  }

  .info-text_extra {
    grid-column: 2 / 9;
  }

  .info-image {
    grid-column: 2 / 9;
  }

  .info-image_me {
    grid-column: 2 / 7;
    margin: 0 0 80px 0;
  }

  .text-container {
    padding-top: 180px;
  }
}

@media (max-width: 768px) {
  .info-text {
    grid-column: 2 / 10;
  }

  .info-text_extra {
    grid-column: 2 / 12;
  }

  .info-image {
    grid-column: 2 / 12;
  }

  .info-image_me {
    grid-column: 2 / 9;
    margin: 0 0 60px 0;
  }

  .info-image_me {
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
