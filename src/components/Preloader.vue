<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
</script>

<template>
  <div class="preloader">   
     <DotLottieVue style="height: 500px; width: 500px" autoplay loop src="https://lottie.host/05c37978-2684-4c79-89bb-e71d18a72da5/H7tgSfUvyC.lottie" />
  </div>
</template>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
