<script setup>
import { onMounted, ref } from "vue";
const { max, min, round, abs } = Math;
const imagesSrc = [
  "https://images.unsplash.com/photo-1604247416063-e0e6aaf47b0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlmZmVyZW50JTIwc2l6ZXN8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1673597080829-89755cc852d4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGlmZmVyZW50JTIwc2l6ZXN8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZGlmZmVyZW50JTIwc2l6ZXN8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1604247416063-e0e6aaf47b0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlmZmVyZW50JTIwc2l6ZXN8ZW58MHx8MHx8fDA%3D",
];
const wrapperRef = ref(null);
const imagesRefs = ref([]);

const autoScrollTimeoutId = ref(null);
const isScrollingRAFActive = ref(false);
const lastScrollTop = ref(null);

const scrollImagesRAFLoop = (timestamp, scrollImagesData, scrollRatioStep) => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  if (scrollTop == lastScrollTop.value) {
    isScrollingRAFActive.value = false;
    return;
  }

  lastScrollTop.value = scrollTop;
  const scrollTopRatio = (scrollTop + clientHeight) / scrollHeight;

  scrollImagesData.forEach(({ imageRef, startComeRatio, startLeaveRatio }) => {
    let imageBottom = 0;
    let imageScale = 1;
    const maxScalePercent = 10;

    if (scrollTopRatio >= startLeaveRatio) {
      //если картинка должна уходить наверх
      imageBottom =
        (100 * (scrollTopRatio - startLeaveRatio)) / scrollRatioStep;
      imageScale =
        maxScalePercent *
        min((scrollTopRatio - startLeaveRatio) / scrollRatioStep, 1);
    } else {
      //если картинка должна приходить снизу
      imageBottom =
        (-100 * (startLeaveRatio - scrollTopRatio)) / scrollRatioStep;
      imageScale =
        -maxScalePercent *
        min((scrollTopRatio - startLeaveRatio) / scrollRatioStep, 1);
    }

    imageRef.style.scale = 1 - 0.01 * imageScale;
    imageRef.style.bottom = imageBottom + "%";
  });

  const nearestImage = scrollImagesData.find(
    ({ startLeaveRatio }) => abs(scrollTopRatio - startLeaveRatio) < 0.05
  );
  const autoScrollDelay = 250;
  if (autoScrollTimeoutId) clearTimeout(autoScrollTimeoutId.value);

  if (nearestImage) {
    autoScrollTimeoutId.value = setTimeout(() => {
      const { scrollHeight, clientHeight } = document.documentElement;
      const curImageTopValue =
        scrollHeight * nearestImage.startLeaveRatio - clientHeight;

      window.scrollTo({
        top: curImageTopValue,
        behavior: "smooth",
      });
    }, autoScrollDelay);
  }

  requestAnimationFrame((timestamp) => {
    scrollImagesRAFLoop(timestamp, scrollImagesData, scrollRatioStep);
  });
};

const handleScrollImagesRAF = () => {
  isScrollingRAFActive.value = true;

  const imagesCount = imagesRefs.value.length;
  const scrollRatioStep = 1 / imagesCount;
  const scrollImagesData = imagesRefs.value.map((imageRef, ind) => {
    const startComeRatio = scrollRatioStep * ind;
    const startLeaveRatio = scrollRatioStep * (ind + 1);
    return {
      imageRef,
      startComeRatio,
      startLeaveRatio,
    };
  });

  requestAnimationFrame((timestamp) => {
    scrollImagesRAFLoop(timestamp, scrollImagesData, scrollRatioStep);
  });
};

const changeImagesByScroll = () => {
  window.addEventListener("scroll", () => {
    if (!isScrollingRAFActive.value) handleScrollImagesRAF();
  });
};

const activeImageInd = ref(0);

onMounted(() => {
  changeImagesByScroll();
});
</script>

<template>
  <div
    class="wrapper"
    :style="{ height: imagesSrc.length * 100 + 'vh' }"
    ref="wrapperRef"
  >
    <div class="images-container">
      <div
        v-for="imageSrc in imagesSrc"
        class="image-box"
        :ref="(el) => imagesRefs.unshift(el)"
      >
        <img :src="imageSrc" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
}

.images-container {
  position: fixed;
  top: 0;
  bottom: 0;
}

.image-box {
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  bottom: -100%;
  display: flex;
  justify-content: center;
}

.image-box img {
  height: 100%;
  object-fit: contain;
}

.image-box:first-child {
  bottom: 0;
}
</style>
