const fs = require('fs');
const content = fs.readFileSync('views/admin/adminDashboard.ejs', 'utf8');
const lines = content.split('\n');

console.log('--- Finding elements in adminDashboard.ejs ---');
lines.forEach((line, idx) => {
  const l = line.toLowerCase();
  if (l.includes('loadfileslist') || l.includes('tab-files') || l.includes('id="files"') || l.includes('id=\'files\'') || l.includes('class="files"') || l.includes('files_tab') || l.includes('files tab') || l.includes('danh sách tệp')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
