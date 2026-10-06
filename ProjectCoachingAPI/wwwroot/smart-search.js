const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

const oldFn = `        function filterChapters(query) {
            query = query.toLowerCase();
            const chapters = document.querySelectorAll('.chapter-item');
            chapters.forEach(chapter => {
                const text = chapter.textContent.toLowerCase();
                if(text.includes(query)) {
                    chapter.style.display = 'block';
                } else {
                    chapter.style.display = 'none';
                }
            });
        }`;

const newFn = `        function filterChapters(query) {
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
        }`;

if(html.includes(oldFn)) {
    html = html.replace(oldFn, newFn);
    fs.writeFileSync('course.html', html, 'utf8');
    console.log("Upgraded search function!");
} else {
    console.log("Could not find oldFn");
}
