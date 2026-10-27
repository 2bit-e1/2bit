import { mediaRevisions } from '../data/mediaRevisions.js';

export function mediaUrl(src, retry = 0) {
  if (!src || !src.startsWith('/') || src.startsWith('//')) return src;
  const url = new URL(src, 'https://media.invalid');
  if (mediaRevisions[url.pathname]) url.searchParams.set('v', mediaRevisions[url.pathname]);
  if (retry) url.searchParams.set('retry', String(retry));
  return url.pathname + url.search + url.hash;
}
