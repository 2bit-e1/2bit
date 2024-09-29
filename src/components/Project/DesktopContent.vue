<script setup>
import { useTemplateRef, ref, watchEffect } from "vue";
import { useDisableScrollOnInfoOpen, useHandleScrollImages } from "./hooks";
import { useProjectStore } from "@/stores/project";

const { imagesSrc } = defineProps({
  imagesSrc: Array
})

const imagesBoxesRefs = useTemplateRef('imagesBoxes');
const projectStore = useProjectStore();
const isFirstImageAppear = ref(true);

useHandleScrollImages(imagesBoxesRefs, isFirstImageAppear, projectStore.setCurrentImage);

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
  bottom: 0;
  display: flex;
  justify-content: center;
}

.image-box img {
  clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  height: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  width: auto;
  max-width: calc(100% - 214px);
  left: 50%;
  translate: -50% 0;
  max-height: calc(100vh - var(--header-height) - var(--footer-height));
  object-fit: cover;
  object-position: bottom;
}

.image-box_appear img {
  animation: appear 300ms forwards;
}

@keyframes appear {
  0% {
    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  }

  100% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}
</style>
