function batchDropDownEditor(container, options) {
    $('<input required name="' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: [
                'HSC 2028',
                'HSC 2027',
                'HSC 2026',
                'SSC 2029',
                'SSC 2028',
                'Admission',
                'General'
            ]
        });
}

// admin.js - Admin Dashboard & Course/Payment Management Logic
// @ts-nocheck
$(document).ready(function () {
    const token = localStorage.getItem('token');
    const role = (typeof getUserRole === 'function') ? getUserRole() : localStorage.getItem('role');
    if (!token || (role && role.toString().trim().toLowerCase() !== 'admin')) {
        window.location.href = '/Views/Auth/login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
        return;
    }

    // Tab Switching Logic
    function resetTabs() {
        $('#tabDashboard, #tabCourses, #tabPayments').css({color: '#6b7280', borderBottom: '3px solid transparent'});
        $('#viewDashboard, #viewCourses, #viewPayments').hide();
    }

    $('#tabDashboard').click(function() {
        resetTabs();
        $(this).css({color: '#1a9c5c', borderBottom: '3px solid #1a9c5c'});
        $('#viewDashboard').show();
        loadDashboardStats();
    });

    $('#tabCourses').click(function() {
        resetTabs();
        $(this).css({color: '#1a9c5c', borderBottom: '3px solid #1a9c5c'});
        $('#viewCourses').show();
    });

    $('#tabPayments').click(function() {
        resetTabs();
        $(this).css({color: '#1a9c5c', borderBottom: '3px solid #1a9c5c'});
        $('#viewPayments').show();
        loadPayments();
    });

    // Kendo Grid initialization
    $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: { url: "/api/Courses", type: "GET", dataType: "json" },
                update: { url: function(data) { return "/api/Courses/" + data.id; }, type: "PUT", dataType: "json", contentType: "application/json" },
                destroy: { url: function(data) { return "/api/Courses/" + data.id; }, type: "DELETE", dataType: "json" },
                create: { url: "/api/Courses", type: "POST", dataType: "json", contentType: "application/json" },
                parameterMap: function(options, operation) {
                    let data = options;
                    if (operation !== "read" && options.models) {
                        data = options.models[0];
                    }
                    if (operation === "create" || operation === "update") {
                        if (operation === "create") data.id = 0;
                        data.features = data.features || []; // Prevent validation error
                    }
                    return JSON.stringify(data);
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: true },
                        title: { validation: { required: true } },
                        batch: { type: "string", defaultValue: "HSC 2028" },
                        description: { type: "string" },
                        price: { type: "number", validation: { required: true, min: 0 } },
                        imageUrl: { type: "string" },
                        videoUrl: { type: "string" },
                        badge: { type: "string" }
                    }
                }
            }
        },
        height: 550,
        toolbar: ["create"],
        columns: [
            { field: "title", title: "Course Title" },
            { field: "batch", title: "Batch / Category", width: "140px", editor: batchDropDownEditor },
            { field: "price", title: "Price (BDT)", width: "120px" },
            { field: "badge", title: "Badge", width: "120px" },
            { 
                field: "description", 
                title: "Description", 
                hidden: true,
                editor: function(container, options) {
                    $('<textarea data-bind="value:' + options.field + '" class="k-textbox" style="width:100%;height:100px;padding:8px;border-radius:6px;"></textarea>').appendTo(container);
                }
            },
            { field: "imageUrl", title: "Image URL (Thumbnail)", hidden: true },
            { field: "videoUrl", title: "Video URL (FB/YT)", hidden: true },
            { command: ["edit", "destroy"], title: "", width: "220px" }
        ],
        editable: "popup"
    });

    function loadPayments() {
        if(!token) return;
        fetch('/api/Enrollments/admin/all', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(res => res.json())
        .then(data => {
            let html = '';
            if(!data || data.length === 0) {
                html = '<tr><td colspan="7" style="padding: 20px; text-align: center;">কোনো পেমেন্ট রিকোয়েস্ট নেই।</td></tr>';
            } else {
                data.forEach(req => {
                    let statusBadge = '';
                    if(req.status === 'Pending') statusBadge = '<span style="background:#fef3c7; color:#92400e; padding:4px 8px; border-radius:4px; font-size:0.85rem; font-weight:600;">Pending</span>';
                    else if(req.status === 'Approved') statusBadge = '<span style="background:#d1fae5; color:#065f46; padding:4px 8px; border-radius:4px; font-size:0.85rem; font-weight:600;">Approved</span>';
                    else statusBadge = '<span style="background:#fee2e2; color:#991b1b; padding:4px 8px; border-radius:4px; font-size:0.85rem; font-weight:600;">Rejected</span>';

                    let actionBtns = '';
                    if(req.status === 'Pending') {
                        actionBtns = `
                            <button onclick="approveReq(${req.id})" style="background:#10b981; color:white; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; margin-right:6px; font-weight:600; white-space:nowrap; box-shadow:0 2px 4px rgba(16,185,129,0.3);">Approve</button>
                            <button onclick="rejectReq(${req.id})" style="background:#ef4444; color:white; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:600; white-space:nowrap; box-shadow:0 2px 4px rgba(239,68,68,0.3);">Reject</button>
                        `;
                    } else {
                        actionBtns = `<span style="color:#6b7280; font-size:0.9rem; font-weight:500;">No action</span>`;
                    }

                    html += `
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 14px 12px; white-space: nowrap; font-size: 0.9rem;">${new Date(req.date).toLocaleDateString()}</td>
                            <td style="padding: 14px 12px; font-weight: 600; white-space: nowrap;">${req.userName}</td>
                            <td style="padding: 14px 12px; font-weight: 500;">${req.courseTitle}</td>
                            <td style="padding: 14px 12px; font-weight: 600; color: #047857; white-space: nowrap;">${req.phone || '-'}</td>
                            <td style="padding: 14px 12px; font-family: monospace; font-weight: 700; color: #1e40af; white-space: nowrap;">${req.trxId || '-'}</td>
                            <td style="padding: 14px 12px; white-space: nowrap;">${statusBadge}</td>
                            <td style="padding: 14px 12px; white-space: nowrap;">${actionBtns}</td>
                        </tr>
                    `;
                });
            }
            document.getElementById('paymentsTbody').innerHTML = html;
        })
        .catch(err => console.error(err));
    }
    
    window.approveReq = function(id) {
        if(!confirm("Are you sure you want to approve this payment? The student will get access.")) return;
        fetch('/api/Enrollments/admin/approve/' + id, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(() => loadPayments());
    };

    window.rejectReq = function(id) {
        if(!confirm("Are you sure you want to reject this payment?")) return;
        fetch('/api/Enrollments/admin/reject/' + id, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(() => loadPayments());
    };
    
    let dashboardChart = null;
    let pieChart = null;

    function loadDashboardStats() {
        fetch('/api/Enrollments/admin/stats', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(res => res.json())
        .then(data => {
            $('#statStudents').text(data.totalStudents);
            $('#statSales').text(data.totalEnrollments);
            $('#statPending').text(data.pendingRequests);

            // Render Chart
            const ctx = document.getElementById('courseChart').getContext('2d');
            
            if (dashboardChart) {
                dashboardChart.destroy();
            }

            const labels = data.courseStats.map(c => c.courseName);
            const values = data.courseStats.map(c => c.enrolledCount);
            
            const bgColors = values.map((val, index) => {
                if (index === 0) return '#14532d'; // Dark Green
                if (index === 1) return '#6ee7b7'; // Light Green
                return '#e5e7eb'; // Light Gray for others
            });

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
                
                const recent = payments.reverse().slice(0, 4);
                recent.forEach(p => {
                    const isApproved = p.isApproved;
                    const statusColor = isApproved ? '#10b981' : '#f59e0b';
                    const statusBg = isApproved ? '#d1fae5' : '#fef3c7';
                    const statusText = isApproved ? 'Approved' : 'Pending';
                    
                    const html = `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: #f8fafc; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: bold;">
                                    ${p.studentEmail.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: #1e293b; font-size: 0.9rem;">${p.studentEmail}</div>
                                    <div style="color: #64748b; font-size: 0.75rem;">TrxID: ${p.transactionId}</div>
                                </div>
                            </div>
                            <div style="background: ${statusBg}; color: ${statusColor}; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">
                                ${statusText}
                            </div>
                        </div>
                    `;
                    list.insertAdjacentHTML('beforeend', html);
                });
            });

            // Render Pie Chart
            const pieCtx = document.getElementById('enrollmentPieChart').getContext('2d');
            if(pieChart) pieChart.destroy();
            const pieColors = ['#6bc117', '#14532d', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];
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

            dashboardChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'মোট সেলস (এনরোলমেন্ট)',
                        data: values,
                        backgroundColor: bgColors,
                        borderRadius: 100,
                        borderSkipped: false,
                        barThickness: 40
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false }
                        },
                        y: { 
                            beginAtZero: true, 
                            ticks: { stepSize: 1, display: false },
                            grid: { display: false },
                            border: { display: false }
                        }
                    }
                }
            });
        })
        .catch(err => console.error(err));
    }

    // Load dashboard on initial page load
    loadDashboardStats();
});

// Force remove Kendo UI license warning dynamically
setInterval(() => {
    document.querySelectorAll('div').forEach(div => {
        if (div.innerText && div.innerText.includes('No license found for Kendo UI')) {
            div.style.display = 'none';
        }
    });
}, 500);
