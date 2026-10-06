const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-teachers.html', 'utf8');

// 1. Add Edit button to the list
html = html.replace('<button onclick="deleteTeacher(${t.id})"', 
`<button onclick="editTeacher(\${t.id})" class="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center transition mr-2">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button onclick="deleteTeacher(\${t.id})"`);

// 2. Add an editingId variable and editTeacher function
const scriptAdditions = `
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
`;

html = html.replace("const token = localStorage.getItem('token');", scriptAdditions + "\n        const token = localStorage.getItem('token');");

// 3. Update loadTeachers to save allTeachers
html = html.replace('const teachers = await response.json();', 'const teachers = await response.json();\n                allTeachers = teachers;');

// 4. Update form submit to handle PUT
const submitLogicOld = `const response = await fetch('/api/Teachers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(teacher)
                });`;

const submitLogicNew = `
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
                });`;

html = html.replace(submitLogicOld, submitLogicNew);
html = html.replace(`btn.innerHTML = '<i class="fa-solid fa-plus"></i> Save Teacher';`, `btn.innerHTML = editingId ? '<i class="fa-solid fa-save"></i> Update Teacher' : '<i class="fa-solid fa-plus"></i> Save Teacher';`);
html = html.replace(`document.getElementById('teacherForm').reset();\n                    loadTeachers();`, `cancelEdit();\n                    loadTeachers();`);

// 5. Add cancel button HTML and ID to form title
html = html.replace(`<h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">`, `<h2 id="formTitle" class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">`);

html = html.replace(`</button>\n                </form>`, `</button>
                    <button type="button" id="cancelEditBtn" onclick="cancelEdit()" class="hidden w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl shadow-sm transition-colors mt-2">Cancel Edit</button>
                </form>`);

fs.writeFileSync('wwwroot/admin-teachers.html', html, 'utf8');
console.log("Edit functionality added!");
