const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');
const oldLogic = fs.readFileSync('old_str.txt', 'utf8');
const newLogic = fs.readFileSync('new_str.txt', 'utf8');

if (html.includes(oldLogic)) {
    html = html.replace(oldLogic, newLogic);
    
    // Check if toggle function exists
    if (!html.includes('toggleAccordion(id, iconId)')) {
        const fn = `
        function toggleAccordion(id, iconId) {
            const el = document.getElementById(id);
            const icon = document.getElementById(iconId);
            if(el.classList.contains('hidden')) {
                el.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                el.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        }
    </` + `script>`;
        html = html.replace('</' + 'script>', fn);
    }
    
    fs.writeFileSync('course.html', html, 'utf8');
    console.log("REPLACEMENT SUCCESS!");
} else {
    console.log("OLD LOGIC NOT FOUND IN HTML");
}
