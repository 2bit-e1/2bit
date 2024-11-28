<script setup>
import { useIntersectionObserver } from "@/utils/useIntersectionObserver";
import { useWaitingImagesToLoad } from "@/utils/useWaitingImagesToLoad";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import MobileContentImage from "./MobileContentImage.vue";
import { timeForLoadAllImages } from "@/components/Process/utils";
import LocomotiveScroll from "locomotive-scroll";
import { useProjectStore } from "@/stores/project";
import { getLocomotiveScrollInstance } from "@/utils/getLocomotiveScrollInstance";

const { imagesSrc } = defineProps({
  imagesSrc: Array,
});

const imagesRefs = ref([]);
const isImagesHide = ref(true);

useWaitingImagesToLoad(
  imagesRefs,
  () => {
    isImagesHide.value = false;
  },
  timeForLoadAllImages
);

const scrollContainer = ref(null);
const scrollInstance = ref(null);

onMounted(() => {
  // scrollInstance.value = getLocomotiveScrollInstance(scrollContainer.value);

  // scrollInstance.value?.on("scroll", scrollListener);
  // window.addEventListener("scroll", scrollListener);
});

const projectStore = useProjectStore();
const lastScrollTop = ref(0);

// const scrollListener = (scrollInfo) => {
//   if (lastScrollTop.value > 1) projectStore.hideFooterData();
//   else projectStore.showFooterData();

//   lastScrollTop.value = scrollInfo.scroll.y;
// };

onUnmounted(() => {
  scrollInstance.value?.destroy();
});
</script>

<template>
  <div class="mobile-content" ref="scrollContainer">
    <ul class="images-list">
      <MobileContentImage
        v-for="(src, ind) in imagesSrc"
        :src="src"
        :ind="ind"
        :key="src"
        :isImageHide="isImagesHide"
        @setImageRef="(ref) => (imagesRefs[ind] = ref)"
      />
    </ul>
  </div>
</template>

<style scoped>
.mobile-content {
  display: grid;
  grid-template-columns: repeat(12, var(--column-width));
  padding-top: 130px;
}

.images-list {
  grid-column: 2 / 12;
  justify-content: center;
  display: flex;
  flex-direction: column;
  row-gap: 26px;
}

@media (max-width: 820px) {
  .mobile-content {
    padding-top: 86px;
  }

  .images-list {
    grid-column: 12 span;
    row-gap: 23px;
  }
}

@media (max-width: 768px) {
  .mobile-content {
    padding-top: 93px;
  }

  .images-list {
    grid-column: 2 / 12;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    padding-bottom: 40px;
  }
}

</style>
