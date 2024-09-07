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

const handlePressHide = (hidePressDelay = 0) => {
  if (hidePressTimer.value) clearTimeout(hidePressTimer.value);

  hidePressTimer.value = setTimeout(() => {
    isDesktopPressVisible.value = false;
  }, hidePressDelay);
};

const handleTitleMouseEnter = () => {
  handlePressShow();
};

const handleTitleMouseLeave = () => {
  handlePressHide(10);
};

const handleListMouseEnter = () => {
  if (isDesktopPressVisible.value) handlePressShow();
};

const handleListMouseLeave = () => {
  if (isDesktopPressVisible.value) handlePressHide();
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
    @listMouseEnter="handleListMouseEnter"
    @listMouseLeave="handleListMouseLeave"

    tabindex="0"
    @mouseenter="handleTitleMouseEnter"
    @mouseleave="handleTitleMouseLeave"
    @focus="handleTitleMouseEnter"
  />
</template>

<style scoped>
</style>