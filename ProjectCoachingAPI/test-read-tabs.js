const fs = require('fs');
const s = fs.readFileSync('wwwroot/index.html', 'utf8');
const idx = s.indexOf('id=" batchTabsContainer\');
console.log(s.substring(idx - 100, idx + 800));
