<script setup>
import DesktopContent from './DesktopContent.vue';
import MobileContent from './MobileContent/MobileContent.vue';

defineProps({
  imagesSrc: Array,
  projectKey: String,
  hasNextProject: Boolean,
  hasPreviousProject: Boolean,
  entryIndex: Number,
  entryDirection: Number,
  isLeaving: Boolean,
})
const emit = defineEmits(['navigateProject', 'ready']);

const isDesktop = window.innerWidth > 1024
</script>

<template>
  <DesktopContent v-if="isDesktop" :projectKey="projectKey" :imagesSrc="imagesSrc" :hasNextProject="hasNextProject"
    :hasPreviousProject="hasPreviousProject" :entryIndex="entryIndex" :entryDirection="entryDirection"
    :isLeaving="isLeaving" @ready="emit('ready', $event)" @navigateProject="emit('navigateProject', $event)" />
  <MobileContent v-else :key="projectKey" :imagesSrc="imagesSrc" :hasNextProject="hasNextProject"
    :hasPreviousProject="hasPreviousProject" :entryIndex="entryIndex" :entryDirection="entryDirection"
    :isLeaving="isLeaving" @ready="emit('ready', $event)" @navigateProject="emit('navigateProject', $event)" />
</template>

<style scoped>
</style>
