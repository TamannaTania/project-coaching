const fs = require('fs');

const path = 'wwwroot/Scripts/Course/course.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Update handleEnrolledView to have a robust image fallback
const oldHandleEnrolled = `function handleEnrolledView(imgUrl) {
    // Show only the course picture with blurred background
    const vc = document.getElementById('videoContainer');
    if(vc) {
        vc.className = 'w-full rounded-2xl overflow-hidden shadow-2xl relative bg-slate-950 flex items-center justify-center min-h-[260px] md:min-h-[380px]';
        vc.innerHTML = \`
            <img src="\${imgUrl}" class="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-40 select-none pointer-events-none">
            <div class="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"></div>
            <div class="relative z-10 p-3 sm:p-5 flex items-center justify-center w-full h-full">
                <img src="\${imgUrl}" alt="Course Banner" class="max-h-[250px] md:max-h-[360px] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/10 select-none">
            </div>
        \`;
    }
    
    // Hide Sidebar and expand main column
    const sidebar = document.getElementById('sidebarColumn');
    const mainCol = document.getElementById('mainColumn');
    if(sidebar && mainCol) {
        sidebar.style.display = 'none';
        mainCol.classList.remove('lg:col-span-2');
        mainCol.classList.add('lg:col-span-3');
    }
}`;

const newHandleEnrolled = `function handleEnrolledView(imgUrl) {
    const vc = document.getElementById('videoContainer');
    if(vc) {
        vc.className = 'w-full rounded-2xl overflow-hidden shadow-2xl relative bg-slate-950 flex items-center justify-center min-h-[260px] md:min-h-[380px]';
        const displayImg = (imgUrl && imgUrl.trim() && !imgUrl.includes('placeholder.com')) ? imgUrl : 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800';
        vc.innerHTML = \`
            <img src="\${displayImg}" class="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-40 select-none pointer-events-none" onerror="this.src='https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800'">
            <div class="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"></div>
            <div class="relative z-10 p-3 sm:p-5 flex items-center justify-center w-full h-full">
                <img src="\${displayImg}" alt="Course Banner" class="max-h-[250px] md:max-h-[360px] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/10 select-none" onerror="this.src='https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800'">
            </div>
        \`;
    }
    
    // Hide Sidebar and expand main column for enrolled view
    const sidebar = document.getElementById('sidebarColumn');
    const mainCol = document.getElementById('mainColumn');
    if(sidebar && mainCol) {
        sidebar.style.display = 'none';
        mainCol.classList.remove('lg:col-span-2');
        mainCol.classList.add('lg:col-span-3');
    }
}`;

code = code.replace(oldHandleEnrolled, newHandleEnrolled);

// 2. Extract and replace the section from "if(isEnrolled) {" down to "document.getElementById('overviewContent').innerHTML += chaptersHtml;"
// Let's create the unified renderer for status + chapters
const targetStart = 'if(isEnrolled) {';
const targetEnd = "document.getElementById('overviewContent').innerHTML += chaptersHtml;";

const startIndex = code.indexOf(targetStart);
// Find matching block
if (startIndex !== -1) {
    // Let's find where catch (error) starts
    const catchIndex = code.indexOf('} catch (error) {', startIndex);
    if (catchIndex !== -1) {
        const replacement = `
        if(isEnrolled) { 
            handleEnrolledView(imgUrl); 

            const actionDiv = document.getElementById('enrollAction');
            if(actionDiv) {
                actionDiv.innerHTML = \`<div class="bg-blue-50 text-blue-700 p-4 rounded-xl flex items-center gap-3 border border-blue-100">
                    <i class="fa-solid fa-circle-check text-2xl text-blue-600"></i>
                    <div class="font-bold">\${t.statusEnrolled}</div>
                </div>\`;
            }
        } else if(!token) {
            const notice = document.getElementById('unauthenticatedNotice');
            if (notice) notice.classList.remove('hidden');
            const noticeBtn = document.getElementById('noticeLoginBtn');
            if (noticeBtn) noticeBtn.href = \`/Views/Auth/login.html?returnUrl=/Views/Course/course.html?id=\${courseId}\`;

            const descEl = document.getElementById('lockedDesc');
            if (descEl) {
                descEl.innerHTML = \`
                    Enroll in this course to unlock the premium video lectures and study materials.
                    <div class="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a href="/Views/Auth/login.html?returnUrl=/Views/Course/course.html?id=\${courseId}" class="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-blue-600/30 transition flex items-center gap-2">
                            <i class="fa-solid fa-right-to-bracket"></i> কোর্সটি কিনে থাকলে লগইন করুন
                        </a>
                        <button onclick="openEnrollModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-emerald-600/30 transition flex items-center gap-2">
                            <i class="fa-solid fa-cart-shopping"></i> নতুন কিনতে চান? কোর্স টি কিনুন
                        </button>
                    </div>
                \`;
            }
            const actionDiv = document.getElementById('enrollAction');
            if (actionDiv && !actionDiv.querySelector('.guest-login-helper')) {
                actionDiv.innerHTML += \`
                    <div class="guest-login-helper mt-3 text-center">
                        <a href="/Views/Auth/login.html?returnUrl=/Views/Course/course.html?id=\${courseId}" class="text-xs text-blue-600 hover:underline font-bold flex items-center justify-center gap-1.5">
                            <i class="fa-solid fa-arrow-right-to-bracket"></i> আগে কেনা থাকলে লগইন করুন
                        </a>
                    </div>
                \`;
            }
        } else {
            // Logged in but not enrolled - check if pending approval
            try {
                const enrollRes = await fetch('/api/Enrollments/mycourses', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if(enrollRes.ok) {
                    const myCourses = await enrollRes.json();
                    const pending = myCourses.find(c => c.courseId == courseId && c.status === 'Pending');
                    if(pending) {
                        const actionDiv = document.getElementById('enrollAction');
                        if(actionDiv) {
                            actionDiv.innerHTML = \`<div class="bg-amber-50 text-amber-700 p-4 rounded-xl flex items-center gap-3 border border-amber-100">
                                <i class="fa-solid fa-clock text-2xl"></i>
                                <div class="font-bold">\${t.statusPending}</div>
                            </div>\`;
                        }
                    }
                }
            } catch(e) {}
        }

        // Render Chapters (Visible for both enrolled and prospective students, Apar's Classroom style)
        let chaptersHtml = \`
<div class="mt-12 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <h3 class="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
        <i class="fa-solid fa-layer-group text-blue-600"></i> Course Contents
    </h3>
    <div class="relative w-full sm:w-72">
        <input type="text" id="chapterSearch" onkeyup="filterChapters(this.value)" placeholder="Search chapters & topics..." class="w-full bg-white border border-slate-200 rounded-full px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm">
        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400"></i>
    </div>
</div>
<div class="space-y-6" id="chaptersContainer">
\`;
        
        if (course.chapters && course.chapters.length > 0) {
            course.chapters.forEach((ch, index) => {
                  const gradients = [
                      'bg-gradient-to-r from-blue-600 to-indigo-700',
                      'bg-gradient-to-r from-slate-800 to-blue-900',
                      'bg-gradient-to-r from-indigo-600 to-purple-700'
                  ];
                  const headerBg = gradients[index % gradients.length];
                  
                  chaptersHtml += \`<div class="chapter-item bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transform transition duration-200 hover:shadow-lg mb-4">\`;
                  
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
                  
                  chaptersHtml += \`<div id="content-\${ch.id}" class="hidden">\`;

                  if (ch.contents && ch.contents.length > 0) {
                      const pdfs = ch.contents.filter(c => c.type !== 'Video');
                      const videos = ch.contents.filter(c => c.type === 'Video');

                      chaptersHtml += \`<div class="p-6 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100">\`;
                      
                      // Videos Column
                      chaptersHtml += \`<div>
                          <h4 class="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                              <i class="fa-solid fa-circle-play text-blue-500"></i> Video Lectures
                          </h4>
                          <div class="flex flex-col space-y-2">
                      \`;
                      if(videos.length === 0) chaptersHtml += \`<div class="text-sm text-slate-400 italic p-2 bg-slate-100/50 rounded-lg text-center border border-slate-100">No video lectures available yet.</div>\`;
                      videos.forEach(co => {
                          if (isEnrolled) {
                              let videoUrl = co.url || '';
                              if(videoUrl && !videoUrl.startsWith('http') && !videoUrl.startsWith('/')) {
                                  videoUrl = '/' + videoUrl;
                              }
                              const safeTitle = (co.title || '').replace(/'/g, "\\\\'");
                              chaptersHtml += \`
                                  <div onclick="playVideoLecture('\${videoUrl}', '\${safeTitle}', true)" class="flex items-center justify-between py-2.5 px-3 border border-slate-200/70 bg-white hover:border-blue-300 hover:bg-blue-50/60 rounded-xl transition-all cursor-pointer shadow-sm">
                                      <div class="flex items-center gap-3 overflow-hidden">
                                          <div class="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-blue-600 bg-blue-100 transition-all">
                                              <i class="fa-solid fa-play text-sm"></i>
                                          </div>
                                          <div class="truncate">
                                              <h4 class="font-bold text-slate-800 text-sm truncate hover:text-blue-600 transition-colors">\${co.title}</h4>
                                              <span class="text-xs text-blue-500 font-medium">ভিডিও লেকচার</span>
                                          </div>
                                      </div>
                                      <button class="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                                          <i class="fa-solid fa-play text-[10px]"></i> প্লে
                                      </button>
                                  </div>
                              \`;
                          } else {
                              chaptersHtml += \`
                                  <div onclick="openEnrollModal()" class="flex items-center justify-between py-2.5 px-3 border border-slate-200/70 bg-slate-50/70 hover:bg-amber-50/50 rounded-xl transition-all cursor-pointer shadow-sm" title="কোর্সটি কিনে আনলক করুন">
                                      <div class="flex items-center gap-3 overflow-hidden">
                                          <div class="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-slate-400 bg-slate-200/80 transition-all">
                                              <i class="fa-solid fa-lock text-sm"></i>
                                          </div>
                                          <div class="truncate">
                                              <h4 class="font-bold text-slate-700 text-sm truncate">\${co.title}</h4>
                                              <span class="text-xs text-amber-600 font-semibold"><i class="fa-solid fa-lock text-[10px] mr-1"></i>লকড ক্লাস</span>
                                          </div>
                                      </div>
                                      <button onclick="event.stopPropagation(); openEnrollModal()" class="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                                          <i class="fa-solid fa-cart-shopping text-[10px]"></i> কিনুন
                                      </button>
                                  </div>
                              \`;
                          }
                      });
                      chaptersHtml += \`</div></div>\`;

                      // PDFs Column
                      chaptersHtml += \`<div>
                          <h4 class="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                              <i class="fa-solid fa-file-pdf text-red-500"></i> Study Materials
                          </h4>
                          <div class="flex flex-col space-y-2">
                      \`;
                      if(pdfs.length === 0) chaptersHtml += \`<div class="text-sm text-slate-400 italic p-2 bg-slate-100/50 rounded-lg text-center border border-slate-100">No study materials available yet.</div>\`;
                      pdfs.forEach(co => {
                          if (isEnrolled) {
                              let pdfUrl = co.url || '';
                              if(pdfUrl && !pdfUrl.startsWith('http') && !pdfUrl.startsWith('/')) {
                                  pdfUrl = '/' + pdfUrl.replace(/^\\//, '');
                              }
                              chaptersHtml += \`
                                  <a href="\${pdfUrl}" target="_blank" download class="flex items-center justify-between py-2.5 px-3 border border-slate-200/70 bg-white hover:border-red-300 hover:bg-red-50/60 rounded-xl transition-all cursor-pointer shadow-sm">
                                      <div class="flex items-center gap-3 overflow-hidden">
                                          <div class="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-red-500 bg-red-100 text-base">
                                              <i class="fa-solid fa-file-pdf"></i>
                                          </div>
                                          <div class="truncate">
                                              <h4 class="font-bold text-slate-800 text-sm truncate hover:text-red-600 transition-colors">\${co.title}</h4>
                                              <span class="text-xs text-red-500 font-medium">পিডিএফ নোট</span>
                                          </div>
                                      </div>
                                      <span class="text-xs bg-red-50 text-red-600 border border-red-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-red-600 hover:text-white transition">
                                          <i class="fa-solid fa-download text-[10px]"></i> ডাউনলোড
                                      </span>
                                  </a>
                              \`;
                          } else {
                              chaptersHtml += \`
                                  <div onclick="openEnrollModal()" class="flex items-center justify-between py-2.5 px-3 border border-slate-200/70 bg-slate-50/70 hover:bg-amber-50/50 rounded-xl transition-all cursor-pointer shadow-sm" title="কোর্সটি কিনে আনলক করুন">
                                      <div class="flex items-center gap-3 overflow-hidden">
                                          <div class="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-slate-400 bg-slate-200/80 text-base">
                                              <i class="fa-solid fa-file-pdf"></i>
                                          </div>
                                          <div class="truncate">
                                              <h4 class="font-bold text-slate-700 text-sm truncate">\${co.title}</h4>
                                              <span class="text-xs text-slate-400 font-medium">পিডিএফ নোট</span>
                                          </div>
                                      </div>
                                      <span class="text-xs bg-slate-200/70 text-slate-600 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                          <i class="fa-solid fa-lock text-[10px] text-amber-500"></i> লকড
                                      </span>
                                  </div>
                              \`;
                          }
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
              });
        } else {
            chaptersHtml += \`<div class="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm"><div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fa-solid fa-person-digging text-3xl text-blue-500"></i></div><h3 class="text-lg font-bold text-slate-800 mb-1">Curriculum Under Construction</h3><p class="text-slate-500">Chapters and videos will be published here very soon.</p></div>\`;
        }
        chaptersHtml += '</div></div>';
        
        document.getElementById('overviewContent').innerHTML += chaptersHtml;
        `;

        code = code.substring(0, startIndex) + replacement + code.substring(catchIndex);
        fs.writeFileSync(path, code, 'utf8');
        console.log("Successfully updated course.js!");
    } else {
        console.log("Could not find catchIndex");
    }
} else {
    console.log("Could not find startIndex");
}
