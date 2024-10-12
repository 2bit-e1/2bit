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
    <dotlottie-player
      src="https://lottie.host/d159ed7d-2be4-47b5-a37c-8a78e02a8432/mJEMxCWENQ.json"
      background="transparent"
      speed="1"
      style="width: 300px; height: 300px"
      loop
      autoplay
    ></dotlottie-player>
  </div>
</template>

<style scoped>
.home-view {
  height: 100%;
  padding: var(--header-height) 0 var(--footer-height);
}
</style>
