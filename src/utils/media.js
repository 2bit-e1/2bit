const VIDEO_MIME_TYPES = {
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
  ogv: "video/ogg",
  mov: "video/quicktime",
};

export function getMediaExtension(src) {
  if (!src) return "";

  const cleanSrc = String(src).split(/[?#]/)[0];
  const extensionMatch = cleanSrc.match(/\.([a-z0-9]+)$/i);

  return extensionMatch ? extensionMatch[1].toLowerCase() : "";
}

export function getVideoMimeType(src) {
  return VIDEO_MIME_TYPES[getMediaExtension(src)] || "";
}

export function isVideoFile(src) {
  return Boolean(getVideoMimeType(src));
}
