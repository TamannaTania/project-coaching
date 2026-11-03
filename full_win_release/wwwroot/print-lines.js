const fs = require('fs');
const html = fs.readFileSync('course.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/g);
const content = scripts[1].replace(/<script[\s\S]*?>/, '').replace('</script>', '');
const lines = content.split('\n');

for(let i=270; i<290; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
