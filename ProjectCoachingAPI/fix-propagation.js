const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-contents.html', 'utf8');

// Stop propagation on Add Content and Delete Chapter buttons
html = html.replace('onclick="showContentModal(${ch.id})"', 'onclick="event.stopPropagation(); showContentModal(${ch.id})"');
html = html.replace('onclick="deleteChapter(${ch.id})"', 'onclick="event.stopPropagation(); deleteChapter(${ch.id})"');

fs.writeFileSync('wwwroot/admin-contents.html', html, 'utf8');
console.log("Propagation fixed!");
