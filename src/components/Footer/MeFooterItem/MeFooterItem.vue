<script setup>
import { ROUTES } from "@/utils/constants";

import data from "@/data/me";
import AppearWord from "../../Appear/AppearWord.vue";
import AppearWords from "../../Appear/AppearWords.vue";
import { computed, ref } from "vue";
import LinkItem from "./LinkItem.vue";
import ListItem from "./ListItem.vue";
import PressItem from "./PressItem.vue";

const props = defineProps({
  isActive: Boolean,
});

const pressItemsDelayOrder =
  window.innerWidth >= 1024 ? 1 : 4 + data.footerData.contacts.length + 1;
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
      <LinkItem
        :isActive="isActive"
        :isItemsActive="isActive"
        :delayOrder="1"
        text="Обзор"
        :href="ROUTES.process"
      />
    </div>
    <div class="me-list-area me-list-area_contacts">
      <ListItem
        :isActive="isActive"
        :isItemsActive="isActive"
        :list="data.footerData.contacts"
        :labelDelayOrder="2"
        :label="'Контакты'"
        :isListLinks="true"
      />
    </div>
    <div class="me-title me-title_projects">
      <LinkItem
        :isActive="isActive"
        :delayOrder="2 + data.footerData.contacts.length + 1"
        text="Проекты"
        :href="ROUTES.home"
      />
    </div>
    <div class="me-list-area me-list-area_press">
      <PressItem
        :isActive="isActive"
        :press="data.footerData.press"
        :pressItemsDelayOrder="pressItemsDelayOrder"
      />
    </div>
    <div class="me-copyright">
      <AppearWords
        text="Александр Копинов"
        :isAppear="isActive"
        class="me-copyright-title"
        :delayOrder="4 + data.footerData.contacts.length + 1"
      />
      <AppearWords
        text="(2024. (c) Все права защищены)"
        :delayOrder="6 + data.footerData.contacts.length + 1"
        :isAppear="isActive"
        class="me-copyright-text"
      />
    </div>
    <div class="me-list-area me-list-area_services">
      <ListItem
        :isActive="isActive"
        :isItemsActive="isActive"
        :list="data.footerData.services"
        :labelDelayOrder="6 + data.footerData.contacts.length + 1"
        :label="'Услуги'"
      />
    </div>
  </div>
</template>

<style scoped>
.me-list-area.me-list-area_services {
  height: 1px;
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

.me-list-area_services:deep .me-list-item:first-child {
  padding-left: 36px;
}

.me-list-area_press:deep .me-list-title {
  cursor: pointer;
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

  .me-list-area_press,
  .me-copyright,
  .me-list-area_services,
  .me-list-area_contacts,
  .me-title_projects {
    position: absolute;
    z-index: var(--footer-z-index);
  }

  .me-copyright,
  .me-list-area_contacts {
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

  .me-list-area_press,
  .me-copyright {
    top: 120px;
  }

  .me-title_projects {
    display: none;
  }

  .me-list-area_contacts,
  .me-list-area_services {
    bottom: 50px;
  }


}

@media (max-width: 1024px) {
  .me-list-area_services, .me-list-area_contacts {
    bottom: 51px !important;
  }

  .me-list-area.me-list-area_services {
    height: auto;
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

  .me-list-area_contacts,
  .me-list-area_services {
    width: calc(var(--column-width) * 7);
  }

  .me-list-area_contacts {
    bottom: 62px;
  }

  .me-list-area_services {
    bottom: 12px;
    left: var(--column-width);
  }

  .me-list-area_services:deep .me-list {
    max-height: 48px;
    height: 48px;
  }

  .me-list-area:deep .me-list-item:first-child {
    padding-left: 20px;
  }
}

@media (max-width: 768px) {
  .me-title_process,
  .me-title_projects {
    display: none;
  }

  .me-list-area_press,
  .me-copyright,
  .me-list-area_services,
  .me-list-area_contacts {
    position: absolute;
    z-index: var(--footer-z-index);
    left: var(--column-width);
  }

  .me-list-area_services {
    width: calc(var(--column-width) * 10);
  }

  .me-list-area_contacts {
    width: calc(var(--column-width) * 11);
  }

  .me-list-area_press {
    top: 121px;
    width: calc(var(--column-width) * 10);
  }

  /*.me-list-area_services {
    flex-wrap: wrap;
  }
  
  .me-list-area_services:deep .me-list {
    min-width: 305px;
  }*/

  .me-copyright {
    top: 90px;
    flex-direction: row;
    column-gap: 22px;
    width: calc(var(--column-width) * 10);
  }

  .me-list-area_services:deep .me-list-item:first-child {
    padding-left: 36px;
  }

  .me-list-area {
    bottom: 68px !important;
  }

  .me-list-area.me-list-area_services {
    height: 1px;
  }
  
}

@media (max-height: 720px) and (max-width: 768px) {
  .me-list-area_contacts,
  .me-list-area_services {
    margin-left: var(--column-width);
    position: initial;
  }
}
</style>
