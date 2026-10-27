const contrastTargets = [
  ['--preview-name-color', '.header_home .item_left .item-btn-text_home:has(.appear-word_appear)'],
  ['--preview-year-color', '.header_home .item_right .item-btn-text_home:has(.appear-word_appear)'],
  ['--preview-footer-left-color', '.footer-item_home .home-btn:first-child .home-btn-text'],
  ['--preview-footer-right-color', '.footer-item_home .home-btn:last-child .home-btn-text'],
  ['--preview-logo-invert', '.footer-item_home .home-eyes dotlottie-player'],
];

const linearChannel = value => {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
};
const linear = Array.from({ length: 256 }, (_, value) => linearChannel(value));

export function createPreviewContrast() {
  let canvas;
  let context;
  let previousMedia;
  const colors = new Map();
  const blockedMedia = new WeakSet();

  function update(media) {
    if (!media || blockedMedia.has(media)) return;
    const width = media.videoWidth || media.naturalWidth;
    const height = media.videoHeight || media.naturalHeight;
    if (!width || !height) return;

    canvas ||= document.createElement('canvas');
    context ||= canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    const sampleWidth = 128;
    const sampleHeight = Math.max(1, Math.round(sampleWidth * innerHeight / innerWidth));
    if (canvas.width !== sampleWidth || canvas.height !== sampleHeight) {
      canvas.width = sampleWidth;
      canvas.height = sampleHeight;
    }
    const scale = Math.max(sampleWidth / width, sampleHeight / height);
    let pixels;
    try {
      // Match the preview's centered object-fit: cover without another media loader.
      context.fillStyle = '#080808';
      context.fillRect(0, 0, sampleWidth, sampleHeight);
      context.drawImage(media, (sampleWidth - width * scale) / 2,
        (sampleHeight - height * scale) / 2, width * scale, height * scale);
      pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
    } catch {
      blockedMedia.add(media);
      canvas = context = null;
      return;
    }

    for (const [property, selector] of contrastTargets) {
      const rect = document.querySelector(selector)?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) continue;
      const x0 = Math.max(0, Math.floor(rect.left / innerWidth * sampleWidth));
      const x1 = Math.min(sampleWidth, Math.max(x0 + 1, Math.ceil(rect.right / innerWidth * sampleWidth)));
      const y0 = Math.max(0, Math.floor(rect.top / innerHeight * sampleHeight));
      const y1 = Math.min(sampleHeight, Math.max(y0 + 1, Math.ceil(rect.bottom / innerHeight * sampleHeight)));
      let luminance = 0;
      let count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * sampleWidth + x) * 4;
          luminance += 0.2126 * linear[pixels[i]] + 0.7152 * linear[pixels[i + 1]] + 0.0722 * linear[pixels[i + 2]];
          count++;
        }
      }
      if (!count) continue;
      luminance /= count;
      // A small deadband keeps a video near the contrast threshold from flickering.
      const previous = media === previousMedia ? colors.get(property) : null;
      const threshold = previous === '#fff' ? 0.20 : previous === '#000' ? 0.16 : 0.179;
      const color = luminance > threshold ? '#000' : '#fff';
      if (colors.get(property) !== color) {
        document.body.style.setProperty(property, property === '--preview-logo-invert' ? (color === '#fff' ? '1' : '0') : color);
        colors.set(property, color);
      }
    }
    previousMedia = media;
  }

  function clear() {
    contrastTargets.forEach(([property]) => document.body.style.removeProperty(property));
    colors.clear();
    previousMedia = null;
    canvas = context = null;
  }

  return { update, clear };
}
