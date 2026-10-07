const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-freeclasses.html', 'utf8');

html = html.replace('fa-user-plus text-purple-500', 'fa-youtube text-red-500');
html = html.replace('Add New Teacher', 'Add New Free Class');

fs.writeFileSync('wwwroot/admin-freeclasses.html', html, 'utf8');
console.log("Fixed heading in admin-freeclasses");
