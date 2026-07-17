#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { translateFreeText } = require('../utils/i18n');

const root = process.cwd();
const templatePath = path.join(root, 'config', 'i18n-manual-template.json');

if (!fs.existsSync(templatePath)) {
  console.error('Missing manual template:', templatePath);
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
const vi = (json && typeof json.vi === 'object' && !Array.isArray(json.vi)) ? json.vi : {};
const en = (json && typeof json.en === 'object' && !Array.isArray(json.en)) ? json.en : {};
const zh = (json && typeof json.zh === 'object' && !Array.isArray(json.zh)) ? json.zh : {};

let filledEn = 0;
let filledZh = 0;
let unchangedEn = 0;
let unchangedZh = 0;

for (const key of Object.keys(vi)) {
  const text = String(key || '').trim();
  if (!text) continue;

  const curEn = String(en[text] || '').trim();
  if (!curEn) {
    const mappedEn = String(translateFreeText('en', text) || '').trim();
    if (mappedEn && mappedEn !== text) {
      en[text] = mappedEn;
      filledEn += 1;
    } else {
      unchangedEn += 1;
    }
  }

  const curZh = String(zh[text] || '').trim();
  if (!curZh) {
    const mappedZh = String(translateFreeText('zh', text) || '').trim();
    if (mappedZh && mappedZh !== text) {
      zh[text] = mappedZh;
      filledZh += 1;
    } else {
      unchangedZh += 1;
    }
  }
}

json.en = en;
json.zh = zh;
if (!json.note) {
  json.note = 'Fill en/zh manually. Keys are source texts collected from code.';
}

fs.writeFileSync(templatePath, JSON.stringify(json, null, 2));

console.log(JSON.stringify({
  totalVi: Object.keys(vi).length,
  filledEn,
  filledZh,
  stillMissingEnApprox: unchangedEn,
  stillMissingZhApprox: unchangedZh,
}, null, 2));
