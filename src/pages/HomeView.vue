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

    <!-- <dotlottie-player
      src="https://lottie.host/b8802d4d-78d1-40fd-bc3f-d76a474dfd7e/nmFSs6xpez.json"
      background="transparent"
      speed="1"
      style="width: 300px; height: 300px"
      loop
      autoplay
    ></dotlottie-player> -->
  </div>
</template>

<style scoped>
.home-view {
  height: 100%;
  padding: var(--header-height) 0 var(--footer-height);
}
</style>
