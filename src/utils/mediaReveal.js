const instances = new WeakMap();

// Observe the stable frame, not the clipped/moving media inside it. Rect deltas
// also capture nested scrolling and Locomotive's transformed scroll container.
export function observeMediaReveal(element, enabled = true, fixedDirection) {
  let isEnabled = enabled;
  let isIntersecting = false;
  let previousTop;
  let direction = fixedDirection || "down";

  element.classList.add("media-reveal");
  element.dataset.revealDirection = direction;

  const updateVisibility = () => {
    const visible = isEnabled && isIntersecting;
    if (visible && !element.classList.contains("media-reveal_visible")) {
      element.dataset.revealDirection = direction;
    }
    element.classList.toggle("media-reveal_visible", visible);
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const top = entry.boundingClientRect.top;
      if (!fixedDirection && previousTop !== undefined && Math.abs(top - previousTop) > 1) {
        direction = top < previousTop ? "down" : "up";
      }
      previousTop = top;
      isIntersecting = entry.isIntersecting && entry.intersectionRatio > 0;
      updateVisibility();
    }
  }, { threshold: [0, 0.01] });

  observer.observe(element);

  return {
    setDirection(value) {
      fixedDirection = value;
      if (value) direction = value;
    },
    setEnabled(value) {
      isEnabled = value;
      updateVisibility();
    },
    disconnect() {
      observer.disconnect();
    },
  };
}

export const vMediaReveal = {
  mounted(element, binding) {
    instances.set(element, observeMediaReveal(element, binding.value !== false, binding.arg));
  },
  updated(element, binding) {
    const instance = instances.get(element);
    instance?.setDirection(binding.arg);
    instance?.setEnabled(binding.value !== false);
  },
  beforeUnmount(element) {
    instances.get(element)?.disconnect();
    instances.delete(element);
  },
};
