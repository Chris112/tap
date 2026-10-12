# Tap

Small QR-linked sound pages for boxes, toys, and other prints. One shared player supports multiple separately configured pages. The proposed GitHub repository is `Chris112/tap`, with Pikachu at `https://chris112.github.io/tap/pikachu/`.

This is a separate project. The production `Chris112/eevee` repository and `https://chris112.github.io/eevee/` stay unchanged. Printed Eevee QR codes keep their existing destination.

## Preview

Requires Node 22+ and Python 3. No npm dependencies or install step.

```sh
npm run check
npm run preview
```

Open `http://localhost:8765/pikachu/`. The root lists available pages. `demo/` has generated test tones. Pikachu contains seven user-supplied Downloads clips plus the retained Pika pika Pikachu candidate, played through the main button. Source links and probes are in [docs/pikachu-sources.md](docs/pikachu-sources.md).

## Add a page

Copy a file in `pages/`, set a permanent lowercase slug, and change its title, message, button labels and theme colours. Put clips under `assets/<slug>/` and reference them with paths such as `assets/pikachu/pika-pika.mp3`. Set `minimal: true` to show only the title, main button and animated playback indicator, with status updates available to screen readers. The default detailed view also includes individual clip and stop buttons. Each clip has a unique `id`, a readable `label`, and a `src`. Any number of clips is supported, including zero while preparing a page. An optional `image` object has `src` and `alt` fields and uses the same local asset paths.

Run `npm run check`. The generator validates slugs, fields, theme colours, duplicate IDs and referenced files before replacing the previous build. It generates `dist/<slug>/index.html`, with shared CSS and JavaScript. It needs no routing fallback and works beneath a GitHub Pages repository prefix.

The main button shuffles every clip into a round. Each clip must finish before it leaves the round. After all clips finish, another shuffled round starts without immediately repeating the last clip when there is more than one. Stopped, interrupted and failed clips remain available. Individual playback also counts toward the current round when it finishes. Refreshing the page starts a fresh round. Individual buttons play a chosen clip. Starting another clip replaces the current one. Stop, error and replay states are supported. Playback begins on a deliberate tap for mobile browsers. The animated bars indicate playback, rather than measured audio levels, and respect reduced motion.

## Publish the new project

The included GitHub Actions workflow builds and publishes only this repository. Create the separate `Chris112/tap` repository, push `main`, and set that repository's Pages source to GitHub Actions. Do not use the Eevee remote, change its settings, or migrate its contents.

Keep the repository name and page slugs once QR codes are printed. GitHub Pages does not redirect site URLs when a repository is renamed. Content can change behind an existing slug. Keep an old folder if you ever introduce a replacement URL. See [hosting research](docs/hosting-research.md) for official documentation.

## Sound acceptance

Listen to each candidate on the intended phone and identify which to keep by number. Check voice, background noise, volume, clipping, and duration. Automated decoding and browser playback checks do not confirm audible phone output. Keep source notes alongside retained clips. Add a child's name or artwork only when requested.
