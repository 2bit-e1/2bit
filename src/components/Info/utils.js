import { useProjectStore } from "@/stores/project";
import { onBeforeUnmount, ref, watchEffect } from "vue"

export const useToggleFooterDataOnScroll = (infoAreaRef, isSkip) => {
  const projectStore = useProjectStore();

  const lastScrollTop = ref(0)
  
  const scrollListener = () => {
    if (lastScrollTop.value < infoAreaRef.value.scrollTop) projectStore.hideFooterData()
    else projectStore.showFooterData()
  }
  
  watchEffect(() => {
    if (isSkip.value) return
    infoAreaRef.value?.removeEventListener("scroll", scrollListener);
    infoAreaRef.value?.addEventListener("scroll", scrollListener);
  })

  onBeforeUnmount(() => {
    infoAreaRef.value?.removeEventListener("scroll", scrollListener);
  })
}