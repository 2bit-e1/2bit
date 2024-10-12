<script setup>
import { ref } from "vue";
import { onMounted, watchEffect } from "vue";

const props = defineProps({
  videoSrc: String,
  isPlaying: Boolean,
});

const videoElem = ref(null);
const stopVideoTimer = ref(null);

// watchEffect(
//   () => {
//     if (props.isPlaying) {
//       if (stopVideoTimer.value) clearTimeout(stopVideoTimer.value);
//       videoElem.value.play();
//     } else {
//       const videoVisibleDuration = 500;
//       stopVideoTimer.value = setTimeout(() => {
//         videoElem.value.currentTime = 0;
//         videoElem.value.pause();
//       }, videoVisibleDuration);
//     }
//   },
//   { immediate: true, flush: "post" }
// );
</script>

<template>
  <video
    ref="videoElem"
    muted
    playsInline
    autoplay
    class="video"
    :controls="false"
    :src="videoSrc"
  >
    <!-- <source :src="videoSrc" type="video/webm" /> -->
  </video>
</template>

<style scoped>
.video {
}
</style>
