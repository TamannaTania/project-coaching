const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// Add id="videoPlaceholder" to the locked video div
html = html.replace('<div class="w-full aspect-video', '<div id="videoPlaceholder" class="w-full aspect-video');

// Check if enrollBtn is wrapped in enrollAction
if(!html.includes('id="enrollAction"')) {
    html = html.replace(/<button id="enrollBtn"[\s\S]*?<\/button>/, match => `<div id="enrollAction">\n                            ${match}\n                        </div>`);
}

fs.writeFileSync('course.html', html, 'utf8');
