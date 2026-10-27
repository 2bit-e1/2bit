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
const mediaFrame = () => videoElem.value?.closest('[data-media-frame]') || videoElem.value;
defineExpose({ retry: () => mediaWindow?.retry(mediaFrame()) });

onMounted(() => {
  mediaWindow = createMediaWindow({ onStateChange: (_element, state, info) => emit('stateChange', { state, ...info }) });
  mediaWindow.setSuspended(!props.isPlaying);
  mediaWindow.setFrames([mediaFrame()]);
});
watch(() => props.isPlaying, value => mediaWindow?.setSuspended(!value));
watch(() => props.videoSrc, () => {
  isVideoLoaded.value = false;
  mediaWindow?.setFrames([mediaFrame()]);
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
