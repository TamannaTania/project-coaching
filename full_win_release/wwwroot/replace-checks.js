const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// The original HTML in course.html has checkmarks:
// <div class="flex items-start gap-3"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> <span id="f1" class="text-slate-700">In-depth Concept Building</span></div>

html = html.replace(
    '<div class="flex items-start gap-3"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> <span id="f1" class="text-slate-700">In-depth Concept Building</span></div>',
    '<div class="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50"><div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-500"><i class="fa-solid fa-brain"></i></div> <span id="f1" class="text-slate-700 font-medium">In-depth Concept Building</span></div>'
);

html = html.replace(
    '<div class="flex items-start gap-3"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> <span id="f2" class="text-slate-700">Complex Numerical Solving</span></div>',
    '<div class="flex items-center gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50"><div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-500"><i class="fa-solid fa-person-chalkboard"></i></div> <span id="f2" class="text-slate-700 font-medium">Complex Numerical Solving</span></div>'
);

html = html.replace(
    '<div class="flex items-start gap-3"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> <span id="f3" class="text-slate-700">Board CQ & MCQ Practice</span></div>',
    '<div class="flex items-center gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100/50"><div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-500"><i class="fa-solid fa-calculator"></i></div> <span id="f3" class="text-slate-700 font-medium">Board CQ & MCQ Practice</span></div>'
);

html = html.replace(
    '<div class="flex items-start gap-3"><i class="fa-solid fa-check text-emerald-500 mt-1"></i> <span id="f4" class="text-slate-700">Chapter-wise Model Tests</span></div>',
    '<div class="flex items-center gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100/50"><div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-500"><i class="fa-solid fa-file-signature"></i></div> <span id="f4" class="text-slate-700 font-medium">Chapter-wise Model Tests</span></div>'
);

fs.writeFileSync('course.html', html, 'utf8');
