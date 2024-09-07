<script setup>
import DesktopContent from './DesktopContent.vue';
import MobileContent from './MobileContent/MobileContent.vue';

defineProps({
  imagesSrc: Array
})

const isDesktop = window.innerWidth > 1024
</script>

<template>
  <DesktopContent v-if="isDesktop" :imagesSrc="imagesSrc" />
  <MobileContent v-else :imagesSrc="imagesSrc" />
</template>

<style scoped>
</style>