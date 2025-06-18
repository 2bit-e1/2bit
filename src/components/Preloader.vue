<template>
  <div class="preloader">
    <video
      autoplay
      loop
      muted
      playsinline
      class="preloader-video"
    >
      <source src="@/assets/preloadanim.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script setup>
// ничего не нужно подключать
</script>

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

.preloader-video {
  width: 100px;
  height: 100px;
  object-fit: contain;
}
</style>
