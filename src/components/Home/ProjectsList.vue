<script setup>
import allProjects from "@/data/projects/index.js";
import ProjectItem from "@/components/Home/ProjectItem.vue";
import { onUnmounted } from "vue";
import { useHomeStore } from "@/stores/home";
import { useDebounce } from "@/utils/useDebounce";

const homeStore = useHomeStore();

const setActiveProjectData = useDebounce(homeStore.setActiveProjectData, 200);
const clearActiveProjectData = useDebounce(homeStore.clearActiveProjectData, 200);

onUnmounted(() => {
  homeStore.clearActiveProjectData();
})
</script>

<template>
  <ul class="projects-list">
    <ProjectItem
      v-for="project in allProjects"
      :number="project.number"
      :slug="project.slug"
      :name="project.name"
      :year="project.year"
      :key="project.number"
      @setActiveProjectData="setActiveProjectData"
      @clearActiveProjectData="clearActiveProjectData"
    />
  </ul>
</template>

<style scoped>
.projects-list {
  height: 100%;
  display: grid;
  --item-size: var(--column-width);
  grid-template-columns: repeat(3, var(--item-size));
  grid-template-rows: repeat(3, var(--item-size));
  justify-content: center;
  align-content: center;
}

@media (max-width: 1024px) {
  .projects-list {
    --item-size: 33vmin;
  }

  .project-item {
    
  }
}
</style>
