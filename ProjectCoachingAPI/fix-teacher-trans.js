const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const updateLogic = `
            if(document.getElementById('teachersTitle')) document.getElementById('teachersTitle').innerText = t.teachersTitle;
            if(document.getElementById('teachersDesc')) document.getElementById('teachersDesc').innerText = t.teachersDesc;
`;

if(!html.includes("document.getElementById('teachersTitle').innerText = t.teachersTitle")) {
    html = html.replace("document.getElementById('coursesTitle').innerText = t.coursesTitle;", "document.getElementById('coursesTitle').innerText = t.coursesTitle;" + updateLogic);
    fs.writeFileSync('wwwroot/index.html', html, 'utf8');
    console.log("Teacher translations logic fixed.");
}
