// register.js - User Registration Logic
// @ts-nocheck

const existingToken = localStorage.getItem('token');
if (existingToken) {
    window.location.href = '/Views/Profile/profile.html';
}

const regForm = document.getElementById('signupForm');
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const errorMsg = document.getElementById('errorMsg');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> অ্যাকাউন্ট তৈরি হচ্ছে...';
        btn.disabled = true;
        errorMsg.classList.add('hidden');

        const name = (document.getElementById('username')?.value || '').trim();
        const phone = (document.getElementById('phone')?.value || '').trim();
        const email = (document.getElementById('email')?.value || '').trim();
        const password = document.getElementById('password')?.value || '';

        // Validate Phone Number
        const bdPhoneRegex = /^01[3-9]\d{8}$/;
        if (!bdPhoneRegex.test(phone)) {
            errorMsg.innerText = "অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)।";
            errorMsg.classList.remove('hidden');
            btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> অ্যাকাউন্ট তৈরি করুন';
            btn.disabled = false;
            return;
        }

        try {
            const response = await fetch('/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: name,
                    username: name,
                    phone: phone,
                    email: email || (phone + '@physicsclassroombd.com'),
                    password: password 
                })
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                // Pre-fill login with registered phone
                sessionStorage.setItem('just_registered_user', phone);
                window.location.href = '/Views/Auth/login.html?registered=true';
            } else {
                errorMsg.innerText = data.message || "রেজিস্ট্রেশন সফল হয়নি। দয়া করে পুনরায় চেষ্টা করুন।";
                errorMsg.classList.remove('hidden');
            }
        } catch (err) {
            errorMsg.innerText = "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।";
            errorMsg.classList.remove('hidden');
        } finally {
            btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> অ্যাকাউন্ট তৈরি করুন';
            btn.disabled = false;
        }
    });
}
