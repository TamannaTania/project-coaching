const fs = require('fs');

let adminHtml = fs.readFileSync('wwwroot/admin.html', 'utf8');

const freeClassTab = `
            <a href="admin-freeclasses.html" id="tabFreeClasses" style="text-decoration: none; padding: 10px 20px; background: transparent; border: none; font-size: 1.1rem; font-weight: bold; color: #6b7280; border-bottom: 3px solid transparent; cursor: pointer; display: inline-block;">Free Classes</a>
`;

adminHtml = adminHtml.replace('<a href="admin-teachers.html" id="tabTeachers"', freeClassTab + '\n            <a href="admin-teachers.html" id="tabTeachers"');
fs.writeFileSync('wwwroot/admin.html', adminHtml, 'utf8');
console.log("Added Free Classes link to admin.html");
