import test from 'node:test';
import assert from 'node:assert/strict';
import { getImageSrc } from '../src/components/Process/utils.js';

test('local process media keeps its case-sensitive filename', () => {
  assert.equal(getImageSrc('Pr15.JPG'), '/images/process/Pr15.JPG');
});

test('provider URLs are not prefixed with a local image directory', () => {
  const src = 'https://kinescope.io/embed/example?autoplay=1';
  assert.equal(getImageSrc(src), src);
});
