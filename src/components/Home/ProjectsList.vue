<script setup>
import allProjects from "@/data/projects/index.js";
import ProjectItem from "@/components/Home/ProjectItem.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useHomeStore } from "@/stores/home";
import { useDebounce } from "@/utils/useDebounce";

const isDesktop = ref(false);
const checkIsDesktop = () => {
  isDesktop.value = window.innerWidth > 1024;
};

onMounted(() => {
  // Предзагрузка всех медиафайлов
  allProjects.forEach(project => {
    project.media.forEach(media => {
      if (media.type === 'image') {
        const img = new Image();
        img.src = media.src;
      } else if (media.type === 'video') {
        const video = document.createElement('video');
        video.src = media.src;
        video.preload = 'auto';
      }
    });
  });

  checkIsDesktop();
  window.addEventListener("resize", checkIsDesktop);
});

const homeStore = useHomeStore();

const setActiveProjectData = useDebounce(
  (name, year, link, image) => {
    homeStore.setActiveProjectData(name, year, link, image);
    document.body.classList.add("inverted"); // инверсия при появлении
  },
  200
);

const clearActiveProjectData = useDebounce(() => {
  homeStore.clearActiveProjectData();
  document.body.classList.remove("inverted"); // убрать инверсию
}, 200);

onUnmounted(() => {
  clearActiveProjectData();
});

</script>

<template>
  <ul class="projects-list">
    <!-- <ProjectItem
      v-for="project in allProjects"
      :key="project.number"
      :number="project.number"
      :slug="project.slug"
      :name="project.name"
      :year="project.year"
      @setActiveProjectData="setActiveProjectData"
      @clearActiveProjectData="clearActiveProjectData"
    /> -->
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

  <!-- <div
    class="fullscreen-preview"
    v-if="homeStore.activeProjectImage && isDesktop"
    :style="{ backgroundImage: url(${homeStore.activeProjectImage}) }"
  /> -->
  <div v-if="homeStore.activeProjectImage && isDesktop" class="fullscreen-preview">
    <template v-if="homeStore.activeProjectImage.endsWith('.mp4')">
      <video :src="homeStore.activeProjectImage" autoplay muted loop playsinline />
    </template>
    <template v-else>
      <div
        v-if="homeStore.activeProjectImage && isDesktop"
        class="fullscreen-preview-image"
        :style="{ backgroundImage: `url(${homeStore.activeProjectImage})` }"
      />
    </template>
  </div>
</template>

<style scoped>

/* .fullscreen-preview-image {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  animation: fadeIn .2s forwards;
  pointer-events: none;

  filter: invert(1) hue-rotate(180deg);
} */

.fullscreen-preview video {
  width: 100vw;
  height: auto;
  aspect-ratio: 16 / 9;
  max-height: 100vh;
  object-fit: cover;

}

.fullscreen-preview video,
.fullscreen-preview-image {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  animation: fadeIn .2s forwards;
  pointer-events: none;

  filter: invert(1) hue-rotate(180deg);
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

<style>

  body {
    transition: filter 0s ease;
    will-change: filter;
  }

  body.inverted {
    filter: invert(1) hue-rotate(180deg);
    transition: filter 0.1s ease;
  }
</style>