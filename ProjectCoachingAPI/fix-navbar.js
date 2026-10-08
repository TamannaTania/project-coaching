const fs = require('fs');
let html = fs.readFileSync('wwwroot/index.html', 'utf8');

// 1. Change space-x-8 to gap-4 (or space-x-4) and add flex-wrap? No, just reduce gap.
html = html.replace('class="hidden md:flex space-x-8 items-center"', 'class="hidden lg:flex gap-4 xl:gap-6 items-center"');

// 2. Add whitespace-nowrap to nav links so they don't break into two lines
html = html.replace(/id="navHome" class="/g, 'id="navHome" class="whitespace-nowrap ');
html = html.replace(/id="navAbout" class="/g, 'id="navAbout" class="whitespace-nowrap ');
html = html.replace(/id="navCourses" class="/g, 'id="navCourses" class="whitespace-nowrap ');
html = html.replace(/id="navTeachers" class="/g, 'id="navTeachers" class="whitespace-nowrap ');
html = html.replace(/id="navFreeClasses" class="/g, 'id="navFreeClasses" class="whitespace-nowrap ');

// 3. Make Language Toggle flex-shrink-0
html = html.replace('class="flex items-center border border-emerald-200 rounded-full overflow-hidden bg-emerald-50"', 'class="flex items-center border border-emerald-200 rounded-full overflow-hidden bg-emerald-50 flex-shrink-0"');

// 4. Reduce search bar size on smaller screens
html = html.replace('w-48 transition-all focus:w-64', 'w-32 xl:w-48 transition-all focus:w-48 xl:focus:w-64');

// 5. Ensure the logo has a minimum margin right so it doesn't glue to Home
html = html.replace('class="flex items-center gap-2"', 'class="flex items-center gap-2 mr-4 flex-shrink-0"');

fs.writeFileSync('wwwroot/index.html', html, 'utf8');
console.log("Navbar responsiveness fixed!");
