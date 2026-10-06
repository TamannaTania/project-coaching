const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('course.html', 'utf8');

// Extract all scripts
const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/g);
if (scripts) {
    scripts.forEach((s, idx) => {
        const content = s.replace(/<script[\s\S]*?>/, '').replace('</script>', '');
        try {
            new vm.Script(content);
            console.log(`Script ${idx} parses correctly.`);
        } catch (e) {
            console.error(`Script ${idx} ERROR:`, e);
        }
    });
}
