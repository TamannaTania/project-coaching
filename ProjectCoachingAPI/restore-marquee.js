const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// 1. Change the classes of successGrid
html = html.replace(
    'id="successGrid" class="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar" style="scroll-snap-type: x mandatory;"',
    'id="successGrid" class="marquee-content gap-6 px-4 pb-8"'
);

// 2. Modify loadSuccessStudents() to duplicate the content for seamless marquee effect
const fetchFuncStart = `                    container.innerHTML = '';
                    data.forEach((s, idx) => {
                        const borderColors = ['border-emerald-100', 'border-blue-100', 'border-purple-100', 'border-yellow-100', 'border-pink-100'];
                        const bColor = borderColors[idx % borderColors.length];
                        
                        container.innerHTML += \`
                        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 w-72 flex-shrink-0 flex flex-col items-center snap-center hover:shadow-lg transition transform hover:-translate-y-1">
                            <img src="\${s.imageUrl}" class="w-24 h-24 rounded-full mb-4 border-4 \${bColor} object-cover bg-slate-50" alt="\${s.name}">
                            <h3 class="text-xl font-bold text-slate-900">\${s.name}</h3>
                            <p class="text-emerald-600 font-bold mb-2">\${s.institution}</p>
                            <div class="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">\${s.batch}</div>
                        </div>
                        \`;
                    });`;

const newFetchFunc = fetchFuncStart + `
                    // Duplicate for seamless infinite marquee scrolling
                    container.innerHTML += container.innerHTML;
`;

html = html.replace(fetchFuncStart, newFetchFunc);

fs.writeFileSync('wwwroot/index.html', html, 'utf8');
console.log("Marquee restored in index.html");
