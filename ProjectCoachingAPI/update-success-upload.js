const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-success.html', 'utf8');

// 1. Update the form to have a file input, and remove 'required' from imageUrl
const imageHtmlOld = `                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                            <input type="url" id="ssImg" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                        </div>`;
const imageHtmlNew = `                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">Student Photo (Upload or URL)</label>
                            <div class="flex gap-2">
                                <input type="file" id="ssImgFile" accept="image/*" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 text-sm">
                                <input type="text" id="ssImg" placeholder="Or paste image URL..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 text-sm">
                            </div>
                            <p class="text-xs text-slate-500 mt-1">Optional. Upload a picture from your computer, or paste a link.</p>
                        </div>`;
html = html.replace(imageHtmlOld, imageHtmlNew);

// 2. Update the JS logic to upload the image first if a file is selected
// We need to find the form submission logic.
const fetchStart = `const payload = {`;
const fetchReplacement = `
            const fileInput = document.getElementById('ssImgFile');
            let imageUrl = document.getElementById('ssImg').value;

            if (fileInput.files.length > 0) {
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
                        imageUrl = uploadData.url;
                    }
                } catch (e) {
                    console.error("Upload failed", e);
                }
            }

            // Fallback image if both are empty
            if (!imageUrl || imageUrl.trim() === '') {
                imageUrl = 'https://via.placeholder.com/150?text=Student';
            }

            const payload = {`;
html = html.replace(fetchStart, fetchReplacement);

// Fix payload imageUrl
html = html.replace("imageUrl: document.getElementById('ssImg').value,", "imageUrl: imageUrl,");

fs.writeFileSync('wwwroot/admin-success.html', html, 'utf8');
console.log("Updated admin-success.html with file upload!");
