#!/usr/bin/env node
/* Replaces {{TOKEN}} placeholders in every .html file at the repo root with the
   values in tools/content.json.
     node tools/fill-tokens.js            # write the replacements
     node tools/fill-tokens.js --dry-run  # show what would change, change nothing
   Empty values are skipped, so you can fill the JSON in over several passes.
   This is a one-time find-and-replace, not a build step — once a token is gone
   from the HTML you edit the HTML directly. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dry = process.argv.includes('--dry-run');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'content.json'), 'utf8'));

const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));
let totalReplaced = 0;

files.forEach(file => {
  const p = path.join(root, file);
  let src = fs.readFileSync(p, 'utf8');
  const before = src;
  let count = 0;

  Object.keys(data).forEach(key => {
    if (key.startsWith('_')) return;
    const value = data[key];
    if (value === '' || value == null) return;
    const token = '{{' + key + '}}';
    const hits = src.split(token).length - 1;
    if (hits) { src = src.split(token).join(value); count += hits; }
  });

  if (count) {
    totalReplaced += count;
    console.log((dry ? '[dry] ' : '') + file + ': ' + count + ' replacement(s)');
    if (!dry && src !== before) fs.writeFileSync(p, src);
  }
});

// Report anything still unfilled.
const remaining = new Set();
files.forEach(f => {
  (fs.readFileSync(path.join(root, f), 'utf8').match(/\{\{[A-Z0-9_]+\}\}/g) || [])
    .forEach(t => remaining.add(t));
});

console.log('\n' + totalReplaced + ' replacement(s) total.');
if (remaining.size) {
  console.log('Still unfilled (' + remaining.size + '): ' + Array.from(remaining).sort().join(' '));
  process.exitCode = dry ? 0 : 0;
} else {
  console.log('No placeholders left. Ready to deploy.');
}
