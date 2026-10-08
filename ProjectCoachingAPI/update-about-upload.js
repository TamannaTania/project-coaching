const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-about.html', 'utf8');

// Update UI
const imageHtmlOld = `                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                        <input type="url" id="abImg" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required>
                    </div>`;
const imageHtmlNew = `                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">About Image (Upload or URL)</label>
                        <div class="flex gap-2">
                            <input type="file" id="abImgFile" accept="image/*" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 text-sm">
                            <input type="text" id="abImg" placeholder="Or paste image URL..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 text-sm">
                        </div>
                        <p class="text-xs text-slate-500 mt-1">Optional. Upload a picture from your computer, or paste a link.</p>
                    </div>`;
html = html.replace(imageHtmlOld, imageHtmlNew);

// Update JS logic
const fetchStart = `const payload = {`;
const fetchReplacement = `
            const fileInput = document.getElementById('abImgFile');
            let imageUrl = document.getElementById('abImg').value;

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

            if (!imageUrl || imageUrl.trim() === '') {
                imageUrl = 'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?auto=format&fit=crop&q=80&w=800'; // fallback
            }

            const payload = {`;
html = html.replace(fetchStart, fetchReplacement);

// Fix payload imageUrl
html = html.replace("imageUrl: document.getElementById('abImg').value,", "imageUrl: imageUrl,");

fs.writeFileSync('wwwroot/admin-about.html', html, 'utf8');
console.log("Updated admin-about.html with file upload!");
