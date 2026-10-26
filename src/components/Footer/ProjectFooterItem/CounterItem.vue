<script setup>
import AppearWord from '@/components/Appear/AppearWord.vue';
import { ref, watch } from 'vue';

const props = defineProps({
  pagesCount: Number, 
  currentPage: Number, 
  delayOrder: Number,
  isActive: Boolean
})

const direction = ref('down');
watch(() => props.currentPage, (current, previous) => {
  direction.value = props.isActive && current < previous ? 'up' : 'down';
}, { flush: 'sync' });

const formatPage = (page) => String(page).padStart(2, '0');

</script>

<template>
  <div class="project-item project-item_counter">
    <div class="project-item-inner">
      <div class="project-counter-current-container">
        <span
          class="project-counter-window"
          :class="{ 'project-counter-window_active': isActive }"
          :data-direction="direction"
          :aria-hidden="!isActive"
        >
          <span class="project-counter-stack">
            <Transition name="project-count" :css="isActive" @before-leave="el => el.setAttribute('aria-hidden', 'true')">
              <span :key="currentPage" class="project-counter-current">{{ formatPage(currentPage) }}</span>
            </Transition>
          </span>
        </span>
      </div>
      
      &nbsp;
      <AppearWord
        :word="`/ ${formatPage(pagesCount)}`"
        :isAppear="isActive"
        :delayOrder="1 + delayOrder"
        class="project-counter-total"
      />
    </div>
  </div>
</template>

<style scoped>
.project-counter-current-container {
  position: relative;
  width: 0;
  height: 15px;
}

.project-counter-window {
  position: absolute;
  right: 1px;
  width: 2ch;
  height: 15px;
  overflow: hidden;
  font-variant-numeric: tabular-nums;
  --count-enter-offset: 105%;
  --count-exit-offset: -105%;
}

.project-counter-window[data-direction="up"] {
  --count-enter-offset: -105%;
  --count-exit-offset: 105%;
}

.project-counter-stack {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translate3d(0, 105%, 0);
  transition:
    transform var(--motion-exit-duration) var(--motion-ease-out),
    opacity var(--motion-exit-duration) ease-out;
}

.project-counter-window_active .project-counter-stack {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  transition-duration: var(--motion-label-duration), 280ms;
  transition-timing-function: var(--motion-ease-reveal), ease-out;
}

.project-counter-current {
  position: absolute;
  inset: 0;
  text-align: right;
  white-space: nowrap;
  line-height: 15px !important;
}

.project-count-enter-active,
.project-count-leave-active {
  transition: transform var(--motion-label-duration) var(--motion-ease-reveal);
}

.project-count-enter-from {
  transform: translate3d(0, var(--count-enter-offset), 0);
}

.project-count-leave-to {
  transform: translate3d(0, var(--count-exit-offset), 0);
}

@media (prefers-reduced-motion: reduce) {
  .project-counter-stack,
  .project-counter-window_active .project-counter-stack,
  .project-counter-current {
    transform: none;
    transition: none;
  }
}
</style>
