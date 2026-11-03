// profile.js - Student Profile & Enrolled Courses Logic
// @ts-nocheck

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token) {
        window.location.href = '/Views/Auth/login.html';
        return;
    }
    
    // Set user info
    if (document.getElementById('profileName')) {
        document.getElementById('profileName').innerText = username || 'Student';
    }
    if (document.getElementById('profileImage')) {
        document.getElementById('profileImage').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'S')}&background=1a9c5c&color=fff&size=150`;
    }
    if (document.getElementById('profileEmail')) {
        document.getElementById('profileEmail').innerText = localStorage.getItem('email') || 'Student Account'; 
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch('/api/Auth/logout', {
                    method: 'POST',
                    headers: { 
                        'Authorization': token ? 'Bearer ' + token : '',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: localStorage.getItem('email') })
                });
            } catch(err) { console.log(err); }
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('user');
            sessionStorage.clear();
            window.location.href = '/Views/Auth/login.html';
        });
    }
    
    // Fetch My Courses
    try {
        const response = await fetch('/api/Enrollments/mycourses', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        const loadMsg = document.getElementById('loadingMsg');
        if (loadMsg) loadMsg.style.display = 'none';
        
        if (response.ok) {
            const courses = await response.json();
            
            if (courses.length === 0) {
                const noCourses = document.getElementById('noCoursesMsg');
                if (noCourses) noCourses.style.display = 'block';
            } else {
                const grid = document.getElementById('myCoursesGrid');
                if (grid) {
                    grid.style.display = 'grid';
                    grid.innerHTML = '';
                    
                    courses.forEach(c => {
                        let statusBadge = '';
                        let actionBtn = '';
                        
                        if (c.status === 'Approved') {
                            statusBadge = `<span class="status-badge status-approved">✅ পেমেন্ট সম্পন্ন</span>`;
                            actionBtn = `<a href="/Views/Course/course.html?id=${c.courseId}" class="btn-action btn-play">▶ ভিডিও ও ক্লাস দেখুন</a>`;
                        } else if (c.status === 'Pending') {
                            statusBadge = `<span class="status-badge status-pending">⏳ পেন্ডিং</span>`;
                            actionBtn = `<span class="btn-action btn-disabled">অ্যাডমিন চেক করছেন...</span>`;
                        } else {
                            statusBadge = `<span class="status-badge status-rejected">❌ বাতিল</span>`;
                            actionBtn = `<span class="btn-action btn-disabled">পেমেন্ট রিজেক্ট হয়েছে</span>`;
                        }
                        
                        const card = document.createElement('div');
                        card.className = 'course-card';
                        card.innerHTML = `
                            <img src="${c.imageUrl || 'https://via.placeholder.com/400x200?text=Course+Image'}" alt="Course">
                            <div class="course-card-content">
                                ${statusBadge}
                                <h4>${c.title}</h4>
                                <p style="font-size: 0.8rem; color: #6b7280; margin-bottom: 1rem;">এনরোল: ${new Date(c.enrollmentDate).toLocaleDateString()}</p>
                                ${actionBtn}
                            </div>
                        `;
                        grid.appendChild(card);
                    });
                }
            }
        } else if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/Views/Auth/login.html';
        }
    } catch (err) {
        console.error("Error fetching courses", err);
        const lm = document.getElementById('loadingMsg');
        if (lm) lm.innerText = "সার্ভার এরর! দয়া করে একটু পর আবার চেষ্টা করুন।";
    }

    // Tab switching logic
    const tabMyCourses = document.getElementById('tabMyCourses');
    const tabSettings = document.getElementById('tabSettings');
    const viewMyCourses = document.getElementById('viewMyCourses');
    const viewSettings = document.getElementById('viewSettings');

    if (tabMyCourses && tabSettings && viewMyCourses && viewSettings) {
        tabMyCourses.addEventListener('click', (e) => {
            e.preventDefault();
            tabMyCourses.classList.add('active');
            tabSettings.classList.remove('active');
            viewMyCourses.style.display = 'block';
            viewSettings.style.display = 'none';
        });

        tabSettings.addEventListener('click', (e) => {
            e.preventDefault();
            tabSettings.classList.add('active');
            tabMyCourses.classList.remove('active');
            viewSettings.style.display = 'block';
            viewMyCourses.style.display = 'none';
        });
    }

    // Password change form logic
    const pwdForm = document.getElementById('changePasswordForm');
    if (pwdForm) {
        pwdForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const msgBox = document.getElementById('pwdMessage');
            
            if (newPassword !== confirmPassword) {
                if (msgBox) {
                    msgBox.style.display = 'block';
                    msgBox.style.color = '#ef4444';
                    msgBox.innerText = 'নতুন পাসওয়ার্ড দুটি মিলছে না!';
                }
                return;
            }

            const btn = document.getElementById('btnChangePassword');
            if (btn) {
                btn.innerText = 'পরিবর্তন হচ্ছে...';
                btn.disabled = true;
            }

            try {
                const res = await fetch('/api/Auth/change-password', {
                    method: 'PUT',
                    headers: { 
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ oldPassword, newPassword })
                });
                
                const data = await res.json();
                
                if (msgBox) {
                    msgBox.style.display = 'block';
                    if (res.ok) {
                        msgBox.style.color = '#10b981';
                        msgBox.innerText = data.message;
                        pwdForm.reset();
                    } else {
                        msgBox.style.color = '#ef4444';
                        msgBox.innerText = data.message || 'পাসওয়ার্ড পরিবর্তন করা যায়নি!';
                    }
                }
            } catch(err) {
                if (msgBox) {
                    msgBox.style.display = 'block';
                    msgBox.style.color = '#ef4444';
                    msgBox.innerText = 'সার্ভার সমস্যা!';
                }
            } finally {
                if (btn) {
                    btn.innerText = 'পরিবর্তন করুন';
                    btn.disabled = false;
                }
            }
        });
    }

    // Email verification & update logic for existing/new users
    async function checkUserEmailStatus() {
        let email = localStorage.getItem('email') || '';
        try {
            const sessRes = await fetch('/api/Auth/validate-session', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (sessRes.ok) {
                const sdata = await sessRes.json();
                if (sdata.email) {
                    email = sdata.email;
                    localStorage.setItem('email', email);
                }
            }
        } catch(e) {}

        const emailMissingBanner = document.getElementById('emailMissingBanner');
        const displayUserEmail = document.getElementById('displayUserEmail');
        const profileEmail = document.getElementById('profileEmail');

        const isEmailMissing = !email || email.trim() === '' || email.includes('@placeholder') || !email.includes('@');
        
        if (displayUserEmail) {
            displayUserEmail.innerText = isEmailMissing ? '❌ কোনো ইমেইল যুক্ত নেই' : email;
            displayUserEmail.style.color = isEmailMissing ? '#dc2626' : '#0f172a';
        }
        if (profileEmail) {
            profileEmail.innerText = isEmailMissing ? (localStorage.getItem('phone') || 'Student Account') : email;
        }

        if (emailMissingBanner) {
            emailMissingBanner.style.display = isEmailMissing ? 'flex' : 'none';
        }
    }
    await checkUserEmailStatus();

    // Banner button -> navigate to settings
    const btnOpenAddEmailModal = document.getElementById('btnOpenAddEmailModal');
    if (btnOpenAddEmailModal) {
        btnOpenAddEmailModal.addEventListener('click', () => {
            if (tabSettings) tabSettings.click();
            const updateForm = document.getElementById('updateEmailFormContainer');
            if (updateForm) updateForm.style.display = 'block';
            const inputEmail = document.getElementById('inputNewEmail');
            if (inputEmail) inputEmail.focus();
        });
    }

    // Toggle email update form
    const btnToggleEmailUpdate = document.getElementById('btnToggleEmailUpdate');
    const updateEmailFormContainer = document.getElementById('updateEmailFormContainer');
    if (btnToggleEmailUpdate && updateEmailFormContainer) {
        btnToggleEmailUpdate.addEventListener('click', () => {
            const isHidden = updateEmailFormContainer.style.display === 'none' || !updateEmailFormContainer.style.display;
            updateEmailFormContainer.style.display = isHidden ? 'block' : 'none';
            btnToggleEmailUpdate.innerText = isHidden ? 'বাতিল' : 'পরিবর্তন';
        });
    }

    // Send Email OTP
    const btnSendEmailOtp = document.getElementById('btnSendEmailOtp');
    const inputNewEmail = document.getElementById('inputNewEmail');
    const emailOtpAlert1 = document.getElementById('emailOtpAlert1');
    const emailStep2 = document.getElementById('emailStep2');

    if (btnSendEmailOtp && inputNewEmail) {
        btnSendEmailOtp.addEventListener('click', async () => {
            const emailVal = inputNewEmail.value.trim();
            if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
                if (emailOtpAlert1) {
                    emailOtpAlert1.style.display = 'block';
                    emailOtpAlert1.style.color = '#dc2626';
                    emailOtpAlert1.innerText = 'দয়া করে একটি সঠিক ইমেইল ঠিকানা দিন।';
                }
                return;
            }

            btnSendEmailOtp.disabled = true;
            btnSendEmailOtp.innerText = 'পাঠানো হচ্ছে...';
            if (emailOtpAlert1) emailOtpAlert1.style.display = 'none';

            try {
                const res = await fetch('/api/Auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailVal, purpose: 'UpdateEmail' })
                });
                const data = await res.json();
                if (res.ok) {
                    if (emailOtpAlert1) {
                        emailOtpAlert1.style.display = 'block';
                        emailOtpAlert1.style.color = '#10b981';
                        emailOtpAlert1.innerText = '✅ ' + (data.message || 'ওটিপি কোড পাঠানো হয়েছে! আপনার ইনবক্স চেক করুন।');
                    }
                    if (emailStep2) emailStep2.style.display = 'block';
                    const otpInput = document.getElementById('inputEmailOtpCode');
                    if (otpInput) otpInput.focus();
                } else {
                    if (emailOtpAlert1) {
                        emailOtpAlert1.style.display = 'block';
                        emailOtpAlert1.style.color = '#dc2626';
                        emailOtpAlert1.innerText = '❌ ' + (data.message || 'ওটিপি পাঠানো যায়নি!');
                    }
                }
            } catch(e) {
                if (emailOtpAlert1) {
                    emailOtpAlert1.style.display = 'block';
                    emailOtpAlert1.style.color = '#dc2626';
                    emailOtpAlert1.innerText = 'সার্ভার সমস্যা!';
                }
            } finally {
                btnSendEmailOtp.disabled = false;
                btnSendEmailOtp.innerText = 'ওটিপি পাঠান';
            }
        });
    }

    // Verify OTP & Save Email
    const btnVerifyAndSaveEmail = document.getElementById('btnVerifyAndSaveEmail');
    const inputEmailOtpCode = document.getElementById('inputEmailOtpCode');
    const emailOtpAlert2 = document.getElementById('emailOtpAlert2');

    if (btnVerifyAndSaveEmail && inputEmailOtpCode) {
        btnVerifyAndSaveEmail.addEventListener('click', async () => {
            const emailVal = inputNewEmail ? inputNewEmail.value.trim() : '';
            const codeVal = inputEmailOtpCode.value.trim();

            if (!codeVal || codeVal.length < 6) {
                if (emailOtpAlert2) {
                    emailOtpAlert2.style.display = 'block';
                    emailOtpAlert2.style.color = '#dc2626';
                    emailOtpAlert2.innerText = 'দয়া করে ৬-সংখ্যার সঠিক ওটিপি কোড লিখুন।';
                }
                return;
            }

            btnVerifyAndSaveEmail.disabled = true;
            btnVerifyAndSaveEmail.innerText = 'ভেরিফাই হচ্ছে...';
            if (emailOtpAlert2) emailOtpAlert2.style.display = 'none';

            try {
                const res = await fetch('/api/Auth/update-email', {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: emailVal, otpCode: codeVal })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('email', emailVal);
                    if (emailOtpAlert2) {
                        emailOtpAlert2.style.display = 'block';
                        emailOtpAlert2.style.color = '#10b981';
                        emailOtpAlert2.innerText = '🎉 ' + (data.message || 'ইমেইল সফলভাবে ভেরিফাই ও যুক্ত করা হয়েছে!');
                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 1200);
                } else {
                    if (emailOtpAlert2) {
                        emailOtpAlert2.style.display = 'block';
                        emailOtpAlert2.style.color = '#dc2626';
                        emailOtpAlert2.innerText = '❌ ' + (data.message || 'ভেরিফিকেশন ব্যর্থ হয়েছে!');
                    }
                }
            } catch(e) {
                if (emailOtpAlert2) {
                    emailOtpAlert2.style.display = 'block';
                    emailOtpAlert2.style.color = '#dc2626';
                    emailOtpAlert2.innerText = 'সার্ভার সমস্যা!';
                }
            } finally {
                btnVerifyAndSaveEmail.disabled = false;
                btnVerifyAndSaveEmail.innerText = 'ভেরিফাই ও সেভ';
            }
        });
    }
});
