const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-freeclasses.html', 'utf8');

// 1. Fix text
html = html.replace('Add and organize teachers for the homepage.', 'Add and organize free video classes for the homepage.');
html = html.replace('Existing Teachers', 'Existing Free Classes');

// 2. Fix JS bug
html = html.replace("document.getElementById('teachersContainer')", "document.getElementById('teachersList')");

fs.writeFileSync('wwwroot/admin-freeclasses.html', html, 'utf8');
console.log("Fixed text and js bug!");
