
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

        
        function handleEnrolledView() {
            // Hide lock screen
            const vp = document.getElementById('videoPlaceholder');
            if(vp) vp.style.display = 'none';
            
            // Hide Sidebar and expand main column
            const sidebar = document.getElementById('sidebarColumn');
            const mainCol = document.getElementById('mainColumn');
            if(sidebar && mainCol) {
                sidebar.style.display = 'none';
                mainCol.classList.remove('lg:col-span-2');
                mainCol.classList.add('lg:col-span-3');
            }
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

                document.getElementById('courseHeader').innerHTML = `
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

                if(isEnrolled) { handleEnrolledView(); 
                    const vp = document.getElementById('videoPlaceholder');
                    if(vp) vp.style.display = 'none';

                    const actionDiv = document.getElementById('enrollAction');
                    if(actionDiv) {
                        actionDiv.innerHTML = `<div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
                            <i class="fa-solid fa-circle-check text-2xl"></i>
                            <div class="font-bold">${t.statusEnrolled}</div>
                        </div>`;
                    }

                    // Render Chapters
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
                            
                            chaptersHtml += `<div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transform transition duration-200 hover:shadow-lg">`;
                              
                              // Chapter Header
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
                              
                              // Chapter Contents Container (Hidden by default)
                              chaptersHtml += `<div id="content-${ch.id}" class="hidden">`;

                              if (ch.contents && ch.contents.length > 0) {
                                  const pdfs = ch.contents.filter(c => c.type !== 'Video');
                                  const videos = ch.contents.filter(c => c.type === 'Video');

                                  chaptersHtml += `<div class="p-6 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100">`;
                                  
                                  // Left Side: PDFs (ba pashe)
                                  chaptersHtml += `<div>
                                      <h4 class="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                                          <i class="fa-solid fa-file-pdf text-red-500"></i> Study Materials
                                      </h4>
                                      <div class="flex flex-col gap-3">
                                  `;
                                  if(pdfs.length === 0) chaptersHtml += `<div class="text-sm text-slate-400 italic p-2 bg-slate-100/50 rounded-lg text-center border border-slate-100">No study materials available yet.</div>`;
                                  pdfs.forEach(co => {
                                      chaptersHtml += `
                                          <a href="${co.url}" target="_blank" class="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex items-center justify-between group hover:border-red-300 hover:shadow-md transition cursor-pointer">
                                              <div class="flex items-center gap-3 overflow-hidden">
                                                  <div class="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-red-500 bg-red-50 text-lg group-hover:scale-110 transition-transform">
                                                      <i class="fa-solid fa-file-pdf"></i>
                                                  </div>
                                                  <div class="truncate">
                                                      <h4 class="font-bold text-slate-800 text-sm truncate group-hover:text-red-600 transition-colors">${co.title}</h4>
                                                      <span class="text-[10px] font-bold text-red-500 uppercase tracking-wider">PDF</span>
                                                  </div>
                                              </div>
                                              <i class="fa-solid fa-download text-slate-300 group-hover:text-red-400 transition-colors"></i>
                                          </a>
                                      `;
                                  });
                                  chaptersHtml += `</div></div>`;

                                  // Right Side: Videos (dan pashe)
                                  chaptersHtml += `<div>
                                      <h4 class="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                                          <i class="fa-solid fa-circle-play text-blue-500"></i> Video Lectures
                                      </h4>
                                      <div class="flex flex-col gap-3">
                                  `;
                                  if(videos.length === 0) chaptersHtml += `<div class="text-sm text-slate-400 italic p-2 bg-slate-100/50 rounded-lg text-center border border-slate-100">No video lectures available yet.</div>`;
                                  videos.forEach(co => {
                                      chaptersHtml += `
                                          <a href="${co.url}" target="_blank" class="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex items-center justify-between group hover:border-blue-300 hover:shadow-md transition cursor-pointer">
                                              <div class="flex items-center gap-3 overflow-hidden">
                                                  <div class="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-blue-500 bg-blue-50 text-lg group-hover:scale-110 transition-transform">
                                                      <i class="fa-solid fa-play"></i>
                                                  </div>
                                                  <div class="truncate">
                                                      <h4 class="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">${co.title}</h4>
                                                      <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Video</span>
                                                  </div>
                                              </div>
                                              <i class="fa-solid fa-play text-slate-300 group-hover:text-blue-400 transition-colors"></i>
                                          </a>
                                      `;
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
                              chaptersHtml += `</div>
                        });
                                chaptersHtml += `</div>`;
                            } else {
                                chaptersHtml += `
                                    <div class="p-8 text-center bg-slate-50">
                                        <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <i class="fa-solid fa-hourglass-half text-slate-400"></i>
                                        </div>
                                        <p class="text-slate-500 text-sm font-medium">Contents for this chapter will be uploaded soon.</p>
                                    </div>
                                `;
                            }
                            chaptersHtml += `</div>`;
                        });
                    } else {
                        chaptersHtml += `<div class="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm"><div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fa-solid fa-person-digging text-3xl text-emerald-500"></i></div><h3 class="text-lg font-bold text-slate-800 mb-1">Curriculum Under Construction</h3><p class="text-slate-500">Chapters and videos will be published here very soon.</p></div>`;
                    }
                    chaptersHtml += '</div></div>';
                    
                    document.getElementById('overviewContent').innerHTML += chaptersHtml;
                } else if(token) {
                    // Check if pending
                    const enrollRes = await fetch('/api/Enrollments/mycourses', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    if(enrollRes.ok) {
                        const myCourses = await enrollRes.json();
                        const pending = myCourses.find(c => c.courseId == courseId);
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
    