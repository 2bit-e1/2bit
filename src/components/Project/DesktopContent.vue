<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useProjectStore } from "@/stores/project";

const { imagesSrc } = defineProps({
  imagesSrc: Array
});

const projectStore = useProjectStore();

const observer = ref(null);

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("in-view")) {
          entry.target.classList.add("in-view");
          observer.value.unobserve(entry.target); // отписываемся от элемента после первой активации
        }
      });
    },
    {
      threshold: 0.4,
    }
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
  gap: 20px;
  padding: 100px 0;
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

/* активируется один раз */
.image-box.in-view {
  transform: scaleY(1);
  opacity: 1;
}

.image-box img {
  min-height: 50vh;
  width: auto;
  max-width: calc(100% - 214px);
  object-fit: cover;
  object-position: center;
}
</style>
