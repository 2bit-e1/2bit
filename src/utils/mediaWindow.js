import { mediaUrl } from './mediaUrl.js';

const mediaSelector = 'img[data-media-src], video[data-media-src], iframe[data-media-src]';

export function getMediaWindowIndices(count, visibleIndices, includeNeighbours = true) {
  const indices = new Set();
  for (const index of visibleIndices) {
    if (!Number.isInteger(index) || index < 0 || index >= count) continue;
    indices.add(index);
    if (includeNeighbours && index > 0) indices.add(index - 1);
    if (includeNeighbours && index + 1 < count) indices.add(index + 1);
  }
  return indices;
}

// Sources, first-frame readiness and retries belong to the displayed elements.
export function createMediaWindow({
  mode = 'scroll', reserveRatio = false, timeoutMs = 30000,
  onInitialReady = () => {}, onInitialStateChange = () => {}, onStateChange = () => {},
} = {}) {
  let records = [];
  let suspended = false;
  let disposed = false;
  let initialReady = false;
  let initialState;
  let frame;

  const attached = record => record.type === 'IFRAME' ? record.attached : record.media.hasAttribute('src');
  const clearTimer = record => { clearTimeout(record.timer); record.timer = null; };

  function publish(record, state = record.state) {
    record.state = state;
    record.element.dataset.mediaState = state;
    record.element.dataset.mediaReady = String(record.hasFrame);
    const signature = state + ':' + record.hasFrame + ':' + record.effective;
    if (!disposed && record.signature !== signature) {
      record.signature = signature;
      onStateChange(record.element, state, { ready: record.hasFrame, active: record.effective });
    }
  }

  function clearSource(record) {
    record.generation++;
    clearTimer(record);
    record.cleanup?.();
    record.cleanup = null;
    if (!attached(record)) return;
    if (record.type === 'IFRAME') {
      // Repeated src mutations pollute the joint browser history.
      record.media.contentWindow?.location.replace('about:blank');
      record.attached = false;
      delete record.media.dataset.mediaLoadedSrc;
    } else {
      if (record.type === 'VIDEO') record.media.pause();
      record.media.removeAttribute('src');
      if (record.type === 'VIDEO') record.media.load();
    }
  }

  function release(record) {
    clearSource(record);
    record.hasFrame = false;
    record.blocked = false;
    publish(record, 'idle');
  }

  function fail(record) {
    if (disposed) return;
    clearTimer(record);
    if (!record.hasFrame) clearSource(record);
    else if (record.type === 'VIDEO') record.media.pause();
    publish(record, 'error');
    schedule();
  }

  function armTimeout(record) {
    const waiting = record.state === 'loading' || record.state === 'buffering';
    if (!record.effective || !waiting) { clearTimer(record); return; }
    if (record.timer) return;
    const generation = record.generation;
    record.timer = setTimeout(() => {
      if (!disposed && generation === record.generation) fail(record);
    }, timeoutMs);
  }

  function play(record) {
    if (record.type !== 'VIDEO') return;
    const video = record.media;
    if (!record.effective) { video.pause(); return; }
    if (record.state === 'error' || record.blocked || !video.paused || !attached(record)) return;
    const generation = record.generation;
    video.play()?.catch(error => {
      if (disposed || generation !== record.generation || !record.effective || error.name === 'AbortError') return;
      if (error.name === 'NotAllowedError') {
        record.blocked = true;
        clearTimer(record);
        publish(record, 'blocked');
        schedule();
      } else if (video.error) fail(record);
    });
  }

  function attach(record) {
    const { media, type } = record;
    if (type === 'IFRAME' && !record.effective) {
      if (!suspended && !document.hidden && record.element.dataset.mediaOutgoing === 'true' && attached(record)) return;
      release(record);
      return;
    }
    if (record.state === 'error') return;
    if (type === 'VIDEO') media.preload = record.effective ? 'auto' : 'metadata';
    if (type === 'IMG') media.setAttribute('fetchpriority', record.effective ? 'high' : 'low');
    if (!attached(record)) {
      const generation = ++record.generation;
      record.hasFrame = false;
      record.blocked = false;
      publish(record, 'loading');
      const current = () => !disposed && generation === record.generation;
      const ratio = () => {
        if (!reserveRatio) return;
        const width = type === 'VIDEO' ? media.videoWidth : media.naturalWidth;
        const height = type === 'VIDEO' ? media.videoHeight : media.naturalHeight;
        if (width && height) media.style.aspectRatio = width + ' / ' + height;
      };
      const complete = () => {
        if (!current()) return;
        record.hasFrame = true;
        clearTimer(record);
        publish(record, record.blocked ? 'blocked' : 'ready');
        schedule();
      };
      const ready = () => {
        if (!current()) return;
        if (type === 'IFRAME') {
          try { if (media.contentWindow?.location.href === 'about:blank') return; }
          catch { /* A provider document is intentionally cross-origin. */ }
          if (record.effective && /vimeo\.com/.test(record.src)) {
            media.contentWindow?.postMessage(JSON.stringify({ method: 'play' }), 'https://player.vimeo.com');
          }
        }
        ratio();
        if (type === 'IMG' && media.decode) {
          media.decode().then(complete, () => { if (current()) fail(record); });
        } else complete();
      };
      const error = () => { if (current()) fail(record); };
      const waiting = () => {
        if (current() && record.hasFrame && record.effective && media.readyState < 3) {
          publish(record, 'buffering');
          armTimeout(record);
        }
      };
      const playing = () => {
        if (!current()) return;
        record.blocked = false;
        ready();
      };
      const event = type === 'VIDEO' ? 'loadeddata' : 'load';
      media.addEventListener(event, ready);
      media.addEventListener('error', error);
      media.addEventListener('loadedmetadata', ratio);
      if (type === 'VIDEO') {
        media.addEventListener('waiting', waiting);
        media.addEventListener('playing', playing);
        media.addEventListener('canplay', ready);
      }
      record.cleanup = () => {
        media.removeEventListener(event, ready);
        media.removeEventListener('error', error);
        media.removeEventListener('loadedmetadata', ratio);
        media.removeEventListener('waiting', waiting);
        media.removeEventListener('playing', playing);
        media.removeEventListener('canplay', ready);
      };
      if (type === 'IFRAME') {
        record.attached = true;
        media.dataset.mediaLoadedSrc = record.src;
        media.contentWindow.location.replace(record.src);
      } else media.setAttribute('src', mediaUrl(record.src, record.retries));
      if (type === 'VIDEO') media.load();
      if ((type === 'IMG' && media.complete && media.naturalWidth) || (type === 'VIDEO' && media.readyState >= 2)) ready();
    }
    play(record);
    armTimeout(record);
  }

  function visible(record) {
    if (mode === 'slides') return record.element.dataset.mediaActive === 'true';
    const rect = record.element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
  }

  function refresh() {
    if (disposed) return;
    if (!initialReady && !records.length) { initialReady = true; onInitialReady(); return; }
    const active = new Set(records.filter(visible));
    const retained = new Set(active);
    if (mode === 'slides') {
      if (initialReady) records.filter(record => record.element.dataset.mediaRetain === 'true').forEach(record => retained.add(record));
    } else {
      const indices = records.flatMap((record, index) => active.has(record) ? [index] : []);
      getMediaWindowIndices(records.length, indices, initialReady).forEach(index => retained.add(records[index]));
    }
    records.forEach(record => {
      record.effective = active.has(record) && !suspended && !document.hidden;
      publish(record);
      if (retained.has(record)) attach(record);
      else release(record);
    });
    const critical = [...active].filter(record => record.type !== 'IFRAME');
    if (!initialReady && active.size) {
      const state = critical.some(record => record.state === 'error') ? 'error'
        : critical.some(record => record.state === 'blocked') ? 'blocked' : 'loading';
      if (initialState !== state) { initialState = state; onInitialStateChange(state); }
      if (critical.every(record => record.hasFrame)) {
        initialReady = true;
        onInitialReady();
        schedule();
      }
    }
  }

  function schedule() {
    if (disposed) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(refresh);
  }

  const observer = new IntersectionObserver(schedule, { threshold: [0, 0.01] });
  const resizeObserver = new ResizeObserver(schedule);
  window.addEventListener('scroll', schedule, { capture: true, passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', schedule);

  return {
    refresh: schedule,
    retry(element) {
      records.filter(record => element ? record.element === element : record.effective && ['error', 'blocked'].includes(record.state))
        .forEach(record => {
          if (record.blocked && attached(record)) {
            record.blocked = false;
            publish(record, record.hasFrame ? 'ready' : 'loading');
            play(record);
          } else {
            clearSource(record);
            record.retries++;
            record.hasFrame = false;
            record.blocked = false;
            publish(record, 'idle');
          }
        });
      refresh();
    },
    setFrames(elements) {
      const previous = new Map(records.map(record => [record.element, record]));
      records = [...elements].flatMap(element => {
        const media = element.matches(mediaSelector) ? element : element.querySelector(mediaSelector);
        if (!media?.dataset.mediaSrc) return [];
        const existing = previous.get(element);
        previous.delete(element);
        if (existing?.src === media.dataset.mediaSrc && existing.media === media) return [existing];
        if (existing) release(existing);
        const record = { element, media, type: media.tagName, src: media.dataset.mediaSrc, state: 'idle',
          generation: 0, hasFrame: false, blocked: false, effective: false, retries: 0 };
        if (reserveRatio && record.type !== 'IFRAME' && !media.style.aspectRatio) media.style.aspectRatio = '16 / 9';
        observer.observe(element);
        resizeObserver.observe(element);
        return [record];
      });
      previous.forEach(record => {
        observer.unobserve(record.element);
        resizeObserver.unobserve(record.element);
        release(record);
      });
      refresh();
    },
    setSuspended(value) { suspended = value; refresh(); },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      records.forEach(release);
      records = [];
    },
  };
}
