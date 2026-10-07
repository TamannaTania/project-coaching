const fs = require('fs');

// 1. Update admin.html
let adminHtml = fs.readFileSync('wwwroot/admin.html', 'utf8');
const tab = `<a href="admin-freeclasses.html" class="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-lg transition text-left group">
                <div class="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    <i class="fa-brands fa-youtube"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 mb-1">Free Classes</h3>
                <p class="text-slate-500 text-sm">Manage free demo classes</p>
            </a>`;
adminHtml = adminHtml.replace('<!-- Add more tabs as needed -->', tab + '\n            <!-- Add more tabs as needed -->');
fs.writeFileSync('wwwroot/admin.html', adminHtml, 'utf8');

// 2. Update index.html
let indexHtml = fs.readFileSync('wwwroot/index.html', 'utf8');
const fcLoader = `
        async function loadFreeClasses() {
            try {
                const res = await fetch('/api/FreeClasses');
                const classes = await res.json();
                const container = document.getElementById('freeClassesGrid');
                if(!container) return;
                
                if (classes.length === 0) {
                    container.innerHTML = '<div class="col-span-full text-center text-slate-400">No free classes available right now.</div>';
                    return;
                }

                let html = '';
                classes.forEach(fc => {
                    html += \`
                    <a href="\${fc.videoUrl}" target="_blank" class="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition duration-300 group cursor-pointer block">
                        <div class="relative h-48 bg-slate-200">
                            <img src="\${fc.thumbnailUrl}" class="w-full h-full object-cover" alt="Class Thumbnail">
                            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                                <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-red-600 text-2xl shadow-lg transform group-hover:scale-110 transition">
                                    <i class="fa-solid fa-play"></i>
                                </div>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">\${fc.category}</div>
                            <h3 class="text-lg font-bold text-slate-800 mb-2">\${fc.title}</h3>
                            <p class="text-slate-500 text-sm">\${fc.description}</p>
                        </div>
                    </a>\`;
                });
                container.innerHTML = html;
            } catch (err) {
                console.error(err);
            }
        }
        loadFreeClasses();
`;

// Add id to grid
indexHtml = indexHtml.replace('<div class="grid grid-cols-1 md:grid-cols-3 gap-8">', '<div id="freeClassesGrid" class="grid grid-cols-1 md:grid-cols-3 gap-8">');
// Remove hardcoded items
indexHtml = indexHtml.replace(/<!-- Video 1 -->[\s\S]*?<!-- Video 3 -->[\s\S]*?<\/a>\s*<\/div>/, '</div>');

indexHtml = indexHtml.replace('loadTeachers();', 'loadTeachers();\n' + fcLoader);
fs.writeFileSync('wwwroot/index.html', indexHtml, 'utf8');

console.log("Updated admin tabs and index.html!");
