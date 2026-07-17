#!/usr/bin/env node
/**
 * Build Assets — Babel transpile + Minify JS/CSS + pre-compress with Brotli & Gzip
 *
 * Usage:  node tools/build-assets.js [--clean]
 *         --clean  Remove all generated .min.* / .gz / .br files and public/build-legacy
 *
 * Pipeline:
 *   1. Babel transpile:  public/js → public/build-legacy  (ES5 for Android 5-7)
 *   2. Terser minify:    public/build-legacy/*.js → public/build-legacy/*.min.js
 *   3. Pre-compress:     .min.js → .min.js.gz + .min.js.br
 *   4. CSS (unchanged):  public/css → .min.css + .min.css.gz + .min.css.br
 *   5. Modern copy:      node tools/build-modern.js (ES6+ for modern browsers)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');
const { minify: terserMinify } = require('terser');
const CleanCSS = require('clean-css');

const PUBLIC = path.join(__dirname, '..', 'public');
const JS_SRC = path.join(PUBLIC, 'js');
const JS_BUILD = path.join(PUBLIC, 'build-legacy');
const JS_MODERN = path.join(PUBLIC, 'build-modern');
const CONCURRENCY = 4;

// ───────────── Helpers ─────────────

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
    console.warn(`WARN remove skipped: ${path.relative(PUBLIC, targetPath)} (${err.code || err.message})`);
    return false;
  }
}

function cleanDirContents(dir) {
  ensureDir(dir);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    tryRemove(path.join(dir, entry.name));
  }
}

function walk(dir, exts) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full, exts));
    } else if (exts.some(e => entry.name.endsWith(e)) && !entry.name.includes('.min.')) {
      results.push(full);
    }
  }
  return results;
}

function gzipBuf(buf) {
  return zlib.gzipSync(buf, { level: 9 });
}

function brotliBuf(buf, isText) {
  return zlib.brotliCompressSync(buf, {
    params: {
      [zlib.constants.BROTLI_PARAM_MODE]: isText
        ? zlib.constants.BROTLI_MODE_TEXT
        : zlib.constants.BROTLI_MODE_GENERIC,
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
    },
  });
}

function pct(original, compressed) {
  if (!original) return '0%';
  return ((1 - compressed / original) * 100).toFixed(1) + '%';
}

// ───────────── Clean ─────────────

function cleanGenerated() {
  const exts = ['.min.js', '.min.css', '.min.js.gz', '.min.css.gz', '.min.js.br', '.min.css.br'];
  let count = 0;
  // Clean from public/build-legacy
  if (fs.existsSync(JS_BUILD)) {
    cleanDirContents(JS_BUILD);
    console.log(`Cleaned public/build-legacy directory contents`);
  }
  // Clean from public/build-modern
  if (fs.existsSync(JS_MODERN)) {
    cleanDirContents(JS_MODERN);
    console.log(`Cleaned public/build-modern directory contents`);
  }
  // Also clean legacy public/build if present
  const JS_BUILD_OLD = path.join(PUBLIC, 'build');
  if (fs.existsSync(JS_BUILD_OLD)) {
    cleanDirContents(JS_BUILD_OLD);
    console.log(`Cleaned public/build directory (legacy) contents`);
  }
  // Clean from public/css
  for (const ext of exts) {
    for (const f of walk(path.join(PUBLIC, 'css'), [ext])) {
      fs.unlinkSync(f);
      count++;
    }
  }
  // Also clean any leftover .min files in public/js
  for (const ext of exts) {
    for (const f of walk(JS_SRC, [ext])) {
      fs.unlinkSync(f);
      count++;
    }
  }
  console.log(`Cleaned ${count} generated files`);
}

// ───────────── Polyfill vendor copy ─────────────

function copyPolyfillVendors() {
  const vendorDir = path.join(JS_BUILD, 'polyfills');
  if (!fs.existsSync(vendorDir)) fs.mkdirSync(vendorDir, { recursive: true });

  const vendorFiles = [
    { src: 'core-js-bundle/minified.js', dest: 'core-js-bundle.min.js' },
    { src: 'whatwg-fetch/dist/fetch.umd.js', dest: 'fetch.min.js' },
    { src: 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only.js', dest: 'abortcontroller.min.js' },
  ];

  console.log('── Copying polyfill vendor files to public/build-legacy/polyfills/ ──\n');
  for (const v of vendorFiles) {
    const srcPath = path.join(__dirname, '..', 'node_modules', v.src);
    const destPath = path.join(vendorDir, v.dest);
    if (!fs.existsSync(srcPath)) {
      console.error(`  WARN: ${v.src} not found — run npm install`);
      continue;
    }
    const buf = fs.readFileSync(srcPath);
    fs.writeFileSync(destPath, buf);

    const gz = gzipBuf(buf);
    fs.writeFileSync(destPath + '.gz', gz);
    const br = brotliBuf(buf, true);
    fs.writeFileSync(destPath + '.br', br);

    console.log(`  POLY ${v.dest}  ${(buf.length / 1024).toFixed(0)}K → gz ${(gz.length / 1024).toFixed(0)}K → br ${(br.length / 1024).toFixed(0)}K`);
  }
  console.log('');
}

// ───────────── Build ─────────────

async function processJS(srcPath) {
  const src = fs.readFileSync(srcPath, 'utf8');
  const result = await terserMinify(src, {
    compress: {
      passes: 2,
      drop_console: false, // keep console for debugging
      pure_getters: true,
      unsafe_math: true,
    },
    mangle: {
      toplevel: false, // don't mangle top-level — functions are referenced cross-file
    },
    format: {
      comments: false,
    },
  });
  if (result.error) throw result.error;
  const minBuf = Buffer.from(result.code, 'utf8');
  const minPath = srcPath.replace(/\.js$/, '.min.js');
  fs.writeFileSync(minPath, minBuf);

  const gz = gzipBuf(minBuf);
  fs.writeFileSync(minPath + '.gz', gz);

  const br = brotliBuf(minBuf, true);
  fs.writeFileSync(minPath + '.br', br);

  return { src: src.length, min: minBuf.length, gz: gz.length, br: br.length };
}

function processCSS(srcPath) {
  const src = fs.readFileSync(srcPath, 'utf8');
  const result = new CleanCSS({ level: 2 }).minify(src);
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  const minBuf = Buffer.from(result.styles, 'utf8');
  const minPath = srcPath.replace(/\.css$/, '.min.css');
  fs.writeFileSync(minPath, minBuf);

  const gz = gzipBuf(minBuf);
  fs.writeFileSync(minPath + '.gz', gz);

  const br = brotliBuf(minBuf, true);
  fs.writeFileSync(minPath + '.br', br);

  return { src: src.length, min: minBuf.length, gz: gz.length, br: br.length };
}

async function build() {
  ensureDir(JS_BUILD);

  // ── Step 1: Babel transpile public/js → public/build-legacy ──
  console.log('── Babel: transpiling public/js → public/build-legacy (ES5 for Android 5-7) ──\n');
  try {
    const babelBin = path.join(__dirname, '..', 'node_modules', '.bin', 'babel');
    const ignorePattern = '**/*.min.js,**/*.min.js.gz,**/*.min.js.br,**/*.react.jsx';
    const cmd = `"${babelBin}" "${JS_SRC}" --out-dir "${JS_BUILD}" --ignore "${ignorePattern}"`;
    execSync(cmd, { stdio: 'inherit', cwd: path.join(__dirname, '..'), shell: true });
    console.log('\n  Babel transpilation complete.\n');
  } catch (err) {
    console.error('  Babel transpilation FAILED:', err.message);
    process.exit(1);
  }

  // ── Step 1b: Copy polyfill vendor files ──
  copyPolyfillVendors();

  // ── Step 2: Minify + compress ──
  const jsFiles = walk(JS_BUILD, ['.js']);
  const cssFiles = walk(path.join(PUBLIC, 'css'), ['.css']);

  console.log(`Found ${jsFiles.length} JS (build) + ${cssFiles.length} CSS files\n`);

  let totalSrc = 0, totalMin = 0, totalGz = 0, totalBr = 0;

  // Process JS in batches
  for (let i = 0; i < jsFiles.length; i += CONCURRENCY) {
    const batch = jsFiles.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(async (f) => {
      try {
        const r = await processJS(f);
        const rel = path.relative(PUBLIC, f);
        console.log(`  JS  ${rel}  ${(r.src / 1024).toFixed(0)}K → min ${(r.min / 1024).toFixed(0)}K (${pct(r.src, r.min)}) → br ${(r.br / 1024).toFixed(0)}K (${pct(r.src, r.br)})`);
        return r;
      } catch (err) {
        console.error(`  ERR ${path.relative(PUBLIC, f)}: ${err.message}`);
        return null;
      }
    }));
    for (const r of results) {
      if (!r) continue;
      totalSrc += r.src;
      totalMin += r.min;
      totalGz += r.gz;
      totalBr += r.br;
    }
  }

  // Process CSS (synchronous, usually fast)
  for (const f of cssFiles) {
    try {
      const r = processCSS(f);
      const rel = path.relative(PUBLIC, f);
      console.log(`  CSS ${rel}  ${(r.src / 1024).toFixed(0)}K → min ${(r.min / 1024).toFixed(0)}K (${pct(r.src, r.min)}) → br ${(r.br / 1024).toFixed(0)}K (${pct(r.src, r.br)})`);
      totalSrc += r.src;
      totalMin += r.min;
      totalGz += r.gz;
      totalBr += r.br;
    } catch (err) {
      console.error(`  ERR ${path.relative(PUBLIC, f)}: ${err.message}`);
    }
  }

  console.log(`\n── Legacy Build Summary ──`);
  console.log(`  Source:   ${(totalSrc / 1024).toFixed(0)} KB`);
  console.log(`  Minified: ${(totalMin / 1024).toFixed(0)} KB (${pct(totalSrc, totalMin)} smaller)`);
  console.log(`  Gzip:     ${(totalGz / 1024).toFixed(0)} KB (${pct(totalSrc, totalGz)} smaller)`);
  console.log(`  Brotli:   ${(totalBr / 1024).toFixed(0)} KB (${pct(totalSrc, totalBr)} smaller)`);

  // ── Step 5: Build modern (ES6+ copy) ──
  console.log('\n── Running build-modern (ES6+ copy for modern browsers) ──\n');
  try {
    const buildModernScript = path.join(__dirname, 'build-modern.js');
    execSync(`node "${buildModernScript}"`, { stdio: 'inherit', cwd: path.join(__dirname, '..'), shell: true });
  } catch (err) {
    console.error('  build-modern FAILED:', err.message);
    process.exit(1);
  }
}

// ───────────── Main ─────────────

if (process.argv.includes('--clean')) {
  cleanGenerated();
} else {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
