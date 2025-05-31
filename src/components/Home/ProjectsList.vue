<script setup>
import allProjects from "@/data/projects/index.js";
import ProjectItem from "@/components/Home/ProjectItem.vue";
import { onBeforeMount, onUnmounted } from "vue";
import { useHomeStore } from "@/stores/home";
import { useDebounce } from "@/utils/useDebounce";
import { ref, onMounted } from "vue";

const isDesktop = ref(false);

const checkIsDesktop = () => {
  isDesktop.value = window.innerWidth > 1024;
};

onMounted(() => {
  checkIsDesktop();
  window.addEventListener("resize", checkIsDesktop);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkIsDesktop);
});

const homeStore = useHomeStore();

const setActiveProjectData = useDebounce(
  (name, year, link, image) => {
    homeStore.setActiveProjectData(name, year, link, image);
  },
  200
);
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
  <div
    class="fullscreen-preview"
    v-if="homeStore.activeProjectImage && isDesktop"
    :style="{ backgroundImage: `url(${homeStore.activeProjectImage})` }"
  />
</template>

<style scoped>

.fullscreen-preview {
  position: fixed;
  inset: 0;
  z-index: -1; /* теперь ПОД всеми элементами */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  animation: fadeIn 0.4s forwards;
  pointer-events: none;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

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


@media (max-width: 500px)  {
  .projects-list {
    --item-size: 33vmin;
    gap: 0 0;
    padding-top: 60px;
    padding-bottom: 0;
  }
}
</style>
