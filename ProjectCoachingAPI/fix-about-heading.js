const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-about.html', 'utf8');

// Replace the wrong heading
html = html.replace('Add New Free Class', 'Update About Content');

fs.writeFileSync('wwwroot/admin-about.html', html, 'utf8');
console.log("Fixed heading in admin-about.html");
