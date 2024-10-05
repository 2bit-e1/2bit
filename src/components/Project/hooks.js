import { useProjectStore } from "@/stores/project";
import { useDisableScroll } from "@/utils/useDisableScroll";
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";

export const useHandleScrollImages = (
  imagesRefs,
  isFirstImageAppear,
  setCurrentImage
) => {
  const { max, min, round, abs } = Math;

  const autoScrollTimeoutId = ref(null);
  const isScrollingRAFActive = ref(false);
  const lastScrollTop = ref(null);

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

    const isScrollBottom = lastScrollTop.value <= scrollTop;
    lastScrollTop.value = scrollTop;
    const scrollTopRatio = (scrollTop + clientHeight) / scrollHeight;

    scrollImagesData.forEach(
      (
        { imageRef: imageBoxRef, startComeRatio, startLeaveRatio },
        imageInd
      ) => {
        let imageDisplayPercent = 0;
        let imageHeight = 0;
        let imageBottom = "";
        let imageOpacity = "";
        const maxLeavePercent = 15;

        if (scrollTopRatio >= startLeaveRatio) {
          imageBottom =
            maxLeavePercent *
            min((scrollTopRatio - startLeaveRatio) / scrollRatioStep, 1);
        }

        if (scrollTopRatio >= startLeaveRatio) {
          imageOpacity =
            1 - min((scrollTopRatio - startLeaveRatio) / scrollRatioStep, 1);
        }

        imageDisplayPercent = max(
          ((scrollTopRatio - startComeRatio) / scrollRatioStep) * 100,
          0
        );

        imageHeight = round(
          min(
            max(((scrollTopRatio - startComeRatio) / scrollRatioStep) * 100, 0),
            100
          )
        );

        if (
          +scrollTopRatio.toFixed(2) > +startComeRatio.toFixed(2) &&
          +scrollTopRatio.toFixed(2) <= +startLeaveRatio.toFixed(2)
        ) {
          setCurrentImage(imageInd);
          setCurrentImage(imageInd);
        }

        // imageBoxRef.querySelector("img").style.height = imageHeight + "vh";
        imageBoxRef.querySelector("img").style.clipPath = `polygon(0% ${
          100 - imageHeight
        }%, 100% ${100 - imageHeight}%, 100% 100%, 0% 100%)`;

        if (!isNaN(imageOpacity))
          imageBoxRef.querySelector("img").style.opacity = imageOpacity;
        else imageBoxRef.querySelector("img").style.opacity = "";

        const autoScrollDelay = 150;

        if (scrollTopRatio >= startLeaveRatio) {
          if (imageInd < 2) console.log(imageInd, imageDisplayPercent);
          //если картинка должна уходить/приходить сверху
          if (
            (imageDisplayPercent >= 100 && imageDisplayPercent <= 150)
            // (!isScrollBottom && imageDisplayPercent >= 100 && imageDisplayPercent <= 125) ||
            // (isScrollBottom && imageDisplayPercent > 175 && imageDisplayPercent <= 200)
          ) {
            if (autoScrollTimeoutId.value)
              clearTimeout(autoScrollTimeoutId.value);

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
          if (imageInd < 2)
            console.log(imageInd, imageDisplayPercent, isScrollBottom);

          if (
              imageDisplayPercent > 50 &&
              imageDisplayPercent < 100
            // (isScrollBottom &&
            //   imageDisplayPercent > 25 &&
            //   imageDisplayPercent < 100) ||
            // (!isScrollBottom &&
            //   imageDisplayPercent > 1 &&
            //   imageDisplayPercent < 75)
          ) {
            if (autoScrollTimeoutId.value)
              clearTimeout(autoScrollTimeoutId.value);

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
        }

        // if (imageBottom) imageBoxRef.querySelector("img").style.bottom = imageBottom + "vh";
        // else imageBoxRef.querySelector("img").style.bottom = "";
      }
    );

    // const nearestImage =
    //   scrollImagesData.find(
    //     ({ startLeaveRatio, startComeRatio }) =>
    //       scrollTopRatio > startComeRatio &&
    //       scrollTopRatio < startLeaveRatio &&
    //       abs(scrollTopRatio - startLeaveRatio) < scrollRatioStep * 0.25
    //   ) ||
    //   scrollImagesData.find(
    //     ({ startLeaveRatio }) =>
    //       abs(scrollTopRatio - startLeaveRatio) > scrollRatioStep * 0.25
    //   );
    // const nearestImage = scrollImagesData.find(
    //   ({ startLeaveRatio }) => abs(scrollTopRatio - startLeaveRatio) < (scrollRatioStep * 0.25)
    // ) || scrollImagesData.find(
    //   ({ startLeaveRatio }) => abs(scrollTopRatio - startLeaveRatio) > (scrollRatioStep * 0.25)
    // );
    // const autoScrollDelay = 150;
    // if (autoScrollTimeoutId) clearTimeout(autoScrollTimeoutId.value);

    // if (nearestImage) {
    //   autoScrollTimeoutId.value = setTimeout(() => {
    //     const { scrollHeight, clientHeight } = document.documentElement;
    //     const curImageTopValue =
    //       scrollHeight * nearestImage.startLeaveRatio - clientHeight;

    //     window.scrollTo({
    //       top: curImageTopValue,
    //       behavior: "smooth",
    //     });
    //   }, autoScrollDelay);
    // }

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
};

export const useDisableScrollOnInfoOpen = () => {
  const projectStore = useProjectStore();

  const disableScrollCondition = computed(() => projectStore.isInfoOpen);
  useDisableScroll(disableScrollCondition);
};
