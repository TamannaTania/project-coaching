const fs = require('fs');
let content = fs.readFileSync('course.html', 'utf8');
content = content.replace("const response = await fetch('/api/Courses/' + courseId);", "const token = localStorage.getItem('token');\n                const response = await fetch('/api/Courses/' + courseId, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} });");
fs.writeFileSync('course.html', content);
