<script setup>
import AppearWord from '@/components/Appear/AppearWord.vue';
import { ROUTES } from '@/utils/constants';
import { RouterLink } from 'vue-router';

defineProps({
  isActive: Boolean,
  delayOrder: Number,
  text: String,
  href: String
})

</script>

<template>
  <RouterLink
    class="me-title-link"
    :to="href"
    :tabIndex="isActive ? 0 : -1"
  >
    <AppearWord :word="text" :isAppear="isActive" :delayOrder="delayOrder" />
  </RouterLink>
</template>

<style scoped>
</style>