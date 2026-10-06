const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('admin-contents.html', 'utf8');
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
    new vm.Script(match[1]);
    console.log("Script passed!");
}
