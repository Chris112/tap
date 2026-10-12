// A clip leaves the current round only after playback finishes.
export function createShuffleCycle(clips, random = Math.random) {
  let remaining = [];
  function refill() {
    remaining = [...clips];
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
  }
  return {
    next(previousId) {
      if (!remaining.length) refill();
      if (remaining.length > 1 && remaining[0].id === previousId) {
        [remaining[0], remaining[1]] = [remaining[1], remaining[0]];
      }
      return remaining[0];
    },
    complete(id) {
      remaining = remaining.filter(clip => clip.id !== id);
    }
  };
}
