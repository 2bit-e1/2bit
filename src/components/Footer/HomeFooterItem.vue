<script setup>
import { useHomeStore } from "@/stores/home";
import { PAGE_NAMES, ROUTES } from "@/utils/constants";
import { RouterLink } from "vue-router";
import AppearWord from "../Appear/AppearWord.vue";
import { watchEffect } from "vue";

const props = defineProps({
  isActive: Boolean,
  pageName: String,
});

const homeStore = useHomeStore();
</script>

<template>
  <div
    class="footer-item footer-item_home"
    :class="{
      'footer-item_active': isActive,
      'footer-item_home-dim': !!homeStore.activeProjectName,
    }"
    :aria-hidden="!isActive"
  >
    <RouterLink class="home-btn" :to="ROUTES.process" :tabindex="isActive ? 0 : -1">
      <div class="home-btn-inner">
        <span class="home-btn-text">
          <AppearWord
            word="Процесс"
            :isAppear="pageName == PAGE_NAMES.home"
          />
        </span>
      </div>
    </RouterLink>
    <RouterLink class="home-btn" :to="ROUTES.me" :tabindex="isActive ? 0 : -1">
      <div class="home-btn-inner">
        <span class="home-btn-text">
          <AppearWord
            word="Био"
            :isAppear="pageName == PAGE_NAMES.home"
          />
        </span>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.footer-item_home {
}

.home-btn {
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-btn:nth-child(1) {
  grid-column: 2 / 3;
}

.home-btn:nth-child(2) {
  grid-column: 4 / 5;
}

.home-btn-inner {
  overflow: hidden;
}

.home-btn-text {
  display: flex;
  justify-content: center;
  color: var(--clr-black);
  transition: color 150ms;
}

.footer-item_home-dim .home-btn-text {
  color: var(--clr-gray);
}

@media (max-width: 1024px) {
  .home-btn:nth-child(1) {
    grid-column: 2 / 4;
  }
  
  .home-btn:nth-child(2) {
    grid-column: 10 / 12;
  }
}
</style>
