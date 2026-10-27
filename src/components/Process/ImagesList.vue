<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import ImagesListItem from "./ImageListItem.vue";
import { getImageSrc } from "./utils";
import LocomotiveScroll from "locomotive-scroll";
import { processImagesData } from "@/data/process/images";
import Preloader from "@/components/Preloader.vue";
import { createMediaWindow } from '@/utils/mediaWindow';
import { useProcessStore } from '@/stores/process';

const emits = defineEmits(["openPopup"]);

const processStore = useProcessStore();
const mediaReady = ref({});
const mediaStates = ref({});
const loadingState = ref('loading');
const isImagesLoaded = ref(false);
let mediaWindow;

const scrollContainer = ref(null);
const scrollInstance = ref(null);

const handleImageClick = (imageData, index) => {
  emits(
    "openPopup",
    getImageSrc(imageData.name),
    imageData.description,
    imageData.orientation,
    index
  );
};

onMounted(() => {
  scrollInstance.value = new LocomotiveScroll({
    el: scrollContainer.value,
    smooth: true,
    smartphone: { smooth: true },
    tablet: { smooth: true },
  });
  scrollInstance.value.stop();
  mediaWindow = createMediaWindow({
    onInitialStateChange: state => { loadingState.value = state; },
    onInitialReady: () => {
      isImagesLoaded.value = true;
      if (!processStore.popupData.isOpen) scrollInstance.value?.start();
    },
    onStateChange: (element, state, info) => {
      mediaReady.value[element.dataset.mediaIndex] = info.ready;
      mediaStates.value[element.dataset.mediaIndex] = { state, ...info };
    },
  });
  mediaWindow.setFrames(scrollContainer.value.querySelectorAll('.list-item'));
  mediaWindow.setSuspended(processStore.popupData.isOpen);
});

watch(() => processStore.popupData.isOpen, value => {
  mediaWindow?.setSuspended(value);
  if (value || !isImagesLoaded.value) scrollInstance.value?.stop();
  else scrollInstance.value?.start();
});

onUnmounted(() => {
  scrollInstance.value?.destroy();
  mediaWindow?.destroy();
});
</script>

<template>
  <Preloader v-if="!isImagesLoaded" :state="loadingState" @retry="mediaWindow?.retry()" />

  <div
    class="images-list"
    ref="scrollContainer"
    data-scroll-container
    data-scroll-speed="2"
  >
    <div class="list-container">
      <ul class="list">
        <li
          class="list-item"
          v-for="(imageData, ind) in processImagesData"
          :key="ind"
          :data-media-index="ind"
        >
          <ImagesListItem
            :src="getImageSrc(imageData.name)"
            :isHide="!isImagesLoaded"
            :isReady="!!mediaReady[ind]"
            :mediaState="mediaStates[ind]"
            :ind="ind"
            :orientation="imageData.orientation"
            @click.stop="handleImageClick(imageData, ind)"
            @retry="mediaWindow?.retry(scrollContainer.querySelectorAll('.list-item')[ind])"
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

@media (max-width: 600px) {
  .list {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 100px;
    --row-gap: 54px;
  }
}
</style>
