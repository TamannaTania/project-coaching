// login.js - User Authentication & Single-Session Takeover Logic
// @ts-nocheck

const urlParams = new URLSearchParams(window.location.search);
const isExplicitAppMode = urlParams.get('app') === 'true';
if (isExplicitAppMode && window.innerWidth <= 640) {
    sessionStorage.setItem('isApp', 'true');
} else {
    sessionStorage.removeItem('isApp');
}

const existingToken = localStorage.getItem('token');
if (existingToken) {
    fetch('/api/Auth/validate-session', {
        headers: {
            'Authorization': 'Bearer ' + existingToken,
            'X-Device-Id': localStorage.getItem('deviceId') || ''
        }
    }).then(async r => {
        if (r.ok) {
            const data = await r.json().catch(() => ({}));
            if (data && data.role) {
                localStorage.setItem('role', data.role);
            }
            if (data && data.username) {
                localStorage.setItem('username', data.username);
            }
            const returnUrl = urlParams.get('returnUrl');
            if (returnUrl) {
                window.location.href = returnUrl;
            } else if ((data.role || localStorage.getItem('role') || '').toLowerCase() === 'admin') {
                window.location.href = '/Views/Admin/admin.html';
            } else if (isExplicitAppMode && window.innerWidth <= 640) {
                window.location.href = '/Views/App/app.html';
            } else {
                window.location.href = '/';
            }
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
        }
    }).catch(() => {});
}

async function doLogin(forceLogin = false) {
    const btn = document.getElementById('submitBtn');
    const errorMsg = document.getElementById('errorMsg');
    const alreadyBox = document.getElementById('alreadyLoggedInBox');
    btn.innerText = 'Logging in...';
    btn.disabled = true;
    errorMsg.classList.add('hidden');
    alreadyBox.classList.add('hidden');

    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const deviceId = localStorage.getItem('deviceId') || 'web-' + Math.random().toString(36).substring(7);
        localStorage.setItem('deviceId', deviceId);

        const response = await fetch('/api/Auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password, deviceId: deviceId, forceLogin: forceLogin })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            const studentName = data.name || data.fullName || data.Name || data.FullName || data.username || data.Username || email;
            localStorage.setItem('username', studentName);
            localStorage.setItem('fullName', studentName);
            localStorage.setItem('name', studentName);
            
            const studentPhone = data.phone || data.Phone || '';
            const studentEmail = data.email || data.Email || '';
            localStorage.setItem('phone', studentPhone);
            localStorage.setItem('email', studentEmail);

            const userRole = data.role || data.Role || 'Student';
            localStorage.setItem('role', userRole);

            localStorage.setItem('user', JSON.stringify({
                fullName: studentName,
                name: studentName,
                userName: studentName,
                phone: studentPhone,
                email: studentEmail,
                role: userRole
            }));
            if (data.deviceId) localStorage.setItem('deviceId', data.deviceId);

            // Handle Remember Me
            const rememberCheckbox = document.getElementById('rememberMe');
            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem('remember_me', 'true');
                localStorage.setItem('remembered_username', email);
            } else {
                localStorage.removeItem('remember_me');
                localStorage.removeItem('remembered_username');
            }
            
            const returnUrl = urlParams.get('returnUrl');
            if (returnUrl) {
                window.location.href = returnUrl;
            } else if (userRole.toLowerCase() === 'admin') {
                window.location.href = '/Views/Admin/admin.html';
            } else if (isExplicitAppMode && window.innerWidth <= 640) {
                window.location.href = '/Views/App/app.html';
            } else {
                window.location.href = '/';
            }
        } else {
            const text = await response.text();
            if (text.toLowerCase().includes('already logged in')) {
                alreadyBox.classList.remove('hidden');
            } else {
                errorMsg.innerText = text || "Invalid credentials.";
                errorMsg.classList.remove('hidden');
            }
        }
    } catch (err) {
        errorMsg.innerText = "Connection error.";
        errorMsg.classList.remove('hidden');
    } finally {
        btn.innerText = 'Login';
        btn.disabled = false;
    }
}

// Remember Me Auto-fill on Load
const rememberCheckbox = document.getElementById('rememberMe');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

if (localStorage.getItem('remember_me') === 'true') {
    const savedUsername = localStorage.getItem('remembered_username');
    if (savedUsername && usernameInput) {
        usernameInput.value = savedUsername;
        if (rememberCheckbox) rememberCheckbox.checked = true;
        if (passwordInput) setTimeout(() => passwordInput.focus(), 150);
    }
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        doLogin(false);
    });
}

const forceBtn = document.getElementById('forceLoginBtn');
if (forceBtn) {
    forceBtn.addEventListener('click', () => {
        doLogin(true);
    });
}

// --- Forgot Password Modal Logic (Multi-step interactive reset) ---
const forgotBtn = document.getElementById('forgotPasswordBtn');
const forgotModal = document.getElementById('forgotPasswordModal');
const closeForgotModal = document.getElementById('closeForgotModal');
const forgotEmailInput = document.getElementById('forgotEmailInput');
const verifyAccountBtn = document.getElementById('verifyAccountBtn');
const forgotAlert = document.getElementById('forgotAlert');

const forgotStep1 = document.getElementById('forgotStep1');
const forgotStep2 = document.getElementById('forgotStep2');
const forgotStep3 = document.getElementById('forgotStep3');
const verifiedUserEmail = document.getElementById('verifiedUserEmail');

const newPasswordInput = document.getElementById('newPasswordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');
const step2Alert = document.getElementById('step2Alert');
const backToStep1Btn = document.getElementById('backToStep1Btn');
const saveNewPasswordBtn = document.getElementById('saveNewPasswordBtn');
const useNewPasswordToLoginBtn = document.getElementById('useNewPasswordToLoginBtn');

let activeVerifiedEmail = '';

function resetForgotModalState() {
    if (forgotStep1) forgotStep1.classList.remove('hidden');
    if (forgotStep2) forgotStep2.classList.add('hidden');
    if (forgotStep3) forgotStep3.classList.add('hidden');
    if (forgotAlert) forgotAlert.classList.add('hidden');
    if (step2Alert) step2Alert.classList.add('hidden');
    if (newPasswordInput) newPasswordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';
}

function showForgotModal() {
    if (!forgotModal) return;
    resetForgotModalState();
    if (usernameInput && usernameInput.value.trim() && forgotEmailInput) {
        forgotEmailInput.value = usernameInput.value.trim();
    }
    forgotModal.classList.remove('hidden');
    if (forgotEmailInput) setTimeout(() => forgotEmailInput.focus(), 150);
}

function hideForgotModal() {
    if (forgotModal) forgotModal.classList.add('hidden');
}

if (forgotBtn) {
    forgotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showForgotModal();
    });
}

if (closeForgotModal) closeForgotModal.addEventListener('click', hideForgotModal);
if (forgotModal) {
    forgotModal.addEventListener('click', (e) => {
        if (e.target === forgotModal) hideForgotModal();
    });
}

// Step 1: Verify Account
if (verifyAccountBtn) {
    verifyAccountBtn.addEventListener('click', async () => {
        const email = forgotEmailInput ? forgotEmailInput.value.trim() : '';
        if (!email) {
            if (forgotAlert) {
                forgotAlert.className = 'mb-4 p-3 rounded-lg text-sm font-medium bg-red-50 text-red-600 block';
                forgotAlert.innerText = 'অনুগ্রহ করে আপনার ইমেইল বা ইউজারনেম দিন।';
            }
            return;
        }

        verifyAccountBtn.disabled = true;
        verifyAccountBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> যাচাই করা হচ্ছে...';
        if (forgotAlert) forgotAlert.classList.add('hidden');

        try {
            const res = await fetch('/api/Auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                const data = await res.json();
                activeVerifiedEmail = data.email || email;
                if (verifiedUserEmail) verifiedUserEmail.innerText = activeVerifiedEmail;
                if (forgotStep1) forgotStep1.classList.add('hidden');
                if (forgotStep2) forgotStep2.classList.remove('hidden');
                if (newPasswordInput) setTimeout(() => newPasswordInput.focus(), 150);
            } else {
                const errText = await res.text();
                if (forgotAlert) {
                    forgotAlert.className = 'mb-4 p-3 rounded-lg text-sm font-medium bg-red-50 text-red-600 block';
                    forgotAlert.innerText = errText || 'কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।';
                }
            }
        } catch (err) {
            if (forgotAlert) {
                forgotAlert.className = 'mb-4 p-3 rounded-lg text-sm font-medium bg-red-50 text-red-600 block';
                forgotAlert.innerText = 'সার্ভার সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।';
            }
        } finally {
            verifyAccountBtn.disabled = false;
            verifyAccountBtn.innerHTML = '<span>অ্যাকাউন্ট যাচাই করুন</span> <i class="fa-solid fa-arrow-right text-xs"></i>';
        }
    });
}

// Step 2: Back to Step 1
if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
        if (forgotStep2) forgotStep2.classList.add('hidden');
        if (forgotStep1) forgotStep1.classList.remove('hidden');
    });
}

// Step 2: Save New Password
if (saveNewPasswordBtn) {
    saveNewPasswordBtn.addEventListener('click', async () => {
        const newPassword = newPasswordInput ? newPasswordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

        if (!newPassword || newPassword.length < 4) {
            if (step2Alert) {
                step2Alert.className = 'p-3 rounded-lg text-sm font-medium bg-red-50 text-red-600 block';
                step2Alert.innerText = 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।';
            }
            return;
        }

        if (newPassword !== confirmPassword) {
            if (step2Alert) {
                step2Alert.className = 'p-3 rounded-lg text-sm font-medium bg-red-50 text-red-600 block';
                step2Alert.innerText = 'কনফার্ম পাসওয়ার্ডের সাথে নতুন পাসওয়ার্ড মেলেনি!';
            }
            return;
        }

        saveNewPasswordBtn.disabled = true;
        saveNewPasswordBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> সেভ হচ্ছে...';
        if (step2Alert) step2Alert.classList.add('hidden');

        try {
            const res = await fetch('/api/Auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: activeVerifiedEmail,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                })
            });

            if (res.ok) {
                if (forgotStep2) forgotStep2.classList.add('hidden');
                if (forgotStep3) forgotStep3.classList.remove('hidden');
            } else {
                const errText = await res.text();
                if (step2Alert) {
                    step2Alert.className = 'p-3 rounded-lg text-sm font-medium bg-red-50 text-red-600 block';
                    step2Alert.innerText = errText || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।';
                }
            }
        } catch (err) {
            if (step2Alert) {
                step2Alert.className = 'p-3 rounded-lg text-sm font-medium bg-red-50 text-red-600 block';
                step2Alert.innerText = 'সার্ভারে সংযোগ দেওয়া যায়নি।';
            }
        } finally {
            saveNewPasswordBtn.disabled = false;
            saveNewPasswordBtn.innerHTML = '<span>পাসওয়ার্ড সেভ করুন</span> <i class="fa-solid fa-check text-xs"></i>';
        }
    });
}

// Step 3: Login with New Password
if (useNewPasswordToLoginBtn) {
    useNewPasswordToLoginBtn.addEventListener('click', () => {
        hideForgotModal();
        if (usernameInput) usernameInput.value = activeVerifiedEmail;
        if (passwordInput && newPasswordInput) passwordInput.value = newPasswordInput.value;
        const loginBtn = document.getElementById('submitBtn');
        if (loginBtn) loginBtn.focus();
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const registeredPhone = sessionStorage.getItem('just_registered_user');
    if (registeredPhone && document.getElementById('username')) {
        document.getElementById('username').value = registeredPhone;
        sessionStorage.removeItem('just_registered_user');
        const err = document.getElementById('errorMsg');
        if (err) {
            err.className = 'bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm font-medium text-center border border-emerald-200';
            err.innerText = 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! এবার পাসওয়ার্ড দিয়ে লগইন করুন।';
            err.classList.remove('hidden');
        }
    }
});
