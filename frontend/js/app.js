// OMNIBANK SYSTEMS - JAVA FULL STACK FRONTEND LOGIC
const API_BASE = 'http://localhost:8080/api/employees';

let employeesData = [];
let statsData = null;
let currentViewMode = 'table'; // 'table' or 'grid'

// Element Selectors
const tableBody = document.getElementById('employee-table-body');
const gridViewContainer = document.getElementById('grid-view-container');
const tableViewContainer = document.getElementById('table-view-container');
const loadingSpinner = document.getElementById('loading-spinner');

const searchInput = document.getElementById('search-input');
const filterDept = document.getElementById('filter-dept');
const filterStatus = document.getElementById('filter-status');

const formModal = document.getElementById('form-modal');
const employeeForm = document.getElementById('employee-form');
const cardModal = document.getElementById('card-modal');

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    loadAllData();
    setupEventListeners();
});

// Live Clock
function initClock() {
    const clockEl = document.getElementById('live-clock');
    setInterval(() => {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString();
    }, 1000);
}

// Fetch All Employees & Stats
async function loadAllData() {
    showLoading(true);
    try {
        const search = searchInput.value.trim();
        const dept = filterDept.value;
        const status = filterStatus.value;

        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (dept && dept !== 'All') params.append('department', dept);
        if (status && status !== 'All') params.append('status', status);

        const [empRes, statsRes] = await Promise.all([
            fetch(`${API_BASE}?${params.toString()}`),
            fetch(`${API_BASE}/stats`)
        ]);

        if (empRes.ok) {
            const empJson = await empRes.json();
            employeesData = empJson.data || [];
            updateEmployeeListUI(employeesData);
            document.getElementById('total-count-badge').innerText = `${employeesData.length} Records`;
        }

        if (statsRes.ok) {
            const statsJson = await statsRes.json();
            statsData = statsJson.stats;
            updateDashboardKPIs(statsData);
        }

    } catch (error) {
        console.error('Failed to connect to Java Spring Boot REST API:', error);
        updateBackendStatus(false, 'Java Backend Offline (Start Spring Boot)', false);
        showToast('Cannot connect to Java Spring Boot API at http://localhost:8080', 'error');
    } finally {
        showLoading(false);
    }
}

// Update Backend & DB Status Pill Indicator
function updateBackendStatus(isOnline, text, isMySQL = false, dbStatusMessage = '') {
    const pill = document.getElementById('backend-status-pill');
    const statusText = document.getElementById('backend-status-text');
    
    if (isOnline) {
        pill.className = 'flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
        if (dbStatusMessage) {
            statusText.innerText = `DB: ${dbStatusMessage}`;
        } else if (isMySQL) {
            statusText.innerText = 'DB: MySQL Database (Port 3306)';
        } else {
            statusText.innerText = 'DB: Persistent Database Store';
        }
    } else {
        pill.className = 'flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-medium border bg-rose-500/10 border-rose-500/30 text-rose-400';
        statusText.innerText = text;
    }
}

// Update Dashboard KPI Metrics
function updateDashboardKPIs(stats) {
    if (!stats) return;

    // Dynamically update DB badge using server dbStatusMessage
    updateBackendStatus(true, '', stats.isUsingMySQL, stats.dbStatusMessage);

    document.getElementById('stat-total-staff').innerText = stats.totalEmployees || 0;
    document.getElementById('stat-active-sub').innerText = `${stats.statusCounts?.active || 0} Currently On Duty`;

    const formattedPayroll = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(stats.totalPayroll || 0);
    document.getElementById('stat-total-payroll').innerText = formattedPayroll;

    document.getElementById('stat-active-branches').innerText = stats.activeBranchesCount || 0;

    const depts = stats.departmentBreakdown || {};
    const deptKeys = Object.keys(depts);
    document.getElementById('stat-total-dept').innerText = deptKeys.length;
    document.getElementById('dept-count-badge').innerText = `${deptKeys.length} Active Divisions`;

    // Render Department Progress Bars
    const deptContainer = document.getElementById('department-bars-container');
    deptContainer.innerHTML = '';

    const colorClasses = [
        { bg: 'bg-blue-500', text: 'text-blue-400' },
        { bg: 'bg-emerald-500', text: 'text-emerald-400' },
        { bg: 'bg-purple-500', text: 'text-purple-400' },
        { bg: 'bg-amber-500', text: 'text-amber-400' },
        { bg: 'bg-rose-500', text: 'text-rose-400' },
        { bg: 'bg-cyan-500', text: 'text-cyan-400' }
    ];

    let idx = 0;
    for (const [dept, count] of Object.entries(depts)) {
        const pct = stats.totalEmployees > 0 ? Math.round((count / stats.totalEmployees) * 100) : 0;
        const color = colorClasses[idx % colorClasses.length];

        const item = document.createElement('div');
        item.className = 'p-3.5 rounded-xl bg-slate-900/60 border border-slate-800';
        item.innerHTML = `
            <div class="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span class="text-slate-200 flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full ${color.bg}"></span>
                    ${dept}
                </span>
                <span class="${color.text} font-mono">${count} Staff (${pct}%)</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div class="h-2 rounded-full ${color.bg}" style="width: ${pct}%"></div>
            </div>
        `;
        deptContainer.appendChild(item);
        idx++;
    }
}

// Render Employee Table & Grid UI
function updateEmployeeListUI(employees) {
    if (currentViewMode === 'table') {
        renderTableView(employees);
    } else {
        renderGridView(employees);
    }
}

function renderTableView(employees) {
    tableBody.innerHTML = '';
    if (employees.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="py-12 text-center text-slate-500">
                    <i class="fa-solid fa-circle-exclamation text-2xl mb-2 block"></i>
                    No matching banking employee records found.
                </td>
            </tr>
        `;
        return;
    }

    employees.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-800/40 transition group border-b border-slate-800/60';

        const formattedSalary = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(emp.salary || 0);

        const statusBadge = getStatusBadgeHTML(emp.status);
        const deptBadge = getDeptColorHTML(emp.department);

        tr.innerHTML = `
            <td class="px-4 py-3">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-extrabold flex items-center justify-center text-xs shrink-0">
                        ${emp.fullName ? emp.fullName.charAt(0).toUpperCase() : 'E'}
                    </div>
                    <div>
                        <div class="font-bold text-white group-hover:text-blue-400 transition">${emp.fullName}</div>
                        <div class="text-[11px] font-mono text-amber-400">${emp.empId}</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-3">${deptBadge}</td>
            <td class="px-4 py-3 font-medium text-slate-200">${emp.designation}</td>
            <td class="px-4 py-3 font-mono font-bold text-emerald-400">${formattedSalary}</td>
            <td class="px-4 py-3 font-mono text-slate-300">${emp.branchCode}</td>
            <td class="px-4 py-3">${statusBadge}</td>
            <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end space-x-1">
                    <button onclick="viewEmployeeCard(${emp.id})" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition" title="View Identity Card">
                        <i class="fa-solid fa-eye text-xs"></i>
                    </button>
                    <button onclick="editEmployee(${emp.id})" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 transition" title="Edit Employee">
                        <i class="fa-solid fa-pen-to-square text-xs"></i>
                    </button>
                    <button onclick="confirmDeleteEmployee(${emp.id}, '${emp.empId}', '${emp.fullName}')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 transition" title="Delete Employee">
                        <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function renderGridView(employees) {
    gridViewContainer.innerHTML = '';
    if (employees.length === 0) {
        gridViewContainer.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-500 glass-card rounded-2xl">
                <i class="fa-solid fa-circle-exclamation text-2xl mb-2 block"></i>
                No matching banking employee records found.
            </div>
        `;
        return;
    }

    employees.forEach(emp => {
        const formattedSalary = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(emp.salary || 0);

        const card = document.createElement('div');
        card.className = 'glass-card rounded-2xl p-4 border border-white/10 hover:border-blue-500/40 transition group';
        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-extrabold flex items-center justify-center text-sm">
                        ${emp.fullName ? emp.fullName.charAt(0).toUpperCase() : 'E'}
                    </div>
                    <div>
                        <h3 class="font-bold text-white text-sm group-hover:text-blue-400 transition">${emp.fullName}</h3>
                        <span class="text-xs font-mono text-amber-400">${emp.empId}</span>
                    </div>
                </div>
                ${getStatusBadgeHTML(emp.status)}
            </div>

            <div class="space-y-1.5 text-xs text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div class="flex justify-between"><span class="text-slate-400">Department:</span><span class="font-medium">${emp.department}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Designation:</span><span class="font-medium">${emp.designation}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Salary:</span><span class="font-mono font-bold text-emerald-400">${formattedSalary}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Branch:</span><span class="font-mono">${emp.branchCode}</span></div>
            </div>

            <div class="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button onclick="viewEmployeeCard(${emp.id})" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-medium">
                    <i class="fa-solid fa-eye mr-1"></i> Card
                </button>
                <button onclick="editEmployee(${emp.id})" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-medium">
                    <i class="fa-solid fa-pen mr-1"></i> Edit
                </button>
                <button onclick="confirmDeleteEmployee(${emp.id}, '${emp.empId}', '${emp.fullName}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-medium">
                    <i class="fa-solid fa-trash mr-1"></i> Delete
                </button>
            </div>
        `;
        gridViewContainer.appendChild(card);
    });
}

// Helpers for badges
function getStatusBadgeHTML(status) {
    let cls = 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    if (status === 'Active') cls = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    else if (status === 'On Leave') cls = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    else if (status === 'Suspended') cls = 'bg-rose-500/20 text-rose-400 border-rose-500/40';

    return `<span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cls}">${status || 'Active'}</span>`;
}

function getDeptColorHTML(dept) {
    let cls = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (dept === 'Corporate Banking') cls = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    else if (dept === 'Risk & Compliance') cls = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    else if (dept === 'IT & Cybersecurity') cls = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    else if (dept === 'Loan Processing') cls = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    else if (dept === 'Forex & Investment') cls = 'text-amber-400 bg-amber-500/10 border-amber-500/20';

    return `<span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cls}">${dept}</span>`;
}

// Event Listeners Setup
function setupEventListeners() {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(loadAllData, 300);
    });

    filterDept.addEventListener('change', loadAllData);
    filterStatus.addEventListener('change', loadAllData);

    document.getElementById('btn-refresh').addEventListener('click', loadAllData);

    // View Toggle
    document.getElementById('btn-view-table').addEventListener('click', () => {
        currentViewMode = 'table';
        document.getElementById('btn-view-table').className = 'p-1.5 rounded-lg bg-blue-600 text-white text-xs';
        document.getElementById('btn-view-grid').className = 'p-1.5 rounded-lg text-slate-400 hover:text-white text-xs';
        tableViewContainer.classList.remove('hidden');
        gridViewContainer.classList.add('hidden');
        renderTableView(employeesData);
    });

    document.getElementById('btn-view-grid').addEventListener('click', () => {
        currentViewMode = 'grid';
        document.getElementById('btn-view-grid').className = 'p-1.5 rounded-lg bg-blue-600 text-white text-xs';
        document.getElementById('btn-view-table').className = 'p-1.5 rounded-lg text-slate-400 hover:text-white text-xs';
        tableViewContainer.classList.add('hidden');
        gridViewContainer.classList.remove('hidden');
        renderGridView(employeesData);
    });

    // CSV Export
    document.getElementById('btn-export-csv').addEventListener('click', () => {
        window.open(`${API_BASE}/export/csv`, '_blank');
    });

    // Modal Open Add
    document.getElementById('btn-open-add-modal').addEventListener('click', () => {
        openFormModal(null);
    });

    document.getElementById('btn-close-form-modal').addEventListener('click', closeFormModal);
    document.getElementById('btn-cancel-form').addEventListener('click', closeFormModal);

    document.getElementById('btn-close-card-modal').addEventListener('click', closeCardModal);
    document.getElementById('btn-close-card').addEventListener('click', closeCardModal);

    // Form Submit Handler
    employeeForm.addEventListener('submit', handleFormSubmit);
}

// Open Form Modal (Add or Edit)
function openFormModal(emp = null) {
    const titleEl = document.getElementById('form-modal-title');
    const hiddenIdEl = document.getElementById('form-emp-id-hidden');

    if (emp) {
        titleEl.innerText = `Edit Employee Record (${emp.empId})`;
        hiddenIdEl.value = emp.id;
        document.getElementById('input-emp-id').value = emp.empId || '';
        document.getElementById('input-emp-id').disabled = true;
        document.getElementById('input-full-name').value = emp.fullName || '';
        document.getElementById('input-email').value = emp.email || '';
        document.getElementById('input-department').value = emp.department || 'Retail Banking';
        document.getElementById('input-designation').value = emp.designation || '';
        document.getElementById('input-salary').value = emp.salary || '';
        document.getElementById('input-branch-code').value = emp.branchCode || 'BR-MUM-01';
        document.getElementById('input-status').value = emp.status || 'Active';
        document.getElementById('input-joining-date').value = emp.joiningDate ? emp.joiningDate.split('T')[0] : '';
    } else {
        titleEl.innerText = 'Add New Banking Employee';
        hiddenIdEl.value = '';
        employeeForm.reset();
        document.getElementById('input-emp-id').disabled = false;
        document.getElementById('input-joining-date').value = new Date().toISOString().split('T')[0];
    }

    formModal.classList.remove('hidden');
}

function closeFormModal() {
    formModal.classList.add('hidden');
}

// Handle Form Submit (CREATE / UPDATE API Call)
async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('form-emp-id-hidden').value;

    const payload = {
        empId: document.getElementById('input-emp-id').value.trim(),
        fullName: document.getElementById('input-full-name').value.trim(),
        email: document.getElementById('input-email').value.trim(),
        department: document.getElementById('input-department').value,
        designation: document.getElementById('input-designation').value.trim(),
        salary: parseFloat(document.getElementById('input-salary').value),
        branchCode: document.getElementById('input-branch-code').value.trim().toUpperCase(),
        status: document.getElementById('input-status').value,
        joiningDate: document.getElementById('input-joining-date').value
    };

    try {
        let res;
        if (id) {
            // PUT Update
            res = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // POST Create
            res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        const data = await res.json();
        if (res.ok && data.success) {
            showToast(data.message || 'Saved successfully!', 'success');
            closeFormModal();
            loadAllData();
        } else {
            showToast(data.message || 'Operation failed', 'error');
        }
    } catch (error) {
        showToast('Error sending request to Java Spring Boot', 'error');
    }
}

// Edit Trigger
window.editEmployee = function(id) {
    const emp = employeesData.find(e => e.id === id);
    if (emp) openFormModal(emp);
};

// View Digital ID Card
window.viewEmployeeCard = function(id) {
    const emp = employeesData.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('card-avatar').innerText = emp.fullName ? emp.fullName.charAt(0).toUpperCase() : 'BK';
    document.getElementById('card-full-name').innerText = emp.fullName;
    document.getElementById('card-designation').innerText = emp.designation;
    document.getElementById('card-emp-id').innerText = emp.empId;
    document.getElementById('card-dept').innerText = emp.department;
    document.getElementById('card-branch').innerText = emp.branchCode;

    const formattedSalary = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(emp.salary || 0);
    document.getElementById('card-salary').innerText = formattedSalary;

    document.getElementById('card-date').innerText = emp.joiningDate || '2022-01-01';
    document.getElementById('card-email').innerText = emp.email;
    document.getElementById('card-email').href = `mailto:${emp.email}`;

    cardModal.classList.remove('hidden');
};

function closeCardModal() {
    cardModal.classList.add('hidden');
}

// Delete Employee
window.confirmDeleteEmployee = async function(id, empId, name) {
    if (confirm(`Are you sure you want to delete employee ${empId} (${name})?`)) {
        try {
            const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok && data.success) {
                showToast(data.message || 'Employee record deleted', 'success');
                loadAllData();
            } else {
                showToast(data.message || 'Failed to delete employee', 'error');
            }
        } catch (err) {
            showToast('Error deleting employee record', 'error');
        }
    }
};

// Toast Notification Handler
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastContent = document.getElementById('toast-content');
    const toastIcon = document.getElementById('toast-icon');
    const toastMsg = document.getElementById('toast-msg');

    toastMsg.innerText = msg;
    if (type === 'error') {
        toastContent.className = 'flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold bg-rose-950/90 border-rose-500/50 text-rose-300';
        toastIcon.className = 'fa-solid fa-circle-xmark';
    } else {
        toastContent.className = 'flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold bg-emerald-950/90 border-emerald-500/50 text-emerald-300';
        toastIcon.className = 'fa-solid fa-circle-check';
    }

    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3500);
}

function showLoading(show) {
    if (show) loadingSpinner.classList.remove('hidden');
    else loadingSpinner.classList.add('hidden');
}
