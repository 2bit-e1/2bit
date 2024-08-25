<script setup>
import ImagePopup from '@/components/Process/ImagePopup.vue';
import ImagesList from '@/components/Process/ImagesList.vue';
import { useProcessStore } from '@/stores/process';

const props = defineProps({
  pageName: String,
})

const processStore = useProcessStore();

</script>

<template>
  <ImagesList @openPopup="processStore.openPopup" />
  <ImagePopup
    :imageSrc="processStore.popupData.imageInfo?.src"
    :imageDescription="processStore.popupData.imageInfo?.description"
    :isOpen="processStore.popupData.isOpen"
    @closePopup="processStore.closePopup"
  />
</template>

<style scoped>

</style>
