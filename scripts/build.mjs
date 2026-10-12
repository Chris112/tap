import { readdir, readFile, mkdir, rm, cp, writeFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'dist');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const pages = [];
const slugs = new Set();
async function asset(path) {
  assert(typeof path === 'string' && /^assets\/[a-zA-Z0-9_./-]+$/.test(path) && !path.split('/').includes('..'), `Invalid local asset: ${path}`);
  assert((await stat(resolve(root, path))).isFile(), `Missing asset: ${path}`);
}
for (const name of (await readdir(resolve(root, 'pages'))).filter(n => n.endsWith('.json')).sort()) {
  const page = JSON.parse(await readFile(resolve(root, 'pages', name), 'utf8'));
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug) && !['assets', 'docs'].includes(page.slug), `${name}: invalid slug`);
  assert(!slugs.has(page.slug), `${name}: duplicate slug`);
  slugs.add(page.slug);
  for (const field of ['title', 'message', 'buttonLabel', 'playingLabel']) assert(typeof page[field] === 'string' && page[field].trim(), `${name}: missing ${field}`);
  for (const field of ['background', 'glow', 'button', 'ring', 'text', 'buttonText']) assert(/^#[0-9a-fA-F]{6}$/.test(page.theme?.[field]), `${name}: invalid theme ${field}`);
  assert(page.minimal === undefined || typeof page.minimal === 'boolean', `${name}: minimal must be a boolean`);
  assert(Array.isArray(page.clips), `${name}: clips must be an array`);
  const ids = new Set();
  for (const clip of page.clips) {
    assert(typeof clip.id === 'string' && clip.id && !ids.has(clip.id), `${name}: invalid or duplicate clip id`);
    assert(typeof clip.label === 'string' && clip.label.trim(), `${name}: clip missing label`);
    ids.add(clip.id);
    await asset(clip.src);
  }
  if (page.image) {
    await asset(page.image.src);
    assert(typeof page.image.alt === 'string', `${name}: image needs alt text`);
  }
  pages.push(page);
}
assert(pages.length, 'No pages configured');
// Validate everything before replacing the previous local build.
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(resolve(root, 'assets'), resolve(out, 'assets'), { recursive: true });
const head = title => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${escape(title)}</title>`;
for (const page of pages) {
  const dir = resolve(out, page.slug);
  await mkdir(dir);
  const styles = Object.entries(page.theme).map(([key, value]) => `--${key}:${value}`).join(';');
  const config = JSON.stringify(page).replace(/</g, '\\u003c');
  await writeFile(resolve(dir, 'index.html'), `${head(page.title)}<meta name="theme-color" content="${page.theme.background}"><link rel="stylesheet" href="../assets/player.css"></head><body style="${styles}"><main>
<h1>${escape(page.title)}</h1>
${page.image ? `<img class="art" src="../${escape(page.image.src)}" alt="${escape(page.image.alt)}">` : ''}
<button id="play" class="main-button" type="button" disabled>${escape(page.buttonLabel)}</button>
<div class="wave" aria-hidden="true">${'<span></span>'.repeat(20)}</div>
<p id="status"${page.minimal ? ' class="visually-hidden"' : ''} role="status">${escape(page.clips.length ? page.message : 'Sounds are coming soon')}</p>
${page.minimal ? '' : '<div id="clips" class="clips" role="group" aria-label="Choose a sound"></div><button id="stop" class="stop" type="button" hidden>Stop sound</button>'}
<audio id="audio" preload="none"></audio>
<noscript><p>Enable JavaScript to play sounds.</p></noscript>
</main><script id="page-config" type="application/json">${config}</script><script type="module" src="../assets/player.js"></script></body></html>`);
}
await writeFile(resolve(out, 'index.html'), `${head('Tap')}<link rel="stylesheet" href="assets/player.css"></head><body><main><h1>Tap</h1><p>Pick a sound page</p><nav class="directory">${pages.map(p => `<a href="${p.slug}/">${escape(p.title)}</a>`).join('')}</nav></main></body></html>`);
await writeFile(resolve(out, '404.html'), `${head('Page not found')}</head><body><h1>Page not found</h1><p>Check the address or scan the QR code again.</p></body></html>`);
await writeFile(resolve(out, '.nojekyll'), '');
console.log(`Built ${pages.length} pages: ${pages.map(p => p.slug).join(', ')}`);
