// register.js - Simplified Registration (Name, Phone/Email, Password)
// @ts-nocheck

const existingToken = localStorage.getItem('token');
if (existingToken) {
    window.location.href = '/Views/Profile/profile.html';
}

const regForm = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const passwordInput = document.getElementById('password');
const toggleEyeIcon = document.getElementById('toggleEyeIcon');

// Password Visibility Toggle
if (togglePasswordBtn && passwordInput && toggleEyeIcon) {
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        toggleEyeIcon.classList.toggle('fa-eye', !isPassword);
        toggleEyeIcon.classList.toggle('fa-eye-slash', isPassword);
    });
}

if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (errorMsg) errorMsg.classList.add('hidden');
        if (successMsg) successMsg.classList.add('hidden');

        const name = (document.getElementById('username')?.value || '').trim();
        const identifier = (document.getElementById('identifier')?.value || '').trim();
        const password = passwordInput?.value || '';

        if (!name) {
            showError("Please enter your full name.");
            return;
        }

        if (!identifier) {
            showError("Please enter your phone number or email address.");
            return;
        }

        if (password.length < 4) {
            showError("Password must be at least 4 characters long.");
            return;
        }

        // Determine whether identifier is Phone or Email
        let phone = null;
        let email = null;

        if (identifier.includes('@') && identifier.includes('.')) {
            email = identifier.toLowerCase();
        } else {
            // Clean phone number
            let p = identifier.replace(/[\s\-]/g, '');
            if (p.startsWith('+88')) p = p.substring(3);
            else if (p.startsWith('88')) p = p.substring(2);

            if (!/^01[3-9]\d{8}$/.test(p)) {
                showError("Please enter a valid 11-digit phone number (e.g. 01712345678) or a valid email address.");
                return;
            }
            phone = p;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Creating Account...';

        try {
            // Single-device session tracking deviceId
            let deviceId = localStorage.getItem('deviceId');
            if (!deviceId) {
                deviceId = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
                localStorage.setItem('deviceId', deviceId);
            }

            const response = await fetch('/api/Auth/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Device-Id': deviceId
                },
                body: JSON.stringify({
                    name: name,
                    username: name,
                    phone: phone,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (successMsg) {
                    successMsg.innerText = "Account created successfully! Logging you in...";
                    successMsg.classList.remove('hidden');
                }

                // If JWT token returned, auto login immediately
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role || 'Student');
                    localStorage.setItem('username', data.name || data.username || name);
                    if (data.email) localStorage.setItem('email', data.email);
                    if (data.phone) localStorage.setItem('phone', data.phone);
                    if (data.deviceId) localStorage.setItem('deviceId', data.deviceId);

                    setTimeout(() => {
                        const urlParams = new URLSearchParams(window.location.search);
                        const returnUrl = urlParams.get('returnUrl');
                        if (returnUrl) {
                            window.location.href = returnUrl;
                        } else {
                            window.location.href = '/Views/Profile/profile.html';
                        }
                    }, 800);
                } else {
                    setTimeout(() => {
                        window.location.href = '/Views/Auth/login.html';
                    }, 1000);
                }
            } else {
                showError(data.message || 'Unable to create account. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        } catch (err) {
            console.error(err);
            showError("Network error! Please check your connection and try again.");
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

function showError(msg) {
    if (errorMsg) {
        errorMsg.innerText = msg;
        errorMsg.classList.remove('hidden');
    }
}
