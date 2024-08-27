<script setup>
import { useProjectStore } from "@/stores/project";
import { CONTENT_TYPES, PAGE_NAMES } from "@/utils/constants";
import { computed, onMounted, ref } from "vue";
import { useToggleFooterDataOnScroll } from "./utils";

const props = defineProps({
  pageName: String,
  content: Array
});

const projectStore = useProjectStore();

const infoAreaRef = ref(null);
const isSkipToggleFooterData = 
  computed(() => props.pageName != PAGE_NAMES.project || window.innerWidth > 1024);

useToggleFooterDataOnScroll(infoAreaRef, isSkipToggleFooterData);

</script>

<template>
  <div
    class="info"
    :class="{
      info_open: projectStore.isInfoOpen || pageName == PAGE_NAMES.me,
      info_me: pageName == PAGE_NAMES.me,
      info_project: pageName == PAGE_NAMES.project,
    }"
  >
    <!-- <span class="scroll-mask scroll-mask_top"></span> -->

    <div class="info-inner hide-scrollbar" ref="infoAreaRef">
      <div class="text-container">
        <template v-for="item in content">
          <h3 class="info-text info-text_title" v-if="item.type == CONTENT_TYPES.title">{{ item.text }}</h3>
          
          <p class="info-text" v-if="item.type == CONTENT_TYPES.paragraph">{{ item.text }}</p>

          <p class="info-text info-text_extra" v-if="item.type == CONTENT_TYPES.extraParagraph">{{ item.text }}</p>
          
          <template v-if="item.type == CONTENT_TYPES.image">
            <div class="info-image info-image_me" v-if="pageName == PAGE_NAMES.me">
              <img :src="item.link" alt="" />
            </div>

            <div class="info-image" v-else>
              <img :src="item.link" alt="" />
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- <span class="scroll-mask scroll-mask_bottom"></span> -->
    <!-- <span class="scroll-info  ">Скролл</span> -->
  </div>
</template>

<style scoped>
.info {
  display: none;

  position: absolute;
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
  display: flex;
}

.info-inner {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: auto;
  padding-top: calc(
    (100vh - var(--footer-height) - var(--header-height)) / 6 +
      var(--header-height)
  );
  padding-bottom: calc(var(--footer-height) - 7px);
  width: calc(100% - var(--page-padding-x) * 2);
  grid-template-columns: repeat(5, var(--column-width));
  display: grid;
  justify-content: center;
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
}

.info-image {
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

.info-image img {
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
    padding-top: 230px;
    display: block;
  }
  
  .text-container {
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
  .info-inner {
    padding-top: 180px;
  }
  
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

@media (max-height: 720px) {
  .info_me {
    position: relative;
  }
  
  .info_me .info-inner {
    padding-bottom: 0px;
  }
}
</style>
