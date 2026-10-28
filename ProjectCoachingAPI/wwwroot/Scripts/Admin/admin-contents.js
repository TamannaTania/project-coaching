// admin-contents.js - Admin Course Chapters & Content Management Logic
// @ts-nocheck
const token = localStorage.getItem('token');
const role = (typeof getUserRole === 'function') ? getUserRole() : localStorage.getItem('role');
    if (!token || (role && role.toString().trim().toLowerCase() !== 'admin')) {
    window.location.href = '/Views/Auth/login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
}

// Custom Dropdown Logic
function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    const icon = document.getElementById('dropdownIcon');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        setTimeout(() => {
            menu.classList.remove('scale-95', 'opacity-0');
            menu.classList.add('scale-100', 'opacity-100');
        }, 10);
        icon.style.transform = 'rotate(180deg)';
    } else {
        closeDropdown();
    }
}

function closeDropdown() {
    const menu = document.getElementById('dropdownMenu');
    const icon = document.getElementById('dropdownIcon');
    menu.classList.remove('scale-100', 'opacity-100');
    menu.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { menu.classList.add('hidden'); }, 200);
    icon.style.transform = 'rotate(0deg)';
}

function selectCourse(id, title) {
    document.getElementById('courseSelect').value = id;
    document.getElementById('dropdownSelectedText').innerText = title;
    closeDropdown();
    
    // Highlight selected option
    document.querySelectorAll('.dropdown-opt').forEach(el => {
        el.classList.remove('bg-emerald-50', 'border-emerald-200', 'text-emerald-700');
        el.classList.add('border-transparent', 'text-slate-700', 'hover:bg-slate-50');
    });
    const selectedOpt = document.getElementById('opt-' + id);
    if(selectedOpt) {
        selectedOpt.classList.remove('border-transparent', 'text-slate-700', 'hover:bg-slate-50');
        selectedOpt.classList.add('bg-emerald-50', 'border-emerald-200', 'text-emerald-700');
    }

    loadCourseDetails();
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('customDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        closeDropdown();
    }
});

async function loadCourses() {
    try {
        const res = await fetch('/api/Courses');
        const courses = await res.json();
        const container = document.getElementById('dropdownOptions');
        
        // Default option
        let html = `<div onclick="selectCourse('', '-- Choose a Course --')" class="dropdown-opt cursor-pointer px-4 py-3 rounded-lg border border-transparent text-slate-700 hover:bg-slate-50 transition flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><i class="fa-solid fa-minus text-slate-400"></i></div>
                        <span class="font-medium">-- Choose a Course --</span>
                    </div>`;

        courses.forEach(c => {
            html += `<div id="opt-${c.id}" onclick="selectCourse('${c.id}', '${c.title}')" class="dropdown-opt cursor-pointer px-4 py-3 rounded-lg border border-transparent text-slate-700 hover:bg-slate-50 transition flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><i class="fa-solid fa-graduation-cap text-emerald-600"></i></div>
                        <div>
                            <div class="font-bold">${c.title}</div>
                            <div class="text-xs text-slate-400">ID: ${c.id}</div>
                        </div>
                    </div>`;
        });
        
        container.innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

async function loadCourseDetails() {
    const courseId = document.getElementById('courseSelect').value;
    if(!courseId) {
        document.getElementById('contentArea').classList.add('hidden');
        return;
    }

    try {
        const res = await fetch('/api/Courses/' + courseId, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const course = await res.json();
        
        document.getElementById('courseTitleDisplay').innerText = `Chapters for: ${course.title}`;
        document.getElementById('contentArea').classList.remove('hidden');

        // Remember currently open chapters so update doesn't collapse them
        const openChapterIds = Array.from(document.querySelectorAll('[id^="chapter-content-"]'))
            .filter(el => !el.classList.contains('hidden'))
            .map(el => el.id.replace('chapter-content-', ''));

        const container = document.getElementById('chaptersContainer');
        container.innerHTML = '';

        if(course.chapters && course.chapters.length > 0) {
            course.chapters.forEach(ch => {
                const isPreviouslyOpen = openChapterIds.includes(String(ch.id));
                let html = `
                <div class="admin-chapter-card bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transform transition duration-200 hover:shadow-md">
                    <!-- Chapter Header -->
                    <div class="bg-slate-800 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-slate-700 transition" onclick="toggleChapter(${ch.id})">
                        <div class="flex items-center gap-3 text-white">
                            <div class="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                <i class="fa-solid fa-folder-open text-emerald-400 text-lg"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg">${ch.title}</h3>
                                <div class="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Order: ${ch.orderIndex || 0}</div>
                            </div>
                        </div>
                        <div class="flex gap-2 w-full sm:w-auto">
                            <button onclick="event.stopPropagation(); showContentModal(${ch.id})" class="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center gap-2">
                                <i class="fa-solid fa-plus"></i> Add Content
                            </button>
                            <button onclick="event.stopPropagation(); openEditChapterModal(${ch.id}, '${escapeForJs(ch.title)}', ${ch.orderIndex || 0})" class="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center gap-1.5" title="Edit Chapter">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button onclick="event.stopPropagation(); deleteChapter(${ch.id})" class="bg-red-500 hover:bg-red-600 text-white px-3.5 py-2 rounded-xl transition shadow-sm flex items-center justify-center" title="Delete Chapter">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Chapter Contents -->
                      <div id="chapter-content-${ch.id}" class="p-6 bg-slate-50/50 ${isPreviouslyOpen ? '' : 'hidden'}">
                `;
                
                if(ch.contents && ch.contents.length > 0) {
                    html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-8">`;
                    
                    // Video Column (Left)
                    const videos = ch.contents.filter(co => co.type === 'Video');
                    html += `<div class="space-y-3">`;
                    html += `<h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"><i class="fa-solid fa-video text-blue-500 mr-2"></i> Videos</h4>`;
                    if(videos.length > 0) {
                        videos.forEach(co => {
                            html += `
                            <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center group hover:border-emerald-300 transition">
                                <div class="flex items-center gap-4 overflow-hidden">
                                    <div class="w-12 h-12 rounded-full flex items-center justify-center fa-circle-play text-blue-500 bg-blue-50 text-xl flex-shrink-0">
                                        <i class="fa-solid fa-play"></i>
                                    </div>
                                    <div class="truncate">
                                        <h4 class="font-bold text-slate-800 text-sm mb-1 truncate">${co.title}</h4>
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">${co.type}</span>
                                            <a href="${co.url || '#'}" target="_blank" class="text-xs font-medium text-slate-400 hover:text-blue-500 transition"><i class="fa-solid fa-link"></i> Link</a>
                                            <span class="text-[10px] text-slate-300">| Order: ${co.orderIndex || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1.5 flex-shrink-0 ml-3">
                                    <button onclick="openEditContentModal(${co.id}, ${ch.id}, '${escapeForJs(co.title)}', '${co.type}', '${escapeForJs(co.url || '')}', ${co.orderIndex || 0})" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200" title="Edit Content">
                                        <i class="fa-solid fa-pen-to-square text-sm"></i>
                                    </button>
                                    <button onclick="deleteContent(${co.id})" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition border border-transparent hover:border-red-200" title="Delete Content">
                                        <i class="fa-solid fa-trash-can text-sm"></i>
                                    </button>
                                </div>
                            </div>`;
                        });
                    } else {
                        html += `<div class="p-4 border border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400">No videos added</div>`;
                    }
                    html += `</div>`;
                    
                    // PDF Column (Right)
                    const pdfs = ch.contents.filter(co => co.type === 'PDF');
                    html += `<div class="space-y-3">`;
                    html += `<h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"><i class="fa-solid fa-file-pdf text-red-500 mr-2"></i> Study Materials</h4>`;
                    if(pdfs.length > 0) {
                        pdfs.forEach(co => {
                            html += `
                            <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center group hover:border-emerald-300 transition">
                                <div class="flex items-center gap-4 overflow-hidden">
                                    <div class="w-12 h-12 rounded-full flex items-center justify-center fa-file-pdf text-red-500 bg-red-50 text-xl flex-shrink-0">
                                        <i class="fa-solid fa-file-pdf"></i>
                                    </div>
                                    <div class="truncate">
                                        <h4 class="font-bold text-slate-800 text-sm mb-1 truncate">${co.title}</h4>
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-700">${co.type}</span>
                                            <a href="${co.url || '#'}" target="_blank" class="text-xs font-medium text-slate-400 hover:text-blue-500 transition"><i class="fa-solid fa-link"></i> Link</a>
                                            <span class="text-[10px] text-slate-300">| Order: ${co.orderIndex || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1.5 flex-shrink-0 ml-3">
                                    <button onclick="openEditContentModal(${co.id}, ${ch.id}, '${escapeForJs(co.title)}', '${co.type}', '${escapeForJs(co.url || '')}', ${co.orderIndex || 0})" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200" title="Edit Content">
                                        <i class="fa-solid fa-pen-to-square text-sm"></i>
                                    </button>
                                    <button onclick="deleteContent(${co.id})" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition border border-transparent hover:border-red-200" title="Delete Content">
                                        <i class="fa-solid fa-trash-can text-sm"></i>
                                    </button>
                                </div>
                            </div>`;
                        });
                    } else {
                        html += `<div class="p-4 border border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400">No PDFs added</div>`;
                    }
                    html += `</div>`;
                    
                    html += `</div>`;
                } else {
                    html += `
                        <div class="text-center py-8">
                            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <i class="fa-solid fa-photo-film text-slate-300 text-2xl"></i>
                            </div>
                            <p class="text-slate-500 font-medium">No videos or PDFs uploaded yet.</p>
                        </div>
                    `;
                }

                html += `</div></div>`;
                container.innerHTML += html;
            });
        } else {
            container.innerHTML = `
                <div class="text-center p-12 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                    <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fa-solid fa-book-open text-emerald-500 text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">No Chapters Yet</h3>
                    <p class="text-slate-500">Start building your course curriculum by adding the first chapter.</p>
                </div>
            `;
        }
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

function showChapterModal() { 
    document.getElementById('chapterEditId').value = '';
    document.getElementById('chapterTitle').value = '';
    document.getElementById('chapterOrder').value = 1;
    document.getElementById('chapterModalTitle').innerText = 'Add Chapter';
    document.getElementById('chapterModalSubmitBtn').innerText = 'Save Chapter';
    document.getElementById('chapterModal').classList.remove('hidden'); 
}

function openEditChapterModal(id, title, orderIndex) {
    document.getElementById('chapterEditId').value = id;
    document.getElementById('chapterTitle').value = title || '';
    document.getElementById('chapterOrder').value = orderIndex || 1;
    document.getElementById('chapterModalTitle').innerText = 'Update Chapter';
    document.getElementById('chapterModalSubmitBtn').innerText = 'Update Chapter';
    document.getElementById('chapterModal').classList.remove('hidden');
}

function hideChapterModal() { document.getElementById('chapterModal').classList.add('hidden'); }

function showContentModal(chapterId) { 
    document.getElementById('contentEditId').value = '';
    document.getElementById('contentChapterId').value = chapterId;
    document.getElementById('contentTitle').value = '';
    document.getElementById('contentUrl').value = '';
    document.getElementById('contentType').value = 'Video';
    document.getElementById('contentOrder').value = 1;
    document.getElementById('contentModalTitle').innerText = 'Add Content';
    document.getElementById('contentModalSubmitBtn').innerText = 'Save Content';
    document.getElementById('contentModal').classList.remove('hidden'); 
}

function openEditContentModal(id, chapterId, title, type, url, orderIndex) {
    document.getElementById('contentEditId').value = id;
    document.getElementById('contentChapterId').value = chapterId;
    document.getElementById('contentType').value = type || 'Video';
    document.getElementById('contentTitle').value = title || '';
    document.getElementById('contentUrl').value = url || '';
    document.getElementById('contentOrder').value = orderIndex || 1;
    document.getElementById('contentModalTitle').innerText = 'Update Content';
    document.getElementById('contentModalSubmitBtn').innerText = 'Update Content';
    document.getElementById('contentModal').classList.remove('hidden');
}

function hideContentModal() { document.getElementById('contentModal').classList.add('hidden'); }

async function saveChapter() {
    const editId = document.getElementById('chapterEditId').value;
    const courseId = parseInt(document.getElementById('courseSelect').value);
    const title = document.getElementById('chapterTitle').value.trim();
    const orderIndex = parseInt(document.getElementById('chapterOrder').value) || 1;
    
    if(!title) return alert("Title required");

    const submitBtn = document.getElementById('chapterModalSubmitBtn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Saving...";
    submitBtn.disabled = true;

    try {
        let res;
        if(editId) {
            res = await fetch('/api/CourseContents/chapters/' + editId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ id: parseInt(editId), courseId, title, orderIndex })
            });
        } else {
            res = await fetch('/api/CourseContents/chapters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ courseId, title, orderIndex })
            });
        }

        if(res.ok) {
            hideChapterModal();
            loadCourseDetails();
        } else {
            const err = await res.text();
            alert("Failed to save chapter: " + err);
        }
    } catch(e) {
        alert("Network error while saving chapter");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

async function handleFileUpload(input) {
    const file = input.files[0];
    if(!file) return;

    const urlInput = document.getElementById('contentUrl');
    const originalVal = urlInput.value;
    urlInput.value = "Uploading file... please wait";
    urlInput.disabled = true;
    urlInput.classList.add('bg-blue-50', 'text-blue-500', 'animate-pulse');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch('/api/Uploads', { method: 'POST', body: formData });
        if(res.ok) {
            const data = await res.json();
            urlInput.value = data.url;
        } else {
            alert("Upload failed! Server returned an error.");
            urlInput.value = originalVal;
        }
    } catch(e) {
        alert("Upload failed! Network error.");
        urlInput.value = originalVal;
    } finally {
        urlInput.disabled = false;
        urlInput.classList.remove('bg-blue-50', 'text-blue-500', 'animate-pulse');
        input.value = ''; // clear input
    }
}

async function saveContent() {
    const editId = document.getElementById('contentEditId').value;
    const chapterId = parseInt(document.getElementById('contentChapterId').value);
    const title = document.getElementById('contentTitle').value.trim();
    const type = document.getElementById('contentType').value;
    const url = document.getElementById('contentUrl').value.trim();
    const orderIndex = parseInt(document.getElementById('contentOrder').value) || 1;

    if(!title) return alert("Content Title required");

    const submitBtn = document.getElementById('contentModalSubmitBtn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Saving...";
    submitBtn.disabled = true;

    try {
        let res;
        if(editId) {
            res = await fetch('/api/CourseContents/contents/' + editId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ id: parseInt(editId), chapterId, title, type, url, orderIndex })
            });
        } else {
            res = await fetch('/api/CourseContents/contents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ chapterId, title, type, url, orderIndex })
            });
        }

        if(res.ok) {
            hideContentModal();
            loadCourseDetails();
        } else {
            const err = await res.text();
            alert("Failed to save content: " + err);
        }
    } catch(e) {
        alert("Network error while saving content");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

async function deleteChapter(id) {
    if(!confirm("Are you sure? This will delete all videos/PDFs inside this chapter!")) return;
    const res = await fetch('/api/CourseContents/chapters/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if(res.ok) loadCourseDetails();
}

async function deleteContent(id) {
    if(!confirm("Delete this content?")) return;
    const res = await fetch('/api/CourseContents/contents/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if(res.ok) loadCourseDetails();
}

function toggleChapter(id) {
    const content = document.getElementById('chapter-content-' + id);
    if(content.classList.contains('hidden')) {
        content.classList.remove('hidden');
    } else {
        content.classList.add('hidden');
    }
}

function filterAdminChapters() {
    const query = document.getElementById('adminSearch').value.toLowerCase();
    const container = document.getElementById('chaptersContainer');
    const chapters = container.querySelectorAll('.admin-chapter-card');

    chapters.forEach(card => {
        const text = card.innerText.toLowerCase();
        if(text.includes(query)) {
            card.classList.remove('hidden');
            if(query.length > 0) {
                const content = card.querySelector('div[id^="chapter-content-"]');
                if(content) content.classList.remove('hidden');
            } else {
                const content = card.querySelector('div[id^="chapter-content-"]');
                if(content) content.classList.add('hidden');
            }
        } else {
            card.classList.add('hidden');
        }
    });
}

window.onload = loadCourses;
