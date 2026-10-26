<script setup>
import { useHomeStore } from "@/stores/home";
import { HOME_LOGO_ANIMATION, PAGE_NAMES, ROUTES } from "@/utils/constants";
import { RouterLink } from "vue-router";
import AppearWord from "../Appear/AppearWord.vue";
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import '@dotlottie/player-component';

const props = defineProps({
  isActive: Boolean,
  pageName: String,
});

const homeStore = useHomeStore();

const lottiePlayer = ref(null);
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const activityEvents = ['pointermove', 'pointerdown', 'keydown', 'wheel'];
let idleTimer;
let lastActivityAt = 0;

function canAnimate() {
  return props.isActive && !document.hidden && !motionQuery.matches && lottiePlayer.value?.getLottie()?.isLoaded;
}

function clearIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = undefined;
}

function scheduleIdle(delay = HOME_LOGO_ANIMATION.idleDelayMs) {
  clearIdleTimer();
  if (HOME_LOGO_ANIMATION.idleEnabled && HOME_LOGO_ANIMATION.idleDelayMs > 0 && canAnimate()) {
    idleTimer = setTimeout(checkIdle, delay);
  }
}

function resetIdleCountdown() {
  lastActivityAt = performance.now();
  scheduleIdle();
}

function recordActivity() {
  lastActivityAt = performance.now();
  // Keep one pending timeout instead of replacing it on every pointer movement.
  if (idleTimer === undefined) scheduleIdle();
}

function checkIdle() {
  idleTimer = undefined;
  if (!canAnimate()) return;
  const remaining = HOME_LOGO_ANIMATION.idleDelayMs - (performance.now() - lastActivityAt);
  if (remaining > 0) {
    scheduleIdle(remaining);
  } else if (lottiePlayer.value.getLottie().isPaused === false) {
    resetIdleCountdown();
  } else {
    playAnimation();
  }
}

const playAnimation = () => {
  if (!canAnimate()) return;
  lottiePlayer.value.stop();
  lottiePlayer.value.play();
  resetIdleCountdown();
};

function removeActivityListeners() {
  activityEvents.forEach(event => window.removeEventListener(event, recordActivity, true));
}

function syncAnimation() {
  clearIdleTimer();
  removeActivityListeners();
  if (!canAnimate()) {
    lottiePlayer.value?.stop();
    return;
  }
  if (HOME_LOGO_ANIMATION.idleEnabled) {
    activityEvents.forEach(event => window.addEventListener(event, recordActivity, { passive: true, capture: true }));
  }
  resetIdleCountdown();
}

watch(() => props.isActive, syncAnimation, { flush: 'post' });

onMounted(() => {
  document.addEventListener('visibilitychange', syncAnimation);
  motionQuery.addEventListener('change', syncAnimation);
  syncAnimation();
});

onBeforeUnmount(() => {
  clearIdleTimer();
  removeActivityListeners();
  document.removeEventListener('visibilitychange', syncAnimation);
  motionQuery.removeEventListener('change', syncAnimation);
});
</script>

<template>
  <div
    class="footer-item footer-item_home"
    :class="{
      'footer-item_active': isActive,
      'footer-item_home-dim': !!homeStore.activeProjectName,
    }"
    :aria-hidden="!isActive"

  >
    <RouterLink class="hoverable home-btn" :to="ROUTES.process" :tabindex="isActive ? 0 : -1">
      <div class="home-btn-inner">
        <span class="home-btn-text hoverable-from-black">
          <AppearWord
            word="Обзор"
            :isAppear="pageName == PAGE_NAMES.home"
            :delayOrder="1"
          />
        </span>
      </div>
    </RouterLink>  
        <div class="home-eyes home-btn" >
       <dotlottie-player 
        ref="lottiePlayer" 
        src="https://lottie.host/74f05f9b-4bae-48fb-b68e-97d2f81690ad/mnan8HSNBX.json" 
        background="transparent" 
        speed="1" 
        style="width: 90px; height: 90px" 
        direction="1" 
        playMode="normal" 
        @ready="syncAnimation"
        @mouseenter="playAnimation"
        @touchstart="playAnimation"
        @click="playAnimation"
      >
      </dotlottie-player>
    </div>
    <RouterLink class="hoverable home-btn" :to="ROUTES.me" :tabindex="isActive ? 0 : -1">
      <div class="home-btn-inner">
        <span class="home-btn-text hoverable-from-black">
          <AppearWord
            word="Био"
            :isAppear="pageName == PAGE_NAMES.home"
            :delayOrder="2"
          />
        </span>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.footer-item_home {
  bottom: 25px !important;
}

.home-btn {
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-btn:nth-child(1) {
  grid-column: 2 / 3;
}

.home-btn:nth-child(2) {
  grid-column: 3 / 4;
}

.home-btn:nth-child(3) {
  grid-column: 4 / 5;
}

.home-btn-inner {
  overflow: hidden;
}

.home-btn-text {
  display: flex;
  justify-content: center;
  color: var(--clr-black);
  transition: color 150ms;
}

.home-eyes {
  column-gap: 9px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
  display: flex;
  filter: brightness(0) invert(var(--preview-logo-invert, 0));
  -webkit-tap-highlight-color: transparent;
}

.footer-item_active .home-eyes {
  opacity: 1;
  visibility: visible;
  transition-delay: 0.3s; /* Опциональная задержка для синхронизации с другими элементами */
}

.home-eye-item {
  width: 10px;
  height: 10px;
  background-color: var(--clr-black);
}

.footer-item_home-dim .home-btn-text {
  color: var(--clr-gray);
}

@media (max-width: 1024px) {
  
  .home-btn {
    padding: 0px 0px 33px 0px !important;
  }

  .footer-item_home {
    bottom: 0px !important;
    padding: 0px !important;
  }
 

  .home-btn:nth-child(1) {
    grid-column: 2 / 4;
  }
  
  .home-btn:nth-child(2) {
    grid-column: 6 / 8;
  }

  .home-btn:nth-child(3) {
    grid-column: 10 / 12;
  }

  .home-eyes {
    column-gap: 14px;
  }
}

@media (max-width: 768px) {
  .home-btn {
    padding: 0px 0px 10px 0px !important;
  }

  .footer-item_home {
    bottom: 0px !important;
    padding: 0px !important;
  }
}

@media (max-width: 850px) and (max-height: 1050px) {
  .footer-item {
    display: flex !important;
    justify-content: space-around !important;
    width: 93vw !important;
    padding-bottom: 0 !important;
  }
}

@media (max-width: 1024px) and (max-height: 1366px) {
   .footer-item {
    display: flex !important;
    justify-content: space-around !important;
    width: 93vw !important;
    padding-bottom: 0 !important;
  }
} 


@media (max-width: 768px) and (max-height: 960px) {

 .home-btn:nth-child(1) {
  grid-column: 3 / 4;
}

.home-btn:nth-child(3) {
  grid-column: 9 / 12;
}

}

@media (max-width: 768px) and (max-height: 851px) {

  .footer-item {
    display: flex !important;
    justify-content: space-around !important;
    width: 56vw !important;
    padding-bottom: 0 !important;
  }

  .home-eyes {
    margin-right: 11px;  
  }  

}


@media (max-width: 500px) {

  .home-eyes {
     width: 100px !important;
     grid-column: 5 / 10 !important;
     margin-right: 0;
  }   

  .footer-item {
    display: flex !important;
    justify-content: space-around !important;
    width: 88vw !important;
    padding-bottom: 0 !important;
    height: 10px !important;
    margin-bottom: 71px;
  }

  .home-btn {
    padding: 0px !important;
  }

  dotlottie-player {
    transform: translate3d(-7px, 0px, 0px);
  }
}  

</style>
