const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-freeclasses.html', 'utf8');

// Update Title
html = html.replace(/<title>Manage Teachers/g, '<title>Manage Free Classes');
html = html.replace(/Manage Teachers/g, 'Manage Free Classes');
html = html.replace(/Add, edit, or remove teachers/g, 'Add or remove free masterclasses');

// Replace form fields
const formHtml = `
                <form id="freeClassForm" class="space-y-4">
                    <input type="hidden" id="fcId">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Title</label>
                            <input type="text" id="fcTitle" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Category (e.g. HSC Physics)</label>
                            <input type="text" id="fcCategory" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Video URL (YouTube)</label>
                            <input type="url" id="fcVideo" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Thumbnail URL (Image)</label>
                            <input type="url" id="fcThumb" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Description</label>
                        <textarea id="fcDesc" rows="2" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required></textarea>
                    </div>
                    <div class="flex gap-4">
                        <button type="submit" id="saveBtn" class="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition">Add Class</button>
                    </div>
                </form>
`;
html = html.replace(/<form id="teacherForm"[\s\S]*?<\/form>/, formHtml);

// Replace script logic
const scriptLogic = `
        const token = localStorage.getItem('token');
        if (!token) window.location.href = 'login.html';

        async function loadClasses() {
            const res = await fetch('/api/FreeClasses');
            const classes = await res.json();
            const container = document.getElementById('teachersContainer'); // keeping same ID for ease
            container.innerHTML = '';

            if (classes.length === 0) {
                container.innerHTML = '<div class="col-span-full text-center text-slate-400 py-10">No free classes added yet.</div>';
                return;
            }

            classes.forEach(fc => {
                container.innerHTML += \`
                <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-6">
                    <img src="\${fc.thumbnailUrl}" class="w-32 h-20 object-cover rounded-xl bg-slate-100">
                    <div class="flex-1">
                        <div class="text-xs font-bold text-red-500 uppercase">\${fc.category}</div>
                        <h3 class="text-xl font-bold text-slate-800">\${fc.title}</h3>
                        <p class="text-slate-500 text-sm mt-1">\${fc.description}</p>
                    </div>
                    <button onclick="deleteClass(\${fc.id})" class="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition">Delete</button>
                </div>\`;
            });
        }

        document.getElementById('freeClassForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                title: document.getElementById('fcTitle').value,
                category: document.getElementById('fcCategory').value,
                videoUrl: document.getElementById('fcVideo').value,
                thumbnailUrl: document.getElementById('fcThumb').value,
                description: document.getElementById('fcDesc').value,
                orderIndex: 0
            };

            await fetch('/api/FreeClasses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(payload)
            });
            document.getElementById('freeClassForm').reset();
            loadClasses();
        });

        async function deleteClass(id) {
            if(!confirm("Are you sure?")) return;
            await fetch('/api/FreeClasses/' + id, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            loadClasses();
        }

        loadClasses();
`;
html = html.replace(/<script>[\s\S]*?<\/script>/, '<script>\n' + scriptLogic + '\n</script>');

fs.writeFileSync('wwwroot/admin-freeclasses.html', html, 'utf8');
console.log("Updated admin-freeclasses!");
