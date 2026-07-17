#!/usr/bin/env node
/**
 * build-modern.js — Copies public/js → public/build-modern
 * Cross-platform (works on Windows, no cp command).
 * Skips .min.js, .min.js.gz, .min.js.br files.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { minify: terserMinify } = require('terser');

const ROOT = path.join(__dirname, '..');
const SRC  = path.join(ROOT, 'public', 'js');
const DEST = path.join(ROOT, 'public', 'build-modern');
const CONCURRENCY = 4;

const SKIP_SUFFIXES = ['.min.js', '.min.js.gz', '.min.js.br', '.react.jsx'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function tryRemove(targetPath) {
  if (!fs.existsSync(targetPath)) return true;
  try {
    fs.rmSync(targetPath, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 120
    });
    return true;
  } catch (err) {
    console.warn(`  WARN remove skipped: ${path.relative(ROOT, targetPath)} (${err.code || err.message})`);
    return false;
  }
}

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (entry.name.endsWith('.js') && !SKIP_SUFFIXES.some(s => entry.name.endsWith(s))) {
      results.push(full);
    }
  }
  return results;
}

function gzipBuf(buf) {
  return zlib.gzipSync(buf, { level: 9 });
}
function brotliBuf(buf) {
  return zlib.brotliCompressSync(buf, {
    params: {
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
    },
  });
}
function pct(a, b) { return ((1 - b / a) * 100).toFixed(1) + '%'; }

async function processJS(srcPath) {
  const relPath = path.relative(SRC, srcPath);
  const destPath = path.join(DEST, relPath);
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const src = fs.readFileSync(srcPath, 'utf8');

  // Copy raw source as-is (modern build — no transpilation)
  fs.writeFileSync(destPath, src);

  // Minify with Terser but keep ES6+ — modern browsers can handle it
  const result = await terserMinify(src, {
    compress: { passes: 2, drop_console: false, pure_getters: true },
    mangle: { toplevel: false },
    format: { comments: false },
    ecma: 2017,        // keep modern syntax in output
    module: false,     // not a native ES module (window globals)
  });
  if (!result.code) return { src: src.length, min: src.length, gz: src.length, br: src.length };

  const minBuf = Buffer.from(result.code, 'utf8');
  const minPath = destPath.replace(/\.js$/, '.min.js');
  fs.writeFileSync(minPath, minBuf);

  const gz = gzipBuf(minBuf);
  fs.writeFileSync(minPath + '.gz', gz);
  const br = brotliBuf(minBuf);
  fs.writeFileSync(minPath + '.br', br);

  return { src: src.length, min: minBuf.length, gz: gz.length, br: br.length };
}

function cleanDestContents(destRoot) {
  ensureDir(destRoot);
  for (const entry of fs.readdirSync(destRoot, { withFileTypes: true })) {
    tryRemove(path.join(destRoot, entry.name));
  }
}

async function build() {
  console.log('── build-modern: copying public/js → public/build-modern ──\n');

  // Keep the root output folder and overwrite generated files in place.
  // On Windows, deleting build-modern entries can fail with EPERM even
  // though writing the updated files still succeeds.
  ensureDir(DEST);

  const files = walk(SRC);
  console.log(`Found ${files.length} JS source files\n`);

  let totalSrc = 0, totalMin = 0, totalBr = 0;

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(async (f) => {
      try {
        const r = await processJS(f);
        const rel = path.relative(SRC, f);
        console.log(`  MOD  ${rel}  ${(r.src/1024).toFixed(0)}K → min ${(r.min/1024).toFixed(0)}K (${pct(r.src, r.min)}) → br ${(r.br/1024).toFixed(0)}K`);
        return r;
      } catch (err) {
        console.error(`  ERR  ${path.relative(SRC, f)}: ${err.message}`);
        return null;
      }
    }));
    for (const r of results) {
      if (!r) continue;
      totalSrc += r.src;
      totalMin += r.min;
      totalBr += r.br;
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`  Source:  ${(totalSrc/1024).toFixed(0)} KB`);
  console.log(`  Minified: ${(totalMin/1024).toFixed(0)} KB (${pct(totalSrc, totalMin)} smaller)`);
  console.log(`  Brotli:   ${(totalBr/1024).toFixed(0)} KB`);
  console.log('\n  ✅ build-modern complete\n');
}

build().catch(err => { console.error(err); process.exit(1); });
