<script setup>
import { ref } from 'vue';
import { onMounted, watchEffect } from 'vue';

const props = defineProps({
  videoSrc: String,
  isPlaying: Boolean
})

const videoElem = ref(null);
const stopVideoTimer = ref(null);

watchEffect(() => {
  
  if (props.isPlaying) {
    if (stopVideoTimer.value) clearTimeout(stopVideoTimer.value);
    videoElem.value.play();
  } else {
    const videoVisibleDuration = 500;
    stopVideoTimer.value = setTimeout(() => {
      videoElem.value.currentTime = 0;
      videoElem.value.pause();
    }, videoVisibleDuration)
  }
}, { immediate: true, flush: 'post' });
</script>

<template>
  <video
    :src="videoSrc"
    ref="videoElem"
    muted
    playsInline
    preload="auto"
    class="video"
    :controls="false"
  >
  </video>
</template>

<style scoped>
.video {

}
</style>