export function getMotionDuration(property, fallback = 0) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
  const value = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  const duration = Number.parseFloat(value);
  if (!Number.isFinite(duration)) return fallback;
  return value.endsWith('ms') ? duration : duration * 1000;
}
