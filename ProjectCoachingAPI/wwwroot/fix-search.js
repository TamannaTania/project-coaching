const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// replace innerText with textContent in filterChapters
html = html.replace('const text = chapter.innerText.toLowerCase();', 'const text = chapter.textContent.toLowerCase();');

fs.writeFileSync('course.html', html, 'utf8');
console.log("Fixed search logic to include hidden contents");
