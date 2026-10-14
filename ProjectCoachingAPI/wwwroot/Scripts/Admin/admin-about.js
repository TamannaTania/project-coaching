// admin-about.js - Admin About Us Management Logic
// @ts-nocheck
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/Views/Auth/login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
}

async function loadAbout() {
    try {
        const res = await fetch('/api/About');
        if(res.ok) {
            const data = await res.json();
            document.getElementById('abTitle').value = data.title || '';
            document.getElementById('abImg').value = data.imageUrl || '';
            document.getElementById('abDesc').value = data.description || '';
            
            const container = document.getElementById('teachersList');
            container.innerHTML = `
                <div class="text-center">
                    <img src="${data.imageUrl}" class="w-full max-h-64 object-cover rounded-xl mb-4">
                    <h3 class="text-2xl font-bold mb-2">${data.title}</h3>
                    <p class="text-slate-600">${data.description}</p>
                </div>
            `;
        }
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('aboutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('abImgFile');
    let imageUrl = document.getElementById('abImg').value;

    if (fileInput && fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        try {
            const uploadRes = await fetch('/api/Uploads', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData
            });
            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
            }
        } catch (e) {
            console.error("Upload failed", e);
        }
    }

    if (!imageUrl || imageUrl.trim() === '') {
        imageUrl = 'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?auto=format&fit=crop&q=80&w=800';
    }

    const payload = {
        title: document.getElementById('abTitle').value,
        imageUrl: imageUrl,
        description: document.getElementById('abDesc').value
    };

    await fetch('/api/About', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(payload)
    });
    alert("Updated successfully!");
    loadAbout();
});

loadAbout();
