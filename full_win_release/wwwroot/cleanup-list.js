const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// Replace flex-col gap-3 with flex-col (for tighter list)
html = html.replace(/<div class="flex flex-col gap-3">/g, '<div class="flex flex-col">');

// Also update the icon sizing slightly if needed, or leave it.
// Right now the title says "PDF" or "Video" below it. We can remove the badge since the column already says "Study Materials" and "Video Lectures".

html = html.replace(/<span class="text-\[10px\] font-bold text-red-500 uppercase tracking-wider">PDF<\/span>/g, '');
html = html.replace(/<span class="text-\[10px\] font-bold text-blue-500 uppercase tracking-wider">Video<\/span>/g, '');

fs.writeFileSync('course.html', html, 'utf8');
console.log("Cleaned up list layout.");
