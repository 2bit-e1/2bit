<script setup>
import ProjectsList from "@/components/Home/ProjectsList.vue";
import MobileOpenPropjectButton from "@/components/MobileOpenPropjectButton.vue";
import { useHomeStore } from "@/stores/home";
import { computed, ref, watchEffect } from "vue";
</script>

<template>
  <div class="home-view">
    <MobileOpenPropjectButton />
    <ProjectsList />
  </div>
</template>

<style scoped>
.home-view {
  height: 100%;
  padding: var(--header-height) 0 var(--footer-height);
}
</style>
