<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import ImagesListItem from "./ImageListItem.vue";
import { useWaitingImagesToLoad } from "@/utils/useWaitingImagesToLoad";
import { getImageSrc, timeForLoadAllImages } from "./utils";
import LocomotiveScroll from "locomotive-scroll";
import { processImagesData } from "@/data/process/images";
import { getLocomotiveScrollInstance } from "@/utils/getLocomotiveScrollInstance";

const emits = defineEmits(["openPopup"]);

const imagesRefs = ref([]);
const isImagesLoaded = ref(false);
const scrollContainer = ref(null);
const scrollInstance = ref(null);

const handleImageClick = (imageData) => {
  emits("openPopup", getImageSrc(imageData.name), imageData.description);
};

onMounted(() => {
  scrollInstance.value = getLocomotiveScrollInstance(
    scrollContainer.value
  );
});

onUnmounted(() => {
  scrollInstance.value?.destroy();
});

useWaitingImagesToLoad(
  imagesRefs,
  () => {
    isImagesLoaded.value = true;
  },
  timeForLoadAllImages
);
</script>

<template>
  <div
    class="images-list"
    ref="scrollContainer"
    data-scroll-container
    data-scroll-speed="2"
  >
    <div class="list-container">
      <ul class="list">
        <li class="list-item" v-for="(imageData, ind) in processImagesData">
          <ImagesListItem
            :src="getImageSrc(imageData.name)"
            :isHide="!isImagesLoaded"
            :ind="ind"
            :timeForLoadAllImages="timeForLoadAllImages"
            @setImageRef="(ref) => (imagesRefs[ind] = ref)"
            @click.stop="handleImageClick(imageData)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.images-list {
  padding: var(--header-height) max(calc((100vw - 1440px) / 5), 26px);
}

.list-container {
}

.list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0px, 280px));
  justify-content: space-between;
  --row-gap: 80px;

  grid-auto-rows: 160px;
  column-gap: 50px;
  row-gap: var(--row-gap);
}

.list-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  --appear-delay-default: 0ms;
  --appear-delay-step: 100ms;
  --appear-delay: var(--appear-delay-default);
}

.list-item:nth-child(4n + 2) {
  --appear-delay: calc(
    1 * var(--appear-delay-step) + var(--appear-delay-default)
  );
}

.list-item:nth-child(4n + 3) {
  --appear-delay: calc(
    2 * var(--appear-delay-step) + var(--appear-delay-default)
  );
}

.list-item:nth-child(4n + 4) {
  --appear-delay: calc(
    3 * var(--appear-delay-step) + var(--appear-delay-default)
  );
}

@media (max-width: 1024px) {
  .images-list {
    padding: 130px 0 40px;
  }

  .list {
    grid-template-columns: repeat(3, 1fr);
    --row-gap: 50px;
  }
}

@media (max-width: 820px) {
  .list {
    grid-auto-rows: 120px;
  }
}

@media (max-width: 600px) {
  .list {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 100px;
    --row-gap: 54px;
  }
}
</style>
