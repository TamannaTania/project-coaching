const fs = require('fs');

// Create admin-success.html based on admin-freeclasses.html
let html = fs.readFileSync('wwwroot/admin-freeclasses.html', 'utf8');

html = html.replace(/<title>Manage Free Classes<\/title>/g, '<title>Manage Success Students</title>');
html = html.replace(/Manage Free Classes/g, 'Manage Success Students');
html = html.replace(/Add and organize free video classes for the homepage\./g, 'Add and organize successful students for the homepage.');
html = html.replace(/Existing Free Classes/g, 'Existing Students');
html = html.replace(/fa-youtube text-red-500/g, 'fa-trophy text-yellow-500');

// Replace form
const formHtml = `
                <form id="successForm" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Student Name</label>
                            <input type="text" id="ssName" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">University / Institution</label>
                            <input type="text" id="ssUni" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Batch (e.g. HSC 2024)</label>
                            <input type="text" id="ssBatch" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                            <input type="url" id="ssImg" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <button type="submit" id="saveBtn" class="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition">Add Student</button>
                    </div>
                </form>
`;
html = html.replace(/<form id="freeClassForm"[\s\S]*?<\/form>/, formHtml);
// Wait, in previous it was <form id="freeClassForm">, let's just make sure.

// Replace script logic
const scriptLogic = `
        const token = localStorage.getItem('token');
        if (!token) window.location.href = 'login.html';

        async function loadStudents() {
            try {
                const res = await fetch('/api/SuccessStudents');
                const data = await res.json();
                const container = document.getElementById('teachersList');
                container.innerHTML = '';
                
                if(data.length === 0) {
                    container.innerHTML = '<div class="col-span-full text-center text-slate-400 py-10">No students added yet.</div>';
                    return;
                }

                data.forEach(s => {
                    container.innerHTML += \`
                    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-6">
                        <img src="\${s.imageUrl}" class="w-20 h-20 object-cover rounded-full bg-slate-100">
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-slate-800">\${s.name}</h3>
                            <p class="text-emerald-600 font-bold">\${s.institution}</p>
                            <p class="text-slate-500 text-sm mt-1">\${s.batch}</p>
                        </div>
                        <button onclick="deleteStudent(\${s.id})" class="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition">Delete</button>
                    </div>\`;
                });
            } catch (err) {
                console.error(err);
            }
        }

        document.getElementById('successForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById('ssName').value,
                institution: document.getElementById('ssUni').value,
                batch: document.getElementById('ssBatch').value,
                imageUrl: document.getElementById('ssImg').value,
                orderIndex: 0
            };

            await fetch('/api/SuccessStudents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(payload)
            });
            document.getElementById('successForm').reset();
            loadStudents();
        });

        async function deleteStudent(id) {
            if(!confirm("Are you sure?")) return;
            await fetch('/api/SuccessStudents/' + id, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            loadStudents();
        }

        loadStudents();
`;
html = html.replace(/<script>[\s\S]*?<\/script>/, '<script>\n' + scriptLogic + '\n</script>');
html = html.replace('Add New Free Class', 'Add New Student');

fs.writeFileSync('wwwroot/admin-success.html', html, 'utf8');

// Update admin.html to add the tab
let adminHtml = fs.readFileSync('wwwroot/admin.html', 'utf8');
const successTab = `
            <a href="admin-success.html" id="tabSuccess" style="text-decoration: none; padding: 10px 20px; background: transparent; border: none; font-size: 1.1rem; font-weight: bold; color: #6b7280; border-bottom: 3px solid transparent; cursor: pointer; display: inline-block;">Success Students</a>
`;
adminHtml = adminHtml.replace('<a href="admin-about.html" id="tabAbout"', successTab + '\n            <a href="admin-about.html" id="tabAbout"');

const bigTab = `<a href="admin-success.html" class="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-lg transition text-left group">
                <div class="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    <i class="fa-solid fa-trophy"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 mb-1">Success Students</h3>
                <p class="text-slate-500 text-sm">Manage successful students section</p>
            </a>`;
adminHtml = adminHtml.replace('<!-- Add more tabs as needed -->', bigTab + '\n            <!-- Add more tabs as needed -->');

fs.writeFileSync('wwwroot/admin.html', adminHtml, 'utf8');
console.log("Admin Success UI created!");
