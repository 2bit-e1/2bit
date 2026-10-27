import test from 'node:test';
import assert from 'node:assert/strict';
import { getMediaWindowIndices } from '../src/utils/mediaWindow.js';

const windowFor = (...args) => [...getMediaWindowIndices(...args)].sort((a, b) => a - b);

test('bootstrap loads visible frames before warming neighbours', () => {
  assert.deepEqual(windowFor(29, [0, 1, 2], false), [0, 1, 2]);
});

test('scrolling retains only the visible frames and one neighbour each way', () => {
  assert.deepEqual(windowFor(29, [10, 11, 12]), [9, 10, 11, 12, 13]);
});

test('reverse entry never warms the beginning of the previous project', () => {
  assert.deepEqual(windowFor(29, [27, 28]), [26, 27, 28]);
});

test('the window stays within gallery boundaries', () => {
  assert.deepEqual(windowFor(2, [0]), [0, 1]);
  assert.deepEqual(windowFor(1, [0]), [0]);
  assert.deepEqual(windowFor(0, []), []);
});

test('no visible frames do not retain a gallery, even with invalid indices', () => {
  assert.deepEqual(windowFor(29, [-1, 29, 1.5]), []);
});
