const fs = require('fs');

let html = fs.readFileSync('admin-contents.html', 'utf8');

// Replace the top header
const oldHeader = `<div class="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
                <h1 class="text-3xl font-extrabold text-slate-800">Manage Contents</h1>
                <p class="text-slate-500 mt-1">Organize chapters and upload videos/PDFs for your courses.</p>
            </div>
            <a href="admin.html" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2">
                <i class="fa-solid fa-arrow-left"></i> Dashboard
            </a>
        </div>`;

const newHeader = `<div class="flex justify-between items-center mb-10 bg-gradient-to-br from-indigo-900 to-blue-700 p-8 rounded-3xl shadow-xl border border-indigo-800/50">
            <div>
                <h1 class="text-4xl font-extrabold text-white tracking-tight mb-2">Manage Contents</h1>
                <p class="text-indigo-200 font-medium text-lg">Organize chapters and upload videos/PDFs for your courses.</p>
            </div>
            <a href="admin.html" class="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg">
                <i class="fa-solid fa-arrow-left"></i> Dashboard
            </a>
        </div>`;

html = html.replace(oldHeader, newHeader);

fs.writeFileSync('admin-contents.html', html, 'utf8');
