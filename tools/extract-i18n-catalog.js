const fs = require('fs');
const path = require('path');

const root = process.cwd();
const exts = new Set(['.js', '.ejs', '.html']);
const skipDirs = new Set(['node_modules', '.git', '.vscode', 'coverage', 'dist', 'build']);

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walk(abs, out);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (exts.has(ext)) out.push(abs);
  }
  return out;
}

function normalizeWhitespace(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function shouldKeepText(raw) {
  const text = normalizeWhitespace(raw);
  if (!text) return false;
  if (text.length < 2 || text.length > 280) return false;
  if (!/[\p{L}]/u.test(text)) return false;
  if (/^https?:\/\//i.test(text)) return false;
  if (/^[\w./:#?&=%+\-{}<>\[\]$]+$/.test(text) && !/\s/.test(text)) return false;
  if (/^(function|return|const|let|var|if|else|for|while|switch)\b/.test(text)) return false;
  if (/^[A-Z0-9_\-]{3,}$/.test(text)) return false;
  return true;
}

function pushText(map, text, relPath) {
  const t = normalizeWhitespace(text);
  if (!shouldKeepText(t)) return;
  if (!map.has(t)) map.set(t, new Set());
  map.get(t).add(relPath.replace(/\\/g, '/'));
}

function extractFromMarkup(content, relPath, map) {
  const withoutCode = content
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<%[\s\S]*?%>/g, ' ');

  const tagText = withoutCode.match(/>[^<>]+</g) || [];
  tagText.forEach((chunk) => {
    pushText(map, chunk.slice(1, -1), relPath);
  });

  const attrRegex = /(placeholder|title|aria-label|alt|value)\s*=\s*(["'])([\s\S]*?)\2/gi;
  let m;
  while ((m = attrRegex.exec(withoutCode)) !== null) {
    pushText(map, m[3], relPath);
  }
}

function extractFromJs(content, relPath, map) {
  const strRegex = /'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"/g;
  let m;
  while ((m = strRegex.exec(content)) !== null) {
    const val = (m[1] || m[2] || '').replace(/\\n/g, ' ').replace(/\\t/g, ' ');
    pushText(map, val, relPath);
  }

  const tplRegex = /`([^`$]*(?:\$\{[^}]*\}[^`]*)*)`/g;
  while ((m = tplRegex.exec(content)) !== null) {
    const pure = String(m[1] || '').replace(/\$\{[^}]*\}/g, ' ').trim();
    pushText(map, pure, relPath);
  }
}

function main() {
  const files = walk(root);
  const map = new Map();

  for (const file of files) {
    const rel = path.relative(root, file);
    const content = fs.readFileSync(file, 'utf8');
    const ext = path.extname(file).toLowerCase();
    if (ext === '.ejs' || ext === '.html') extractFromMarkup(content, rel, map);
    if (ext === '.js') extractFromJs(content, rel, map);
  }

  const catalog = Array.from(map.entries())
    .map(([text, filesSet]) => ({ text, files: Array.from(filesSet).sort() }))
    .sort((a, b) => a.text.localeCompare(b.text, 'vi'));

  const outDir = path.join(root, 'config');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outCatalog = path.join(outDir, 'i18n-text-catalog.json');
  fs.writeFileSync(outCatalog, JSON.stringify(catalog, null, 2), 'utf8');

  const template = {
    vi: {},
    en: {},
    zh: {},
    note: 'Map text source -> translation by language. Fill manually, then merge into utils/i18n.js or customTranslations.'
  };
  catalog.forEach((item) => {
    template.vi[item.text] = item.text;
    template.en[item.text] = '';
    template.zh[item.text] = '';
  });

  const outTemplate = path.join(outDir, 'i18n-manual-template.json');
  fs.writeFileSync(outTemplate, JSON.stringify(template, null, 2), 'utf8');

  console.log('Extracted', catalog.length, 'text entries');
  console.log('Catalog:', outCatalog);
  console.log('Template:', outTemplate);
}

main();
