
        // @ts-nocheck
        const translations = {
            en: {
                navHome: "Home", navAbout: "About", navCourses: "Courses", navTeachers: "Teachers", navRoutine: "Routine", navEnroll: "Enroll Now",
                heroTitle: "Master Physics. <br>Build Strong Concepts. <br><span class='text-emerald-300'>Achieve Better Results.</span>",
                heroSub: "Concept-based Physics learning with expert guidance, regular practice, and exam-focused preparation for SSC, HSC & Admission.",
                btnExplore: "Explore Courses", btnContact: "Contact Us",
                whyTitle: "Why Choose Us?",
                f1Title: "Strong Concepts", f1Desc: "Deep understanding of core physics principles from the basics.",
                f2Title: "Easy Explanation", f2Desc: "Complex topics broken down into simple, digestible lessons.",
                f3Title: "Numerical Solving", f3Desc: "Extensive practice on mathematical problems and theories.",
                f4Title: "Regular Exams", f4Desc: "Weekly tests and evaluations to track student progress.",
                coursesTitle: "Featured Courses",
                appTitle: "Learn Anywhere, Anytime.", appDesc: "Download the <span class='font-bold text-emerald-600 font-sans'>PhysicsAcademy</span> mobile app to watch premium video lectures, give exams, and access study materials on the go.",
                successTitle: "Our Pride: Successful Students", successDesc: "Hundreds of our students are studying in top universities.",
                ctaTitle: "Ready to Make Physics Easier?", ctaDesc: "Join our upcoming batches and start your journey towards excellence.", ctaBtn: "Join Our Course Today"
            },
                        bn: {
                navHome: "হোম", navAbout: "আমাদের সম্পর্কে", navCourses: "কোর্সসমূহ", navTeachers: "শিক্ষকগণ", navRoutine: "রুটিন", navEnroll: "ভর্তি হন",
                heroTitle: "ফিজিক্স শিখুন. <br>কনসেপ্ট ক্লিয়ার করুন. <br><span class='text-emerald-300'>সেরা রেজাল্ট অর্জন করুন.</span>",
                heroSub: "SSC, HSC এবং এডমিশনের জন্য অভিজ্ঞ গাইডেন্স, নিয়মিত প্র্যাকটিস ও পরীক্ষামুখী প্রস্তুতির মাধ্যমে কনসেপ্ট-ভিত্তিক ফিজিক্স লার্নিং।",
                btnExplore: "কোর্সসমূহ দেখুন", btnContact: "যোগাযোগ করুন",
                whyTitle: "আমাদের কেন বেছে নিবেন?",
                f1Title: "স্ট্রং কনসেপ্ট", f1Desc: "বেসিক থেকে শুরু করে ফিজিক্সের প্রতিটি বিষয়ের গভীর ধারণা।",
                f2Title: "সহজ ব্যাখ্যা", f2Desc: "কঠিন টপিকগুলো সহজভাবে ভেঙে ভেঙে বোঝানো হয়।",
                f3Title: "গাণিতিক সমাধান", f3Desc: "গাণিতিক সমস্যা ও থিওরির উপর ব্যাপক প্র্যাকটিস করানো হয়।",
                f4Title: "নিয়মিত পরীক্ষা", f4Desc: "স্টুডেন্টদের উন্নতি ট্র্যাক করতে সাপ্তাহিক পরীক্ষা নেওয়া হয়।",
                coursesTitle: "আমাদের কোর্সসমূহ",
                appTitle: "যেখানে সেখানে, যখন তখন শিখুন।", appDesc: "<span class='font-bold text-emerald-600 font-sans'>PhysicsAcademy</span> মোবাইল অ্যাপ ডাউনলোড করে যেকোনো জায়গা থেকে প্রিমিয়াম ভিডিও লেকচার, পরীক্ষা ও স্টাডি ম্যাটেরিয়াল এক্সেস করুন।",
                successTitle: "আমাদের গর্ব: সফল ছাত্রছাত্রী", successDesc: "আমাদের শত শত ছাত্রছাত্রী দেশের সেরা বিশ্ববিদ্যালয়গুলোতে পড়াশোনা করছে।",
                ctaTitle: "ফিজিক্সকে সহজ করতে প্রস্তুত?", ctaDesc: "আমাদের আসন্ন ব্যাচগুলোতে যুক্ত হয়ে সফলতার পথে এগিয়ে যান।", ctaBtn: "আজই কোর্সে ভর্তি হন"
            }
        };

        async function logout() {
            const token = localStorage.getItem('token');
            if(token) {
                try {
                    await fetch('/api/Auth/logout', { 
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                } catch(e) {}
            }
            localStorage.removeItem('token');
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
                container.innerHTML = `
                    <a href="#" class="text-slate-600 hover:text-emerald-600 font-medium transition flex items-center gap-2"><i class="fa-solid fa-user-circle text-xl"></i> <span class="hidden md:inline">` + profileText + `</span></a>
                    <button onclick="logout()" class="text-red-500 hover:text-red-700 font-bold transition flex items-center gap-2"><i class="fa-solid fa-arrow-right-from-bracket"></i> <span class="hidden md:inline">` + logoutText + `</span></button>
                `;
            } else {
                const loginText = lang === 'bn' ? 'লগইন' : 'Login';
                container.innerHTML = `<a href="login.html" class="bg-emerald-600 text-white px-5 py-2 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center gap-2"><i class="fa-solid fa-user text-sm"></i> ` + loginText + `</a>`;
            }
        }

        function setLanguage(lang) {
            localStorage.setItem('lang', lang);
            const t = translations[lang];

            updateAuthNav(lang);
            document.getElementById('navHome').innerText = t.navHome;
            document.getElementById('navAbout').innerText = t.navAbout;
            document.getElementById('navCourses').innerText = t.navCourses;
            document.getElementById('navTeachers').innerText = t.navTeachers;
            document.getElementById('navRoutine').innerText = t.navRoutine;
            
            document.getElementById('heroTitle').innerHTML = t.heroTitle;
            document.getElementById('heroSub').innerText = t.heroSub;
            document.getElementById('btnExplore').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ` + t.btnExplore;
            document.getElementById('btnContact').innerHTML = `<i class="fa-solid fa-phone"></i> ` + t.btnContact;

            document.getElementById('whyTitle').innerText = t.whyTitle;
            document.getElementById('f1Title').innerText = t.f1Title; document.getElementById('f1Desc').innerText = t.f1Desc;
            document.getElementById('f2Title').innerText = t.f2Title; document.getElementById('f2Desc').innerText = t.f2Desc;
            document.getElementById('f3Title').innerText = t.f3Title; document.getElementById('f3Desc').innerText = t.f3Desc;
            document.getElementById('f4Title').innerText = t.f4Title; document.getElementById('f4Desc').innerText = t.f4Desc;

            document.getElementById('coursesTitle').innerText = t.coursesTitle;
            document.getElementById('appTitle').innerText = t.appTitle; document.getElementById('appDesc').innerHTML = t.appDesc;
            document.getElementById('successTitle').innerText = t.successTitle; document.getElementById('successDesc').innerText = t.successDesc;
            document.getElementById('ctaTitle').innerText = t.ctaTitle; document.getElementById('ctaDesc').innerText = t.ctaDesc; document.getElementById('ctaBtn').innerHTML = t.ctaBtn;

            if (lang === 'bn') {
                document.getElementById('btnBn').className = 'px-3 py-1 text-sm font-bold bg-emerald-600 text-white';
                document.getElementById('btnEn').className = 'px-3 py-1 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition';
            } else {
                document.getElementById('btnEn').className = 'px-3 py-1 text-sm font-bold bg-emerald-600 text-white';
                document.getElementById('btnBn').className = 'px-3 py-1 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition';
            }
        }

        async function loadCourses() {
            try {
                const response = await fetch('/api/Courses');
                const courses = await response.json();
                
                const grid = document.getElementById('coursesGrid');
                grid.innerHTML = '';

                courses.forEach(course => {
                    let imgUrl = course.imageUrl || 'https://via.placeholder.com/400x200?text=Physics+Course';
                    if(!imgUrl.startsWith('http')) {
                        imgUrl = '/' + imgUrl.replace(/^\//, '');
                    }

                    const card = `
                        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-slate-100">
                            <img src="${imgUrl}" alt="${course.title}" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-xl font-bold text-slate-900 leading-tight">${course.title}</h3>
                                </div>
                                <p class="text-slate-600 mb-6 line-clamp-2">${course.description}</p>
                                <div class="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <span class="text-2xl font-extrabold text-emerald-600">à§³${course.price}</span>
                                    <button onclick="window.location.href='course.html?id=${course.id}'" class="bg-blue-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-800 transition">
                                        View Details
                                    </button>
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

        window.onload = () => {
            const savedLang = localStorage.getItem('lang') || 'en';
            setLanguage(savedLang);
            loadCourses();
        };
    