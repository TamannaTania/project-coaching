const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// The three cards are inside <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
// We will replace each div specifically.

// --- Card 1 (Total Sales) ---
const card1_old_bg = `background: #14532d; color: white; padding: 25px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); position: relative;`;
const card1_new_bg = `background: linear-gradient(135deg, #064e3b 0%, #059669 100%); color: white; padding: 25px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(5,150,105,0.3); position: relative; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease;`;
html = html.replace(card1_old_bg, card1_new_bg);

// Also add a hover effect via a small class injection or just inline onmouseenter
// We'll inject a global style block for card hover effects right before </head>
if (!html.includes('.stat-card:hover')) {
    html = html.replace('</head>', `
    <style>
        .stat-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: default; }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-card.c1:hover { box-shadow: 0 20px 25px -5px rgba(5,150,105,0.4); }
        .stat-card.c2:hover { box-shadow: 0 20px 25px -5px rgba(79,70,229,0.4); }
        .stat-card.c3:hover { box-shadow: 0 20px 25px -5px rgba(234,88,12,0.4); }
    </style>
</head>`);
}

// Add the classes to the cards!
html = html.replace('style="background: linear-gradient(135deg, #064e3b 0%, #059669 100%);', 'class="stat-card c1" style="background: linear-gradient(135deg, #064e3b 0%, #059669 100%);');


// --- Card 2 (Total Students) ---
const card2_old_div = `<div style="background: white; color: #1f2937; padding: 25px; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); position: relative;">`;
const card2_new_div = `<div class="stat-card c2" style="background: linear-gradient(135deg, #1e3a8a 0%, #4f46e5 100%); color: white; padding: 25px; border-radius: 16px; border: none; box-shadow: 0 10px 15px -3px rgba(79,70,229,0.3); position: relative;">`;
html = html.replace(card2_old_div, card2_new_div);

// Fix Card 2 icons & subtext colors
// Top right icon: `border: 1px solid #d1d5db; color: #6b7280;` -> `background: rgba(255,255,255,0.2); color: white; border: none;`
html = html.replace(/<div style="position: absolute; top: 20px; right: 20px; border: 1px solid #d1d5db; color: #6b7280;(.*?)"/g, 
'<div style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); color: white; border: none;$1"');
// Subtext container: `color: #6b7280;` -> `color: #a5b4fc;`
html = html.replace(/<div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #6b7280;">/g, 
'<div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #a5b4fc;">');
// Subtext badge: `border: 1px solid #d1d5db; ... color: #10b981;` -> `background: rgba(255,255,255,0.2); ... color: white;` (We'll just regex it carefully)
html = html.replace(/<span style="border: 1px solid #d1d5db; padding: 2px 6px; border-radius: 4px; color: #10b981;">(.*?)</g, 
'<span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; color: white;">$1<');


// --- Card 3 (Pending Requests) ---
// Since we already replaced the generic white card div for card 2, card 3's div is identical so it MIGHT have matched.
// Let's use string indexOf to manually find and replace the second instance if needed. Wait, replace() only replaces the first match!
// So card 3's div is still untouched if they were identical!
const card3_new_div = `<div class="stat-card c3" style="background: linear-gradient(135deg, #9a3412 0%, #ea580c 100%); color: white; padding: 25px; border-radius: 16px; border: none; box-shadow: 0 10px 15px -3px rgba(234,88,12,0.3); position: relative;">`;
html = html.replace(card2_old_div, card3_new_div);

// Subtext color for card 3: it had "On Discuss"
html = html.replace(/On Discuss/g, '<span style="color: #fdba74;">On Discuss</span>');

fs.writeFileSync('admin.html', html, 'utf8');
