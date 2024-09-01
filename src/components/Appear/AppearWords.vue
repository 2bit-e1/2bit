<script setup>
import { computed } from "vue";
import AppearWord from "./AppearWord.vue";

const props = defineProps({
  text: String,
  isAppear: Boolean,
  delayOrder: Number
})

const words = computed(() => props.text.split(" "));
</script>

<template>
  <span class="appear-words">
    <AppearWord v-for="(word, ind) in words" :word="word + ' '" :delayOrder="ind + delayOrder" :isAppear="isAppear" :key="word" />
  </span>
</template>

<style>
.appear-words {
  display: flex;
  flex-wrap: wrap;
  column-gap: 3px;
}
</style>