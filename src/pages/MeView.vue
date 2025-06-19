<script setup>
import Info from "@/components/Info/Info.vue";
import VideoPopup from "@/components/VideoPopup.vue";
import data from "@/data/me";
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  pageName: String,
});

const isDesktop = window.innerWidth > 1024;

onMounted(() => {
  if (isDesktop) {
    document.body.style.overflow = 'hidden';
  }
});

onBeforeUnmount(() => {
  if (isDesktop) {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Info :pageName="pageName" :content="data.content" v-bind="$attrs" />

  <VideoPopup/>
</template>

