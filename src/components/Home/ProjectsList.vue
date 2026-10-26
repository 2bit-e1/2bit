<script setup>
import allProjects from "@/data/projects/index.js";
import ProjectItem from "@/components/Home/ProjectItem.vue";
import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";
import { useHomeStore } from "@/stores/home";
import { onBeforeRouteLeave } from "vue-router";
import Preloader from "@/components/Preloader.vue";

const PRELOADER_MIN_DURATION = 3000;
const PRELOADER_MAX_DURATION = 30000;
const previewQuery = window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine)");
const canPreview = ref(previewQuery.matches);
const allPreviewMedia = allProjects.flatMap((project) => project.media);
const readyPreviewMedia = reactive(new Set());
const settledPreviewMedia = new Set();
const previewVideos = new Map();

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
    // Session storage is optional in private or restricted browser contexts.
  }
};

const shouldShowInitialPreloader = canPreview.value && !hasVisited();
const isMediaLoaded = ref(!shouldShowInitialPreloader);
const shouldShowPreloader = ref(shouldShowInitialPreloader);
let minimumDurationElapsed = !shouldShowInitialPreloader;
let minimumDurationTimeout;
let maximumDurationTimeout;
let leaveTimeout;

function revealProjects() {
  if (isMediaLoaded.value) return;
  isMediaLoaded.value = true;
  shouldShowPreloader.value = false;
  rememberVisit();
  clearTimeout(minimumDurationTimeout);
  clearTimeout(maximumDurationTimeout);
}

function revealProjectsWhenReady() {
  if (minimumDurationElapsed && settledPreviewMedia.size >= allPreviewMedia.length) {
    revealProjects();
  }
}

function markPreviewReady(src) {
  readyPreviewMedia.add(src);
  settledPreviewMedia.add(src);
  revealProjectsWhenReady();
}

function markPreviewFailed(src) {
  settledPreviewMedia.add(src);
  revealProjectsWhenReady();
}

function setPreviewVideo(src, element) {
  if (element) previewVideos.set(src, element);
  else previewVideos.delete(src);
}

const homeStore = useHomeStore();
const activeImage = computed(() => homeStore.activeProjectImage);
const displayedSource = ref(null);
const isPreviewVisible = ref(false);

watch(
  () => [activeImage.value, readyPreviewMedia.has(activeImage.value), canPreview.value],
  ([src, isReady, enabled]) => {
    if (src && enabled) {
      if (isReady) {
        displayedSource.value = src;
        isPreviewVisible.value = true;
        document.body.classList.add("inverted");
      }
    } else {
      isPreviewVisible.value = false;
      document.body.classList.remove("inverted");
    }
  }
);

function syncPreviewPlayback() {
  previewVideos.forEach((video, src) => {
    if (src === displayedSource.value && isPreviewVisible.value && !document.hidden) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

watch([displayedSource, isPreviewVisible], syncPreviewPlayback, { flush: "post" });

function setActiveProjectData(name, year, link, image) {
  clearTimeout(leaveTimeout);
  homeStore.setActiveProjectData(name, year, link, image);
}

function clearActiveProjectData() {
  clearTimeout(leaveTimeout);
  leaveTimeout = setTimeout(() => homeStore.clearActiveProjectData(), 80);
}

function updatePreviewMode(event) {
  canPreview.value = event.matches;
  if (!event.matches) {
    homeStore.clearActiveProjectData();
    revealProjects();
  }
}

onMounted(() => {
  previewQuery.addEventListener("change", updatePreviewMode);
  document.addEventListener("visibilitychange", syncPreviewPlayback);
  if (shouldShowInitialPreloader) {
    minimumDurationTimeout = setTimeout(() => {
      minimumDurationElapsed = true;
      revealProjectsWhenReady();
    }, PRELOADER_MIN_DURATION);
    maximumDurationTimeout = setTimeout(revealProjects, PRELOADER_MAX_DURATION);
  }
});

function resetPreview() {
  clearTimeout(leaveTimeout);
  homeStore.clearActiveProjectData();
  document.body.classList.remove("inverted");
  previewVideos.forEach((video) => video.pause());
}

onBeforeRouteLeave(resetPreview);

onUnmounted(() => {
  resetPreview();
  clearTimeout(minimumDurationTimeout);
  clearTimeout(maximumDurationTimeout);
  previewQuery.removeEventListener("change", updatePreviewMode);
  document.removeEventListener("visibilitychange", syncPreviewPlayback);
});
</script>

<template>
  <Transition name="preloader-fade">
    <Preloader v-if="shouldShowPreloader && !isMediaLoaded" class="preloader" />
  </Transition>
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

  <div v-if="canPreview" class="fullscreen-preview" aria-hidden="true">
    <template v-for="media in allPreviewMedia" :key="media.src">
      <video
        v-if="media.type === 'video'"
        :ref="(element) => setPreviewVideo(media.src, element)"
        :src="media.src"
        muted
        loop
        playsinline
        preload="auto"
        class="preview-item"
        :class="{ active: isPreviewVisible && media.src === displayedSource }"
        @loadeddata="markPreviewReady(media.src)"
        @error="markPreviewFailed(media.src)"
      />
      <img
        v-else
        :src="media.src"
        alt=""
        loading="eager"
        decoding="async"
        class="fullscreen-preview-image preview-item"
        :class="{ active: isPreviewVisible && media.src === displayedSource }"
        @load="markPreviewReady(media.src)"
        @error="markPreviewFailed(media.src)"
      />
    </template>
  </div>
</template>

<style scoped>


.projects-list {
  position: relative;
  z-index: 1;
  display: grid;
  --item-size: var(--column-width);
  grid-template-columns: repeat(3, var(--item-size));
  grid-template-rows: repeat(3, var(--item-size));
  justify-content: center;
  align-content: center;
}

.fullscreen-preview {
  position: fixed;
  inset: 0;
  z-index: 0;
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
  transform: scale(1.035);
  transition:
    opacity var(--motion-preview-fade) ease-out,
    transform var(--motion-media-duration) var(--motion-ease-reveal);
  z-index: 0;
}

.preview-item.active {
  opacity: 1;
  z-index: 1;
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .preview-item,
  .preview-item.active {
    transform: none;
    transition: none;
  }
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
    transition: background-color var(--motion-exit-duration) ease-out;
  }

  body.inverted {
    --clr-black: #f8f8f8;
    --clr-gray: #b8b8b8;
    background-color: #080808;
  }

  body.inverted .home-eyes {
    filter: invert(1);
  }
}

</style>
