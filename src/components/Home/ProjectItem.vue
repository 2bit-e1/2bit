<script setup>
import { useRouter } from "vue-router";
import * as AllNumbers from "@/assets/svgs/project-numbers/index.js";
import { useHomeStore } from "@/stores/home";
import { getDelayByNumber } from "./utils";
import { ref, computed } from "vue";

const props = defineProps({
  number: Number,
  slug: String,
  name: String,
  year: Number,
});

const emit = defineEmits(["setActiveProjectData", "clearActiveProjectData"]);

const homeStore = useHomeStore();
const projectItemElRef = ref(null);
const Number_0 = AllNumbers[`Number_0`];
const Number_comp = AllNumbers[`Number_${props.number}`];
const isMobile = window.innerWidth <= 1024;
const appearDelay = getDelayByNumber(props.number) + "ms";
const router = useRouter();
const projectLink = computed(() => `/projects/${props.slug}`);

const showImage = ref(false);

// Флаг для предотвращения избыточных переходов
const isProcessing = ref(false);
const isScrolling = ref(false); // Флаг для отслеживания скролла

// Обработчик начала прокрутки
const handleTouchStart = (event) => {
  isScrolling.value = false; // Сбрасываем флаг при начале тапа
};

// Обработчик прокрутки
const handleTouchMove = (event) => {
  isScrolling.value = true; // Если происходит прокрутка, ставим флаг
};

const handleSetActiveProjectData = () => {
  if (homeStore.activeProjectLink == projectLink.value) {
    router.push(projectLink.value);
  } else {
    emit("setActiveProjectData", props.name, props.year, projectLink.value);
  }
};

const handleClearActiveProjectData = () => {
  emit("clearActiveProjectData");
};

const handleMouseenter = () => {
  handleSetActiveProjectData();
};

const handleMouseleave = () => {
  handleClearActiveProjectData();
};

// Обработка перехода при клике
const handleClick = () => {
  if (isProcessing.value || isScrolling.value) return; // Если идет прокрутка, не выполняем переход

  isProcessing.value = true; // Устанавливаем флаг, чтобы предотвратить повторный переход

  if (isMobile) {
    // Если это мобильное устройство, показываем анимацию и блокируем переход на 500ms
    showImage.value = false;

    // Даем 500 мс для анимации, перед тем как перейти
    setTimeout(() => {
      router.push(projectLink.value);
    }, 1000); // Переход после задержки
  } else {
    handleSetActiveProjectData(); // Для десктопа вызываем сразу
  }

  // Сбрасываем флаг после небольшого времени
  setTimeout(() => {
    isProcessing.value = false;
  }, 500); // Таймаут 500 мс
};
</script>

<template>
  <li class="project-item">
    <component
      :is="!isMobile ? 'router-link' : 'a'"
      class="link project-item-link"
      :to="projectLink"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      @click="handleClick"
      @touchstart="handleTouchStart" 
      @touchmove="handleTouchMove" 
      @touchend="handleClick" 
      ref="projectItemElRef"
    >
      <div class="item-inner">
        <h2
          class="number"
          :class="{
            number_dim:
              homeStore.activeProjectName &&
              homeStore.activeProjectName != name,
          }"
        >
          <span class="number-svg-container">
            <component class="number-svg" :is="Number_0"></component>
          </span>
          <span class="number-svg-container">
            <component class="number-svg" :is="Number_comp"></component>
          </span>
        </h2>
        <div :class="['preview-image', { show: showImage }]">
          <img src="/images/image.png" alt="" />
        </div>
      </div>
    </component>
  </li>
</template>

<style scoped>
a.project-item-link {
  border: 1px solid transparent;
  display: block;
  width: 100%;
  height: 100%;
  padding: 5px;
  --border-delay: 300ms;
  transition: border 200ms var(--border-delay);
}

.project-item-link:hover {
  --border-delay: 0ms;
  border: 1px solid #e0e0e0;
}

.item-inner {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number {
  overflow: hidden;
}

.number_gray {
  stroke: var(--clr-gray);
}

.number-svg {
  stroke: var(--clr-black);
  transition: stroke 300ms, transform 300ms;
}

.number-svg-container {
  display: inline-block;
  animation: number-appear 300ms forwards;
}

.number_dim .number-svg {
  stroke: var(--clr-gray);
}

.project-item:hover .number-svg {
  transform: scale(0.8);
}

.preview-image {
  position: absolute;
  pointer-events: none;
  overflow: hidden;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: top 500ms, opacity 500ms;
}

.preview-image.show {
  top: 0;
  opacity: 1;
}

@keyframes number-appear {
  from {
    transform: translateY(15px) scale(0.5);
  }
  to {
    transform: translateY(0) scale(1);
  }
}
</style>
