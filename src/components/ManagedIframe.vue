<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { createMediaWindow } from '@/utils/mediaWindow';

const props = defineProps({
  src: String,
  isActive: { type: Boolean, default: true },
});
const emit = defineEmits(['stateChange']);
const frameRef = ref(null);
let mediaWindow;

// Expose a command, not a cross-origin WindowProxy that Vue would try to unwrap.
defineExpose({
  postMessage: (message, origin) => frameRef.value?.contentWindow?.postMessage(message, origin),
  retry: () => mediaWindow?.retry(frameRef.value),
});

onMounted(() => {
  mediaWindow = createMediaWindow({ onStateChange: (_element, state, info) => emit('stateChange', { state, ...info }) });
  mediaWindow.setSuspended(!props.isActive);
  mediaWindow.setFrames([frameRef.value]);
});
watch(() => props.isActive, value => mediaWindow?.setSuspended(!value));
watch(() => props.src, () => mediaWindow?.setFrames([frameRef.value]), { flush: 'post' });
onBeforeUnmount(() => mediaWindow?.destroy());
</script>

<template>
  <iframe ref="frameRef" :data-media-src="src" />
</template>
