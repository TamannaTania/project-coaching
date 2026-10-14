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
    }).then(r => {
        if (r.ok) {
            const dest = (isExplicitAppMode && window.innerWidth <= 640) ? '/Views/App/app.html' : (urlParams.get('returnUrl') || '/');
            window.location.href = dest;
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
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
            localStorage.setItem('username', data.username || email);
            localStorage.setItem('email', data.email || email);
            if (data.deviceId) localStorage.setItem('deviceId', data.deviceId);
            
            const returnUrl = urlParams.get('returnUrl');
            if (returnUrl) {
                window.location.href = returnUrl;
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
