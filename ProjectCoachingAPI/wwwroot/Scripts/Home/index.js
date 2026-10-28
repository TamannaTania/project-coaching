// index.js - Homepage Scripts (Courses, Teachers, Success Students, About, Free Classes)
// @ts-nocheck

const translations = {
    en: {
        navHome: "Home", navAbout: "About", navCourses: "Courses", navTeachers: "Teachers", navFreeClasses: "Free Classes", navEnroll: "Enroll Now",
        heroTitle: "Master Physics. <br>Build Strong Concepts. <br><span class='text-emerald-300'>Achieve Better Results.</span>",
        heroSub: "Concept-based Physics learning with expert guidance, regular practice, and exam-focused preparation for SSC, HSC & Admission.",
        btnExplore: "Explore Courses", btnContact: "Contact Us",
        whyTitle: "Why Choose Us?",
        f1Title: "Strong Concepts", f1Desc: "Deep understanding of core physics principles from the basics.",
        f2Title: "Easy Explanation", f2Desc: "Complex topics broken down into simple, digestible lessons.",
        f3Title: "Numerical Solving", f3Desc: "Extensive practice on mathematical problems and theories.",
        f4Title: "Regular Exams", f4Desc: "Weekly tests and evaluations to track student progress.",
        coursesTitle: "Featured Courses",
        teachersTitle: "Meet Our Teachers", teachersDesc: "Learn from the best educators in the field.",
        appTitle: "Learn Anywhere, Anytime.", appDesc: "Download the <span class='font-bold text-emerald-600 font-sans'>PhysicsClassroom</span> mobile app to watch premium video lectures, give exams, and access study materials on the go.",
        successTitle: "Our Pride: Successful Students", successDesc: "Hundreds of our students are studying in top universities.",
        freeTitle: "Free Masterclasses", freeDesc: "Watch our free physics classes to experience our teaching methodology before enrolling.",
        ctaTitle: "Ready to Make Physics Easier?", ctaDesc: "Join our upcoming batches and start your journey towards excellence.", ctaBtn: "Join Our Course Today"
    },
    bn: {
        navHome: "হোম", navAbout: "আমাদের সম্পর্কে", navCourses: "কোর্সসমূহ", navTeachers: "শিক্ষকবৃন্দ", navFreeClasses: "ফ্রি ক্লাস", navEnroll: "এনরোল করুন",
        heroTitle: "ফিজিক্স শিখুন. <br>কনসেপ্ট ক্লিয়ার করুন. <br><span class='text-emerald-300'>সেরা রেজাল্ট অর্জন করুন.</span>",
        heroSub: "SSC, HSC এবং এডমিশন প্রস্তুতি নেওয়ার সবচেয়ে কার্যকরী, সহজবোধ্য ও রিয়েল-লাইফ কনসেপ্ট ভিত্তিক ফিজিক্স একাডেমি",
        btnExplore: "কোর্সগুলো দেখুন", btnContact: "যোগাযোগ করুন",
        whyTitle: "কেনো আমাদের বেছে নিবেন",
        f1Title: "মজবুত কনসেপ্ট", f1Desc: "মুখস্থ না করে প্রতিটি টপিকের গভীরে গিয়ে শেখার সুযোগ",
        f2Title: "সহজ উপস্থাপনা", f2Desc: "কঠিন বিষয়গুলো একদম সহজ ভাষায় বুঝিয়ে বলা",
        f3Title: "ম্যাথমেটিক্যাল প্রবলেম", f3Desc: "অসংখ্য অংক ও থিওরি নিজে নিজে সল্ভ করার গাইডলাইন দেওয়া হয়",
        f4Title: "নিয়মিত পরীক্ষা", f4Desc: "স্টুডেন্টদের অবস্থা যাচাই করার জন্য নিয়মিত মূল্যায়ন পরীক্ষা নেওয়া হয়",
        coursesTitle: "আমাদের কোর্সসমূহ",
        teachersTitle: "আমাদের শিক্ষকবৃন্দ", teachersDesc: "দেশের সেরা শিক্ষকদের কাছ থেকে শিখুন",
        appTitle: "যেকোনো জায়গায়, যেকোনো সময় শিখুন", appDesc: "<span class='font-bold text-emerald-600 font-sans'>PhysicsClassroom</span> মোবাইল অ্যাপ ডাউনলোড করে যেকোনো সময় প্রিমিয়াম ভিডিও লেকচার, এক্সাম ও স্টাডি ম্যাটেরিয়ালস অ্যাক্সেস করুন।",
        successTitle: "আমাদের গর্ব: সফল ছাত্রছাত্রীরা", successDesc: "আমাদের শত শত ছাত্রছাত্রী দেশের সেরা বিশ্ববিদ্যালয়গুলোতে পড়াশোনা করছে।",
        freeTitle: "ফ্রি মাস্টারক্লাস", freeDesc: "আমাদের কোর্সে যুক্ত হওয়ার আগে আমাদের পড়ানোর স্টাইল বুঝতে ফ্রি ক্লাসগুলো দেখতে পারেন।",
        ctaTitle: "ফিজিক্সকে জয় করতে প্রস্তুত?", ctaDesc: "আমাদের নতুন ব্যাচগুলোতে জয়েন করে নিজের বেসিক শক্ত করুন এখনই।", ctaBtn: "আজই কোর্সে এনরোল হন"
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
    localStorage.removeItem('role');
    sessionStorage.clear();
    window.location.reload();
}

function updateAuthNav(lang) {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const container = document.getElementById('authNavContainer');
    if(!container) return;

    const navAdmin = document.getElementById('navAdmin');
    if (navAdmin) {
        const role = (typeof getUserRole === 'function') ? getUserRole() : localStorage.getItem('role');
        navAdmin.style.display = (role && role.toString().trim().toLowerCase() === 'admin') ? 'inline-block' : 'none';
    }
    
    if(token) {
        const logoutText = lang === 'bn' ? 'লগআউট' : 'Logout';
        const profileText = username ? username : (lang === 'bn' ? 'প্রোফাইল' : 'Profile');
        const myCoursesText = lang === 'bn' ? 'আমার কোর্সসমূহ' : 'My Courses';
        container.innerHTML = `
            <a href="/Views/Profile/profile.html" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-full text-xs md:text-sm flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition transform hover:-translate-y-0.5">
                <i class="fa-solid fa-graduation-cap"></i> <span>` + myCoursesText + `</span>
            </a>
            <a href="/Views/Profile/profile.html" class="text-slate-700 hover:text-blue-600 font-semibold transition flex items-center gap-2">
                <i class="fa-solid fa-user-circle text-2xl text-blue-600"></i> <span class="hidden md:inline">` + profileText + `</span>
            </a>
            <button onclick="logout()" class="text-red-500 hover:text-red-700 font-bold transition flex items-center gap-1.5 text-sm ml-1">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> <span class="hidden md:inline">` + logoutText + `</span>
            </button>
        `;
    } else {
        const loginText = lang === 'bn' ? 'লগইন' : 'Login';
        container.innerHTML = `<a href="/Views/Auth/login.html" class="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"><i class="fa-solid fa-user text-sm"></i> ` + loginText + `</a>`;
    }
}

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    const t = translations[lang];

    updateAuthNav(lang);
    if(document.getElementById('navHome')) document.getElementById('navHome').innerText = t.navHome;
    if(document.getElementById('navAbout')) document.getElementById('navAbout').innerText = t.navAbout;
    if(document.getElementById('navCourses')) document.getElementById('navCourses').innerText = t.navCourses;
    if(document.getElementById('navTeachers')) document.getElementById('navTeachers').innerText = t.navTeachers;
    if(document.getElementById('navFreeClasses')) document.getElementById('navFreeClasses').innerText = t.navFreeClasses;
    
    if(document.getElementById('heroTitle')) document.getElementById('heroTitle').innerHTML = t.heroTitle;
    if(document.getElementById('heroSub')) document.getElementById('heroSub').innerText = t.heroSub;
    
    if(document.getElementById('freeTitle')) document.getElementById('freeTitle').innerText = t.freeTitle;
    if(document.getElementById('freeDesc')) document.getElementById('freeDesc').innerText = t.freeDesc;

    if(document.getElementById('btnExplore')) document.getElementById('btnExplore').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ` + t.btnExplore;
    if(document.getElementById('btnContact')) document.getElementById('btnContact').innerHTML = `<i class="fa-solid fa-phone"></i> ` + t.btnContact;

    if(document.getElementById('whyTitle')) document.getElementById('whyTitle').innerText = t.whyTitle;
    if(document.getElementById('f1Title')) document.getElementById('f1Title').innerText = t.f1Title; 
    if(document.getElementById('f1Desc')) document.getElementById('f1Desc').innerText = t.f1Desc;
    if(document.getElementById('f2Title')) document.getElementById('f2Title').innerText = t.f2Title; 
    if(document.getElementById('f2Desc')) document.getElementById('f2Desc').innerText = t.f2Desc;
    if(document.getElementById('f3Title')) document.getElementById('f3Title').innerText = t.f3Title; 
    if(document.getElementById('f3Desc')) document.getElementById('f3Desc').innerText = t.f3Desc;
    if(document.getElementById('f4Title')) document.getElementById('f4Title').innerText = t.f4Title; 
    if(document.getElementById('f4Desc')) document.getElementById('f4Desc').innerText = t.f4Desc;

    if(document.getElementById('coursesTitle')) document.getElementById('coursesTitle').innerText = t.coursesTitle;
    if(document.getElementById('teachersTitle')) document.getElementById('teachersTitle').innerText = t.teachersTitle;
    if(document.getElementById('teachersDesc')) document.getElementById('teachersDesc').innerText = t.teachersDesc;

    if(document.getElementById('appTitle')) document.getElementById('appTitle').innerText = t.appTitle; 
    if(document.getElementById('appDesc')) document.getElementById('appDesc').innerHTML = t.appDesc;
    if(document.getElementById('successTitle')) document.getElementById('successTitle').innerText = t.successTitle; 
    if(document.getElementById('successDesc')) document.getElementById('successDesc').innerText = t.successDesc;
    if(document.getElementById('ctaTitle')) document.getElementById('ctaTitle').innerText = t.ctaTitle; 
    if(document.getElementById('ctaDesc')) document.getElementById('ctaDesc').innerText = t.ctaDesc; 
    if(document.getElementById('ctaBtn')) document.getElementById('ctaBtn').innerHTML = t.ctaBtn;

    if (lang === 'bn') {
        if(document.getElementById('btnBn')) document.getElementById('btnBn').className = 'px-3 py-1 text-sm font-bold bg-blue-600 text-white';
        if(document.getElementById('btnEn')) document.getElementById('btnEn').className = 'px-3 py-1 text-sm font-bold text-blue-700 hover:bg-blue-100 transition';
    } else {
        if(document.getElementById('btnEn')) document.getElementById('btnEn').className = 'px-3 py-1 text-sm font-bold bg-blue-600 text-white';
        if(document.getElementById('btnBn')) document.getElementById('btnBn').className = 'px-3 py-1 text-sm font-bold text-blue-700 hover:bg-blue-100 transition';
    }
}

async function loadCourses() {
    try {
        const token = localStorage.getItem('token');
        let enrolledCourseIds = new Set();
        
        const guestBanner = document.getElementById('guestLoginBanner');

        if (token) {
            if (guestBanner) guestBanner.style.display = 'none';
            try {
                let myRes = await fetch('/api/Enrollments/mycourses', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (!myRes.ok) {
                    myRes = await fetch('/api/Enrollments/my-enrollments', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                }
                if (myRes.ok) {
                    const myCourses = await myRes.json();
                    myCourses.forEach(c => {
                        if (c.status === 'Approved') {
                            const cId = c.courseId || c.course?.id;
                            if (cId) enrolledCourseIds.add(cId);
                        }
                    });
                }
            } catch(e) {}
        } else {
            if (guestBanner) guestBanner.style.display = 'block';
        }

        const response = await fetch('/api/Courses');
        const courses = await response.json();
        
        const grid = document.getElementById('coursesGrid');
        if (!grid) return;
        grid.innerHTML = '';

        courses.forEach(course => {
            let imgUrl = course.imageUrl || 'https://via.placeholder.com/400x200?text=Physics+Course';
            if(!imgUrl.startsWith('http')) {
                imgUrl = '/' + imgUrl.replace(/^\//, '');
            }

            const isEnrolled = enrolledCourseIds.has(course.id);
            
            const badgeHtml = isEnrolled 
                ? `<span class="absolute top-3 left-3 bg-emerald-600/95 backdrop-blur-sm text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-10 border border-emerald-400/30"><i class="fa-solid fa-circle-check"></i> কেনা হয়েছে (Active)</span>`
                : '';
                
            const priceHtml = isEnrolled
                ? `<span class="text-base sm:text-lg font-extrabold text-emerald-600 flex items-center gap-1.5 whitespace-nowrap"><i class="fa-solid fa-lock-open text-sm"></i> আনলকড</span>`
                : `<span class="text-2xl sm:text-3xl font-black text-blue-900 group-hover:scale-105 ease-out transition-transform origin-left whitespace-nowrap">৳${course.price}</span>`;

            const btnHtml = isEnrolled
                ? `<button class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                        ▶ সরাসরি ক্লাস শুরু করুন <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                   </button>`
                : `<button class="bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md whitespace-nowrap">
                        View Details <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                   </button>`;

            const card = `
                <div class="group course-card-shine bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border ${isEnrolled ? 'border-2 border-emerald-500/50 ring-4 ring-emerald-500/10' : 'border-slate-200/80'} flex flex-col h-full cursor-pointer" onclick="window.location.href='/Views/Course/course.html?id=${course.id}'">
                    <div class="relative overflow-hidden w-full h-44 sm:h-48 bg-slate-900">
                        <img src="${imgUrl}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out">
                        ${badgeHtml}
                        <div class="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>
                    <div class="p-5 sm:p-6 flex flex-col flex-grow">
                        <div class="flex items-start justify-between gap-3 mb-2">
                            <h3 class="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">${course.title}</h3>
                            ${isEnrolled ? '<span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300 flex-shrink-0">Active</span>' : ''}
                        </div>
                        <p class="text-slate-600 mb-4 line-clamp-2 text-sm leading-relaxed flex-grow">${course.description || ''}</p>
                        <div class="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-auto">
                            <div class="flex items-center flex-shrink-0">
                                ${priceHtml}
                            </div>
                            <div class="flex-shrink-0">
                                ${btnHtml}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            grid.innerHTML += card;
        });
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}

async function loadTeachers() {
    try {
        const response = await fetch('/api/Teachers');
        if(response.ok) {
            const teachers = await response.json();
            const grid = document.getElementById('teachersGrid');
            if(!grid) return;
            grid.innerHTML = '';
            
            if(teachers.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center text-slate-500 bg-slate-50 py-10 rounded-2xl border border-slate-100">No teachers found.</div>';
                return;
            }

            teachers.forEach(t => {
                const imgUrl = t.imageUrl || 'https://via.placeholder.com/300';
                grid.innerHTML += `
                    <div class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full cursor-pointer">
                        <div class="h-48 overflow-hidden relative">
                            <img src="${imgUrl}" alt="${t.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-center gap-3">
                                ${t.facebookUrl ? `<a href="${t.facebookUrl}" target="_blank" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-blue-500 transition"><i class="fa-brands fa-facebook-f"></i></a>` : ''}
                                ${t.linkedInUrl ? `<a href="${t.linkedInUrl}" target="_blank" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-blue-700 transition"><i class="fa-brands fa-linkedin-in"></i></a>` : ''}
                            </div>
                        </div>
                        <div class="p-6 text-center">
                            <h3 class="font-bold text-xl text-slate-800 mb-1">${t.name}</h3>
                            ${t.designation ? `<p class="text-purple-600 font-medium text-sm mb-1">${t.designation}</p>` : ''}
                            ${t.subject ? `<p class="text-slate-500 text-sm font-semibold">${t.subject}</p>` : ''}
                            ${t.bio ? `<p class="text-slate-600 text-sm mt-3 line-clamp-3">${t.bio}</p>` : ''}
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Error loading teachers", error);
    }
}

async function loadSuccessStudents() {
    try {
        const res = await fetch('/api/SuccessStudents');
        if (res.ok) {
            const data = await res.json();
            const container = document.getElementById('successGrid');
            if(!container) return;
            
            if (data.length === 0) {
                container.innerHTML = '<div class="w-full text-center text-slate-400">No students found.</div>';
                return;
            }
            
            container.innerHTML = '';
            data.forEach((s, idx) => {
                const borderColors = ['border-emerald-100', 'border-blue-100', 'border-purple-100', 'border-yellow-100', 'border-pink-100'];
                const bColor = borderColors[idx % borderColors.length];
                
                container.innerHTML += `
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 w-72 flex-shrink-0 flex flex-col items-center snap-center hover:shadow-lg transition transform hover:-translate-y-1">
                    <img src="${s.imageUrl}" class="w-24 h-24 rounded-full mb-4 border-4 ${bColor} object-cover bg-slate-50" alt="${s.name}">
                    <h3 class="text-xl font-bold text-slate-900">${s.name}</h3>
                    <p class="text-emerald-600 font-bold mb-2">${s.institution}</p>
                    <div class="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">${s.batch}</div>
                </div>
                `;
            });
            // Duplicate for seamless infinite marquee scrolling
            container.innerHTML += container.innerHTML;
        }
    } catch(e) {}
}

async function loadAbout() {
    try {
        const res = await fetch('/api/About');
        if(res.ok) {
            const data = await res.json();
            if(document.getElementById('aboutTitle')) document.getElementById('aboutTitle').innerText = data.title;
            if(document.getElementById('aboutDesc')) document.getElementById('aboutDesc').innerText = data.description;
            if(document.getElementById('aboutImg')) document.getElementById('aboutImg').src = data.imageUrl;
        }
    } catch(e) {}
}

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
            html += `
            <a href="${fc.videoUrl}" target="_blank" class="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition duration-300 group cursor-pointer block">
                <div class="relative h-48 bg-slate-200">
                    <img src="${fc.thumbnailUrl}" class="w-full h-full object-cover" alt="Class Thumbnail">
                    <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                        <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-red-600 text-2xl shadow-lg transform group-hover:scale-110 transition">
                            <i class="fa-solid fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">${fc.category}</div>
                    <h3 class="text-lg font-bold text-slate-800 mb-2">${fc.title}</h3>
                    <p class="text-slate-500 text-sm">${fc.description}</p>
                </div>
            </a>`;
        });
        container.innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

window.onload = () => {
    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang);
    loadCourses();

    const gSearch = document.getElementById('globalSearch');
    if (gSearch) {
        gSearch.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            const courses = document.querySelectorAll('#coursesGrid > div');
            let found = false;
            
            courses.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const desc = card.querySelector('p').innerText.toLowerCase();
                if(title.includes(term) || desc.includes(term)) {
                    card.style.display = 'flex';
                    found = true;
                } else {
                    card.style.display = 'none';
                }
            });

            if(term.length > 0 && e.inputType !== 'deleteContentBackward') {
                const cEl = document.getElementById('courses');
                if (cEl) cEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    loadTeachers();
    loadSuccessStudents();
    loadAbout();
    loadFreeClasses();
};
