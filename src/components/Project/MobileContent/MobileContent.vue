<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const { imagesSrc } = defineProps({
  imagesSrc: Array
});

const observer = ref(null);

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("in-view")) {
          entry.target.classList.add("in-view");
          observer.value.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 } // можно немного увеличить, чтобы анимация была более плавной
  );

  document.querySelectorAll(".image-box").forEach((el) => {
    observer.value.observe(el);
  });
});

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<template>
  <div class="scroller-vertical">
    <div
      v-for="(imageSrc, ind) in imagesSrc"
      :key="ind"
      class="image-box"
    >
      <img :src="imageSrc" loading="lazy" />
    </div>
  </div>
</template>

<style scoped>
.scroller-vertical {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 80px 0;
}

.image-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: center center;
  transform: scaleY(0.5);
  opacity: 0;
  transition: transform 0.8s ease, opacity 0.8s ease;
  will-change: transform, opacity;
}

.image-box.in-view {
  transform: scaleY(1);
  opacity: 1;
}

.image-box img {
  max-height: 70vh;
  width: auto;
  max-width: calc(100% - 40px);
  object-fit: cover;
  object-position: center;
}
</style>
