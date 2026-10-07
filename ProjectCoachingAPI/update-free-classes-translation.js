const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// Ensure translation application
const transApply = `
            if(document.getElementById('freeTitle')) document.getElementById('freeTitle').innerText = t.freeTitle;
            if(document.getElementById('freeDesc')) document.getElementById('freeDesc').innerText = t.freeDesc;
`;

if (!html.includes('document.getElementById(\'freeTitle\')')) {
    html = html.replace("document.getElementById('btnExplore').innerHTML", transApply + "\n            document.getElementById('btnExplore').innerHTML");
    fs.writeFileSync('wwwroot/index.html', html, 'utf8');
    console.log("Translation logic added.");
}
