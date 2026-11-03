const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// 1. Add toggleAccordion function to script if it doesn't exist
if (!html.includes('toggleAccordion(id, iconId)')) {
    const fn = `
        function toggleAccordion(id, iconId) {
            const el = document.getElementById(id);
            const icon = document.getElementById(iconId);
            if(el.classList.contains('hidden')) {
                el.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                el.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        }
    </script>`;
    html = html.replace('</script>', fn);
}


// Replace string manually by extracting everything between two points
const startStr = 'chaptersHtml += `<div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transform transition duration-200 hover:shadow-lg">`;';
const endStr = 'chaptersHtml += `</div>`;\n                        });';

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const finalEndIndex = endIndex + endStr.length;
    const oldLogic = html.substring(startIndex, finalEndIndex);

    const newLogic = `chaptersHtml += \`<div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transform transition duration-200 hover:shadow-lg">\`;
                              
                              // Chapter Header
                              chaptersHtml += \`
                                  <div class="\${headerBg} p-5 flex justify-between items-center cursor-pointer select-none" onclick="toggleAccordion('content-\${ch.id}', 'icon-\${ch.id}')">
                                      <div class="flex items-center gap-4 text-white">
                                          <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                              <i class="fa-solid fa-folder-open text-xl"></i>
                                          </div>
                                          <div>
                                              <div class="text-xs font-bold uppercase tracking-widest text-white/80 mb-0.5">Chapter \${index + 1}</div>
                                              <h4 class="font-bold text-lg">\${ch.title}</h4>
                                          </div>
                                      </div>
                                      <div class="flex items-center gap-4">
                                          <div class="text-white/80 bg-white/10 px-3 py-1 rounded-lg text-sm font-medium hidden sm:block">
                                              \${ch.contents ? ch.contents.length : 0} Items
                                          </div>
                                          <div class="text-white bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300" id="icon-\${ch.id}">
                                              <i class="fa-solid fa-chevron-down"></i>
                                          </div>
                                      </div>
                                  </div>
                              \`;
                              
                              // Chapter Contents Container (Hidden by default)
                              chaptersHtml += \`<div id="content-\${ch.id}" class="hidden">\`;

                              if (ch.contents && ch.contents.length > 0) {
                                  const pdfs = ch.contents.filter(c => c.type !== 'Video');
                                  const videos = ch.contents.filter(c => c.type === 'Video');

                                  chaptersHtml += \`<div class="p-6 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100">\`;
                                  
                                  // Left Side: PDFs (ba pashe)
                                  chaptersHtml += \`<div>
                                      <h4 class="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                                          <i class="fa-solid fa-file-pdf text-red-500"></i> Study Materials
                                      </h4>
                                      <div class="flex flex-col gap-3">
                                  \`;
                                  if(pdfs.length === 0) chaptersHtml += \`<div class="text-sm text-slate-400 italic p-2 bg-slate-100/50 rounded-lg text-center border border-slate-100">No study materials available yet.</div>\`;
                                  pdfs.forEach(co => {
                                      chaptersHtml += \`
                                          <a href="\${co.url}" target="_blank" class="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex items-center justify-between group hover:border-red-300 hover:shadow-md transition cursor-pointer">
                                              <div class="flex items-center gap-3 overflow-hidden">
                                                  <div class="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-red-500 bg-red-50 text-lg group-hover:scale-110 transition-transform">
                                                      <i class="fa-solid fa-file-pdf"></i>
                                                  </div>
                                                  <div class="truncate">
                                                      <h4 class="font-bold text-slate-800 text-sm truncate group-hover:text-red-600 transition-colors">\${co.title}</h4>
                                                      <span class="text-[10px] font-bold text-red-500 uppercase tracking-wider">PDF</span>
                                                  </div>
                                              </div>
                                              <i class="fa-solid fa-download text-slate-300 group-hover:text-red-400 transition-colors"></i>
                                          </a>
                                      \`;
                                  });
                                  chaptersHtml += \`</div></div>\`;

                                  // Right Side: Videos (dan pashe)
                                  chaptersHtml += \`<div>
                                      <h4 class="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                                          <i class="fa-solid fa-circle-play text-blue-500"></i> Video Lectures
                                      </h4>
                                      <div class="flex flex-col gap-3">
                                  \`;
                                  if(videos.length === 0) chaptersHtml += \`<div class="text-sm text-slate-400 italic p-2 bg-slate-100/50 rounded-lg text-center border border-slate-100">No video lectures available yet.</div>\`;
                                  videos.forEach(co => {
                                      chaptersHtml += \`
                                          <a href="\${co.url}" target="_blank" class="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex items-center justify-between group hover:border-blue-300 hover:shadow-md transition cursor-pointer">
                                              <div class="flex items-center gap-3 overflow-hidden">
                                                  <div class="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-blue-500 bg-blue-50 text-lg group-hover:scale-110 transition-transform">
                                                      <i class="fa-solid fa-play"></i>
                                                  </div>
                                                  <div class="truncate">
                                                      <h4 class="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">\${co.title}</h4>
                                                      <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Video</span>
                                                  </div>
                                              </div>
                                              <i class="fa-solid fa-play text-slate-300 group-hover:text-blue-400 transition-colors"></i>
                                          </a>
                                      \`;
                                  });
                                  chaptersHtml += \`</div></div>\`;
                                  chaptersHtml += \`</div>\`;
                              } else {
                                  chaptersHtml += \`
                                      <div class="p-8 text-center bg-slate-50 border-t border-slate-100">
                                          <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                              <i class="fa-solid fa-hourglass-half text-slate-400"></i>
                                          </div>
                                          <p class="text-slate-500 text-sm font-medium">Contents for this chapter will be uploaded soon.</p>
                                      </div>
                                  \`;
                              }
                              chaptersHtml += \`</div></div>\`;
                        });`;

    html = html.replace(oldLogic, newLogic);
    fs.writeFileSync('course.html', html, 'utf8');
    console.log("SUCCESS: Replaced the accordion logic.");
} else {
    console.log("ERROR: Could not find start or end index.");
}
