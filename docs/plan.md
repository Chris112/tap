# Multi-page QR sound project

## Current Eevee setup

Read-only inspection on 2026-10-12 found public repository [Chris112/eevee](https://github.com/Chris112/eevee), created on 2026-10-07, with one commit `48d8d668bc63fa28fb8fe552132225979671aecd`. Its [index.html](https://github.com/Chris112/eevee/blob/48d8d668bc63fa28fb8fe552132225979671aecd/index.html) contains the styles, player, clip selection and canvas audio visualiser. Seven MP3s live in `sounds/`: eevee, happy, call, questioning, battle, sad and mad. The page attempts autoplay and falls back to a large tap button, selecting a different clip from the previous one.

GitHub's read-only Pages API reported a built HTTPS site at `https://chris112.github.io/eevee/`, using legacy branch publishing from `main`, repository root, without a custom domain. The site was opened read-only. No button was clicked and no GitHub state was changed.

## Chosen structure

Create a separate generic project named `tap`, with Pikachu at `/tap/pikachu/`. This keeps the URL short and gives later characters equally readable slugs. The player follows Eevee's large circular tap control and themed colours, while moving character-specific content into JSON. No production Eevee files are copied back or migrated.

| File | Responsibility |
| --- | --- |
| `pages/<slug>.json` | Permanent route, display text, theme, optional image and clip list |
| `assets/<slug>/` | Self-hosted audio and optional artwork |
| `assets/player.js` | Shared selection, tap playback, stop, replay and errors |
| `assets/player.css` | Shared responsive presentation with per-page colours |
| `scripts/build.mjs` | Configuration validation and actual HTML folder generation |
| `.github/workflows/pages.yml` | Build and deployment of the new repository only |

Plain static files fit this project. A framework, database, account system or editor would add maintenance without helping a QR scan play a short sound. GitHub Actions adds a validation gate before deployment. Adding a page means adding configuration and assets, rather than duplicating a complete app.

## Pikachu preparation

The user requested `/tap/pikachu/`, sound sourcing and a chance to listen before approving the clips. Five candidate MP3s are available on the draft page, with numbered buttons and preserved source records. These are audition candidates, not a final approved set. No child's name or artwork has been assumed.

After listening, retain the chosen clips, update the welcome message, and remove unapproved clips from the configuration. Keep the same URL. Once deployed, check the URL and playback on the intended phone before printing a QR code. A URL or QR is a stable link, not an offline guarantee; this version needs network access.

## Validation

Check the build, asset references and generated routes. Exercise the demo and Pikachu routes under the `/tap/` prefix. Verify individual selection, no immediate random repeat, rapid replacement, stop, failed playback and keyboard operation. Inspect mobile and desktop layouts and automated accessibility findings. Read back the Eevee main commit and Pages source after the work to confirm they still match the original inspection.
