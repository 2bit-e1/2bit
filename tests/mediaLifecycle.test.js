import test from 'node:test';
import assert from 'node:assert/strict';
import { createMediaWindow } from '../src/utils/mediaWindow.js';

function environment(t) {
  const values = {
    window: new EventTarget(), document: Object.assign(new EventTarget(), { hidden: false }),
    innerWidth: 390, innerHeight: 844,
    IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
    ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
    requestAnimationFrame: () => 1, cancelAnimationFrame: () => {},
  };
  const originals = Object.fromEntries(Object.keys(values).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.assign(globalThis, values);
  return cleanup => t.after(() => {
    cleanup?.();
    Object.entries(originals).forEach(([key, descriptor]) => {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    });
  });
}

function video(src = '/5.1.mp4') {
  const attributes = new Map();
  return Object.assign(new EventTarget(), {
    tagName: 'VIDEO', dataset: { mediaSrc: src }, style: {}, paused: true, readyState: 0,
    matches: () => true,
    getBoundingClientRect: () => ({ width: 300, height: 180, left: 0, right: 300, top: 100, bottom: 280 }),
    hasAttribute: key => attributes.has(key),
    setAttribute: (key, value) => attributes.set(key, value),
    getAttribute: key => attributes.get(key),
    removeAttribute: key => attributes.delete(key),
    pause() { this.paused = true; },
    play() { this.paused = false; return Promise.resolve(); },
    load() {},
  });
}

test('a failed initial video is not ready; retry waits for actual frame data', t => {
  const cleanup = environment(t);
  const media = video();
  let ready = 0;
  const states = [];
  const controller = createMediaWindow({ onInitialReady: () => ready++, onInitialStateChange: state => states.push(state) });
  cleanup(() => controller.destroy());
  controller.setFrames([media]);
  media.dispatchEvent(new Event('error'));
  controller.setFrames([media]);
  assert.equal(ready, 0);
  assert.equal(states.at(-1), 'error');
  assert.equal(media.hasAttribute('src'), false);
  controller.retry(media);
  assert.equal(media.getAttribute('src'), '/5.1.mp4?retry=1');
  assert.equal(ready, 0);
  media.dispatchEvent(new Event('loadeddata'));
  controller.setFrames([media]);
  assert.equal(ready, 1);
});

test('slow active media times out with an error rather than a false success', async t => {
  const cleanup = environment(t);
  const media = video();
  let ready = false;
  const controller = createMediaWindow({ timeoutMs: 10, onInitialReady: () => ready = true });
  cleanup(() => controller.destroy());
  controller.setFrames([media]);
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(media.dataset.mediaState, 'error');
  assert.equal(ready, false);
  assert.equal(media.hasAttribute('src'), false);
});

test('destroy detaches the source and ignores late media events', t => {
  environment(t)();
  const media = video();
  let changes = 0;
  const controller = createMediaWindow({ onStateChange: () => changes++ });
  controller.setFrames([media]);
  controller.destroy();
  const before = changes;
  media.dispatchEvent(new Event('loadeddata'));
  media.dispatchEvent(new Event('error'));
  assert.equal(changes, before);
  assert.equal(media.hasAttribute('src'), false);
  assert.equal(media.paused, true);
});
