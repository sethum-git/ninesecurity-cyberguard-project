const incidentsTableBody = document.getElementById('incidentsTableBody');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const severityFilter = document.getElementById('severityFilter');
const statusFilter = document.getElementById('statusFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const exportBtn = document.getElementById('exportBtn');
const incidentModal = document.getElementById('incidentModal');
const newIncidentModal = document.getElementById('newIncidentModal');
const closeModal = document.getElementById('closeModal');
const closeNewModal = document.getElementById('closeNewModal');
const cancelReport = document.getElementById('cancelReport');
const incidentForm = document.getElementById('incidentForm');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const showingCount = document.getElementById('showingCount');
const totalCount = document.getElementById('totalCount');

const incidentsData = [
    {
        id: "CT-2024-00124",
        title: "Phishing Attack on HR Department",
        category: "phishing",
        severity: "critical",
        status: "investigating",
        date: "2024-03-15 14:30:45",
        assignedTo: "Sarah Johnson",
        description: "Multiple employees received suspicious emails pretending to be from HR asking for login credentials.",
        reporter: "John Smith (IT Dept)",
        attachments: 2
    },
    {
        id: "CT-2024-00123",
        title: "Malware Detected in Finance System",
        category: "malware",
        severity: "high",
        status: "investigating",
        date: "2024-03-14 09:15:22",
        assignedTo: "Michael Chen",
        description: "Ransomware encrypted financial reports, demand 5 BTC for decryption.",
        reporter: "Robert Brown (Finance)",
        attachments: 3
    },
    {
        id: "CT-2024-00122",
        title: "DDoS Attack on Company Website",
        category: "ddos",
        severity: "critical",
        status: "resolved",
        date: "2024-03-13 16:45:30",
        assignedTo: "David Wilson",
        description: "Website experienced 2-hour downtime due to volumetric attack.",
        reporter: "Network Operations",
        attachments: 1
    },
    {
        id: "CT-2024-00121",
        title: "Unauthorized Data Access Detected",
        category: "databreach",
        severity: "high",
        status: "investigating",
        date: "2024-03-12 11:20:15",
        assignedTo: "Emma Davis",
        description: "Suspicious access patterns detected in customer database.",
        reporter: "Security Team",
        attachments: 0
    },
    {
        id: "CT-2024-00120",
        title: "Social Engineering Attempt",
        category: "social",
        severity: "medium",
        status: "reported",
        date: "2024-03-11 08:45:10",
        assignedTo: "Not Assigned",
        description: "Employee received call from someone pretending to be IT support.",
        reporter: "Lisa Taylor",
        attachments: 1
    },
    {
        id: "CT-2024-00119",
        title: "Ransomware in Marketing Department",
        category: "ransomware",
        severity: "critical",
        status: "resolved",
        date: "2024-03-10 13:10:05",
        assignedTo: "James Miller",
        description: "Marketing files encrypted, ransom note left on desktop.",
        reporter: "Marketing Team",
        attachments: 2
    },
    {
        id: "CT-2024-00118",
        title: "Insider Threat - Data Theft",
        category: "insider",
        severity: "high",
        status: "investigating",
        date: "2024-03-09 10:30:40",
        assignedTo: "Security Team",
        description: "Employee caught transferring confidential files to personal drive.",
        reporter: "HR Department",
        attachments: 4
    },
    {
        id: "CT-2024-00117",
        title: "Phishing Campaign Targeting Executives",
        category: "phishing",
        severity: "medium",
        status: "closed",
        date: "2024-03-08 15:25:55",
        assignedTo: "Sarah Johnson",
        description: "Spear phishing emails sent to C-level executives.",
        reporter: "Executive Protection",
        attachments: 2
    },
    {
        id: "CT-2024-00116",
        title: "Malicious USB Device Found",
        category: "malware",
        severity: "low",
        status: "resolved",
        date: "2024-03-07 07:50:25",
        assignedTo: "IT Security",
        description: "USB drive found in parking lot containing malware.",
        reporter: "Facilities",
        attachments: 1
    },
    {
        id: "CT-2024-00115",
        title: "Brute Force Attack on VPN",
        category: "ddos",
        severity: "high",
        status: "investigating",
        date: "2024-03-06 19:15:33",
        assignedTo: "Network Team",
        description: "Multiple failed login attempts detected on VPN gateway.",
        reporter: "Network Monitoring",
        attachments: 3
    }
];

let filteredData = [...incidentsData];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    initializeTable();
    setupEventListeners();
    setupFileUpload();
    updateStats();
    
    const now = new Date();
    const dateTimeString = now.toISOString().slice(0, 16);
    if (document.getElementById('incidentDate')) {
        document.getElementById('incidentDate').value = dateTimeString;
    }
});

function initializeTable() {
    renderTable();
    updatePagination();
}

function renderTable() {
    incidentsTableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    pageData.forEach(incident => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${incident.id}</strong></td>
            <td>${incident.title}</td>
            <td><span class="category-tag ${incident.category}">${getCategoryLabel(incident.category)}</span></td>
            <td><span class="severity-tag ${incident.severity}">${incident.severity.toUpperCase()}</span></td>
            <td><span class="status-tag ${incident.status}">${incident.status.toUpperCase()}</span></td>
            <td>${formatDate(incident.date)}</td>
            <td>${incident.assignedTo}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewIncident('${incident.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn edit-btn" onclick="editIncident('${incident.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteIncident('${incident.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        incidentsTableBody.appendChild(row);
    });
    
    showingCount.textContent = `${startIndex + 1}-${Math.min(endIndex, filteredData.length)}`;
    totalCount.textContent = filteredData.length;
    
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = endIndex >= filteredData.length;
}

function getCategoryLabel(category) {
    const labels = {
        phishing: "Phishing",
        malware: "Malware",
        ddos: "DDoS",
        databreach: "Data Breach",
        ransomware: "Ransomware",
        social: "Social Engineering",
        insider: "Insider Threat"
    };
    return labels[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function applyFilters() {
    filteredData = incidentsData.filter(incident => {
        const searchTerm = searchInput.value.toLowerCase();
        const matchesSearch = !searchTerm || 
            incident.id.toLowerCase().includes(searchTerm) ||
            incident.title.toLowerCase().includes(searchTerm) ||
            incident.reporter.toLowerCase().includes(searchTerm);
        
        const categoryValue = categoryFilter.value;
        const matchesCategory = !categoryValue || incident.category === categoryValue;
        
        const severityValue = severityFilter.value;
        const matchesSeverity = !severityValue || incident.severity === severityValue;
        
        const statusValue = statusFilter.value;
        const matchesStatus = !statusValue || incident.status === statusValue;
        
        return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
    });
    
    currentPage = 1;
    renderTable();
    updateStats();
}

function updateStats() {
    const total = filteredData.length;
    const critical = filteredData.filter(i => i.severity === 'critical').length;
    const investigating = filteredData.filter(i => i.status === 'investigating').length;
    const resolved = filteredData.filter(i => i.status === 'resolved').length;
    
    document.querySelector('.stat-card.total .stat-number').textContent = total;
    document.querySelector('.stat-card.critical .stat-number').textContent = critical;
    document.querySelector('.stat-card.investigating .stat-number').textContent = investigating;
    document.querySelector('.stat-card.resolved .stat-number').textContent = resolved;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = document.querySelector('.page-numbers');
    if (!pageNumbers) return;
    
    pageNumbers.innerHTML = '';
    
    addPageButton(1);
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    if (startPage > 2) {
        pageNumbers.innerHTML += '<span>...</span>';
    }
    
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }
    
    if (endPage < totalPages - 1) {
        pageNumbers.innerHTML += '<span>...</span>';
    }
    
    if (totalPages > 1) {
        addPageButton(totalPages);
    }
    
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.textContent) === currentPage);
    });
}

function addPageButton(pageNum) {
    const pageNumbers = document.querySelector('.page-numbers');
    if (!pageNumbers) return;
    
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.textContent = pageNum;
    btn.onclick = () => goToPage(pageNum);
    pageNumbers.appendChild(btn);
}

function goToPage(page) {
    currentPage = page;
    renderTable();
    updatePagination();
}

function viewIncident(incidentId) {
    const incident = incidentsData.find(i => i.id === incidentId);
    if (!incident) return;
    
    document.getElementById('detailId').textContent = incident.id;
    document.getElementById('detailTitle').textContent = incident.title;
    document.getElementById('detailCategory').textContent = getCategoryLabel(incident.category);
    document.getElementById('detailCategory').className = `detail-value category-tag ${incident.category}`;
    document.getElementById('detailSeverity').textContent = incident.severity.toUpperCase();
    document.getElementById('detailSeverity').className = `detail-value severity-tag ${incident.severity}`;
    document.getElementById('detailReporter').textContent = incident.reporter;
    document.getElementById('detailDate').textContent = formatDate(incident.date);
    document.getElementById('detailAssigned').textContent = incident.assignedTo;
    document.getElementById('detailStatus').textContent = incident.status.toUpperCase();
    document.getElementById('detailStatus').className = `detail-value status-tag ${incident.status}`;
    document.getElementById('detailDescription').textContent = incident.description;
    
    incidentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function editIncident(incidentId) {
    newIncidentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const incident = incidentsData.find(i => i.id === incidentId);
    if (incident) {
        document.getElementById('incidentTitle').value = incident.title;
        document.getElementById('incidentCategory').value = incident.category;
        document.getElementById('incidentSeverity').value = incident.severity;
    }
}

function deleteIncident(incidentId) {
    if (confirm('Are you sure you want to delete this incident? This action cannot be undone.')) {
        const index = incidentsData.findIndex(i => i.id === incidentId);
        if (index !== -1) {
            incidentsData.splice(index, 1);
            applyFilters(); // Reapply filters to update the table
            showToast('Incident deleted successfully', 'success');
        }
    }
}

function showNewIncidentModal() {
    incidentForm.reset();
    
    const now = new Date();
    const dateTimeString = now.toISOString().slice(0, 16);
    document.getElementById('incidentDate').value = dateTimeString;
    
    document.getElementById('fileList').innerHTML = '';
    
    newIncidentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalWindow() {
    incidentModal.classList.remove('active');
    newIncidentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function setupFileUpload() {
    const fileUpload = document.getElementById('fileUpload');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileList = document.getElementById('fileList');
    
    if (!fileUpload || !fileUploadArea || !fileList) return;
    
    fileUploadArea.addEventListener('click', () => {
        fileUpload.click();
    });
    
    fileUpload.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            addFileToList(file);
        });
        fileUpload.value = '';
    });
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileUploadArea.style.borderColor = 'var(--primary-color)';
        fileUploadArea.style.background = 'rgba(0, 102, 255, 0.05)';
    }
    
    function unhighlight() {
        fileUploadArea.style.borderColor = 'var(--card-border)';
        fileUploadArea.style.background = 'rgba(255, 255, 255, 0.02)';
    }
    
    fileUploadArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        Array.from(files).forEach(file => {
            addFileToList(file);
        });
    });
}

function addFileToList(file) {
    const fileList = document.getElementById('fileList');
    if (!fileList) return;
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileSize = formatFileSize(file.size);
    
    fileItem.innerHTML = `
        <i class="fas fa-file"></i>
        <span class="file-name">${file.name}</span>
        <span class="file-size">${fileSize}</span>
        <button class="remove-file" onclick="removeFile(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    fileList.appendChild(fileItem);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(button) {
    button.parentElement.remove();
}

function setupEventListeners() {
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (severityFilter) severityFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);
    
    if (closeModal) closeModal.addEventListener('click', closeModalWindow);
    if (closeNewModal) closeNewModal.addEventListener('click', closeModalWindow);
    if (cancelReport) cancelReport.addEventListener('click', closeModalWindow);
    
    if (incidentForm) incidentForm.addEventListener('submit', handleFormSubmit);
    
    if (exportBtn) exportBtn.addEventListener('click', exportIncidents);
    
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    
    window.addEventListener('click', (e) => {
        if (e.target === incidentModal) {
            closeModalWindow();
        }
        if (e.target === newIncidentModal) {
            closeModalWindow();
        }
    });
    
    document.querySelectorAll('.action-btn').forEach(btn => {
        if (btn.classList.contains('assign-btn')) {
            btn.addEventListener('click', assignToMe);
        }
        if (btn.classList.contains('bulk-close-btn')) {
            btn.addEventListener('click', bulkClose);
        }
        if (btn.classList.contains('generate-report-btn')) {
            btn.addEventListener('click', generateReport);
        }
        if (btn.classList.contains('refresh-btn')) {
            btn.addEventListener('click', refreshData);
        }
    });
}

function clearFilters() {
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (severityFilter) severityFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    applyFilters();
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('incidentTitle').value,
        category: document.getElementById('incidentCategory').value,
        severity: document.getElementById('incidentSeverity').value,
        date: document.getElementById('incidentDate').value,
        description: document.getElementById('incidentDescription').value,
        evidence: document.getElementById('incidentEvidence').value,
        reporterName: document.getElementById('reporterName').value,
        reporterEmail: document.getElementById('reporterEmail').value,
        reporterPhone: document.getElementById('reporterPhone').value,
        reporterDept: document.getElementById('reporterDept').value,
        files: document.querySelectorAll('#fileList .file-item').length
    };
    
    if (!formData.title || !formData.category || !formData.severity) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const newId = generateIncidentId();
    
    const newIncident = {
        id: newId,
        title: formData.title,
        category: formData.category,
        severity: formData.severity,
        status: "reported",
        date: new Date().toISOString(),
        assignedTo: "Not Assigned",
        description: formData.description,
        reporter: `${formData.reporterName} (${formData.reporterDept || 'Unknown'})`,
        attachments: formData.files
    };
    
    incidentsData.unshift(newIncident);
    
    applyFilters();
    
    closeModalWindow();
    
    showToast(`Incident ${newId} reported successfully!`, 'success');
    
    incidentForm.reset();
    document.getElementById('fileList').innerHTML = '';
}

function generateIncidentId() {
    const lastId = incidentsData[0]?.id || 'CT-2024-00115';
    const lastNumber = parseInt(lastId.split('-').pop());
    const newNumber = (lastNumber + 1).toString().padStart(5, '0');
    return `CT-2024-${newNumber}`;
}

function assignToMe() {
    showToast('Incidents assigned to you successfully', 'success');
}

function bulkClose() {
    if (confirm('Are you sure you want to close all selected incidents?')) {
        showToast('Selected incidents closed successfully', 'success');
    }
}

function generateReport() {
    showToast('Report generation started. Download will begin shortly.', 'info');
    
    setTimeout(() => {
        showToast('Report generated successfully! Downloading...', 'success');
    }, 2000);
}

function refreshData() {
    showToast('Data refreshed successfully', 'success');
    applyFilters();
}

function exportIncidents() {
    // Create CSV data
    const headers = ['ID', 'Title', 'Category', 'Severity', 'Status', 'Date', 'Assigned To'];
    const csvData = filteredData.map(incident => [
        incident.id,
        incident.title,
        getCategoryLabel(incident.category),
        incident.severity.toUpperCase(),
        incident.status.toUpperCase(),
        formatDate(incident.date),
        incident.assignedTo
    ]);
    
    const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incidents_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showToast('Export completed successfully!', 'success');
}

function showToast(message, type = 'info') {
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        // Fallback simple toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#0066ff'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModalWindow();
    }
    
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        if (searchInput) searchInput.focus();
    }
    
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showNewIncidentModal();
    }
});
async function loadIncidentsData() {
    try {
        const filters = getCurrentFilters();
        
        const incidents = await db.getIncidents(filters);
        
        populateIncidentsTable(incidents);
        
        updateIncidentsStats(incidents);
        
        updatePagination(incidents.length);
        
    } catch (error) {
        console.error('Error loading incidents:', error);
    }
}

function getCurrentFilters() {
    const filters = {};
    
    const search = document.getElementById('searchInput')?.value;
    const category = document.getElementById('categoryFilter')?.value;
    const severity = document.getElementById('severityFilter')?.value;
    const status = document.getElementById('statusFilter')?.value;
    
    if (search) filters.search = search;
    if (category) filters.category = category;
    if (severity) filters.severity = severity;
    if (status) filters.status = status;
    
    return filters;
}

function populateIncidentsTable(incidents) {
    const tableBody = document.getElementById('incidentsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const currentPage = window.currentPage || 1;
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageIncidents = incidents.slice(startIndex, endIndex);
    
    pageIncidents.forEach(incident => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${incident.id}</strong></td>
            <td>${incident.title}</td>
            <td><span class="category-tag ${incident.category}">${formatCategory(incident.category)}</span></td>
            <td><span class="severity-tag ${incident.severity}">${incident.severity.toUpperCase()}</span></td>
            <td><span class="status-tag ${incident.status}">${incident.status.toUpperCase()}</span></td>
            <td>${formatDate(incident.date)}</td>
            <td>${incident.assignedTo || 'Unassigned'}</td>
            <td>
                <div class="table-action-buttons">
                    <button class="table-action-btn view-btn" onclick="viewIncident('${incident.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="table-action-btn edit-btn" onclick="editIncident('${incident.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="table-action-btn delete-btn" onclick="deleteIncident('${incident.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');
    if (showingCount) {
        showingCount.textContent = `${startIndex + 1}-${Math.min(endIndex, incidents.length)}`;
    }
    if (totalCount) {
        totalCount.textContent = incidents.length;
    }
}

async function viewIncident(id) {
    try {
        const incident = await db.getIncidentById(id);
        if (incident) {
            showIncidentModal(incident);
        }
    } catch (error) {
        console.error('Error viewing incident:', error);
    }
}

async function editIncident(id) {
    try {
        const incident = await db.getIncidentById(id);
        if (incident) {
            openEditForm(incident);
        }
    } catch (error) {
        console.error('Error editing incident:', error);
    }
}

async function deleteIncident(id) {
    if (confirm('Are you sure you want to delete this incident?')) {
        try {
            const incidents = await db.getIncidents();
            const filtered = incidents.filter(inc => inc.id !== id);
            localStorage.setItem('cyberguard_incidents', JSON.stringify(filtered));
            
            loadIncidentsData();
            
            await db.logActivity({
                type: 'incident_deleted',
                description: `Deleted incident: ${id}`
            });
            
            showNotification('Incident deleted successfully', 'success');
            
        } catch (error) {
            console.error('Error deleting incident:', error);
            showNotification('Error deleting incident', 'error');
        }
    }
}

document.getElementById('searchInput')?.addEventListener('input', loadIncidentsData);
document.getElementById('categoryFilter')?.addEventListener('change', loadIncidentsData);
document.getElementById('severityFilter')?.addEventListener('change', loadIncidentsData);
document.getElementById('statusFilter')?.addEventListener('change', loadIncidentsData);
document.getElementById('clearFilters')?.addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('severityFilter').value = '';
    document.getElementById('statusFilter').value = '';
    loadIncidentsData();
});
