<script setup>
import { ref, watchEffect } from 'vue';
import ImagePopup from '@/components/Process/ImagePopup.vue';
import ImagesList from '@/components/Process/ImagesList.vue';

const props = defineProps({
  pageName: String,
})

const isPopupOpen = ref(false);

const openPopup = () => {
  isPopupOpen.value = true;
}

const closePopup = () => {
  isPopupOpen.value = false;
}

watchEffect(() => {
  if (isPopupOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
})

const src =  'https://images.unsplash.com/photo-1602850152657-3bd1351c7f15?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww'
// const src = "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww"
</script>

<template>
  <ImagesList @openPopup="openPopup" />
  <ImagePopup
    :imageSrc="src"
    :imageDescription="'A closed club for experienced investors, providing personal solutions with maximum benefit in all market situations.'"
    :isOpen="isPopupOpen"
    @closePopup="closePopup"
  />
</template>

<style scoped>

</style>
