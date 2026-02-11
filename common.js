(function() {
    'use strict';
    
    function fixLoadingScreen() {
        const loader = document.getElementById('logoLoader');
        
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 500);
            }
        }, 2000);
        
        setTimeout(() => {
            if (loader && loader.style.display !== 'none') {
                loader.style.display = 'none';
            }
        }, 3000);
        
        document.body.style.overflow = 'hidden';
    }
    
    function fixLogout() {
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = 'login.html';
            }
        }
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
        
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }
    
    function fixMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileNav = document.getElementById('mobileNav');
        const mobileCloseBtn = document.getElementById('mobileCloseBtn');
        const menuIcon = document.getElementById('menuIcon');
        
        if (mobileMenuBtn && mobileNav) {
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
        }
    }
    
    function fixProfileDropdown() {
        const profileBtn = document.getElementById('profileBtn');
        const profileContainer = document.getElementById('profileContainer');
        
        if (profileBtn && profileContainer) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                profileContainer.classList.toggle('active');
            });
            
            document.addEventListener('click', (e) => {
                if (!profileContainer.contains(e.target)) {
                    profileContainer.classList.remove('active');
                }
            });
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        fixLoadingScreen();
        fixLogout();
        fixMobileMenu();
        fixProfileDropdown();
    });
    
})();