const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const teachersSection = `
    <!-- Meet Our Teachers -->
    <section id="teachers" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2 relative inline-block">
                    <span class="sparkle-text">
                        <i class="fa-solid fa-chalkboard-user text-purple-500 mr-2"></i><span id="teachersTitle">Meet Our Teachers</span>
                    </span>
                </h2>
                <p id="teachersDesc" class="text-slate-500 mt-4 text-lg">Learn from the best educators in the field.</p>
            </div>
            
            <div id="teachersGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Teachers will be injected here -->
                <div class="col-span-full text-center text-slate-400 py-10">
                    <i class="fa-solid fa-spinner fa-spin text-3xl mb-3"></i>
                    <p>Loading teachers...</p>
                </div>
            </div>
        </div>
    </section>
`;

const targetStr = `    <!-- Courses Section -->`;
html = html.replace(targetStr, teachersSection + '\n' + targetStr);

// Inject loadTeachers function
const loadTeachersScript = `
        async function loadTeachers() {
            try {
                const response = await fetch('/api/Teachers');
                if(response.ok) {
                    const teachers = await response.json();
                    const grid = document.getElementById('teachersGrid');
                    grid.innerHTML = '';
                    
                    if(teachers.length === 0) {
                        grid.innerHTML = '<div class="col-span-full text-center text-slate-500 bg-slate-50 py-10 rounded-2xl border border-slate-100">No teachers found.</div>';
                        return;
                    }

                    teachers.forEach(t => {
                        const imgUrl = t.imageUrl || 'https://via.placeholder.com/300';
                        grid.innerHTML += \`
                            <div class="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 hover:shadow-xl transition-shadow group">
                                <div class="h-48 overflow-hidden relative">
                                    <img src="\${imgUrl}" alt="\${t.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-center gap-3">
                                        \${t.facebookUrl ? \`<a href="\${t.facebookUrl}" target="_blank" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-blue-500 transition"><i class="fa-brands fa-facebook-f"></i></a>\` : ''}
                                        \${t.linkedInUrl ? \`<a href="\${t.linkedInUrl}" target="_blank" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-blue-700 transition"><i class="fa-brands fa-linkedin-in"></i></a>\` : ''}
                                    </div>
                                </div>
                                <div class="p-6 text-center">
                                    <h3 class="font-bold text-xl text-slate-800 mb-1">\${t.name}</h3>
                                    \${t.designation ? \`<p class="text-purple-600 font-medium text-sm mb-1">\${t.designation}</p>\` : ''}
                                    \${t.subject ? \`<p class="text-slate-500 text-sm font-semibold">\${t.subject}</p>\` : ''}
                                    \${t.bio ? \`<p class="text-slate-600 text-sm mt-3 line-clamp-3">\${t.bio}</p>\` : ''}
                                </div>
                            </div>
                        \`;
                    });
                }
            } catch (error) {
                console.error("Error loading teachers", error);
            }
        }
        
        loadTeachers();
`;

html = html.replace('loadCourses();', 'loadCourses();\n' + loadTeachersScript);

// Add translations
html = html.replace('coursesTitle: "Featured Courses",', 'coursesTitle: "Featured Courses", teachersTitle: "Meet Our Teachers", teachersDesc: "Learn from the best educators in the field.",');
html = html.replace('coursesTitle: "__ݨ.  1  ",', 'coursesTitle: "__ݨ.  1  ", teachersTitle: "    ؅ _ݪ?_ ؅" ?Y 1< ؅ ؅ ", teachersDesc: "__ݪ?_ ؅" ?Y  ? ؅ ?__ Y_+  ",');

fs.writeFileSync('wwwroot/index.html', html, 'utf8');
console.log("Added teachers section!");
