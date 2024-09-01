import { onBeforeUnmount, ref, watchEffect } from "vue"

export const useIntersectionObserver = (elem, callback, options) => {
  const {
    rootRef,
    rootMargin = '0px',
    threshold = 0,
  } = options || {}
  
  const cleanup = ref(null)
  
  watchEffect(
    () => {
      if (cleanup.value) cleanup.value()
      
      const observer = new IntersectionObserver(
        callback,
        {
          root: rootRef?.value || null,
          rootMargin,
          threshold,
        },
      )

      console.log("elem.value", elem.value);
      
      observer.observe(elem.value)

      cleanup.value = () => {
        observer.disconnect()
      }
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(() => {
    if (cleanup.value) cleanup.value()
  })
}