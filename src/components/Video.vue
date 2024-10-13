<script setup>
import { ref } from "vue";
import { onMounted, watchEffect } from "vue";

const props = defineProps({
  videoSrc: String,
  isPlaying: Boolean,
});

const videoElem = ref(null);
const stopVideoTimer = ref(null);
const isVideoLoaded = ref(false);

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

onMounted(() => {
  videoElem.value.onloadeddata = () => {
    isVideoLoaded.value = true;
  }
})
</script>

<template>
  <video
    :src="videoSrc"
    ref="videoElem"
    muted
    playsInline
    autoplay
    class="video"
    :class="{ 'video_loaded': isVideoLoaded }"
    :controls="false"
  >
  </video>
</template>

<style>
.video {
}
</style>
