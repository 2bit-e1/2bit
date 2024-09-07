import { useProjectStore } from "@/stores/project";
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue";

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

    const isScrollBottom = scrollTop > lastScrollTop.value
    lastScrollTop.value = scrollTop;
    const scrollTopRatio = (scrollTop + clientHeight) / scrollHeight;

    scrollImagesData.forEach(
      ({ imageRef, startComeRatio, startLeaveRatio }, imageInd) => {
        let imageBottom = 0;
        let imageScale = 1;
        const maxScalePercent = 10;
        const autoScrollDelay = 150;

        if (scrollTopRatio >= startLeaveRatio) {
          //если картинка должна уходить наверх
          imageBottom =
            (100 * (scrollTopRatio - startLeaveRatio)) / scrollRatioStep;
          imageScale =
            maxScalePercent *
            min((scrollTopRatio - startLeaveRatio) / scrollRatioStep, 1);

          if ((isScrollBottom && imageBottom > 0 && imageBottom < 25) || (!isScrollBottom && imageBottom > 0 && imageBottom < 75)) {
            if (autoScrollTimeoutId) clearTimeout(autoScrollTimeoutId.value);

            autoScrollTimeoutId.value = setTimeout(() => {
              const { scrollHeight, clientHeight } = document.documentElement;
              const curImageTopValue =
                scrollHeight * startLeaveRatio - clientHeight;

              window.scrollTo({
                top: curImageTopValue,
                behavior: "smooth",
              });
            }, autoScrollDelay);
          }
        } else {
          //если картинка должна приходить снизу
          imageBottom =
            (-100 * (startLeaveRatio - scrollTopRatio)) / scrollRatioStep;

          if (imageBottom > -50 && imageBottom < 1) setCurrentImage(imageInd);

          if ((isScrollBottom && imageBottom > -75 && imageBottom < 0) || (!isScrollBottom && imageBottom > -25 && imageBottom < 0)) {
            if (autoScrollTimeoutId) clearTimeout(autoScrollTimeoutId.value);

            autoScrollTimeoutId.value = setTimeout(() => {
              const { scrollHeight, clientHeight } = document.documentElement;
              const curImageTopValue =
                scrollHeight * startLeaveRatio - clientHeight;

              window.scrollTo({
                top: curImageTopValue,
                behavior: "smooth",
              });
            }, autoScrollDelay);
          }

          imageScale =
            -maxScalePercent *
            min((scrollTopRatio - startLeaveRatio) / scrollRatioStep, 1);
        }

        imageRef.style.scale = 1 - 0.01 * imageScale;
        imageRef.style.bottom = imageBottom + "%";
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

  watchEffect(() => {
    if (projectStore.isInfoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });
};
