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
    <RouterLink class="hoverable home-btn" :to="ROUTES.process" :tabindex="isActive ? 0 : -1">
      <div class="home-btn-inner">
        <span class="home-btn-text hoverable-from-black">
          <AppearWord
            word="Обзор"
            :isAppear="pageName == PAGE_NAMES.home"
            :delayOrder="1"
          />
        </span>
      </div>
    </RouterLink>
    <div class="home-eyes home-btn">
      <span class="home-eye-item"></span>
      <span class="home-eye-item"></span>
    </div>
    <RouterLink class="hoverable home-btn" :to="ROUTES.me" :tabindex="isActive ? 0 : -1">
      <div class="home-btn-inner">
        <span class="home-btn-text hoverable-from-black">
          <AppearWord
            word="Био"
            :isAppear="pageName == PAGE_NAMES.home"
            :delayOrder="2"
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
  grid-column: 3 / 4;
}

.home-btn:nth-child(3) {
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

.home-eyes {
  column-gap: 9px;
  display: none;
}

.footer-item_active .home-eyes {
  display: flex;
}

.home-eye-item {
  width: 10px;
  height: 10px;
  background-color: var(--clr-black);
}

.footer-item_home-dim .home-btn-text {
  color: var(--clr-gray);
}

@media (max-width: 1024px) {
  .home-btn:nth-child(1) {
    grid-column: 2 / 4;
  }
  
  .home-btn:nth-child(2) {
    grid-column: 6 / 8;
  }

  .home-btn:nth-child(3) {
    grid-column: 10 / 12;
  }

  .home-eyes {
    column-gap: 14px;
  }
}
</style>
