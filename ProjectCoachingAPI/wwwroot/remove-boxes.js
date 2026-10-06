const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// Replace PDF item styling
html = html.replace(/<a href="\${co\.url}" target="_blank" class="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex items-center justify-between group hover:border-red-300 hover:shadow-md transition cursor-pointer">/g, 
    `<a href="\${co.url}" target="_blank" class="flex items-center justify-between py-3 px-2 border-b border-slate-200/60 last:border-0 group hover:bg-red-50/50 rounded-lg transition-colors cursor-pointer">`);

// Replace Video item styling
html = html.replace(/<a href="\${co\.url}" target="_blank" class="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex items-center justify-between group hover:border-blue-300 hover:shadow-md transition cursor-pointer">/g, 
    `<a href="\${co.url}" target="_blank" class="flex items-center justify-between py-3 px-2 border-b border-slate-200/60 last:border-0 group hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer">`);


fs.writeFileSync('course.html', html, 'utf8');
console.log("Replaced box styles with clean list style.");
