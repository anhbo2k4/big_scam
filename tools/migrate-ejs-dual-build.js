#!/usr/bin/env node
/**
 * migrate-ejs-dual-build.js
 *
 * Transforms all EJS files to use the module/nomodule dual-build pattern:
 *   - Modern browsers:  <script type="module" src="/build-modern/...">
 *   - Legacy browsers:  <script nomodule src="/build-legacy/...">
 *
 * Rules:
 *   1. Polyfill scripts (/js/polyfills/*, /js/polyfills.js)
 *        → <script nomodule> only, path → /build-legacy/...
 *   2. All other app scripts (/js/*.js)
 *        → Add BOTH type="module" → /build-modern/... AND nomodule → /build-legacy/...
 *   3. CDN scripts (https://...) are left untouched.
 *   4. Dynamic lazy-load queue in lucky-mystery-box.ejs:
 *        Injects runtime module-detection + path substitution.
 *
 * Run:  node tools/migrate-ejs-dual-build.js [--dry-run]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const VIEWS_DIR = path.join(__dirname, '..', 'views');

// ─── Helpers ────────────────────────────────────────────────────────────────

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.name.endsWith('.ejs')) results.push(full);
  }
  return results;
}

function isPolyfillPath(jsPath) {
  // Matches /js/polyfills/*, /js/polyfills.js, and asset() equivalents
  return /^\/js\/polyfills(\/|\.js)/.test(jsPath.trim());
}

/*
 * Transform a single <script> line that has src="/js/..." or src="<%= asset('/js/...') %>"
 * Returns the replacement string (possibly 2 lines for app scripts).
 */
function transformScriptLine(line) {
  // ── Case 1: asset() helper  ──────────────────────────────────────────────
  // Matches: <script src="<%= asset('/js/PATH') %>" [defer]></script>
  const assetRe = /^(\s*)<script(\s[^>]*)?\ssrc="<%=\s*asset\('(\/js\/[^']+)'\)\s*%>"([^>]*)>(.*?<\/script>)?/;
  const assetMatch = line.match(assetRe);
  if (assetMatch) {
    const indent = assetMatch[1];
    const before = (assetMatch[2] || '').replace(/\s*src\s*=\s*"[^"]*"/, '').trim();
    const jsPath = assetMatch[3];
    const after = (assetMatch[4] || '').trim();
    const tail = (assetMatch[5] || '</script>');

    const modernPath = jsPath.replace('/js/', '/build-modern/');
    const legacyPath = jsPath.replace('/js/', '/build-legacy/');

    if (isPolyfillPath(jsPath)) {
      // Polyfills: nomodule only
      const tag = buildTag(indent, 'nomodule', before, `<%= asset('${legacyPath}') %>`, after);
      return tag + '\n';
    } else {
      // App scripts: both tags
      const modTag = buildTag(indent, 'module', before, `<%= asset('${modernPath}') %>`, after);
      const legTag = buildTag(indent, 'nomodule', before, `<%= asset('${legacyPath}') %>`, after);
      return modTag + '\n' + legTag + '\n';
    }
  }

  // ── Case 2: Hardcoded /js/ path ──────────────────────────────────────────
  // Matches: <script src="/js/PATH" [defer]></script>
  const hardRe = /^(\s*)<script(\s[^>]*)?\ssrc="(\/js\/[^"]+)"([^>]*)>(.*?<\/script>)?/;
  const hardMatch = line.match(hardRe);
  if (hardMatch) {
    const indent = hardMatch[1];
    const before = (hardMatch[2] || '').replace(/\s*src\s*=\s*"[^"]*"/, '').trim();
    const jsPath = hardMatch[3];
    const after = (hardMatch[4] || '').trim();

    // Extract path without query string for the replacement; keep query string as-is
    const [pathPart, ...qsParts] = jsPath.split('?');
    const qs = qsParts.length ? '?' + qsParts.join('?') : '';

    const modernPath = pathPart.replace('/js/', '/build-modern/') + qs;
    const legacyPath = pathPart.replace('/js/', '/build-legacy/') + qs;

    if (isPolyfillPath(jsPath)) {
      const tag = buildTag(indent, 'nomodule', before, legacyPath, after);
      return tag + '\n';
    } else {
      const modTag = buildTag(indent, 'module', before, modernPath, after);
      const legTag = buildTag(indent, 'nomodule', before, legacyPath, after);
      return modTag + '\n' + legTag + '\n';
    }
  }

  return null; // no match
}

function buildTag(indent, kind, extraAttrs, src, trailingAttrs) {
  const typeAttr = kind === 'module' ? ' type="module"' : ' nomodule';
  const extras = extraAttrs ? ` ${extraAttrs}` : '';
  const trailing = trailingAttrs ? ` ${trailingAttrs}` : '';
  return `${indent}<script${typeAttr}${extras} src="${src}"${trailing}></script>`;
}

// ─── Dynamic queue injection (lucky-mystery-box.ejs special case) ────────────

const QUEUE_INJECTION_MARKER = '/* @dual-build-patched */';
const QUEUE_INJECTION = `      var _isModern = 'noModule' in HTMLScriptElement.prototype;
      queue = queue.map(function(u) {
        var base = _isModern ? '/build-modern/' : '/build-legacy/';
        return u.replace('/js/', base);
      }); ${QUEUE_INJECTION_MARKER}`;

function injectQueueDetection(content) {
  // Already patched?
  if (content.includes(QUEUE_INJECTION_MARKER)) return content;

  // Find the queue variable declaration end and insert after it
  // Pattern: var queue = [...];
  const queueEnd = /(\bvar queue = \[[^\]]*\];)/s;
  return content.replace(queueEnd, (match) => {
    return match + '\n' + QUEUE_INJECTION;
  });
}

// ─── Per-file transform ──────────────────────────────────────────────────────

function transformFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let content = original;

  // Line-by-line transform for static <script> tags
  const lines = content.split('\n');
  const transformed = lines.map(line => {
    // Skip lines already using build-modern or build-legacy or nomodule/type="module"
    if (line.includes('/build-modern/') || line.includes('/build-legacy/')) return line;
    if (/nomodule|type="module"/.test(line) && line.includes('<script')) return line;

    const result = transformScriptLine(line);
    if (result !== null) {
      // Remove the trailing newline from result since split/join handles it
      return result.replace(/\n$/, '');
    }
    return line;
  });

  content = transformed.join('\n');

  // Special: inject module detection for dynamic script queue
  if (filePath.endsWith('lucky-mystery-box.ejs')) {
    content = injectQueueDetection(content);
  }

  if (content === original) return false; // no change

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  return true;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const files = walk(VIEWS_DIR);
  console.log(`\n── EJS Dual-Build Migration ${DRY_RUN ? '(DRY RUN)' : ''} ──\n`);
  console.log(`Found ${files.length} EJS files\n`);

  let changed = 0;
  for (const f of files) {
    const rel = path.relative(path.join(__dirname, '..'), f);
    const wasChanged = transformFile(f);
    if (wasChanged) {
      console.log(`  UPDATED  ${rel}`);
      changed++;
    }
  }

  console.log(`\n  ${changed} file(s) ${DRY_RUN ? 'would be' : 'were'} updated.\n`);
  if (DRY_RUN) {
    console.log('  Run without --dry-run to apply changes.\n');
  }
}

main();
