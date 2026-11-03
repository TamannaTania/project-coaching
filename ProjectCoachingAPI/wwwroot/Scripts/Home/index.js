// index.js - Homepage Scripts (Courses, Teachers, Success Students, About, Free Classes)
// @ts-nocheck

const translations = {
    en: {
        navHome: 'Home',
        navAbout: 'About',
        navCourses: 'Courses',
        navTeachers: 'Teachers',
        navFreeClasses: 'Free Classes',
        navEnroll: 'Enroll Now',
        navAdmin: 'Admin',
        searchPlaceholder: 'Search courses...',
        login: 'Login',
        logout: 'Logout',
        myCourses: 'My Courses',
        profile: 'Profile',
        heroTitle: "Master Physics. <br>Build Strong Concepts. <br><span class='text-emerald-300'>Achieve Better Results.</span>",
        heroSub: 'Concept-based Physics learning with expert guidance, regular practice, and exam-focused preparation for SSC, HSC & Admission.',
        btnExplore: 'Explore Courses',
        btnContact: 'Contact Us',
        guestBannerTitle: 'Already enrolled in a course?',
        guestBannerDesc: 'Log in to your account to access your enrolled courses, video lectures, and PDF materials.',
        guestBannerBtn: 'Log In Now',
        tabBatchAll: 'All Courses',
        tabBatchAdmission: 'Admission',
        whyTitle: 'Why Choose Us?',
        f1Title: 'Strong Concepts',
        f1Desc: 'Deep understanding of core physics principles from the basics without memorizing.',
        f2Title: 'Easy Explanation',
        f2Desc: 'Complex topics broken down into simple, digestible lessons with real-world examples.',
        f3Title: 'Numerical Solving',
        f3Desc: 'Extensive step-by-step practice on mathematical problems and past exam questions.',
        f4Title: 'Regular Exams',
        f4Desc: 'Weekly model tests and evaluations to rigorously monitor student progress.',
        coursesTitle: 'Our Courses',
        badgeEnrolled: 'Active',
        priceUnlocked: 'Unlocked',
        btnStartClass: 'Start Class ▶',
        btnViewDetails: 'View Details ▶',
        emptyBatchTitle: 'courses coming soon!',
        emptyBatchDesc: 'We are preparing top-tier curriculum and live classes for this batch. New courses will be available here soon.',
        viewAllBtn: 'View All Courses',
        noSearchResultsTitle: 'No courses found matching',
        noSearchResultsDesc: 'Try searching with a different keyword, course title, or batch name.',
        resetSearchBtn: 'Reset Search',
        teachersTitle: 'Meet Our Teachers',
        teachersDesc: 'Learn from the best educators in the field.',
        freeTitle: 'Free Masterclasses',
        freeDesc: 'Watch our free physics classes to experience our teaching methodology before enrolling.',
        watchClassBtn: 'Watch Class ▶',
        aboutTitle: 'About PhysicsClassroom',
        appTitle: 'Learn Anywhere, Anytime.',
        appDesc: "Download the <span class='font-bold text-emerald-600 font-sans'>PhysicsClassroom</span> mobile app to watch premium video lectures, take exams, and access study materials on the go.",
        successTitle: 'Our Pride: Successful Students',
        successDesc: 'Hundreds of our students are studying in top universities across the country.',
        ctaTitle: 'Ready to Make Physics Easier?',
        ctaDesc: 'Join our upcoming batches and start your journey towards excellence.',
        ctaBtn: 'Join Our Course Today',
                contactModalTitle: 'Contact Us',
        contactModalSubtitle: 'We are here to help you anytime',
        contactHelplineLabel: 'Helpline Call',
        contactHelplineHours: '10 AM - 10 PM',
        contactHelplineSub: 'Call directly for admission or course inquiries',
        contactFbLabel: 'Facebook Page',
        contactFbActive: 'Fast Reply',
        contactFbSub: 'Message us on Facebook for instant assistance',
        contactEmailLabel: 'Official Email',
        contactEmailSub: 'Email us for official or technical queries',
        contactModalFooterNote: 'Safe & Trusted Education Platform',
        contactModalCloseBtn: 'Close',
        footerRights: '© 2026 PhysicsClassroom. All rights reserved.'
    },
    bn: {
        navHome: 'হোম',
        navAbout: 'আমাদের সম্পর্কে',
        navCourses: 'কোর্সসমূহ',
        navTeachers: 'শিক্ষকবৃন্দ',
        navFreeClasses: 'ফ্রি ক্লাস',
        navEnroll: 'এনরোল করুন',
        navAdmin: 'অ্যাডমিন',
        searchPlaceholder: 'কোর্স অনুসন্ধান করুন...',
        login: 'লগইন',
        logout: 'লগআউট',
        myCourses: 'আমার কোর্সসমূহ',
        profile: 'প্রোফাইল',
        heroTitle: "ফিজিক্স শিখুন. <br>কনসেপ্ট ক্লিয়ার করুন. <br><span class='text-emerald-300'>সেরা রেজাল্ট অর্জন করুন.</span>",
        heroSub: 'SSC, HSC এবং এডমিশন প্রস্তুতি নেওয়ার সবচেয়ে কার্যকরী, সহজবোধ্য ও রিয়েল-লাইফ কনসেপ্ট ভিত্তিক ফিজিক্স একাডেমি',
        btnExplore: 'কোর্সগুলো দেখুন',
        btnContact: 'যোগাযোগ করুন',
        guestBannerTitle: 'আপনি কি অলরেডি কোর্স কিনেছেন?',
        guestBannerDesc: 'আপনার কেনা পেইড কোর্স, ভিডিও ক্লাস ও পিডিএফ দেখতে অ্যাকাউন্টে লগইন করুন।',
        guestBannerBtn: 'লগইন করুন',
        tabBatchAll: 'সকল কোর্স',
        tabBatchAdmission: 'এডমিশন',
        whyTitle: 'কেনো আমাদের বেছে নিবেন',
        f1Title: 'মজবুত কনসেপ্ট',
        f1Desc: 'মুখস্থ না করে প্রতিটি টপিকের গভীরে গিয়ে শেখার সুযোগ',
        f2Title: 'সহজ উপস্থাপনা',
        f2Desc: 'কঠিন বিষয়গুলো একদম সহজ ভাষায় বুঝিয়ে বলা',
        f3Title: 'ম্যাথমেটিক্যাল প্রবলেম',
        f3Desc: 'অসংখ্য অংক ও থিওরি নিজে নিজে সল্ভ করার গাইডলাইন দেওয়া হয়',
        f4Title: 'নিয়মিত পরীক্ষা',
        f4Desc: 'স্টুডেন্টদের অবস্থা যাচাই করার জন্য নিয়মিত মূল্যায়ন পরীক্ষা নেওয়া হয়',
        coursesTitle: 'আমাদের কোর্সসমূহ',
        badgeEnrolled: 'কেনা হয়েছে (Active)',
        priceUnlocked: 'আনলকড',
        btnStartClass: 'সরাসরি ক্লাস শুরু করুন ▶',
        btnViewDetails: 'বিস্তারিত দেখুন ▶',
        emptyBatchTitle: 'ব্যাচের নতুন কোর্স শীঘ্রই আসছে!',
        emptyBatchDesc: 'আমরা এই ব্যাচের জন্য সেরা পাঠ্যক্রম ও লাইভ ক্লাস তৈরি করছি। নতুন কোর্স আসা মাত্রই এখানে দেখতে পাবেন।',
        viewAllBtn: 'সকল কোর্স দেখুন',
        noSearchResultsTitle: 'এর সাথে মিলে এমন কোনো কোর্স পাওয়া যায়নি',
        noSearchResultsDesc: 'ভিন্ন কোনো কি-ওয়ার্ড, বিষয়ের নাম অথবা ব্যাচ লিখে অনুসন্ধান করুন।',
        resetSearchBtn: 'সার্চ রিসেট করুন',
        teachersTitle: 'আমাদের শিক্ষকবৃন্দ',
        teachersDesc: 'দেশের সেরা শিক্ষকদের কাছ থেকে শিখুন',
        freeTitle: 'ফ্রি মাস্টারক্লাস',
        freeDesc: 'আমাদের কোর্সে যুক্ত হওয়ার আগে আমাদের পড়ানোর স্টাইল বুঝতে ফ্রি ক্লাসগুলো দেখতে পারেন।',
        watchClassBtn: 'ক্লাসটি দেখুন ▶',
        aboutTitle: 'PhysicsClassroom সম্পর্কে',
        appTitle: 'যেকোনো জায়গায়, যেকোনো সময় শিখুন',
        appDesc: "<span class='font-bold text-emerald-600 font-sans'>PhysicsClassroom</span> মোবাইল অ্যাপ ডাউনলোড করে যেকোনো সময় প্রিমিয়াম ভিডিও লেকচার, এক্সাম ও স্টাডি ম্যাটেরিয়ালস অ্যাক্সেস করুন।",
        successTitle: 'আমাদের গর্ব: সফল ছাত্রছাত্রীরা',
        successDesc: 'আমাদের শত শত ছাত্রছাত্রী দেশের সেরা বিশ্ববিদ্যালয়গুলোতে পড়াশোনা করছে।',
        ctaTitle: 'ফিজিক্সকে জয় করতে প্রস্তুত?',
        ctaDesc: 'আমাদের নতুন ব্যাচগুলোতে জয়েন করে নিজের বেসিক শক্ত করুন এখনই।',
        ctaBtn: 'আজই কোর্সে এনরোল হন',
                contactModalTitle: 'যোগাযোগ করুন',
        contactModalSubtitle: 'আমরা আপনার সহায়তায় ২৪/৭ নিয়োজিত',
        contactHelplineLabel: 'হেল্পলাইন কল',
        contactHelplineHours: '১০ AM - ১০ PM',
        contactHelplineSub: 'ভর্তি বা যেকোনো তথ্যে সরাসরি কল করুন',
        contactFbLabel: 'ফেসবুক পেজ',
        contactFbActive: 'দ্রুত রিপ্লাই',
        contactFbSub: 'ইনবক্সে মেসেজ পাঠিয়ে দ্রুত সমাধান নিন',
        contactEmailLabel: 'অফিশিয়াল ইমেইল',
        contactEmailSub: 'পেমেন্ট বা অফিশিয়াল প্রয়োজনে মেইল করুন',
        contactModalFooterNote: 'নিরাপদ ও নির্ভরযোগ্য শিক্ষা সেবা',
        contactModalCloseBtn: 'বন্ধ করুন',
        footerRights: '© ২০২৬ PhysicsClassroom. সর্বস্বত্ব সংরক্ষিত।'
    }
};

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

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
    localStorage.removeItem('fullName');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    sessionStorage.clear();
    document.cookie = "pc_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.reload();
}
window.logout = logout;

function updateAuthNav(lang) {
    const t = translations[lang] || translations.en;
    const token = localStorage.getItem('token');
    let username = localStorage.getItem('fullName') || localStorage.getItem('name') || localStorage.getItem('username');
    const userJson = localStorage.getItem('user');
    if (userJson) {
        try {
            const u = JSON.parse(userJson);
            if (u.fullName || u.name) username = u.fullName || u.name;
        } catch(e) {}
    }
    const container = document.getElementById('authNavContainer');
    const mobileContainer = document.getElementById('mobileAuthNavContainer');

    const navAdmin = document.getElementById('navAdmin');
    const navAdminMobile = document.getElementById('navAdminMobileBtn');
    const role = (typeof getUserRole === 'function') ? getUserRole() : localStorage.getItem('role');
    const isAdmin = (role && role.toString().trim().toLowerCase() === 'admin');
    
    if (navAdmin) navAdmin.style.display = isAdmin ? 'inline-block' : 'none';
    if (navAdminMobile) navAdminMobile.style.display = isAdmin ? 'inline-flex' : 'none';
    const mNavAdmin = document.getElementById('mNavAdmin');
    if (mNavAdmin) mNavAdmin.style.display = isAdmin ? 'flex' : 'none';
    
    if (mobileContainer) {
        if (token) {
            mobileContainer.innerHTML = `
                <a href="/Views/Profile/profile.html" class="px-2 sm:px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-800 font-bold text-xs flex items-center gap-1 rounded-full border border-slate-200 flex-shrink-0" title="${escapeHtml(username || 'Profile')}">
                    <i class="fa-solid fa-user-circle text-base text-blue-600"></i> <span class="max-w-[50px] sm:max-w-[85px] truncate">${escapeHtml(username || 'User')}</span>
                </a>
                <button onclick="logout()" class="p-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-200 hover:bg-red-100 flex-shrink-0 ml-0.5" title="${t.logout}">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
            `;
        } else {
            mobileContainer.innerHTML = `<a href="/Views/Auth/login.html" class="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-blue-700 transition">${t.login}</a>`;
        }
    }
    if (!container) return;
    
    if(token) {
        const profileText = username ? username : t.profile;
        container.innerHTML = `
            <a href="/Views/Profile/profile.html" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-full text-xs md:text-sm flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition transform hover:-translate-y-0.5">
                <i class="fa-solid fa-graduation-cap"></i> <span>${t.myCourses}</span>
            </a>
            <a href="/Views/Profile/profile.html" class="bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold px-4 py-2 rounded-full text-sm md:text-base flex items-center gap-2 border border-slate-200 transition shadow-sm hover:shadow">
                <i class="fa-solid fa-user-circle text-2xl text-blue-600"></i> <span class="inline-block max-w-[120px] truncate">${escapeHtml(profileText)}</span>
            </a>
            <button onclick="logout()" class="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold px-4 py-2 rounded-full text-sm md:text-base transition flex items-center gap-2 shadow-sm border border-red-200 ml-1 hover:shadow">
                <i class="fa-solid fa-arrow-right-from-bracket text-base"></i> <span class="hidden sm:inline">${t.logout}</span>
            </button>
        `;
    } else {
        container.innerHTML = `<a href="/Views/Auth/login.html" class="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"><i class="fa-solid fa-user text-sm"></i> ${t.login}</a>`;
    }
}

function setLanguage(lang) {
    if (!lang || !translations[lang]) lang = 'bn';
    localStorage.setItem('lang', lang);
    const t = translations[lang];

    updateAuthNav(lang);
    if(document.getElementById('navHome')) document.getElementById('navHome').innerText = t.navHome;
    if(document.getElementById('navAbout')) document.getElementById('navAbout').innerText = t.navAbout;
    if(document.getElementById('navCourses')) document.getElementById('navCourses').innerText = t.navCourses;
    if(document.getElementById('navTeachers')) document.getElementById('navTeachers').innerText = t.navTeachers;
    if(document.getElementById('navFreeClasses')) document.getElementById('navFreeClasses').innerText = t.navFreeClasses;
    if(document.getElementById('navAdmin')) document.getElementById('navAdmin').innerText = t.navAdmin;

    // Mobile nav links
    if(document.getElementById('mNavHome')) document.getElementById('mNavHome').innerText = t.navHome;
    if(document.getElementById('mNavAdminText')) document.getElementById('mNavAdminText').innerText = (lang === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Dashboard');
    if(document.getElementById('mNavCourses')) document.getElementById('mNavCourses').innerText = t.navCourses;
    if(document.getElementById('mNavTeachers')) document.getElementById('mNavTeachers').innerText = t.navTeachers;
    if(document.getElementById('mNavFreeClasses')) document.getElementById('mNavFreeClasses').innerText = t.navFreeClasses;
    if(document.getElementById('mNavAbout')) document.getElementById('mNavAbout').innerText = t.navAbout;
    
    // Search placeholders
    const gSearch = document.getElementById('globalSearch');
    if(gSearch) gSearch.placeholder = t.searchPlaceholder;
    const mSearch = document.getElementById('globalSearchMobile');
    if(mSearch) mSearch.placeholder = t.searchPlaceholder;

    // Hero Section
    if(document.getElementById('heroTitle')) document.getElementById('heroTitle').innerHTML = t.heroTitle;
    if(document.getElementById('heroSub')) document.getElementById('heroSub').innerText = t.heroSub;
    if(document.getElementById('btnExplore')) document.getElementById('btnExplore').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ` + t.btnExplore;
    if(document.getElementById('btnContact')) document.getElementById('btnContact').innerHTML = `<i class="fa-solid fa-phone"></i> ` + t.btnContact;

    // Guest Login Banner
    if(document.getElementById('guestBannerTitle')) document.getElementById('guestBannerTitle').innerText = t.guestBannerTitle;
    if(document.getElementById('guestBannerDesc')) document.getElementById('guestBannerDesc').innerText = t.guestBannerDesc;
    if(document.getElementById('guestBannerBtn')) document.getElementById('guestBannerBtn').innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>${t.guestBannerBtn}</span>`;

    // Batch Tabs
    if(document.getElementById('tabBatchAll')) document.getElementById('tabBatchAll').innerText = t.tabBatchAll;
    if(document.getElementById('tabBatchAdmission')) document.getElementById('tabBatchAdmission').innerText = t.tabBatchAdmission;

    // Why Choose Us
    if(document.getElementById('whyTitle')) document.getElementById('whyTitle').innerText = t.whyTitle;
    if(document.getElementById('f1Title')) document.getElementById('f1Title').innerText = t.f1Title; 
    if(document.getElementById('f1Desc')) document.getElementById('f1Desc').innerText = t.f1Desc;
    if(document.getElementById('f2Title')) document.getElementById('f2Title').innerText = t.f2Title; 
    if(document.getElementById('f2Desc')) document.getElementById('f2Desc').innerText = t.f2Desc;
    if(document.getElementById('f3Title')) document.getElementById('f3Title').innerText = t.f3Title; 
    if(document.getElementById('f3Desc')) document.getElementById('f3Desc').innerText = t.f3Desc;
    if(document.getElementById('f4Title')) document.getElementById('f4Title').innerText = t.f4Title; 
    if(document.getElementById('f4Desc')) document.getElementById('f4Desc').innerText = t.f4Desc;

    // Section Titles
    if(document.getElementById('coursesTitle')) document.getElementById('coursesTitle').innerText = t.coursesTitle;
    if(document.getElementById('teachersTitle')) document.getElementById('teachersTitle').innerText = t.teachersTitle;
    if(document.getElementById('teachersDesc')) document.getElementById('teachersDesc').innerText = t.teachersDesc;
    if(document.getElementById('freeTitle')) document.getElementById('freeTitle').innerText = t.freeTitle;
    if(document.getElementById('freeDesc')) document.getElementById('freeDesc').innerText = t.freeDesc;
    if(document.getElementById('aboutTitle')) document.getElementById('aboutTitle').innerText = t.aboutTitle;

    // App & Success & CTA
    if(document.getElementById('appTitle')) document.getElementById('appTitle').innerText = t.appTitle; 
    if(document.getElementById('appDesc')) document.getElementById('appDesc').innerHTML = t.appDesc;
    if(document.getElementById('successTitle')) document.getElementById('successTitle').innerText = t.successTitle; 
    if(document.getElementById('successDesc')) document.getElementById('successDesc').innerText = t.successDesc;
    if(document.getElementById('ctaTitle')) document.getElementById('ctaTitle').innerText = t.ctaTitle; 
    if(document.getElementById('ctaDesc')) document.getElementById('ctaDesc').innerText = t.ctaDesc; 
    if(document.getElementById('ctaBtn')) document.getElementById('ctaBtn').innerHTML = t.ctaBtn;

    // Footer
    if(document.getElementById('footerRights')) document.getElementById('footerRights').innerText = t.footerRights;

    // Contact Modal Translations
    if(document.getElementById('contactModalTitle')) document.getElementById('contactModalTitle').innerText = t.contactModalTitle;
    if(document.getElementById('contactModalSubtitle')) document.getElementById('contactModalSubtitle').innerText = t.contactModalSubtitle;
    if(document.getElementById('contactHelplineLabel')) document.getElementById('contactHelplineLabel').innerText = t.contactHelplineLabel;
    if(document.getElementById('contactHelplineHours')) document.getElementById('contactHelplineHours').innerText = t.contactHelplineHours;
    if(document.getElementById('contactHelplineSub')) document.getElementById('contactHelplineSub').innerText = t.contactHelplineSub;
    if(document.getElementById('contactFbLabel')) document.getElementById('contactFbLabel').innerText = t.contactFbLabel;
    if(document.getElementById('contactFbActive')) document.getElementById('contactFbActive').innerText = t.contactFbActive;
    if(document.getElementById('contactFbSub')) document.getElementById('contactFbSub').innerText = t.contactFbSub;
    if(document.getElementById('contactEmailLabel')) document.getElementById('contactEmailLabel').innerText = t.contactEmailLabel;
    if(document.getElementById('contactEmailSub')) document.getElementById('contactEmailSub').innerText = t.contactEmailSub;
    if(document.getElementById('contactModalFooterNote')) document.getElementById('contactModalFooterNote').innerHTML = `<i class="fa-solid fa-shield-halved text-blue-600"></i> ` + t.contactModalFooterNote;
    if(document.getElementById('contactModalCloseBtn')) document.getElementById('contactModalCloseBtn').innerText = t.contactModalCloseBtn;

    // Language Toggle Buttons
    const btnBn = document.getElementById('btnBn');
    const btnEn = document.getElementById('btnEn');
    const mBtnBn = document.getElementById('mBtnBn');
    const mBtnEn = document.getElementById('mBtnEn');

    if (lang === 'bn') {
        if(btnBn) btnBn.className = 'px-3 py-1 text-sm font-bold bg-blue-600 text-white shadow-sm';
        if(btnEn) btnEn.className = 'px-3 py-1 text-sm font-bold text-blue-700 hover:bg-blue-100 transition';
        if(mBtnBn) mBtnBn.className = 'px-3 py-1 text-xs font-bold bg-blue-600 text-white shadow-sm';
        if(mBtnEn) mBtnEn.className = 'px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition';
    } else {
        if(btnEn) btnEn.className = 'px-3 py-1 text-sm font-bold bg-blue-600 text-white shadow-sm';
        if(btnBn) btnBn.className = 'px-3 py-1 text-sm font-bold text-blue-700 hover:bg-blue-100 transition';
        if(mBtnEn) mBtnEn.className = 'px-3 py-1 text-xs font-bold bg-blue-600 text-white shadow-sm';
        if(mBtnBn) mBtnBn.className = 'px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition';
    }

    // Re-render courses so badges, prices, details buttons are in selected language
    renderCoursesList();
}
window.setLanguage = setLanguage;

function toggleMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    if (!drawer) return;
    drawer.classList.toggle('hidden');
}
window.toggleMobileMenu = toggleMobileMenu;

function closeMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    if (drawer) drawer.classList.add('hidden');
}
window.closeMobileMenu = closeMobileMenu;

let allFetchedCourses = [];
let userEnrolledCourseIds = new Set();
let currentSelectedBatch = 'ALL';
let currentSearchQuery = '';

function filterCoursesByBatch(batch) {
    currentSearchQuery = '';
    const dSearch = document.getElementById('globalSearch');
    const mSearch = document.getElementById('globalSearchMobile');
    if (dSearch) dSearch.value = '';
    if (mSearch) mSearch.value = '';
    updateClearButtons(false);

    currentSelectedBatch = batch || 'ALL';
    
    // Update button active state
    const buttons = document.querySelectorAll('#batchTabsContainer .batch-tab-btn');
    buttons.forEach(btn => {
        const btnBatch = btn.getAttribute('data-batch');
        if (btnBatch === currentSelectedBatch) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderCoursesList();
}
window.filterCoursesByBatch = filterCoursesByBatch;

function updateClearButtons(show) {
    const dClear = document.getElementById('globalSearchClearBtn');
    const mClear = document.getElementById('mobileSearchClearBtn');
    if (dClear) {
        if (show) dClear.classList.remove('hidden'); else dClear.classList.add('hidden');
    }
    if (mClear) {
        if (show) mClear.classList.remove('hidden'); else mClear.classList.add('hidden');
    }
}

function handleSearchInput(query) {
    currentSearchQuery = (query || '').trim();
    updateClearButtons(currentSearchQuery.length > 0);

    // Sync input fields
    const dSearch = document.getElementById('globalSearch');
    const mSearch = document.getElementById('globalSearchMobile');
    if (dSearch && dSearch.value !== query) dSearch.value = query;
    if (mSearch && mSearch.value !== query) mSearch.value = query;

    renderCoursesList();
}
window.handleSearchInput = handleSearchInput;

function clearSearch() {
    currentSearchQuery = '';
    const dSearch = document.getElementById('globalSearch');
    const mSearch = document.getElementById('globalSearchMobile');
    if (dSearch) dSearch.value = '';
    if (mSearch) mSearch.value = '';
    updateClearButtons(false);
    renderCoursesList();
}
window.clearSearch = clearSearch;

function renderCoursesList() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;

    const lang = localStorage.getItem('lang') || 'bn';
    const t = translations[lang] || translations.bn;

    let filtered = allFetchedCourses || [];

    // Search active: search across ALL batches
    if (currentSearchQuery.length > 0) {
        const queryLower = currentSearchQuery.toLowerCase();
        filtered = filtered.filter(c => {
            const title = (c.title || '').toLowerCase();
            const desc = (c.description || '').toLowerCase();
            const batch = (c.batch || '').toLowerCase();
            const teacher = (c.teacherName || c.instructorName || '').toLowerCase();
            return title.includes(queryLower) || desc.includes(queryLower) || batch.includes(queryLower) || teacher.includes(queryLower);
        });

        // Unhighlight batch buttons while searching
        const buttons = document.querySelectorAll('#batchTabsContainer .batch-tab-btn');
        buttons.forEach(btn => btn.classList.remove('active'));

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-300 my-4 shadow-sm">
                    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2">
                        "${escapeHtml(currentSearchQuery)}" ${t.noSearchResultsTitle}
                    </h4>
                    <p class="text-slate-500 text-sm max-w-md mx-auto mb-5">${t.noSearchResultsDesc}</p>
                    <button type="button" onclick="clearSearch()" class="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 inline-flex items-center gap-2">
                        <i class="fa-solid fa-rotate-left"></i> <span>${t.resetSearchBtn}</span>
                    </button>
                </div>
            `;
            return;
        }
    } else {
        // Normal batch filter active
        const buttons = document.querySelectorAll('#batchTabsContainer .batch-tab-btn');
        buttons.forEach(btn => {
            const btnBatch = btn.getAttribute('data-batch');
            if (btnBatch === currentSelectedBatch) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (currentSelectedBatch && currentSelectedBatch !== 'ALL') {
            const searchBatch = currentSelectedBatch.trim().toUpperCase();
            filtered = filtered.filter(c => {
                const cBatch = (c.batch || 'HSC 2028').trim().toUpperCase();
                return cBatch === searchBatch || (searchBatch === 'ADMISSION' && cBatch.includes('ADMISSION'));
            });
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-300 my-4 shadow-sm">
                    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2">${escapeHtml(currentSelectedBatch)} ${t.emptyBatchTitle}</h4>
                    <p class="text-slate-500 text-sm max-w-md mx-auto mb-5">${t.emptyBatchDesc}</p>
                    <button type="button" onclick="filterCoursesByBatch('ALL')" class="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5 inline-flex items-center gap-2">
                        <i class="fa-solid fa-layer-group"></i> <span>${t.viewAllBtn}</span>
                    </button>
                </div>
            `;
            return;
        }
    }

    const scrollContainer = document.getElementById('coursesScrollContainer');
    const scrollHint = document.getElementById('courseScrollHint');

    if (scrollContainer) {
        scrollContainer.scrollTop = 0;
    }

    if (filtered.length > 4) {
        if (scrollContainer) scrollContainer.classList.add('max-h-[960px]', 'overflow-y-auto');
        if (scrollHint) { scrollHint.classList.remove('hidden'); scrollHint.classList.add('flex'); }
    } else {
        if (scrollContainer) scrollContainer.classList.remove('max-h-[960px]', 'overflow-y-auto');
        if (scrollHint) { scrollHint.classList.add('hidden'); scrollHint.classList.remove('flex'); }
    }

    grid.innerHTML = '';
    filtered.forEach(course => {
        let imgUrl = course.imageUrl || 'https://via.placeholder.com/400x200?text=Physics+Course';
        if (!imgUrl.startsWith('http')) {
            imgUrl = '/' + imgUrl.replace(/^\//, '');
        }

        const isEnrolled = userEnrolledCourseIds.has(course.id);
        const batchTag = course.batch || 'HSC 2028';

        const batchBadgeHtml = `<span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 shadow-md z-10 flex items-center gap-1.5">
            <i class="fa-solid fa-graduation-cap text-blue-400 text-[11px]"></i> ${escapeHtml(batchTag)}
        </span>`;

        const badgeHtml = isEnrolled 
            ? `<span class="absolute top-3 left-3 bg-emerald-600/95 backdrop-blur-sm text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-10 border border-emerald-400/30"><i class="fa-solid fa-circle-check"></i> ${t.badgeEnrolled}</span>`
            : '';
            
        const priceHtml = isEnrolled
            ? `<span class="text-base sm:text-lg font-extrabold text-emerald-600 flex items-center gap-1.5 whitespace-nowrap"><i class="fa-solid fa-lock-open text-sm"></i> ${t.priceUnlocked}</span>`
            : `<span class="text-2xl sm:text-3xl font-black text-blue-900 group-hover:scale-105 ease-out transition-transform origin-left whitespace-nowrap">৳${course.price}</span>`;

        const btnHtml = isEnrolled
            ? `<button class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                    ${t.btnStartClass} <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
               </button>`
            : `<button class="bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md whitespace-nowrap">
                    ${t.btnViewDetails} <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
               </button>`;

        const card = `
            <div class="group course-card-shine bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border ${isEnrolled ? 'border-2 border-emerald-500/50 ring-4 ring-emerald-500/10' : 'border-slate-200/80'} flex flex-col h-full cursor-pointer" onclick="window.location.href='/Views/Course/course.html?id=${course.id}'">
                <div class="relative overflow-hidden w-full h-44 sm:h-48 bg-slate-900">
                    <img src="${imgUrl}" alt="${escapeHtml(course.title)}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" onerror="this.src='https://via.placeholder.com/400x200?text=Physics+Course'">
                    ${badgeHtml}
                    ${batchBadgeHtml}
                    <div class="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
                <div class="p-5 sm:p-6 flex flex-col flex-grow">
                    <div class="flex items-start justify-between gap-3 mb-2">
                        <h3 class="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">${escapeHtml(course.title)}</h3>
                        ${isEnrolled ? '<span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300 flex-shrink-0">Active</span>' : ''}
                    </div>
                    <p class="text-slate-600 mb-4 line-clamp-2 text-sm leading-relaxed flex-grow">${escapeHtml(course.description || '')}</p>
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
}
window.renderCoursesList = renderCoursesList;

async function loadCourses() {
    try {
        const token = localStorage.getItem('token');
        userEnrolledCourseIds = new Set();
        
        const guestBanner = document.getElementById('guestLoginBanner');

        if (token) {
            if (guestBanner) guestBanner.style.display = 'none';
            try {
                let myRes = await fetch('/api/Enrollments/mycourses', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (!myRes.ok) {
                    myRes = await fetch('/api/Courses/my-courses', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                }
                if (myRes.ok) {
                    const myCourses = await myRes.json();
                    if (Array.isArray(myCourses)) {
                        myCourses.forEach(c => {
                            if (c.id) userEnrolledCourseIds.add(c.id);
                            if (c.courseId) userEnrolledCourseIds.add(c.courseId);
                        });
                    }
                }
            } catch (err) {
                console.warn('Could not load user enrolled courses', err);
            }
        } else {
            if (guestBanner) guestBanner.style.display = 'block';
        }

        const response = await fetch('/api/Courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        allFetchedCourses = await response.json();
        
        renderCoursesList();
    } catch (error) {
        console.error('Error loading courses:', error);
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
                            <img src="${imgUrl}" alt="${escapeHtml(t.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://via.placeholder.com/300'">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-center gap-3">
                                ${t.facebookUrl ? `<a href="${t.facebookUrl}" target="_blank" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-blue-500 transition"><i class="fa-brands fa-facebook-f"></i></a>` : ''}
                                ${t.linkedInUrl ? `<a href="${t.linkedInUrl}" target="_blank" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-blue-700 transition"><i class="fa-brands fa-linkedin-in"></i></a>` : ''}
                            </div>
                        </div>
                        <div class="p-6 text-center">
                            <h3 class="font-bold text-xl text-slate-800 mb-1">${escapeHtml(t.name)}</h3>
                            ${t.designation ? `<p class="text-purple-600 font-medium text-sm mb-1">${escapeHtml(t.designation)}</p>` : ''}
                            ${t.subject ? `<p class="text-slate-500 text-sm font-semibold">${escapeHtml(t.subject)}</p>` : ''}
                            ${t.bio ? `<p class="text-slate-600 text-sm mt-3 line-clamp-3">${escapeHtml(t.bio)}</p>` : ''}
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Error loading teachers', error);
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
                container.innerHTML = '<div class="w-full text-center text-slate-400 py-6">No student stories available right now.</div>';
                return;
            }
            
            container.innerHTML = '';
            data.forEach((s, idx) => {
                const borderColors = ['border-emerald-100', 'border-blue-100', 'border-purple-100', 'border-yellow-100', 'border-pink-100'];
                const bColor = borderColors[idx % borderColors.length];
                
                container.innerHTML += `
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 w-72 flex-shrink-0 flex flex-col items-center snap-center hover:shadow-lg transition transform hover:-translate-y-1">
                    <img src="${s.imageUrl}" class="w-24 h-24 rounded-full mb-4 border-4 ${bColor} object-cover bg-slate-50" alt="${escapeHtml(s.name)}" onerror="this.src='https://via.placeholder.com/150'">
                    <h3 class="text-xl font-bold text-slate-900">${escapeHtml(s.name)}</h3>
                    <p class="text-emerald-600 font-bold mb-2">${escapeHtml(s.institution)}</p>
                    <div class="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">${escapeHtml(s.batch)}</div>
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
            const safeTitle = (data.title || 'About PhysicsClassroom').replace(/PhysicsAcademy/gi, 'PhysicsClassroom');
            const safeDesc = (data.description || '').replace(/PhysicsAcademy/gi, 'PhysicsClassroom');
            if(document.getElementById('aboutTitle')) document.getElementById('aboutTitle').innerText = safeTitle;
            if(document.getElementById('aboutDesc')) document.getElementById('aboutDesc').innerText = safeDesc;
            if(document.getElementById('aboutImg') && data.imageUrl) document.getElementById('aboutImg').src = data.imageUrl;
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
            container.innerHTML = '<div class="col-span-full text-center text-slate-400 py-6">No free classes available right now.</div>';
            return;
        }

        const lang = localStorage.getItem('lang') || 'bn';
        const t = translations[lang] || translations.bn;

        let html = '';
        classes.forEach(fc => {
            html += `
            <a href="${fc.videoUrl}" target="_blank" class="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition duration-300 group cursor-pointer block">
                <div class="relative h-48 bg-slate-200">
                    <img src="${fc.thumbnailUrl}" class="w-full h-full object-cover" alt="Class Thumbnail" onerror="this.src='https://via.placeholder.com/400x200?text=Physics+Class'">
                    <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                        <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-red-600 text-2xl shadow-lg transform group-hover:scale-110 transition">
                            <i class="fa-solid fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">${escapeHtml(fc.category)}</div>
                    <h3 class="text-lg font-bold text-slate-800 mb-2">${escapeHtml(fc.title)}</h3>
                    <p class="text-slate-500 text-sm mb-4 line-clamp-2">${escapeHtml(fc.description || '')}</p>
                    <span class="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 group-hover:text-red-700">
                        ${t.watchClassBtn}
                    </span>
                </div>
            </a>`;
        });
        container.innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

window.onload = () => {
    const savedLang = localStorage.getItem('lang') || 'bn';
    setLanguage(savedLang);
    loadCourses();

    // Bind Desktop Search
    const gSearch = document.getElementById('globalSearch');
    if (gSearch) {
        gSearch.addEventListener('input', function(e) {
            handleSearchInput(e.target.value);
            if (e.target.value.trim().length > 0 && e.inputType !== 'deleteContentBackward') {
                const cEl = document.getElementById('courses');
                if (cEl) cEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
        gSearch.addEventListener('search', function(e) {
            handleSearchInput(e.target.value);
        });
        gSearch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const cEl = document.getElementById('courses');
                if (cEl) cEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Bind Mobile Search
    const mSearch = document.getElementById('globalSearchMobile');
    if (mSearch) {
        mSearch.addEventListener('input', function(e) {
            handleSearchInput(e.target.value);
            if (e.target.value.trim().length > 0 && e.inputType !== 'deleteContentBackward') {
                const cEl = document.getElementById('courses');
                if (cEl) cEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
        mSearch.addEventListener('search', function(e) {
            handleSearchInput(e.target.value);
        });
        mSearch.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                closeMobileMenu();
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

function openContactModal() {
    const modal = document.getElementById('contactModal');
    const content = document.getElementById('contactModalContent');
    if (!modal) return;
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
    });
}
window.openContactModal = openContactModal;

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    const content = document.getElementById('contactModalContent');
    if (!modal) return;
    modal.classList.add('opacity-0');
    if (content) {
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
    }
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 250);
}
window.closeContactModal = closeContactModal;

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeContactModal();
});
