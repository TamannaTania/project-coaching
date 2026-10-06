const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const targetClass = 'bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 hover:shadow-xl transition-shadow group';
const replacementClass = 'bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group';

if(html.includes(targetClass)) {
    html = html.replace(targetClass, replacementClass);
    fs.writeFileSync('wwwroot/index.html', html, 'utf8');
    console.log("Teacher cards animation class updated!");
} else {
    console.log("Could not find the target class string.");
}
