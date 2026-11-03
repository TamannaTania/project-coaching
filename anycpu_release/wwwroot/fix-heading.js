const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// 1. Fix translation destroying icons by using a span
html = html.replace('<h2 id="overviewTitle"', '<h2 id="overviewHeading"');
html = html.replace('<i class="fa-solid fa-book-open text-blue-500"></i> Course Overview', '<i class="fa-solid fa-book-open text-blue-200"></i> <span id="overviewTitle">Course Overview</span>');

html = html.replace('<h3 id="learnTitle"', '<h3 id="learnHeading"');
html = html.replace('<i class="fa-solid fa-clipboard-check text-emerald-500"></i> What You Will Learn', '<i class="fa-solid fa-clipboard-check text-emerald-200"></i> <span id="learnTitle">What You Will Learn</span>');

// 2. Add gorgeous gradient styles to the headings
html = html.replace(
    'class="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4 flex items-center gap-3"', 
    'class="text-2xl font-bold text-white bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-xl mb-6 shadow-md flex items-center gap-3"'
);

html = html.replace(
    'class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"',
    'class="text-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-xl mt-10 mb-6 shadow-md flex items-center gap-3"'
);

fs.writeFileSync('course.html', html, 'utf8');
