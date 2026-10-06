const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-contents.html', 'utf8');

// The script got injected into tailwindcss script tag!
// It looks like:
// <script src="https://cdn.tailwindcss.com">
//         function toggleChapter(id) { ...
//         }
//     </script>

const brokenScript = `
        function toggleChapter(id) {
            const content = document.getElementById('chapter-content-' + id);
            if(content.classList.contains('hidden')) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        }

        function filterAdminChapters() {
            const query = document.getElementById('adminSearch').value.toLowerCase();
            const container = document.getElementById('chaptersContainer');
            const chapters = container.querySelectorAll('.admin-chapter-card');

            chapters.forEach(card => {
                const text = card.innerText.toLowerCase();
                if(text.includes(query)) {
                    card.classList.remove('hidden');
                    // If searching and found, expand it automatically
                    if(query.length > 0) {
                        const content = card.querySelector('div[id^="chapter-content-"]');
                        if(content) content.classList.remove('hidden');
                    } else {
                        // Collapse if search is cleared
                        const content = card.querySelector('div[id^="chapter-content-"]');
                        if(content) content.classList.add('hidden');
                    }
                } else {
                    card.classList.add('hidden');
                }
            });
        }
`;

// 1. Remove it from tailwind
html = html.replace(brokenScript + '\n    </script>', '</script>');

// 2. Put it at the end of the file before </body>
// But I need to wrap it in <script>
const correctScript = `
    <script>
${brokenScript}
    </script>
</body>`;

html = html.replace('</body>', correctScript);

fs.writeFileSync('wwwroot/admin-contents.html', html, 'utf8');
console.log("Fixed the broken script injection!");
