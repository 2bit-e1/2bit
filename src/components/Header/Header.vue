<script setup>
import { useHomeStore } from "@/stores/home";
import { useProjectStore } from "@/stores/project";
import { PAGE_NAMES, ROUTES } from "@/utils/constants";
import { computed } from "vue";
import allProjects from "@/data/projects/index.js";
import AppearWord from "@/components/Appear/AppearWord.vue";
import AppearWords from "@/components/Appear/AppearWords.vue";
import { useProcessStore } from "@/stores/process";
import { getRightBtnRole, getLeftBtnRole, getHeaderExtraClass } from "./utils";
import { useGetRightBtnClickHandler, useGetLeftBtnClickHandler } from "./hooks";

const props = defineProps({
  pageName: String,
});

const homeStore = useHomeStore();
const projectStore = useProjectStore();
const processStore = useProcessStore();

const pageNameRef = computed(() => props.pageName);

const homeProjectYears = allProjects.map((project) => project.year);
const homeProjectNames = allProjects.map((project) => project.name);

const rightBtnClickHandler = useGetRightBtnClickHandler(pageNameRef);
const leftBtnClickHandler = useGetLeftBtnClickHandler(pageNameRef);

const isLeftBtnDisabled = computed(() => props.pageName != PAGE_NAMES.project || projectStore.isInfoOpen);
const leftBtnRole = computed(() => getLeftBtnRole(props.pageName));

const isRightBtnDisabled = computed(() => props.pageName == PAGE_NAMES.home);
const rightBtnRole = computed(() =>
  getRightBtnRole(
    props.pageName,
    projectStore.isInfoOpen,
    processStore.popupData.isOpen
  )
);

const headerExtraClass = computed(() => getHeaderExtraClass(props.pageName));
</script>

<template>
  <div class="header" :class="headerExtraClass">
    <div class="item item_left">
      <button
        class="item-btn hoverable"
        :class="{ 'item-btn_disabled': isLeftBtnDisabled }"
        :tabindex="isLeftBtnDisabled ? -1 : 0"
        :disabled="isLeftBtnDisabled"
        :role="leftBtnRole"
        @click.prevent="leftBtnClickHandler"
      >
        <div class="item-btn-inner">
          <span
            v-for="name in homeProjectNames"
            class="item-btn-text item-btn-text_home"
          >
            <AppearWords
              :text="name"
              :isAppear="
                pageName == PAGE_NAMES.home &&
                homeStore.activeProjectName == name
              "
              :delayOrder="1"
            />
          </span>

          <span class="item-btn-text item-btn-text_project hoverable-from-black">
            <AppearWord
              word="Инфо"
              :isAppear="pageName == PAGE_NAMES.project"
              :delayOrder="1"
            />
          </span>

          <span class="item-btn-text item-btn-text_me">
            <AppearWord
              word="Био"
              :isAppear="pageName == PAGE_NAMES.me"
              :delayOrder="1"
            />
          </span>

          <span class="item-btn-text item-btn-text_process">
            <AppearWord
              word="Процесс"
              :isAppear="pageName == PAGE_NAMES.process"
              :delayOrder="1"
            />
          </span>
        </div>
      </button>
    </div>
    <div class="item item_right">
      <button
        class="item-btn hoverable"
        :class="{ 'item-btn_disabled': isRightBtnDisabled }"
        :tabindex="isRightBtnDisabled ? -1 : 0"
        :disabled="isRightBtnDisabled"
        :role="rightBtnRole"
        @click.prevent="rightBtnClickHandler"
      >
        <div class="item-btn-inner">
          <span
            v-for="(year, ind) in homeProjectYears"
            class="item-btn-text item-btn-text_home"
          >
            <AppearWord
              :word="'‘' + year"
              :isAppear="
                pageName == PAGE_NAMES.home &&
                homeStore.activeProjectYear == year
              "
              :delayOrder="1 + homeProjectNames[ind].split(' ').length"
            />
          </span>

          <span class="item-btn-text item-btn-text_project hoverable-from-gray">
            <AppearWord
              :word="'Закрыть'"
              :isAppear="
                pageName == PAGE_NAMES.project && !projectStore.isInfoOpen
              "
              :delayOrder="2"
            />
          </span>

          <span class="item-btn-text item-btn-text_project hoverable-from-gray">
            <AppearWord
              :word="'Назад'"
              :isAppear="
                pageName == PAGE_NAMES.project && projectStore.isInfoOpen
              "
              :delayOrder="1"
            />
          </span>

          <span class="item-btn-text item-btn-text_process hoverable-from-gray">
            <AppearWord
              word="Закрыть"
              :isAppear="
                pageName == PAGE_NAMES.process && !processStore.popupData.isOpen
              "
              :delayOrder="2"
            />
          </span>

          <span class="item-btn-text item-btn-text_process hoverable-from-gray">
            <AppearWord
              word="Назад"
              :isAppear="
                pageName == PAGE_NAMES.process && processStore.popupData.isOpen
              "
              :delayOrder="1"
            />
          </span>

          <span class="item-btn-text item-btn-text_me hoverable-from-gray">
            <AppearWord
              word="Закрыть"
              :isAppear="pageName == PAGE_NAMES.me"
              :delayOrder="2"
            />
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 50%;
  translate: -50% 0;
  width: calc(100% - var(--page-padding-x) * 2);
  height: var(--header-height);
  z-index: var(--header-z-index);
  display: grid;
  grid-template-columns: repeat(5, var(--column-width));
  justify-content: center;
}
.header_home {
}
.header_project {
}
.header_me {
}
.header_info {
}

.item {
}

.item_left {
  grid-column: 2 / 3;
}

.item_right {
  grid-column: 4 / 5;
}

.item-btn {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-btn_disabled {
  cursor: auto;
}

.item-btn-inner {
  margin-top: 15px;
  width: 100%;
  position: relative;
  height: 100%;
  max-height: 33px;
  display: flex;
  align-items: center;
}

.item-btn-text {
  position: absolute;
  left: 50%;
  top: 0;
  translate: -50% 0;
  color: #776e62;
}

.item_left .item-btn-text_home {
  /* text-indent: var(--text-indent);
  translate: calc(-50% - (var(--text-indent) / 2)) 0; */
}

.item_left .item-btn-text_home:deep(.appear-words) {
  flex-wrap: nowrap;
}

.item_left .item-btn-text {
  color: var(--clr-black);
}

.item_right .item-btn-text {
  color: var(--clr-gray);
}

.item_right .item-btn-text_home {
  color: var(--clr-black);
}

.item-btn-text:has(.appear-word:not(.appear-word_appear)) {
  pointer-events: none;
}

.item-btn-text_project {
}

.item-btn-text_process {
}

.item-btn-text_me {
}

@media (max-width: 1024px) {
  .header {
    height: auto;
    grid-template-columns: repeat(12, var(--column-width));
    padding-top: 50px;
  }

  .item_left {
    grid-column: 2 / 5;
  }

  .item_right {
    grid-column: 10 / 12;
  }

  .item-btn {
    padding: 10px;
  }

  .item-btn-inner {
    margin-top: 0;
  }

  .item-btn-text:deep(.appear-words) {
    flex-wrap: nowrap !important;
  }

  .item_left .item-btn-text_home {
    left: 0;
    translate: initial;
  }
}

@media (max-width: 820px) {
  .header {
    padding-top: 25px;
  }
}

@media (max-width: 768px) {
  /*.header {
    mix-blend-mode: difference;
    padding-top: 40px;
  }
  .item_left .item-btn-text {
    color: var(--clr-gray);
  }
  
  .item_right .item-btn-text {
    color: var(--clr-black);
  }
  
  .item_right .item-btn-text_home {
    color: var(--clr-gray);
  }*/

  .header {
    padding-top: 40px;
  }

  .item_left {
    grid-column: 2 / 4;
  }
}
</style>
