<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { createMediaWindow } from '@/utils/mediaWindow';
const props = defineProps({ src: String });
const emit = defineEmits(['stateChange']);
const imageRef = ref(null);
let mediaWindow;
defineExpose({ retry: () => mediaWindow?.retry(imageRef.value) });
onMounted(() => {
  mediaWindow = createMediaWindow({ onStateChange: (_element, state, info) => emit('stateChange', { state, ...info }) });
  mediaWindow.setFrames([imageRef.value]);
});
watch(() => props.src, () => mediaWindow?.setFrames([imageRef.value]), { flush: 'post' });
onBeforeUnmount(() => mediaWindow?.destroy());
</script>

<template><img ref="imageRef" :data-media-src="src" alt="" /></template>
