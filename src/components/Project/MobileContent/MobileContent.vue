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
    { threshold: 0.3 }
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
      <div class="image-wrapper">
        <img :src="imageSrc" loading="lazy" />
        <div class="mask" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroller-vertical {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 102px 0;
  background: #f8f8f8;
}

.image-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Обёртка вокруг изображения и маски */
.image-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Маска */
.mask {
  position: absolute;
  inset: 0;
  background: #f8f8f8;
  z-index: 2;
  transform: translateY(0%);
  transition: transform 0.8s ease;
  will-change: transform;
}

/* Картинка */
.image-wrapper img {
  position: relative;
  z-index: 1;
  width: auto;
  height: 100%;
  max-width: calc(100% - 40px);
  object-fit: cover;
  object-position: center;
  transform: scale(1.2);
  transition: transform 0.8s ease;
  will-change: transform;
}

/* При появлении */
.image-box.in-view .mask {
  transform: translateY(-100%);
}

.image-box.in-view img {
  transform: scale(1);
}
</style>
