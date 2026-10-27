<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { createMediaWindow } from '@/utils/mediaWindow';
const props = defineProps({ src: String });
const emit = defineEmits(['stateChange']);
const imageRef = ref(null);
let mediaWindow;
const mediaFrame = () => imageRef.value?.closest('[data-media-frame]') || imageRef.value;
defineExpose({ retry: () => mediaWindow?.retry(mediaFrame()) });
onMounted(() => {
  mediaWindow = createMediaWindow({ onStateChange: (_element, state, info) => emit('stateChange', { state, ...info }) });
  mediaWindow.setFrames([mediaFrame()]);
});
watch(() => props.src, () => mediaWindow?.setFrames([mediaFrame()]), { flush: 'post' });
onBeforeUnmount(() => mediaWindow?.destroy());
</script>

<template><img ref="imageRef" :data-media-src="src" alt="" /></template>
