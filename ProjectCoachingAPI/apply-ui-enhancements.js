const fs = require('fs');

// --- 1. Update index.html and Views/Home/index.html (Remove YouTube and WhatsApp icons) ---
const indexFiles = ['wwwroot/index.html', 'wwwroot/Views/Home/index.html'];
indexFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        // Target:
        // <a href="#" class="hover:text-blue-400 transition text-lg"><i class="fa-brands fa-facebook"></i></a>
        // <a href="#" class="hover:text-red-500 transition text-lg"><i class="fa-brands fa-youtube"></i></a>
        // <a href="#" class="hover:text-emerald-400 transition text-lg"><i class="fa-brands fa-whatsapp"></i></a>
        content = content.replace(
            /<a href="#" class="hover:text-red-500 transition text-lg"><i class="fa-brands fa-youtube"><\/i><\/a>\s*<a href="#" class="hover:text-emerald-400 transition text-lg"><i class="fa-brands fa-whatsapp"><\/i><\/a>/g,
            ''
        );
        fs.writeFileSync(f, content, 'utf8');
        console.log('Removed YT & WA icons from:', f);
    }
});

// --- 2. Update profile.html and Views/Profile/profile.html (Beautify Back to Home button) ---
const profileFiles = ['wwwroot/profile.html', 'wwwroot/Views/Profile/profile.html'];
profileFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');

        // Replace the button
        const oldBtn = '<a href="/" class="btn-login" style="background: transparent; color: #1f2937; border: 1px solid #d1d5db;">← হোমপেজে ফিরে যান</a>';
        const newBtn = '<a href="/" class="btn-back-home" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); color:#15803d; border:1.5px solid #86efac; padding:10px 22px; border-radius:50px; font-weight:700; font-size:0.95rem; text-decoration:none; box-shadow:0 4px 6px -1px rgba(22, 101, 52, 0.1); transition:all 0.25s ease;"><span style="font-size:1.1rem; line-height:1;">←</span><span>হোমপেজে ফিরে যান</span></a>';
        
        if (content.includes(oldBtn)) {
            content = content.replace(oldBtn, newBtn);
        } else {
            // Regex match
            content = content.replace(
                /<a href="\/" class="btn-login"[^>]*>←\s*হোমপেজে ফিরে যান<\/a>/,
                newBtn
            );
        }

        // Add hover effect in <style>
        const styleHover = `
        .btn-back-home:hover {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
            color: white !important;
            border-color: #059669 !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 14px rgba(16, 185, 129, 0.25) !important;
        }
        #logoutBtn {
            font-size: 1.05rem !important;
            font-weight: 700 !important;
            padding: 12px 16px !important;
        }
        `;
        if (!content.includes('.btn-back-home:hover')) {
            content = content.replace('</style>', styleHover + '\n    </style>');
        }

        fs.writeFileSync(f, content, 'utf8');
        console.log('Beautified Back to Home button in:', f);
    }
});

// --- 3. Enlarge Profile and Logout in index.js and course.js ---
['wwwroot/Scripts/Home/index.js', 'wwwroot/Scripts/Course/course.js'].forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        
        // Desktop Profile & Logout
        const oldAuthPattern = /<a href="\/Views\/Profile\/profile\.html" class="text-slate-700 hover:text-blue-600 font-semibold transition flex items-center gap-2">\s*<i class="fa-solid fa-user-circle text-2xl text-blue-600"><\/i> <span class="hidden md:inline">` \+ profileText \+ `<\/span>\s*<\/a>\s*<button onclick="logout\(\)" class="text-red-500 hover:text-red-700 font-bold transition flex items-center gap-1\.5 text-sm ml-1">\s*<i class="fa-solid fa-arrow-right-from-bracket"><\/i> <span class="hidden md:inline">` \+ logoutText \+ `<\/span>\s*<\/button>/g;
        
        const newAuthReplacement = `<a href="/Views/Profile/profile.html" class="bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold px-4 py-2 rounded-full text-sm md:text-base flex items-center gap-2 border border-slate-200 transition shadow-sm hover:shadow">
                <i class="fa-solid fa-user-circle text-2xl text-blue-600"></i> <span class="inline-block max-w-[120px] truncate">\` + profileText + \`</span>
            </a>
            <button onclick="logout()" class="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold px-4 py-2 rounded-full text-sm md:text-base transition flex items-center gap-2 shadow-sm border border-red-200 ml-1 hover:shadow">
                <i class="fa-solid fa-arrow-right-from-bracket text-base"></i> <span class="hidden sm:inline">\` + logoutText + \`</span>
            </button>`;

        content = content.replace(oldAuthPattern, newAuthReplacement);

        // Mobile Profile & Logout
        content = content.replace(
            /<a href="\/Views\/Profile\/profile\.html" class="p-1\.5 text-slate-700 hover:text-blue-600 font-bold text-xs flex items-center gap-1">\s*<i class="fa-solid fa-user-circle text-lg text-blue-600"><\/i> <span class="max-w-\[90px\] truncate">\${username \|\| 'Student'}<\/span>\s*<\/a>/,
            `<a href="/Views/Profile/profile.html" class="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-800 font-bold text-sm flex items-center gap-1.5 rounded-full border border-slate-200">
                    <i class="fa-solid fa-user-circle text-xl text-blue-600"></i> <span class="max-w-[100px] truncate">\${username || 'Student'}</span>
                </a>
                <button onclick="logout()" class="p-2 bg-red-50 text-red-600 rounded-full text-sm font-bold border border-red-200 ml-1" title="লগআউট">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </button>`
        );

        fs.writeFileSync(f, content, 'utf8');
        console.log('Enlarged Profile & Logout in:', f);
    }
});
