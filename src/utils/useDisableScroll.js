import { onUnmounted, watch } from "vue"

export const useDisableScroll = (conditionToDisable, watchOptions = {}, el = document.body) => {
  watch(conditionToDisable, () => {
    if (conditionToDisable.value) {
      el.style.overflow = "hidden"
    } else {
      el.style.overflow = ""
    }
  }, watchOptions)

  onUnmounted(() => {
    el.style.overflow = ""
  })
}