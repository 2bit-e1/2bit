<script setup>
import { useIntersectionObserver } from "@/utils/useIntersectionObserver";
import { useWaitingImagesToLoad } from "@/utils/useWaitingImagesToLoad";
import { onMounted, onUnmounted, ref } from "vue";
import MobileContentImage from "./MobileContentImage.vue";
import { timeForLoadAllImages } from "@/components/Process/utils";
import LocomotiveScroll from 'locomotive-scroll';

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

</script>

<template>
  <div class="mobile-content">
    <ul class="images-list">
      <MobileContentImage
        v-for="(src, ind) in imagesSrc"
        :src="src"
        :ind="ind"
        :key="src"
        :isImageHide="isImagesHide"
        @setImageRef="(ref) => imagesRefs[ind] = ref"
      />
    </ul>
  </div>
</template>

<style scoped>
.mobile-content {
  display: grid;
  grid-template-columns: repeat(12, var(--column-width));
  padding-top: 231px;
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
    padding-top: 180px;
  }

  .images-list {
    grid-column: 12 span;
    row-gap: 23px;
  }
}

@media (max-width: 768px) {
  .mobile-content {
    padding-top: 180px;
  }

  .images-list {
    grid-column: 12 span;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 100px;
    row-gap: 54px;
    column-gap: 38px;
    padding-bottom: 40px;
  }
}
</style>
