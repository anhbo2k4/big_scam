#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const inPath = path.join(root, 'config', 'i18n-text-catalog.generated.json');
const outCatalog = path.join(root, 'config', 'i18n-admin-dashboard-catalog.generated.json');
const outTemplate = path.join(root, 'config', 'i18n-admin-dashboard-template.generated.json');
const outTodo = path.join(root, 'config', 'i18n-admin-dashboard-translation-todo.generated.json');
const manualTemplatePath = path.join(root, 'config', 'i18n-manual-template.json');

if (!fs.existsSync(inPath)) {
  console.error('Missing input catalog:', inPath);
  console.error('Run "npm run i18n:extract" first.');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const manual = fs.existsSync(manualTemplatePath)
  ? JSON.parse(fs.readFileSync(manualTemplatePath, 'utf8'))
  : { vi: {}, en: {}, zh: {} };

const rows = catalog.filter((item) => {
  if (!item || !Array.isArray(item.files)) return false;
  return item.files.some((f) =>
    f === 'views/admin/adminDashboard.ejs' ||
    f.startsWith('views/admin/partials/')
  );
});

const template = {
  vi: {},
  en: {},
  zh: {},
  note: 'Admin dashboard + partials only',
};

for (const row of rows) {
  const text = String(row.text || '').trim();
  if (!text) continue;
  template.vi[text] = text;
  template.en[text] = (manual.en && manual.en[text]) ? String(manual.en[text]) : '';
  template.zh[text] = (manual.zh && manual.zh[text]) ? String(manual.zh[text]) : '';
}

const missingEn = [];
const missingZh = [];
for (const text of Object.keys(template.vi).sort((a, b) => a.localeCompare(b))) {
  const files = (rows.find((r) => r.text === text) || {}).files || [];
  if (!String(template.en[text] || '').trim()) missingEn.push({ text, files });
  if (!String(template.zh[text] || '').trim()) missingZh.push({ text, files });
}

const todo = {
  summary: {
    sourceTexts: Object.keys(template.vi).length,
    missingEn: missingEn.length,
    missingZh: missingZh.length,
  },
  missing: {
    en: missingEn,
    zh: missingZh,
  },
};

fs.writeFileSync(outCatalog, JSON.stringify(rows, null, 2));
fs.writeFileSync(outTemplate, JSON.stringify(template, null, 2));
fs.writeFileSync(outTodo, JSON.stringify(todo, null, 2));

console.log(JSON.stringify(todo.summary, null, 2));
