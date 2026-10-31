const fs = require('fs');

const indexFiles = ['wwwroot/index.html', 'wwwroot/Views/Home/index.html'];

const batchStyle = `
        /* ====================================================
           High Visibility Batch Filter Tabs (Interactive)
           ==================================================== */
        .batch-tab-bar {
            background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
            border: 2px solid #cbd5e1;
            padding: 10px 14px;
            border-radius: 9999px;
            box-shadow: 0 4px 15px -1px rgba(0, 0, 0, 0.06), inset 0 2px 4px rgba(255, 255, 255, 0.8);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .batch-tab-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            padding: 12px 24px !important;
            border-radius: 9999px !important;
            font-size: 1rem !important;
            font-weight: 800 !important;
            cursor: pointer !important;
            user-select: none !important;
            border: 2px solid #cbd5e1 !important;
            background: #ffffff !important;
            color: #1e293b !important;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06) !important;
            transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            outline: none !important;
        }

        .batch-tab-btn i {
            font-size: 1.15rem !important;
            transition: transform 0.25s ease !important;
        }

        .batch-tab-btn:hover {
            transform: translateY(-4px) scale(1.06) !important;
            border-color: #3b82f6 !important;
            color: #1d4ed8 !important;
            box-shadow: 0 14px 28px -4px rgba(37, 99, 235, 0.3) !important;
            background: #f0f7ff !important;
        }

        .batch-tab-btn:hover i {
            transform: scale(1.3) rotate(-8deg) !important;
        }

        .batch-tab-btn:active {
            transform: translateY(0) scale(0.97) !important;
        }

        .batch-tab-btn.active {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
            color: #ffffff !important;
            border-color: #1d4ed8 !important;
            box-shadow: 0 12px 26px -4px rgba(37, 99, 235, 0.5) !important;
            transform: translateY(-2px) scale(1.05) !important;
        }

        .batch-tab-btn.active i {
            color: #ffffff !important;
            transform: scale(1.2) !important;
        }

        /* Responsive adjustments for mobile */
        @media (max-width: 640px) {
            .batch-tab-bar {
                border-radius: 24px;
                padding: 8px;
            }
            .batch-tab-btn {
                padding: 10px 18px !important;
                font-size: 0.9rem !important;
            }
        }
`;

const newTabsContainerHtml = `<!-- ACS Style High Visibility Batch Filter Tabs -->
            <div class="flex items-center justify-center mb-12 max-w-5xl mx-auto px-2">
                <div class="batch-tab-bar" id="batchTabsContainer">
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
            </div>`;

indexFiles.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');

        // 1. Inject Style into <style> if not already there
        if (!content.includes('.batch-tab-bar {')) {
            content = content.replace('</style>', batchStyle + '\n    </style>');
        }

        // 2. Replace the batch tabs container
        const oldTabsRegex = /<!-- ACS Style Batch Filter Tabs -->[\s\S]*?<div [^>]*id="batchTabsContainer"[^>]*>[\s\S]*?<\/div>\s*<\/div>/;
        if (oldTabsRegex.test(content)) {
            content = content.replace(oldTabsRegex, newTabsContainerHtml);
        } else {
            // Alternative match
            const altRegex = /<div class="flex items-center justify-center gap-2\.5[\s\S]*?id="batchTabsContainer"[\s\S]*?<\/div>/;
            if (altRegex.test(content)) {
                content = content.replace(altRegex, newTabsContainerHtml);
            }
        }

        fs.writeFileSync(f, content, 'utf8');
        console.log('Successfully updated batch tabs in:', f);
    }
});
