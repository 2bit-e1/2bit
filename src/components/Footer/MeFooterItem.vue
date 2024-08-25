<script setup>
import { ROUTES } from "@/utils/constants";

import data from "@/data/me";
import AppearWord from "../Appear/AppearWord.vue";
import AppearWords from "../Appear/AppearWords.vue";
import { computed, ref } from "vue";

const props = defineProps({
  isActive: Boolean,
});

const isDesktopPressVisible = ref(false);
const hidePressTimer = ref(null);

const handlePressShow = () => {
  if (hidePressTimer.value) clearTimeout(hidePressTimer.value);
  isDesktopPressVisible.value = true;
}

const handlePressHide = (hidePressDelay) => {
  if (hidePressTimer.value) clearTimeout(hidePressTimer.value);

  hidePressTimer.value = setTimeout(() => {
    isDesktopPressVisible.value = false;
  }, hidePressDelay);
}

const handlePressTitleMouseEnter = () => {
  handlePressShow()
}

const handlePressTitleMouseLeave = () => {
  handlePressHide(1000)
}

const handlePressItemMouseEnter = () => {
  if (isDesktopPressVisible.value) handlePressShow()
}

const handlePressItemMouseLeave = () => {
  if (isDesktopPressVisible.value) handlePressHide(500)
}

const isPressVisible = computed(() => isDesktopPressVisible.value || window.innerWidth <= 1024);
</script>

<template>
  <div
    class="footer-item footer-item_me"
    :class="{
      'footer-item_active': isActive,
    }"
    :aria-hidden="!isActive"
  >
    <div class="me-title me-title_process">
      <RouterLink
        class="me-title-link"
        :to="ROUTES.process"
        :tabIndex="isActive ? 0 : -1"
      >
        <AppearWord word="Процесс" :isAppear="isActive"/>
      </RouterLink>
    </div>
    <div class="me-list-area me-list-area_contacts">
      <AppearWord word="Контакты" :isAppear="isActive" class="me-list-title"/>
      <ul class="me-list">
        <li v-for="item in data.footerData.contacts" class="me-list-item" :key="item.text">
          <a class="me-list-item-link" :href="item.link">
            <AppearWords :text="item.text" :isAppear="isActive" />
          </a>
        </li>
      </ul>
    </div>
    <div class="me-title me-title_projects">
      <RouterLink
        class="me-title-link"
        :to="ROUTES.home"
        :tabIndex="isActive ? 0 : -1"
      >
        <AppearWord word="Проекты" :isAppear="isActive"/>
      </RouterLink>
    </div>
    <div class="me-list-area me-list-area_press">
      <AppearWord
        word="Пресса"
        :isAppear="isActive"
        class="me-list-title"
        @mouseenter="handlePressTitleMouseEnter"
        @mouseleave="handlePressTitleMouseLeave"
        @focus="handlePressTitleMouseEnter"
        tabindex="0"
      />
      <ul class="me-list">
        <li v-for="item in data.footerData.press" class="me-list-item" @mouseenter="handlePressItemMouseEnter" @mouseleave="handlePressItemMouseLeave" :key="item.text">
          <a class="me-list-item-link" :href="item.link" :tabindex="isActive && isPressVisible ? 0 : -1">
            <AppearWords :text="item.text" :isAppear="isActive && isPressVisible" />
          </a>
        </li>
      </ul>
    </div>
    <div class="me-copyright">
      <AppearWords text="Александр Копинов" :isAppear="isActive" class="me-copyright-title"/>
      <AppearWords text="(2024. (c) Все права защищены)" :isAppear="isActive" class="me-copyright-text"/>
    </div>
    <div class="me-list-area me-list-area_services">
      <AppearWord word="Услуги" :isAppear="isActive" class="me-list-title"/>
      <ul class="me-list">
        <li v-for="item in data.footerData.services" class="me-list-item">
          <AppearWords :text="item" :isAppear="isActive" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.footer-item_me:not(.footer-item_active) {
  visibility: hidden;
}
.me-title {
  color: var(--clr-gray);
}
.me-title_process {
}

.me-list-area {
  display: flex;
  align-items: start;
  padding-right: 10px;
}

.me-list-area_services {
}

.me-list-area_contacts {
}

.me-list-area_services,
.me-list-area_contacts {
  grid-column: 3 / 7;
}

.me-list-area_press {
  grid-column: 8 / 11;
}

.me-list-area_press .me-list-title {
  cursor: pointer;
}

.me-list-title {
  flex-shrink: 0;
  color: var(--clr-gray);
}

.me-list-item:first-child {
  padding-left: 20px;
}

.me-list-area_services .me-list-item:first-child {
  padding-left: 36px;
}

.me-list {
  align-content: start;
  display: flex;
  flex-wrap: wrap;
  column-gap: 15px;
  min-height: 31px;
  height: 100%;
  max-height: 35px;
  overflow: hidden;
}

.me-title_projects {
}

.me-copyright {
  grid-column: 1 / 3;
  display: flex;
  flex-direction: column;
}

:is(.me-copyright-title, .me-copyright-text) {
  flex-wrap: nowrap;
}

.me-copyright-title {
}

.me-copyright-text {
  color: var(--clr-gray);
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .me-title_process {
    display: none;
  }

  .me-list-area_press, .me-copyright, .me-list-area_services, .me-list-area_contacts, .me-title_projects {
    position: absolute;
    z-index: var(--header-z-index);
  }

  .me-copyright, .me-list-area_contacts {
    left: var(--column-width);
  }

  .me-list-area_press {
    left: calc(var(--column-width) * 6);
    width: calc(var(--column-width) * 5);
  }

  .me-title_projects {
    left: calc(var(--column-width) * 4);
  }

  .me-copyright {
    width: calc(var(--column-width) * 3);
  }
  
  .me-list-area_contacts {
    width: calc(var(--column-width) * 4);
  }
  
  .me-list-area_services {
    left: calc(var(--column-width) * 6);
    width: calc(var(--column-width) * 5);
  }

  .me-list-area_press, .me-title_projects, .me-copyright {
    top: 120px;
  }

  .me-list-area_contacts, .me-list-area_services {
    bottom: 50px;
  }
}

@media (max-width: 820px) {
  .me-list-area_press {
    left: calc(var(--column-width) * 7);
    width: calc(var(--column-width) * 4);
  }
  
  .me-title_projects {
    left: calc(var(--column-width) * 5);
  }

  .me-list-area_contacts, .me-list-area_services {
    width: calc(var(--column-width) * 7);
  }
  
  .me-list-area_contacts {
    bottom: 62px;
  }

  .me-list-area_services {
    bottom: 12px;
    left: var(--column-width);
  }

  .me-list-area_services .me-list {
    max-height: 48px;
    height: 48px;
  }

  .me-list-area .me-list-item:first-child {
    padding-left: 20px;
  }
}

@media (max-width: 768px) {
  .me-title_process, .me-title_projects {
    display: none;
  }

  .me-list-area_press, .me-copyright, .me-list-area_services, .me-list-area_contacts {
    position: absolute;
    z-index: var(--header-z-index);
    left: var(--column-width);
  }

  .me-list-area_contacts, .me-list-area_services {
    width: calc(var(--column-width) * 10);
  }

  .me-list-area_press {
    top: 121px;
    width: calc(var(--column-width) * 10);
  }

  .me-copyright {
    top: 90px;
    flex-direction: row;
    column-gap: 22px;
    width: calc(var(--column-width) * 10);
  }

  .me-list-area_services .me-list-item:first-child {
    padding-left: 36px;
  }
}
</style>
