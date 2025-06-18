<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import ImagesListItem from "./ImageListItem.vue";
import { useWaitingImagesToLoad } from "@/utils/useWaitingImagesToLoad";
import { getImageSrc, timeForLoadAllImages } from "./utils";
import LocomotiveScroll from "locomotive-scroll";
import { processImagesData } from "@/data/process/images";
import Preloader from "@/components/Preloader.vue";

const emits = defineEmits(["openPopup"]);

const imagesRefs = ref([]);
const isImagesLoaded = ref(false);
const shouldShowPreloader = ref(false);
const canHidePreloader = ref(false); // ← новое состояние

let preloaderTimeout = null;
let minPreloaderDurationTimeout = null;

const scrollContainer = ref(null);
const scrollInstance = ref(null);

// Получаем количество колонок по ширине экрана
const getColumnsCount = () => {
  if (window.innerWidth <= 600) return 2;
  if (window.innerWidth <= 1024) return 3;
  return 4;
};

const columnCount = ref(getColumnsCount());

const handleImageClick = (imageData) => {
  emits("openPopup", getImageSrc(imageData.name), imageData.description);
};

const handleParallax = (scrollY) => {
  const items = scrollContainer.value.querySelectorAll(".list-item");

  items.forEach((item, index) => {
    const col = index % columnCount.value;
    const middle = (columnCount.value - 1) / 1;
    const delayFactor = (col - middle) * 3;
    const offset = scrollY * delayFactor * 0.01;

    item.style.transform = `translateY(${offset}px)`;
  });
};

let scrollTimeout;

onMounted(() => {
  columnCount.value = getColumnsCount();

  // Показываем прелоудер, только если загрузка дольше 300 мс
  preloaderTimeout = setTimeout(() => {
    shouldShowPreloader.value = true;

    // Минимальная длительность прелоудера — 3 секунды
    minPreloaderDurationTimeout = setTimeout(() => {
      canHidePreloader.value = true;
    }, 3000);
  }, 300);

  scrollInstance.value = new LocomotiveScroll({
    el: scrollContainer.value,
    smooth: true,
    smartphone: { smooth: true },
    tablet: { smooth: true },
  });

  scrollInstance.value.on("scroll", (args) => {
    clearTimeout(scrollTimeout);
    handleParallax(args.scroll.y);

    scrollTimeout = setTimeout(() => {
      const items = scrollContainer.value.querySelectorAll(".list-item");
      items.forEach((item) => {
        item.style.transform = "";
      });
    }, 40);
  });
});

onUnmounted(() => {
  scrollInstance.value?.destroy();
  clearTimeout(preloaderTimeout);
  clearTimeout(minPreloaderDurationTimeout);
});

// Когда все изображения загружены
useWaitingImagesToLoad(
  imagesRefs,
  () => {
    const hideLoader = () => {
      isImagesLoaded.value = true;
    };

    if (shouldShowPreloader.value) {
      if (canHidePreloader.value) {
        hideLoader();
      } else {
        const interval = setInterval(() => {
          if (canHidePreloader.value) {
            hideLoader();
            clearInterval(interval);
          }
        }, 100);
      }
    } else {
      hideLoader();
    }

    clearTimeout(preloaderTimeout);
  },
  timeForLoadAllImages
);
</script>

<template>
  <!-- Прелоудер покажется только если загрузка заняла больше 300мс -->
  <Preloader v-if="!isImagesLoaded && shouldShowPreloader" />

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
        >
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
  transition: transform 0.4s ease-out;
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
