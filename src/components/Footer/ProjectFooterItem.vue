<script setup>
import { useProjectStore } from "@/stores/project";
import AppearWord from "../Appear/AppearWord.vue";
import AppearWords from "../Appear/AppearWords.vue";
import { computed } from "vue";

const props = defineProps({
  isActive: Boolean,
});

const projectStore = useProjectStore();
const isImagesCountVisible = computed(() => !projectStore.isInfoOpen);
const projectName = computed(() => projectStore.name || "");
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
    <div class="project-item project-item_counter">
      <div class="project-item-inner">
        <AppearWord
          word="01"
          :isAppear="isImagesCountVisible && isActive"
          :delayOrder="4 + projectName.split(' ').length"
          class="project-counter-current"
        />
        &nbsp;
        <AppearWord
          word="/ 21"
          :isAppear="isImagesCountVisible && isActive"
          :delayOrder="5 + projectName.split(' ').length"
          class="project-counter-total"
        />
      </div>
    </div>
    <h3 class="project-item project-item_year">
      <div class="project-item-inner">
        <AppearWord
          word="Год: "
          :isAppear="isActive"
          class="project-label"
          :delayOrder="6 + projectName.split(' ').length"
        />
        <AppearWords
          text="‘23"
          :isAppear="isActive"
          class="project-value"
          :delayOrder="7 + projectName.split(' ').length"
        />
      </div>
    </h3>
    <div class="project-item project-item_role">
      <div class="project-item-inner">
        <AppearWord word="Роль:" :isAppear="isActive" class="project-label" :delayOrder="8 + projectName.split(' ').length" />

        <ul class="project-list">
          <li class="project-list-item" v-for="(role, ind) in projectStore.roles">
            <AppearWords :text="role" :isAppear="isActive" :delayOrder="9 + ind" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-item {
  display: flex;
  align-items: start;
  grid-column: 2 span;
  overflow: hidden;
}

.project-item:has(.project-list) {
  max-height: 100%;
  overflow: hidden;
}

.project-item-inner {
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

.project-item_counter {
  justify-content: center;
}

.project-counter-current {
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
    grid-column: 6 / 7;
  }

  .project-item_counter {
    display: none;
  }

  .project-item_client {
    grid-column: 2 / 6;
    min-height: 32px;
    max-height: 32px;
    overflow: hidden;
  }
}

@media (max-width: 820px) {
  .project-item_role {
    grid-column: 8 / 12;
  }
}

@media (max-width: 768px) {
  .project-item_role {
    grid-column: 2 / 12;
  }

  .project-item_year {
    grid-column: 10 / 12;
  }

  .project-item_client {
    grid-column: 2 / 10;
  }
}
</style>
