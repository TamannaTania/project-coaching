const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add styles
const styleBlock = `
    <style>
        .heading-container { cursor: default; }
        .sparkle-text {
            transition: all 0.3s ease;
            position: relative;
            display: inline-block;
            padding-bottom: 12px;
        }
        .sparkle-text::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: #10b981;
            border-radius: 4px;
            transition: width 0.4s ease, background 0.4s ease;
        }
        .heading-container:hover .sparkle-text::after {
            width: 100%;
            background: linear-gradient(90deg, #10b981, #0ea5e9, #10b981);
            background-size: 200% auto;
            animation: shine 2s linear infinite;
        }
        .heading-container:hover .sparkle-text {
            background: linear-gradient(90deg, #0f172a, #10b981, #0ea5e9, #0f172a);
            background-size: 200% auto;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            animation: shine 2s linear infinite;
        }
        
        .sparkle-text.left-align::after {
            left: 0;
            transform: translateX(0);
        }

        @keyframes shine {
            to { background-position: 200% center; }
        }
    </style>
</head>`;

if (!html.includes('.sparkle-text')) {
    html = html.replace('</head>', styleBlock);
}

// 1. Why Choose Us?
const whyRegex = /<div class="inline-block bg-gradient-to-r from-blue-700 to-indigo-700 p-4 px-8 rounded-2xl shadow-xl shadow-indigo-200\/50 mb-4 transform transition hover:-translate-y-1">\s*<h2 id="whyHeading" class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">\s*<i class="fa-solid fa-ranking-star text-yellow-300"><\/i> <span id="whyTitle">.*?<\/span>\s*<\/h2>\s*<\/div>/;

const newWhy = `<div class="heading-container mb-4">
                    <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 sparkle-text">
                        <i class="fa-solid fa-ranking-star text-emerald-500 mr-2"></i><span id="whyTitle">Why Choose Us?</span>
                    </h2>
                </div>`;
html = html.replace(whyRegex, newWhy);

// 2. Featured Courses
const coursesRegex = /<div class="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 p-4 px-8 rounded-2xl shadow-xl shadow-emerald-200\/50 mb-4 transform transition hover:-translate-y-1">\s*<h2 id="coursesHeading" class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">\s*<i class="fa-solid fa-graduation-cap text-emerald-100"><\/i> <span id="coursesTitle">.*?<\/span>\s*<\/h2>\s*<\/div>/;

const newCourses = `<div class="heading-container mb-4">
                    <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 sparkle-text">
                        <i class="fa-solid fa-graduation-cap text-emerald-500 mr-2"></i><span id="coursesTitle">Featured Courses</span>
                    </h2>
                </div>`;
html = html.replace(coursesRegex, newCourses);

// 3. Learn Anywhere (Left Aligned usually)
const appRegex = /<div class="inline-block bg-gradient-to-r from-slate-800 to-slate-700 p-4 px-8 rounded-2xl shadow-lg mb-6 transform transition hover:-translate-y-1 text-center md:text-left">\s*<h2 id="appHeading" class="text-3xl font-extrabold text-white flex justify-center md:justify-start items-center gap-3">\s*<i class="fa-solid fa-mobile-screen text-blue-300"><\/i> <span id="appTitle">.*?<\/span>\s*<\/h2>\s*<\/div>/;

const newApp = `<div class="heading-container mb-6 text-center md:text-left">
                    <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 sparkle-text left-align">
                        <i class="fa-solid fa-mobile-screen text-blue-500 mr-2"></i><span id="appTitle">Learn Anywhere, Anytime.</span>
                    </h2>
                </div>`;
html = html.replace(appRegex, newApp);


// 4. Successful Students
const successRegex = /<div class="inline-block bg-gradient-to-r from-purple-600 to-fuchsia-600 p-4 px-8 rounded-2xl shadow-xl shadow-purple-200\/50 mb-4 transform transition hover:-translate-y-1">\s*<h2 id="successHeading" class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">\s*<i class="fa-solid fa-trophy text-yellow-300"><\/i> <span id="successTitle">.*?<\/span>\s*<\/h2>\s*<\/div>/;

const newSuccess = `<div class="heading-container mb-4">
                    <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 sparkle-text">
                        <i class="fa-solid fa-trophy text-yellow-500 mr-2"></i><span id="successTitle">Our Pride: Successful Students</span>
                    </h2>
                </div>`;
html = html.replace(successRegex, newSuccess);

fs.writeFileSync('index.html', html, 'utf8');
