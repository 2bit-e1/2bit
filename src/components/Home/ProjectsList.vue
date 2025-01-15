<script setup>
import allProjects from "@/data/projects/index.js";
import ProjectItem from "@/components/Home/ProjectItem.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useHomeStore } from "@/stores/home";
import { useDebounce } from "@/utils/useDebounce";

const homeStore = useHomeStore();

const setActiveProjectData = useDebounce(homeStore.setActiveProjectData, 200);
const clearActiveProjectData = useDebounce(homeStore.clearActiveProjectData, 200);

const isSwipe = ref(false); // Флаг для определения свайпа

// Начальная точка касания
let startX = 0;
let startY = 0;

// Обработчики для touch событий
const handleTouchStart = (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  isSwipe.value = false; // Сбрасываем флаг свайпа
};

const handleTouchMove = (e) => {
  const diffX = Math.abs(e.touches[0].clientX - startX);
  const diffY = Math.abs(e.touches[0].clientY - startY);

  // Если движение значительное, это свайп
  if (diffX > 10 || diffY > 10) {
    isSwipe.value = true;
  }
};

const handleTouchEnd = (e) => {
  // Если это свайп, предотвращаем клик
  if (isSwipe.value) {
    e.preventDefault();
    e.stopPropagation();
  }
};

// Подключаем обработчики событий
onMounted(() => {
  const list = document.querySelector(".projects-list");
  list.addEventListener("touchstart", handleTouchStart);
  list.addEventListener("touchmove", handleTouchMove);
  list.addEventListener("touchend", handleTouchEnd);
});

// Отключаем обработчики при удалении компонента
onUnmounted(() => {
  const list = document.querySelector(".projects-list");
  list.removeEventListener("touchstart", handleTouchStart);
  list.removeEventListener("touchmove", handleTouchMove);
  list.removeEventListener("touchend", handleTouchEnd);
  clearActiveProjectData();
});
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

@media (max-width: 1024px) {
  .projects-list {
    --item-size: 27vmin;
  }
}

@media (max-width: 500px) {
  .projects-list {
    --item-size: 33vmin;
  }
}
</style>
