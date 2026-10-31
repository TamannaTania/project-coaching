const fs = require('fs');

const cssToInject = `
        /* ====================================================
           ACS / APars Style High Visibility Batch Filter Tabs
           ==================================================== */
        .batch-tab-bar {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
            border: 2px solid #cbd5e1 !important;
            padding: 8px 14px !important;
            border-radius: 9999px !important;
            box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04) !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 10px !important;
            flex-wrap: wrap !important;
        }

        .batch-tab-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 9px !important;
            padding: 12px 24px !important;
            border-radius: 9999px !important;
            font-size: 1.05rem !important;
            font-weight: 800 !important;
            cursor: pointer !important;
            user-select: none !important;
            border: 2px solid #cbd5e1 !important;
            background-color: #ffffff !important;
            color: #1e293b !important;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05) !important;
            transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            outline: none !important;
            text-decoration: none !important;
        }

        .batch-tab-btn i {
            font-size: 1.2rem !important;
            transition: transform 0.25s ease !important;
        }

        /* Specific icon colors in idle state */
        .batch-tab-btn[data-batch="ALL"] i { color: #2563eb !important; }
        .batch-tab-btn[data-batch="HSC 2028"] i { color: #0284c7 !important; }
        .batch-tab-btn[data-batch="HSC 2027"] i { color: #6366f1 !important; }
        .batch-tab-btn[data-batch="HSC 2026"] i { color: #9333ea !important; }
        .batch-tab-btn[data-batch="SSC 2029"] i { color: #059669 !important; }
        .batch-tab-btn[data-batch="SSC 2028"] i { color: #0d9488 !important; }
        .batch-tab-btn[data-batch="Admission"] i { color: #ea580c !important; }

        /* Mouse Hover Animation: Spring Lift, Glowing Shadow, Icon Rotation */
        .batch-tab-btn:hover {
            transform: translateY(-4px) scale(1.06) !important;
            border-color: #3b82f6 !important;
            background-color: #eff6ff !important;
            color: #1d4ed8 !important;
            box-shadow: 0 14px 28px -4px rgba(37, 99, 235, 0.3) !important;
        }

        .batch-tab-btn:hover i {
            transform: scale(1.3) rotate(-8deg) !important;
        }

        .batch-tab-btn:active {
            transform: translateY(0) scale(0.97) !important;
        }

        /* Active Selected State: High contrast vivid blue-indigo gradient */
        .batch-tab-btn.active {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
            color: #ffffff !important;
            border-color: #1d4ed8 !important;
            box-shadow: 0 12px 26px -4px rgba(37, 99, 235, 0.5), 0 0 0 3px rgba(147, 197, 253, 0.45) !important;
            transform: translateY(-2px) scale(1.04) !important;
        }

        .batch-tab-btn.active i {
            color: #ffffff !important;
            transform: scale(1.2) !important;
        }

        /* Mobile adjustments */
        @media (max-width: 640px) {
            .batch-tab-bar {
                border-radius: 24px !important;
                padding: 6px !important;
                gap: 6px !important;
            }
            .batch-tab-btn {
                padding: 9px 16px !important;
                font-size: 0.9rem !important;
            }
            .batch-tab-btn i {
                font-size: 1rem !important;
            }
        }
`;

const newTabsMarkup = `<!-- ACS Style High Visibility Batch Filter Tabs -->
            <div class="flex items-center justify-center mb-12 max-w-5xl mx-auto px-2">
                <div class="batch-tab-bar" id="batchTabsContainer">
                    <button type="button" onclick="filterCoursesByBatch('ALL')" class="batch-tab-btn active" data-batch="ALL">
                        <i class="fa-solid fa-layer-group"></i> <span>সকল কোর্স</span>
                    </button>
                    <button type="button" onclick="filterCoursesByBatch('HSC 2028')" class="batch-tab-btn" data-batch="HSC 2028">
                        <i class="fa-solid fa-graduation-cap"></i> <span>HSC 2028</span>
                    </button>
                    <button type="button" onclick="filterCoursesByBatch('HSC 2027')" class="batch-tab-btn" data-batch="HSC 2027">
                        <i class="fa-solid fa-graduation-cap"></i> <span>HSC 2027</span>
                    </button>
                    <button type="button" onclick="filterCoursesByBatch('HSC 2026')" class="batch-tab-btn" data-batch="HSC 2026">
                        <i class="fa-solid fa-graduation-cap"></i> <span>HSC 2026</span>
                    </button>
                    <button type="button" onclick="filterCoursesByBatch('SSC 2029')" class="batch-tab-btn" data-batch="SSC 2029">
                        <i class="fa-solid fa-book-open"></i> <span>SSC 2029</span>
                    </button>
                    <button type="button" onclick="filterCoursesByBatch('SSC 2028')" class="batch-tab-btn" data-batch="SSC 2028">
                        <i class="fa-solid fa-book-open"></i> <span>SSC 2028</span>
                    </button>
                    <button type="button" onclick="filterCoursesByBatch('Admission')" class="batch-tab-btn" data-batch="Admission">
                        <i class="fa-solid fa-rocket"></i> <span>এডমিশন</span>
                    </button>
                </div>
            </div>`;

const targetFiles = [
    'C:/Users/Tamanna Tania/.gemini/antigravity/scratch/project_coaching/ProjectCoachingAPI/wwwroot/index.html',
    'C:/Users/Tamanna Tania/.gemini/antigravity/scratch/project_coaching/ProjectCoachingAPI/wwwroot/Views/Home/index.html'
];

targetFiles.forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Version styles.css
    html = html.replace(/href="\/styles\.css(\?[^"]*)?"/g, 'href="/styles.css?v=20261031_v3"');

    // 2. Version index.js
    html = html.replace(/src="\/Scripts\/Home\/index\.js(\?[^"]*)?"/g, 'src="/Scripts/Home/index.js?v=20261031_v3"');

    // 3. Inject CSS into first <style> tag
    if (!html.includes('.batch-tab-bar {')) {
        html = html.replace('</style>', cssToInject + '\n    </style>');
    }

    // 4. Replace batchTabsContainer
    const oldContainerRegex = /<!-- ACS Style.*Batch Filter Tabs -->[\s\S]*?<div [^>]*id="batchTabsContainer"[^>]*>[\s\S]*?<\/div>(\s*<\/div>)?/;
    if (oldContainerRegex.test(html)) {
        html = html.replace(oldContainerRegex, newTabsMarkup);
    } else {
        const fallbackRegex = /<div class="[^"]*" id="batchTabsContainer">[\s\S]*?<\/div>/;
        if (fallbackRegex.test(html)) {
            html = html.replace(fallbackRegex, newTabsMarkup);
        }
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Successfully updated:', filePath);
});
