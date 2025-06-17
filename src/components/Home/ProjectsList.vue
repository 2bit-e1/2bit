<script setup>
import allProjects from "@/data/projects/index.js";
import ProjectItem from "@/components/Home/ProjectItem.vue";
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useHomeStore } from "@/stores/home";
import { useDebounce } from "@/utils/useDebounce";
import { onBeforeRouteLeave } from 'vue-router';

const isDesktop = ref(false);
const checkIsDesktop = () => {
  isDesktop.value = window.innerWidth > 1024;
};

onMounted(() => {
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

const activeImage = computed(() => homeStore.activeProjectImage);
const isPreviewVisible = ref(false);

// Управляемый переход: сначала активируем, потом плавно скрываем
let hideTimeout;

watch(activeImage, (newVal, oldVal) => {
  clearTimeout(hideTimeout);
  if (newVal) {
    isPreviewVisible.value = true;
    document.body.classList.add("inverted");
  } else {
    hideTimeout = setTimeout(() => {
      isPreviewVisible.value = false;
    }, 300); // время исчезновения
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
  clearActiveProjectData();
});

onBeforeRouteLeave(() => {
  document.body.classList.remove('inverted');
});
</script>

<template>
  <ul class="projects-list">
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

  <Transition name="preview-fade" appear>
    <div
      v-if="isPreviewVisible && activeImage"
      class="fullscreen-preview"
      aria-hidden="false"
    >
      <template v-if="activeImage.endsWith('.mp4')">
        <video :src="activeImage" autoplay muted loop playsinline />
      </template>
      <template v-else>
        <div
          class="fullscreen-preview-image"
          :style="{ backgroundImage: `url(${activeImage})` }"
        />
      </template>
    </div>
  </Transition>
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

.fullscreen-preview {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: invert(1) hue-rotate(180deg) !important;
  transition: filter 0.1s ease;
}

.fullscreen-preview video,
.fullscreen-preview-image {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Transition animations */
.preview-fade-enter-active {
  animation: fadeIn 0.4s ease forwards;
}
.preview-fade-leave-active {
  animation: fadeOut 0.3s ease forwards;
}

/* Адаптивы оставлены как были */
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
  .fullscreen-preview {
    display: none;
  }
  
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(1.2);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
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
