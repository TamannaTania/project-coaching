const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// Remove the broken toggleAccordion from head
html = html.replace(`<script src="https://cdn.tailwindcss.com">\n        function toggleAccordion(id, iconId) {\n            const el = document.getElementById(id);\n            const icon = document.getElementById(iconId);\n            if(el.classList.contains('hidden')) {\n                el.classList.remove('hidden');\n                icon.style.transform = 'rotate(180deg)';\n            } else {\n                el.classList.add('hidden');\n                icon.style.transform = 'rotate(0deg)';\n            }\n        }\n    </script>`, `<script src="https://cdn.tailwindcss.com"></script>`);

// Add it to the end of the file before </body>
const scriptBlock = `
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
    </script>
</body>`;

html = html.replace(`</script>\n</body>`, scriptBlock);

fs.writeFileSync('course.html', html, 'utf8');
