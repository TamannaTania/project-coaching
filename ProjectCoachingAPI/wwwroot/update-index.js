const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Upgrade 'Why Choose Us?' Heading
const oldWhyHeading = `<h2 id="whyTitle" class="text-3xl font-bold text-slate-900">Why Choose Us?</h2>
                <div class="w-24 h-1 bg-[#6bc117] mx-auto mt-4 rounded-full"></div>`;
const newWhyHeading = `<div class="inline-block bg-gradient-to-r from-blue-700 to-indigo-700 p-4 px-8 rounded-2xl shadow-xl shadow-indigo-200/50 mb-4 transform transition hover:-translate-y-1">
                <h2 id="whyTitle" class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
                    <i class="fa-solid fa-ranking-star text-yellow-300"></i> Why Choose Us?
                </h2>
            </div>`;
html = html.replace(oldWhyHeading, newWhyHeading);

// 2. Upgrade 'Featured Courses' Heading
const oldCoursesHeading = `<h2 id="coursesTitle" class="text-3xl font-bold text-slate-900">Featured Courses</h2>
                <div class="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>`;
const newCoursesHeading = `<div class="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 p-4 px-8 rounded-2xl shadow-xl shadow-emerald-200/50 mb-4 transform transition hover:-translate-y-1">
                <h2 id="coursesTitle" class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
                    <i class="fa-solid fa-graduation-cap text-emerald-100"></i> Featured Courses
                </h2>
            </div>`;
html = html.replace(oldCoursesHeading, newCoursesHeading);

// 3. Upgrade 'Successful Students' Heading
const oldSuccessHeading = `<h2 id="successTitle" class="text-3xl font-bold text-slate-900">Our Pride: Successful Students</h2>
                <div class="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>`;
const newSuccessHeading = `<div class="inline-block bg-gradient-to-r from-purple-600 to-fuchsia-600 p-4 px-8 rounded-2xl shadow-xl shadow-purple-200/50 mb-4 transform transition hover:-translate-y-1">
                <h2 id="successTitle" class="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
                    <i class="fa-solid fa-trophy text-yellow-300"></i> Our Pride: Successful Students
                </h2>
            </div>`;
html = html.replace(oldSuccessHeading, newSuccessHeading);

// 4. Upgrade 'Learn Anywhere' Heading
const oldAppHeading = `<h2 id="appTitle" class="text-3xl font-bold text-slate-900 mb-4">Learn Anywhere, Anytime.</h2>`;
const newAppHeading = `<div class="inline-block bg-gradient-to-r from-slate-800 to-slate-700 p-4 px-8 rounded-2xl shadow-lg mb-6 transform transition hover:-translate-y-1 text-center md:text-left">
                    <h2 id="appTitle" class="text-3xl font-extrabold text-white flex justify-center md:justify-start items-center gap-3">
                        <i class="fa-solid fa-mobile-screen text-blue-300"></i> Learn Anywhere, Anytime.
                    </h2>
                </div>`;
html = html.replace(oldAppHeading, newAppHeading);

// 5. Add hover animations to Feature cards
html = html.replace(/<div class="bg-white p-8 rounded-2xl text-center border border-emerald-100 shadow-xl shadow-emerald-50 animate-float">/g, 
'<div class="group bg-white p-8 rounded-2xl text-center border border-emerald-100 shadow-xl shadow-emerald-50 animate-float hover:-translate-y-3 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300">');
html = html.replace(/<div class="bg-white p-8 rounded-2xl text-center border border-emerald-100 shadow-xl shadow-emerald-50 animate-float-delayed-1">/g, 
'<div class="group bg-white p-8 rounded-2xl text-center border border-emerald-100 shadow-xl shadow-emerald-50 animate-float-delayed-1 hover:-translate-y-3 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300">');
html = html.replace(/<div class="bg-white p-8 rounded-2xl text-center border border-emerald-100 shadow-xl shadow-emerald-50 animate-float-delayed-2">/g, 
'<div class="group bg-white p-8 rounded-2xl text-center border border-emerald-100 shadow-xl shadow-emerald-50 animate-float-delayed-2 hover:-translate-y-3 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300">');
html = html.replace(/<div class="bg-white p-8 rounded-2xl text-center border border-emerald-100 shadow-xl shadow-emerald-50 animate-float-delayed-3">/g, 
'<div class="group bg-white p-8 rounded-2xl text-center border border-emerald-100 shadow-xl shadow-emerald-50 animate-float-delayed-3 hover:-translate-y-3 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300">');

// Animate Feature Icons
html = html.replace(/class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner"/g, 
'class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner group-hover:scale-125 group-hover:rotate-12 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300"');
html = html.replace(/class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner"/g, 
'class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner group-hover:scale-125 group-hover:-rotate-12 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300"');
html = html.replace(/class="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner"/g, 
'class="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner group-hover:scale-125 group-hover:rotate-12 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300"');
html = html.replace(/class="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner"/g, 
'class="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-inner group-hover:scale-125 group-hover:-rotate-12 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300"');


fs.writeFileSync('index.html', html, 'utf8');
