const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'js');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') || f.endsWith('.jsx')).sort();

// Vietnamese diacritical character regex
const viRegex = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴĐ]/;

function extractVietnameseStrings(code) {
  const results = new Set();
  
  // Use a character-by-character parser to correctly find string literals
  let i = 0;
  const len = code.length;
  
  while (i < len) {
    const ch = code[i];
    
    // Skip single-line comments
    if (ch === '/' && code[i+1] === '/') {
      while (i < len && code[i] !== '\n') i++;
      continue;
    }
    
    // Skip multi-line comments
    if (ch === '/' && code[i+1] === '*') {
      i += 2;
      while (i < len - 1 && !(code[i] === '*' && code[i+1] === '/')) i++;
      i += 2;
      continue;
    }
    
    // Skip regex literals (basic heuristic)
    if (ch === '/' && i > 0) {
      const prevNonSpace = code.substring(Math.max(0, i-10), i).trimEnd();
      const lastChar = prevNonSpace[prevNonSpace.length - 1];
      if (lastChar && '=(!&|,;:?[{+-*/%~^'.includes(lastChar)) {
        // Likely a regex
        i++;
        while (i < len && code[i] !== '/') {
          if (code[i] === '\\') i++; // skip escaped char
          i++;
        }
        i++; // skip closing /
        while (i < len && /[gimsuy]/.test(code[i])) i++; // skip flags
        continue;
      }
    }
    
    // Single-quoted string
    if (ch === "'") {
      i++;
      let str = '';
      while (i < len && code[i] !== "'") {
        if (code[i] === '\\') {
          str += code[i] + (code[i+1] || '');
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      i++; // skip closing quote
      if (viRegex.test(str)) {
        results.add(str);
      }
      continue;
    }
    
    // Double-quoted string
    if (ch === '"') {
      i++;
      let str = '';
      while (i < len && code[i] !== '"') {
        if (code[i] === '\\') {
          str += code[i] + (code[i+1] || '');
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      i++; // skip closing quote
      if (viRegex.test(str)) {
        results.add(str);
      }
      continue;
    }
    
    // Template literal (backtick)
    if (ch === '`') {
      i++;
      let str = '';
      let depth = 0;
      while (i < len) {
        if (code[i] === '\\') {
          str += code[i] + (code[i+1] || '');
          i += 2;
          continue;
        }
        if (code[i] === '$' && code[i+1] === '{' && depth === 0) {
          str += '${...}';
          i += 2;
          let braceDepth = 1;
          while (i < len && braceDepth > 0) {
            if (code[i] === '{') braceDepth++;
            else if (code[i] === '}') braceDepth--;
            if (braceDepth > 0) i++;
          }
          i++; // skip closing }
          continue;
        }
        if (code[i] === '`' && depth === 0) {
          break;
        }
        str += code[i];
        i++;
      }
      i++; // skip closing backtick
      if (viRegex.test(str)) {
        // Clean up: trim excessive whitespace from template literals
        const cleaned = str.replace(/\n\s+/g, ' ').trim();
        if (cleaned.length > 0) {
          results.add(cleaned);
        }
      }
      continue;
    }
    
    i++;
  }
  
  return [...results];
}

// For large template literals containing HTML, extract only the Vietnamese text segments
function extractViTextFromHtml(str) {
  const texts = [];
  // Remove HTML tags and extract text content
  const stripped = str.replace(/<[^>]*>/g, '|SPLIT|');
  const parts = stripped.split('|SPLIT|');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed && viRegex.test(trimmed) && trimmed.length > 0) {
      // Skip pure CSS/style values, classes, and attribute-like content
      if (/^[a-zA-Z0-9_-]+:/.test(trimmed) && !viRegex.test(trimmed.split(':')[0])) continue;
      if (/^[.#]?[a-zA-Z0-9_-]+\s*\{/.test(trimmed)) continue;
      texts.push(trimmed);
    }
  }
  return texts;
}

let output = '';
let totalStrings = 0;
let fileCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  const code = fs.readFileSync(filePath, 'utf8');
  const rawStrings = extractVietnameseStrings(code);
  
  const cleanedStrings = [];
  for (const s of rawStrings) {
    // If it contains HTML tags, extract Vietnamese text portions only
    if (/<[a-zA-Z][^>]*>/.test(s) && s.length > 200) {
      const viTexts = extractViTextFromHtml(s);
      for (const t of viTexts) {
        cleanedStrings.push(t);
      }
    } else {
      cleanedStrings.push(s);
    }
  }
  
  // Deduplicate within file
  const unique = [...new Set(cleanedStrings)];
  
  if (unique.length > 0) {
    fileCount++;
    output += `\n=== public/js/${file} ===\n`;
    unique.forEach(s => {
      output += `"${s}"\n`;
      totalStrings++;
    });
  }
}

output += `\n=== TOTAL: ${totalStrings} Vietnamese strings across ${fileCount} files (${files.length} files scanned) ===\n`;

const outPath = path.join(__dirname, 'vi-strings-output.txt');
fs.writeFileSync(outPath, output, 'utf8');
console.log(`Done! Output written to: ${outPath}`);
console.log(`Total Vietnamese strings found: ${totalStrings}`);
console.log(`Files with Vietnamese strings: ${fileCount}/${files.length}`);
