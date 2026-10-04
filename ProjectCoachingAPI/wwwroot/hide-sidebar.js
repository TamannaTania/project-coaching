const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// Add IDs to columns
html = html.replace('<div class="lg:col-span-2 space-y-8">', '<div id="mainColumn" class="lg:col-span-2 space-y-8">');
html = html.replace('<div class="lg:col-span-1">', '<div id="sidebarColumn" class="lg:col-span-1">');

// Add function handleEnrolledView
const enrolledFunction = `
        function handleEnrolledView() {
            // Hide lock screen
            const vp = document.getElementById('videoPlaceholder');
            if(vp) vp.style.display = 'none';
            
            // Hide Sidebar and expand main column
            const sidebar = document.getElementById('sidebarColumn');
            const mainCol = document.getElementById('mainColumn');
            if(sidebar && mainCol) {
                sidebar.style.display = 'none';
                mainCol.classList.remove('lg:col-span-2');
                mainCol.classList.add('lg:col-span-3');
            }
        }
`;

// Insert the function before loadCourseDetails
html = html.replace('async function loadCourseDetails() {', enrolledFunction + '\n        async function loadCourseDetails() {');

// Use handleEnrolledView inside course.isEnrolled check
const oldIsEnrolledCheck = `if (course.isEnrolled) {
                    const vp = document.getElementById('videoPlaceholder');
                    if(vp) vp.style.display = 'none';

                    const actionDiv = document.getElementById('enrollAction');
                    if(actionDiv) {
                        actionDiv.innerHTML = \`<div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
                            <i class="fa-solid fa-circle-check text-2xl"></i>
                            <div class="font-bold">\${t.statusEnrolled || 'Already Enrolled'}</div>
                        </div>\`;
                    }
                }`;

html = html.replace(oldIsEnrolledCheck, `if (course.isEnrolled) { handleEnrolledView(); }`);

// Use handleEnrolledView inside fallback mycourses check
const oldFallbackCheck = `                            if (isEnrolled) {
                                const vp = document.getElementById('videoPlaceholder');
                                if(vp) vp.style.display = 'none';
                                
                                const actionDiv = document.getElementById('enrollAction');
                                if(actionDiv) {
                                    actionDiv.innerHTML = \`<div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
                                        <i class="fa-solid fa-circle-check text-2xl"></i>
                                        <div class="font-bold">\${t.statusEnrolled || 'Already Enrolled'}</div>
                                    </div>\`;
                                }
                            }`;

html = html.replace(oldFallbackCheck, `                            if (isEnrolled) { handleEnrolledView(); }`);

fs.writeFileSync('course.html', html, 'utf8');
