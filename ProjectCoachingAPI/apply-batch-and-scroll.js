const fs = require('fs');

// 1. Add CSS to styles.css
const stylesPath = 'wwwroot/styles.css';
let css = fs.readFileSync(stylesPath, 'utf8');

const newStyles = `
/* ====================================================
   Batch Filter Tabs & Courses Scroll Styles
   ==================================================== */
.batch-tab-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 22px;
    border-radius: 9999px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    user-select: none;
    border: 2px solid #e2e8f0;
    background: #ffffff;
    color: #334155;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    outline: none;
}

.batch-tab-btn i {
    font-size: 1.05rem;
    transition: transform 0.25s ease;
}

.batch-tab-btn:hover {
    transform: translateY(-4px) scale(1.05);
    border-color: #93c5fd !important;
    color: #1d4ed8 !important;
    box-shadow: 0 12px 24px -6px rgba(59, 130, 246, 0.25);
    background: #f8fafc;
}

.batch-tab-btn:hover i {
    transform: scale(1.25) rotate(-8deg);
}

.batch-tab-btn:active {
    transform: translateY(0) scale(0.97);
}

.batch-tab-btn.active {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
    color: #ffffff !important;
    border-color: #2563eb !important;
    box-shadow: 0 10px 25px -4px rgba(37, 99, 235, 0.45) !important;
    transform: translateY(-2px) scale(1.04);
}

.batch-tab-btn.active i {
    color: #ffffff !important;
    transform: scale(1.15);
}

/* Custom Scrollbar for Courses Container */
.courses-custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #3b82f6 #f1f5f9;
}

.courses-custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}
.courses-custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 12px;
}
.courses-custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #3b82f6 0%, #10b981 100%);
    border-radius: 12px;
}
.courses-custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #1d4ed8 0%, #059669 100%);
}
`;

if (!css.includes('.batch-tab-btn {')) {
    css += '\n' + newStyles;
    fs.writeFileSync(stylesPath, css, 'utf8');
    console.log('Appended styles to wwwroot/styles.css');
}

// 2. Update index.html and Views/Home/index.html
const indexFiles = ['wwwroot/index.html', 'wwwroot/Views/Home/index.html'];

const oldTabsAndGridRegex = /<!-- ACS Style Batch Filter Tabs -->[\s\S]*?<!-- Dynamic Courses Grid -->[\s\S]*?<div id="coursesGrid" class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">[\s\S]*?<\/div>/;

const newTabsAndGridHtml = `<!-- ACS Style Batch Filter Tabs -->
            <div class="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap mb-10 max-w-5xl mx-auto px-4" id="batchTabsContainer">
                <button type="button" onclick="filterCoursesByBatch('ALL')" class="batch-tab-btn active" data-batch="ALL">
                    <i class="fa-solid fa-layer-group text-blue-500"></i> <span>সকল কোর্স</span>
                </button>
                <button type="button" onclick="filterCoursesByBatch('HSC 2028')" class="batch-tab-btn" data-batch="HSC 2028">
                    <i class="fa-solid fa-graduation-cap text-blue-500"></i> <span>HSC 2028</span>
                </button>
                <button type="button" onclick="filterCoursesByBatch('HSC 2027')" class="batch-tab-btn" data-batch="HSC 2027">
                    <i class="fa-solid fa-graduation-cap text-indigo-500"></i> <span>HSC 2027</span>
                </button>
                <button type="button" onclick="filterCoursesByBatch('HSC 2026')" class="batch-tab-btn" data-batch="HSC 2026">
                    <i class="fa-solid fa-graduation-cap text-purple-500"></i> <span>HSC 2026</span>
                </button>
                <button type="button" onclick="filterCoursesByBatch('SSC 2029')" class="batch-tab-btn" data-batch="SSC 2029">
                    <i class="fa-solid fa-book-open text-emerald-500"></i> <span>SSC 2029</span>
                </button>
                <button type="button" onclick="filterCoursesByBatch('SSC 2028')" class="batch-tab-btn" data-batch="SSC 2028">
                    <i class="fa-solid fa-book-open text-teal-500"></i> <span>SSC 2028</span>
                </button>
                <button type="button" onclick="filterCoursesByBatch('Admission')" class="batch-tab-btn" data-batch="Admission">
                    <i class="fa-solid fa-rocket text-amber-500"></i> <span>এডমিশন</span>
                </button>
            </div>

            <!-- Dynamic Courses Grid with 4-card Max Height & Scroll -->
            <div id="coursesScrollWrapper" class="max-w-6xl mx-auto">
                <div id="coursesScrollContainer" class="courses-custom-scrollbar max-h-[960px] overflow-y-auto px-2 sm:px-4 py-3 pr-2 sm:pr-3 scroll-smooth rounded-3xl">
                    <div id="coursesGrid" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Courses will be loaded here via JS -->
                    </div>
                </div>
                <!-- Scroll down hint when there are more courses -->
                <div id="courseScrollHint" class="hidden text-center mt-5 text-xs sm:text-sm font-bold text-slate-500 items-center justify-center gap-2 py-2 px-5 bg-white/90 backdrop-blur-sm rounded-full border border-slate-200/80 shadow-sm max-w-xs mx-auto transition-all">
                    <i class="fa-solid fa-angles-down text-blue-600 animate-bounce"></i> <span>আরও কোর্স দেখতে নিচে স্ক্রোল করুন</span>
                </div>
            </div>`;

indexFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        if (oldTabsAndGridRegex.test(content)) {
            content = content.replace(oldTabsAndGridRegex, newTabsAndGridHtml);
            fs.writeFileSync(f, content, 'utf8');
            console.log('Updated batch tabs & scroll grid in:', f);
        } else {
            console.log('Regex did not match in:', f);
        }
    }
});

// 3. Update index.js filterCoursesByBatch and renderCoursesList logic
const jsPath = 'wwwroot/Scripts/Home/index.js';
let js = fs.readFileSync(jsPath, 'utf8');

// Update filterCoursesByBatch
const oldFilterRegex = /function filterCoursesByBatch\(batch\) \{[\s\S]*?renderCoursesList\(\);\s*\}/;
const newFilterFunc = `function filterCoursesByBatch(batch) {
    currentSelectedBatch = batch || 'ALL';
    
    // Update button active state
    const buttons = document.querySelectorAll('#batchTabsContainer .batch-tab-btn');
    buttons.forEach(btn => {
        const btnBatch = btn.getAttribute('data-batch');
        if (btnBatch === currentSelectedBatch) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderCoursesList();
}`;

js = js.replace(oldFilterRegex, newFilterFunc);

// Update renderCoursesList to toggle scroll and hint
const oldScrollLogic = 'grid.innerHTML = \'\';';
const newScrollLogic = `const scrollContainer = document.getElementById('coursesScrollContainer');
    const scrollHint = document.getElementById('courseScrollHint');

    if (filtered.length > 4) {
        if (scrollContainer) {
            scrollContainer.classList.add('max-h-[960px]', 'overflow-y-auto');
        }
        if (scrollHint) {
            scrollHint.classList.remove('hidden');
            scrollHint.classList.add('flex');
        }
    } else {
        if (scrollContainer) {
            scrollContainer.classList.remove('max-h-[960px]', 'overflow-y-auto');
        }
        if (scrollHint) {
            scrollHint.classList.add('hidden');
            scrollHint.classList.remove('flex');
        }
    }

    grid.innerHTML = '';`;

if (!js.includes('coursesScrollContainer')) {
    js = js.replace(oldScrollLogic, newScrollLogic);
    fs.writeFileSync(jsPath, js, 'utf8');
    console.log('Updated renderCoursesList in index.js');
}
