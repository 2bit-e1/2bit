<script setup>
import { onUnmounted, watchEffect } from 'vue';

const props = defineProps({
  imageSrc: String,
  imageDescription: String,
  isOpen: Boolean
})

const emits = defineEmits(['closePopup']);

const keydownHandler = (event) => {
  if (event.key == 'Escape') {
    emits('closePopup');
  }
}

const clickHandler = (event) => {
  if (!event.target.closest('.description')) {
    emits('closePopup');
  }
}

watchEffect(() => {
  if (props.isOpen) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', keydownHandler)
    window.addEventListener('click', clickHandler)
  } else {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', keydownHandler)
    window.removeEventListener('click', clickHandler)
  }
})

onUnmounted(() => {
  document.body.style.overflow = '';
})
</script>

<template>
  <div class="image-popup" :class="{ 'image-popup_open': isOpen }">
    <div class="image-popup-inner">
      <div class="image-container">
        <img class="image" :src="imageSrc" alt="">
      </div>
      <p class="description">{{ imageDescription }}</p>
    </div>
  </div>
</template>

<style scoped>
.image-popup {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: rgba(var(--bg-clr-white-rgb), 0.85);
  --popup-x-padding: 60px;
  padding: var(--header-height) var(--popup-x-padding) 0;
}

.image-popup_open {
  display: block;
}

.image-popup-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.image-container {
  flex: 1 1 auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.description {
  display: block;
  flex: 0 0 65px;
  padding: 25px 0 5px;
  margin-left: calc(-1 * var(--popup-x-padding) + var(--page-padding-x) + var(--column-width));
  width: calc(var(--column-width) * 2);
  color: var(--clr-black);
  text-indent: var(--text-indent);
}

@media (max-width: 1024px) {
  .image-popup {
    background-color: var(--bg-clr-white);
    --popup-x-padding: var(--column-width);
    padding: 120px var(--popup-x-padding) 0;
  }

  .description {
    flex: 0 0 130px;
    padding-top: 55px;
    padding: 55px 0 0;
    margin-left: calc(-1 * var(--popup-x-padding) + var(--column-width));
    width: calc(var(--column-width) * 6);
  }
}

@media (max-width: 820px) {
  .image-popup {
    padding: 86px var(--popup-x-padding) 0;
  }

  .description {
    flex: 0 0 86px;
    padding: 35px 0 0;
    margin-left: calc(-1 * var(--popup-x-padding) + var(--column-width));
    width: calc(var(--column-width) * 7);
  }
}

@media (max-width: 768px) {
  .image-popup {
    padding: 170px var(--popup-x-padding) 0;
  }

  .description {
    flex: 0 0 130px;
    padding-top: 50px;
    margin-left: calc(-1 * var(--popup-x-padding) + var(--column-width));
    width: calc(var(--column-width) * 10);
  }
}
</style>