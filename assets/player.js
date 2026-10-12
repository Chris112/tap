import { createShuffleCycle } from './shuffle-cycle.js';

const page = JSON.parse(document.getElementById('page-config').textContent);
const button = document.getElementById('play');
const status = document.getElementById('status');
const stop = document.getElementById('stop');
const audio = document.getElementById('audio');
const list = document.getElementById('clips');
const clipButtons = new Map();
let lastId = null;
let attempt = 0;
let current = null;
const cycle = createShuffleCycle(page.clips);
// Initialise the round so individually selected sounds count when they finish.
cycle.next();

try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* Optional browser API. */ }

function idle() {
  document.body.classList.remove('playing');
  button.textContent = lastId ? 'Again!' : page.buttonLabel;
  if (stop) stop.hidden = true;
  for (const item of clipButtons.values()) item.setAttribute('aria-pressed', 'false');
}
function failed() {
  idle();
  button.textContent = 'Try again';
  status.textContent = 'Could not play this sound. Tap to try again.';
}
function play(clip) {
  const thisAttempt = ++attempt;
  audio.pause();
  current = clip;
  audio.src = new URL(`../${clip.src}`, location.href).href;
  status.textContent = `Loading ${clip.label}…`;
  // Start within the click event; do not fetch or await before play on iOS.
  audio.play().then(() => {
    if (thisAttempt !== attempt) return;
    lastId = clip.id;
    document.body.classList.add('playing');
    button.textContent = page.playingLabel;
    status.textContent = page.minimal ? `Playing ${clip.label}` : `${clip.label}. Tap again for another.`;
    if (stop) stop.hidden = false;
    for (const [id, item] of clipButtons) item.setAttribute('aria-pressed', String(id === clip.id));
  }).catch(() => { if (thisAttempt === attempt) failed(); });
}
for (const clip of list ? page.clips : []) {
  const item = document.createElement('button');
  item.type = 'button';
  item.textContent = clip.label;
  item.setAttribute('aria-pressed', 'false');
  item.addEventListener('click', () => play(clip));
  list.append(item);
  clipButtons.set(clip.id, item);
}
button.disabled = page.clips.length === 0;
button.addEventListener('click', () => {
  const clip = cycle.next(lastId);
  if (clip) play(clip);
});
stop?.addEventListener('click', () => {
  ++attempt;
  audio.pause();
  audio.currentTime = 0;
  idle();
  status.textContent = page.message;
});
audio.addEventListener('ended', () => {
  if (current) cycle.complete(current.id);
  idle();
  status.textContent = page.minimal ? 'Sound finished' : 'Tap again for another sound';
});
audio.addEventListener('error', () => { if (current) failed(); });
