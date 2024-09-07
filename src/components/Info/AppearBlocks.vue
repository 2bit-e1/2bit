<script setup>
import { onMounted, ref, useTemplateRef } from "vue";
import { appearDelayStep } from "./utils";

const props = defineProps({
  initialDelay: [Number, null],
  isAppearReady: Boolean
});
const emits = defineEmits(["setDelay"]);
const blocksCount = ref(0);
const appearBlocksRef = ref(null);

onMounted(() => {
  document.fonts.ready.then(() => {
    const blocksHeight = parseInt(
      getComputedStyle(appearBlocksRef.value).height
    );
    
    blocksCount.value = Math.ceil(blocksHeight / 16);
    emits("setDelay", appearDelayStep * blocksCount.value);
  });
});
</script>

<template>
  <div
    class="appear-blocks"
    :class="isAppearReady ? '' : 'appear-blocks_loading'"
    ref="appearBlocksRef"
  >
    <div
      v-if="isAppearReady"
      v-for="(i, ind) in blocksCount"
      class="appear-block"
      :style="{ 'animation-delay': (initialDelay + ind * appearDelayStep) + 'ms' }"
    ></div>
  </div>
</template>

<style scoped>
.appear-blocks {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.appear-blocks_loading {
  background-color: var(--bg-clr-white);
}

.appear-block {
  pointer-events: none;
  height: 16px;
  width: 100%;
  background-color: var(--bg-clr-white);
}

.appear-blocks:not(.appear-blocks_loading) .appear-block {
  animation: appear 300ms forwards;
}

@keyframes appear {
  0% {
    background-color: var(--bg-clr-white);
  }

  100% {
    background-color: transparent;
  }
}
</style>
