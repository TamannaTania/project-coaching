const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-contents.html', 'utf8');

// 1. Add admin-chapter-card to the wrapper
html = html.replace(/<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transform transition duration-200 hover:shadow-md">/g, 
                    '<div class="admin-chapter-card bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transform transition duration-200 hover:shadow-md">');

// 2. Add onclick to header
const headerRegex = /<div class="bg-slate-800 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">/g;
html = html.replace(headerRegex, '<div class="bg-slate-800 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-slate-700 transition" onclick="toggleChapter(${ch.id})">');

// 3. Add hidden class and ID to content wrapper
const contentRegex = /<!-- Chapter Contents -->\s*<div class="p-6 bg-slate-50\/50">/g;
html = html.replace(contentRegex, '<!-- Chapter Contents -->\n                              <div id="chapter-content-${ch.id}" class="p-6 bg-slate-50/50 hidden">');

fs.writeFileSync('wwwroot/admin-contents.html', html, 'utf8');
console.log("Accordion classes added!");
