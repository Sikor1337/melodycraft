// Writes the server-rendered page into dist/index.html (A443, 13.11.2026).
// Runs as the last step of `npm run build`, after the client build (dist/) and the SSR
// build of src/entry-server.tsx (dist-ssr/). Fails the build loudly instead of shipping
// an empty page.
import { readFileSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ssrEntry = resolve('dist-ssr', 'entry-server.js');
const page = resolve('dist', 'index.html');
const marker = '<div id="root"></div>';

const { render } = await import(pathToFileURL(ssrEntry).href);
const appHtml = render();
if (!appHtml.includes('<h1')) {
  throw new Error('prerender: rendered HTML has no <h1> - refusing to write dist/index.html');
}

const template = readFileSync(page, 'utf8');
if (!template.includes(marker)) {
  throw new Error(`prerender: ${marker} not found in dist/index.html`);
}

// Write to a temporary file first, then swap it in, so a crash never leaves a half-written page.
writeFileSync(`${page}.tmp`, template.replace(marker, `<div id="root">${appHtml}</div>`));
renameSync(`${page}.tmp`, page);
rmSync(resolve('dist-ssr'), { recursive: true, force: true });
console.log(`prerender: ${appHtml.length} characters of HTML written into dist/index.html`);
