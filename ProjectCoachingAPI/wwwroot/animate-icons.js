const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

const t1_old = '<div class="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50"><div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-500"><i class="fa-solid fa-brain"></i></div> <span id="f1" class="text-slate-700 font-medium">In-depth Concept Building</span></div>';
const t1_new = '<div class="group flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 hover:bg-blue-50 hover:shadow-md transition-all cursor-default transform hover:-translate-y-1"><div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-500 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"><i class="fa-solid fa-brain"></i></div> <span id="f1" class="text-slate-700 font-bold group-hover:text-blue-700 transition-colors">In-depth Concept Building</span></div>';

const t2_old = '<div class="flex items-center gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50"><div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-500"><i class="fa-solid fa-person-chalkboard"></i></div> <span id="f2" class="text-slate-700 font-medium">Complex Numerical Solving</span></div>';
const t2_new = '<div class="group flex items-center gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 hover:bg-emerald-50 hover:shadow-md transition-all cursor-default transform hover:-translate-y-1"><div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-500 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300"><i class="fa-solid fa-person-chalkboard"></i></div> <span id="f2" class="text-slate-700 font-bold group-hover:text-emerald-700 transition-colors">Complex Numerical Solving</span></div>';

const t3_old = '<div class="flex items-center gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100/50"><div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-500"><i class="fa-solid fa-calculator"></i></div> <span id="f3" class="text-slate-700 font-medium">Board CQ & MCQ Practice</span></div>';
const t3_new = '<div class="group flex items-center gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100/50 hover:bg-purple-50 hover:shadow-md transition-all cursor-default transform hover:-translate-y-1"><div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-500 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"><i class="fa-solid fa-calculator"></i></div> <span id="f3" class="text-slate-700 font-bold group-hover:text-purple-700 transition-colors">Board CQ & MCQ Practice</span></div>';

const t4_old = '<div class="flex items-center gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100/50"><div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-500"><i class="fa-solid fa-file-signature"></i></div> <span id="f4" class="text-slate-700 font-medium">Chapter-wise Model Tests</span></div>';
const t4_new = '<div class="group flex items-center gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100/50 hover:bg-orange-50 hover:shadow-md transition-all cursor-default transform hover:-translate-y-1"><div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-500 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300"><i class="fa-solid fa-file-signature"></i></div> <span id="f4" class="text-slate-700 font-bold group-hover:text-orange-700 transition-colors">Chapter-wise Model Tests</span></div>';

html = html.replace(t1_old, t1_new);
html = html.replace(t2_old, t2_new);
html = html.replace(t3_old, t3_new);
html = html.replace(t4_old, t4_new);

fs.writeFileSync('course.html', html, 'utf8');
