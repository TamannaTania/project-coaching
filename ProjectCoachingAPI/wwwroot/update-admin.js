const fs = require('fs');

let html = fs.readFileSync('admin.html', 'utf8');

// Replace Courses View
const courseViewStart = html.indexOf('<div id="viewCourses"');
const courseViewEnd = html.indexOf('</div>', html.indexOf('<div id="grid"></div>')) + 6;

if (courseViewStart !== -1) {
    const newCourseView = `
        <!-- Courses View -->
        <div id="viewCourses" style="display: none; animation: fadeIn 0.4s ease;">
            <div style="background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); overflow: hidden; margin-top: 10px; border: 1px solid #f3f4f6;">
                <div style="background: linear-gradient(135deg, #1e293b 0%, #475569 100%); padding: 25px 30px; display: flex; flex-direction: column; gap: 5px;">
                    <h2 style="margin: 0; color: white; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px;">Course Management</h2>
                    <p style="margin: 0; color: #cbd5e1; font-size: 0.95rem; font-weight: 500;">Add, edit or delete courses for your coaching platform.</p>
                </div>
                <div style="padding: 30px; background: #f8fafc;">
                    <div id="grid" style="box-shadow: 0 4px 6px rgba(0,0,0,0.02); border-radius: 8px;"></div>
                </div>
            </div>
        </div>`;
    
    // We need to carefully replace the old block
    // Let's use regex to replace it
    html = html.replace(/<div id="viewCourses"[\s\S]*?<div id="grid"><\/div>\s*<\/div>/, newCourseView.trim());
}

// Replace Payments View
// We need to preserve the table inside
const tableRegex = /<table[\s\S]*?<\/table>/;
const tableMatch = html.match(tableRegex);

if (tableMatch) {
    const newPaymentsView = `
        <!-- Payments View -->
        <div id="viewPayments" style="display: none; animation: fadeIn 0.4s ease;">
            <div style="background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); overflow: hidden; margin-top: 10px; border: 1px solid #f3f4f6;">
                <div style="background: linear-gradient(135deg, #065f46 0%, #10b981 100%); padding: 25px 30px; display: flex; flex-direction: column; gap: 5px;">
                    <h2 style="margin: 0; color: white; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px;">Payment Requests</h2>
                    <p style="margin: 0; color: #d1fae5; font-size: 0.95rem; font-weight: 500;">Review student enrollment requests, verify TrxID, and approve access.</p>
                </div>
                <div style="padding: 30px; background: #f8fafc;">
                    ${tableMatch[0]}
                </div>
            </div>
        </div>`;
    
    html = html.replace(/<div id="viewPayments"[\s\S]*?<\/table>\s*<\/div>/, newPaymentsView.trim());
}

// Add animation keyframes to head
if (!html.includes('keyframes fadeIn')) {
    html = html.replace('</style>', `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>`);
}

fs.writeFileSync('admin.html', html, 'utf8');
