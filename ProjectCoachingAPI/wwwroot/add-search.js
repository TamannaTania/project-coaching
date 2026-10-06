const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// Update the heading and container
const oldHeader = `'<div class="mt-10"><h3 class="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3"><i class="fa-solid fa-layer-group text-emerald-500"></i> Course Contents</h3><div class="space-y-6">'`;
const newHeader = `\`
<div class="mt-12 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <h3 class="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
        <i class="fa-solid fa-layer-group text-emerald-500"></i> Course Contents
    </h3>
    <div class="relative w-full sm:w-72">
        <input type="text" id="chapterSearch" onkeyup="filterChapters(this.value)" placeholder="Search chapters & topics..." class="w-full bg-white border border-slate-200 rounded-full px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm">
        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400"></i>
    </div>
</div>
<div class="space-y-6" id="chaptersContainer">
\``;

html = html.replace(oldHeader, newHeader);

// Add chapter-item class
const oldDiv = `chaptersHtml += \`<div class="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transform transition duration-200 hover:shadow-lg mb-4">\`;`;
const newDiv = `chaptersHtml += \`<div class="chapter-item bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transform transition duration-200 hover:shadow-lg mb-4">\`;`;

html = html.replace(oldDiv, newDiv);

// Add filter function at the end
const filterFn = `
        function filterChapters(query) {
            query = query.toLowerCase();
            const chapters = document.querySelectorAll('.chapter-item');
            chapters.forEach(chapter => {
                const text = chapter.innerText.toLowerCase();
                if(text.includes(query)) {
                    chapter.style.display = 'block';
                } else {
                    chapter.style.display = 'none';
                }
            });
        }
    </script>
`;

html = html.replace('</script>', filterFn);

fs.writeFileSync('course.html', html, 'utf8');
console.log("Added search bar!");
