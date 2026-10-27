<template>
  <div class="preloader">
    <MediaLoadingState :state="state" large @retry="$emit('retry')" />
  </div>
</template>

<script setup>
import MediaLoadingState from './MediaLoadingState.vue';
defineProps({ state: { type: String, default: 'loading' } });
defineEmits(['retry']);
</script>

<style scoped>
.preloader {
  touch-action: none;
  position: fixed;
  inset: 0;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

</style>
