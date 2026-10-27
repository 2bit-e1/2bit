<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import ErrorMessage from "@/components/Project/ErrorMessage.vue";
import Info from "@/components/Info/Info.vue";
import Content from "@/components/Project/Content.vue";
import { useProjectStore } from "@/stores/project";
import allProjects from "@/data/projects/index.js";
import { getMotionDuration } from "@/utils/motion";

const props = defineProps({
  pageName: String,
});

const projectStore = useProjectStore();
const route = useRoute();
const router = useRouter();

const projectIndex = computed(() => allProjects.findIndex(project => project.slug === route.params.slug));
const project = computed(() => allProjects[projectIndex.value]);
const nextProject = computed(() => project.value && allProjects[projectIndex.value + 1]);
const previousProject = computed(() => project.value && allProjects[projectIndex.value - 1]);
const entryIndex = ref(0);
const entryDirection = ref(1);
let isNavigating = false;
let exitPromise;
let exitTimer;
let finishExit;

function resetProjectExit() {
  clearTimeout(exitTimer);
  finishExit?.();
  finishExit = null;
  exitPromise = null;
  projectStore.isLeavingProject = false;
}

async function leaveProject() {
  if (!projectStore.isGalleryReady) return;
  projectStore.isLeavingProject = true;
  projectStore.closeProjectInfo();
  if (!exitPromise) {
    exitPromise = new Promise(resolve => {
      finishExit = resolve;
      exitTimer = setTimeout(resolve, getMotionDuration('--motion-scene-exit-duration', 640));
    });
  }
  await exitPromise;
}

onBeforeRouteLeave(leaveProject);
const stopAfterEach = router.afterEach((_to, _from, failure) => {
  if (failure) resetProjectExit();
});

watch(project, (value, previous) => {
  resetProjectExit();
  const direction = previous && value && value.number < previous.number ? -1 : 1;
  entryDirection.value = direction;
  entryIndex.value = value && direction < 0 ? value.images.length - 1 : 0;
  projectStore.navigationDirection = direction;
  const keepPresentation = !!previous && window.innerWidth > 1024 && projectStore.isGalleryReady;
  projectStore.isGalleryReady = keepPresentation;
  projectStore.closeProjectInfo();
  if (value) {
    if (!keepPresentation) {
      projectStore.setProjectData(value);
      projectStore.setCurrentImage(entryIndex.value);
    }
  } else {
    projectStore.clearProjectData();
  }
}, { immediate: true });

function handleGalleryReady(index) {
  if (!project.value) return;
  if (projectStore.slug !== project.value.slug) projectStore.setProjectData(project.value);
  projectStore.setCurrentImage(Number.isInteger(index) ? index : entryIndex.value);
  projectStore.isGalleryReady = true;
}

async function navigateProject(direction) {
  const target = direction > 0 ? nextProject.value : previousProject.value;
  if (!target || isNavigating || projectStore.isInfoOpen) return;
  isNavigating = true;
  try {
    await router.push(`/projects/${target.slug}`);
  } finally {
    isNavigating = false;
  }
}

const documentKeyPressListener = (event) => {
  if (event.key === "Escape") {
    projectStore.closeProjectInfo();
  }
};

onMounted(() => {
  document.addEventListener("keydown", documentKeyPressListener);
});

onUnmounted(() => {
  stopAfterEach();
  resetProjectExit();
  projectStore.clearProjectData();

  document.removeEventListener("keydown", documentKeyPressListener);
});
</script>

<template>
  <ErrorMessage v-if="!project" />
  <template v-else>
    <Info :pageName="pageName" :content="project.content" />
    <Content :projectKey="project.slug" :imagesSrc="project.images" :hasNextProject="!!nextProject"
      :hasPreviousProject="!!previousProject" :entryIndex="entryIndex" :entryDirection="entryDirection"
      :isLeaving="projectStore.isLeavingProject" @ready="handleGalleryReady"
      @navigateProject="navigateProject" />
  </template>
</template>

<style scoped></style>
