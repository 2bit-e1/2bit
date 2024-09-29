<script setup>
import { useTemplateRef, ref, watchEffect } from "vue";
import { useDisableScrollOnInfoOpen, useHandleScrollImages } from "./hooks";
import { useProjectStore } from "@/stores/project";

const { imagesSrc } = defineProps({
  imagesSrc: Array
})

const imagesRefs = useTemplateRef('imagesBoxes');
const projectStore = useProjectStore();
const isFirstImageAppear = ref(false);

useHandleScrollImages(imagesRefs, isFirstImageAppear, projectStore.setCurrentImage);

useDisableScrollOnInfoOpen();

// watchEffect(() => {
//   if (!projectStore.isInfoOpen) {
//     projectStore.setCurrentImage(0);
//   }
// })

</script>

<template>
  <div
    class="desktop-content"
    :style="{ height: imagesSrc.length * 100 + 'vh' }"
  >
    <div class="images-container">
      <div
        v-for="(imageSrc, ind) in imagesSrc"
        class="image-box"
        :class="{ 'image-box_appear': isFirstImageAppear && ind == 0 }"
        ref="imagesBoxes"
      >
        <img :src="imageSrc" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.desktop-content {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.images-container {
  position: fixed;
  top: var(--header-height);
  bottom: var(--footer-height);
  width: 100%;
  overflow: hidden;
}

.image-box {
  position: absolute;
  width: 100vw;
  height: 100%;
  left: 0;
  bottom: -100%;
  bottom: 0;
  height: 0;
  display: flex;
  justify-content: center;
}

.image-box img {
  height: 100vh;
  object-fit: cover;
  object-position: bottom;
}

.image-box_appear {
  animation: appear 300ms;
  bottom: 0;
}

@keyframes appear {
  0% {
    scale: 0.8;
    bottom: -100%;
  }

  100% {
    scale: 1;
    bottom: 0;
  }
}
</style>
