const fs = require('fs');
let html = fs.readFileSync('course.html', 'utf8');

// Replace actionDiv updates with handleEnrolledView + rendering
const replacement = `if(isEnrolled) {
                    handleEnrolledView();

                    // Render Chapters`;

html = html.replace(`if(isEnrolled) {
                    const vp = document.getElementById('videoPlaceholder');
                    if(vp) vp.style.display = 'none';

                    const actionDiv = document.getElementById('enrollAction');
                    if(actionDiv) {
                        actionDiv.innerHTML = \`<div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
                            <i class="fa-solid fa-circle-check text-2xl"></i>
                            <div class="font-bold">\${t.statusEnrolled}</div>
                        </div>\`;
                    }

                    // Render Chapters`, replacement);

const fallbackReplace = `if (isEnrolled) {
                                handleEnrolledView();
                                
                                // Render Chapters (fallback)`;

html = html.replace(`if (isEnrolled) {
                                // hide video placeholder
                                const vp = document.getElementById('videoPlaceholder');
                                if(vp) vp.style.display = 'none';
                                
                                // change button
                                const actionDiv = document.getElementById('enrollAction');
                                if(actionDiv) {
                                    actionDiv.innerHTML = \`<div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
                                        <i class="fa-solid fa-circle-check text-2xl"></i>
                                        <div class="font-bold">\${t.statusEnrolled}</div>
                                    </div>\`;
                                }`, fallbackReplace);

fs.writeFileSync('course.html', html, 'utf8');
