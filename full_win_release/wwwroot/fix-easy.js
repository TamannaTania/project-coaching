const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

html = html.replace('if(isEnrolled) {', 'if(isEnrolled) { handleEnrolledView(); ');
html = html.replace('if (isEnrolled) {', 'if (isEnrolled) { handleEnrolledView(); ');

fs.writeFileSync('course.html', html, 'utf8');
