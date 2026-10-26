<script setup>
import { useRouter } from "vue-router";
import * as AllNumbers from "@/assets/svgs/project-numbers/index.js";
import { useHomeStore } from "@/stores/home";
import { getDelayByNumber } from "./utils";
import { computed } from "vue";

const props = defineProps({
  number: Number,
  slug: String,
  name: String,
  year: Number,
  media: Array, // [{ type: 'image' | 'video', src: string }]
});

const emit = defineEmits(["setActiveProjectData", "clearActiveProjectData"]);

const homeStore = useHomeStore();

const router = useRouter();


const projectLink = computed(() => `/projects/${props.slug}`);
const Number_0 = AllNumbers["Number_0"];
const Number_comp = AllNumbers[`Number_${props.number}`];

const appearDelay = getDelayByNumber(props.number) + "ms";

const handleSetActiveProjectData = () => {
  if (!window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine)").matches) return;
  const preview = props.media.find(item => item.type !== "video")?.src || props.media[0]?.src || "";
  emit("setActiveProjectData", props.name, props.year, projectLink.value, preview);
};

const handleClearActiveProjectData = () => {
  emit("clearActiveProjectData");
};

const handleClick = () => {
  router.push(projectLink.value);
};



</script>

<template>
  <li class="project-item">
    <component
      :is="'a'"
      class="link project-item-link"
      :href="projectLink"
      :aria-label="name"
      tabindex="0"
      @mouseenter="handleSetActiveProjectData"
      @mouseleave="handleClearActiveProjectData"
      @focus="handleSetActiveProjectData"
      @blur="handleClearActiveProjectData"
      @click.prevent="handleClick"
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
  border: none !important;
  cursor: pointer;
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
  transition: stroke 150ms ease-out;
}

.number-svg-container {
  display: inline-block;
  animation: number-appear var(--motion-label-duration) var(--appear-default-delay) var(--motion-ease-reveal) both;
}

.number-svg-container:nth-child(2) {
  animation-delay: calc(var(--appear-default-delay) + 35ms);
}

.number_dim .number-svg {
  stroke: var(--clr-gray);
}

@keyframes number-appear {
  0% {
    opacity: 0;
    transform: translate3d(0, 105%, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .number-svg-container {
    animation: none;
  }
}
</style>
