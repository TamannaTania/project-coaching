const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const targetClass = 'bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group';
const replacementClass = 'group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full cursor-pointer';

if(html.includes(targetClass)) {
    html = html.replace(targetClass, replacementClass);
    
    // Also update the image scale to match courses
    html = html.replace('group-hover:scale-105', 'group-hover:scale-110 ease-out');
    
    fs.writeFileSync('wwwroot/index.html', html, 'utf8');
    console.log("Teacher cards styling matched to course cards!");
} else {
    console.log("Could not find the target class string.");
}
