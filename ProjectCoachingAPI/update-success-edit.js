const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-success.html', 'utf8');

// 1. Add editId variable and update the render logic for the Edit button
html = html.replace('let imageUrl = document.getElementById(\'ssImg\').value;', 'let editId = null;\n            let imageUrl = document.getElementById(\'ssImg\').value;');

const btnReplacement = `
                        <div class="flex gap-2">
                            <button onclick="editStudent(\${s.id}, '\${s.name.replace(/'/g, "\\'")}', '\${s.institution.replace(/'/g, "\\'")}', '\${s.batch.replace(/'/g, "\\'")}', '\${s.imageUrl.replace(/'/g, "\\'")}')" class="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-bold transition">Edit</button>
                            <button onclick="deleteStudent(\${s.id})" class="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl font-bold transition">Delete</button>
                        </div>
`;
html = html.replace(/<button onclick="deleteStudent[^>]+>Delete<\/button>/, btnReplacement);
html = html.replace(/<button onclick="deleteStudent[^>]+>Delete<\/button>/, btnReplacement); // In case it misses due to global regex

// To replace the innerHTML generation reliably:
const renderRegex = /<button onclick="deleteStudent\(\$\{s\.id\}\)" class="bg-red-50[^>]+>Delete<\/button>/g;
html = html.replace(renderRegex, btnReplacement);

// 2. Add the editStudent function
const editFunc = `
        function editStudent(id, name, institution, batch, img) {
            editId = id;
            document.getElementById('ssName').value = name;
            document.getElementById('ssUni').value = institution;
            document.getElementById('ssBatch').value = batch;
            document.getElementById('ssImg').value = img;
            document.getElementById('saveBtn').innerText = 'Update Student';
            document.getElementById('saveBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
`;
html = html.replace('async function deleteStudent', editFunc + '\n        async function deleteStudent');

// 3. Update the submit logic to handle POST or PUT
const payloadStart = `const payload = {`;
const payloadEnd = `document.getElementById('successForm').reset();
            loadStudents();`;
const oldSubmitLogic = `            const payload = {
                name: document.getElementById('ssName').value,
                institution: document.getElementById('ssUni').value,
                batch: document.getElementById('ssBatch').value,
                imageUrl: imageUrl,
                orderIndex: 0
            };

            await fetch('/api/SuccessStudents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(payload)
            });
            document.getElementById('successForm').reset();
            loadStudents();`;

const newSubmitLogic = `            const payload = {
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
            document.getElementById('ssImgFile').value = '';
            loadStudents();`;

html = html.replace(oldSubmitLogic, newSubmitLogic);

// Wait, I need to make sure I add `let editId = null;` at the top level of the script, not inside the event listener.
html = html.replace("const token = localStorage.getItem('token');", "const token = localStorage.getItem('token');\n        let editId = null;");

fs.writeFileSync('wwwroot/admin-success.html', html, 'utf8');
console.log("Updated admin-success.html with edit logic!");
