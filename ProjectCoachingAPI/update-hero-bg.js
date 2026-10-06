const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const oldGradient = 'background: linear-gradient(150deg, #d4e0c8 0%, #6bc117 40%, #172114 100%);';
const newGradient = 'background: linear-gradient(135deg, #0f172a 0%, #14532d 100%);';

if(html.includes(oldGradient)) {
    html = html.replace(oldGradient, newGradient);
    fs.writeFileSync('wwwroot/index.html', html, 'utf8');
    console.log("Hero gradient updated!");
} else {
    console.log("Could not find the old gradient.");
}
