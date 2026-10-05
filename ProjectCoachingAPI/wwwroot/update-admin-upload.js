const fs = require('fs');
let html = fs.readFileSync('admin-contents.html', 'utf8');

const oldUrlLabel = `<label class="block text-sm font-bold text-slate-700 mb-2">URL / Link</label>`;
const newUrlLabel = `<label class="block text-sm font-bold text-slate-700 mb-2 flex justify-between items-center">
                        <span>URL / Link</span>
                        <span class="text-xs text-blue-700 cursor-pointer font-bold bg-blue-100 hover:bg-blue-200 transition px-3 py-1 rounded-md" onclick="document.getElementById('contentFileInput').click()">
                            <i class="fa-solid fa-cloud-arrow-up"></i> Upload File Instead
                        </span>
                    </label>`;

html = html.replace(oldUrlLabel, newUrlLabel);

const oldUrlInput = `<input type="text" id="contentUrl" placeholder="https://..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 font-medium">`;
const newUrlInput = `<input type="text" id="contentUrl" placeholder="https://... or click Upload" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 font-medium transition-colors">
                    <input type="file" id="contentFileInput" class="hidden" onchange="handleFileUpload(this)">`;

html = html.replace(oldUrlInput, newUrlInput);

const jsFunction = `
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
`;

html = html.replace('async function saveContent() {', jsFunction + '\n        async function saveContent() {');

fs.writeFileSync('admin-contents.html', html, 'utf8');
