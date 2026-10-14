// register.js - User Registration Logic
// @ts-nocheck

const existingToken = localStorage.getItem('token');
if (existingToken) {
    window.location.href = '/Views/Profile/profile.html';
}

const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const errorMsg = document.getElementById('errorMsg');
        btn.innerText = 'Creating...';
        btn.disabled = true;
        errorMsg.classList.add('hidden');

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                window.location.href = '/Views/Auth/login.html';
            } else {
                const data = await response.json();
                errorMsg.innerText = data.message || "Registration failed.";
                errorMsg.classList.remove('hidden');
            }
        } catch (err) {
            errorMsg.innerText = "Connection error.";
            errorMsg.classList.remove('hidden');
        } finally {
            btn.innerText = 'Register';
            btn.disabled = false;
        }
    });
}
