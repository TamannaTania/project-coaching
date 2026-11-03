const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// 1. Reduce chart heights
html = html.replace(/<div style="height: 350px; position: relative;">/g, '<div style="height: 260px; position: relative;">');
html = html.replace(/<div style="height: 350px; position: relative; display: flex; align-items: center; justify-content: center;">/g, '<div style="height: 260px; position: relative; display: flex; align-items: center; justify-content: center;">');


// 2. Add Quick Actions and Recent Activity below charts
const currentChartContainerEnd = `                    <div style="height: 260px; position: relative; display: flex; align-items: center; justify-content: center;">
                        <canvas id="enrollmentPieChart"></canvas>
                    </div>
                </div>
            </div>`;

const newFeatures = `
            <!-- New Features Row -->
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px; margin-top: 20px;">
                <!-- Quick Actions -->
                <div style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; display: flex; flex-direction: column;">
                    <h3 style="margin: 0 0 20px; color: #1e293b; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                        <span style="background: #fef08a; color: #ca8a04; padding: 5px 10px; border-radius: 8px;"><i class="fa-solid fa-bolt"></i></span>
                        Quick Actions
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 12px; flex-grow: 1;">
                        <button onclick="document.querySelector('ul.k-widget li:nth-child(2)').click()" class="stat-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: left; display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <div style="background: #dbeafe; color: #2563eb; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="fa-solid fa-book-medical"></i></div>
                            <div>
                                <h4 style="margin: 0; color: #1e293b; font-size: 0.95rem; font-weight: 600;">Manage Courses</h4>
                                <p style="margin: 3px 0 0; color: #64748b; font-size: 0.8rem;">Add or edit your courses</p>
                            </div>
                        </button>
                        <button onclick="document.querySelector('ul.k-widget li:nth-child(4)').click()" class="stat-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: left; display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <div style="background: #ffedd5; color: #ea580c; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="fa-solid fa-clock-rotate-left"></i></div>
                            <div>
                                <h4 style="margin: 0; color: #1e293b; font-size: 0.95rem; font-weight: 600;">Pending Requests</h4>
                                <p style="margin: 3px 0 0; color: #64748b; font-size: 0.8rem;">Review student payments</p>
                            </div>
                        </button>
                        <button onclick="window.open('/', '_blank')" class="stat-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: left; display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <div style="background: #dcfce7; color: #16a34a; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="fa-solid fa-globe"></i></div>
                            <div>
                                <h4 style="margin: 0; color: #1e293b; font-size: 0.95rem; font-weight: 600;">View Website</h4>
                                <p style="margin: 3px 0 0; color: #64748b; font-size: 0.8rem;">Visit the student portal</p>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0; color: #1e293b; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                            <span style="background: #e0e7ff; color: #4f46e5; padding: 5px 10px; border-radius: 8px;"><i class="fa-solid fa-history"></i></span>
                            Recent Enrollments
                        </h3>
                        <button onclick="document.querySelector('ul.k-widget li:nth-child(4)').click()" style="background: none; border: none; color: #3b82f6; font-size: 0.85rem; font-weight: 600; cursor: pointer;">View All &rarr;</button>
                    </div>
                    <div id="recentActivityList" style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="text-align: center; color: #94a3b8; padding: 20px;">Loading recent activity...</div>
                    </div>
                </div>
            </div>`;

html = html.replace(currentChartContainerEnd, currentChartContainerEnd + newFeatures);

// 3. Add JS to fetch Recent Activity
const fetchActivityScript = `
                    // Load Recent Activity
                    fetch('/api/Enrollments/admin/payments', {
                        headers: { 'Authorization': 'Bearer ' + token }
                    })
                    .then(res => res.json())
                    .then(payments => {
                        const list = document.getElementById('recentActivityList');
                        list.innerHTML = '';
                        if(!payments || payments.length === 0) {
                            list.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 20px;">No recent enrollments found.</div>';
                            return;
                        }
                        
                        // Sort by latest and take top 4
                        const recent = payments.reverse().slice(0, 4);
                        recent.forEach(p => {
                            const isApproved = p.isApproved;
                            const statusColor = isApproved ? '#10b981' : '#f59e0b';
                            const statusBg = isApproved ? '#d1fae5' : '#fef3c7';
                            const statusText = isApproved ? 'Approved' : 'Pending';
                            
                            const html = \`
                                <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #f8fafc; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: bold;">
                                            \${p.studentEmail.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style="font-weight: 600; color: #1e293b; font-size: 0.9rem;">\${p.studentEmail}</div>
                                            <div style="color: #64748b; font-size: 0.75rem;">TrxID: \${p.transactionId}</div>
                                        </div>
                                    </div>
                                    <div style="background: \${statusBg}; color: \${statusColor}; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">
                                        \${statusText}
                                    </div>
                                </div>
                            \`;
                            list.insertAdjacentHTML('beforeend', html);
                        });
                    });
`;

html = html.replace('// Render Pie Chart', fetchActivityScript + '\n                    // Render Pie Chart');

fs.writeFileSync('admin.html', html, 'utf8');
