const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin.html', 'utf8');

const searchStr = '<a href="admin-contents.html" id="tabContents" style="text-decoration: none; padding: 10px 20px; background: transparent; border: none; font-size: 1.1rem; font-weight: bold; color: #6b7280; border-bottom: 3px solid transparent; cursor: pointer; display: inline-block;">Course Contents (চ্যাপ্টার ও ভিডিও)</a>';
const insertStr = '\n            <a href="admin-teachers.html" id="tabTeachers" style="text-decoration: none; padding: 10px 20px; background: transparent; border: none; font-size: 1.1rem; font-weight: bold; color: #6b7280; border-bottom: 3px solid transparent; cursor: pointer; display: inline-block;">টিচার ম্যানেজমেন্ট</a>';

if(html.includes(searchStr)) {
    html = html.replace(searchStr, searchStr + insertStr);
    fs.writeFileSync('wwwroot/admin.html', html, 'utf8');
    console.log("Updated admin tabs");
} else {
    console.log("Could not find exact string. Trying regex...");
    const regex = /<a href="admin-contents.html"[\s\S]*?<\/a>/;
    const match = html.match(regex);
    if(match) {
        html = html.replace(match[0], match[0] + insertStr);
        fs.writeFileSync('wwwroot/admin.html', html, 'utf8');
        console.log("Updated via regex!");
    } else {
        console.log("Failed to find tab");
    }
}
