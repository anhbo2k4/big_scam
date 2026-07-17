'use strict';
const fs = require('fs');
const path = require('path');

function walkDir(dir, ext) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full, ext));
    else if (full.endsWith(ext)) results.push(full);
  }
  return results;
}

const buildDir = path.join(__dirname, '..', 'public', 'build-legacy');
const viewsDir = path.join(__dirname, '..', 'views');

const patterns = [
  { name: 'arrow function', re: /(?<!['"\\])\)\s*=>\s*[{(]|(?<!['"\\])=>\s*\{/ },
  { name: 'optional chaining ?.', re: /\?\.\s*[(\[a-zA-Z_$]/ },
  { name: 'nullish coalescing ??', re: /\?\?[^>]/ },
  { name: 'class declaration', re: /\bclass\s+[A-Z]\w*\s*(\{|extends\b)/ },
  { name: 'for...of', re: /\bfor\s*\(\s*(?:var|let|const)\s+\w+\s+of\b/ },
  { name: 'template literal', re: /(?<!\\)`[^`]*\$\{/ },
  { name: 'import/export', re: /\b(?:import|export)\s+(?:\{|default\b|function\b|class\b|const\b|let\b|var\b)/ },
  { name: 'dynamic import()', re: /\bimport\s*\(/ },
];

// Stricter patterns for const/let — skip when inside comments
const constLetPatterns = [
  { name: 'const', re: /\bconst\s+[a-zA-Z_${\[]/ },
  { name: 'let', re: /\blet\s+[a-zA-Z_${\[]/ },
];

let totalViolations = 0;
const violations = [];

function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
}

// 1. Check public/build-legacy/ JS files (Babel ES5 output)
console.log('=== Checking public/build-legacy/ (transpiled ES5 JS files) ===');
const jsFiles = walkDir(buildDir, '.js').filter(f => !f.endsWith('.min.js') && !f.endsWith('.min.js.gz') && !f.endsWith('.min.js.br'));
for (const f of jsFiles) {
  const code = stripComments(fs.readFileSync(f, 'utf8'));
  for (const p of [...patterns, ...constLetPatterns]) {
    const m = code.match(p.re);
    if (m) {
      const rel = path.relative(path.join(__dirname, '..'), f);
      const lineNum = code.substring(0, m.index).split('\n').length;
      violations.push({ file: rel, line: lineNum, kind: p.name, match: m[0].substring(0, 50) });
      totalViolations++;
    }
  }
}

// 2. Check EJS inline <script> blocks
console.log('=== Checking EJS inline <script> blocks ===');
const ejsFiles = walkDir(viewsDir, '.ejs');
for (const f of ejsFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const scriptRe = /<script(?:\s[^>]*)?\s*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = scriptRe.exec(html)) !== null) {
    const tag = m[0];
    if (/\bsrc\s*=/i.test(tag.substring(0, tag.indexOf('>') + 1))) continue;
    const js = m[1];
    // Strip comments a EJS server-side tags
    const clean = stripComments(js).replace(/<%[\s\S]*?%>/g, '"__EJS__"');

    for (const p of [...patterns, ...constLetPatterns]) {
      const pm = clean.match(p.re);
      if (pm) {
        const rel = path.relative(path.join(__dirname, '..'), f);
        const lineNum = html.substring(0, m.index).split('\n').length;
        violations.push({ file: rel, line: lineNum, kind: p.name, match: pm[0].substring(0, 50) });
        totalViolations++;
        break; // one violation per script block is enough
      }
    }
  }
}

console.log('');
if (violations.length) {
  console.log('VIOLATIONS FOUND:');
  for (const v of violations) {
    console.log(`  ${v.file}:${v.line} — [${v.kind}] ${v.match}`);
  }
} else {
  console.log('ALL CLEAR — no modern JS syntax found in client-side code.');
}
console.log(`\nTotal violations: ${totalViolations}`);
