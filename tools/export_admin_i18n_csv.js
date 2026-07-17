#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const catalogPath = path.join(root, 'config', 'i18n-admin-dashboard-catalog.generated.json');
const templatePath = path.join(root, 'config', 'i18n-admin-dashboard-template.generated.json');
const outPath = path.join(root, 'config', 'i18n-admin-dashboard-template.generated.csv');

if (!fs.existsSync(catalogPath) || !fs.existsSync(templatePath)) {
  console.error('Missing input files. Run `npm run i18n:admin:refresh` first.');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

const en = template.en || {};
const zh = template.zh || {};

function esc(value) {
  const s = String(value == null ? '' : value);
  if (/[",\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const header = ['vi_text', 'en_text', 'zh_text', 'files'];
const lines = [header.join(',')];

for (const row of catalog) {
  const vi = String(row && row.text || '').trim();
  if (!vi) continue;
  const files = Array.isArray(row.files) ? row.files.join(' | ') : '';
  const line = [
    esc(vi),
    esc(en[vi] || ''),
    esc(zh[vi] || ''),
    esc(files),
  ].join(',');
  lines.push(line);
}

fs.writeFileSync(outPath, lines.join('\n'));
console.log(JSON.stringify({ outPath, rows: lines.length - 1 }, null, 2));
