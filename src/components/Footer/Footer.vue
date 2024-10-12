<script setup>
import ProjectFooterItem from './ProjectFooterItem/ProjectFooterItem.vue';
import HomeFooterItem from './HomeFooterItem.vue';
import MeFooterItem from './MeFooterItem/MeFooterItem.vue';
import { PAGE_NAMES } from '@/utils/constants';
import { useProjectStore } from '@/stores/project';
import { onMounted } from 'vue';

const props = defineProps({
  pageName: String
})

const projectStore = useProjectStore();

</script>

<template>
  <div class="footer" >
    <HomeFooterItem :isActive="props.pageName == PAGE_NAMES.home" :pageName="pageName" />
    <ProjectFooterItem
      :isActive="props.pageName == PAGE_NAMES.project && projectStore.footerData.isVisible"
      :pageName="pageName"
    />
    <MeFooterItem :isActive="props.pageName == PAGE_NAMES.me" :pageName="pageName" /> 
  </div>
</template>

<style scoped>
.footer {
  
}

.footer-item {
  position: fixed;
  bottom: 0;
  left: 50%;
  translate: -50% 0;
  width: calc(100% - var(--page-padding-x) * 2);
  height: var(--footer-height);
  z-index: var(--footer-z-index);
  display: grid;
  grid-template-columns: repeat(5, var(--column-width));
  justify-content: center;
  max-width: 100%;
}

.footer-item:not(.footer-item_active) {
  pointer-events: none;
}

.footer-item_project {
  padding-top: 21px;
}

.footer-item_project, .footer-item_me {
  --column-width-inner: min(calc(var(--column-width) / 2), 10vw);
  grid-template-columns: repeat(10, var(--column-width-inner));
}

.footer-item_me {
  height: var(--me-footer-height);
  row-gap: 7px;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  padding-bottom: 10px;
}

@media (max-width: 1024px) {
  .footer-item {
    height: auto;
    top: auto;
    bottom: 0;
    grid-template-columns: repeat(12, var(--column-width));
    row-gap: 3px;
    padding-bottom: 0;
    margin-top: 0;
  }

  .footer-item_home {
    height: auto;
    padding-bottom: 62px;
  }

  .footer-item_project {
    padding-top: 0;
    top: auto;
    bottom: 67px;
  }

  .footer-item_me {
    display: block;
    height: auto;
    left: 0;
    position: static;
    translate: initial;
  }
}

@media (max-width: 820px) {
  .footer-item_project {
    top: auto;
    bottom: 44px;
  }
  
  .footer-item_home {
    padding-bottom: 40px;
  }
}

@media (max-width: 768px) {
  .footer-item_project {
    bottom: 30px;
    top: auto;
  }
  
  .footer-item_home {
    padding-bottom: 62px;
  }

  .footer-item_me {
    position: initial;
    height: auto;
  }
}

@media (max-height: 720px) and (max-width: 768px) {
  .footer-item_me {
    margin-top: 30px;
  }
}
</style>