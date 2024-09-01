<script setup>
import { computed, ref } from 'vue';
import ListItem from './ListItem.vue';

defineProps({
  isActive: Boolean,
  press: Array,
  pressItemsDelayOrder: Number
})

const isDesktopPressVisible = ref(false);
const hidePressTimer = ref(null);

const handlePressShow = () => {
  if (hidePressTimer.value) clearTimeout(hidePressTimer.value);
  isDesktopPressVisible.value = true;
};

const handlePressHide = (hidePressDelay) => {
  if (hidePressTimer.value) clearTimeout(hidePressTimer.value);

  hidePressTimer.value = setTimeout(() => {
    isDesktopPressVisible.value = false;
  }, hidePressDelay);
};

const handlePressTitleMouseEnter = () => {
  handlePressShow();
};

const handlePressTitleMouseLeave = () => {
  handlePressHide(1000);
};

const handlePressItemMouseEnter = () => {
  if (isDesktopPressVisible.value) handlePressShow();
};

const handlePressItemMouseLeave = () => {
  if (isDesktopPressVisible.value) handlePressHide(500);
};

const isPressVisible = computed(
  () => isDesktopPressVisible.value || window.innerWidth <= 1024
);
</script>

<template>
  <ListItem
    :isActive="isActive"
    :isItemsActive="isActive && isPressVisible"
    :list="press"
    :labelDelayOrder="2"
    :label="'Пресса'"
    :isListLinks="true"
    :itemsDelayOrder="pressItemsDelayOrder"
    @itemMouseEnter="handlePressItemMouseEnter"
    @itemMouseLeave="handlePressItemMouseLeave"

    tabindex="0"
    @mouseenter="handlePressTitleMouseEnter"
    @mouseleave="handlePressTitleMouseLeave"
    @focus="handlePressTitleMouseEnter"
  />
</template>

<style scoped>
</style>