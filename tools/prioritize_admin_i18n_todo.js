#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const catalogPath = path.join(root, 'config', 'i18n-admin-dashboard-catalog.generated.json');
const todoPath = path.join(root, 'config', 'i18n-admin-dashboard-translation-todo.generated.json');
const outPath = path.join(root, 'config', 'i18n-admin-dashboard-translation-priority.generated.json');

if (!fs.existsSync(catalogPath) || !fs.existsSync(todoPath)) {
  console.error('Missing required files. Run `npm run i18n:admin:refresh` first.');
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const todo = JSON.parse(fs.readFileSync(todoPath, 'utf8'));

const freqMap = new Map();
for (const row of catalog) {
  const text = String(row && row.text || '').trim();
  if (!text) continue;
  const files = Array.isArray(row.files) ? row.files : [];
  freqMap.set(text, {
    files,
    fileCount: files.length,
    inMainDashboard: files.includes('views/admin/adminDashboard.ejs'),
  });
}

function score(item) {
  const text = String(item && item.text || '').trim();
  const meta = freqMap.get(text) || { fileCount: 0, inMainDashboard: false };
  const len = text.length;
  const isLikelyUi = /[A-Za-zÀ-ỹ一-龥]/.test(text) && len <= 80;
  let s = 0;
  s += meta.fileCount * 3;
  if (meta.inMainDashboard) s += 10;
  if (isLikelyUi) s += 8;
  if (/^(Save|Cancel|Delete|Edit|Close|Search|Refresh|Export|Import|Approve|Reject|Create|Update|Lưu|Hủy|Xóa|Sửa|Đóng|Tìm|Làm mới|Xuất|Nhập|Duyệt|Từ chối|Tạo|Cập nhật)/i.test(text)) {
    s += 12;
  }
  return s;
}

function enrich(list) {
  return (Array.isArray(list) ? list : [])
    .map((item) => {
      const text = String(item && item.text || '').trim();
      const meta = freqMap.get(text) || { files: [], fileCount: 0, inMainDashboard: false };
      return {
        text,
        files: meta.files,
        fileCount: meta.fileCount,
        inMainDashboard: meta.inMainDashboard,
        priorityScore: score(item),
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore || b.fileCount - a.fileCount || a.text.localeCompare(b.text));
}

const missingEn = enrich(todo.missing && todo.missing.en);
const missingZh = enrich(todo.missing && todo.missing.zh);

const output = {
  summary: {
    sourceTexts: todo.summary ? todo.summary.sourceTexts : 0,
    missingEn: missingEn.length,
    missingZh: missingZh.length,
  },
  top100: {
    en: missingEn.slice(0, 100),
    zh: missingZh.slice(0, 100),
  },
  missing: {
    en: missingEn,
    zh: missingZh,
  },
};

fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(JSON.stringify({
  outPath,
  topEn: output.top100.en.length,
  topZh: output.top100.zh.length,
  missingEn: output.summary.missingEn,
  missingZh: output.summary.missingZh,
}, null, 2));
