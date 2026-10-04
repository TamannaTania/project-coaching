const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

if (!html.includes('id="tabContents"')) {
    const tabInsert = `<a href="admin-contents.html" id="tabContents" style="text-decoration: none; padding: 10px 20px; background: transparent; border: none; font-size: 1.1rem; font-weight: bold; color: #6b7280; border-bottom: 3px solid transparent; cursor: pointer; display: inline-block;">Course Contents (চ্যাপ্টার ও ভিডিও)</a>`;
    html = html.replace('<button id="tabPayments"', tabInsert + '\n            <button id="tabPayments"');
    fs.writeFileSync('admin.html', html, 'utf8');
}
