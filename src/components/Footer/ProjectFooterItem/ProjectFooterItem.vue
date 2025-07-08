<script setup>
import { computed } from "vue";
import { useProjectStore } from "@/stores/project";
import AppearWord from "@/components/Appear/AppearWord.vue";
import AppearWords from "@/components/Appear/AppearWords.vue";
import CounterItem from "./CounterItem.vue";
import LinkArrowIcon from "@/assets/svgs/link-arrow.svg";

const props = defineProps({
  isActive: Boolean,
});

const isMobile = window.innerWidth <= 1024;

const projectStore = useProjectStore();
const isImagesCountVisible = computed(() => !projectStore.isInfoOpen);
const isExternalLink = computed(() =>
  projectStore.link?.startsWith("http")
);
const projectName = computed(() => projectStore.name || "");
const projectYear   = computed(() => {        // ← добавили вычисление
  // выводим две последние цифры, чтобы было ‘23, ‘28 и т.‑д.
  const y = projectStore.year
  return typeof y === "number" ? `‘${y.toString().padStart(2, "0")}` : ""
})
</script>

<template>
  <div
    class="footer-item footer-item_project"
    :class="{
      'footer-item_active': isActive,
    }"
    :aria-hidden="!isActive"
  >
    <h3 class="project-item project-item_client">
      <div class="project-item-inner">
        <AppearWord
          word="Клиент: "
          :isAppear="isActive"
          :delayOrder="3"
          class="project-label"
        />
        <AppearWords
          :text="projectName"
          :isAppear="isActive"
          :delayOrder="4"
          class="project-value"
        />
      </div>
    </h3>

     <component
      :is="isExternalLink ? 'a' : 'RouterLink'"
      :href="isExternalLink ? projectStore.link : undefined"
      :to="!isExternalLink ? projectStore.link : undefined"
      class="hoverable project-item project-item_to-project"
      :class="`${isMobile ? 'hoverable-from-black' : 'hoverable-from-gray'} ${!isImagesCountVisible && isActive && 'project-item_to-project-active'}`"
      target="_blank"
      rel="noopener"
    >
      <div class="project-item-inner">
        <AppearWords
          text="Полный проект"
          :isAppear="!isImagesCountVisible && isActive"
          :delayOrder="0"
        />
        <LinkArrowIcon class="project-item-inner-svg"/>
      </div>
    </component>

    <CounterItem
      v-if="projectStore.images.length > 0"
      :pagesCount="projectStore.images.length"
      :currentPage="projectStore.footerData.currentImageInd + 1"
      :delayOrder="4 + projectName.split(' ').length"
      :isActive="isImagesCountVisible && isActive"
    />

    <h3 class="project-item project-item_year">
      <div class="project-item-inner">
        <AppearWord
          word="Год: "
          :isAppear="isActive"
          class="project-label"
          :delayOrder="6 + projectName.split(' ').length"
        />
        <AppearWords
          :text="projectYear"
          :isAppear="isActive"
          class="project-value"
          :delayOrder="7 + projectName.split(' ').length"
        />
      </div>
    </h3>

    <div class="project-item project-item_role">
      <div class="project-item-inner">
        <AppearWord
          word="Роль:"
          :isAppear="isActive"
          class="project-label"
          :delayOrder="8 + projectName.split(' ').length"
        />

        <ul class="project-list">
          <li
            class="project-list-item"
            v-for="(role, ind) in projectStore.roles"
          >
            <AppearWords
              :text="role"
              :isAppear="isActive"
              :delayOrder="9 + ind"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

.footer-item_project {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.project-item {
  display: flex;
  align-items: start;
  grid-column: 2 span;
  overflow: hidden;
}

.project-item * {
  line-height: 13px;
}

.project-item:has(.project-list) {
  max-height: 100%;
  overflow: hidden;
}

.project-item .project-item-inner,
.project-item:deep(.project-item-inner) {
  display: flex;
  align-items: start;
  color: var(--clr-black);
}

.project-item_client {
}

.project-item_client .project-value {
  padding-right: 10px;
}

.project-label {
  color: var(--clr-gray);
  flex-shrink: 0;
}

.project-value {
  display: flex;
  flex-wrap: wrap;
}

.project-value:deep(.appear-word:first-child) {
  padding-left: 20px;
}

.project-item_to-project {
  position: absolute;
  left: calc(var(--column-width) * 1);
  bottom: 23px;
  justify-content: start;
  text-align: left;
  z-index: 20;
  grid-column: 1;
}

.project-item_to-project:not(.project-item_to-project-active) {
  pointer-events: none;
}

.project-item_to-project:deep(.appear-words) {
  flex-wrap: nowrap;
}

.project-item_to-project .project-item-inner {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: 10px;
}

.project-item_to-project svg {
  fill: currentColor; /* Используем цвет родителя */
  transition: fill 0.3s ease;
}

.project-item_to-project {
  color: var(--clr-gray); /* Цвет по умолчанию */
}

.project-item_to-project-active {
  color: var(--clr-blue); /* Цвет для активного состояния */
}

.project-item_to-project svg {
  scale: 0.8;
  overflow: hidden;
  --transition-delay: 100ms;
  transition: clip-path 150ms var(--transition-delay);
  clip-path: circle(0% at 0% 100%);
}

.project-item_to-project-active:hover svg {
  clip-path: circle(130% at 0% 100%);
}

.project-item_counter {
  grid-column: 4 / 5;
  justify-content: center;
  translate: -46px 0;
}

.project-item:deep(.project-counter-current) {
  color: var(--clr-gray);
}

.project-counter-total {
}

.project-item_year {
  grid-column: 7 / 8;
}

.project-item_role {
  grid-column: 3 span;
}

.project-list {
  display: flex;
  flex-wrap: wrap;
  column-gap: 15px;
}

.project-list-item {
}

.project-list-item:first-child {
  padding-left: 20px;
}

@media (max-width: 1024px) {
  .footer-item_project {
    bottom: 62px !important;
  }

  .project-item_role {
    grid-column: 7 / 12;
    min-height: 32px;
    max-height: 32px;
    overflow: hidden;
  }

  .project-item_role .project-list-item:first-child {
    padding-left: 34px;
  }

  .project-item_year {
    grid-column: 5 / 6;
  }

  .project-item_to-project {
    position: absolute;
    left: calc(var(--column-width) * 1);
    bottom: 90px;
  }

  .project-item_to-project svg {
    --transition-delay: 0ms;
  }

  .project-item_to-project-active svg {
    clip-path: circle(130% at 0% 100%);
    --transition-delay: 400ms;
  }

  .project-item_counter {
    display: none;
  }

  .project-item_client {
    grid-column: 2 / 5;
    min-height: 32px;
    max-height: 32px;
    overflow: hidden;
  }
}

@media (max-width: 820px) {

  .project-item .project-item-inner,
.project-item:deep(.project-item-inner) {
  display: flex;
  align-items: start;
  color: var(--clr-black);
}

  
  .project-item_role {
    grid-column: 8 / 12;
  }

  .project-item_to-project {
    bottom: 80px;
  }
}

@media (max-width: 768px) {
  .footer-item_project {
    bottom: 29px !important;
  }
  .project-item_role {
    grid-column: 2 / 12;
  }

  .project-item_year {
    grid-column: 10 / 12;
  }

  .project-item_client {
    grid-column: 2 / 10;
  }

  .project-item_to-project {
    bottom: 170px;
  }
}

@media (max-width: 500px) {
  .footer-item_project {
    bottom: 18px !important;
  }
 
}
</style>
