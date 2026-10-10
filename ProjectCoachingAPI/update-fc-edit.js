const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-freeclasses.html', 'utf8');

// 1. Add editId variable
html = html.replace('let thumbnailUrl = document.getElementById(\'fcThumb\').value;', 'let editId = null;\n            let thumbnailUrl = document.getElementById(\'fcThumb\').value;');

const btnReplacement = `
                        <div class="flex gap-2">
                            <button onclick="editClass(\${fc.id}, '\${fc.title.replace(/'/g, "\\'")}', '\${fc.videoUrl.replace(/'/g, "\\'")}', '\${fc.thumbnailUrl.replace(/'/g, "\\'")}')" class="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-bold transition">Edit</button>
                            <button onclick="deleteClass(\${fc.id})" class="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition">Delete</button>
                        </div>
`;
const renderRegex = /<button onclick="deleteClass\(\$\{fc\.id\}\)" class="bg-red-50[^>]+>Delete<\/button>/g;
html = html.replace(renderRegex, btnReplacement);

// 2. Add the editClass function
const editFunc = `
        function editClass(id, title, videoUrl, thumb) {
            editId = id;
            document.getElementById('fcTitle').value = title;
            document.getElementById('fcVideo').value = videoUrl;
            document.getElementById('fcThumb').value = thumb;
            document.getElementById('saveBtn').innerText = 'Update Class';
            document.getElementById('saveBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
`;
html = html.replace('async function deleteClass', editFunc + '\n        async function deleteClass');

// 3. Update the submit logic to handle POST or PUT
const oldSubmitLogic = `            const payload = {
                title: document.getElementById('fcTitle').value,
                videoUrl: document.getElementById('fcVideo').value,
                thumbnailUrl: thumbnailUrl
            };

            await fetch('/api/FreeClasses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(payload)
            });
            document.getElementById('freeClassForm').reset();
            loadClasses();`;

const newSubmitLogic = `            const payload = {
                title: document.getElementById('fcTitle').value,
                videoUrl: document.getElementById('fcVideo').value,
                thumbnailUrl: thumbnailUrl
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
            document.getElementById('fcThumbFile').value = '';
            loadClasses();`;

html = html.replace(oldSubmitLogic, newSubmitLogic);

html = html.replace("const token = localStorage.getItem('token');", "const token = localStorage.getItem('token');\n        let editId = null;");

fs.writeFileSync('wwwroot/admin-freeclasses.html', html, 'utf8');
console.log("Updated admin-freeclasses.html with edit logic!");
