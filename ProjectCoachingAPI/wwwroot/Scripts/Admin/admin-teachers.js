// admin-teachers.js - Admin Teacher Management Logic
// @ts-nocheck
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/Views/Auth/login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
}

let editingId = null;
let allTeachers = [];

window.editTeacher = function(id) {
    const t = allTeachers.find(x => x.id === id);
    if(!t) return;
    
    editingId = id;
    document.getElementById('tName').value = t.name;
    document.getElementById('tDesignation').value = t.designation || '';
    document.getElementById('tSubject').value = t.subject || '';
    document.getElementById('tImage').value = t.imageUrl || '';
    document.getElementById('tBio').value = t.bio || '';
    document.getElementById('tFacebook').value = t.facebookUrl || '';
    document.getElementById('tLinkedIn').value = t.linkedInUrl || '';
    
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-pen text-blue-500"></i> Edit Teacher';
    document.getElementById('submitBtn').innerHTML = '<i class="fa-solid fa-save"></i> Update Teacher';
    document.getElementById('submitBtn').classList.replace('bg-purple-600', 'bg-blue-600');
    document.getElementById('submitBtn').classList.replace('hover:bg-purple-700', 'hover:bg-blue-700');
    
    document.getElementById('cancelEditBtn').classList.remove('hidden');
};

window.cancelEdit = function() {
    editingId = null;
    document.getElementById('teacherForm').reset();
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-user-plus text-purple-500"></i> Add New Teacher';
    document.getElementById('submitBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Save Teacher';
    document.getElementById('submitBtn').classList.replace('bg-blue-600', 'bg-purple-600');
    document.getElementById('submitBtn').classList.replace('hover:bg-blue-700', 'hover:bg-purple-700');
    document.getElementById('cancelEditBtn').classList.add('hidden');
};

async function uploadImage(input) {
    if(!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const btn = input.previousElementSibling.querySelector('button');
    const originalIcon = btn ? btn.innerHTML : '';
    if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    try {
        const response = await fetch('/api/Uploads', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });
        if(response.ok) {
            const data = await response.json();
            document.getElementById('tImage').value = data.url;
        } else {
            alert("Upload failed.");
        }
    } catch(e) {
        alert("Upload error.");
    } finally {
        if (btn) btn.innerHTML = originalIcon;
        input.value = '';
    }
}

async function loadTeachers() {
    try {
        const response = await fetch('/api/Teachers');
        if(!response.ok) throw new Error("Failed");
        const teachers = await response.json();
        allTeachers = teachers;
        
        const list = document.getElementById('teachersList');
        list.innerHTML = '';
        
        if(!teachers || teachers.length === 0) {
            list.innerHTML = '<div class="p-8 text-center bg-slate-50 rounded-xl text-slate-500">No teachers found. Add one!</div>';
            return;
        }

        teachers.forEach(t => {
            const imgUrl = t.imageUrl || 'https://via.placeholder.com/150';
            list.innerHTML += `
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 transition">
                    <div class="flex items-center gap-4">
                        <img src="${imgUrl}" class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm">
                        <div>
                            <h3 class="font-bold text-slate-800 text-lg">${t.name}</h3>
                            <p class="text-sm text-slate-500">${t.designation || ''} ${t.subject ? ' - ' + t.subject : ''}</p>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <button onclick="editTeacher(${t.id})" class="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center transition mr-2">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="deleteTeacher(${t.id})" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 w-10 h-10 rounded-full flex items-center justify-center transition">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    } catch(e) {
        document.getElementById('teachersList').innerHTML = '<div class="text-red-500 p-4">Error loading teachers</div>';
    }
}

document.getElementById('teacherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    const teacher = {
        name: document.getElementById('tName').value,
        designation: document.getElementById('tDesignation').value || '',
        subject: document.getElementById('tSubject').value || '',
        imageUrl: document.getElementById('tImage').value || '',
        bio: document.getElementById('tBio').value || '',
        facebookUrl: document.getElementById('tFacebook').value || '',
        linkedInUrl: document.getElementById('tLinkedIn').value || ''
    };

    try {
        let url = '/api/Teachers';
        let method = 'POST';
        if(editingId) {
            url = '/api/Teachers/' + editingId;
            method = 'PUT';
            teacher.id = editingId;
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(teacher)
        });
        
        if(response.ok) {
            cancelEdit();
            loadTeachers();
        } else {
            const err = await response.json(); 
            alert("Failed to save teacher: " + (err.message || JSON.stringify(err)));
        }
    } catch(e) {
        alert("Error connecting to server.");
    } finally {
        btn.innerHTML = editingId ? '<i class="fa-solid fa-save"></i> Update Teacher' : '<i class="fa-solid fa-plus"></i> Save Teacher';
        btn.disabled = false;
    }
});

async function deleteTeacher(id) {
    if(!confirm("Are you sure you want to delete this teacher?")) return;
    try {
        const res = await fetch('/api/Teachers/' + id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if(res.ok) {
            loadTeachers();
        } else {
            alert("Failed to delete.");
        }
    } catch(e) {
        alert("Error connecting to server.");
    }
}

loadTeachers();
