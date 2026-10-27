import test from 'node:test';
import assert from 'node:assert/strict';
import { mediaUrl } from '../src/utils/mediaUrl.js';
import { mediaRevisions } from '../src/data/mediaRevisions.js';

test('replaced originals use their content revision without renaming media types', () => {
  for (const [path, revision] of Object.entries(mediaRevisions)) {
    assert.equal(mediaUrl(path), `${path}?v=${revision}`);
  }
});
test('retry preserves revision, existing query and fragment', () => {
  assert.equal(mediaUrl('/5.27.mp4?quality=high#frame', 2), `/5.27.mp4?quality=high&v=${mediaRevisions['/5.27.mp4']}&retry=2#frame`);
});
test('provider, protocol-relative and ordinary unchanged paths stay unchanged', () => {
  for (const src of ['https://player.vimeo.com/video/123', '//kinescope.io/embed/abc', '/5.1.mp4']) {
    assert.equal(mediaUrl(src), src);
  }
});
