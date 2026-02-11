const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileCloseBtn = document.getElementById('mobileCloseBtn');
const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
const menuIcon = document.getElementById('menuIcon');
const profileBtn = document.getElementById('profileBtn');
const profileContainer = document.getElementById('profileContainer');
const profileDropdown = document.getElementById('profileDropdown');
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');
const logoutBtn = document.getElementById('logoutBtn');
const markAllReadBtn = document.querySelector('.mark-all-read');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const logoLoader = document.getElementById('logoLoader');

function hideLoadingScreen() {
    if (logoLoader) {
        logoLoader.classList.add('fade-out');
        
        setTimeout(() => {
            logoLoader.style.display = 'none';
        }, 500);
    }
}

window.addEventListener('load', () => {
    console.log("Page fully loaded - hiding loader");
    setTimeout(hideLoadingScreen, 1000); 
});

setTimeout(() => {
    if (logoLoader && logoLoader.style.display !== 'none') {
        console.log("Force hiding loader after 3 seconds");
        hideLoadingScreen();
    }
}, 3000);

mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-times');
});

mobileCloseBtn.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    document.body.style.overflow = 'auto';
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
});

document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileContainer.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!profileContainer.contains(e.target)) {
        profileContainer.classList.remove('active');
    }
});

let notificationsVisible = false;

notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
        toggleMobileNotifications();
    }
});

document.addEventListener('click', (e) => {
    if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
        hideNotifications();
    }
});

function toggleMobileNotifications() {
    const notificationList = document.querySelector('.notification-list');
    const badge = document.querySelector('.notification-badge');
    
    if (notificationsVisible) {
        notificationList.style.display = 'none';
        notificationsVisible = false;
    } else {
        notificationList.style.display = 'block';
        notificationsVisible = true;
        
        badge.style.display = 'none';
        document.querySelectorAll('.notification-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
    }
}

function hideNotifications() {
    notificationsVisible = false;
    const notificationList = document.querySelector('.notification-list');
    if (window.innerWidth <= 768) {
        notificationList.style.display = 'none';
    }
}

markAllReadBtn.addEventListener('click', () => {
    const badge = document.querySelector('.notification-badge');
    badge.style.display = 'none';
    
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    
    showToast('All notifications marked as read');
});

logoutBtn.addEventListener('click', handleLogout);
mobileLogoutBtn.addEventListener('click', handleLogout);

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showToast('Logging out...', 'info');
        
        setTimeout(() => {
            localStorage.clear();
            sessionStorage.clear();
            
            showToast('Successfully logged out!', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }, 1000);
    }
}

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    mobileNavLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(toast);
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : type === 'warning' ? '#ffa502' : '#0066ff'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        max-width: 350px;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .toast-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: 10px;
        }
    `;
    document.head.appendChild(style);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
        style.remove();
    });
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
            style.remove();
        }
    }, 5000);
}

function simulateRealTimeUpdates() {
    setInterval(() => {
        const badge = document.querySelector('.notification-badge');
        const currentCount = parseInt(badge.textContent);
        
        if (Math.random() > 0.7) { // 30% chance
            badge.textContent = currentCount + 1;
            badge.style.display = 'flex';
            
            if (!document.hidden) {
                const threats = ['Phishing attack', 'Malware detection', 'Data breach attempt', 'DDoS attack'];
                const randomThreat = threats[Math.floor(Math.random() * threats.length)];
                showToast(`New ${randomThreat} detected`, 'warning');
            }
        }
    }, 30000);
    
    setInterval(() => {
        if (!document.hidden) {
            const stats = document.querySelectorAll('.stat-number');
            stats.forEach(stat => {
                const current = parseInt(stat.textContent);
                const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                const newValue = Math.max(0, current + change);
                stat.textContent = newValue;
                
                stat.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                }, 300);
            });
        }
    }, 15000);
}

function addRippleEffect() {
    document.querySelectorAll('.btn, .nav-link, .action-card').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt + N for new report
        if (e.altKey && e.key === 'n') {
            e.preventDefault();
            window.location.href = 'report.html';
        }
        
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            window.location.href = 'index.html';
        }
        
        if (e.altKey && e.key === 'q') {
            e.preventDefault();
            handleLogout();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setActiveLink();
    
    addRippleEffect();
    
    setupKeyboardShortcuts();
    
    simulateRealTimeUpdates();
    
    setTimeout(() => {
        showToast('Welcome to CyberGuard Threat Platform!', 'success');
    }, 1500);
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 CyberGuard Platform Loading...');
    
    if (typeof CyberGuardDB !== 'undefined') {
        await CyberGuardDB.initialize();
        console.log('✅ Database initialized successfully');
        
        window.db = CyberGuardDB;
        
        loadPageSpecificData();
    } else {
        console.error('❌ Database not loaded. Check if db.js is included.');
    }
});

function loadPageSpecificData() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    switch(page) {
        case 'index.html':
        case '':
            loadDashboardData();
            break;
        case 'incidents.html':
            loadIncidentsData();
            break;
        case 'report.html':
            break;
        case 'analytics.html':
            loadAnalyticsData();
            break;
        case 'teams.html':
            loadTeamsData();
            break;
        case 'profile.html':
            loadProfileData();
            break;
    }
}
