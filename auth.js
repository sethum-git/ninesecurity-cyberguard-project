document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        window.location.href = 'index.html';
        return;
    }
    
    initLogin();
});

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const demoAdminBtn = document.getElementById('useDemoAdmin');
    
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    if (demoAdminBtn) {
        demoAdminBtn.addEventListener('click', function() {
            document.getElementById('username').value = 'admin';
            document.getElementById('password').value = 'admin123';
            document.getElementById('rememberMe').checked = true;
            
            setTimeout(() => {
                loginForm.dispatchEvent(new Event('submit'));
            }, 1000);
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            if (!username || !password) {
                showToast('Please enter both username and password', 'error');
                return;
            }
            
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
            loginBtn.disabled = true;
            
            try {
                const success = await authenticateUser(username, password, rememberMe);
                
                if (success) {
                    showToast('Login successful! Redirecting...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Secure Login';
                    loginBtn.disabled = false;
                }
            } catch (error) {
                console.error('Login error:', error);
                showToast('Authentication failed. Please try again.', 'error');
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Secure Login';
                loginBtn.disabled = false;
            }
        });
    }
}

async function authenticateUser(username, password, rememberMe = false) {
    
    const demoUsers = [
        {
            id: 1,
            username: 'admin',
            email: 'admin@ninesecurity.com',
            password: 'admin123',
            role: 'admin',
            name: 'Amal Fernando',
            department: 'Security Operations',
            avatar: 'AF'
        },
        {
            id: 2,
            username: 'analyst',
            email: 'analyst@ninesecurity.com',
            password: 'analyst123',
            role: 'analyst',
            name: 'Sarah Johnson',
            department: 'Threat Analysis',
            avatar: 'SJ'
        },
        {
            id: 3,
            username: 'user',
            email: 'user@company.com',
            password: 'user123',
            role: 'user',
            name: 'John Smith',
            department: 'IT Department',
            avatar: 'JS'
        }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = demoUsers.find(u => 
        u.username.toLowerCase() === username.toLowerCase() || 
        u.email.toLowerCase() === username.toLowerCase()
    );
    
    if (!user) {
        showToast('User not found', 'error');
        return false;
    }
    
    if (user.password !== password) {
        showToast('Invalid password', 'error');
        return false;
    }
    
    const userSession = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        department: user.department,
        avatar: user.avatar,
        loggedInAt: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(userSession));
    localStorage.setItem('auth_token', generateToken(user.id));
    
    if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
        localStorage.setItem('session_expiry', Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days
    } else {
        localStorage.setItem('session_expiry', Date.now() + (8 * 60 * 60 * 1000)); // 8 hours
    }
    
    console.log('User logged in:', user.username);
    
    return true;
}

function generateToken(userId) {
    return `nine_${userId}_${Date.now()}_${Math.random().toString(36).substr(2)}`;
}

function checkAuth() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    const expiry = localStorage.getItem('session_expiry');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return null;
    }
    
    if (expiry && Date.now() > parseInt(expiry)) {
        localStorage.clear();
        window.location.href = 'login.html?session=expired';
        return null;
    }
    
    return JSON.parse(user);
}

function logout() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User logged out:', user.username);
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('session_expiry');
    localStorage.removeItem('remember_me');
    
    window.location.href = 'login.html';
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
        background: ${type === 'success' ? '#2ed573' : 
                     type === 'error' ? '#ff4757' : 
                     type === 'warning' ? '#ffa502' : '#0066ff'};
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

window.auth = {
    checkAuth,
    logout,
    showToast,
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}

function handleLogout() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (confirm('Are you sure you want to logout?')) {
        showToast('Logging out...', 'info');
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('session_expiry');
        localStorage.removeItem('remember_me');
        
        console.log('User logged out:', user.username || 'Unknown');
        
        setTimeout(() => {
            showToast('Successfully logged out!', 'success');
            window.location.href = 'login.html';
        }, 1000);
    }
}

function checkAuthOnPages() {
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

document.addEventListener('DOMContentLoaded', function() {
    checkAuthOnPages();
    
    setupLogout();
    
    if (window.location.pathname.includes('login.html')) {
        initLogin();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const demoAdminBtn = document.getElementById('useDemoAdmin');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    demoAdminBtn.addEventListener('click', function() {
        usernameInput.value = 'admin';
        passwordInput.value = 'admin123';
        
        demoAdminBtn.innerHTML = '<i class="fas fa-check"></i> Credentials Loaded';
        demoAdminBtn.classList.add('btn-primary');
        demoAdminBtn.classList.remove('btn-secondary');
        
        passwordInput.focus();
        
        setTimeout(() => {
            demoAdminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Use Admin Demo';
            demoAdminBtn.classList.remove('btn-primary');
            demoAdminBtn.classList.add('btn-secondary');
        }, 2000);
    });
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        loginBtn.disabled = true;
        
        setTimeout(() => {
            const username = usernameInput.value;
            const password = passwordInput.value;
            
            if ((username === 'admin' && password === 'admin123') ||
                (username === 'analyst' && password === 'analyst123') ||
                (username === 'user' && password === 'user123')) {
                
                loginBtn.innerHTML = '<i class="fas fa-check"></i> Login Successful!';
                loginBtn.style.background = 'linear-gradient(135deg, #00d4aa, #00b894)';
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; 
                }, 1000);
            } else {
                loginBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Invalid Credentials';
                loginBtn.style.background = 'linear-gradient(135deg, #ff4757, #ff3838)';
                
                setTimeout(() => {
                    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Secure Login';
                    loginBtn.style.background = '';
                    loginBtn.disabled = false;
                }, 2000);
            }
        }, 1500);
    });
});