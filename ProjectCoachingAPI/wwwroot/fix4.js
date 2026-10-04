const fs = require('fs');

const code = `        async function loadCourseDetails() {
            if(!courseId) {
                document.getElementById('courseHeader').innerHTML = '<h1 class="text-slate-900 text-3xl font-bold">Course Not Found</h1>';
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/Courses/' + courseId, { headers: token ? { 'Authorization': 'Bearer ' + token } : {} });
                const course = await response.json();

                if(!course) throw new Error("Not found");

                document.getElementById('courseHeader').innerHTML = \`
                    <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-2">\${course.title}</h1>
                    <p class="text-slate-500 font-medium">Complete Physics Preparation Batch</p>
                \`;

                let imgUrl = course.imageUrl || 'https://via.placeholder.com/800x400?text=Physics+Course';
                if(!imgUrl.startsWith('http')) {
                    imgUrl = '/' + imgUrl.replace(/^\\//, '');
                }
                document.getElementById('courseImage').src = imgUrl;

                document.getElementById('coursePrice').innerText = '৳' + course.price;
                document.getElementById('courseDesc').innerText = course.description;
                document.getElementById('enrolledCount').innerText = course.enrolledCount || 0;

                const lang = localStorage.getItem('lang') || 'en';
                const t = translations[lang];

                let isEnrolled = course.isEnrolled === true;

                if(isEnrolled) {
                    const actionDiv = document.getElementById('enrollAction');
                    actionDiv.innerHTML = \`<div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
                        <i class="fa-solid fa-circle-check text-2xl"></i>
                        <div class="font-bold">\${t.statusEnrolled}</div>
                    </div>\`;

                    // Render Chapters
                    let chaptersHtml = '<div class="mt-8"><h3 class="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Course Contents</h3><div class="space-y-4">';
                    
                    if (course.chapters && course.chapters.length > 0) {
                        course.chapters.forEach(ch => {
                            chaptersHtml += \`<div class="border rounded-xl overflow-hidden shadow-sm">\`;
                            chaptersHtml += \`<div class="bg-slate-50 p-4 font-bold text-lg text-slate-800 flex justify-between items-center"><div class="flex items-center gap-2"><i class="fa-solid fa-folder-open text-emerald-600"></i> \${ch.title}</div></div>\`;
                            if (ch.contents && ch.contents.length > 0) {
                                chaptersHtml += \`<div class="p-4 bg-white divide-y">\`;
                                ch.contents.forEach(co => {
                                    let icon = co.type === 'Video' ? 'fa-circle-play text-blue-500' : 'fa-file-pdf text-red-500';
                                    let typeLabel = co.type === 'Video' ? 'Video' : 'PDF';
                                    chaptersHtml += \`
                                        <a href="\${co.url}" target="_blank" class="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded transition cursor-pointer group">
                                            <div class="flex items-center gap-3">
                                                <i class="fa-solid \${icon} text-xl group-hover:scale-110 transition"></i>
                                                <span class="font-medium text-slate-700 group-hover:text-emerald-600">\${co.title}</span>
                                            </div>
                                            <span class="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold uppercase">\${typeLabel}</span>
                                        </a>
                                    \`;
                                });
                                chaptersHtml += \`</div>\`;
                            } else {
                                chaptersHtml += \`<div class="p-4 text-slate-500 text-sm">No contents available in this chapter yet.</div>\`;
                            }
                            chaptersHtml += \`</div>\`;
                        });
                    } else {
                        chaptersHtml += \`<div class="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed"><i class="fa-solid fa-box-open text-3xl mb-2 text-slate-400"></i><br>Chapters will be uploaded soon.</div>\`;
                    }
                    chaptersHtml += '</div></div>';
                    
                    document.getElementById('overviewContent').innerHTML += chaptersHtml;
                } else if(token) {
                    // Check if pending
                    const enrollRes = await fetch('/api/Enrollments/mycourses', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    if(enrollRes.ok) {
                        const myCourses = await enrollRes.json();
                        const pending = myCourses.find(c => c.courseId == courseId);
                        if(pending) {
                            const actionDiv = document.getElementById('enrollAction');
                            actionDiv.innerHTML = \`<div class="bg-amber-50 text-amber-700 p-4 rounded-xl flex items-center gap-3 border border-amber-100">
                                <i class="fa-solid fa-clock text-2xl"></i>
                                <div class="font-bold">\${t.statusPending}</div>
                            </div>\`;
                        }
                    }
                }
            } catch (error) {
                console.error(error);
                document.getElementById('courseHeader').innerHTML = '<h1 class="text-slate-900 text-3xl font-bold">Error loading course</h1>';
            }
        }`;

let content = fs.readFileSync('course.html', 'utf8');

const startIdx = content.indexOf('async function loadCourseDetails()');
const endIdx = content.indexOf('window.onload = () => {');

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + code.trim() + '\n\n        ' + content.substring(endIdx);
    fs.writeFileSync('course.html', content, 'utf8');
    console.log('Fixed course.html');
}
