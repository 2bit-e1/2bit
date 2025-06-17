<script setup>
import { useRouter } from "vue-router";
import * as AllNumbers from "@/assets/svgs/project-numbers/index.js";
import { useHomeStore } from "@/stores/home";
import { getDelayByNumber } from "./utils";
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  number: Number,
  slug: String,
  name: String,
  year: Number,
  media: Array, // [{ type: 'image' | 'video', src: string }]
});

const emit = defineEmits(["setActiveProjectData", "clearActiveProjectData"]);

const homeStore = useHomeStore();

const isMobile = ref(false);

onMounted(() => {
  isMobile.value = window.innerWidth <= 1024;
});

const router = useRouter();


const projectLink = computed(() => `/projects/${props.slug}`);
const Number_0 = AllNumbers["Number_0"];
const Number_comp = AllNumbers[`Number_${props.number}`];

const appearDelay = getDelayByNumber(props.number) + "ms";

const handleSetActiveProjectData = () => {

  if (homeStore.activeProjectLink === projectLink.value) {
    router.push(projectLink.value);
  } else {
    const preview = props.media.find(item => item.type === "image")?.src || props.media[0]?.src || "";
    emit("setActiveProjectData", props.name, props.year, projectLink.value, preview);
  }
};

const handleClearActiveProjectData = () => {
  emit("clearActiveProjectData");
};

const handleClick = () => {
  handleSetActiveProjectData(); // всегда вызываем, чтобы показать хедер

  if (isMobile.value) {
    // ждём 1 секунду и переходим
    setTimeout(() => {
      router.push(projectLink.value);
    }, 1000);
  } else {
    // На десктопе: если уже активен этот проект — переход
    if (homeStore.activeProjectLink === projectLink.value) {
      router.push(projectLink.value);
    }
  }
};


const handleTouchStart = () => {
  if (isMobile.value) {
    handleClick();
  }
};
</script>

<template>
  <li class="project-item">
    <component
      :is="!isMobile.value ? 'router-link' : 'a'"
      class="link project-item-link"
      :to="!isMobile.value ? projectLink : undefined"
      @mouseenter="handleSetActiveProjectData"
      @mouseleave="handleClearActiveProjectData"
      @click.prevent="handleClick"
      @touchstart.prevent="handleTouchStart"
      preload="auto"
    >
      <div class="item-inner">
        <h2
          class="number"
          :class="{ number_dim: homeStore.activeProjectName && homeStore.activeProjectName !== props.name }"
        >
          <span class="number-svg-container" :style="{ '--appear-default-delay': appearDelay }">
            <component class="number-svg" :is="Number_0" />
          </span>
          <span class="number-svg-container" :style="{ '--appear-default-delay': appearDelay }">
            <component class="number-svg" :is="Number_comp" />
          </span>
        </h2>
      </div>
    </component>
  </li>
</template>

<style scoped>
a.project-item-link {
  display: block;
  width: 100%;
  height: 100%;
  padding: 5px;
  /* Удаляем обводку */
  border: none !important;
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

.number-svg {
  stroke: var(--clr-black);
  transition: stroke 300ms, translate 300ms var(--timing-func-2), scale 300ms var(--timing-func-1);
}

.number-svg-container {
  display: inline-block;
  animation: number-appear 300ms var(--appear-default-delay) var(--timing-func-1) forwards;
  translate: 0 15px;
  scale: 0.5;
}

.number-svg-container:nth-child(2) {
  animation-delay: calc(var(--appear-default-delay) + 100ms);
}

.number_dim .number-svg {
  stroke: var(--clr-gray);
}

@keyframes number-appear {
  0% {
    translate: 0 15px;
    scale: 0.5;
  }
  100% {
    translate: 0 0;
    scale: 1;
  }
}
</style>