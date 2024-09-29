import { useProjectStore } from "@/stores/project";
import { useDisableScroll } from "@/utils/useDisableScroll";
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";

export const useHandleScrollImages = (
  imagesRefs,
  isFirstImageAppear,
  setCurrentImage
) => {
  const { min, abs } = Math;
  const autoScrollTimeoutId = ref(null);
  const isScrollingRAFActive = ref(false);
  const lastScrollTop = ref(null);
  const lastImageBottom = ref({
    0: 0,
    0.25: -100,
    0.5: -100,
    0.75: -100,
  });

  const scrollImagesRAFLoop = (
    timestamp,
    scrollImagesData,
    scrollRatioStep
  ) => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop == lastScrollTop.value) {
      isScrollingRAFActive.value = false;
      return;
    }

    const isScrollBottom = scrollTop > lastScrollTop.value;
    console.log("isScrollBottom", isScrollBottom);
    
    lastScrollTop.value = scrollTop;
    const scrollTopRatio = (scrollTop + clientHeight) / scrollHeight;

    scrollImagesData.forEach(
      ({ imageRef, startComeRatio, startLeaveRatio }, imageInd) => {
        let imageBottom = 0;
        let imageScale = 1;
        let imageClipPath = "";
        const maxScalePercent = 10;
        const autoScrollDelay = 150;

        const imageDisaplyPercent =
            (100 * (startLeaveRatio - scrollTopRatio)) / scrollRatioStep;
        
        if (scrollTopRatio >= startLeaveRatio) {
          imageClipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
          //если картинка должна уходить наверх
          imageBottom = imageDisaplyPercent;
          // imageScale =
          //   maxScalePercent *
          //   min((scrollTopRatio - startLeaveRatio) / scrollRatioStep, 1);

          // if (
          //   (isScrollBottom && imageDisaplyPercent > 0 && imageDisaplyPercent < 25) ||
          //   (!isScrollBottom && imageDisaplyPercent > 0 && imageDisaplyPercent < 75)
          // ) {
          // if (imageDisaplyPercent > 0 && imageDisaplyPercent < 50) {
          //   if (autoScrollTimeoutId) clearTimeout(autoScrollTimeoutId.value);

          //   autoScrollTimeoutId.value = setTimeout(() => {
          //     const { scrollHeight, clientHeight } = document.documentElement;
          //     const curImageTopValue =
          //       scrollHeight * startLeaveRatio - clientHeight;

          //     window.scrollTo({
          //       top: curImageTopValue,
          //       behavior: "smooth",
          //     });
          //   }, autoScrollDelay);
          // }
        } else {
          imageClipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
          //если картинка должна приходить снизу
          imageBottom = -1 * imageDisaplyPercent;
          imageClipPath = `polygon(0% ${min(imageDisaplyPercent, 100)}%, 100% ${min(imageDisaplyPercent, 100)}%, 100% 100%, 0% 100%)`;

          if (imageDisaplyPercent < 50 && imageDisaplyPercent > -1) setCurrentImage(imageInd);

          // if (
          //   (isScrollBottom && imageDisaplyPercent > 50 && imageDisaplyPercent <= 100) ||
          //   (!isScrollBottom && imageDisaplyPercent > 0 && imageDisaplyPercent <= 50)
          // ) {
          // // if (imageDisaplyPercent > 50 && imageDisaplyPercent < 100) {
          //   if (autoScrollTimeoutId) clearTimeout(autoScrollTimeoutId.value);

          //   autoScrollTimeoutId.value = setTimeout(() => {
          //     const { scrollHeight, clientHeight } = document.documentElement;
          //     const curImageTopValue =
          //       scrollHeight * startLeaveRatio - clientHeight;

          //     window.scrollTo({
          //       top: curImageTopValue,
          //       behavior: "smooth",
          //     });
          //   }, autoScrollDelay);
          // }

          // imageScale =
          //   -maxScalePercent *
          //   min((scrollTopRatio - startLeaveRatio) / scrollRatioStep, 1);
        }

        // imageRef.style.scale = 1 - 0.01 * imageScale;
        // imageRef.style.bottom = imageBottom + "%";
        imageRef.style.clipPath = imageClipPath;
      }
    );

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

  const handleLoadFirstImg = () => {
    const firstImage =
      imagesRefs.value[imagesRefs.value.length - 1].querySelector("img");
    firstImage.onload = () => {
      isFirstImageAppear.value = true;
    };
  };

  const windowScrollHandler = () => {
    if (!isScrollingRAFActive.value) handleScrollImagesRAF();
  };

  onMounted(() => {
    document.addEventListener("scroll", windowScrollHandler);
    handleLoadFirstImg();
  });

  onBeforeUnmount(() => {
    document.removeEventListener("scroll", windowScrollHandler);
  });
};

export const useDisableScrollOnInfoOpen = () => {
  const projectStore = useProjectStore();

  const disableScrollCondition = computed(() => projectStore.isInfoOpen);
  useDisableScroll(disableScrollCondition);
};
