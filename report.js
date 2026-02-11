document.addEventListener('DOMContentLoaded', function() {
    const tagsContainer = document.getElementById('tagsContainer');
    const tagInput = document.getElementById('affectedSystems');
    const charCount = document.getElementById('charCount');
    const descriptionTextarea = document.getElementById('incidentDescription');
    
    descriptionTextarea.addEventListener('input', function() {
        charCount.textContent = this.value.length;
        if (this.value.length > 1900) {
            charCount.classList.add('error');
        } else if (this.value.length > 1500) {
            charCount.classList.add('warning');
        } else {
            charCount.classList.remove('warning', 'error');
        }
    });
    
    tagInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            e.preventDefault();
            const tag = this.value.trim();
            addTag(tag);
            this.value = '';
        }
    });
    
    function addTag(text) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${text}
            <i class="fas fa-times" onclick="this.parentElement.remove()"></i>
        `;
        tagsContainer.appendChild(tag);
    }
    
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileUpload = document.getElementById('fileUpload');
    const fileList = document.getElementById('fileList');
    
    fileUploadArea.addEventListener('click', () => fileUpload.click());
    
    fileUpload.addEventListener('change', handleFiles);
    
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
        fileUploadArea.classList.add('drag-over');
    }
    
    function unhighlight() {
        fileUploadArea.classList.remove('drag-over');
    }
    
    fileUploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }
    
    function handleFiles(e) {
        const files = [...e.target.files];
        files.forEach(uploadFile);
    }
    
    function uploadFile(file) {
        if (file.size > 10 * 1024 * 1024) {
            alert('File too large! Maximum size is 10MB.');
            return;
        }
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-icon">
                <i class="fas fa-file"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <div class="file-actions">
                <button class="file-action-btn remove-btn" onclick="this.closest('.file-item').remove()">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
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
    
    const reportForm = document.getElementById('reportForm');
    const submitBtn = document.getElementById('submitBtn');
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const successModal = document.getElementById('successModal');
    
    previewBtn.addEventListener('click', showPreview);
    document.getElementById('closePreviewModal').addEventListener('click', hidePreview);
    document.getElementById('closePreviewBtn').addEventListener('click', hidePreview);
    document.getElementById('confirmSubmitBtn').addEventListener('click', submitForm);
    
    function showPreview() {
        const previewContent = document.getElementById('previewContent');
        previewContent.innerHTML = `
            <h3>Preview of Your Report</h3>
            <p>Please review your information before submitting.</p>
            <!-- Add more preview details here -->
        `;
        previewModal.classList.add('active');
    }
    
    function hidePreview() {
        previewModal.classList.remove('active');
    }
    
    function submitForm() {
        hidePreview();
        showSuccess();
    }
    
    function showSuccess() {
        successModal.classList.add('active');
    }
    
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
    });
    
    document.getElementById('newReportBtn')?.addEventListener('click', function() {
        successModal.classList.remove('active');
        reportForm.reset();
        window.scrollTo(0, 0);
    });
});
async function submitForm() {
    const incidentData = {
        title: document.getElementById('incidentTitle').value,
        category: document.getElementById('incidentCategory').value,
        severity: document.querySelector('input[name="severity"]:checked')?.value,
        date: document.getElementById('incidentDate').value,
        description: document.getElementById('incidentDescription').value,
        impactAssessment: document.getElementById('impactAssessment').value,
        reporterName: document.getElementById('reporterName').value,
        reporterEmail: document.getElementById('reporterEmail').value,
        reporterPhone: document.getElementById('reporterPhone').value,
        reporterDepartment: document.getElementById('reporterDepartment').value,
        sourceIP: document.getElementById('sourceIP').value
    };
    
    try {
        const newIncident = await CyberGuardDB.createIncident(incidentData);
        
        document.getElementById('reportId').textContent = newIncident.id;
        document.getElementById('successModal').classList.add('active');
        
        await CyberGuardDB.logActivity({
            type: 'incident_reported',
            userId: 'current-user',
            description: `New incident reported: ${newIncident.title}`,
            details: { incidentId: newIncident.id }
        });
        
        console.log('Incident saved:', newIncident);
    } catch (error) {
        console.error('Error saving incident:', error);
        alert('Error saving incident. Please try again.');
    }
}

async function submitReportForm() {
    const incidentData = {
        title: document.getElementById('incidentTitle').value,
        category: document.getElementById('incidentCategory').value,
        severity: document.querySelector('input[name="severity"]:checked')?.value,
        date: document.getElementById('incidentDate').value || new Date().toISOString(),
        description: document.getElementById('incidentDescription').value,
        impactAssessment: document.getElementById('impactAssessment').value,
        evidenceDescription: document.getElementById('evidenceDescription').value,
        sourceIP: document.getElementById('sourceIP').value,
        reporter: document.getElementById('reporterName').value,
        reporterEmail: document.getElementById('reporterEmail').value,
        reporterPhone: document.getElementById('reporterPhone').value,
        reporterDepartment: document.getElementById('reporterDepartment').value,
        reporterLocation: document.getElementById('reporterLocation').value,
        urgencyLevel: document.getElementById('urgencyLevel').value,
        affectedSystems: getTagsFromInput(),
        evidenceFiles: getUploadedFiles()
    };
    
    if (!incidentData.title || !incidentData.category || !incidentData.severity) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        const newIncident = await db.createIncident(incidentData);
        
        await db.logActivity({
            type: 'incident_reported',
            userId: 'current-user',
            userName: incidentData.reporter,
            description: `Reported new incident: ${incidentData.title}`,
            details: { incidentId: newIncident.id }
        });
        
        document.getElementById('reportId').textContent = newIncident.id;
        document.getElementById('successModal').classList.add('active');
        
        setTimeout(() => {
            document.getElementById('reportForm').reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
        
        console.log('✅ Incident saved:', newIncident);
        
    } catch (error) {
        console.error('❌ Error saving incident:', error);
        alert('Error saving incident. Please try again.');
        
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Report';
        submitBtn.disabled = false;
    }
}

document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitReportForm();
});