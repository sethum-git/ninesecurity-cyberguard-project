class CyberGuardPortal {
    constructor() {
        this.init();
        this.createModal();
    }

    init() {
        this.loadingScreen();
        this.updateLiveTime();
        this.setupEventListeners();
        this.animateStats();
        this.checkAuthentication();
    }

    createModal() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.id = 'requestModal';
        
        modalOverlay.innerHTML = `
            <div class="request-modal">
                <button class="modal-close" id="closeModalBtn">
                    <i class="fas fa-times"></i>
                </button>
                
                <!-- Request Form -->
                <div id="requestFormContainer">
                    <div class="modal-header">
                        <i class="fas fa-shield-alt"></i>
                        <h2>Request Access</h2>
                        <p>Fill in your details to request access to CyberGuard platform</p>
                    </div>
                    
                    <form id="accessRequestForm" class="request-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label><i class="fas fa-user"></i> First Name</label>
                                <input type="text" id="firstName" placeholder="John" required>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-user"></i> Last Name</label>
                                <input type="text" id="lastName" placeholder="Doe" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-envelope"></i> Work Email</label>
                            <input type="email" id="email" placeholder="john.doe@company.com" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label><i class="fas fa-building"></i> Company</label>
                                <input type="text" id="company" placeholder="Your company name" required>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-briefcase"></i> Job Title</label>
                                <input type="text" id="jobTitle" placeholder="Security Analyst" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label><i class="fas fa-users"></i> Department</label>
                                <select id="department" required>
                                    <option value="">Select department</option>
                                    <option value="IT Security">IT Security</option>
                                    <option value="Finance">Finance</option>
                                    <option value="HR">Human Resources</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Executive">Executive</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-globe"></i> Company Size</label>
                                <select id="companySize" required>
                                    <option value="">Select size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="501-1000">501-1000 employees</option>
                                    <option value="1000+">1000+ employees</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-clipboard-list"></i> Purpose of Access</label>
                            <textarea id="purpose" placeholder="Please describe why you need access to CyberGuard platform..." required></textarea>
                        </div>
                        
                        <div class="terms-group">
                            <input type="checkbox" id="terms" required>
                            <label for="terms">
                                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. 
                                I understand that my request will be reviewed within 24-48 hours.
                            </label>
                        </div>
                        
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" id="cancelRequestBtn">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                            <button type="submit" class="btn btn-primary" id="submitRequestBtn">
                                <i class="fas fa-paper-plane"></i> Submit Request
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Success State -->
                <div id="successState" class="success-state">
                    <div class="success-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <h3>Request Submitted!</h3>
                    <p>Thank you for requesting access to CyberGuard platform.</p>
                    <p style="color: #94a3b8; margin-bottom: 20px;">
                        We've sent a confirmation email to <span id="submittedEmail" style="color: #0066ff; font-weight: 600;"></span>
                    </p>
                    <div class="badge">
                        <i class="fas fa-clock"></i> Review time: 24-48 hours
                    </div>
                    <button class="btn btn-primary" id="closeSuccessBtn" style="margin-top: 30px; width: 100%;">
                        <i class="fas fa-check-circle"></i> Got it
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
    }

    handleRequestAccess(e) {
        e.preventDefault();
        
        const btn = e.currentTarget;
        
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
        
        const modal = document.getElementById('requestModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const form = document.getElementById('accessRequestForm');
        const successState = document.getElementById('successState');
        const formContainer = document.getElementById('requestFormContainer');
        
        if (form) form.reset();
        if (successState) successState.classList.remove('active');
        if (formContainer) formContainer.style.display = 'block';
        
        this.setupModalListeners();
    }

    setupModalListeners() {
        const modal = document.getElementById('requestModal');
        const closeBtn = document.getElementById('closeModalBtn');
        const cancelBtn = document.getElementById('cancelRequestBtn');
        const form = document.getElementById('accessRequestForm');
        const closeSuccessBtn = document.getElementById('closeSuccessBtn');
        
        if (closeBtn) {
            closeBtn.replaceWith(closeBtn.cloneNode(true));
            document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        }
        
        if (cancelBtn) {
            cancelBtn.replaceWith(cancelBtn.cloneNode(true));
            document.getElementById('cancelRequestBtn').addEventListener('click', () => this.closeModal());
        }
        
        if (closeSuccessBtn) {
            closeSuccessBtn.replaceWith(closeSuccessBtn.cloneNode(true));
            document.getElementById('closeSuccessBtn').addEventListener('click', () => this.closeModal());
        }
        
        if (form) {
            form.replaceWith(form.cloneNode(true));
            document.getElementById('accessRequestForm').addEventListener('submit', (e) => this.submitRequest(e));
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('requestModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    submitRequest(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            company: document.getElementById('company')?.value || '',
            jobTitle: document.getElementById('jobTitle')?.value || '',
            department: document.getElementById('department')?.value || '',
            companySize: document.getElementById('companySize')?.value || '',
            purpose: document.getElementById('purpose')?.value || ''
        };
        
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.purpose) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        const submitBtn = document.getElementById('submitRequestBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            const formContainer = document.getElementById('requestFormContainer');
            const successState = document.getElementById('successState');
            const submittedEmail = document.getElementById('submittedEmail');
            
            formContainer.style.display = 'none';
            successState.classList.add('active');
            
            if (submittedEmail) {
                submittedEmail.textContent = formData.email;
            }
            
            this.storeRequest(formData);
            
            this.showNotification('Access request submitted successfully!', 'success');
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            console.log('Access Request Submitted:', formData);
        }, 2000);
    }

    storeRequest(formData) {
        const existingRequests = JSON.parse(localStorage.getItem('cyberguard_requests') || '[]');
        
        const newRequest = {
            ...formData,
            id: 'REQ-' + Date.now(),
            timestamp: new Date().toISOString(),
            status: 'pending',
            statusColor: 'warning'
        };
        
        existingRequests.push(newRequest);
        localStorage.setItem('cyberguard_requests', JSON.stringify(existingRequests));
    }

    loadingScreen() {
        const loader = document.getElementById('logoLoader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 500);
            }, 1500);
        }
    }

    updateLiveTime() {
        const timeElement = document.getElementById('liveTime');
        
        const updateTime = () => {
            const now = new Date();
            const hours = now.getUTCHours().toString().padStart(2, '0');
            const minutes = now.getUTCMinutes().toString().padStart(2, '0');
            const seconds = now.getUTCSeconds().toString().padStart(2, '0');
            
            if (timeElement) {
                timeElement.textContent = `${hours}:${minutes}:${seconds} UTC`;
            }
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    setupEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => this.handleLogin(e));
        }

        const requestBtn = document.getElementById('requestBtn');
        if (requestBtn) {
            requestBtn.addEventListener('click', (e) => this.handleRequestAccess(e));
        }

        const reportBtns = document.querySelectorAll('.report-btn');
        reportBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => this.handleReportGeneration(e, index));
        });

        const threatItems = document.querySelectorAll('.threat-item');
        threatItems.forEach((item) => {
            item.addEventListener('click', (e) => this.handleThreatClick(e));
        });

        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    handleLogin(e) {
        e.preventDefault();
        
        const btn = e.currentTarget;
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
        btn.disabled = true;
        
        btn.classList.add('loading');
        
        setTimeout(() => {
            const isAuthenticated = localStorage.getItem('cyberguard_auth') === 'true';
            
            if (isAuthenticated) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'login.html';
            }
        }, 800);
    }

    handleReportGeneration(e, index) {
        const btn = e.currentTarget;
        const reportTypes = [
            'Monthly Security Report',
            'Risk Assessment Report',
            'Compliance Report',
            'Trend Analysis Report'
        ];
        
        btn.classList.add('downloading');
        
        const icon = btn.querySelector('i');
        const originalIcon = icon.className;
        const span = btn.querySelector('span');
        const originalText = span.textContent;
        
        icon.className = 'fas fa-spinner fa-spin';
        span.textContent = 'Generating...';
        
        setTimeout(() => {
            icon.className = 'fas fa-check-circle';
            span.textContent = 'Downloaded!';
            
            this.downloadReport(reportTypes[index]);
            
            setTimeout(() => {
                btn.classList.remove('downloading');
                icon.className = originalIcon;
                span.textContent = originalText;
                
                this.showNotification(`${reportTypes[index]} downloaded successfully!`, 'success');
            }, 1500);
        }, 2000);
    }

    downloadReport(reportName) {
        const content = this.generateReportContent(reportName);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        
        a.href = url;
        a.download = `CyberGuard_${reportName.replace(/\s+/g, '_')}_${formattedDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    generateReportContent(reportName) {
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        
        return `
CYBERGUARD SECURITY PLATFORM
============================
Report Type: ${reportName}
Generated: ${date} ${time}
Generated By: Amal Fernando (Administrator)
Security Level: CONFIDENTIAL

SUMMARY
-------
- Total Threats Detected: 1,284
- Critical Incidents: 24
- Response Time: 2.4h
- Prevention Rate: 89%

THREAT CATEGORIES
----------------
- Phishing Attacks: 45 incidents
- Malware/Ransomware: 32 incidents
- DDoS Attacks: 28 incidents
- Data Breaches: 22 incidents
- Insider Threats: 18 incidents

DEPARTMENT ANALYSIS
------------------
- Finance: 32 incidents (+15%)
- HR: 28 incidents (+8%)
- IT: 24 incidents (+12%)
- Sales: 19 incidents (+5%)

GEOGRAPHIC THREATS
-----------------
- United States: 42 attacks
- China: 28 attacks
- Russia: 24 attacks
- Germany: 18 attacks
- India: 15 attacks

This report is automatically generated by CyberGuard Threat Intelligence Platform.
© 2026 NINE Security. All rights reserved.
        `;
    }

    handleThreatClick(e) {
        const threatItem = e.currentTarget;
        const threatName = threatItem.querySelector('.threat-name').textContent;
        
        this.showNotification(`Viewing details: ${threatName}`, 'info');
        
        threatItem.style.background = 'rgba(0, 102, 255, 0.1)';
        setTimeout(() => {
            threatItem.style.background = '';
        }, 300);
    }

    handleKeyboardShortcuts(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            document.getElementById('loginBtn')?.click();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            document.getElementById('requestBtn')?.click();
        }
        
        if (e.key === 'Escape') {
            this.clearNotifications();
            this.closeModal();
        }
    }

    showNotification(message, type = 'info') {
        this.clearNotifications();
        
        const notification = document.createElement('div');
        notification.className = `portal-notification ${type}`;
        
        let icon = 'fa-info-circle';
        let bgColor = '#0066ff';
        
        if (type === 'success') {
            icon = 'fa-check-circle';
            bgColor = '#10b981';
        } else if (type === 'error') {
            icon = 'fa-exclamation-circle';
            bgColor = '#ef4444';
        } else if (type === 'warning') {
            icon = 'fa-exclamation-triangle';
            bgColor = '#f59e0b';
        }
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; background: ${bgColor}; color: white; padding: 12px 24px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <i class="fas ${icon}"></i>
                <span style="font-weight: 500;">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: 20px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    clearNotifications() {
        document.querySelectorAll('.portal-notification').forEach(el => el.remove());
    }

    animateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach(stat => {
            const targetValue = stat.textContent;
            if (targetValue.includes('%')) {
                const num = parseInt(targetValue);
                this.animateNumber(stat, 0, num, 2000, '%');
            } else if (targetValue.includes(',')) {
                const num = parseInt(targetValue.replace(',', ''));
                this.animateNumber(stat, 0, num, 2000, '', true);
            } else {
                const num = parseInt(targetValue);
                this.animateNumber(stat, 0, num, 2000);
            }
        });
    }

    animateNumber(element, start, end, duration, suffix = '', commaFormat = false) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            let current = Math.floor(progress * (end - start) + start);
            
            if (commaFormat) {
                element.textContent = current.toLocaleString() + suffix;
            } else {
                element.textContent = current + suffix;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = (commaFormat ? end.toLocaleString() : end) + suffix;
            }
        };
        
        window.requestAnimationFrame(step);
    }

    checkAuthentication() {
        const isAuthenticated = localStorage.getItem('cyberguard_auth') === 'true';
        const userData = JSON.parse(localStorage.getItem('cyberguard_user') || '{}');
        
        if (isAuthenticated && userData.name) {
            const userNameElement = document.querySelector('.user-name');
            const userAvatarElement = document.querySelector('.user-avatar span');
            
            if (userNameElement) {
                userNameElement.textContent = userData.name;
            }
            
            if (userAvatarElement) {
                const initials = userData.name
                    .split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);
                userAvatarElement.textContent = initials;
            }
            
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Go to Dashboard</span>';
            }
        }
    }

    logout() {
        localStorage.removeItem('cyberguard_auth');
        localStorage.removeItem('cyberguard_user');
        
        this.showNotification('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.portal = new CyberGuardPortal();
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .portal-notification {
        animation: slideInRight 0.3s ease;
    }
    
    .loading {
        pointer-events: none;
        opacity: 0.8;
    }
    
    .downloading {
        position: relative;
        overflow: hidden;
    }
    
    .downloading::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, #0066ff, #00d4aa);
        animation: downloading 2s linear infinite;
    }
    
    @keyframes downloading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;

document.head.appendChild(style);