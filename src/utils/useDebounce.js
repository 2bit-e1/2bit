import { ref } from "vue"

export const useDebounce = (callee, timeoutMs) => {
  const lastCall = ref(null)
  const lastCallTimerId = ref(null)
  
  return function perform(...args) {
    const prevCall = lastCall.value

    lastCall.value = Date.now()
    
    if (prevCall && lastCall.value - prevCall <= timeoutMs) {
      clearTimeout(lastCallTimerId.value)
    }

    lastCallTimerId.value = setTimeout(() => callee(...args), timeoutMs)
  }
}