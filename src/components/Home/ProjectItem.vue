<script setup>
import { RouterLink, useRouter } from "vue-router";
import Video from "../Video.vue";
import * as AllNumbers from "@/assets/svgs/project-numbers/index.js";
import { useHomeStore } from "@/stores/home";
import { getDelayByNumber } from "./utils";
import { useMobileProjectItemListeners } from "./hooks";
import { computed, ref } from "vue";
// import * as svgNumbers from '@/assets/svgs/project-numbers';

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
const projectLink = computed(() => `/projects/${props.slug}`)

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

const { handleClick } = useMobileProjectItemListeners(
  projectItemElRef,
  handleSetActiveProjectData,
  handleClearActiveProjectData
);
</script>

<template>
  <li class="project-item">
    <component
      :is="!isMobile ? 'router-link' : 'a'"
      class="link project-item-link"
      :to="projectLink"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      @click.native.prevent="handleClick"
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
        <div class="preview-image">
          <img src="/images/image.png" alt="" />

          <!-- <Video v-if="name == 'Refmodel'" :videoSrc="`/video.webm`" :isPlaying="homeStore.activeProjectName == name" />
          <img v-else src="/images/image.png" alt="" /> -->
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
  padding: 10px;
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

.number-svg {
  stroke: var(--clr-black);

  --stroke-duration: 300ms;
  --translate-duration: 300ms;
  --translate-delay: 0ms;
  --scale-duration: 300ms;
  --scale-delay: 0ms;
  transition: stroke var(--stroke-duration),
    translate var(--translate-duration) var(--translate-delay)
      var(--timing-func-2),
    scale var(--scale-duration) var(--scale-delay) var(--timing-func-1);
}

.number-svg-container {
  display: inline-block;
  --appear-delay: 0ms;
  --appear-default-delay: v-bind(appearDelay);
  --appear-duration: 300ms;
  translate: 0 15px;
  scale: 0.5;
  animation: number-appear var(--appear-duration)
    calc(var(--appear-default-delay) + var(--appear-delay)) var(--timing-func-1)
    forwards;
}

.number-svg-container:nth-child(1) {
  --appear-delay: 0ms;
}

.number-svg-container:nth-child(2) {
  --appear-delay: 100ms;
}

.number_dim .number-svg {
  stroke: var(--clr-gray);
}

.project-item:hover .number-svg {
  translate: 0 -15px;
  scale: 0.8;
}

.number-svg-container:nth-child(1) .number-svg {
  --scale-delay: 330ms;
  --translate-delay: 230ms;
}

.project-item:hover .number-svg-container:nth-child(1) .number-svg {
  --scale-delay: 0ms;
  --translate-delay: 100ms;
}

.number-svg-container:nth-child(2) .number-svg {
  --scale-delay: 230ms;
  --translate-delay: 130ms;
}

.project-item:hover .number-svg-container:nth-child(2) .number-svg {
  --scale-delay: 100ms;
  --translate-delay: 200ms;
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

.preview-image {
  position: absolute;
  pointer-events: none;
  overflow: hidden;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  --top-duration: 500ms;
  --top-delay: 0ms;
  transition: top var(--top-duration) var(--top-delay) var(--timing-func-2);
}

.preview-image img {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  object-fit: cover;
  object-position: center;
  scale: 1.2;
  --scale-duration: 400ms;
  --scale-delay: 0ms;
  transition: scale var(--scale-duration) var(--scale-delay)
    var(--timing-func-1);
}

.project-item:hover .preview-image {
  top: 0;
  --top-delay: 260ms;
}

.project-item:hover .preview-image img {
  scale: 1;
  --scale-delay: 260ms;
}

.preview-image video {
  object-fit: contain;
  width: 100%;
}

@media (max-width: 768px) {
  a.project-item-link {
    padding: 4px;
  }
}
</style>
