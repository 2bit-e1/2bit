<script setup>
import AppearWord from "./AppearWord.vue";

const props = defineProps({
  text: String,
  isAppear: Boolean
})

const words = props.text.split(" ");
</script>

<template>
  <span class="appear-words">
    <AppearWord v-for="word in words" :word="word + ' '" :isAppear="isAppear" :key="word" />
  </span>
</template>

<style>
.appear-words {
  display: flex;
  flex-wrap: wrap;
  column-gap: 3px;
}
</style>