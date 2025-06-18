<script setup>
import Info from "@/components/Info/Info.vue";
import VideoPopup from "@/components/VideoPopup.vue";
import data from "@/data/me";

const props = defineProps({
  pageName: String,
});
</script>

<template>
  <Info :pageName="pageName" :content="data.content" v-bind="$attrs" />

  <VideoPopup/>
</template>

