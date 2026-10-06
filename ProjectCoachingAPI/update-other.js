const fs = require('fs');

const files = ['wwwroot/course.html', 'wwwroot/admin.html', 'wwwroot/admin-teachers.html'];

files.forEach(file => {
    if(fs.existsSync(file)) {
        let html = fs.readFileSync(file, 'utf8');
        
        // Update Footer
        html = html.replace('bg-slate-900', 'bg-gradient-to-b from-slate-800 to-slate-950');
        
        // Update Header
        html = html.replace(/background: rgba\(255, 255, 255, 0\.\d+\);/, '/* background replaced */');
        html = html.replace('<nav class="glass-nav fixed', '<nav class="glass-nav bg-gradient-to-r from-white to-emerald-100/90 fixed');
        
        fs.writeFileSync(file, html, 'utf8');
    }
});
console.log("Updated other pages as well!");
