const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// Replace the weird character if it exists
html = html.replace('chaptersHtml', 'chaptersHtml');
// Also replace it just in case it's a zero-width or other invisible character
html = html.replace(/[^\x00-\x7F]chaptersHtml/g, 'chaptersHtml');

fs.writeFileSync('course.html', html, 'utf8');
