<script setup>
import allProjects from "@/data/projects/index.js";
import ProjectItem from "@/components/Home/ProjectItem.vue";
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useHomeStore } from "@/stores/home";
import { useDebounce } from "@/utils/useDebounce";
import { onBeforeRouteLeave } from 'vue-router';
import Preloader from "@/components/Preloader.vue";

const PRELOADER_MIN_DURATION = 3000;
const PRELOADER_MAX_DURATION = 30000;
const allPreviewMedia = allProjects.flatMap((project) => project.media);
const readyPreviewMedia = new Set();

const hasVisited = () => {
  try {
    return sessionStorage.getItem("hasVisited") === "true";
  } catch {
    return false;
  }
};

const rememberVisit = () => {
  try {
    sessionStorage.setItem("hasVisited", "true");
  } catch {
    // The page still works when session storage is unavailable.
  }
};

const shouldShowInitialPreloader =
  typeof window !== "undefined" &&
  window.innerWidth > 1024 &&
  !hasVisited();
const isMediaLoaded = ref(!shouldShowInitialPreloader);
const shouldShowPreloader = ref(shouldShowInitialPreloader);
let minimumDurationElapsed = !shouldShowInitialPreloader;
let minimumDurationTimeout = null;
let maximumDurationTimeout = null;

const revealProjects = () => {
  if (isMediaLoaded.value) return;

  isMediaLoaded.value = true;
  shouldShowPreloader.value = false;
  rememberVisit();
  clearTimeout(minimumDurationTimeout);
  clearTimeout(maximumDurationTimeout);
};

const revealProjectsWhenReady = () => {
  if (
    shouldShowInitialPreloader &&
    minimumDurationElapsed &&
    readyPreviewMedia.size >= allPreviewMedia.length
  ) {
    revealProjects();
  }
};

const markPreviewReady = (src) => {
  readyPreviewMedia.add(src);
  revealProjectsWhenReady();
};


onMounted(() => {
  if (shouldShowInitialPreloader) {
    minimumDurationTimeout = setTimeout(() => {
      minimumDurationElapsed = true;
      revealProjectsWhenReady();
    }, PRELOADER_MIN_DURATION);

    maximumDurationTimeout = setTimeout(revealProjects, PRELOADER_MAX_DURATION);
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
  clearTimeout(minimumDurationTimeout);
  clearTimeout(maximumDurationTimeout);
  clearActiveProjectData();
});

onBeforeRouteLeave(() => {
  document.body.classList.remove("inverted");
});

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
        preload="auto"
        class="preview-item"
        :class="{ active: isPreviewVisible && media.src === activeImage, inactive: media.src !== activeImage }"
        @loadeddata="markPreviewReady(media.src)"
        @error="markPreviewReady(media.src)"
      />
      <img
        v-else
        :src="media.src"
        alt=""
        loading="eager"
        decoding="async"
        class="fullscreen-preview-image preview-item"
        :class="{ active: isPreviewVisible && media.src === activeImage, inactive: media.src !== activeImage }"
        @load="markPreviewReady(media.src)"
        @error="markPreviewReady(media.src)"
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
@media (min-width: 1025px) {
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
