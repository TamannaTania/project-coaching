const fs = require('fs');

// 1. Update Scripts/Home/index.js
const indexPath = 'C:/Users/Tamanna Tania/.gemini/antigravity/scratch/project_coaching/ProjectCoachingAPI/wwwroot/Scripts/Home/index.js';
if (fs.existsSync(indexPath)) {
    let js = fs.readFileSync(indexPath, 'utf8');
    const oldFn = /async function loadAbout\(\)[\s\S]*?catch\(e\)\s*\{\}/;
    const newFn = `async function loadAbout() {
    try {
        const res = await fetch('/api/About');
        if(res.ok) {
            const data = await res.json();
            const safeTitle = (data.title || 'About PhysicsClassroom').replace(/PhysicsAcademy/gi, 'PhysicsClassroom');
            const safeDesc = (data.description || '').replace(/PhysicsAcademy/gi, 'PhysicsClassroom');
            if(document.getElementById('aboutTitle')) document.getElementById('aboutTitle').innerText = safeTitle;
            if(document.getElementById('aboutDesc')) document.getElementById('aboutDesc').innerText = safeDesc;
            if(document.getElementById('aboutImg') && data.imageUrl) document.getElementById('aboutImg').src = data.imageUrl;
        }
    } catch(e) {}
}`;
    if (oldFn.test(js)) {
        js = js.replace(oldFn, newFn);
        fs.writeFileSync(indexPath, js, 'utf8');
        console.log('Updated index.js loadAbout');
    }
}

// 2. Update wwwroot/index.html and wwwroot/Views/Home/index.html
const htmlFiles = [
    'C:/Users/Tamanna Tania/.gemini/antigravity/scratch/project_coaching/ProjectCoachingAPI/wwwroot/index.html',
    'C:/Users/Tamanna Tania/.gemini/antigravity/scratch/project_coaching/ProjectCoachingAPI/wwwroot/Views/Home/index.html'
];

const newAboutSection = `<!-- About Section (Compact & Balanced Image) -->
    <section id="about" class="py-16 bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14">
                <div class="w-full md:w-5/12 flex justify-center">
                    <div class="relative w-full max-w-[320px] sm:max-w-[360px]">
                        <img id="aboutImg" src="https://images.unsplash.com/photo-1524169358666-79f22534bc6e?auto=format&fit=crop&q=80&w=800" class="rounded-2xl shadow-xl object-cover w-full h-[240px] sm:h-[270px]">
                        <div class="absolute -bottom-4 -right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                            <i class="fa-solid fa-award text-2xl text-emerald-100"></i>
                            <div>
                                <h4 class="font-bold text-sm sm:text-base leading-tight">Best Education</h4>
                                <p class="text-[11px] text-emerald-100 font-medium">Quality Physics</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full md:w-7/12">
                    <div class="heading-container mb-4 text-left">
                        <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 sparkle-text">
                            <span id="aboutTitle">About PhysicsClassroom</span>
                        </h2>
                    </div>
                    <p id="aboutDesc" class="text-base text-slate-600 mb-6 leading-relaxed">
                        We are dedicated to providing the best physics education for HSC and Admission candidates. Our goal is to make physics intuitive, engaging, and easy to understand.
                    </p>
                    <a href="#courses" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-2.5 rounded-full font-bold shadow-md shadow-emerald-200 transition transform hover:-translate-y-0.5 text-sm sm:text-base">
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    </section>`;

htmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');

    // Replace the about section
    const aboutRegex = /<!-- About Section -->[\s\S]*?<section id="about"[\s\S]*?<\/section>/;
    if (aboutRegex.test(html)) {
        html = html.replace(aboutRegex, newAboutSection);
    } else {
        const fallbackRegex = /<section id="about"[\s\S]*?<\/section>/;
        if (fallbackRegex.test(html)) {
            html = html.replace(fallbackRegex, newAboutSection);
        }
    }

    // Also update index.js cache buster
    html = html.replace(/src="\/Scripts\/Home\/index\.js(\?[^"]*)?"/g, 'src="/Scripts/Home/index.js?v=20261031_v4"');

    fs.writeFileSync(file, html, 'utf8');
    console.log('Updated about section in:', file);
});
