const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

const badScript = `<script src="https://cdn.tailwindcss.com">
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
    </script>`;

const goodScriptHead = `<script src="https://cdn.tailwindcss.com"></script>`;

const globalToggleScript = `
<script>
    function toggleAccordion(id, iconId) {
        const el = document.getElementById(id);
        const icon = document.getElementById(iconId);
        if(el && icon) {
            if(el.classList.contains('hidden')) {
                el.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                el.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        }
    }
</script>
</body>`;

html = html.replace(badScript, goodScriptHead);
html = html.replace('</body>', globalToggleScript);

fs.writeFileSync('course.html', html, 'utf8');
