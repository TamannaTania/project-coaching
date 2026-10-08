const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// The original hardcoded items
const hardcodedStart = html.indexOf('<div class="marquee-content gap-6 px-4 pb-8">');
if (hardcodedStart > -1) {
    const endTag = '</div>\n          </div>\n      </section>';
    const endPos = html.indexOf(endTag, hardcodedStart);
    
    if (endPos > -1) {
        const toReplace = html.substring(hardcodedStart, endPos + endTag.length);
        const dynamicContent = `
          <div class="marquee-container relative">
              <div id="successGrid" class="flex overflow-x-auto gap-6 px-4 pb-8 snap-x hide-scrollbar">
                  <!-- Students will be injected here -->
                  <div class="w-full text-center text-slate-400 py-10">
                      <i class="fa-solid fa-spinner fa-spin text-3xl mb-3"></i>
                      <p>Loading...</p>
                  </div>
              </div>
          </div>
      </section>
`;
        html = html.replace(toReplace, dynamicContent);
        
        // Add JS fetch logic
        const fetchJs = `
        async function loadSuccessStudents() {
            try {
                const res = await fetch('/api/SuccessStudents');
                if (res.ok) {
                    const data = await res.json();
                    const container = document.getElementById('successGrid');
                    if(!container) return;
                    
                    if (data.length === 0) {
                        container.innerHTML = '<div class="w-full text-center text-slate-400">No students found.</div>';
                        return;
                    }
                    
                    container.innerHTML = '';
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
                    });
                }
            } catch(e) {}
        }
        loadSuccessStudents();
`;
        html = html.replace('loadTeachers();', 'loadTeachers();\n' + fetchJs);
        
        fs.writeFileSync('wwwroot/index.html', html, 'utf8');
        console.log("Updated index.html to load success students dynamically.");
    }
}
