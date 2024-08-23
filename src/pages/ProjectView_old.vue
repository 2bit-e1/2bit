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

  scrollImagesData.forEach(
    ({ imageRef, startComeRatio, startLeaveRatio }) => {
      let imageHeight = 0;
      let imageBottom = "";
      const maxLeavePercent = 15;

      if (scrollTopRatio >= startLeaveRatio) {
        imageBottom = maxLeavePercent * min(((scrollTopRatio - startLeaveRatio) / scrollRatioStep), 1);
      }

      imageHeight = round(min(max(((scrollTopRatio - startComeRatio) / scrollRatioStep) * 100, 0), 100));
      imageRef.style.height = imageHeight + "vh";

      if (imageBottom) imageRef.style.bottom = imageBottom + "vh"
      else imageRef.style.bottom = "";
    }
  );

  const nearestImage = scrollImagesData.find(({ startLeaveRatio }) => abs(scrollTopRatio - startLeaveRatio) < 0.05);
  const autoScrollDelay = 250;
  if (autoScrollTimeoutId) clearTimeout(autoScrollTimeoutId.value);

  if (nearestImage) {  
    autoScrollTimeoutId.value = setTimeout(() => {
      const { scrollHeight, clientHeight } = document.documentElement;
      const curImageTopValue =  scrollHeight * nearestImage.startLeaveRatio - clientHeight;

      window.scrollTo({
        top: curImageTopValue,
        behavior: "smooth",
      });
    }, autoScrollDelay);
  }
  
  requestAnimationFrame((timestamp) => {
    scrollImagesRAFLoop(timestamp, scrollImagesData, scrollRatioStep);
  });
}

const handleScrollImagesRAF = () => {
  isScrollingRAFActive.value = true
  
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
}

const changeImagesByScroll = () => {
  window.addEventListener("scroll", () => {
    if (!isScrollingRAFActive.value) handleScrollImagesRAF()
  });
};

const activeImageInd = ref(0);
const changeImagesBySlide = () => {
  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    let nextActiveImgInd;
    let animatedImg;

    if (scrollTop > lastScrollTop.value) {
      nextActiveImgInd = activeImageInd.value + 1;
      const nextImg = imagesRefs.value[nextActiveImgInd];
      // const activeImg = imagesRefs.value[activeImageInd.value]
      nextImg.style.top = "0";
      animatedImg = nextImg;
    } else {
      nextActiveImgInd = activeImageInd.value - 1;
      const activeImg = imagesRefs.value[activeImageInd.value];
      activeImg.style.top = "100vh";
      animatedImg = activeImg;
    }

    animatedImg.addEventListener(
      "transitionend",
      () => {
        activeImageInd.value = nextActiveImgInd;
      },
      { once: true }
    );

    lastScrollTop.value = scrollTop;
  });
};

onMounted(() => {
  changeImagesByScroll();

  // changeImagesBySlide()
});
</script>

<template>
  <div
    class="wrapper"
    :style="{ height: imagesSrc.length * 100 + 'vh' }"
    ref="wrapperRef"
  >
    <div class="images-container">
      <img
        v-for="imageSrc in imagesSrc"
        :src="imageSrc"
        :ref="(el) => imagesRefs.push(el)"
      />
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

.images-container img {
  position: absolute;
  width: 100vw;
  height: 0;
  object-fit: cover;
  left: 0;
  bottom: 0;
}

.images-container img:first-child {
  height: 100vh;
}
</style>
