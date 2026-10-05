const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// 1. HTML Replace
const oldHtml = `<div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <h3 style="margin: 0 0 20px; color: #1f2937;">কোর্স অনুযায়ী সেলস (Course-wise Enrollments)</h3>
                <div style="height: 400px; position: relative;">
                    <canvas id="courseChart"></canvas>
                </div>
            </div>`;

// Wait, since the file contains broken unicode in my previous outputs, I'll use regex to match the container.
const regexHtml = /<div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba\(0,0,0,0\.05\);">\s*<h3 style="margin: 0 0 20px; color: #1f2937;">.*?<\/h3>\s*<div style="height: 400px; position: relative;">\s*<canvas id="courseChart"><\/canvas>\s*<\/div>\s*<\/div>/;

const newHtml = `<div style="display: grid; grid-template-columns: 2fr 1.2fr; gap: 20px;">
                <div style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f1f5f9;">
                    <h3 style="margin: 0 0 20px; color: #1e293b; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                        <span style="background: #e0e7ff; color: #4f46e5; padding: 5px 10px; border-radius: 8px;"><i class="fa-solid fa-chart-column"></i></span>
                        Course-wise Enrollments
                    </h3>
                    <div style="height: 350px; position: relative;">
                        <canvas id="courseChart"></canvas>
                    </div>
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f1f5f9;">
                    <h3 style="margin: 0 0 20px; color: #1e293b; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                        <span style="background: #fce7f3; color: #ec4899; padding: 5px 10px; border-radius: 8px;"><i class="fa-solid fa-chart-pie"></i></span>
                        Enrollment Distribution
                    </h3>
                    <div style="height: 350px; position: relative; display: flex; align-items: center; justify-content: center;">
                        <canvas id="enrollmentPieChart"></canvas>
                    </div>
                </div>
            </div>`;

html = html.replace(regexHtml, newHtml);

// 2. JS Replace
html = html.replace('let dashboardChart = null;', 'let dashboardChart = null;\n            let pieChart = null;');

const jsInject = `
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

html = html.replace('// Render Chart', jsInject + '\n                    // Render Chart');

fs.writeFileSync('admin.html', html, 'utf8');
