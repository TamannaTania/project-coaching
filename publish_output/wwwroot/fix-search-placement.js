const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// The bad snippet inside the tailwind script tag
const badScriptRegex = /<script src="https:\/\/cdn.tailwindcss.com">[\s\S]*?function filterChapters[\s\S]*?<\/script>/;

const match = html.match(badScriptRegex);
if(match) {
    html = html.replace(match[0], '<script src="https://cdn.tailwindcss.com"></script>');
    
    // add it to the bottom
    const goodFn = `
    function filterChapters(query) {
        query = query.toLowerCase().trim();
        const chapters = document.querySelectorAll('.chapter-item');
        chapters.forEach(chapter => {
            const text = chapter.textContent.toLowerCase();
            if(text.includes(query)) {
                chapter.style.display = 'block';
                // Auto-expand if they type something
                if(query.length > 0) {
                    const contentDiv = chapter.querySelector('div[id^="content-"]');
                    const icon = chapter.querySelector('div[id^="icon-"]');
                    if(contentDiv && contentDiv.classList.contains('hidden')) {
                        contentDiv.classList.remove('hidden');
                        if(icon) icon.style.transform = 'rotate(180deg)';
                    }
                } else {
                    // Auto-collapse if search is empty
                    const contentDiv = chapter.querySelector('div[id^="content-"]');
                    const icon = chapter.querySelector('div[id^="icon-"]');
                    if(contentDiv && !contentDiv.classList.contains('hidden')) {
                        contentDiv.classList.add('hidden');
                        if(icon) icon.style.transform = 'rotate(0deg)';
                    }
                }
            } else {
                chapter.style.display = 'none';
            }
        });
    }
</script>
</body>`;
    
    html = html.replace('</script>\n</body>', goodFn);
    fs.writeFileSync('course.html', html, 'utf8');
    console.log("Fixed filterChapters placement!");
} else {
    console.log("Could not find bad script!");
}
