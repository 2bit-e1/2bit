export const getImageSrc = (name) => /^https?:\/\//i.test(name) ? name : `/images/process/${name}`
