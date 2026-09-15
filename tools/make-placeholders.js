/* Generates the placeholder SVG artwork in assets/img/.
   Run with:  node tools/make-placeholders.js
   Delete this file (and the images) once real photography is in place. */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'img');
fs.mkdirSync(OUT, { recursive: true });

/* SVG is XML — ampersands and angle brackets must be escaped or the file
   fails to parse and the browser shows a broken image. */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const placeholder = (rawLabel, w, h, seed) => {
  const label = esc(rawLabel);
  const a = ['#0033a0', '#082e78', '#1b52d6', '#06225a'][seed % 4];
  const b = ['#1b52d6', '#0033a0', '#06225a', '#082e78'][(seed + 1) % 4];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g${seed})"/>
  <g fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="2">
    <circle cx="${w * 0.78}" cy="${h * 0.26}" r="${h * 0.30}"/>
    <circle cx="${w * 0.78}" cy="${h * 0.26}" r="${h * 0.46}"/>
    <circle cx="${w * 0.22}" cy="${h * 0.82}" r="${h * 0.24}"/>
  </g>
  <path d="M0 ${h} L${w * 0.42} ${h * 0.34} L${w * 0.62} ${h} Z" fill="#ffffff" fill-opacity="0.07"/>
  <path d="M${w * 0.5} ${h} L${w * 0.86} ${h * 0.52} L${w} ${h * 0.78} L${w} ${h} Z" fill="#e8a317" fill-opacity="0.22"/>
  <text x="${w / 2}" y="${h / 2}" text-anchor="middle" dominant-baseline="middle"
        font-family="Archivo, Helvetica, Arial, sans-serif" font-size="${Math.round(h * 0.062)}"
        font-weight="700" letter-spacing="2" fill="#ffffff" fill-opacity="0.72">${label}</text>
</svg>
`;
};

const images = [
  ['ph-students', 'REPLACE — SCHOLARS', 1200, 900],
  ['ph-mission', 'REPLACE — CHECK PRESENTATION', 1200, 900],
  ['ph-community', 'REPLACE — COMMUNITY SERVICE', 1200, 900],
  ['ph-linen', 'REPLACE — LINEN & BLUES', 1200, 675],
  ['ph-brisket', 'REPLACE — BRISKET & BROTHERHOOD', 1200, 675],
  ['ph-board', 'REPLACE — BOARD OF DIRECTORS', 1200, 675],
  ['ph-portrait', 'PHOTO', 600, 600],
];

images.forEach(([name, label, w, h], i) => {
  fs.writeFileSync(path.join(OUT, name + '.svg'), placeholder(label, w, h, i));
});

/* Hero background pattern — interlocking chevrons, very low contrast. */
fs.writeFileSync(path.join(OUT, 'pattern-chevron.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <g fill="none" stroke="#ffffff" stroke-opacity="0.09" stroke-width="14" stroke-linecap="square">
    ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M60 ${40 + i * 62} L200 ${110 + i * 62} L340 ${40 + i * 62}"/>`).join('\n    ')}
  </g>
</svg>
`);

console.log('Wrote ' + (images.length + 1) + ' SVGs to assets/img/');
