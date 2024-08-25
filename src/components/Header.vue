<script setup>
import { useHomeStore } from "@/stores/home";
import { useProjectStore } from "@/stores/project";
import { PAGE_NAMES, ROUTES } from "@/utils/constants";
import { handleRoute } from "@/utils/handleRoute";
import { computed, watchEffect } from "vue";
import { useRouter } from "vue-router";
import allProjects from "@/data/projects/index.js";
import AppearWord from "./Appear/AppearWord.vue";
import AppearWords from "./Appear/AppearWords.vue";
import { useProcessStore } from "@/stores/process";

const props = defineProps({
  pageName: String,
});

const router = useRouter();
const homeStore = useHomeStore();
const projectStore = useProjectStore();
const processStore = useProcessStore();

const homeProjectYears = allProjects.map((project) => project.year);
const homeProjectNames = allProjects.map((project) => project.name);

const leftBtnClick = (event) => {
  if (props.pageName == PAGE_NAMES.project) {
    projectStore.openProjectInfo();
  } else {
    event.preventDefault();
  }
};

const rightBtnClick = (event) => {
  if (props.pageName == PAGE_NAMES.project) {
    if (projectStore.isInfoOpen) {
      projectStore.closeProjectInfo();
    } else {
      handleRoute(router, ROUTES.home);
    }
  } else if (props.pageName == PAGE_NAMES.me) {
    handleRoute(router, ROUTES.home);
  } else if (props.pageName == PAGE_NAMES.process) {
    if (processStore.popupData.isOpen) {
      processStore.closePopup();
    } else {
      handleRoute(router, ROUTES.home);
    }
  } else {
    event.preventDefault();
  }
};

const isLeftBtnDisabled = computed(() => props.pageName != PAGE_NAMES.project);
const leftBtnRole = computed(() => {
  if (props.pageName != PAGE_NAMES.project) return "presentation";
  else return "button";
});

const isRightBtnDisabled = computed(() => props.pageName == PAGE_NAMES.home);
const rightBtnRole = computed(() => {
  if (props.pageName == PAGE_NAMES.project) {
    return projectStore.isInfoOpen ? "button" : "link";
  } else if (props.pageName == PAGE_NAMES.me) {
    return "link";
  } else if (props.pageName == PAGE_NAMES.process) {
    return processStore.popupData.isOpen ? "button" : "link";
  } else {
    return "presentation";
  }
});

const headerExtraClass = computed(() => ({
  header_home: props.pageName == PAGE_NAMES.home,
  header_project: props.pageName == PAGE_NAMES.project,
  header_me: props.pageName == PAGE_NAMES.me,
  header_info: props.pageName == PAGE_NAMES.info,
}));
</script>

<template>
  <div class="header" :class="headerExtraClass">
    <div class="item item_left">
      <button
        class="item-btn"
        :class="{ 'item-btn_disabled': isLeftBtnDisabled }"
        :tabindex="isLeftBtnDisabled ? -1 : 0"
        :role="leftBtnRole"
        @click="leftBtnClick"
      >
        <div class="item-btn-inner">
          <span v-for="name in homeProjectNames" class="item-btn-text item-btn-text_home">
            <AppearWords
              :text="name"
              :isAppear="pageName == PAGE_NAMES.home && homeStore.activeProjectName == name"
            />
          </span>

          <span class="item-btn-text item-btn-text_project">
              <AppearWord
                word="Инфо"
                :isAppear="pageName == PAGE_NAMES.project"
              />
          </span>

          <span class="item-btn-text item-btn-text_me">
              <AppearWord
                word="Био"
                :isAppear="pageName == PAGE_NAMES.me"
              />
          </span>

          <span class="item-btn-text item-btn-text_process">
              <AppearWord
                word="Процесс"
                :isAppear="pageName == PAGE_NAMES.process"
              />
          </span>
        </div>
      </button>
    </div>
    <div class="item item_right">
      <button
        class="item-btn"
        :class="{ 'item-btn_disabled': isRightBtnDisabled }"
        :tabindex="isRightBtnDisabled ? -1 : 0"
        :role="rightBtnRole"
        @click="rightBtnClick"
      >
        <div class="item-btn-inner">
          <span v-for="year in homeProjectYears" class="item-btn-text item-btn-text_home">
            <AppearWord
              :word="'‘' + year"
              :isAppear="pageName == PAGE_NAMES.home && homeStore.activeProjectYear == year"
            />
          </span>

          
          <span class="item-btn-text item-btn-text_project">
            <AppearWord
              :word="'Назад'"
              :isAppear="pageName == PAGE_NAMES.project && projectStore.isInfoOpen"
            />
          </span>

          <span class="item-btn-text item-btn-text_project">
            <AppearWord
              :word="'Закрыть'"
              :isAppear="pageName == PAGE_NAMES.project && !projectStore.isInfoOpen"
            />
          </span>
          

          <span class="item-btn-text item-btn-text_process">
            <AppearWord
              word="Закрыть"
              :isAppear="pageName == PAGE_NAMES.process && !processStore.popupData.isOpen"
            />
          </span>

          <span class="item-btn-text item-btn-text_process">
            <AppearWord
              word="Назад"
              :isAppear="pageName == PAGE_NAMES.process && processStore.popupData.isOpen"
            />
          </span>

          <span class="item-btn-text item-btn-text_me">
            <AppearWord
              word="Закрыть"
              :isAppear="pageName == PAGE_NAMES.me"
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
