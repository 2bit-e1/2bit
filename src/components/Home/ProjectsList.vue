<script setup>
import allProjects from "@/data/projects/index.js";
import ProjectItem from "@/components/Home/ProjectItem.vue";
import { onBeforeMount, onUnmounted } from "vue";
import { useHomeStore } from "@/stores/home";
import { useDebounce } from "@/utils/useDebounce";

const homeStore = useHomeStore();

const setActiveProjectData = useDebounce(homeStore.setActiveProjectData, 200);
const clearActiveProjectData = useDebounce(homeStore.clearActiveProjectData, 200);

onUnmounted(() => {
  clearActiveProjectData();
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
  
  display: grid;
  --item-size: var(--column-width);
  grid-template-columns: repeat(3, var(--item-size));
  grid-template-rows: repeat(3, var(--item-size));
  justify-content: center;
  align-content: center;
 
}

@media (max-width: 1024px)  {
  .header {
    padding-top: 54px;
  }

  .projects-list {
    padding-top: 115px;
    --item-size: 33vmin;   
  }

  .home-btn {
    padding: 0px 0px 57px 0px;
  }
}

@media (max-width: 768px) {
  .projects-list {
    padding-top: 72.5px;
    --item-size: 33vmin;   
  }
}

@media (max-width: 500px)  {
  .projects-list {
    --item-size: 33vmin;
    gap: 0 0;
  }
}
</style>
