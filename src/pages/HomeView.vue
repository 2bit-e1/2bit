<script setup>
import ProjectsList from "@/components/Home/ProjectsList.vue";

</script>

<template>
  <div class="home-view">
    <ProjectsList />
  </div>
</template>

<style scoped>
.home-view {
  height: 100vh;
  padding: var(--header-height) 0 var(--footer-height);
}
</style>
