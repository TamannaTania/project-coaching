// session-guard.js - Real-time Single Device / Single Session Enforcer
(function () {
    // 1. Ensure a persistent unique device ID for this browser
    let currentDeviceId = localStorage.getItem('deviceId');
    if (!currentDeviceId) {
        currentDeviceId = 'web-' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        localStorage.setItem('deviceId', currentDeviceId);
    }

    let isTerminating = false;

    // 2. Force Logout Handler & User Alert
    function triggerForceLogout(customMsg) {
        if (isTerminating) return;
        isTerminating = true;

        // Clear user session from storage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('user');
        sessionStorage.clear();

        // Pause any active HTML5 video
        try {
            const videos = document.querySelectorAll('video');
            videos.forEach(v => v.pause());
        } catch(e) {}

        // Remove old modal if exists
        const oldModal = document.getElementById('sessionTerminationModal');
        if (oldModal) oldModal.remove();

        // Render sleek logout notice modal
        const modal = document.createElement('div');
        modal.id = 'sessionTerminationModal';
        modal.className = 'fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 transform scale-100 transition-all font-sans">
                <div class="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-amber-200/60 shadow-sm">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </div>
                <h3 class="text-xl font-black text-slate-900 mb-2">সেশন শেষ হয়েছে</h3>
                <p class="text-sm text-slate-600 mb-6 leading-relaxed">
                    ${customMsg || 'অন্য একটি ব্রাউজার বা ডিভাইসে আপনার অ্যাকাউন্ট লগইন করা হয়েছে। নিরাপত্তা বজায় রাখতে এই ব্রাউজার থেকে স্বয়ংক্রিয়ভাবে লগআউট করা হলো।'}
                </p>
                <div class="space-y-2.5">
                    <button onclick="window.location.href='login.html'" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition text-sm">
                        পুনরায় লগইন করুন
                    </button>
                    <button onclick="window.location.reload()" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition text-xs">
                        গেস্ট হিসেবে পেজ দেখুন
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.triggerForceLogout = triggerForceLogout;

    // 3. Patch window.fetch to automatically include X-Device-Id and detect 401 SESSION_TERMINATED
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        let [resource, config] = args;
        config = config || {};
        config.headers = config.headers || {};

        const token = localStorage.getItem('token');
        const deviceId = localStorage.getItem('deviceId') || currentDeviceId;

        // Attach X-Device-Id and Authorization if not set
        if (config.headers instanceof Headers) {
            if (deviceId && !config.headers.has('X-Device-Id')) {
                config.headers.set('X-Device-Id', deviceId);
            }
            if (token && !config.headers.has('Authorization')) {
                config.headers.set('Authorization', 'Bearer ' + token);
            }
        } else if (Array.isArray(config.headers)) {
            if (deviceId) config.headers.push(['X-Device-Id', deviceId]);
            if (token) config.headers.push(['Authorization', 'Bearer ' + token]);
        } else {
            if (deviceId && !config.headers['X-Device-Id']) {
                config.headers['X-Device-Id'] = deviceId;
            }
            if (token && !config.headers['Authorization']) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
        }

        try {
            const response = await originalFetch(resource, config);
            
            // If server reports 401 with SESSION_TERMINATED
            if (response.status === 401 && localStorage.getItem('token')) {
                try {
                    const clone = response.clone();
                    const data = await clone.json();
                    if (data && (data.code === 'SESSION_TERMINATED' || data.sessionTerminated === true)) {
                        triggerForceLogout(data.message);
                    }
                } catch(e) {}
            }
            return response;
        } catch (err) {
            throw err;
        }
    };

    // 4. Periodic Heartbeat to validate session in real-time
    async function validateCurrentSession() {
        const token = localStorage.getItem('token');
        if (!token || isTerminating) return;

        const deviceId = localStorage.getItem('deviceId') || currentDeviceId;

        try {
            const res = await originalFetch('/api/Auth/validate-session', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'X-Device-Id': deviceId || ''
                }
            });

            if (res.status === 401) {
                let msg = '';
                try {
                    const data = await res.json();
                    msg = data.message;
                } catch(e) {}
                triggerForceLogout(msg);
            }
        } catch(e) {
            // Ignore transient network errors
        }
    }

    // Run check on page load if logged in
    if (localStorage.getItem('token')) {
        validateCurrentSession();
    }

    // Run check when user switches back to this browser tab
    window.addEventListener('focus', validateCurrentSession);

    // Heartbeat: run check every 5 seconds
    setInterval(validateCurrentSession, 5000);
})();
