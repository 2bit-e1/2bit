<script setup>
import { handleRoute } from '@/utils/handleRoute';
import { useRouter } from 'vue-router';

//view transition api link
const props = defineProps({
  href: String,
  text: String,
  class: String
})

const router = useRouter()

const handleClick = (event) => {
  event.preventDefault()
  handleRoute(router, props.href)
} 
</script>

<template>
  <a :href="href" :class="class" @click="handleClick">
    <slot></slot>
  </a>
</template>

<style scoped>
</style>