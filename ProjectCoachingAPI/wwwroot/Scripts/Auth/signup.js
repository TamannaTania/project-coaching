// signup.js - Signup logic
// @ts-nocheck

const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = document.getElementById('submitBtn');
        const msgBox = document.getElementById('message');
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        btn.innerText = 'অপেক্ষা করুন...';
        btn.disabled = true;
        msgBox.style.display = 'none';
        msgBox.className = '';

        try {
            const response = await fetch('/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Name: name, Email: email, Password: password })
            });

            if (response.ok) {
                msgBox.innerText = "অভিনন্দন! আপনার একাউন্ট সফলভাবে তৈরি হয়েছে।";
                msgBox.classList.add('msg-success');
                signupForm.reset();
                setTimeout(() => {
                    window.location.href = '/Views/Auth/login.html';
                }, 1500);
            } else {
                const errorText = await response.text();
                msgBox.innerText = errorText || "দুঃখিত, কোনো একটি সমস্যা হয়েছে!";
                msgBox.classList.add('msg-error');
            }
        } catch (error) {
            msgBox.innerText = "সার্ভারের সাথে কানেক্ট করা যাচ্ছে না। দয়া করে নিশ্চিত করুন আপনার Visual Studio তে API রান করা আছে।";
            msgBox.classList.add('msg-error');
        } finally {
            btn.innerText = 'সাইন আপ করুন';
            btn.disabled = false;
            msgBox.style.display = 'block';
        }
    });
}
