// app.js - Mobile App View Logic
// @ts-nocheck

const token = localStorage.getItem('token');
sessionStorage.setItem('isApp', 'true');

let allCourses = [];
let allFreeClasses = [];
let myEnrollments = [];

// 1. Initial Auth & User Load
async function initApp() {
    if (!token) {
        window.location.href = '/Views/Auth/login.html?app=true';
        return;
    }

    loadUserProfile();
    loadHomeCourses();
    loadHomeFreeClasses();
    loadMyCourses();
}

// 2. Load User Profile
async function loadUserProfile() {
    try {
        const res = await fetch('/api/Auth/profile', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
            const data = await res.json();
            const name = data.name || data.fullName || 'শিক্ষার্থী';
            const email = data.email || '';
            const role = data.role || 'Student';

            if (email) localStorage.setItem('email', email);
            if (name) localStorage.setItem('username', name);

            if (document.getElementById('appTopGreeting')) {
                document.getElementById('appTopGreeting').innerText = 'হ্যালো, ' + name.split(' ')[0] + '! 👋';
            }
            if (document.getElementById('profileCardName')) {
                document.getElementById('profileCardName').innerText = name;
            }
            if (document.getElementById('profileCardEmail')) {
                document.getElementById('profileCardEmail').innerText = email;
            }
            if (document.getElementById('profileUserRole')) {
                document.getElementById('profileUserRole').innerText = role;
            }

            const avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=2563eb&color=fff';
            if (document.getElementById('appTopAvatar')) {
                document.getElementById('appTopAvatar').src = avatarUrl;
            }
            if (document.getElementById('profileCardImg')) {
                document.getElementById('profileCardImg').src = avatarUrl;
            }
        }
    } catch (err) {
        console.error("Profile load err:", err);
    }
}

// 3. Tab Switching Logic
function switchTab(tabId) {
    document.querySelectorAll('.tab-view').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.nav-tab').forEach(b => {
        b.classList.remove('active-tab');
        b.classList.add('text-slate-400');
    });

    if (tabId === 'tab-home') {
        const vHome = document.getElementById('view-home');
        if (vHome) vHome.classList.remove('hidden');
        const btn = document.getElementById('btn-tab-home');
        if (btn) {
            btn.classList.add('active-tab');
            btn.classList.remove('text-slate-400');
        }
    } else if (tabId === 'tab-my-courses') {
        const vMyCourses = document.getElementById('view-my-courses');
        if (vMyCourses) vMyCourses.classList.remove('hidden');
        const btn = document.getElementById('btn-tab-my-courses');
        if (btn) {
            btn.classList.add('active-tab');
            btn.classList.remove('text-slate-400');
        }
        loadMyCourses();
    } else if (tabId === 'tab-free') {
        const vFree = document.getElementById('view-free');
        if (vFree) vFree.classList.remove('hidden');
        const btn = document.getElementById('btn-tab-free');
        if (btn) {
            btn.classList.add('active-tab');
            btn.classList.remove('text-slate-400');
        }
        loadAllFreeClasses();
    } else if (tabId === 'tab-profile') {
        const vProfile = document.getElementById('view-profile');
        if (vProfile) vProfile.classList.remove('hidden');
        const btn = document.getElementById('btn-tab-profile');
        if (btn) {
            btn.classList.add('active-tab');
            btn.classList.remove('text-slate-400');
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. Load Courses for Home Tab
async function loadHomeCourses() {
    try {
        const res = await fetch('/api/Courses');
        allCourses = await res.json();
        if (document.getElementById('courseCountBadge')) {
            document.getElementById('courseCountBadge').innerText = allCourses.length + ' কোর্স';
        }
        renderCourses(allCourses);
    } catch (err) {
        const hGrid = document.getElementById('homeCoursesGrid');
        if (hGrid) hGrid.innerHTML = '<div class="text-xs text-red-500 text-center py-4">কোর্স লোড করা যায়নি।</div>';
    }
}

function renderCourses(courses) {
    const container = document.getElementById('homeCoursesGrid');
    if (!container) return;
    if (courses.length === 0) {
        container.innerHTML = '<div class="text-xs text-slate-400 text-center py-6">কোনো কোর্স পাওয়া যায়নি।</div>';
        return;
    }

    container.innerHTML = '';
    courses.forEach(c => {
        let img = c.imageUrl || 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=400';
        if (!img.startsWith('http') && !img.startsWith('/')) img = '/' + img;
        container.innerHTML += `
        <div onclick="window.location.href='/Views/Course/course.html?id=${c.id}&app=true'" class="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm hover:shadow-md transition active:scale-[0.99] cursor-pointer flex gap-3">
            <img src="${img}" class="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-slate-100" alt="${c.title}">
            <div class="flex flex-col justify-between flex-1 py-0.5">
                <div>
                    <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">Physics</span>
                    <h4 class="font-extrabold text-sm text-slate-800 line-clamp-1 leading-snug">${c.title}</h4>
                    <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">${c.description || 'সম্পূর্ণ কোর্স কনসেপ্ট ক্লিয়ারিং ক্লাস।'}</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
                    <span class="text-sm font-black text-slate-900">৳${c.price}</span>
                    <span class="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <span>বিস্তারিত</span>
                        <i class="fa-solid fa-angle-right text-[10px]"></i>
                    </span>
                </div>
            </div>
        </div>
        `;
    });
}

// Live Search in Home
const searchInput = document.getElementById('appSearchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = allCourses.filter(c => c.title.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)));
        renderCourses(filtered);
    });
}

// 5. Load Free Classes Row (Home)
async function loadHomeFreeClasses() {
    try {
        const res = await fetch('/api/FreeClasses');
        allFreeClasses = await res.json();
        const container = document.getElementById('homeFreeClassesRow');
        if (!container) return;
        
        if (allFreeClasses.length === 0) {
            container.innerHTML = '<div class="text-xs text-slate-400 py-2">কোনো ফ্রি ক্লাস নেই।</div>';
            return;
        }

        container.innerHTML = '';
        allFreeClasses.slice(0, 5).forEach(fc => {
            const thumb = fc.thumbnailUrl || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=300';
            container.innerHTML += `
            <div onclick="playVideo('${encodeURIComponent(fc.videoUrl)}', '${encodeURIComponent(fc.title)}')" class="flex-shrink-0 w-44 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm active:scale-[0.98] transition cursor-pointer">
                <div class="relative h-24 bg-slate-900">
                    <img src="${thumb}" class="w-full h-full object-cover opacity-80" alt="Thumb">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg text-xs">
                            <i class="fa-solid fa-play ml-0.5"></i>
                        </div>
                    </div>
                </div>
                <div class="p-2.5">
                    <h4 class="text-xs font-bold text-slate-800 line-clamp-1">${fc.title}</h4>
                    <span class="text-[10px] text-emerald-600 font-semibold block mt-0.5">ফ্রি ক্লাস</span>
                </div>
            </div>
            `;
        });
    } catch (e) {
        console.error("Free classes load err:", e);
    }
}

// 6. Load All Free Classes (Tab 3)
async function loadAllFreeClasses() {
    const container = document.getElementById('allFreeClassesList');
    if (!container) return;
    if (allFreeClasses.length === 0) {
        container.innerHTML = '<div class="text-xs text-slate-400 text-center py-10">কোনো ফ্রি ক্লাস পাওয়া যায়নি।</div>';
        return;
    }

    container.innerHTML = '';
    allFreeClasses.forEach(fc => {
        const thumb = fc.thumbnailUrl || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=300';
        container.innerHTML += `
        <div onclick="playVideo('${encodeURIComponent(fc.videoUrl)}', '${encodeURIComponent(fc.title)}')" class="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex gap-3 cursor-pointer active:scale-[0.99] transition">
            <div class="relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
                <img src="${thumb}" class="w-full h-full object-cover opacity-80" alt="Thumb">
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shadow">
                        <i class="fa-solid fa-play ml-0.5"></i>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-between flex-1 py-0.5">
                <div>
                    <span class="text-[10px] font-bold text-red-500 uppercase tracking-wide">YouTube Masterclass</span>
                    <h4 class="font-extrabold text-xs text-slate-800 line-clamp-2 mt-0.5">${fc.title}</h4>
                </div>
                <span class="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <span>প্লে করুন</span>
                    <i class="fa-solid fa-circle-play text-[10px]"></i>
                </span>
            </div>
        </div>
        `;
    });
}

// 7. Load My Enrolled Courses (Tab 2)
async function loadMyCourses() {
    const container = document.getElementById('myCoursesList');
    if (!container) return;
    try {
        let res = await fetch('/api/Enrollments/mycourses', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) {
            res = await fetch('/api/Enrollments/my-enrollments', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
        }
        if (res.ok) {
            myEnrollments = await res.json();
            if (document.getElementById('profileEnrolledCount')) {
                document.getElementById('profileEnrolledCount').innerText = myEnrollments.length;
            }

            if (myEnrollments.length === 0) {
                container.innerHTML = `
                <div class="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
                    <div class="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <h3 class="font-extrabold text-sm text-slate-800">কোনো কোর্সে এনরোল করা হয়নি</h3>
                    <p class="text-xs text-slate-400 max-w-xs mx-auto">এখনো কোনো কোর্সে জয়েন করেননি। এক্সপ্লোর করুন এবং আপনার পছন্দের কোর্সে এনরোল করুন।</p>
                    <button onclick="switchTab('tab-home')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm">
                        কোর্সগুলো দেখুন
                    </button>
                </div>
                `;
                return;
            }

            container.innerHTML = '';
            myEnrollments.forEach(en => {
                const courseTitle = en.title || en.course?.title || 'Physics Course';
                const courseImg = en.imageUrl || en.course?.imageUrl || 'https://via.placeholder.com/300x160?text=Physics';
                const cId = en.courseId || en.course?.id;
                const trx = en.transactionId || en.trxId || 'N/A';
                const isApproved = en.status === 'Approved';
                const statusBadge = isApproved 
                    ? '<span class="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1"><i class="fa-solid fa-circle-check"></i> Approved</span>'
                    : '<span class="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1"><i class="fa-solid fa-clock"></i> Pending Approval</span>';

                const actionBtn = isApproved 
                    ? `<button onclick="window.location.href='/Views/Course/course.html?id=${cId}&app=true'" class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2">
                         <i class="fa-solid fa-circle-play text-sm"></i> <span>ভিডিও ক্লাস ও নোট দেখুন</span>
                       </button>`
                    : `<div class="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                         পেমেন্ট ভেরিফাই করা হচ্ছে। কিছুক্ষণের মধ্যে এক্সেস পেয়ে যাবেন।
                       </div>`;

                let fullImg = courseImg;
                if (!fullImg.startsWith('http') && !fullImg.startsWith('/')) fullImg = '/' + fullImg;

                container.innerHTML += `
                <div class="bg-white rounded-2xl border-2 border-blue-100 p-4 shadow-sm hover:shadow-md transition space-y-3">
                    <div class="flex items-center justify-between">
                        ${statusBadge}
                        <span class="text-[10px] text-slate-400 font-semibold">Trx: ${trx}</span>
                    </div>
                    <div class="flex gap-3 items-center">
                        <img src="${fullImg}" class="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0" alt="${courseTitle}">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-extrabold text-sm text-slate-800 leading-snug truncate">${courseTitle}</h4>
                            <p class="text-[11px] text-slate-500 mt-0.5">অধ্যায়ভিত্তিক ভিডিও ও পিডিএফ নোট</p>
                        </div>
                    </div>
                    ${actionBtn}
                </div>
                `;
            });
        }
    } catch (err) {
        container.innerHTML = '<div class="text-xs text-red-500 text-center py-4">এনরোলমেন্ট হিস্ট্রি লোড করা যায়নি।</div>';
    }
}

// 8. Video Player Modal
function playVideo(rawUrl, rawTitle) {
    const url = decodeURIComponent(rawUrl);
    const title = decodeURIComponent(rawTitle);
    
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
        embedUrl = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
        embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
    }

    if (document.getElementById('videoModalTitle')) {
        document.getElementById('videoModalTitle').innerText = title;
    }
    if (document.getElementById('videoModalIframe')) {
        document.getElementById('videoModalIframe').src = embedUrl;
    }
    const vm = document.getElementById('videoModal');
    if (vm) vm.classList.remove('hidden');
}

function closeVideoModal() {
    const vm = document.getElementById('videoModal');
    if (vm) vm.classList.add('hidden');
    const iframe = document.getElementById('videoModalIframe');
    if (iframe) iframe.src = '';
}

// 9. Logout
async function handleLogout() {
    if (!confirm('আপনি কি নিশ্চিত যে লগআউট করতে চান?')) return;
    try {
        await fetch('/api/Auth/logout', {
            method: 'POST',
            headers: { 
                'Authorization': token ? 'Bearer ' + token : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: localStorage.getItem('email'),
                deviceId: localStorage.getItem('deviceId')
            })
        });
    } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isApp');
    window.location.href = '/Views/Auth/login.html';
}

// Start App
initApp();
