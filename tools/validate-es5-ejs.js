'use strict';
const fs = require('fs');
const path = require('path');

function walkEjs(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkEjs(full));
    else if (entry.name.endsWith('.ejs')) results.push(full);
  }
  return results;
}

const files = walkEjs(path.join(__dirname, '..', 'views'));
const patterns = [
  { name: 'const', re: /\bconst\s+\w/ },
  { name: 'let', re: /\blet\s+\w/ },
  { name: '=>', re: /\)\s*=>|=>\s*\{/ },
  { name: '?.', re: /\?\.\s*[(a-zA-Z_$\[]/ },
  { name: '??', re: /\?\?[^>]/ },
  { name: 'class', re: /\bclass\s+\w+\s*\{/ },
  { name: 'for..of', re: /\bfor\s*\(\s*(?:var|let|const)\s+\w+\s+of\b/ },
];

let total = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const scriptRe = /<script(?:\s[^>]*)?\s*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = scriptRe.exec(html)) !== null) {
    const tag = m[0];
    if (/\bsrc\s*=/i.test(tag.substring(0, tag.indexOf('>') + 1))) continue;
    const js = m[1];
    // Strip comments and EJS tags (server-side code)
    const clean = js
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '')
      .replace(/<%[\s\S]*?%>/g, '"__EJS__"');

    for (const p of patterns) {
      const pm = clean.match(p.re);
      if (pm) {
        const rel = path.relative(path.join(__dirname, '..'), f);
        const lineNum = html.substring(0, m.index).split('\n').length;
        console.log(`  ${rel}:${lineNum} — ${p.name} → ${pm[0].substring(0, 40)}`);
        total++;
        break;
      }
    }
  }
}

console.log(`\nTotal EJS inline violations (excl server-side EJS): ${total}`);
