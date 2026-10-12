import test from 'node:test';
import assert from 'node:assert/strict';
import { createShuffleCycle } from '../assets/shuffle-cycle.js';

const clips = Array.from({ length: 8 }, (_, id) => ({ id: String(id) }));

test('eight clips complete once each per round, with no repeat across boundaries', () => {
  for (const random of [() => 0, () => 0.5, () => 0.999]) {
    const cycle = createShuffleCycle(clips, random);
    let previous;
    for (let round = 0; round < 20; round++) {
      const heard = [];
      for (let i = 0; i < clips.length; i++) {
        const clip = cycle.next(previous);
        assert.notEqual(clip.id, previous);
        heard.push(clip.id);
        cycle.complete(clip.id);
        previous = clip.id;
      }
      assert.equal(new Set(heard).size, clips.length);
    }
  }
});

test('interrupted or failed playback remains available until completed', () => {
  const cycle = createShuffleCycle(clips, () => 0.5);
  const interrupted = cycle.next();
  const other = cycle.next(interrupted.id);
  assert.notEqual(other.id, interrupted.id);
  cycle.complete(other.id);
  const heard = [];
  for (let i = 0; i < 7; i++) {
    const clip = cycle.next();
    heard.push(clip.id);
    cycle.complete(clip.id);
  }
  assert.ok(heard.includes(interrupted.id));
  assert.ok(!heard.includes(other.id));
  assert.equal(new Set(heard).size, 7);
});

test('individually completed clip is skipped by random selection for this round', () => {
  const cycle = createShuffleCycle(clips, () => 0.5);
  cycle.next();
  cycle.complete('3');
  const heard = [];
  for (let i = 0; i < 7; i++) {
    const clip = cycle.next();
    heard.push(clip.id);
    cycle.complete(clip.id);
  }
  assert.ok(!heard.includes('3'));
  assert.equal(new Set(heard).size, 7);
});

test('empty and single-clip pages work', () => {
  assert.equal(createShuffleCycle([]).next(), undefined);
  const cycle = createShuffleCycle([clips[0]]);
  assert.equal(cycle.next().id, '0');
  cycle.complete('0');
  assert.equal(cycle.next('0').id, '0');
});
