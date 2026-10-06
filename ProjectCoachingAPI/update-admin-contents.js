const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-contents.html', 'utf8');

const regexOld = /if\(ch\.contents && ch\.contents\.length > 0\) \{[\s\S]*?html \+= `<\/div>`;\s*\}/;

const newLogic = `if(ch.contents && ch.contents.length > 0) {
                            html += \`<div class="grid grid-cols-1 md:grid-cols-2 gap-8">\`;
                            
                            // Video Column (Left)
                            const videos = ch.contents.filter(co => co.type === 'Video');
                            html += \`<div class="space-y-3">\`;
                            html += \`<h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"><i class="fa-solid fa-video text-blue-500 mr-2"></i> Videos</h4>\`;
                            if(videos.length > 0) {
                                videos.forEach(co => {
                                    html += \`
                                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center group hover:border-emerald-300 transition">
                                        <div class="flex items-center gap-4">
                                            <div class="w-12 h-12 rounded-full flex items-center justify-center fa-circle-play text-blue-500 bg-blue-50 text-xl">
                                                <i class="fa-solid fa-play"></i>
                                            </div>
                                            <div>
                                                <h4 class="font-bold text-slate-800 text-sm mb-1">\${co.title}</h4>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">\${co.type}</span>
                                                    <a href="\${co.url}" target="_blank" class="text-xs font-medium text-slate-400 hover:text-blue-500 transition"><i class="fa-solid fa-link"></i> Link</a>
                                                    <span class="text-[10px] text-slate-300">| Order: \${co.orderIndex || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onclick="deleteContent(\${co.id})" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition" title="Delete Content">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>\`;
                                });
                            } else {
                                html += \`<div class="p-4 border border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400">No videos added</div>\`;
                            }
                            html += \`</div>\`;
                            
                            // PDF Column (Right)
                            const pdfs = ch.contents.filter(co => co.type === 'PDF');
                            html += \`<div class="space-y-3">\`;
                            html += \`<h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"><i class="fa-solid fa-file-pdf text-red-500 mr-2"></i> Study Materials</h4>\`;
                            if(pdfs.length > 0) {
                                pdfs.forEach(co => {
                                    html += \`
                                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center group hover:border-emerald-300 transition">
                                        <div class="flex items-center gap-4">
                                            <div class="w-12 h-12 rounded-full flex items-center justify-center fa-file-pdf text-red-500 bg-red-50 text-xl">
                                                <i class="fa-solid fa-file-pdf"></i>
                                            </div>
                                            <div>
                                                <h4 class="font-bold text-slate-800 text-sm mb-1">\${co.title}</h4>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-700">\${co.type}</span>
                                                    <a href="\${co.url}" target="_blank" class="text-xs font-medium text-slate-400 hover:text-blue-500 transition"><i class="fa-solid fa-link"></i> Link</a>
                                                    <span class="text-[10px] text-slate-300">| Order: \${co.orderIndex || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onclick="deleteContent(\${co.id})" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition" title="Delete Content">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </div>\`;
                                });
                            } else {
                                html += \`<div class="p-4 border border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400">No PDFs added</div>\`;
                            }
                            html += \`</div>\`;
                            
                            html += \`</div>\`;
                        }`;

if(html.match(regexOld)) {
    html = html.replace(regexOld, newLogic);
    fs.writeFileSync('wwwroot/admin-contents.html', html, 'utf8');
    console.log("admin-contents.html layout updated to separate Videos and PDFs.");
} else {
    console.log("Could not find the target code to replace in admin-contents.");
}
