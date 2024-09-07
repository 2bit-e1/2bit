import { useProjectStore } from "@/stores/project";
import { onBeforeUnmount, ref, watchEffect } from "vue"

export const useToggleFooterDataOnScroll = (infoAreaRef, isSkip) => {
  const projectStore = useProjectStore();

  const lastScrollTop = ref(0)

  const documentScrollListener = () => {
    if (lastScrollTop.value < document.documentElement.scrollTop) projectStore.hideFooterData()
    else projectStore.showFooterData()
  }

  const infoAreaScrollListener = () => {
    if (lastScrollTop.value < infoAreaRef.value.scrollTop) projectStore.hideFooterData()
    else projectStore.showFooterData()
  }
  
  watchEffect(() => {
    if (isSkip.value) return
    infoAreaRef.value?.removeEventListener("scroll", infoAreaScrollListener);
    document?.removeEventListener("scroll", documentScrollListener);

    infoAreaRef.value?.addEventListener("scroll", infoAreaScrollListener);
    document?.addEventListener("scroll", documentScrollListener);
  })

  onBeforeUnmount(() => {
    infoAreaRef.value?.removeEventListener("scroll", infoAreaScrollListener);
    document?.removeEventListener("scroll", documentScrollListener);
  })
}

export const appearDelayStep = 15