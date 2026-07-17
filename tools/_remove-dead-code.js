/**
 * One-time script: remove confirmed dead/unused functions
 * Run once, then delete this file.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'js', 'lucky-mystery-box-v2.js');
let src = fs.readFileSync(filePath, 'utf8');

// Helper: remove a top-level function by name (matches `function name(...) { ... }`)
function removeFn(name, label) {
  // Match the function declaration at the start of a line
  const regex = new RegExp(
    `(\\n?)^function ${name}\\b[^{]*\\{`,
    'm'
  );
  const match = regex.exec(src);
  if (!match) {
    console.log(`  SKIP: ${name} — not found`);
    return;
  }

  // Find matching closing brace
  const startIdx = match.index;
  const braceStart = startIdx + match[0].length - 1; // index of '{'
  let depth = 1;
  let i = braceStart + 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
  }
  // i is now right after the closing '}'
  // Also consume trailing newlines
  while (i < src.length && (src[i] === '\n' || src[i] === '\r')) i++;

  const removed = src.substring(startIdx, i);
  const lineCount = removed.split('\n').length;
  src = src.substring(0, startIdx) + '\n' + src.substring(i);
  console.log(`  ✓ ${name} — removed ${lineCount} lines (${label})`);
}

// Helper: remove a single line containing exact text
function removeLine(text, label) {
  const idx = src.indexOf(text);
  if (idx === -1) {
    console.log(`  SKIP line: "${text.trim()}" — not found`);
    return;
  }
  // Find start of line
  let start = idx;
  while (start > 0 && src[start - 1] !== '\n') start--;
  // Find end of line (include newline)
  let end = src.indexOf('\n', idx);
  if (end === -1) end = src.length;
  else end++; // include the newline
  src = src.substring(0, start) + src.substring(end);
  console.log(`  ✓ removed line: "${text.trim()}" (${label})`);
}

const before = src.split('\n').length;
console.log('Before:', before, 'lines');

console.log('\n── Removing dead functions ──');
removeFn('getCurrencyLabel', 'superseded by formatCurrencyBySymbol');
removeFn('setupQRAutoUpdate', 'never called');
removeFn('extractHomepageTemplatePayload', 'never called');
removeFn('lockRemainingBoxes', 'never called');
removeFn('startChatPolling', 'empty body — chat is SSE only');
removeFn('stopChatPolling', 'empty body — chat is SSE only');
removeFn('buildChatMessageRowHtml', 'replaced by createChatMessageRowElement');
removeFn('appendChatMessageToDom', 'replaced by scheduleChatRender/renderChatMessages');
removeFn('ensureAutoChatWarmupSession', 'disabled by design');

console.log('\n── Removing stopChatPolling() call sites ──');
removeLine('  stopChatPolling();', 'backToHome cleanup');
removeLine('  stopChatPolling();', 'beforeunload cleanup');

const after = src.split('\n').length;
console.log('\nAfter:', after, 'lines (removed', before - after, 'lines)');

fs.writeFileSync(filePath, src, 'utf8');
console.log('✓ File written successfully');
