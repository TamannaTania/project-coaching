const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// The Pie Chart code that is currently BEFORE labels declaration:
const badBlock = `
                    // Render Pie Chart
                    const pieCtx = document.getElementById('enrollmentPieChart').getContext('2d');
                    if(pieChart) pieChart.destroy();
                    
                    const pieColors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                    
                    pieChart = new Chart(pieCtx, {
                        type: 'doughnut',
                        data: {
                            labels: labels,
                            datasets: [{
                                data: values,
                                backgroundColor: pieColors.slice(0, values.length),
                                borderWidth: 0,
                                hoverOffset: 8
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '65%',
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: { padding: 20, font: { family: "'Inter', sans-serif", size: 12 } }
                                }
                            }
                        }
                    });
`;

// Remove the bad block
if(html.includes(badBlock)) {
    html = html.replace(badBlock, "");
} else {
    console.log("Could not find exact block to remove. Let me use regex.");
}
// Try regex if exact replace fails due to spacing
html = html.replace(/\/\/ Render Pie Chart[\s\S]*?\}\);\s*/, "");

// Now let's place it AFTER the Bar chart is rendered
const targetLoc = `dashboardChart = new Chart(ctx, {`;

const goodBlock = `
                    // Render Pie Chart
                    const pieCtx = document.getElementById('enrollmentPieChart').getContext('2d');
                    if(pieChart) pieChart.destroy();
                    const pieColors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                    pieChart = new Chart(pieCtx, {
                        type: 'doughnut',
                        data: {
                            labels: labels,
                            datasets: [{
                                data: values,
                                backgroundColor: pieColors,
                                borderWidth: 0,
                                hoverOffset: 8
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '65%',
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: { padding: 20, font: { family: "'Inter', sans-serif", size: 12 } }
                                }
                            }
                        }
                    });

                    `;

html = html.replace(targetLoc, goodBlock + targetLoc);

fs.writeFileSync('admin.html', html, 'utf8');
