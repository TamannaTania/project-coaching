const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
let count = 0;

while ((match = scriptRegex.exec(html)) !== null) {
    const code = match[1];
    try {
        new vm.Script(code);
        console.log(`Script ${count} parses correctly.`);
    } catch (e) {
        console.error(`Script ${count} syntax error:`, e.message);
    }
    count++;
}
