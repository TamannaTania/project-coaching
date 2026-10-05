const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Upgrade WhyTitle
html = html.replace(/<h2 id="whyTitle" class="text-3xl font-bold text-slate-900">.*?<\/h2>\s*<div class="w-24 h-1 bg-\[#6bc117\] mx-auto mt-4 rounded-full"><\/div>/s, 
`<div class="inline-block bg-gradient-to-r from-blue-700 to-indigo-700 p-4 px-8 rounded-2xl shadow-xl shadow-indigo-200/50 mb-4 transform transition hover:-translate-y-1">
                <h2 id="whyHeading" class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
                    <i class="fa-solid fa-ranking-star text-yellow-300"></i> <span id="whyTitle">Why Choose Us?</span>
                </h2>
            </div>`);

// 2. Upgrade CoursesTitle
html = html.replace(/<h2 id="coursesTitle" class="text-3xl font-bold text-slate-900">.*?<\/h2>\s*<div class="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"><\/div>/s, 
`<div class="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 p-4 px-8 rounded-2xl shadow-xl shadow-emerald-200/50 mb-4 transform transition hover:-translate-y-1">
                <h2 id="coursesHeading" class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
                    <i class="fa-solid fa-graduation-cap text-emerald-100"></i> <span id="coursesTitle">Featured Courses</span>
                </h2>
            </div>`);

// 3. Upgrade SuccessTitle
html = html.replace(/<h2 id="successTitle" class="text-3xl font-bold text-slate-900">.*?<\/h2>\s*<div class="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"><\/div>/s, 
`<div class="inline-block bg-gradient-to-r from-purple-600 to-fuchsia-600 p-4 px-8 rounded-2xl shadow-xl shadow-purple-200/50 mb-4 transform transition hover:-translate-y-1">
                <h2 id="successHeading" class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
                    <i class="fa-solid fa-trophy text-yellow-300"></i> <span id="successTitle">Our Pride: Successful Students</span>
                </h2>
            </div>`);

// 4. Upgrade AppTitle
html = html.replace(/<h2 id="appTitle" class="text-3xl font-bold text-slate-900 mb-4">Learn Anywhere, Anytime.<\/h2>/, 
`<div class="inline-block bg-gradient-to-r from-slate-800 to-slate-700 p-4 px-8 rounded-2xl shadow-lg mb-6 transform transition hover:-translate-y-1 text-center md:text-left">
                    <h2 id="appHeading" class="text-3xl font-extrabold text-white flex justify-center md:justify-start items-center gap-3">
                        <i class="fa-solid fa-mobile-screen text-blue-300"></i> <span id="appTitle">Learn Anywhere, Anytime.</span>
                    </h2>
                </div>`);


// The translation script will now correctly target the span id="whyTitle" instead of the h2!

fs.writeFileSync('index.html', html, 'utf8');
