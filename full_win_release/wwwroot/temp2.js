
        // @ts-nocheck
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
            document.getElementById('navCourses').innerText = t.navCourses;
            document.getElementById('navAdmin').innerText = t.navAdmin;
            
            if(document.getElementById('waitText')) document.getElementById('waitText').innerText = t.waitText;
            document.getElementById('overviewTitle').innerText = t.overviewTitle;
            document.getElementById('learnTitle').innerText = t.learnTitle;
            
            document.getElementById('f1').innerText = t.f1;
            document.getElementById('f2').innerText = t.f2;
            document.getElementById('f3').innerText = t.f3;
            document.getElementById('f4').innerText = t.f4;
            
            document.getElementById('paymentTitle').innerText = t.paymentTitle;
            document.getElementById('enrolledText').innerText = t.enrolledText;
            
            document.getElementById('access1').innerText = t.access1;
            document.getElementById('access2').innerText = t.access2;
            document.getElementById('access3').innerText = t.access3;
            
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
                document.getElementById('btnBn').className = 'px-3 py-1 text-sm font-bold bg-emerald-600 text-white';
                document.getElementById('btnEn').className = 'px-3 py-1 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition';
            } else {
                document.getElementById('btnEn').className = 'px-3 py-1 text-sm font-bold bg-emerald-600 text-white';
                document.getElementById('btnBn').className = 'px-3 py-1 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition';
            }
        }

        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id');

        async function loadCourseDetails() {
            if(!courseId) {
                document.getElementById('courseHeader').innerHTML = '<h1 class="text-slate-900 text-3xl font-bold">Course Not Found</h1>';
                return;
            }

            try {
                const response = await fetch('/api/Courses/' + courseId);
                const course = await response.json();

                if(!course) throw new Error("Not found");

                document.getElementById('courseHeader').innerHTML = `
                    <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-2">${course.title}</h1>
                    <p class="text-slate-500 font-medium">Complete Physics Preparation Batch</p>
                `;

                let imgUrl = course.imageUrl || 'https://via.placeholder.com/800x400?text=Physics+Course';
                if(!imgUrl.startsWith('http')) {
                    imgUrl = '/' + imgUrl.replace(/^\//, '');
                }
                document.getElementById('courseImage').src = imgUrl;

                document.getElementById('coursePrice').innerText = '৳ ' + course.price;
                document.getElementById('courseDesc').innerText = course.description;
                document.getElementById('enrolledCount').innerText = course.enrolledCount || 0;

                const token = localStorage.getItem('token');
                const lang = localStorage.getItem('lang') || 'en';
                const t = translations[lang];

                if(token) {
                    const enrollRes = await fetch('/api/Enrollments/mycourses', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    if(enrollRes.ok) {
                        const myCourses = await enrollRes.json();
                        const isEnrolled = myCourses.find(c => c.courseId == courseId);
                        
                        if(isEnrolled) {
                            const btn = document.getElementById('enrollBtn');
                            if(isEnrolled.status === 'Approved') {
                                btn.innerText = t.statusEnrolled;
                                btn.className = 'w-full bg-slate-200 text-slate-600 py-4 rounded-xl font-bold text-lg cursor-not-allowed shadow-none';
                                btn.onclick = null;

                                let embedUrl = course.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
                                let isMp4 = embedUrl.toLowerCase().endsWith('.mp4');
                                
                                if (!embedUrl.startsWith('http')) {
                                    embedUrl = '/' + embedUrl.replace(/^\//, '');
                                }
                                
                                if (embedUrl.includes('youtube.com/watch?v=')) {
                                    embedUrl = embedUrl.replace('watch?v=', 'embed/');
                                } else if (embedUrl.includes('youtu.be/')) {
                                    embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
                                }

                                const videoContainer = document.getElementById('videoContainer');
                                if(isMp4) {
                                    videoContainer.innerHTML = `<video src="${embedUrl}" controls autoplay class="w-full h-full object-cover rounded-2xl"></video>`;
                                } else {
                                    videoContainer.innerHTML = `<iframe src="${embedUrl}" class="w-full h-full rounded-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                                }
                                videoContainer.classList.remove('locked-video-bg');
                                videoContainer.classList.add('bg-black', 'p-0');
                                
                            } else {
                                btn.innerText = t.statusPending;
                                btn.className = 'w-full bg-orange-100 text-orange-600 py-4 rounded-xl font-bold text-lg cursor-not-allowed shadow-none';
                                btn.onclick = null;
                            }
                        }
                    }
                }

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
                window.location.href = 'login.html?returnUrl=course.html?id=' + courseId;
                return;
            }
            document.getElementById('enrollModal').classList.remove('hidden');
        }

        document.getElementById('paymentForm').addEventListener('submit', async (e) => {
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
    