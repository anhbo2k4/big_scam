const fs = require('fs');
const content = fs.readFileSync('views/admin/adminDashboard.ejs', 'utf8');
const lines = content.split('\n');

console.log('Searching for filesTableBody in adminDashboard.ejs...');
lines.forEach((line, idx) => {
  if (line.includes('filesTableBody')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print 15 lines before and 15 lines after
    const start = Math.max(0, idx - 15);
    const end = Math.min(lines.length - 1, idx + 15);
    console.log('------------------------------');
    for (let i = start; i <= end; i++) {
      console.log(`[${i+1}] ${lines[i]}`);
    }
    console.log('==============================');
  }
});
