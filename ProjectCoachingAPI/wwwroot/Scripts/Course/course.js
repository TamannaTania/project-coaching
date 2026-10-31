// course.js - Course Details, Chapters & Enrollment Logic
// @ts-nocheck

const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');
const isAppMode = urlParams.get('app') === 'true' || sessionStorage.getItem('isApp') === 'true';

if (isAppMode) {
    sessionStorage.setItem('isApp', 'true');
    const webNav = document.querySelector('nav');
    if (webNav) webNav.style.display = 'none';
    document.body.classList.remove('pt-20');
    const topBar = document.createElement('div');
    topBar.className = 'sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 border-b border-blue-900/40 text-white px-4 py-3 flex items-center justify-between shadow-xl';
    topBar.innerHTML = `<button onclick="window.location.href='/Views/App/app.html'" class="flex items-center gap-2 text-blue-200 hover:text-white font-bold transition text-sm"><i class="fa-solid fa-arrow-left"></i> <span>অ্যাপে ফিরুন</span></button><span class="font-extrabold text-white text-sm">PhysicsClassroom</span><div class="w-8"></div>`;
    document.body.prepend(topBar);
} else {
    sessionStorage.removeItem('isApp');
}

const translations = {
    en: {
        navHome: "Home", navCourses: "Courses", navAdmin: "Admin",
        waitText: "Please wait", overviewTitle: "Course Overview",
        learnTitle: "What You Will Learn",
        f1: "In-depth Concept Building", f2: "Complex Numerical Solving", f3: "Board CQ & MCQ Practice", f4: "Chapter-wise Model Tests",
        paymentTitle: "One-time payment", enrolledText: "Students Enrolled",
        access1: "Full Video Access", access2: "Lifetime Validity", access3: "Access via App & Web",
        buyBtn: "Buy Course",
        lockedTitle: "Video is Locked", lockedDesc: "Enroll in this course to unlock the premium video lectures and study materials.",
        statusEnrolled: "✅ Already Enrolled", statusPending: "⏳ Pending Approval"
    },
    bn: {
        navHome: "হোম", navCourses: "কোর্সসমূহ", navAdmin: "অ্যাডমিন",
        waitText: "অপেক্ষা করুন", overviewTitle: "কোর্সের বিবরণ",
        learnTitle: "যা যা শিখবেন",
        f1: "বেসিক থেকে গভীর কনসেপ্ট", f2: "জটিল গাণিতিক সমাধান", f3: "বোর্ড CQ ও MCQ প্র্যাকটিস", f4: "অধ্যায়ভিত্তিক মডেল টেস্ট",
        paymentTitle: "এককালীন পেমেন্ট", enrolledText: "জন স্টুডেন্ট ভর্তি হয়েছে",
        access1: "ফুল ভিডিও এক্সেস", access2: "আজীবন মেয়াদ", access3: "অ্যাপ ও ওয়েব এক্সেস",
        buyBtn: "Course টি কিনুন",
        lockedTitle: "ভিডিও লক করা আছে", lockedDesc: "প্রিমিয়াম ভিডিও লেকচার এবং স্টাডি ম্যাটেরিয়াল আনলক করতে এই কোর্সে ভর্তি হোন।",
        statusEnrolled: "✅ ভর্তি সম্পন্ন হয়েছে", statusPending: "⏳ অ্যাপ্রুভালের অপেক্ষায়"
    }
};

async function logout() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    try {
        await fetch('/api/Auth/logout', { 
            method: 'POST',
            headers: { 
                'Authorization': token ? 'Bearer ' + token : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });
    } catch(e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    sessionStorage.clear();
    window.location.reload();
}

function updateAuthNav(lang) {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const container = document.getElementById('authNavContainer');
    if(!container) return;
    
    if(token) {
        const logoutText = lang === 'bn' ? 'লগআউট' : 'Logout';
        const profileText = username ? username : (lang === 'bn' ? 'প্রোফাইল' : 'Profile');
        const myCoursesText = lang === 'bn' ? 'আমার কোর্সসমূহ' : 'My Courses';
        container.innerHTML = `
            <a href="/Views/Profile/profile.html" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-full text-xs md:text-sm flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition transform hover:-translate-y-0.5">
                <i class="fa-solid fa-graduation-cap"></i> <span>` + myCoursesText + `</span>
            </a>
            <a href="/Views/Profile/profile.html" class="bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold px-4 py-2 rounded-full text-sm md:text-base flex items-center gap-2 border border-slate-200 transition shadow-sm hover:shadow">
                <i class="fa-solid fa-user-circle text-2xl text-blue-600"></i> <span class="inline-block max-w-[120px] truncate">` + profileText + `</span>
            </a>
            <button onclick="logout()" class="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold px-4 py-2 rounded-full text-sm md:text-base transition flex items-center gap-2 shadow-sm border border-red-200 ml-1 hover:shadow">
                <i class="fa-solid fa-arrow-right-from-bracket text-base"></i> <span class="hidden sm:inline">` + logoutText + `</span>
            </button>
        `;
    } else {
        const loginText = lang === 'bn' ? 'লগইন' : 'Login';
        container.innerHTML = `<a href="/Views/Auth/login.html?returnUrl=/Views/Course/course.html?id=` + (courseId || '') + `" class="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"><i class="fa-solid fa-user text-sm"></i> ` + loginText + `</a>`;
    }
}

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    const t = translations[lang];

    updateAuthNav(lang);
    if(document.getElementById('navHome')) document.getElementById('navHome').innerText = t.navHome;
    if(document.getElementById('navCourses')) document.getElementById('navCourses').innerText = t.navCourses;
    if(document.getElementById('navAdmin')) document.getElementById('navAdmin').innerText = t.navAdmin;
    
    if(document.getElementById('waitText')) document.getElementById('waitText').innerText = t.waitText;
    if(document.getElementById('overviewTitle')) document.getElementById('overviewTitle').innerText = t.overviewTitle;
    if(document.getElementById('learnTitle')) document.getElementById('learnTitle').innerText = t.learnTitle;
    
    if(document.getElementById('f1')) document.getElementById('f1').innerText = t.f1;
    if(document.getElementById('f2')) document.getElementById('f2').innerText = t.f2;
    if(document.getElementById('f3')) document.getElementById('f3').innerText = t.f3;
    if(document.getElementById('f4')) document.getElementById('f4').innerText = t.f4;
    
    if(document.getElementById('paymentTitle')) document.getElementById('paymentTitle').innerText = t.paymentTitle;
    if(document.getElementById('enrolledText')) document.getElementById('enrolledText').innerText = t.enrolledText;
    
    if(document.getElementById('access1')) document.getElementById('access1').innerText = t.access1;
    if(document.getElementById('access2')) document.getElementById('access2').innerText = t.access2;
    if(document.getElementById('access3')) document.getElementById('access3').innerText = t.access3;
    
    if(document.getElementById('lockedTitle')) document.getElementById('lockedTitle').innerText = t.lockedTitle;
    if(document.getElementById('lockedDesc')) document.getElementById('lockedDesc').innerText = t.lockedDesc;

    const btn = document.getElementById('enrollBtn');
    if(btn && btn.onclick !== null) {
        btn.innerText = lang === 'bn' ? 'Course টি কিনুন' : 'Buy Course';
    } else if (btn) {
        if(btn.innerText.includes('Already') || btn.innerText.includes('সম্পন্ন')) {
            btn.innerText = t.statusEnrolled;
        } else if(btn.innerText.includes('Pending') || btn.innerText.includes('অপেক্ষায়')) {
            btn.innerText = t.statusPending;
        }
    }

    if (lang === 'bn') {
        if(document.getElementById('btnBn')) document.getElementById('btnBn').className = 'px-3 py-1 text-sm font-bold bg-emerald-600 text-white';
        if(document.getElementById('btnEn')) document.getElementById('btnEn').className = 'px-3 py-1 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition';
    } else {
        if(document.getElementById('btnEn')) document.getElementById('btnEn').className = 'px-3 py-1 text-sm font-bold bg-emerald-600 text-white';
        if(document.getElementById('btnBn')) document.getElementById('btnBn').className = 'px-3 py-1 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition';
    }
}

function handleEnrolledView(imgUrl) {
    const vc = document.getElementById('videoContainer');
    if(vc) {
        vc.className = 'w-full rounded-2xl overflow-hidden shadow-2xl relative bg-slate-950 flex items-center justify-center min-h-[260px] md:min-h-[380px]';
        const displayImg = (imgUrl && imgUrl.trim() && !imgUrl.includes('placeholder.com')) ? imgUrl : 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800';
        vc.innerHTML = `
            <img src="${displayImg}" class="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-40 select-none pointer-events-none" onerror="this.src='https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800'">
            <div class="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"></div>
            <div class="relative z-10 p-3 sm:p-5 flex items-center justify-center w-full h-full">
                <img src="${displayImg}" alt="Course Banner" class="max-h-[250px] md:max-h-[360px] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/10 select-none" onerror="this.src='https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800'">
            </div>
        `;
    }
    
    // Hide Sidebar and expand main column for enrolled view
    const sidebar = document.getElementById('sidebarColumn');
    const mainCol = document.getElementById('mainColumn');
    if(sidebar && mainCol) {
        sidebar.style.display = 'none';
        mainCol.classList.remove('lg:col-span-2');
        mainCol.classList.add('lg:col-span-3');
    }
}

function playVideoLecture(url, title) {
    let videoUrl = url;
    if(!videoUrl.startsWith('http') && !videoUrl.startsWith('/')) {
        videoUrl = '/' + videoUrl;
    }
    const appQuery = isAppMode ? '&app=true' : '';
    window.location.href = `/Views/Course/watch.html?courseId=${courseId}&url=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(title)}${appQuery}`;
}

async function loadCourseDetails() {
    if(!courseId) {
        document.getElementById('courseHeader').innerHTML = '<h1 class="text-slate-900 text-3xl font-bold">Course Not Found</h1>';
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/Courses/' + courseId, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} });
        const course = await response.json();

        if(!course) throw new Error("Not found");

        const batchTag = course.batch || course.Batch || 'HSC 2028';
        document.getElementById('courseHeader').innerHTML = `
            <div class="mb-2">
                <span class="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1.5 shadow-sm">
                    <i class="fa-solid fa-graduation-cap text-xs"></i> ${batchTag}
                </span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-2">${course.title}</h1>
            <p class="text-slate-500 font-medium">Complete Physics Preparation Batch</p>
        `;

        let imgUrl = course.imageUrl || 'https://via.placeholder.com/800x400?text=Physics+Course';
        if(!imgUrl.startsWith('http')) {
            imgUrl = '/' + imgUrl.replace(/^\//, '');
        }
        document.getElementById('courseImage').src = imgUrl;

        document.getElementById('coursePrice').innerText = '৳' + course.price;
        document.getElementById('courseDesc').innerText = course.description;
        document.getElementById('enrolledCount').innerText = course.enrolledCount || 0;

        const lang = localStorage.getItem('lang') || 'en';
        const t = translations[lang];

        let isEnrolled = course.isEnrolled === true;
        if (!isEnrolled && token) {
            try {
                const checkRes = await fetch('/api/Enrollments/check/' + courseId, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (checkRes.ok) {
                    const checkData = await checkRes.json();
                    if (checkData.isEnrolled === true) {
                        isEnrolled = true;
                        const refetchRes = await fetch('/api/Courses/' + courseId, {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        if (refetchRes.ok) {
                            const refreshedCourse = await refetchRes.json();
                            if (refreshedCourse && refreshedCourse.chapters) {
                                course.chapters = refreshedCourse.chapters;
                            }
                        }
                    }
                }
            } catch(e) {}
        }

        
        if(isEnrolled) { 
            handleEnrolledView(imgUrl); 

            const actionDiv = document.getElementById('enrollAction');
            if(actionDiv) {
                actionDiv.innerHTML = `<div class="bg-blue-50 text-blue-700 p-4 rounded-xl flex items-center gap-3 border border-blue-100">
                    <i class="fa-solid fa-circle-check text-2xl text-blue-600"></i>
                    <div class="font-bold">${t.statusEnrolled}</div>
                </div>`;
            }
        } else if(!token) {
            const notice = document.getElementById('unauthenticatedNotice');
            if (notice) notice.classList.remove('hidden');
            const noticeBtn = document.getElementById('noticeLoginBtn');
            if (noticeBtn) noticeBtn.href = `/Views/Auth/login.html?returnUrl=/Views/Course/course.html?id=${courseId}`;

            const descEl = document.getElementById('lockedDesc');
            if (descEl) {
                descEl.innerHTML = `
                    Enroll in this course to unlock the premium video lectures and study materials.
                    <div class="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a href="/Views/Auth/login.html?returnUrl=/Views/Course/course.html?id=${courseId}" class="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-blue-600/30 transition flex items-center gap-2">
                            <i class="fa-solid fa-right-to-bracket"></i> কোর্সটি কিনে থাকলে লগইন করুন
                        </a>
                        <button onclick="openEnrollModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-lg shadow-emerald-600/30 transition flex items-center gap-2">
                            <i class="fa-solid fa-cart-shopping"></i> নতুন কিনতে চান? কোর্স টি কিনুন
                        </button>
                    </div>
                `;
            }
            const actionDiv = document.getElementById('enrollAction');
            if (actionDiv && !actionDiv.querySelector('.guest-login-helper')) {
                actionDiv.innerHTML += `
                    <div class="guest-login-helper mt-3 text-center">
                        <a href="/Views/Auth/login.html?returnUrl=/Views/Course/course.html?id=${courseId}" class="text-xs text-blue-600 hover:underline font-bold flex items-center justify-center gap-1.5">
                            <i class="fa-solid fa-arrow-right-to-bracket"></i> আগে কেনা থাকলে লগইন করুন
                        </a>
                    </div>
                `;
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
                            actionDiv.innerHTML = `<div class="bg-amber-50 text-amber-700 p-4 rounded-xl flex items-center gap-3 border border-amber-100">
                                <i class="fa-solid fa-clock text-2xl"></i>
                                <div class="font-bold">${t.statusPending}</div>
                            </div>`;
                        }
                    }
                }
            } catch(e) {}
        }

        // Render Chapters (Visible for both enrolled and prospective students, Apar's Classroom style)
        let chaptersHtml = `
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
`;
        
        if (course.chapters && course.chapters.length > 0) {
            course.chapters.forEach((ch, index) => {
                  const gradients = [
                      'bg-gradient-to-r from-blue-600 to-indigo-700',
                      'bg-gradient-to-r from-slate-800 to-blue-900',
                      'bg-gradient-to-r from-indigo-600 to-purple-700'
                  ];
                  const headerBg = gradients[index % gradients.length];
                  
                  chaptersHtml += `<div class="chapter-item bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transform transition duration-200 hover:shadow-lg mb-4">`;
                  
                  chaptersHtml += `
                      <div class="${headerBg} p-5 flex justify-between items-center cursor-pointer select-none" onclick="toggleAccordion('content-${ch.id}', 'icon-${ch.id}')">
                          <div class="flex items-center gap-4 text-white">
                              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                  <i class="fa-solid fa-folder-open text-xl"></i>
                              </div>
                              <div>
                                  <div class="text-xs font-bold uppercase tracking-widest text-white/80 mb-0.5">Chapter ${index + 1}</div>
                                  <h4 class="font-bold text-lg">${ch.title}</h4>
                              </div>
                          </div>
                          <div class="flex items-center gap-4">
                              <div class="text-white/80 bg-white/10 px-3 py-1 rounded-lg text-sm font-medium hidden sm:block">
                                  ${ch.contents ? ch.contents.length : 0} Items
                              </div>
                              <div class="text-white bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300" id="icon-${ch.id}">
                                  <i class="fa-solid fa-chevron-down"></i>
                              </div>
                          </div>
                      </div>
                  `;
                  
                  chaptersHtml += `<div id="content-${ch.id}" class="hidden">`;

                  if (ch.contents && ch.contents.length > 0) {
                      const pdfs = ch.contents.filter(c => c.type !== 'Video');
                      const videos = ch.contents.filter(c => c.type === 'Video');

                      chaptersHtml += `<div class="p-6 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100">`;
                      
                      // Videos Column
                      chaptersHtml += `<div>
                          <h4 class="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                              <i class="fa-solid fa-circle-play text-blue-500"></i> Video Lectures
                          </h4>
                          <div class="flex flex-col space-y-2">
                      `;
                      if(videos.length === 0) chaptersHtml += `<div class="text-sm text-slate-400 italic p-2 bg-slate-100/50 rounded-lg text-center border border-slate-100">No video lectures available yet.</div>`;
                      videos.forEach(co => {
                          if (isEnrolled) {
                              let videoUrl = co.url || '';
                              if(videoUrl && !videoUrl.startsWith('http') && !videoUrl.startsWith('/')) {
                                  videoUrl = '/' + videoUrl;
                              }
                              const safeTitle = (co.title || '').replace(/'/g, "\\'");
                              chaptersHtml += `
                                  <div onclick="playVideoLecture('${videoUrl}', '${safeTitle}', true)" class="flex items-center justify-between py-2.5 px-3 border border-slate-200/70 bg-white hover:border-blue-300 hover:bg-blue-50/60 rounded-xl transition-all cursor-pointer shadow-sm">
                                      <div class="flex items-center gap-3 overflow-hidden">
                                          <div class="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-blue-600 bg-blue-100 transition-all">
                                              <i class="fa-solid fa-play text-sm"></i>
                                          </div>
                                          <div class="truncate">
                                              <h4 class="font-bold text-slate-800 text-sm truncate hover:text-blue-600 transition-colors">${co.title}</h4>
                                              <span class="text-xs text-blue-500 font-medium">ভিডিও লেকচার</span>
                                          </div>
                                      </div>
                                      <button class="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                                          <i class="fa-solid fa-play text-[10px]"></i> প্লে
                                      </button>
                                  </div>
                              `;
                          } else {
                              chaptersHtml += `
                                  <div onclick="openEnrollModal()" class="flex items-center justify-between py-2.5 px-3 border border-slate-200/70 bg-slate-50/70 hover:bg-amber-50/50 rounded-xl transition-all cursor-pointer shadow-sm" title="কোর্সটি কিনে আনলক করুন">
                                      <div class="flex items-center gap-3 overflow-hidden">
                                          <div class="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-slate-400 bg-slate-200/80 transition-all">
                                              <i class="fa-solid fa-lock text-sm"></i>
                                          </div>
                                          <div class="truncate">
                                              <h4 class="font-bold text-slate-700 text-sm truncate">${co.title}</h4>
                                              <span class="text-xs text-amber-600 font-semibold"><i class="fa-solid fa-lock text-[10px] mr-1"></i>লকড ক্লাস</span>
                                          </div>
                                      </div>
                                      <button onclick="event.stopPropagation(); openEnrollModal()" class="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                                          <i class="fa-solid fa-cart-shopping text-[10px]"></i> কিনুন
                                      </button>
                                  </div>
                              `;
                          }
                      });
                      chaptersHtml += `</div></div>`;

                      // PDFs Column
                      chaptersHtml += `<div>
                          <h4 class="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                              <i class="fa-solid fa-file-pdf text-red-500"></i> Study Materials
                          </h4>
                          <div class="flex flex-col space-y-2">
                      `;
                      if(pdfs.length === 0) chaptersHtml += `<div class="text-sm text-slate-400 italic p-2 bg-slate-100/50 rounded-lg text-center border border-slate-100">No study materials available yet.</div>`;
                      pdfs.forEach(co => {
                          if (isEnrolled) {
                              let pdfUrl = co.url || '';
                              if(pdfUrl && !pdfUrl.startsWith('http') && !pdfUrl.startsWith('/')) {
                                  pdfUrl = '/' + pdfUrl.replace(/^\//, '');
                              }
                              chaptersHtml += `
                                  <a href="${pdfUrl}" target="_blank" download class="flex items-center justify-between py-2.5 px-3 border border-slate-200/70 bg-white hover:border-red-300 hover:bg-red-50/60 rounded-xl transition-all cursor-pointer shadow-sm">
                                      <div class="flex items-center gap-3 overflow-hidden">
                                          <div class="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-red-500 bg-red-100 text-base">
                                              <i class="fa-solid fa-file-pdf"></i>
                                          </div>
                                          <div class="truncate">
                                              <h4 class="font-bold text-slate-800 text-sm truncate hover:text-red-600 transition-colors">${co.title}</h4>
                                              <span class="text-xs text-red-500 font-medium">পিডিএফ নোট</span>
                                          </div>
                                      </div>
                                      <span class="text-xs bg-red-50 text-red-600 border border-red-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-red-600 hover:text-white transition">
                                          <i class="fa-solid fa-download text-[10px]"></i> ডাউনলোড
                                      </span>
                                  </a>
                              `;
                          } else {
                              chaptersHtml += `
                                  <div onclick="openEnrollModal()" class="flex items-center justify-between py-2.5 px-3 border border-slate-200/70 bg-slate-50/70 hover:bg-amber-50/50 rounded-xl transition-all cursor-pointer shadow-sm" title="কোর্সটি কিনে আনলক করুন">
                                      <div class="flex items-center gap-3 overflow-hidden">
                                          <div class="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-slate-400 bg-slate-200/80 text-base">
                                              <i class="fa-solid fa-file-pdf"></i>
                                          </div>
                                          <div class="truncate">
                                              <h4 class="font-bold text-slate-700 text-sm truncate">${co.title}</h4>
                                              <span class="text-xs text-slate-400 font-medium">পিডিএফ নোট</span>
                                          </div>
                                      </div>
                                      <span class="text-xs bg-slate-200/70 text-slate-600 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                          <i class="fa-solid fa-lock text-[10px] text-amber-500"></i> লকড
                                      </span>
                                  </div>
                              `;
                          }
                      });
                      chaptersHtml += `</div></div>`;
                      chaptersHtml += `</div>`;
                  } else {
                      chaptersHtml += `
                          <div class="p-8 text-center bg-slate-50 border-t border-slate-100">
                              <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <i class="fa-solid fa-hourglass-half text-slate-400"></i>
                              </div>
                              <p class="text-slate-500 text-sm font-medium">Contents for this chapter will be uploaded soon.</p>
                          </div>
                      `;
                  }
                  chaptersHtml += `</div></div>`;
              });
        } else {
            chaptersHtml += `<div class="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm"><div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fa-solid fa-person-digging text-3xl text-blue-500"></i></div><h3 class="text-lg font-bold text-slate-800 mb-1">Curriculum Under Construction</h3><p class="text-slate-500">Chapters and videos will be published here very soon.</p></div>`;
        }
        chaptersHtml += '</div></div>';
        
        document.getElementById('overviewContent').innerHTML += chaptersHtml;
        } catch (error) {
        console.error(error);
        document.getElementById('courseHeader').innerHTML = '<h1 class="text-slate-900 text-3xl font-bold">Error loading course</h1>';
    }
}

window.onload = () => {
    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang);
    loadCourseDetails();
};

function openEnrollModal() {
    const token = localStorage.getItem('token');
    if(!token) {
        window.location.href = '/Views/Auth/login.html?returnUrl=/Views/Course/course.html?id=' + courseId;
        return;
    }
    document.getElementById('enrollModal').classList.remove('hidden');
}

const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('payBtn');
        const errorMsg = document.getElementById('paymentError');
        btn.innerText = 'Submitting...';
        btn.disabled = true;
        errorMsg.classList.add('hidden');

        const phone = document.getElementById('phoneNum').value;
        const trxId = document.getElementById('trxId').value;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/Enrollments/' + courseId, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ phone, trxId })
            });

            if (response.ok) {
                alert("Enrollment successful! Please wait for admin approval.");
                document.getElementById('enrollModal').classList.add('hidden');
                window.location.reload();
            } else {
                const data = await response.json();
                errorMsg.innerText = data.message || "Failed to enroll.";
                errorMsg.classList.remove('hidden');
            }
        } catch (err) {
            errorMsg.innerText = "Connection error.";
            errorMsg.classList.remove('hidden');
        } finally {
            btn.innerText = 'Submit Payment';
            btn.disabled = false;
        }
    });
}

function toggleAccordion(id, iconId) {
    const el = document.getElementById(id);
    const icon = document.getElementById(iconId);
    if(el && icon) {
        if(el.classList.contains('hidden')) {
            el.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            el.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

function filterChapters(query) {
    query = query.toLowerCase().trim();
    const chapters = document.querySelectorAll('.chapter-item');
    chapters.forEach(chapter => {
        const text = chapter.textContent.toLowerCase();
        if(text.includes(query)) {
            chapter.style.display = 'block';
            // Auto-expand if they type something
            if(query.length > 0) {
                const contentDiv = chapter.querySelector('div[id^="content-"]');
                const icon = chapter.querySelector('div[id^="icon-"]');
                if(contentDiv && contentDiv.classList.contains('hidden')) {
                    contentDiv.classList.remove('hidden');
                    if(icon) icon.style.transform = 'rotate(180deg)';
                }
            } else {
                // Auto-collapse if search is empty
                const contentDiv = chapter.querySelector('div[id^="content-"]');
                const icon = chapter.querySelector('div[id^="icon-"]');
                if(contentDiv && !contentDiv.classList.contains('hidden')) {
                    contentDiv.classList.add('hidden');
                    if(icon) icon.style.transform = 'rotate(0deg)';
                }
            }
        } else {
            chapter.style.display = 'none';
        }
    });
}
