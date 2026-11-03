const fs = require('fs');

let html = fs.readFileSync('course.html', 'utf8');

const oldRenderLogic = `                    // Render Chapters
                    let chaptersHtml = '<div class="mt-8"><h3 class="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Course Contents</h3><div class="space-y-4">';
                    
                    if (course.chapters && course.chapters.length > 0) {
                        course.chapters.forEach(ch => {
                            chaptersHtml += \`<div class="border rounded-xl overflow-hidden shadow-sm">\`;
                            chaptersHtml += \`<div class="bg-slate-50 p-4 font-bold text-lg text-slate-800 flex justify-between items-center"><div class="flex items-center gap-2"><i class="fa-solid fa-folder-open text-emerald-600"></i> \${ch.title}</div></div>\`;
                            if (ch.contents && ch.contents.length > 0) {
                                chaptersHtml += \`<div class="p-4 bg-white divide-y">\`;
                                ch.contents.forEach(co => {
                                    let icon = co.type === 'Video' ? 'fa-circle-play text-blue-500' : 'fa-file-pdf text-red-500';
                                    let typeLabel = co.type === 'Video' ? 'Video' : 'PDF';
                                    chaptersHtml += \`
                                        <a href="\${co.url}" target="_blank" class="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded transition cursor-pointer group">
                                            <div class="flex items-center gap-3">
                                                <i class="fa-solid \${icon} text-xl group-hover:scale-110 transition"></i>
                                                <span class="font-medium text-slate-700 group-hover:text-emerald-600">\${co.title}</span>
                                            </div>
                                            <span class="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold uppercase">\${typeLabel}</span>
                                        </a>
                                    \`;
                                });
                                chaptersHtml += \`</div>\`;
                            } else {
                                chaptersHtml += \`<div class="p-4 text-slate-500 text-sm">No contents available in this chapter yet.</div>\`;
                            }
                            chaptersHtml += \`</div>\`;
                        });
                    } else {
                        chaptersHtml += \`<div class="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed"><i class="fa-solid fa-box-open text-3xl mb-2 text-slate-400"></i><br>Chapters will be uploaded soon.</div>\`;
                    }
                    chaptersHtml += '</div></div>';`;

const newRenderLogic = `                    // Render Chapters
                    let chaptersHtml = '<div class="mt-10"><h3 class="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3"><i class="fa-solid fa-layer-group text-emerald-500"></i> Course Contents</h3><div class="space-y-6">';
                    
                    if (course.chapters && course.chapters.length > 0) {
                        course.chapters.forEach((ch, index) => {
                            // Alternate background gradients for chapters
                            const gradients = [
                                'bg-gradient-to-r from-emerald-500 to-teal-600',
                                'bg-gradient-to-r from-blue-500 to-indigo-600',
                                'bg-gradient-to-r from-purple-500 to-pink-600'
                            ];
                            const headerBg = gradients[index % gradients.length];
                            
                            chaptersHtml += \`<div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transform transition duration-200 hover:shadow-lg">\`;
                            
                            // Chapter Header
                            chaptersHtml += \`
                                <div class="\${headerBg} p-5 flex justify-between items-center">
                                    <div class="flex items-center gap-4 text-white">
                                        <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <i class="fa-solid fa-folder-open text-xl"></i>
                                        </div>
                                        <div>
                                            <div class="text-xs font-bold uppercase tracking-widest text-white/80 mb-0.5">Chapter \${index + 1}</div>
                                            <h4 class="font-bold text-lg">\${ch.title}</h4>
                                        </div>
                                    </div>
                                    <div class="text-white/80 bg-white/10 px-3 py-1 rounded-lg text-sm font-medium">
                                        \${ch.contents ? ch.contents.length : 0} Items
                                    </div>
                                </div>
                            \`;
                            
                            // Chapter Contents
                            if (ch.contents && ch.contents.length > 0) {
                                chaptersHtml += \`<div class="p-5 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 gap-4">\`;
                                ch.contents.forEach(co => {
                                    let isVid = co.type === 'Video';
                                    let icon = isVid ? 'fa-circle-play text-blue-500 bg-blue-50' : 'fa-file-pdf text-red-500 bg-red-50';
                                    let badgeColor = isVid ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700';
                                    
                                    chaptersHtml += \`
                                        <a href="\${co.url}" target="_blank" class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between group hover:border-emerald-300 hover:shadow-md transition cursor-pointer">
                                            <div class="flex items-center gap-4 overflow-hidden">
                                                <div class="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center \${icon} text-xl group-hover:scale-110 transition-transform">
                                                    <i class="fa-solid \${isVid ? 'fa-play' : 'fa-file-pdf'}"></i>
                                                </div>
                                                <div class="truncate">
                                                    <h4 class="font-bold text-slate-800 text-sm mb-1 truncate group-hover:text-emerald-600 transition-colors">\${co.title}</h4>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md \${badgeColor}">\${co.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="text-slate-300 group-hover:text-emerald-500 transition-colors">
                                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                            </div>
                                        </a>
                                    \`;
                                });
                                chaptersHtml += \`</div>\`;
                            } else {
                                chaptersHtml += \`
                                    <div class="p-8 text-center bg-slate-50">
                                        <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <i class="fa-solid fa-hourglass-half text-slate-400"></i>
                                        </div>
                                        <p class="text-slate-500 text-sm font-medium">Contents for this chapter will be uploaded soon.</p>
                                    </div>
                                \`;
                            }
                            chaptersHtml += \`</div>\`;
                        });
                    } else {
                        chaptersHtml += \`<div class="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm"><div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fa-solid fa-person-digging text-3xl text-emerald-500"></i></div><h3 class="text-lg font-bold text-slate-800 mb-1">Curriculum Under Construction</h3><p class="text-slate-500">Chapters and videos will be published here very soon.</p></div>\`;
                    }
                    chaptersHtml += '</div></div>';`;

// Find where old logic is. It should be exact match.
if (html.includes("let chaptersHtml = '<div class=\"mt-8\"><h3 class=\"text-2xl font-bold text-slate-800 mb-6 border-b pb-2\">Course Contents</h3><div class=\"space-y-4\">';")) {
    html = html.replace(oldRenderLogic, newRenderLogic);
    fs.writeFileSync('course.html', html, 'utf8');
    console.log("Success");
} else {
    console.log("Could not find the exact string block to replace");
}
