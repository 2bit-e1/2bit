<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { createMediaWindow } from '@/utils/mediaWindow';

const props = defineProps({
  videoSrc: String,
  isPlaying: { type: Boolean, default: true },
});
const emit = defineEmits(['stateChange']);

const videoElem = ref(null);
const isVideoLoaded = ref(false);
let mediaWindow;
defineExpose({ retry: () => mediaWindow?.retry(videoElem.value) });

onMounted(() => {
  mediaWindow = createMediaWindow({ onStateChange: (_element, state, info) => emit('stateChange', { state, ...info }) });
  mediaWindow.setSuspended(!props.isPlaying);
  mediaWindow.setFrames([videoElem.value]);
});
watch(() => props.isPlaying, value => mediaWindow?.setSuspended(!value));
watch(() => props.videoSrc, () => {
  isVideoLoaded.value = false;
  mediaWindow?.setFrames([videoElem.value]);
}, { flush: 'post' });
onBeforeUnmount(() => mediaWindow?.destroy());
</script>

<template>
  <video
    :data-media-src="videoSrc"
    ref="videoElem"
    muted
    playsInline
    @loadeddata="isVideoLoaded = true"
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
