// admin-success.js - Admin Success Students Management Logic
// @ts-nocheck
const token = localStorage.getItem('token');
let editId = null;
if (!token) {
    window.location.href = '/Views/Auth/login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
}

async function loadStudents() {
    try {
        const res = await fetch('/api/SuccessStudents');
        const data = await res.json();
        const container = document.getElementById('teachersList');
        container.innerHTML = '';
        
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center text-slate-400 py-10">No students added yet.</div>';
            return;
        }

        data.forEach(s => {
            const imgUrl = s.imageUrl || 'https://via.placeholder.com/150?text=Student';
            container.innerHTML += `
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-6">
                <img src="${imgUrl}" class="w-20 h-20 object-cover rounded-full bg-slate-100">
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-slate-800">${s.name}</h3>
                    <p class="text-emerald-600 font-bold">${s.institution}</p>
                    <p class="text-slate-500 text-sm mt-1">${s.batch}</p>
                </div>
                
                <div class="flex gap-2">
                    <button onclick="editStudent(${s.id}, '${escapeForJs(s.name)}', '${escapeForJs(s.institution)}', '${escapeForJs(s.batch)}', '${escapeForJs(s.imageUrl || '')}')" class="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-bold transition">Edit</button>
                    <button onclick="deleteStudent(${s.id})" class="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition">Delete</button>
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

document.getElementById('successForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('ssImgFile');
    let imageUrl = document.getElementById('ssImg').value;

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
        imageUrl = 'https://via.placeholder.com/150?text=Student';
    }

    const payload = {
        name: document.getElementById('ssName').value,
        institution: document.getElementById('ssUni').value,
        batch: document.getElementById('ssBatch').value,
        imageUrl: imageUrl,
        orderIndex: 0
    };

    if (editId) {
        payload.id = editId;
        await fetch('/api/SuccessStudents/' + editId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(payload)
        });
        editId = null;
        document.getElementById('saveBtn').innerText = 'Add Student';
    } else {
        await fetch('/api/SuccessStudents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(payload)
        });
    }

    document.getElementById('successForm').reset();
    if (fileInput) fileInput.value = '';
    loadStudents();
});

function editStudent(id, name, institution, batch, img) {
    editId = id;
    document.getElementById('ssName').value = name;
    document.getElementById('ssUni').value = institution;
    document.getElementById('ssBatch').value = batch;
    document.getElementById('ssImg').value = img;
    document.getElementById('saveBtn').innerText = 'Update Student';
    document.getElementById('saveBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function deleteStudent(id) {
    if(!confirm("Are you sure?")) return;
    await fetch('/api/SuccessStudents/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    loadStudents();
}

loadStudents();
