const fs = require('fs');
const path = require('path');
const viRegex = /[\u00C0-\u024F\u1E00-\u1EFF\u0110\u0111]/;

function getAllFiles(dir, exts) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fp = path.join(dir, file);
      const stat = fs.statSync(fp);
      if (stat.isDirectory()) {
        results = results.concat(getAllFiles(fp, exts));
      } else if (exts.some(e => fp.endsWith(e))) {
        results.push(fp);
      }
    });
  } catch(e) {}
  return results;
}

const dirs = ['controllers','services','utils','middleware','routes','models','public/js','public/css'];
const base = path.resolve(__dirname, '..');
let allFiles = [];
dirs.forEach(d => {
  allFiles = allFiles.concat(getAllFiles(path.join(base, d), ['.js','.css','.jsx']));
});
allFiles.push(path.join(base, 'app.js'));

const result = {};
allFiles.forEach(fp => {
  const content = fs.readFileSync(fp, 'utf8');
  const lines = content.split('\n');
  const viStrings = new Set();
  
  lines.forEach(line => {
    // Skip comments that are just code comments, not user-facing
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      // Still check if the comment contains a string that gets used
      // but most comments are not user-facing, skip
      return;
    }
    
    // Match single-quoted strings
    const sq = /\'([^']*?)\'/g;
    let m;
    while ((m = sq.exec(line)) !== null) {
      if (viRegex.test(m[1]) && m[1].trim().length > 0) {
        viStrings.add(m[1]);
      }
    }
    
    // Match double-quoted strings
    const dq = /"([^"]*?)"/g;
    while ((m = dq.exec(line)) !== null) {
      if (viRegex.test(m[1]) && m[1].trim().length > 0) {
        viStrings.add(m[1]);
      }
    }
    
    // Match backtick template literals (single line)
    const bt = /`([^`]*?)`/g;
    while ((m = bt.exec(line)) !== null) {
      if (viRegex.test(m[1]) && m[1].trim().length > 0) {
        viStrings.add(m[1]);
      }
    }
  });
  
  // Also do multiline backtick matching
  const multilineBt = /`([\s\S]*?)`/g;
  let mm;
  while ((mm = multilineBt.exec(content)) !== null) {
    if (viRegex.test(mm[1]) && mm[1].trim().length > 0) {
      viStrings.add(mm[1].trim());
    }
  }
  
  if (viStrings.size > 0) {
    const rel = path.relative(base, fp).replace(/\\/g, '/');
    result[rel] = [...viStrings];
  }
});

// Output
console.log(JSON.stringify(result, null, 2));
