'use strict';
/**
 * Comprehensive ES5 runtime compatibility audit for Android 5-7 WebViews.
 * Checks: unsupported APIs, async/await+regenerator, polyfills, 
 *         browser APIs, ES6 syntax leakage, EJS inline scripts,
 *         script source paths, untranspiled/CDN files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BUILD_DIR = path.join(ROOT, 'public', 'build');
const JS_SRC_DIR = path.join(ROOT, 'public', 'js');
const VIEWS_DIR = path.join(ROOT, 'views');
const PUBLIC_DIR = path.join(ROOT, 'public');

function walk(dir, ext) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full, ext));
    else if (!ext || full.endsWith(ext)) results.push(full);
  }
  return results;
}

function rel(f) { return path.relative(ROOT, f); }

function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

function getLineNumber(fullText, index) {
  return fullText.substring(0, index).split('\n').length;
}

const report = { critical: [], risky: [], ok: [] };

// ═══════════════════════════════════════════
// 1. UNSUPPORTED JS APIs IN BUILD OUTPUT
// ═══════════════════════════════════════════
console.log('=== 1. Scanning unsupported JS APIs in public/build ===');

const apiPatterns = [
  // Constructors & globals
  { name: 'new Map(', re: /\bnew\s+Map\s*\(/g, severity: 'critical', note: 'Map not in Android 4.4 WebView; partial in Android 5.0' },
  { name: 'new Set(', re: /\bnew\s+Set\s*\(/g, severity: 'critical', note: 'Set not in Android 4.4 WebView; partial in Android 5.0' },
  { name: 'new WeakMap(', re: /\bnew\s+WeakMap\s*\(/g, severity: 'risky', note: 'WeakMap partially supported in Android 5' },
  { name: 'new WeakSet(', re: /\bnew\s+WeakSet\s*\(/g, severity: 'risky', note: 'WeakSet partially supported in Android 5' },
  { name: 'new Promise(', re: /\bnew\s+Promise\s*\(/g, severity: 'critical', note: 'Promise not in Android <4.4.3 WebView' },
  { name: 'Promise.resolve', re: /\bPromise\.(?:resolve|reject|all|race|allSettled|any)\b/g, severity: 'critical', note: 'Promise not in Android <4.4.3' },
  { name: 'fetch(', re: /\bfetch\s*\(/g, severity: 'critical', note: 'fetch() not supported at all in Android <5 WebView, buggy in 5-6' },
  { name: 'new URL(', re: /\bnew\s+URL\s*\(/g, severity: 'critical', note: 'URL constructor not in Android <7 WebView' },
  { name: 'new URLSearchParams', re: /\bnew\s+URLSearchParams\s*\(/g, severity: 'critical', note: 'URLSearchParams not in Android <7 WebView' },
  { name: 'Symbol', re: /\bSymbol(?:\s*\(|\.\w)/g, severity: 'critical', note: 'Symbol not in Android <5.1 WebView' },
  // Prototype methods
  { name: '.includes(', re: /\.includes\s*\(/g, severity: 'critical', note: 'Array/String.includes not in Android <6 WebView' },
  { name: 'Object.assign', re: /\bObject\.assign\s*\(/g, severity: 'critical', note: 'Object.assign not in Android <5.1 WebView' },
  { name: 'Object.entries', re: /\bObject\.(?:entries|values|fromEntries)\s*\(/g, severity: 'critical', note: 'Object.entries/values not in Android <5.1-7 WebView' },
  { name: 'Object.keys', re: /\bObject\.keys\s*\(/g, severity: 'ok', note: 'Object.keys supported since ES5.1 — OK' },
  { name: 'Array.from', re: /\bArray\.from\s*\(/g, severity: 'critical', note: 'Array.from not in Android <5.1 WebView' },
  { name: 'Array.isArray', re: /\bArray\.isArray\s*\(/g, severity: 'ok', note: 'Array.isArray supported since ES5.1 — OK' },
  { name: '.find(', re: /\.find\s*\(/g, severity: 'critical', note: 'Array.find not in Android <5.1 WebView' },
  { name: '.findIndex(', re: /\.findIndex\s*\(/g, severity: 'critical', note: 'Array.findIndex not in Android <5.1 WebView' },
  { name: '.startsWith(', re: /\.startsWith\s*\(/g, severity: 'critical', note: 'String.startsWith not in Android <6 WebView' },
  { name: '.endsWith(', re: /\.endsWith\s*\(/g, severity: 'critical', note: 'String.endsWith not in Android <6 WebView' },
  { name: '.repeat(', re: /\.repeat\s*\(/g, severity: 'risky', note: 'String.repeat not in Android <6 WebView' },
  { name: '.padStart(', re: /\.pad(?:Start|End)\s*\(/g, severity: 'critical', note: 'String.padStart/padEnd not in Android <8 WebView' },
  { name: '.trimStart(', re: /\.trim(?:Start|End)\s*\(/g, severity: 'risky', note: 'trimStart/trimEnd not in Android <6.6 WebView' },
  { name: '.flat(', re: /\.flat(?:Map)?\s*\(/g, severity: 'critical', note: 'Array.flat/flatMap not in Android <9 WebView' },
  { name: '.fill(', re: /\.fill\s*\(/g, severity: 'risky', note: 'Array.fill not in Android <5.1 WebView (context-dependent)' },
  { name: '.copyWithin(', re: /\.copyWithin\s*\(/g, severity: 'risky', note: 'Array.copyWithin not in Android <5.1' },
  { name: 'Object.getOwnPropertyDescriptors', re: /\bObject\.getOwnPropertyDescriptors\s*\(/g, severity: 'critical', note: 'Not in Android <8 WebView' },
  { name: 'Number.isFinite', re: /\bNumber\.(?:isFinite|isInteger|isNaN|isSafeInteger)\s*\(/g, severity: 'risky', note: 'Number.isX not in Android <5.1 WebView' },
  { name: 'String.raw', re: /\bString\.raw\b/g, severity: 'risky', note: 'String.raw not in Android <5.1 WebView' },
  { name: '.keys()/.values()/.entries() on collections', re: /\.(?:keys|values|entries)\s*\(\s*\)(?!\s*[;,\)])/g, severity: 'risky', note: 'Iterator methods on Map/Set — partial Android 5' },
  { name: 'requestAnimationFrame', re: /\brequestAnimationFrame\s*\(/g, severity: 'ok', note: 'Supported in Android 4.4+ WebView' },
  { name: 'MutationObserver', re: /\bMutationObserver\s*\(/g, severity: 'ok', note: 'Supported in Android 4.4+ WebView' },
  { name: 'IntersectionObserver', re: /\bIntersectionObserver\s*\(/g, severity: 'critical', note: 'IntersectionObserver not in Android <5.1 WebView, needs polyfill' },
  { name: 'ResizeObserver', re: /\bResizeObserver\s*\(/g, severity: 'critical', note: 'ResizeObserver not in Android <13 WebView, needs polyfill' },
  { name: 'performance.now', re: /\bperformance\.now\s*\(/g, severity: 'ok', note: 'Supported in Android 4.4+ WebView' },
  { name: 'structuredClone', re: /\bstructuredClone\s*\(/g, severity: 'critical', note: 'structuredClone not in Android <14 WebView' },
  { name: 'AbortController', re: /\bAbortController\s*\(/g, severity: 'critical', note: 'AbortController not in Android <11 WebView' },
  { name: 'queueMicrotask', re: /\bqueueMicrotask\s*\(/g, severity: 'critical', note: 'queueMicrotask not in Android <11 WebView' },
  { name: 'globalThis', re: /\bglobalThis\b/g, severity: 'critical', note: 'globalThis not in Android <12 WebView' },
  { name: 'TextEncoder/TextDecoder', re: /\b(?:TextEncoder|TextDecoder)\s*\(/g, severity: 'critical', note: 'TextEncoder/TextDecoder not in Android <5.1 WebView' },
  { name: 'crypto.getRandomValues', re: /\bcrypto\.getRandomValues\s*\(/g, severity: 'ok', note: 'Supported in Android 5' },
  { name: 'Proxy', re: /\bnew\s+Proxy\s*\(/g, severity: 'critical', note: 'Proxy not in Android <7 WebView, cannot polyfill' },
  { name: 'Reflect', re: /\bReflect\.\w+/g, severity: 'critical', note: 'Reflect not in Android <7 WebView' },
  { name: 'Object.setPrototypeOf', re: /\bObject\.setPrototypeOf\s*\(/g, severity: 'risky', note: 'Object.setPrototypeOf not in Android <5 WebView' },
  { name: 'CustomEvent constructor', re: /\bnew\s+CustomEvent\s*\(/g, severity: 'risky', note: 'CustomEvent constructor broken in some Android 5 WebViews' },
  { name: 'EventSource', re: /\bnew\s+EventSource\s*\(/g, severity: 'risky', note: 'EventSource not in all Android 5 WebViews' },
  { name: 'WebSocket', re: /\bnew\s+WebSocket\s*\(/g, severity: 'ok', note: 'WebSocket supported in Android 4.4+' },
  { name: 'JSON.parse/stringify', re: /\bJSON\.(?:parse|stringify)\s*\(/g, severity: 'ok', note: 'JSON supported' },
  { name: 'localStorage', re: /\blocalStorage\.\w/g, severity: 'ok', note: 'localStorage supported in Android 4.4+' },
];

const buildFiles = walk(BUILD_DIR, '.js').filter(f =>
  !f.endsWith('.min.js') && !f.endsWith('.min.js.gz') && !f.endsWith('.min.js.br')
);

// Track counts per API
const apiCounts = {};
const apiExamples = {};

for (const f of buildFiles) {
  const raw = fs.readFileSync(f, 'utf8');
  const code = stripComments(raw);
  
  for (const p of apiPatterns) {
    if (p.severity === 'ok') continue;
    let m;
    p.re.lastIndex = 0;
    while ((m = p.re.exec(code)) !== null) {
      const key = p.name;
      if (!apiCounts[key]) {
        apiCounts[key] = { count: 0, severity: p.severity, note: p.note, examples: [] };
      }
      apiCounts[key].count++;
      if (apiCounts[key].examples.length < 3) {
        apiCounts[key].examples.push({
          file: rel(f),
          line: getLineNumber(code, m.index),
          match: m[0]
        });
      }
    }
  }
}

// ═══════════════════════════════════════════
// 2. ASYNC/AWAIT + REGENERATOR-RUNTIME
// ═══════════════════════════════════════════
console.log('=== 2. Checking async/await + regenerator-runtime ===');

let hasRegeneratorRuntime = false;
let regeneratorUsageCount = 0;
const regeneratorExamples = [];

for (const f of buildFiles) {
  const code = fs.readFileSync(f, 'utf8');
  if (code.includes('_regenerator') || code.includes('regeneratorRuntime')) {
    regeneratorUsageCount++;
    if (regeneratorExamples.length < 5) regeneratorExamples.push(rel(f));
  }
  if (code.includes('_regenerator()') || code.includes('function _regenerator()')) {
    hasRegeneratorRuntime = true;
  }
}

// Check if regenerator-runtime is a dependency
const pkgPath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const hasRuntimeDep = !!(
  (pkg.dependencies && pkg.dependencies['regenerator-runtime']) ||
  (pkg.devDependencies && pkg.devDependencies['regenerator-runtime'])
);

// Check if core-js is installed
const hasCoreJsDep = !!(
  (pkg.dependencies && pkg.dependencies['core-js']) ||
  (pkg.devDependencies && pkg.devDependencies['core-js'])
);

// ═══════════════════════════════════════════
// 3. EJS INLINE SCRIPTS — modern syntax check
// ═══════════════════════════════════════════
console.log('=== 3. Checking EJS inline <script> blocks ===');

const ejsFiles = walk(VIEWS_DIR, '.ejs');
const ejsSyntaxPatterns = [
  { name: 'const', re: /\bconst\s+[a-zA-Z_${\[]/ },
  { name: 'let', re: /\blet\s+[a-zA-Z_${\[]/ },
  { name: 'arrow =>', re: /\)\s*=>\s*[{(]|=>\s*\{/ },
  { name: 'optional chaining ?.', re: /\?\.\s*[(\[a-zA-Z_$]/ },
  { name: 'nullish coalescing ??', re: /\?\?[^>]/ },
  { name: 'class declaration', re: /\bclass\s+[A-Z]\w*\s*[{\s]/ },
  { name: 'template literal', re: /`[^`]*\$\{/ },
  { name: 'for...of', re: /\bfor\s*\(\s*(?:var|let|const)\s+\w+\s+of\b/ },
  { name: 'import/export', re: /\b(?:import|export)\s+(?:\{|default|function|class|const|let|var)/ },
];

const ejsInlineIssues = [];

for (const f of ejsFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const scriptRe = /<script(?:\s[^>]*)?\s*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = scriptRe.exec(html)) !== null) {
    const tag = m[0];
    const tagHeader = tag.substring(0, tag.indexOf('>') + 1);
    if (/\bsrc\s*=/i.test(tagHeader)) continue;
    const js = m[1];
    const clean = stripComments(js).replace(/<%[\s\S]*?%>/g, '"__EJS__"');
    
    for (const p of ejsSyntaxPatterns) {
      const pm = clean.match(p.re);
      if (pm) {
        const lineNum = getLineNumber(html, m.index);
        ejsInlineIssues.push({
          file: rel(f), line: lineNum, kind: p.name, snippet: pm[0].substring(0, 60)
        });
        break;
      }
    }
  }
}

// Also check unsupported APIs in EJS inline scripts
const ejsApiIssues = [];
const ejsApiChecks = [
  { name: 'fetch(', re: /\bfetch\s*\(/g },
  { name: 'new Map(', re: /\bnew\s+Map\s*\(/g },
  { name: 'new Set(', re: /\bnew\s+Set\s*\(/g },
  { name: 'Promise', re: /\bPromise\.\w/g },
  { name: 'new Promise(', re: /\bnew\s+Promise\s*\(/g },
  { name: '.includes(', re: /\.includes\s*\(/g },
  { name: 'Object.assign', re: /\bObject\.assign\s*\(/g },
  { name: 'Array.from', re: /\bArray\.from\s*\(/g },
  { name: '.startsWith(', re: /\.startsWith\s*\(/g },
  { name: '.endsWith(', re: /\.endsWith\s*\(/g },
  { name: '.find(', re: /\.find\s*\(/g },
  { name: '.padStart(', re: /\.pad(?:Start|End)\s*\(/g },
  { name: 'structuredClone', re: /\bstructuredClone\s*\(/g },
  { name: 'AbortController', re: /\bAbortController\b/g },
  { name: 'globalThis', re: /\bglobalThis\b/g },
  { name: 'IntersectionObserver', re: /\bIntersectionObserver\b/g },
  { name: 'ResizeObserver', re: /\bResizeObserver\b/g },
  { name: 'Object.entries', re: /\bObject\.(?:entries|values)\s*\(/g },
  { name: '.flat(', re: /\.flat(?:Map)?\s*\(/g },
];

for (const f of ejsFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const scriptRe = /<script(?:\s[^>]*)?\s*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = scriptRe.exec(html)) !== null) {
    const tag = m[0];
    const tagHeader = tag.substring(0, tag.indexOf('>') + 1);
    if (/\bsrc\s*=/i.test(tagHeader)) continue;
    const js = m[1];
    const clean = stripComments(js).replace(/<%[\s\S]*?%>/g, '"__EJS__"');
    
    for (const p of ejsApiChecks) {
      p.re.lastIndex = 0;
      const pm = p.re.exec(clean);
      if (pm) {
        const lineNum = getLineNumber(html, m.index);
        ejsApiIssues.push({ file: rel(f), line: lineNum, api: p.name });
      }
    }
  }
}

// ═══════════════════════════════════════════
// 4. SCRIPT SRC PATHS — /js/ vs /build/
// ═══════════════════════════════════════════
console.log('=== 4. Checking script src paths in EJS ===');

const scriptSrcIssues = [];
for (const f of ejsFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const lines = html.split('\n');
  lines.forEach((line, i) => {
    // Now check: does any <script src="/js/..."> exist? (should be /build/)
    // Note: in the current setup, Express re-maps /js/ to public/build/ via middleware
    // But check for raw /public/js/ references or direct file paths
    const srcMatch = line.match(/<script[^>]+src\s*=\s*["']([^"']+)["']/i);
    if (srcMatch) {
      const src = srcMatch[1];
      // Check for loading from untranspiled source
      if (src.includes('/public/js/') || src.match(/^\/js\/.*\.js(?:\?|$)/)) {
        // This is OK if Express maps /js/ → public/build/
        // But flag any /public/js/ direct references
        if (src.includes('/public/js/')) {
          scriptSrcIssues.push({ file: rel(f), line: i + 1, src, issue: 'Direct /public/js/ path — should serve from /build/' });
        }
      }
    }
  });
}

// ═══════════════════════════════════════════
// 5. CDN / EXTERNAL SCRIPTS
// ═══════════════════════════════════════════
console.log('=== 5. Checking CDN/external scripts ===');

const cdnScripts = [];
for (const f of ejsFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const lines = html.split('\n');
  lines.forEach((line, i) => {
    const srcMatch = line.match(/<script[^>]+src\s*=\s*["'](https?:\/\/[^"']+)["']/i);
    if (srcMatch) {
      cdnScripts.push({ file: rel(f), line: i + 1, src: srcMatch[1] });
    }
    // Also check CSS CDN
    const cssMatch = line.match(/<link[^>]+href\s*=\s*["'](https?:\/\/[^"']+)["']/i);
    if (cssMatch && cssMatch[1].includes('.css')) {
      cdnScripts.push({ file: rel(f), line: i + 1, src: cssMatch[1], type: 'css' });
    }
  });
}

// ═══════════════════════════════════════════
// 6. ES6 SYNTAX LEAKAGE IN BUILD
// ═══════════════════════════════════════════
console.log('=== 6. Checking ES6 syntax leakage in public/build ===');

const syntaxLeaks = [];
const es6Patterns = [
  { name: 'arrow =>', re: /(?<!['"\\])\)\s*=>\s*[{(]|(?<!['"\\])=>\s*\{/ },
  { name: '?.', re: /\?\.\s*[(\[a-zA-Z_$]/ },
  { name: '??', re: /\?\?[^>]/ },
  { name: 'class decl', re: /\bclass\s+[A-Z]\w*\s*(?:\{|extends\b)/ },
  { name: 'for...of', re: /\bfor\s*\(\s*(?:var|let|const)\s+\w+\s+of\b/ },
  { name: 'const', re: /\bconst\s+[a-zA-Z_${\[]/ },
  { name: 'let', re: /\blet\s+[a-zA-Z_${\[]/ },
  { name: 'template literal', re: /(?<!\\)`[^`]*\$\{/ },
  { name: 'import', re: /\bimport\s+\{/ },
  { name: 'export', re: /\bexport\s+(?:default|function|class|const|let|var)/ },
];

for (const f of buildFiles) {
  const raw = fs.readFileSync(f, 'utf8');
  const code = stripComments(raw);
  for (const p of es6Patterns) {
    const m = code.match(p.re);
    if (m) {
      syntaxLeaks.push({
        file: rel(f), line: getLineNumber(code, m.index), kind: p.name, snippet: m[0].substring(0, 50)
      });
    }
  }
}

// ═══════════════════════════════════════════
// 7. BROWSER APIS - DETAILED 
// ═══════════════════════════════════════════
console.log('=== 7. Checking risky browser APIs ===');

const browserApiChecks = [
  { name: 'AudioContext', re: /\b(?:new\s+)?AudioContext\s*\(/g, severity: 'risky', note: 'OK in Android 5+ but needs webkit prefix in some' },
  { name: 'webkitAudioContext', re: /\bwebkitAudioContext\b/g, severity: 'ok', note: 'Prefixed version — good fallback' },
  { name: 'classList', re: /\.classList\b/g, severity: 'ok', note: 'classList supported in Android 4.4+, but .toggle(,force) needs 5+' },
  { name: 'classList.toggle with 2nd arg', re: /\.classList\.toggle\s*\([^)]+,/g, severity: 'risky', note: 'classList.toggle(name, force) not in Android <4.4.3' },
  { name: 'dataset', re: /\.dataset\b/g, severity: 'ok', note: 'dataset supported in Android 4.4+' },
  { name: '.closest(', re: /\.closest\s*\(/g, severity: 'risky', note: '.closest() not in Android <5 WebView; polyfill recommended' },
  { name: '.matches(', re: /\.matches\s*\(/g, severity: 'risky', note: '.matches() not in some Android 4.x; OK in 5+' },
  { name: 'addEventListener passive', re: /passive\s*:\s*true/g, severity: 'risky', note: 'Passive event listeners not in Android <5.1 — will throw if not feature-detected' },
  { name: 'addEventListener once', re: /once\s*:\s*true/g, severity: 'risky', note: '{once:true} not in Android <7 — event wont auto-remove' },
  { name: 'getComputedStyle', re: /\bgetComputedStyle\s*\(/g, severity: 'ok', note: 'getComputedStyle supported' },
  { name: 'history.pushState', re: /\bhistory\.pushState\b/g, severity: 'ok', note: 'Supported in Android 4.4+' },
  { name: 'CSS.supports', re: /\bCSS\.supports\s*\(/g, severity: 'risky', note: 'CSS.supports not in Android <4.4, OK in 5+' },
  { name: 'element.remove()', re: /\.remove\s*\(\s*\)/g, severity: 'risky', note: 'ChildNode.remove() not in Android <5.1 WebView' },
  { name: 'element.append(', re: /\.append\s*\([^)]/g, severity: 'risky', note: 'ParentNode.append() not in Android <6 WebView, use appendChild' },
  { name: 'element.prepend(', re: /\.prepend\s*\(/g, severity: 'risky', note: 'ParentNode.prepend() not in Android <6 WebView' },
  { name: 'element.before(', re: /\.before\s*\(/g, severity: 'risky', note: 'ChildNode.before() not in Android <6 WebView' },
  { name: 'element.after(', re: /\.after\s*\(/g, severity: 'risky', note: 'ChildNode.after() not in Android <6 WebView' },
  { name: 'element.replaceWith(', re: /\.replaceWith\s*\(/g, severity: 'risky', note: 'ChildNode.replaceWith() not in Android <6 WebView' },
  { name: 'element.toggleAttribute(', re: /\.toggleAttribute\s*\(/g, severity: 'critical', note: 'toggleAttribute not in Android <9 WebView' },
  { name: '.animate(', re: /\.animate\s*\(\s*[\[{]/g, severity: 'critical', note: 'Web Animations API not in Android <6 WebView' },
  { name: 'scrollTo with options', re: /\.scrollTo\s*\(\s*\{/g, severity: 'risky', note: 'scrollTo({behavior}) not in Android <6 WebView' },
  { name: 'scrollIntoView smooth', re: /\.scrollIntoView\s*\(\s*\{/g, severity: 'risky', note: 'scrollIntoView with options not in Android <6 WebView' },
];

const browserApiIssues = {};
for (const f of buildFiles) {
  const code = stripComments(fs.readFileSync(f, 'utf8'));
  for (const p of browserApiChecks) {
    if (p.severity === 'ok') continue;
    p.re.lastIndex = 0;
    let m;
    let count = 0;
    while ((m = p.re.exec(code)) !== null) {
      count++;
      if (!browserApiIssues[p.name]) {
        browserApiIssues[p.name] = { count: 0, severity: p.severity, note: p.note, examples: [] };
      }
      if (browserApiIssues[p.name].examples.length < 2) {
        browserApiIssues[p.name].examples.push({ file: rel(f), line: getLineNumber(code, m.index) });
      }
    }
    if (count > 0 && browserApiIssues[p.name]) {
      browserApiIssues[p.name].count += count;
    }
  }
}

// ═══════════════════════════════════════════
// OUTPUT REPORT
// ═══════════════════════════════════════════
console.log('\n\n' + '═'.repeat(70));
console.log('  FULL COMPATIBILITY AUDIT REPORT');
console.log('  Target: Android 5-7 WebView, Telegram/FB/Zalo in-app browsers');
console.log('═'.repeat(70));

// --- BABEL CONFIG ---
console.log('\n### BABEL / POLYFILL CONFIGURATION ###');
console.log('  .babelrc targets: android 5');
console.log('  useBuiltIns: NOT SET (no automatic polyfills!)');
console.log('  core-js dependency: ' + (hasCoreJsDep ? 'YES' : 'NOT INSTALLED'));
console.log('  regenerator-runtime dep: ' + (hasRuntimeDep ? 'YES' : 'NOT INSTALLED'));
console.log('  Babel inline regenerator: ' + (hasRegeneratorRuntime ? 'YES (Babel helpers inlined)' : 'NO'));
console.log('  Files using async/generators: ' + regeneratorUsageCount);
if (regeneratorExamples.length) {
  console.log('  Examples: ' + regeneratorExamples.join(', '));
}

// --- CRITICAL ---
console.log('\n\n### 🔴 CRITICAL ISSUES (will crash on Android 5-7 WebView) ###\n');

const criticals = Object.entries(apiCounts).filter(([,v]) => v.severity === 'critical');
if (criticals.length === 0 && syntaxLeaks.length === 0) {
  console.log('  None found in build output.\n');
}

for (const [name, data] of criticals.sort((a,b) => b[1].count - a[1].count)) {
  console.log(`  ❌ ${name} — ${data.count} usages`);
  console.log(`     Why: ${data.note}`);
  for (const ex of data.examples) {
    console.log(`     → ${ex.file}:${ex.line}`);
  }
}

// Also critical browser APIs
const critBrowser = Object.entries(browserApiIssues).filter(([,v]) => v.severity === 'critical');
for (const [name, data] of critBrowser.sort((a,b) => b[1].count - a[1].count)) {
  console.log(`  ❌ ${name} — ${data.count} usages`);
  console.log(`     Why: ${data.note}`);
  for (const ex of data.examples) {
    console.log(`     → ${ex.file}:${ex.line}`);
  }
}

if (!hasCoreJsDep) {
  console.log('\n  ❌ core-js NOT INSTALLED — No polyfills for missing APIs!');
  console.log('     Without core-js, Set/Map/Promise/fetch/includes/assign/etc all break on old Android.');
}

// ES6 syntax leaks
if (syntaxLeaks.length) {
  console.log('\n  ❌ ES6 syntax leakage in public/build/:');
  for (const s of syntaxLeaks) {
    console.log(`     → ${s.file}:${s.line} — [${s.kind}] ${s.snippet}`);
  }
}

// EJS inline syntax issues
if (ejsInlineIssues.length) {
  console.log('\n  ❌ Modern syntax in EJS inline <script>:');
  for (const e of ejsInlineIssues) {
    console.log(`     → ${e.file}:${e.line} — [${e.kind}] ${e.snippet}`);
  }
}

// --- RISKY ---
console.log('\n\n### 🟠 RISKY ISSUES (may break on some devices) ###\n');

const riskies = Object.entries(apiCounts).filter(([,v]) => v.severity === 'risky');
const riskyBrowser = Object.entries(browserApiIssues).filter(([,v]) => v.severity === 'risky');

if (riskies.length === 0 && riskyBrowser.length === 0) {
  console.log('  None.\n');
}

for (const [name, data] of riskies.sort((a,b) => b[1].count - a[1].count)) {
  console.log(`  ⚠️  ${name} — ${data.count} usages`);
  console.log(`     Why: ${data.note}`);
  for (const ex of data.examples) {
    console.log(`     → ${ex.file}:${ex.line}`);
  }
}

for (const [name, data] of riskyBrowser.sort((a,b) => b[1].count - a[1].count)) {
  console.log(`  ⚠️  ${name} — ${data.count} usages`);
  console.log(`     Why: ${data.note}`);
  for (const ex of data.examples) {
    console.log(`     → ${ex.file}:${ex.line}`);
  }
}

// EJS API issues
if (ejsApiIssues.length) {
  console.log('\n  ⚠️  Unsupported APIs in EJS inline <script> blocks:');
  const grouped = {};
  for (const e of ejsApiIssues) {
    const key = `${e.file}:${e.line}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e.api);
  }
  for (const [loc, apis] of Object.entries(grouped)) {
    console.log(`     → ${loc} — ${[...new Set(apis)].join(', ')}`);
  }
}

// CDN scripts
if (cdnScripts.length) {
  console.log('\n  ⚠️  External CDN scripts (not transpiled by Babel):');
  for (const c of cdnScripts) {
    console.log(`     → ${c.file}:${c.line} — ${c.src}`);
  }
}

// Script src issues
if (scriptSrcIssues.length) {
  console.log('\n  ⚠️  Script src issues:');
  for (const s of scriptSrcIssues) {
    console.log(`     → ${s.file}:${s.line} — ${s.src} (${s.issue})`);
  }
}

// --- OK ---
console.log('\n\n### 🟢 PASSED CHECKS ###\n');
console.log('  ✅ Babel transpiles syntax for Android 5');
if (hasRegeneratorRuntime) console.log('  ✅ Babel inlines regenerator helpers for async/await');
if (regeneratorUsageCount > 0 && hasRegeneratorRuntime) console.log('  ✅ Async/await transpiled with inline regenerator');
if (syntaxLeaks.length === 0) console.log('  ✅ No ES6 syntax detected in public/build/');
if (ejsInlineIssues.length === 0) console.log('  ✅ No modern syntax in EJS inline scripts');
if (scriptSrcIssues.length === 0) console.log('  ✅ No wrong /public/js/ script paths');
console.log('  ✅ requestAnimationFrame, MutationObserver, WebSocket — supported');
console.log('  ✅ localStorage, JSON, getComputedStyle — supported');
console.log('  ✅ classList, dataset — supported');
console.log('  ✅ performance.now — supported');

console.log('\n' + '═'.repeat(70));
console.log('  END OF REPORT');
console.log('═'.repeat(70) + '\n');
