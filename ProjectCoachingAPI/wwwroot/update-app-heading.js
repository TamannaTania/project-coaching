const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldAppBlock = `<div class="inline-block bg-gradient-to-r from-slate-800 to-slate-700 p-4 px-8 rounded-2xl shadow-lg mb-6 transform transition hover:-translate-y-1 text-center md:text-left">
                    <h2 id="appTitle" class="text-3xl font-extrabold text-white flex justify-center md:justify-start items-center gap-3">
                        <i class="fa-solid fa-mobile-screen text-blue-300"></i> Learn Anywhere, Anytime.
                    </h2>
                </div>`;

const newAppBlock = `<div class="heading-container mb-6 text-center md:text-left">
                    <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 sparkle-text left-align">
                        <i class="fa-solid fa-mobile-screen text-blue-500 mr-2"></i><span id="appTitle">Learn Anywhere, Anytime.</span>
                    </h2>
                </div>`;

// Use replaceAll in case there's something weird, or just replace with exact substring
html = html.replace(oldAppBlock, newAppBlock);

// Try regex fallback just in case spaces/newlines are different
if(!html.includes('sparkle-text left-align')) {
    const fallbackRegex = /<div class="inline-block bg-gradient-to-r from-slate-800 to-slate-700 p-4 px-8 rounded-2xl shadow-lg\s*mb-6 transform transition hover:-translate-y-1 text-center md:text-left">\s*<h2 id="appTitle" class="text-3xl font-extrabold text-white flex justify-center md:justify-start\s*items-center gap-3">\s*<i class="fa-solid fa-mobile-screen text-blue-300"><\/i> Learn Anywhere, Anytime\.\s*<\/h2>\s*<\/div>/;
    html = html.replace(fallbackRegex, newAppBlock);
}

fs.writeFileSync('index.html', html, 'utf8');
