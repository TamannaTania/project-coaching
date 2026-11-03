const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldCard = `<div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-slate-100">
                            <img src="\${imgUrl}" alt="\${course.title}" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-xl font-bold text-slate-900 leading-tight">\${course.title}</h3>
                                </div>
                                <p class="text-slate-600 mb-6 line-clamp-2">\${course.description}</p>
                                <div class="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <span class="text-2xl font-extrabold text-emerald-600">৳\${course.price}</span>
                                    <button onclick="window.location.href='course.html?id=\${course.id}'" class="bg-blue-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-800 transition">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>`;

const newCard = `<div class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full cursor-pointer" onclick="window.location.href='course.html?id=\${course.id}'">
                            <div class="relative overflow-hidden w-full h-48">
                                <img src="\${imgUrl}" alt="\${course.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out">
                                <div class="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300"></div>
                            </div>
                            <div class="p-6 flex flex-col flex-grow">
                                <h3 class="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">\${course.title}</h3>
                                <p class="text-slate-500 mb-6 line-clamp-2 text-sm flex-grow">\${course.description}</p>
                                <div class="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                                    <span class="text-2xl font-black text-emerald-600 group-hover:scale-105 transition-transform origin-left">৳\${course.price}</span>
                                    <button class="bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold group-hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm">
                                        View Details <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                    </button>
                                </div>
                            </div>
                        </div>`;

// Fallback in case of exact match failure due to encoding/indentation
if(html.includes('<div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-slate-100">')) {
    html = html.replace(oldCard, newCard);
    
    // Sometimes it fails because of the ? instead of Taka symbol in powershell/node string matches.
    // Let's use regex to safely replace it
}

const regex = /<div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-slate-100">[\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/;
html = html.replace(regex, newCard);

fs.writeFileSync('index.html', html, 'utf8');
