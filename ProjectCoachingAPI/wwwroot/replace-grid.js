const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

const regex = /<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div id="sidebarColumn"/;
const match = html.match(regex);

if(match) {
    const oldBlock = match[0].replace('</div>\n                </div>\n            </div>\n\n            <div id="sidebarColumn"', '');
    // Wait, regex match includes the sidebarColumn.
    // Let's just use string slicing.
    
    const startStr = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';
    let startIdx = html.indexOf(startStr);
    
    // We want to replace the div with gap-4 and its 4 children.
    // Just find the end of that specific grid div.
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
                    
    const beforeBlock = html.substring(0, startIdx);
    const endStr = '</div>\n                  </div>\n              </div>\n  \n              <div id="sidebarColumn"';
    let endIdx = html.indexOf('<div id="sidebarColumn"');
    
    // Actually let's just use regex to replace exactly the grid block
    let newHtml = html.replace(/<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div id="sidebarColumn"/, newLearnStr + '\n                  </div>\n              </div>\n\n              <div id="sidebarColumn"');
    fs.writeFileSync('course.html', newHtml, 'utf8');
    console.log("REPLACED BY REGEX");
} else {
    console.log("Regex failed to match");
}
