# Generic QR sound pages: hosting and playback findings

Verified against official documentation on 2026-10-12. No repository or live Pages configuration was changed.

## Hosting model

GitHub Pages serves static HTML, CSS and JavaScript with an optional build step. A separate project repository receives its own site at `https://<owner>.github.io/<repository>/`; each repository can have one project site. A new repository therefore provides a separate deployment boundary from the production Eevee repository. [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

Recommendation (design inference): use a generic, durable repository name such as `qr-sound-pages`, generate actual static directories such as `pikachu/index.html`, and share the same JavaScript/CSS player across page configurations. QR destinations can then be `/qr-sound-pages/pikachu/` or `/qr-sound-pages/aubrey-pikachu/` without client-side SPA routing or server rewrite assumptions. Keep the production Eevee URL entirely separate.

Recommendation (design inference): use relative asset URLs from generated pages, or compute every asset URL from a known repository base path. A leading `/assets/...` points at the account domain root rather than the repository path. Validate a local preview mounted beneath `/qr-sound-pages/`, including nested page routes and sound files. The documented project-site URL is the reason this base-path distinction matters. [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

## Deployment

A custom Pages workflow can run a generator/validator, upload the output directory with `actions/upload-pages-artifact@v4`, and publish it with `actions/deploy-pages@v4`; `actions/configure-pages@v5` provides site metadata. GitHub currently shows `actions/checkout@v6`. The deploy job requires `pages: write`, `id-token: write`, and a Pages environment; separate deploy jobs must depend on the build job. Pages must be configured to use GitHub Actions. [GitHub custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

Recommendation (design inference): validate configuration and asset existence before creating the Pages artifact. This prevents a newly added broken sound/page from replacing the working deployment. Keep deployment permissions and Pages settings in the new repository only.

## QR permanence

GitHub redirects a renamed repository's ordinary URLs, but explicitly excludes project site URLs. Choose the generic repository name before printing QRs and keep page slugs permanent. A custom domain can decouple the hostname from repository renames, but is optional extra configuration. [GitHub repository renaming](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)

Recommendation (design inference): after a QR is printed, treat its slug as an immutable public identifier. Update title, artwork or sound configuration without removing the URL. If a slug must change, retain a real static page at the old slug with a link/redirect to the replacement.

## Mobile sound behavior

Chrome allows audible autoplay after qualifying interaction with a domain, with additional desktop engagement/PWA exceptions. It explicitly advises checking the Promise returned by `play()` and exposing a Play control if blocked. A first scan should therefore show a deliberate tap-to-play button, rather than promise instant audible playback on page load. [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay/)

WebKit documents that iOS media playback requires the `play()` call to result directly from a user event such as `click`; calling it from `canplaythrough` is not equivalent. Its relaxed autoplay policies concern silent/muted video, not unrestricted audible playback. Keep the audio `play()` call in the tap handler, with the configured source already available. [WebKit iOS media policies](https://webkit.org/blog/6784/new-video-policies-for-ios/)

The Safari team recommends assuming audio/video requires a click, detecting rejected `play()` calls, and reusing a media element when changing sources because autoplay restrictions apply per element. [WebKit media autoplay best practices](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/)

Recommendation (design inference): one reusable `<audio>` element per page, a list of labelled sounds, one active sound at a time, and Play/Pause/Replay state driven by actual playback outcomes/events. Handle blocked playback and missing audio with a visible retry/error state. Verify browser interaction automatically, then perform physical iPhone/Android sound checks before printing QRs; automation does not establish audible output on those devices.

## Scale

Published Pages sites are limited to 1 GB, with a soft bandwidth limit of 100 GB/month and a ten-minute deployment timeout. Small compressed images and short audio clips fit this use case comfortably; avoid unnecessarily storing lossless source recordings in the deployed output. [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
