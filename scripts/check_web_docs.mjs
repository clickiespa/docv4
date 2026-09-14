import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

// Validate the generated artifact, including anchors across both languages.
const html = await fs.readFile('src/manual.generated.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const known = new Set(ids);
assert.equal(known.size, ids.length, 'Duplicate HTML IDs');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(known.has(id), `Missing anchor: ${id}`);
}

const assets = new Set();
for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="\.\/([^"?#]+)/g)) {
  const file = path.join('public', src);
  assert.ok((await fs.stat(file)).isFile(), `Missing image: ${file}`);
  assets.add(file);
}

const screenshots = new Set();
let figureCount = 0;
for (const [, id, figure] of html.matchAll(/<figure class="annotated-screen" data-screen="([^"]+)">([\s\S]*?)<\/figure>/g)) {
  const markers = [...figure.matchAll(/class="screen-marker" data-point="(\d+)"/g)].map(match => Number(match[1]));
  const legends = [...figure.matchAll(/<li tabindex="-1" data-point="(\d+)"/g)].map(match => Number(match[1]));
  assert.ok(markers.length > 0, `No markers: ${id}`);
  assert.deepEqual(markers, legends, `Marker/legend mismatch: ${id}`);
  assert.deepEqual(markers, markers.map((_, i) => i), `Non-sequential markers: ${id}`);
  screenshots.add(id);
  figureCount++;
}
assert.equal(figureCount, screenshots.size * 2, 'Screenshots need ES and EN legends');
console.log(`Checked ${ids.length} unique IDs, local anchors, ${assets.size} images and ${screenshots.size} numbered screenshots in ES/EN.`);
