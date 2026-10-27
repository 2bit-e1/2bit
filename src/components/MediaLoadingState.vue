<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import animation from '@/assets/preloadanim.mp4';

const props = defineProps({
  state: { type: String, default: 'loading' },
  visible: { type: Boolean, default: true },
  large: Boolean,
});
defineEmits(['retry']);
const videoRef = ref(null);
const busy = computed(() => ['idle', 'loading', 'buffering'].includes(props.state));
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

function syncPlayback() {
  const video = videoRef.value;
  if (!video) return;
  if (props.large && props.visible && busy.value && !document.hidden && !motion.matches) video.play()?.catch(() => {});
  else video.pause();
}
watch([() => props.visible, () => props.large, busy], async () => {
  syncPlayback();
  await nextTick();
  syncPlayback();
}, { immediate: true });
onMounted(() => {
  document.addEventListener('visibilitychange', syncPlayback);
  motion.addEventListener('change', syncPlayback);
});
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', syncPlayback);
  motion.removeEventListener('change', syncPlayback);
  videoRef.value?.pause();
});
</script>

<template>
  <div v-if="visible && state !== 'ready' && (large || !busy)" class="media-loading-state" :class="{ 'media-loading-state_large': large }"
    role="status" aria-live="polite" :aria-busy="busy" aria-label="Загрузка медиа" @pointerdown.stop @pointerup.stop @click.stop>
    <video v-if="large && busy" ref="videoRef" :src="animation" muted loop playsinline preload="auto" aria-hidden="true" @loadeddata="syncPlayback" />
    <p v-if="state === 'error'">Не удалось загрузить медиа</p>
    <p v-else-if="state === 'blocked'">Видео готово к запуску</p>
    <button v-if="state === 'error' || state === 'blocked'" type="button" :aria-label="state === 'blocked' ? 'Воспроизвести видео' : 'Повторить загрузку'"
      @click.stop="$emit('retry')">{{ state === 'blocked' ? 'Воспроизвести' : 'Повторить' }}</button>
  </div>
</template>

<style scoped>
.media-loading-state { position: absolute; inset: 0; z-index: 15; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; pointer-events: none; }
.media-loading-state video { width: 56px; height: 56px; object-fit: contain; background: #000; flex: 0 0 auto; }
.media-loading-state_large video { width: 100px; height: 100px; }
.media-loading-state p, .media-loading-state button { padding: 4px 8px; background: var(--bg-clr-white, #f8f8f8); color: var(--clr-black, #111); font-size: 12px; line-height: 1.4; text-align: center; max-width: min(250px, 90%); }
.media-loading-state button { pointer-events: auto; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
.media-loading-state button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
</style>
