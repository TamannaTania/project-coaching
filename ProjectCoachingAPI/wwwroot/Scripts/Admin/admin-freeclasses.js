// admin-freeclasses.js - Admin Free Classes Management Logic
// @ts-nocheck
const token = localStorage.getItem('token');
let editId = null;
const role = (typeof getUserRole === 'function') ? getUserRole() : localStorage.getItem('role');
    if (!token || (role && role.toString().trim().toLowerCase() !== 'admin')) {
    window.location.href = '/Views/Auth/login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
}

async function loadClasses() {
    try {
        const res = await fetch('/api/FreeClasses');
        const classes = await res.json();
        const container = document.getElementById('teachersList');
        container.innerHTML = '';

        if (!classes || classes.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center text-slate-400 py-10">No free classes added yet.</div>';
            return;
        }

        classes.forEach(fc => {
            container.innerHTML += `
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-6">
                <img src="${fc.thumbnailUrl}" class="w-32 h-20 object-cover rounded-xl bg-slate-100">
                <div class="flex-1">
                    <div class="text-xs font-bold text-red-500 uppercase">${fc.category || 'General'}</div>
                    <h3 class="text-xl font-bold text-slate-800">${fc.title}</h3>
                    <p class="text-slate-500 text-sm mt-1">${fc.description || ''}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editClass(${fc.id}, '${escapeForJs(fc.title)}', '${escapeForJs(fc.category || '')}', '${escapeForJs(fc.videoUrl || '')}', '${escapeForJs(fc.thumbnailUrl || '')}', '${escapeForJs(fc.description || '')}')" class="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-bold transition">Edit</button>
                    <button onclick="deleteClass(${fc.id})" class="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition">Delete</button>
                </div>
            </div>`;
        });
    } catch (err) {
        console.error(err);
    }
}

function escapeForJs(str) {
    if (!str) return '';
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '&quot;')
        .replace(/\n/g, ' ')
        .replace(/\r/g, '');
}

document.getElementById('freeClassForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let thumbnailUrl = document.getElementById('fcThumb').value;
    if (!thumbnailUrl || thumbnailUrl.trim() === '') {
        thumbnailUrl = 'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?auto=format&fit=crop&q=80&w=800';
    }

    const payload = {
        title: document.getElementById('fcTitle').value,
        category: document.getElementById('fcCategory').value,
        videoUrl: document.getElementById('fcVideo').value,
        thumbnailUrl: thumbnailUrl,
        description: document.getElementById('fcDesc').value,
        orderIndex: 0
    };

    if (editId) {
        payload.id = editId;
        await fetch('/api/FreeClasses/' + editId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(payload)
        });
        editId = null;
        document.getElementById('saveBtn').innerText = 'Add Class';
    } else {
        await fetch('/api/FreeClasses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(payload)
        });
    }

    document.getElementById('freeClassForm').reset();
    loadClasses();
});

function editClass(id, title, category, videoUrl, thumb, desc) {
    editId = id;
    document.getElementById('fcTitle').value = title;
    document.getElementById('fcCategory').value = category || '';
    document.getElementById('fcVideo').value = videoUrl;
    document.getElementById('fcThumb').value = thumb;
    document.getElementById('fcDesc').value = desc || '';
    document.getElementById('saveBtn').innerText = 'Update Class';
    document.getElementById('saveBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function deleteClass(id) {
    if(!confirm("Are you sure?")) return;
    await fetch('/api/FreeClasses/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    loadClasses();
}

loadClasses();
