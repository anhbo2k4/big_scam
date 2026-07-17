const fs = require('fs');
const content = fs.readFileSync('views/admin/adminDashboard.ejs', 'utf8');
const lines = content.split('\n');

console.log('--- Searching for filesTableBody in EJS HTML ---');
lines.forEach((line, idx) => {
  if (line.includes('filesTableBody') && !line.includes('return') && !line.includes('document.getElementById')) {
    console.log(`${idx + 1}: ${line.trim()}`);
    const start = Math.max(0, idx - 4);
    const end = Math.min(lines.length - 1, idx + 8);
    console.log('------------------------------');
    for (let i = start; i <= end; i++) {
      console.log(`[${i+1}] ${lines[i]}`);
    }
    console.log('==============================');
  }
});
