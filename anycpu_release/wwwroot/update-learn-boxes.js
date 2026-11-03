const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// The original What You Will Learn HTML chunk
const oldLearnStr = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="group flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 hover:bg-blue-50 hover:shadow-md transition-all cursor-default transform hover:-translate-y-1"><div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-500 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"><i class="fa-solid fa-brain"></i></div> <span id="f1" class="text-slate-700 font-bold group-hover:text-blue-700 transition-colors">In-depth Concept Building</span></div>
                        <div class="group flex items-center gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 hover:bg-emerald-50 hover:shadow-md transition-all cursor-default transform hover:-translate-y-1"><div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-500 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300"><i class="fa-solid fa-person-chalkboard"></i></div> <span id="f2" class="text-slate-700 font-bold group-hover:text-emerald-700 transition-colors">Complex Numerical Solving</span></div>
                        <div class="group flex items-center gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100/50 hover:bg-purple-50 hover:shadow-md transition-all cursor-default transform hover:-translate-y-1"><div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-500 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"><i class="fa-solid fa-calculator"></i></div> <span id="f3" class="text-slate-700 font-bold group-hover:text-purple-700 transition-colors">Board CQ & MCQ Practice</span></div>
                        <div class="group flex items-center gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100/50 hover:bg-orange-50 hover:shadow-md transition-all cursor-default transform hover:-translate-y-1"><div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-500 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300"><i class="fa-solid fa-file-signature"></i></div> <span id="f4" class="text-slate-700 font-bold group-hover:text-orange-700 transition-colors">Chapter-wise Model Tests</span></div>
                    </div>`;

// New clean, box-less style with nice icon animation
const newLearnStr = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
                        <div class="group flex items-center gap-4 cursor-default">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center flex-shrink-0 text-blue-500 shadow-sm shadow-blue-200/50 group-hover:shadow-blue-300 group-hover:-translate-y-1 transition-all duration-300">
                                <i class="fa-solid fa-brain text-xl group-hover:scale-110 group-hover:animate-pulse"></i>
                            </div> 
                            <span id="f1" class="text-slate-700 font-bold group-hover:text-blue-600 transition-colors text-lg">In-depth Concept Building</span>
                        </div>
                        <div class="group flex items-center gap-4 cursor-default">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center flex-shrink-0 text-emerald-500 shadow-sm shadow-emerald-200/50 group-hover:shadow-emerald-300 group-hover:-translate-y-1 transition-all duration-300">
                                <i class="fa-solid fa-person-chalkboard text-xl group-hover:scale-110 group-hover:animate-pulse"></i>
                            </div> 
                            <span id="f2" class="text-slate-700 font-bold group-hover:text-emerald-600 transition-colors text-lg">Complex Numerical Solving</span>
                        </div>
                        <div class="group flex items-center gap-4 cursor-default">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-fuchsia-50 flex items-center justify-center flex-shrink-0 text-purple-500 shadow-sm shadow-purple-200/50 group-hover:shadow-purple-300 group-hover:-translate-y-1 transition-all duration-300">
                                <i class="fa-solid fa-calculator text-xl group-hover:scale-110 group-hover:animate-pulse"></i>
                            </div> 
                            <span id="f3" class="text-slate-700 font-bold group-hover:text-purple-600 transition-colors text-lg">Board CQ & MCQ Practice</span>
                        </div>
                        <div class="group flex items-center gap-4 cursor-default">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center flex-shrink-0 text-orange-500 shadow-sm shadow-orange-200/50 group-hover:shadow-orange-300 group-hover:-translate-y-1 transition-all duration-300">
                                <i class="fa-solid fa-file-signature text-xl group-hover:scale-110 group-hover:animate-pulse"></i>
                            </div> 
                            <span id="f4" class="text-slate-700 font-bold group-hover:text-orange-600 transition-colors text-lg">Chapter-wise Model Tests</span>
                        </div>
                    </div>`;

if(html.includes(oldLearnStr)) {
    html = html.replace(oldLearnStr, newLearnStr);
    fs.writeFileSync('course.html', html, 'utf8');
    console.log("REPLACED SUCCESSFULLY!");
} else {
    // maybe spaces are slightly different, let's use a looser replace.
    const startIdx = html.indexOf('<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">');
    const endIdx = html.indexOf('</div>\n                </div>\n            </div>\n\n            <div id="sidebarColumn"');
    if(startIdx > -1 && endIdx > -1) {
        const oldLogic = html.substring(startIdx, endIdx);
        html = html.replace(oldLogic, newLearnStr);
        fs.writeFileSync('course.html', html, 'utf8');
        console.log("REPLACED VIA INDEX SUCCESSFULLY!");
    } else {
        console.log("COULD NOT FIND BLOCK");
    }
}
