const fs = require('fs');

const files = ['wwwroot/login.html', 'wwwroot/register.html'];

files.forEach(file => {
    if(fs.existsSync(file)) {
        let html = fs.readFileSync(file, 'utf8');
        
        // 1. Update hero-bg gradient
        const oldGradient = 'background: linear-gradient(150deg, #d4e0c8 0%, #6bc117 40%, #172114 100%);';
        const newGradient = 'background: linear-gradient(135deg, #0f172a 0%, #14532d 100%);';
        html = html.replace(oldGradient, newGradient);
        
        // 2. Update button colors
        html = html.replace(/bg-\[#6bc117\]/g, 'bg-emerald-600');
        html = html.replace(/hover:bg-\[#5ba712\]/g, 'hover:bg-emerald-700');
        html = html.replace(/shadow-\[#6bc117\]\/30/g, 'shadow-emerald-600/30');
        html = html.replace(/text-\[#6bc117\]/g, 'text-emerald-600');
        
        fs.writeFileSync(file, html, 'utf8');
    }
});
console.log("Login and Register colors updated!");
