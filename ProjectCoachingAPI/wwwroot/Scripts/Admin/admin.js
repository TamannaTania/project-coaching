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

    function isTokenExpired(t) {
        if (!t) return true;
        try {
            const parts = t.split('.');
            if (parts.length < 2) return true;
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            const payload = JSON.parse(jsonPayload);
            if (payload.exp && Date.now() >= payload.exp * 1000) {
                return true;
            }
            return false;
        } catch(e) {
            return false;
        }
    }

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        window.location.href = '/Views/Auth/login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
        return;
    }

    if (role && role.toString().trim().toLowerCase() !== 'admin') {
        window.location.href = '/';
        return;
    }

    // Tab Switching Logic
    function resetTabs() {
        $('#tabDashboard, #tabCourses, #tabPayments, #tabStudents').css({color: '#6b7280', borderBottom: '3px solid transparent'});
        $('#viewDashboard, #viewCourses, #viewPayments, #viewStudents').hide();
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

    $('#tabStudents').click(function() {
        resetTabs();
        $(this).css({color: '#1a9c5c', borderBottom: '3px solid #1a9c5c'});
        $('#viewStudents').show();
        $('#adminStudentSearchInput').focus();
    });

    // Student Search & Account Recovery Logic
    async function searchStudents(query) {
        const tbody = document.getElementById('studentSearchResultsTbody');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="6" style="padding: 24px; text-align: center; color: #64748b;">অনুসন্ধান করা হচ্ছে...</td></tr>';
        
        try {
            const res = await fetch('/api/Auth/admin/search-students?query=' + encodeURIComponent(query || ''), {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (!res.ok) {
                tbody.innerHTML = '<tr><td colspan="6" style="padding: 24px; text-align: center; color: #dc2626;">ডাটা লোড করতে ব্যর্থ হয়েছে!</td></tr>';
                return;
            }
            const students = await res.json();
            if (!students || students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="padding: 30px; text-align: center; color: #94a3b8;">কোনো শিক্ষার্থী পাওয়া যায়নি!</td></tr>';
                return;
            }

            tbody.innerHTML = '';
            students.forEach(s => {
                const isEmailMissing = !s.email || s.email.includes('@placeholder') || !s.email.includes('@');
                const emailHtml = isEmailMissing 
                    ? '<span style="background: #fee2e2; color: #dc2626; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">⚠️ ইমেইল নেই</span>'
                    : `<span style="color: #0f172a; font-size: 0.85rem; font-weight: 500;">${s.email}</span>`;

                const deviceHtml = s.hasDevice 
                    ? '<span style="background: #ecfdf5; color: #047857; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">সক্রিয়</span>'
                    : '<span style="background: #f1f5f9; color: #94a3b8; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">ক্লিয়ার্ড</span>';

                const safeName = (s.name || 'Student').replace(/'/g, "\\'");
                const safeEmail = (s.email || '').replace(/'/g, "\\'");

                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #f1f5f9';
                tr.innerHTML = `
                    <td style="padding: 12px 14px; font-size: 0.85rem; color: #64748b; font-family: monospace;">#${s.id}</td>
                    <td style="padding: 12px 14px; font-size: 0.9rem; font-weight: 700; color: #1e293b;">${s.name || '-'}</td>
                    <td style="padding: 12px 14px; font-size: 0.85rem; color: #334155; font-family: monospace;">${s.phone || '-'}</td>
                    <td style="padding: 12px 14px;">${emailHtml}</td>
                    <td style="padding: 12px 14px;">${deviceHtml}</td>
                    <td style="padding: 12px 14px; text-align: center; white-space: nowrap;">
                        <button type="button" onclick="window.adminResetStudentPassword(${s.id}, '${safeName}')" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; margin-right: 6px; transition: all 0.2s;">
                            🔑 পাসওয়ার্ড রিসেট
                        </button>
                        <button type="button" onclick="window.adminUpdateStudentEmail(${s.id}, '${safeName}', '${safeEmail}')" style="background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s;">
                            ✉️ ইমেইল আপডেট
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch(e) {
            tbody.innerHTML = '<tr><td colspan="6" style="padding: 24px; text-align: center; color: #dc2626;">সার্ভার সংযোগ সমস্যা!</td></tr>';
        }
    }

    $('#btnAdminSearchStudent').click(function() {
        const q = $('#adminStudentSearchInput').val().trim();
        searchStudents(q);
    });

    $('#adminStudentSearchInput').on('keyup', function(e) {
        if (e.key === 'Enter') {
            searchStudents($(this).val().trim());
        }
    });

    window.adminResetStudentPassword = async function(id, name) {
        const newPassword = prompt(`শিক্ষার্থী "${name}" এর জন্য নতুন পাসওয়ার্ড লিখুন (কমপক্ষে ৬ অক্ষর):`, '');
        if (newPassword === null) return;
        if (newPassword.trim().length < 6) {
            alert('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!');
            return;
        }

        try {
            const res = await fetch(`/api/Auth/admin/reset-student-password/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword: newPassword.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`✅ ${data.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!'}\nনতুন পাসওয়ার্ড: ${newPassword.trim()}`);
                const q = $('#adminStudentSearchInput').val().trim();
                searchStudents(q);
            } else {
                alert(`❌ ${data.message || 'ব্যর্থ হয়েছে!'}`);
            }
        } catch(e) {
            alert('সার্ভার সমস্যা!');
        }
    };

    window.adminUpdateStudentEmail = async function(id, name, currentEmail) {
        const promptEmail = (!currentEmail || currentEmail.includes('@placeholder')) ? '' : currentEmail;
        const newEmail = prompt(`শিক্ষার্থী "${name}" এর ইমেইল ঠিকানা দিন:`, promptEmail);
        if (newEmail === null) return;
        if (!newEmail.trim() || !newEmail.includes('@') || !newEmail.includes('.')) {
            alert('সঠিক ইমেইল ঠিকানা লিখুন!');
            return;
        }

        try {
            const res = await fetch(`/api/Auth/admin/update-student-email/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newEmail: newEmail.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`✅ ${data.message || 'ইমেইল সফলভাবে আপডেট হয়েছে!'}`);
                const q = $('#adminStudentSearchInput').val().trim();
                searchStudents(q);
            } else {
                alert(`❌ ${data.message || 'ব্যর্থ হয়েছে!'}`);
            }
        } catch(e) {
            alert('সার্ভার সমস্যা!');
        }
    };

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

    let allPaymentRequests = [];
    let currentPaymentFilter = 'ALL';
    let currentPaymentSearch = '';

    function setPaymentFilter(filter) {
        currentPaymentFilter = filter;
        const tabs = document.querySelectorAll('#paymentFilterTabs .pay-filter-btn');
        tabs.forEach(btn => {
            const f = btn.getAttribute('data-filter');
            if (f === currentPaymentFilter) {
                btn.style.background = '#ffffff';
                btn.style.color = '#065f46';
                btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
            } else {
                btn.style.background = 'transparent';
                btn.style.color = '#64748b';
                btn.style.boxShadow = 'none';
            }
        });
        renderPaymentsTable();
    }
    window.setPaymentFilter = setPaymentFilter;

    function onPaymentSearch(val) {
        currentPaymentSearch = (val || '').toLowerCase().trim();
        renderPaymentsTable();
    }
    window.onPaymentSearch = onPaymentSearch;

    function renderPaymentsTable() {
        const tbody = document.getElementById('paymentsTbody');
        if (!tbody) return;

        let filtered = allPaymentRequests;
        if (currentPaymentFilter !== 'ALL') {
            filtered = filtered.filter(r => (r.status || '').toLowerCase() === currentPaymentFilter.toLowerCase());
        }
        if (currentPaymentSearch) {
            filtered = filtered.filter(r => {
                const u = (r.userName || '').toLowerCase();
                const c = (r.courseTitle || '').toLowerCase();
                const p = (r.phone || '').toLowerCase();
                const t = (r.trxId || '').toLowerCase();
                return u.includes(currentPaymentSearch) || c.includes(currentPaymentSearch) || p.includes(currentPaymentSearch) || t.includes(currentPaymentSearch);
            });
        }

        if (!filtered || filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="padding: 36px 20px; text-align: center; color: #64748b;">
                <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
                <div style="font-weight: 700; font-size: 1rem; color: #334155;">কোনো পেমেন্ট রিকোয়েস্ট পাওয়া যায়নি</div>
                <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 4px;">ফিল্টার বা সার্চ পরিবর্তন করে চেষ্টা করুন</div>
            </td></tr>`;
            return;
        }

        let html = '';
        filtered.forEach(req => {
            let statusBadge = '';
            if(req.status === 'Pending') statusBadge = '<span style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:4px 10px; border-radius:50px; font-size:0.85rem; font-weight:700; display:inline-flex; align-items:center; gap:4px;">⏳ Pending</span>';
            else if(req.status === 'Approved') statusBadge = '<span style="background:#d1fae5; color:#065f46; border:1px solid #a7f3d0; padding:4px 10px; border-radius:50px; font-size:0.85rem; font-weight:700; display:inline-flex; align-items:center; gap:4px;">✓ Approved</span>';
            else statusBadge = '<span style="background:#fee2e2; color:#991b1b; border:1px solid #fecaca; padding:4px 10px; border-radius:50px; font-size:0.85rem; font-weight:700; display:inline-flex; align-items:center; gap:4px;">✕ Rejected</span>';

            let actionBtns = '';
            if(req.status === 'Pending') {
                actionBtns = `
                    <button onclick="approveReq(${req.id})" style="background:#10b981; color:white; border:none; padding:7px 14px; border-radius:6px; cursor:pointer; margin-right:6px; font-weight:700; font-size:0.85rem; white-space:nowrap; box-shadow:0 2px 4px rgba(16,185,129,0.3); transition:all 0.2s;">✓ Approve</button>
                    <button onclick="rejectReq(${req.id})" style="background:#ef4444; color:white; border:none; padding:7px 14px; border-radius:6px; cursor:pointer; font-weight:700; font-size:0.85rem; white-space:nowrap; box-shadow:0 2px 4px rgba(239,68,68,0.3); transition:all 0.2s;">✕ Reject</button>
                `;
            } else {
                actionBtns = `<span style="color:#94a3b8; font-size:0.85rem; font-weight:600;">No action</span>`;
            }

            html += `
                <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                    <td style="padding: 14px 14px; white-space: nowrap; font-size: 0.9rem; color: #475569;">${new Date(req.date).toLocaleDateString()}</td>
                    <td style="padding: 14px 14px; font-weight: 700; color: #0f172a; white-space: nowrap;">${req.userName}</td>
                    <td style="padding: 14px 14px; font-weight: 600; color: #334155;">${req.courseTitle}</td>
                    <td style="padding: 14px 14px; font-weight: 700; color: #047857; white-space: nowrap;">${req.phone || '-'}</td>
                    <td style="padding: 14px 14px; font-family: monospace; font-weight: 700; color: #2563eb; white-space: nowrap; background: #f8fafc; border-radius: 4px;">${req.trxId || '-'}</td>
                    <td style="padding: 14px 14px; white-space: nowrap;">${statusBadge}</td>
                    <td style="padding: 14px 14px; white-space: nowrap;">${actionBtns}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    function loadPayments() {
        const tbody = document.getElementById('paymentsTbody');
        if (!token) {
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="7" style="padding: 30px; text-align: center; color: #dc2626; font-weight: 600;">
                    🔒 আপনি লগইন করেননি। দয়া করে লগইন করুন।
                    <br><a href="/Views/Auth/login.html?returnUrl=/Views/Admin/admin.html" style="display:inline-block; margin-top:10px; padding:8px 18px; background:#059669; color:white; border-radius:8px; text-decoration:none; font-weight:700;">লগইন করুন</a>
                </td></tr>`;
            }
            return;
        }

        fetch('/api/Enrollments/admin/all', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(async res => {
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('AUTH_EXPIRED');
                }
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson.message || ('Server error ' + res.status));
            }
            return res.json();
        })
        .then(data => {
            allPaymentRequests = Array.isArray(data) ? data : [];
            
            // Update counts on filter tabs
            const cAll = allPaymentRequests.length;
            const cPending = allPaymentRequests.filter(r => (r.status || '').toLowerCase() === 'pending').length;
            const cApproved = allPaymentRequests.filter(r => (r.status || '').toLowerCase() === 'approved').length;
            const cRejected = allPaymentRequests.filter(r => (r.status || '').toLowerCase() === 'rejected').length;

            if(document.getElementById('countAll')) document.getElementById('countAll').innerText = cAll;
            if(document.getElementById('countPending')) document.getElementById('countPending').innerText = cPending;
            if(document.getElementById('countApproved')) document.getElementById('countApproved').innerText = cApproved;
            if(document.getElementById('countRejected')) document.getElementById('countRejected').innerText = cRejected;

            renderPaymentsTable();
        })
        .catch(err => {
            console.error("Payment load error:", err);
            if (tbody) {
                if (err.message === 'AUTH_EXPIRED') {
                    tbody.innerHTML = `<tr><td colspan="7" style="padding: 30px; text-align: center; color: #dc2626; font-weight: 600;">
                        🔒 সেশনের মেয়াদ শেষ হয়েছে। দয়া করে আবার লগইন করুন।
                        <br><a href="/Views/Auth/login.html?returnUrl=/Views/Admin/admin.html" style="display:inline-block; margin-top:10px; padding:8px 18px; background:#059669; color:white; border-radius:8px; text-decoration:none; font-weight:700;">পুনরায় লগইন করুন</a>
                    </td></tr>`;
                } else {
                    tbody.innerHTML = `<tr><td colspan="7" style="padding: 24px; text-align: center; color: #dc2626;">
                        <div style="font-weight: 700; margin-bottom: 6px;">ডাটা লোড করতে সমস্যা হয়েছে</div>
                        <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 12px;">${err.message || 'Unknown error'}</div>
                        <button onclick="loadPayments()" style="padding:7px 16px; background:#10b981; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:700;">🔄 আবার চেষ্টা করুন</button>
                    </td></tr>`;
                }
            }
        });
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
        .then(res => res.ok ? res.json() : {})
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
            .then(res => res.ok ? res.json() : [])
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
