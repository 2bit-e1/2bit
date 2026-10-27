import { onBeforeUnmount, unref, watch } from "vue";

export const useIntersectionObserver = (elem, callback, options) => {
  const {
    rootRef,
    rootMargin = '0px',
    threshold = 0,
  } = options || {}
  
  const stop = watch(
    () => [unref(elem), unref(rootRef)],
    ([element, root], _, onCleanup) => {
      if (!element) return;
      if (typeof IntersectionObserver === "undefined") {
        callback([{ target: element, isIntersecting: true }]);
        return;
      }

      const observer = new IntersectionObserver(callback, {
        root: root || null,
        rootMargin,
        threshold,
      });
      observer.observe(element);
      onCleanup(() => observer.disconnect());
    },
    { flush: "post", immediate: true },
  );

  onBeforeUnmount(stop);
}
