const fs = require('fs');

let html = fs.readFileSync('course.html', 'utf8');

// Give an ID to the absolute locked overlay so we can hide it
html = html.replace('<div class="absolute inset-0 bg-slate-900/60', '<div id="videoPlaceholder" class="absolute inset-0 bg-slate-900/60');

// Give an ID to the overview box so we can append chapters to it
html = html.replace('<div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">', '<div id="overviewContent" class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">');

fs.writeFileSync('course.html', html, 'utf8');
