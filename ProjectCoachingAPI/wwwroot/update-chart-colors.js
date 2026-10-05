const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// The vibrant, modern color palette for the charts
const palette = "['#4f46e5', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6', '#ec4899']";

// 1. Update Bar Chart colors
const oldBarColors = `                      // Create a pattern for the background (if we wanted to go that far, but let's stick to solid colors for now)
                      const bgColors = values.map((val, index) => {
                          if (index === 0) return '#14532d'; // Dark Green
                          if (index === 1) return '#6ee7b7'; // Light Green
                          return '#e5e7eb'; // Light Gray for others
                      });`;

const newBarColors = `                      const palette = ${palette};
                      const bgColors = values.map((val, index) => palette[index % palette.length]);`;

html = html.replace(oldBarColors, newBarColors);

// 2. Update Pie Chart colors
const oldPieColors = `const pieColors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];`;
const newPieColors = `const pieColors = ${palette};`;

html = html.replace(oldPieColors, newPieColors);

fs.writeFileSync('admin.html', html, 'utf8');
