(function() {
    'use strict';
    
    function checkAuth() {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user');
        const expiry = localStorage.getItem('session_expiry');
        
        if (!token || !user) {
            return null;
        }
        
        if (expiry && Date.now() > parseInt(expiry)) {
            localStorage.clear();
            return null;
        }
        
        return JSON.parse(user);
    }
    
    const protectedPages = [
        'index.html',
        'report.html',
        'incidents.html',
        'analytics.html',
        'users.html',
        'profile.html',
        'settings.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const user = checkAuth();
        
        if (!user) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(currentPage);
            return;
        }
        
        updateUserUI(user);
    }
    
    function updateUserUI(user) {
        const profileNameElements = document.querySelectorAll('.profile-name, .mobile-user-name');
        profileNameElements.forEach(el => {
            if (el) el.textContent = user.name || 'User';
        });
        
        const profileRoleElements = document.querySelectorAll('.profile-role, .mobile-user-role');
        profileRoleElements.forEach(el => {
            if (el) el.textContent = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
        });
        
        const avatarElements = document.querySelectorAll('.profile-avatar, .mobile-avatar');
        avatarElements.forEach(el => {
            if (el && user.name) {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                el.textContent = initials || 'U';
            }
        });
    }
    
    window.authCheck = {
        checkAuth,
        updateUserUI
    };
    
})();