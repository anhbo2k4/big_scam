#!/usr/bin/env node
/**
 * Transpile inline <script> blocks inside EJS templates to ES5.
 *
 * Handles EJS tags (<%= ... %>, <%- ... %>, <% ... %>) by temporarily
 * replacing them with JS-safe placeholders before running Babel, then
 * restoring them afterwards.
 *
 * Usage:
 *   node tools/transpile-ejs-inline.js          # dry-run (show changes)
 *   node tools/transpile-ejs-inline.js --apply   # write changes to disk
 */
'use strict';

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const VIEWS_DIR = path.join(__dirname, '..', 'views');
const DRY_RUN = !process.argv.includes('--apply');

// ─── Helpers ───

function walkEjs(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkEjs(full));
    } else if (entry.name.endsWith('.ejs')) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Find all inline <script>...</script> blocks (no src attribute).
 * Returns array of { start, end, content } (indices into the HTML string).
 */
function findInlineScripts(html) {
  const results = [];
  const openRe = /<script(?:\s[^>]*)?\s*>/gi;
  let match;

  while ((match = openRe.exec(html)) !== null) {
    const tag = match[0];
    // Skip <script src="..."> (external scripts)
    if (/\bsrc\s*=/i.test(tag)) continue;

    const contentStart = match.index + tag.length;
    const closeIdx = html.indexOf('</script>', contentStart);
    if (closeIdx === -1) continue;

    const content = html.substring(contentStart, closeIdx);
    // Skip empty or trivially small scripts
    if (content.trim().length < 10) continue;

    results.push({ start: contentStart, end: closeIdx, content });
  }
  return results;
}

/**
 * Replace EJS tags with safe JS placeholders and return a mapping.
 */
function shieldEjsTags(jsCode) {
  const map = [];
  let idx = 0;
  const shielded = jsCode.replace(/<%[\s\S]*?%>/g, (tag) => {
    const placeholder = `"__EJS_PLACEHOLDER_${idx}__"`;
    map.push({ placeholder, original: tag });
    idx++;
    return placeholder;
  });
  return { shielded, map };
}

/**
 * Restore EJS tags from placeholders.
 */
function restoreEjsTags(code, map) {
  let result = code;
  for (const { placeholder, original } of map) {
    // Handle both quoted and unquoted versions that Babel might produce
    const quotedSingle = placeholder.replace(/"/g, "'");
    result = result.split(placeholder).join(original);
    result = result.split(quotedSingle).join(original);
  }
  return result;
}

/**
 * Check if JS content has any ES6+ syntax that needs transpilation.
 */
function hasModernSyntax(code) {
  // Quick checks for common modern patterns
  if (/\bconst\b/.test(code)) return true;
  if (/\blet\b/.test(code)) return true;
  if (/=>/.test(code)) return true;
  if (/\?\.\s*[.([]/.test(code) || /\?\.[a-zA-Z_$]/.test(code)) return true;
  if (/\?\?/.test(code)) return true;
  if (/\bclass\s+\w/.test(code)) return true;
  if (/\bfor\s*\(\s*(?:const|let|var)\s+\w+\s+of\b/.test(code)) return true;
  if (/`[^`]*`/.test(code)) return true; // template literals
  return false;
}

function transpileJS(jsCode) {
  const { shielded, map } = shieldEjsTags(jsCode);

  if (!hasModernSyntax(shielded)) {
    return { code: jsCode, changed: false };
  }

  try {
    const result = babel.transformSync(shielded, {
      presets: [
        ['@babel/preset-env', {
          targets: { android: '5' },
          modules: false
        }]
      ],
      sourceType: 'script',   // Allow duplicate declarations (non-strict mode)
      compact: false,
      retainLines: true,
      sourceMaps: false
    });

    if (!result || !result.code) {
      return { code: jsCode, changed: false, error: 'Babel returned no code' };
    }

    const restored = restoreEjsTags(result.code, map);
    const changed = restored.trim() !== jsCode.trim();
    return { code: restored, changed };
  } catch (err) {
    return { code: jsCode, changed: false, error: err.message };
  }
}

// ─── Main ───

function main() {
  const files = walkEjs(VIEWS_DIR);
  let totalFiles = 0;
  let totalBlocks = 0;
  let totalTranspiled = 0;
  let totalErrors = 0;

  console.log(`${DRY_RUN ? '[DRY RUN]' : '[APPLYING]'} Scanning ${files.length} EJS files...\n`);

  for (const filePath of files) {
    const html = fs.readFileSync(filePath, 'utf8');
    const blocks = findInlineScripts(html);
    if (!blocks.length) continue;

    const rel = path.relative(path.join(__dirname, '..'), filePath);
    let fileModified = false;
    let newHtml = html;
    let offset = 0; // Track offset as we replace content

    for (const block of blocks) {
      totalBlocks++;
      const result = transpileJS(block.content);

      if (result.error) {
        console.log(`  ⚠ ${rel} (error): ${result.error.substring(0, 120)}`);
        totalErrors++;
        continue;
      }

      if (result.changed) {
        totalTranspiled++;
        fileModified = true;

        const before = newHtml.substring(0, block.start + offset);
        const after = newHtml.substring(block.end + offset);
        newHtml = before + result.code + after;
        offset += result.code.length - block.content.length;

        const lineNum = html.substring(0, block.start).split('\n').length;
        console.log(`  ✓ ${rel}:${lineNum} — transpiled`);
      }
    }

    if (fileModified) {
      totalFiles++;
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, newHtml, 'utf8');
      }
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`  Files modified: ${totalFiles}`);
  console.log(`  Script blocks scanned: ${totalBlocks}`);
  console.log(`  Blocks transpiled: ${totalTranspiled}`);
  console.log(`  Errors: ${totalErrors}`);
  if (DRY_RUN) {
    console.log(`\n  This was a dry run. Use --apply to write changes.`);
  }
}

main();
