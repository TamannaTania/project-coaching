const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-teachers.html', 'utf8');

html = html.replace('alert("Failed to save teacher.");', 'const err = await response.json(); alert("Failed to save teacher: " + (err.message || JSON.stringify(err)));');

fs.writeFileSync('wwwroot/admin-teachers.html', html, 'utf8');
