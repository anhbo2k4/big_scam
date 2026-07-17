#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const inputArg = process.argv[2] || 'config/i18n-admin-dashboard-template.generated.csv';
const csvPath = path.isAbsolute(inputArg) ? inputArg : path.join(root, inputArg);
const templatePath = path.join(root, 'config', 'i18n-manual-template.json');

if (!fs.existsSync(csvPath)) {
  console.error('CSV file not found:', csvPath);
  process.exit(1);
}
if (!fs.existsSync(templatePath)) {
  console.error('Manual template not found:', templatePath);
  process.exit(1);
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let i = 0;
  let quoted = false;
  while (i < line.length) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i += 1;
        continue;
      }
      cur += ch;
      i += 1;
      continue;
    }
    if (ch === '"') {
      quoted = true;
      i += 1;
      continue;
    }
    if (ch === ',') {
      out.push(cur);
      cur = '';
      i += 1;
      continue;
    }
    cur += ch;
    i += 1;
  }
  out.push(cur);
  return out;
}

const raw = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
if (lines.length < 2) {
  console.error('CSV has no data rows.');
  process.exit(1);
}

const header = parseCsvLine(lines[0]).map((h) => h.trim());
const idxVi = header.indexOf('vi_text');
const idxEn = header.indexOf('en_text');
const idxZh = header.indexOf('zh_text');
if (idxVi < 0 || idxEn < 0 || idxZh < 0) {
  console.error('CSV must contain columns: vi_text,en_text,zh_text');
  process.exit(1);
}

const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
template.vi = (template.vi && typeof template.vi === 'object') ? template.vi : {};
template.en = (template.en && typeof template.en === 'object') ? template.en : {};
template.zh = (template.zh && typeof template.zh === 'object') ? template.zh : {};

let updatedEn = 0;
let updatedZh = 0;

for (let i = 1; i < lines.length; i += 1) {
  const cols = parseCsvLine(lines[i]);
  const vi = String(cols[idxVi] || '').trim();
  if (!vi) continue;

  const en = String(cols[idxEn] || '').trim();
  const zh = String(cols[idxZh] || '').trim();

  if (!(vi in template.vi)) template.vi[vi] = vi;

  if (en) {
    if (String(template.en[vi] || '') !== en) {
      template.en[vi] = en;
      updatedEn += 1;
    }
  }

  if (zh) {
    if (String(template.zh[vi] || '') !== zh) {
      template.zh[vi] = zh;
      updatedZh += 1;
    }
  }
}

fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));

console.log(JSON.stringify({
  csvPath,
  rows: lines.length - 1,
  updatedEn,
  updatedZh,
  templatePath,
}, null, 2));
