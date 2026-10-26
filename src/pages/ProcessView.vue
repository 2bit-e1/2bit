<script setup>
import ImagePopup from '@/components/Process/ImagePopup.vue';
import ImagesList from '@/components/Process/ImagesList.vue';
import { useProcessStore } from '@/stores/process';
import { processImagesData } from '@/data/process/images';
import { getImageSrc } from '@/components/Process/utils';
import { computed } from 'vue';

const props = defineProps({
  pageName: String,
})

const processStore = useProcessStore();
const popupIndex = computed(() => {
  const info = processStore.popupData.imageInfo;
  return Number.isInteger(info?.index) ? info.index :
    processImagesData.findIndex(item => getImageSrc(item.name) === info?.src);
});

function navigatePopup(direction) {
  if (!processStore.popupData.isOpen || popupIndex.value < 0) return;
  const index = popupIndex.value + direction;
  const item = processImagesData[index];
  if (item) processStore.openPopup(getImageSrc(item.name), item.description, item.orientation, index);
}
</script>

<template>
  <ImagesList @openPopup="processStore.openPopup" />
  <ImagePopup
    :imageSrc="processStore.popupData.imageInfo?.src"
    :imageDescription="processStore.popupData.imageInfo?.description"
    :imageOrientation="processStore.popupData.imageInfo?.orientation"
    :isOpen="processStore.popupData.isOpen"
    :hasPrevious="popupIndex > 0"
    :hasNext="popupIndex >= 0 && popupIndex < processImagesData.length - 1"
    @navigate="navigatePopup"
    @closePopup="processStore.closePopup"
  />
</template>

<style scoped>

</style>
