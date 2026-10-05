const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// Add icon to Course Overview
html = html.replace('<h2 id="overviewTitle" class="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Course Overview</h2>', 
'<h2 id="overviewTitle" class="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4 flex items-center gap-3"><i class="fa-solid fa-book-open text-blue-500"></i> Course Overview</h2>');

// Add icon to What You Will Learn
html = html.replace('<h3 id="learnTitle" class="text-xl font-bold text-slate-900 mb-4">What You Will Learn</h3>', 
'<h3 id="learnTitle" class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><i class="fa-solid fa-clipboard-check text-emerald-500"></i> What You Will Learn</h3>');

fs.writeFileSync('course.html', html, 'utf8');
