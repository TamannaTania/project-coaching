const fs = require('fs');

let html = fs.readFileSync('admin-contents.html', 'utf8');

// Replace the native select with custom dropdown UI
const oldSelectDiv = `<div class="relative">
                <select id="courseSelect" onchange="loadCourseDetails()" class="w-full appearance-none bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition cursor-pointer">
                    <option value="">-- Choose a Course --</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-slate-500">
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
            </div>`;

const newDropdownUI = `<div class="relative w-full" id="customDropdown">
                <input type="hidden" id="courseSelect">
                <button type="button" onclick="toggleDropdown()" id="dropdownTrigger" class="w-full flex justify-between items-center bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-lg font-medium text-slate-800 hover:border-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm"><i class="fa-solid fa-book"></i></div>
                        <span id="dropdownSelectedText">-- Choose a Course --</span>
                    </div>
                    <i class="fa-solid fa-chevron-down text-slate-400 transition-transform duration-300" id="dropdownIcon"></i>
                </button>
                
                <div id="dropdownMenu" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden hidden transform origin-top transition-all duration-200 scale-95 opacity-0" style="max-height: 300px; overflow-y: auto;">
                    <div class="p-2 space-y-1" id="dropdownOptions">
                        <!-- Options will be injected here -->
                    </div>
                </div>
            </div>`;

html = html.replace(oldSelectDiv, newDropdownUI);

// Replace loadCourses function
const oldLoadCourses = `async function loadCourses() {
            try {
                const res = await fetch('/api/Courses');
                const courses = await res.json();
                const select = document.getElementById('courseSelect');
                courses.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.title;
                    select.appendChild(opt);
                });
            } catch (err) {
                console.error(err);
            }
        }`;

const newLoadCourses = `
        // Custom Dropdown Logic
        function toggleDropdown() {
            const menu = document.getElementById('dropdownMenu');
            const icon = document.getElementById('dropdownIcon');
            
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
                setTimeout(() => {
                    menu.classList.remove('scale-95', 'opacity-0');
                    menu.classList.add('scale-100', 'opacity-100');
                }, 10);
                icon.style.transform = 'rotate(180deg)';
            } else {
                closeDropdown();
            }
        }

        function closeDropdown() {
            const menu = document.getElementById('dropdownMenu');
            const icon = document.getElementById('dropdownIcon');
            menu.classList.remove('scale-100', 'opacity-100');
            menu.classList.add('scale-95', 'opacity-0');
            setTimeout(() => { menu.classList.add('hidden'); }, 200);
            icon.style.transform = 'rotate(0deg)';
        }

        function selectCourse(id, title) {
            document.getElementById('courseSelect').value = id;
            document.getElementById('dropdownSelectedText').innerText = title;
            closeDropdown();
            
            // Highlight selected option
            document.querySelectorAll('.dropdown-opt').forEach(el => {
                el.classList.remove('bg-emerald-50', 'border-emerald-200', 'text-emerald-700');
                el.classList.add('border-transparent', 'text-slate-700', 'hover:bg-slate-50');
            });
            const selectedOpt = document.getElementById('opt-' + id);
            if(selectedOpt) {
                selectedOpt.classList.remove('border-transparent', 'text-slate-700', 'hover:bg-slate-50');
                selectedOpt.classList.add('bg-emerald-50', 'border-emerald-200', 'text-emerald-700');
            }

            loadCourseDetails();
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('customDropdown');
            if (dropdown && !dropdown.contains(e.target)) {
                closeDropdown();
            }
        });

        async function loadCourses() {
            try {
                const res = await fetch('/api/Courses');
                const courses = await res.json();
                const container = document.getElementById('dropdownOptions');
                
                // Default option
                let html = \`<div onclick="selectCourse('', '-- Choose a Course --')" class="dropdown-opt cursor-pointer px-4 py-3 rounded-lg border border-transparent text-slate-700 hover:bg-slate-50 transition flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><i class="fa-solid fa-minus text-slate-400"></i></div>
                                <span class="font-medium">-- Choose a Course --</span>
                            </div>\`;

                courses.forEach(c => {
                    html += \`<div id="opt-\${c.id}" onclick="selectCourse('\${c.id}', '\${c.title}')" class="dropdown-opt cursor-pointer px-4 py-3 rounded-lg border border-transparent text-slate-700 hover:bg-slate-50 transition flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><i class="fa-solid fa-graduation-cap text-emerald-600"></i></div>
                                <div>
                                    <div class="font-bold">\${c.title}</div>
                                    <div class="text-xs text-slate-400">ID: \${c.id}</div>
                                </div>
                            </div>\`;
                });
                
                container.innerHTML = html;
            } catch (err) {
                console.error(err);
            }
        }`;

html = html.replace(oldLoadCourses, newLoadCourses);

fs.writeFileSync('admin-contents.html', html, 'utf8');
