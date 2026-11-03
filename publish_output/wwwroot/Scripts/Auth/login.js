// login.js - User Authentication & Single-Session Takeover Logic (English UI)
// @ts-nocheck

// Session Lifespan & Remember Me Guard on Login Page Load
(function checkSessionLifespan() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const isRemembered = localStorage.getItem('remember_me') === 'true';
    const isSessionCookie = document.cookie.split('; ').some(row => row.startsWith('pc_session=active'));
    const isSessionStorage = sessionStorage.getItem('pc_session') === 'active';

    if (!isRemembered && !isSessionCookie && !isSessionStorage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('role');
        sessionStorage.removeItem('pc_session');
        document.cookie = "pc_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
})();

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
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Logging in...';
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
            const isRemember = rememberCheckbox && rememberCheckbox.checked;
            if (isRemember) {
                localStorage.setItem('remember_me', 'true');
                localStorage.setItem('remembered_username', email);
                document.cookie = "pc_session=active; path=/; max-age=2592000; SameSite=Lax";
            } else {
                localStorage.removeItem('remember_me');
                localStorage.removeItem('remembered_username');
                document.cookie = "pc_session=active; path=/; SameSite=Lax";
            }
            sessionStorage.setItem('pc_session', 'active');
            
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
            if (text.toLowerCase().includes('already logged in') || text.toLowerCase().includes('device')) {
                alreadyBox.classList.remove('hidden');
            } else {
                errorMsg.innerText = text || "Invalid phone/email or password.";
                errorMsg.classList.remove('hidden');
            }
        }
    } catch (err) {
        errorMsg.innerText = "Network connection error. Please try again.";
        errorMsg.classList.remove('hidden');
    } finally {
        btn.innerHTML = '<span>Log In</span> <i class="fa-solid fa-arrow-right text-xs"></i>';
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
    }
    if (rememberCheckbox) {
        rememberCheckbox.checked = true;
    }
    if (passwordInput && savedUsername) {
        setTimeout(() => passwordInput.focus(), 150);
    }
} else {
    if (rememberCheckbox) {
        rememberCheckbox.checked = false;
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

// --- Forgot Password Modal Logic ---
const forgotBtn = document.getElementById('forgotPasswordBtn');
const forgotModal = document.getElementById('forgotPasswordModal');
const closeForgotModal = document.getElementById('closeForgotModal');
const forgotEmailInput = document.getElementById('forgotEmailInput');
const verifyAccountBtn = document.getElementById('verifyAccountBtn');
const forgotAlert = document.getElementById('forgotAlert');

const forgotStep1 = document.getElementById('forgotStep1');
const forgotStepOtp = document.getElementById('forgotStepOtp');
const forgotStep2 = document.getElementById('forgotStep2');
const forgotStep3 = document.getElementById('forgotStep3');

const forgotMaskedEmail = document.getElementById('forgotMaskedEmail');
const forgotOtpInput = document.getElementById('forgotOtpInput');
const forgotCountdown = document.getElementById('forgotCountdown');
const forgotOtpAlert = document.getElementById('forgotOtpAlert');
const forgotBackTo1Btn = document.getElementById('forgotBackTo1Btn');
const verifyOtpCodeBtn = document.getElementById('verifyOtpCodeBtn');
const forgotResendBtn = document.getElementById('forgotResendBtn');

const verifiedUserEmail = document.getElementById('verifiedUserEmail');
const newPasswordInput = document.getElementById('newPasswordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');
const step2Alert = document.getElementById('step2Alert');
const saveNewPasswordBtn = document.getElementById('saveNewPasswordBtn');
const useNewPasswordToLoginBtn = document.getElementById('useNewPasswordToLoginBtn');

let activeVerifiedEmail = '';
let activeVerifiedOtp = '';
let forgotOtpTimer = null;
let forgotResendTimer = null;

function startForgotCountdown(durationMinutes = 10) {
    if (forgotOtpTimer) clearInterval(forgotOtpTimer);
    let secondsLeft = durationMinutes * 60;
    function update() {
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        if (forgotCountdown) {
            forgotCountdown.innerText = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        }
        if (secondsLeft <= 0) {
            clearInterval(forgotOtpTimer);
            if (forgotCountdown) forgotCountdown.innerText = '00:00 (Expired)';
            if (forgotOtpAlert) {
                forgotOtpAlert.className = 'p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                forgotOtpAlert.innerText = 'OTP code expired. Please click "Resend Code".';
            }
        }
        secondsLeft--;
    }
    update();
    forgotOtpTimer = setInterval(update, 1000);
}

function startForgotResendCooldown(seconds = 60) {
    if (forgotResendTimer) clearInterval(forgotResendTimer);
    if (!forgotResendBtn) return;
    forgotResendBtn.disabled = true;
    forgotResendBtn.classList.add('text-slate-400', 'cursor-not-allowed');
    forgotResendBtn.classList.remove('text-emerald-600', 'hover:text-emerald-700');

    let left = seconds;
    forgotResendBtn.innerText = `Resend (${left}s)`;
    forgotResendTimer = setInterval(() => {
        left--;
        if (left <= 0) {
            clearInterval(forgotResendTimer);
            forgotResendBtn.disabled = false;
            forgotResendBtn.innerText = 'Resend Code';
            forgotResendBtn.classList.remove('text-slate-400', 'cursor-not-allowed');
            forgotResendBtn.classList.add('text-emerald-600', 'hover:text-emerald-700');
        } else {
            forgotResendBtn.innerText = `Resend (${left}s)`;
        }
    }, 1000);
}

function resetForgotModalState() {
    if (forgotOtpTimer) clearInterval(forgotOtpTimer);
    if (forgotResendTimer) clearInterval(forgotResendTimer);
    if (forgotStep1) forgotStep1.classList.remove('hidden');
    if (forgotStepOtp) forgotStepOtp.classList.add('hidden');
    if (forgotStep2) forgotStep2.classList.add('hidden');
    if (forgotStep3) forgotStep3.classList.add('hidden');
    if (forgotAlert) forgotAlert.classList.add('hidden');
    if (forgotOtpAlert) forgotOtpAlert.classList.add('hidden');
    if (step2Alert) step2Alert.classList.add('hidden');
    if (forgotOtpInput) forgotOtpInput.value = '';
    if (newPasswordInput) newPasswordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';
    activeVerifiedEmail = '';
    activeVerifiedOtp = '';
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

// Step 1: Send OTP to User's Email
if (verifyAccountBtn) {
    verifyAccountBtn.addEventListener('click', async () => {
        const inputVal = forgotEmailInput ? forgotEmailInput.value.trim() : '';
        if (!inputVal) {
            if (forgotAlert) {
                forgotAlert.className = 'mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                forgotAlert.innerText = 'Please enter your phone number or email address.';
            }
            return;
        }

        verifyAccountBtn.disabled = true;
        verifyAccountBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending Code...';
        if (forgotAlert) forgotAlert.classList.add('hidden');

        try {
            const res = await fetch('/api/Auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inputVal })
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                activeVerifiedEmail = data.email || inputVal;
                if (forgotMaskedEmail) forgotMaskedEmail.innerText = data.maskedEmail || activeVerifiedEmail;
                if (forgotStep1) forgotStep1.classList.add('hidden');
                if (forgotStepOtp) forgotStepOtp.classList.remove('hidden');
                if (forgotOtpAlert) forgotOtpAlert.classList.add('hidden');
                if (forgotOtpInput) {
                    forgotOtpInput.value = '';
                    setTimeout(() => forgotOtpInput.focus(), 150);
                }
                startForgotCountdown(10);
                startForgotResendCooldown(60);
            } else {
                if (forgotAlert) {
                    forgotAlert.className = 'mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                    forgotAlert.innerText = data.message || 'No account found with this information. Please check and try again.';
                }
            }
        } catch (err) {
            if (forgotAlert) {
                forgotAlert.className = 'mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                forgotAlert.innerText = 'Server connection error. Please try again.';
            }
        } finally {
            verifyAccountBtn.disabled = false;
            verifyAccountBtn.innerHTML = '<span>Send Verification Code</span> <i class="fa-solid fa-paper-plane text-xs"></i>';
        }
    });
}

// Resend OTP
if (forgotResendBtn) {
    forgotResendBtn.addEventListener('click', async () => {
        if (forgotResendBtn.disabled) return;
        forgotResendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Sending...';
        forgotResendBtn.disabled = true;
        if (forgotOtpAlert) forgotOtpAlert.classList.add('hidden');

        try {
            const res = await fetch('/api/Auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: activeVerifiedEmail })
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                if (forgotOtpAlert) {
                    forgotOtpAlert.className = 'p-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 block text-center border border-emerald-200';
                    forgotOtpAlert.innerText = 'New verification code sent! Please check your inbox.';
                }
                startForgotCountdown(10);
                startForgotResendCooldown(60);
            } else {
                if (forgotOtpAlert) {
                    forgotOtpAlert.className = 'p-2.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center border border-rose-200';
                    forgotOtpAlert.innerText = data.message || 'Failed to send verification code.';
                }
                forgotResendBtn.disabled = false;
            }
        } catch (err) {
            if (forgotOtpAlert) {
                forgotOtpAlert.className = 'p-2.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center border border-rose-200';
                forgotOtpAlert.innerText = 'Unable to connect to server.';
            }
            forgotResendBtn.disabled = false;
        }
    });
}

// Back to Step 1
if (forgotBackTo1Btn) {
    forgotBackTo1Btn.addEventListener('click', () => {
        if (forgotOtpTimer) clearInterval(forgotOtpTimer);
        if (forgotResendTimer) clearInterval(forgotResendTimer);
        if (forgotStepOtp) forgotStepOtp.classList.add('hidden');
        if (forgotStep1) forgotStep1.classList.remove('hidden');
    });
}

// Step 1.5: Verify Entered OTP
if (verifyOtpCodeBtn) {
    verifyOtpCodeBtn.addEventListener('click', async () => {
        const code = (forgotOtpInput?.value || '').trim();
        if (!code || code.length < 6) {
            if (forgotOtpAlert) {
                forgotOtpAlert.className = 'p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                forgotOtpAlert.innerText = 'Please enter the full 6-digit OTP code.';
            }
            return;
        }

        verifyOtpCodeBtn.disabled = true;
        verifyOtpCodeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Verifying...';
        if (forgotOtpAlert) forgotOtpAlert.classList.add('hidden');

        try {
            const res = await fetch('/api/Auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: activeVerifiedEmail,
                    otpCode: code,
                    purpose: "ResetPassword"
                })
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                activeVerifiedOtp = code;
                if (verifiedUserEmail) verifiedUserEmail.innerText = activeVerifiedEmail;
                if (forgotStepOtp) forgotStepOtp.classList.add('hidden');
                if (forgotStep2) forgotStep2.classList.remove('hidden');
                if (newPasswordInput) setTimeout(() => newPasswordInput.focus(), 150);
            } else {
                if (forgotOtpAlert) {
                    forgotOtpAlert.className = 'p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                    forgotOtpAlert.innerText = data.message || 'Invalid or expired OTP code. Please try again.';
                }
            }
        } catch (err) {
            if (forgotOtpAlert) {
                forgotOtpAlert.className = 'p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                forgotOtpAlert.innerText = 'Server connection error.';
            }
        } finally {
            verifyOtpCodeBtn.disabled = false;
            verifyOtpCodeBtn.innerHTML = '<span>Verify Code</span> <i class="fa-solid fa-arrow-right text-xs"></i>';
        }
    });
}

// Step 2: Save New Password
if (saveNewPasswordBtn) {
    saveNewPasswordBtn.addEventListener('click', async () => {
        const newPassword = newPasswordInput ? newPasswordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

        if (!newPassword || newPassword.length < 4) {
            if (step2Alert) {
                step2Alert.className = 'p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                step2Alert.innerText = 'Password must be at least 4 characters long.';
            }
            return;
        }

        if (newPassword !== confirmPassword) {
            if (step2Alert) {
                step2Alert.className = 'p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                step2Alert.innerText = 'Passwords do not match!';
            }
            return;
        }

        saveNewPasswordBtn.disabled = true;
        saveNewPasswordBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Saving...';
        if (step2Alert) step2Alert.classList.add('hidden');

        try {
            const res = await fetch('/api/Auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: activeVerifiedEmail,
                    otpCode: activeVerifiedOtp,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                })
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                if (forgotStep2) forgotStep2.classList.add('hidden');
                if (forgotStep3) forgotStep3.classList.remove('hidden');
            } else {
                if (step2Alert) {
                    step2Alert.className = 'p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                    step2Alert.innerText = data.message || 'Password reset failed.';
                }
            }
        } catch (err) {
            if (step2Alert) {
                step2Alert.className = 'p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 block text-center';
                step2Alert.innerText = 'Server connection error.';
            }
        } finally {
            saveNewPasswordBtn.disabled = false;
            saveNewPasswordBtn.innerHTML = '<span>Save New Password</span> <i class="fa-solid fa-check text-xs"></i>';
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
            err.className = 'bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-bold text-center border border-emerald-200';
            err.innerText = 'Account created successfully! Please log in with your password.';
            err.classList.remove('hidden');
        }
    }
});
