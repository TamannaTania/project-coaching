const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin-contents.html', 'utf8');

// 1. Add Search Bar
const searchHtml = `
                    <div class="mb-6 relative">
                        <input type="text" id="adminSearch" onkeyup="filterAdminChapters()" placeholder="Search chapters, videos, or PDFs..." class="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition">
                        <i class="fa-solid fa-search absolute left-4 top-3.5 text-slate-400"></i>
                    </div>
`;

if(html.includes('<div id="chaptersContainer"')) {
    html = html.replace('<div id="chaptersContainer"', searchHtml + '\n                    <div id="chaptersContainer"');
}

// 2. Modify Chapter Rendering to be Accordion
// We need to change how `loadCourseDetails` renders `html += ...`
const regexHeader = /<div class="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">([\s\S]*?)<\/div>\s*<!-- Chapter Contents -->\s*<div class="p-6 bg-slate-50\/50">/g;

html = html.replace(regexHeader, (match, innerHeader) => {
    return `<div class="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition" onclick="toggleChapter(\${ch.id})">
                                  ${innerHeader}
                              </div>
                              <!-- Chapter Contents -->
                              <div id="chapter-content-\${ch.id}" class="p-6 bg-slate-50/50 hidden">`;
});

// Add rotation icon logic if they want, but let's keep it simple with just toggle.
// I will also add the toggleChapter and filterAdminChapters functions inside <script>
const scriptToAdd = `
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

html = html.replace('</script>', scriptToAdd + '\n    </script>');

// We also need to add the class `admin-chapter-card` to the outermost div of the chapter
// Currently it is: <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
html = html.replace(/<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">/g, 
                    `<div class="admin-chapter-card bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">`);


fs.writeFileSync('wwwroot/admin-contents.html', html, 'utf8');
console.log("Admin contents accordion and search added!");
