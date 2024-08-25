<script setup>
import { reactive, ref, watchEffect } from 'vue';
import ImagePopup from '@/components/Process/ImagePopup.vue';
import ImagesList from '@/components/Process/ImagesList.vue';

const props = defineProps({
  pageName: String,
})

const isPopupOpen = ref(false);
const popupData = reactive({
  isOpen: false,
  imageInfo: null
});

const openPopup = (src, description) => {
  popupData.imageInfo = { src, description };
  popupData.isOpen = true;
}

const closePopup = () => {
  popupData.isOpen = false;
}

watchEffect(() => {
  if (isPopupOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
})

</script>

<template>
  <ImagesList @openPopup="openPopup" />
  <ImagePopup
    :imageSrc="popupData.imageInfo?.src"
    :imageDescription="popupData.imageInfo?.description"
    :isOpen="popupData.isOpen"
    @closePopup="closePopup"
  />
</template>

<style scoped>

</style>
