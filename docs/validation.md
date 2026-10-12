# Draft validation

2026-10-12, local draft. Publication and physical phone listening are pending.

- `npm run check` passes syntax checking and generates demo and Pikachu pages.
- Temporary invalid configurations fail the build for missing sound files and duplicate clip IDs.
- All five downloaded MP3s fully decode with FFmpeg. Durations and hashes are recorded in the sound source metadata.
- Browser checks used a static preview beneath `/tap/`, including direct navigation to `/tap/pikachu/` and `/tap/demo/` and correct audio resolution beneath `/tap/assets/`.
- Individual clips play. Starting another replaces the audio source. Stop pauses and resets the time to zero. The demo's random button selects the other tone after one succeeds, verifying no immediate repeat for multiple sounds. The ended event restores the replay state.
- A deliberately missing browser audio source shows the retry message; selecting a valid clip recovers.
- Mobile 390 x 844 and desktop 1440 x 900 screenshots were inspected. A 320 x 568 layout check found no horizontal overflow.
- Axe 4.12.1 reported zero violations. Its incomplete ARIA grouping check was fixed by adding the group role. The remaining incomplete check is gradient contrast. Independent calculation against the gradient endpoints gives minimum text contrast of 7.23:1 for Pikachu and 7.29:1 for the demo.
- Eevee readback still shows main commit `48d8d668bc63fa28fb8fe552132225979671aecd`, legacy publication from `main` root, and a built site at `https://chris112.github.io/eevee/`.

These checks establish decoding, browser playback state and layout. They do not establish the sound heard on a physical phone, the suitability of a clip, or a successful GitHub Pages deployment.

## Eight-clip update

The user selected seven Downloads clips plus the original candidate number 5. All seven Downloads originals fully decode with FFmpeg and were copied unchanged. Four automated tests verify complete rounds, boundaries, interrupted/failed playback remaining available, individually completed clips counting toward the round, and empty/single-clip pages. A local browser playback check completed two rounds at accelerated playback using real button clicks: eight unique clips in each round, and no repeat at the boundary. A scripted click without browser interaction was blocked by the autoplay policy; real browser button clicks played successfully. The shuffle round resets on page refresh.

## Minimal Pikachu page

Pikachu now enables the minimal view: one heading, one main button and the animated playback indicator. Individual clip and stop controls are absent from the generated page. Status updates remain available to screen readers without visible hint text. Mobile and desktop screenshots were inspected. Real button playback sets the animated state, and finishing restores the main button. The build and four shuffle tests pass.
