<script setup>
import Info from "@/components/Info/Info.vue";
import data from "@/data/me";

const props = defineProps({
  pageName: String,
});
</script>

<template>
  <Info :pageName="pageName" :content="data.content" />
</template>

<style scoped></style>
