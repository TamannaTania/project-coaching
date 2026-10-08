const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-teachers.html', 'utf8');

const imageHtmlOld = `                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                            <input type="url" id="tImage" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500">
                        </div>`;
const imageHtmlNew = `                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Teacher Photo (Upload or URL)</label>
                            <div class="flex gap-2">
                                <input type="file" id="tImageFile" accept="image/*" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 text-sm">
                                <input type="text" id="tImage" placeholder="Or paste URL..." class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 text-sm">
                            </div>
                        </div>`;
html = html.replace(imageHtmlOld, imageHtmlNew);

const fetchStart = `const payload = {`;
const fetchReplacement = `
            const fileInput = document.getElementById('tImageFile');
            let uploadedImageUrl = document.getElementById('tImage').value;

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
                        uploadedImageUrl = uploadData.url;
                    }
                } catch (e) {
                    console.error("Upload failed", e);
                }
            }

            const payload = {`;
html = html.replace(fetchStart, fetchReplacement);

html = html.replace("imageUrl: document.getElementById('tImage').value || '',", "imageUrl: uploadedImageUrl || '',");

fs.writeFileSync('wwwroot/admin-teachers.html', html, 'utf8');
console.log("Updated admin-teachers.html");
