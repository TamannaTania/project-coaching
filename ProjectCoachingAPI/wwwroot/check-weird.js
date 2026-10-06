const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

const regex = /[^\x00-\x7F]/g;
let hasWeird = false;
let lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('chaptersHtml += `<div class="bg-white rounded-2xl')) {
        console.log("Found line:", lines[i]);
        console.log("Weird chars?", regex.test(lines[i]));
    }
}
