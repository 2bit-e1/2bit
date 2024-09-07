<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import ErrorMessage from "@/components/Project/ErrorMessage.vue";
import Info from "@/components/Info/Info.vue";
import Content from "@/components/Project/Content.vue";
import { useProjectStore } from "@/stores/project";
import allProjects from "@/data/projects/index.js";

const props = defineProps({
  pageName: String,
});

const projectStore = useProjectStore();
const route = useRoute();

const slug = route.params.slug;
const project = allProjects.find((project) => project.slug == slug);

projectStore.setProjectData(project);

const isError = !project;

const documentKeyPressListener = (event) => {
  if (event.key === "Escape") {
    projectStore.closeProjectInfo();
  }
};

onMounted(() => {
  document.addEventListener("keydown", documentKeyPressListener);
});

onUnmounted(() => {
  projectStore.clearProjectData();

  document.removeEventListener("keydown", documentKeyPressListener);
});
</script>

<template>
  <ErrorMessage v-if="isError" />
  <template v-else>
    <Info :pageName="pageName" :content="project.content" />
    <Content :imagesSrc="project.images" />
  </template>
</template>

<style scoped></style>
