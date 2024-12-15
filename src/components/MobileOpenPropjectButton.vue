<script setup>
import AppearWord from "./Appear/AppearWord.vue";
import { computed, ref } from "vue";
import { useHomeStore } from "@/stores/home";

const homeStore = useHomeStore();

const activeProjectLink = computed(() => {
  return homeStore.activeProjectLink;
});

const isDesktop = window.innerWidth > 1024;
</script>

<template>
  <RouterLink
    v-if="!isDesktop"
    class="mobile-open-propject-button"
    :to="activeProjectLink"
  >
    <!-- <AppearWord
      word="Подробнее"
      :isAppear="!!activeProjectLink"
      :delayOrder="0"
    /> -->
  </RouterLink>
</template>

<style scoped>
.mobile-open-propject-button {
  position: absolute;
  padding: 8px 10px;
  z-index: 10;
  color: var(--clr-gray);
}

@media (max-width: 1024px) {
  .mobile-open-propject-button {
    top: 52px;
    left: 50%;
    translate: -50% 0;
  }
}

@media (max-width: 820px) {
  .mobile-open-propject-button {
    top: 27px;
    left: 50%;
    translate: -50% 0;
  }
}

@media (max-width: 768px) {
  .mobile-open-propject-button {
    top: 93px;
    translate: 0 0;
    left: var(--column-width);
  }
}
</style>
