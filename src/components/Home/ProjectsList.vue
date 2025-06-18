<script setup>
import allProjects from "@/data/projects/index.js";
import ProjectItem from "@/components/Home/ProjectItem.vue";
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useHomeStore } from "@/stores/home";
import { useDebounce } from "@/utils/useDebounce";
import { onBeforeRouteLeave } from 'vue-router';
import Preloader from "@/components/Preloader.vue";

const isDesktop = ref(false);
const isMediaLoaded = ref(false);
const shouldShowPreloader = ref(false);
let preloaderTimeout = null;

const checkIsDesktop = () => {
  isDesktop.value = window.innerWidth > 1024;
};

const preloadMedia = () => {
  const promises = [];

  allProjects.forEach((project) => {
    project.media.forEach((media) => {
      if (media.type === "image") {
        const img = new Image();
        img.src = media.src;
        img.loading = 'eager';
        img.decoding = 'async';
        promises.push(
          new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          })
        );
      } else if (media.type === "video") {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "video";
        link.href = media.src;
        document.head.appendChild(link);

        promises.push(
          new Promise((resolve) => {
            const video = document.createElement("video");
            video.src = media.src;
            video.preload = "auto";
            video.muted = true;
            video.playsInline = true;
            video.onloadeddata = video.onerror = resolve;
          })
        );
      }
    });
  });

  return Promise.all(promises);
};


onMounted(() => {
  checkIsDesktop();
  window.addEventListener("resize", checkIsDesktop);

  const hasVisited = sessionStorage.getItem("hasVisited");

  if (isDesktop.value && !hasVisited) {
    sessionStorage.setItem("hasVisited", "true");
    shouldShowPreloader.value = true;

    // Стартуем загрузку, но не ждём её завершения
    preloadMedia();

    // Показываем прелоадер ровно 3 секунды
    preloaderTimeout = setTimeout(() => {
      isMediaLoaded.value = true;
    }, 3000);
  } else {
    isMediaLoaded.value = true;
  }
});



const homeStore = useHomeStore();
const activeImage = computed(() => homeStore.activeProjectImage);
const isPreviewVisible = ref(false);
let hideTimeout;

watch(activeImage, (newVal) => {
  clearTimeout(hideTimeout);
  if (newVal) {
    isPreviewVisible.value = true;
    document.body.classList.add("inverted");
  } else {
    hideTimeout = setTimeout(() => {
      isPreviewVisible.value = false;
    }, 300);
    document.body.classList.remove("inverted");
  }
});

const setActiveProjectData = useDebounce(
  (name, year, link, image) => {
    homeStore.setActiveProjectData(name, year, link, image);
  },
  100
);

const clearActiveProjectData = useDebounce(() => {
  homeStore.clearActiveProjectData();
}, 100);

onUnmounted(() => {
  clearTimeout(hideTimeout);
  clearTimeout(preloaderTimeout);
  clearActiveProjectData();
});

onBeforeRouteLeave(() => {
  document.body.classList.remove("inverted");
});

const allPreviewMedia = computed(() =>
  allProjects.flatMap((project) => project.media)
);
</script>

<template>
  <Preloader v-if="shouldShowPreloader && !isMediaLoaded" class="preloader"/>
  <ul class="projects-list" v-show="isMediaLoaded">
    <ProjectItem
      v-for="project in allProjects"
      :key="project.number"
      :number="project.number"
      :slug="project.slug"
      :name="project.name"
      :year="project.year"
      :media="project.media"
      @setActiveProjectData="setActiveProjectData"
      @clearActiveProjectData="clearActiveProjectData"
    />
  </ul>

  <div class="fullscreen-preview" aria-hidden="true">
    <template v-for="media in allPreviewMedia" :key="media.src">
      <video
        v-if="media.type === 'video'"
        :src="media.src"
        autoplay
        muted
        loop
        playsinline
        class="preview-item"
        :class="{ active: isPreviewVisible && media.src === activeImage, inactive: media.src !== activeImage }"
      />
      <div
        v-else
        class="fullscreen-preview-image preview-item"
        :class="{ active: isPreviewVisible && media.src === activeImage, inactive: media.src !== activeImage }"
        :style="{ backgroundImage: `url(${media.src})` }"
      />
    </template>
  </div>
</template>

<style scoped>


.projects-list {
  display: grid;
  --item-size: var(--column-width);
  grid-template-columns: repeat(3, var(--item-size));
  grid-template-rows: repeat(3, var(--item-size));
  justify-content: center;
  align-content: center;
}

.fullscreen-preview-image.preview-item.inactive {
filter: invert(1) hue-rotate(180deg);
}

.fullscreen-preview {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-item {
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.preview-item.active {
  opacity: 1;
  z-index: 1;
  filter: invert(1) hue-rotate(180deg);
}

@media (max-width: 1024px) {
  .preloader {
    display: none;
  }
  .fullscreen-preview {
    display: none;
  }

  .projects-list {
    padding-top: 115px;
    --item-size: 34vmin;
  }

  .home-btn {
    padding: 0px 0px 57px 0px;
  }
}

@media (max-width: 1024px) and (max-height: 1366px) {
  .projects-list {
    padding-top: 100px;
    --item-size: 33vmin;
  }
}

@media (max-width: 1024px) and (max-height: 1150px) {
  .projects-list {
    padding-top: 75px;
    --item-size: 33vmin;
  }
}

@media (max-width: 768px) {
  .projects-list {
    padding-top: 72.5px;
    --item-size: 33vmin;
  }
}

@media (max-width: 768px) and (max-height: 960px) {
  .projects-list {
    padding-top: 20px;
    padding-bottom: 45px;
    --item-size: 30vmin;
  }
}

@media (max-width: 768px) and (max-height: 851px) {
  .projects-list {
    padding-top: 20px;
    padding-bottom: 45px;
    --item-size: 27vmin;
  }
}

@media (max-width: 768px) and (max-height: 715px) {
  .projects-list {
    padding-top: 10px;
  }
}

@media (max-width: 768px) and (max-height: 750px) {
  .projects-list {
    --item-size: 25vmin;
  }
}

@media (max-width: 500px) {
  .projects-list {
    --item-size: 33vmin;
    gap: 0 0;
    padding-top: 60px;
    padding-bottom: 0;
  }
}
</style>

<style>
@media (min-width: 1024px) {
  body {
    transition: filter 0s ease;
    will-change: filter;
  }

  body.inverted {
    filter: invert(1) hue-rotate(180deg);
    transition: filter 0.1s ease;
  }
}
</style>
