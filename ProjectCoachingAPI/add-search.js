const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

const searchHtml = `
                    <!-- Global Search -->
                    <div class="relative hidden lg:block">
                        <input type="text" id="globalSearch" placeholder="Search..." class="bg-white/80 border border-emerald-200 rounded-full pl-4 pr-10 py-1.5 text-sm focus:outline-none focus:border-emerald-500 w-48 transition-all focus:w-64 focus:bg-white shadow-sm placeholder-slate-400">
                        <i class="fa-solid fa-magnifying-glass absolute right-3 top-2.5 text-slate-400 text-sm"></i>
                    </div>
`;

if (!html.includes('id="globalSearch"')) {
    html = html.replace('<!-- Language Toggle -->', searchHtml + '\n                    <!-- Language Toggle -->');
    
    // Add JS logic to filter courses
    const searchJs = `
        document.getElementById('globalSearch').addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            const courses = document.querySelectorAll('#coursesGrid > div');
            let found = false;
            
            courses.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                const desc = card.querySelector('p').innerText.toLowerCase();
                if(title.includes(term) || desc.includes(term)) {
                    card.style.display = 'flex';
                    found = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // If user typed something, scroll to courses so they see it
            if(term.length > 0 && e.inputType !== 'deleteContentBackward') {
                document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
            }
        });
`;
    html = html.replace('loadCourses();', 'loadCourses();\n' + searchJs);
    
    fs.writeFileSync('wwwroot/index.html', html, 'utf8');
    console.log("Global search added!");
} else {
    console.log("Already added");
}
