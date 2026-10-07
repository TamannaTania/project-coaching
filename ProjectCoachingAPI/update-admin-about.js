const fs = require('fs');

// Create admin-about.html based on admin-freeclasses.html
let html = fs.readFileSync('wwwroot/admin-freeclasses.html', 'utf8');

html = html.replace(/<title>Manage Free Classes<\/title>/g, '<title>Manage About Section</title>');
html = html.replace(/Manage Free Classes/g, 'Manage About Section');
html = html.replace(/Add and organize free video classes for the homepage\./g, 'Update the About Us section on the homepage.');
html = html.replace(/Existing Free Classes/g, 'Current About Content');
html = html.replace(/fa-youtube text-red-500/g, 'fa-address-card text-emerald-500');

// Replace form
const formHtml = `
                <form id="aboutForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Title</label>
                        <input type="text" id="abTitle" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                        <input type="url" id="abImg" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Description</label>
                        <textarea id="abDesc" rows="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required></textarea>
                    </div>
                    <div class="flex gap-4">
                        <button type="submit" id="saveBtn" class="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition">Update Content</button>
                    </div>
                </form>
`;
html = html.replace(/<form id="freeClassForm"[\s\S]*?<\/form>/, formHtml);

// Replace script logic
const scriptLogic = `
        const token = localStorage.getItem('token');
        if (!token) window.location.href = 'login.html';

        async function loadAbout() {
            try {
                const res = await fetch('/api/About');
                if(res.ok) {
                    const data = await res.json();
                    document.getElementById('abTitle').value = data.title;
                    document.getElementById('abImg').value = data.imageUrl;
                    document.getElementById('abDesc').value = data.description;
                    
                    const container = document.getElementById('teachersList');
                    container.innerHTML = \`
                        <div class="text-center">
                            <img src="\${data.imageUrl}" class="w-full max-h-64 object-cover rounded-xl mb-4">
                            <h3 class="text-2xl font-bold mb-2">\${data.title}</h3>
                            <p class="text-slate-600">\${data.description}</p>
                        </div>
                    \`;
                }
            } catch (err) {
                console.error(err);
            }
        }

        document.getElementById('aboutForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                title: document.getElementById('abTitle').value,
                imageUrl: document.getElementById('abImg').value,
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
`;
html = html.replace(/<script>[\s\S]*?<\/script>/, '<script>\n' + scriptLogic + '\n</script>');

fs.writeFileSync('wwwroot/admin-about.html', html, 'utf8');

// Update admin.html to add the tab
let adminHtml = fs.readFileSync('wwwroot/admin.html', 'utf8');
const aboutTab = `
            <a href="admin-about.html" id="tabAbout" style="text-decoration: none; padding: 10px 20px; background: transparent; border: none; font-size: 1.1rem; font-weight: bold; color: #6b7280; border-bottom: 3px solid transparent; cursor: pointer; display: inline-block;">About</a>
`;
adminHtml = adminHtml.replace('<a href="admin-freeclasses.html" id="tabFreeClasses"', aboutTab + '\n            <a href="admin-freeclasses.html" id="tabFreeClasses"');

const bigTab = `<a href="admin-about.html" class="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-lg transition text-left group">
                <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    <i class="fa-solid fa-address-card"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 mb-1">About Section</h3>
                <p class="text-slate-500 text-sm">Manage the About Us content</p>
            </a>`;
adminHtml = adminHtml.replace('<!-- Add more tabs as needed -->', bigTab + '\n            <!-- Add more tabs as needed -->');

fs.writeFileSync('wwwroot/admin.html', adminHtml, 'utf8');
console.log("Admin About UI created!");
