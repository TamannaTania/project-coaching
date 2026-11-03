const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const oldPalette = "const palette = ['#4f46e5', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6', '#ec4899'];";
const newPalette = "const palette = ['#6bc117', '#14532d', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];";

html = html.replace(oldPalette, newPalette);

// Fix pie chart too
const oldPieColors = "const pieColors = ['#4f46e5', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6', '#ec4899'];";
const newPieColors = "const pieColors = ['#6bc117', '#14532d', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];";

html = html.replace(oldPieColors, newPieColors);

fs.writeFileSync('admin.html', html, 'utf8');
