const fs = require('fs');
let html = fs.readFileSync('wwwroot/admin.html', 'utf8');

const targetStr = `                          <button onclick="window.open('/', '_blank')" class="stat-card" style="background: #f8fafc;`;

const injectBtn = `
                          <button onclick="window.location.href='admin-teachers.html'" class="stat-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: left; display: flex; align-items: center; gap: 15px; cursor: pointer;">
                              <div style="background: #f3e8ff; color: #9333ea; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="fa-solid fa-users"></i></div>
                              <div>
                                  <h4 style="margin: 0; color: #1e293b; font-size: 0.95rem; font-weight: 600;">Manage Teachers</h4>
                                  <p style="margin: 3px 0 0; color: #64748b; font-size: 0.8rem;">Edit homepage teachers</p>
                              </div>
                          </button>
` + targetStr;

html = html.replace(targetStr, injectBtn);
fs.writeFileSync('wwwroot/admin.html', html, 'utf8');
