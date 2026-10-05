const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

if (!html.includes('id="mainColumn"')) {
    html = html.replace('<div class="lg:col-span-2 space-y-8">', '<div id="mainColumn" class="lg:col-span-2 space-y-8">');
}
if (!html.includes('id="sidebarColumn"')) {
    html = html.replace('<div class="lg:col-span-1">', '<div id="sidebarColumn" class="lg:col-span-1">');
}

fs.writeFileSync('course.html', html, 'utf8');
