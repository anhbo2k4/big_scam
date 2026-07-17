#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SCAN_DIRS = ['controllers', 'models', 'middleware', 'routes', 'services', 'utils', 'views', 'public/js', 'public/css'];
const ALLOWED_EXT = new Set(['.js', '.ejs', '.json', '.css', '.html', '.md']);
const SKIP_DIR_NAMES = new Set(['node_modules', '.git', '.venv']);

function walk(dir, out) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      walk(abs, out);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) continue;
    out.push(abs);
  }
}

function findBadLines(content) {
  const lines = content.split(/\r?\n/);
  const issues = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    // U+FFFD replacement char usually indicates broken source text.
    if (line.includes('�')) {
      issues.push({ line: i + 1, text: line.trim().slice(0, 180) });
    }
  }
  return issues;
}

const files = [];
for (const dir of SCAN_DIRS) walk(path.join(ROOT, dir), files);

const findings = [];
for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const badLines = findBadLines(content);
  if (badLines.length) findings.push({ file: rel, badLines });
}

if (!findings.length) {
  console.log('OK: No broken replacement characters found in hardcoded source text.');
  process.exit(0);
}

console.error('Found potential encoding issues in hardcoded source text:');
for (const f of findings) {
  for (const item of f.badLines) {
    console.error(`- ${f.file}:${item.line} -> ${item.text}`);
  }
}
process.exit(1);
