const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// 1. Update Footer
html = html.replace('bg-slate-900', 'bg-gradient-to-b from-slate-800 to-slate-950');

// 2. Update Header (navbar)
// Currently it uses glass-nav which has a background in CSS.
// Let's remove the CSS background from glass-nav and add Tailwind gradient.
html = html.replace(/background: rgba\(255, 255, 255, 0\.85\);/, '/* background replaced with tailwind classes */');
html = html.replace('<nav class="glass-nav fixed', '<nav class="glass-nav bg-gradient-to-r from-white to-emerald-100/90 fixed');

fs.writeFileSync('wwwroot/index.html', html, 'utf8');
console.log("Updated header and footer gradients!");
