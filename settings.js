document.addEventListener('DOMContentLoaded', function() {
    initSettingsPage();
    
    loadSavedSettings();
});

function initSettingsPage() {
    console.log('🚀 Initializing settings page...');
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.settings-tab');
    
    console.log(`Found ${tabButtons.length} tab buttons`);
    console.log(`Found ${tabContents.length} tab contents`);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Tab clicked:', this.getAttribute('data-tab'));
            
            const tabId = this.getAttribute('data-tab');
            
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.setAttribute('aria-hidden', 'true');
            });
            
            const activeTab = document.getElementById(`${tabId}-tab`);
            if (activeTab) {
                activeTab.classList.add('active');
                activeTab.setAttribute('aria-hidden', 'false');
                
                activeTab.style.animation = 'fadeIn 0.3s ease';
                
                console.log(`Switched to ${tabId} tab`);
            } else {
                console.error(`Tab content not found: ${tabId}-tab`);
            }
        });
    });
    
    setTimeout(() => {
        const activeTab = document.querySelector('.tab-btn.active');
        if (!activeTab && tabButtons.length > 0) {
            tabButtons[0].click();
        }
    }, 100);
    
    const saveBtn = document.getElementById('saveSettings');
    const applyBtn = document.getElementById('applySettings');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAllSettings);
        console.log('Save button initialized');
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applySettings);
        console.log('Apply button initialized');
    }
    
    const resetBtn = document.getElementById('resetSettings');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToDefaults);
        console.log('Reset button initialized');
    }
    
    const cancelBtn = document.getElementById('cancelChanges');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Discard all unsaved changes?')) {
                loadSavedSettings();
                showNotification('Changes discarded', 'info');
            }
        });
        console.log('Cancel button initialized');
    }
    
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const color = this.getAttribute('data-color');
            updateAccentColor(color);
        });
    });
    console.log(`Color picker initialized: ${colorOptions.length} options`);
    
    const clearCacheBtn = document.getElementById('clearCache');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', clearCache);
        console.log('Clear cache button initialized');
    }
    
    const resetAllBtn = document.getElementById('resetAllSettings');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            if (confirm('⚠️ WARNING: This will reset ALL settings to factory defaults.\n\nAre you sure?')) {
                resetAllSettings();
            }
        });
        console.log('Reset all button initialized');
    }
    
    const exportDataBtn = document.getElementById('exportAllData');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportAllData);
        console.log('Export data button initialized');
    }
    
    const integrationButtons = document.querySelectorAll('[id$="Settings"], [id$="Connect"]');
    integrationButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.id.replace('Settings', '').replace('Connect', '');
            showNotification(`Opening ${service} configuration...`, 'info');
        });
    });
    console.log(`Integration buttons initialized: ${integrationButtons.length} buttons`);
    
    const themeRadios = document.querySelectorAll('input[name="themeMode"]');
    themeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'light') {
                showNotification('Light theme selected. Page refresh required.', 'info');
            } else if (this.value === 'dark') {
                showNotification('Dark theme selected. Page refresh required.', 'info');
            } else {
                showNotification('Auto theme selected. Page refresh required.', 'info');
            }
        });
    });
    console.log(`Theme radios initialized: ${themeRadios.length} radios`);
    
    const fontSizeSlider = document.getElementById('fontSize');
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', function() {
            document.documentElement.style.setProperty('--base-font-size', `${this.value}px`);
            showNotification(`Font size: ${this.value}px`, 'info');
        });
        console.log('Font size slider initialized');
    }
    
    const debugToggle = document.getElementById('debugMode');
    if (debugToggle) {
        debugToggle.addEventListener('change', function() {
            if (this.checked) {
                console.log('🔧 Debug mode enabled');
                console.log('Settings form data:', collectAllSettings());
                showNotification('Debug mode enabled. Check console for details.', 'warning');
            } else {
                console.log('🔧 Debug mode disabled');
                showNotification('Debug mode disabled', 'info');
            }
        });
        console.log('Debug toggle initialized');
    }
    
    addDebugButton();
    
    console.log('✅ Settings page initialized successfully');
}

function addDebugButton() {
    const debugBtn = document.createElement('button');
    debugBtn.innerHTML = '🐛 Test Tabs';
    debugBtn.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        z-index: 9999;
        font-size: 12px;
    `;
    
    debugBtn.addEventListener('click', function() {
        console.log('=== DEBUG TABS ===');
        
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach((tab, i) => {
            console.log(`Tab ${i}:`, {
                text: tab.textContent.trim(),
                dataTab: tab.getAttribute('data-tab'),
                isActive: tab.classList.contains('active'),
                hasContent: document.getElementById(`${tab.getAttribute('data-tab')}-tab`)
            });
        });
        
        const contents = document.querySelectorAll('.settings-tab');
        contents.forEach((content, i) => {
            console.log(`Content ${i}:`, {
                id: content.id,
                isActive: content.classList.contains('active'),
                visible: content.style.display
            });
        });
        
        tabs.forEach(tab => {
            console.log(`Testing tab: ${tab.getAttribute('data-tab')}`);
            tab.click();
            
            const tabId = tab.getAttribute('data-tab');
            const content = document.getElementById(`${tabId}-tab`);
            if (content && content.classList.contains('active')) {
                console.log(`✓ ${tabId} works!`);
            } else {
                console.log(`✗ ${tabId} failed!`);
            }
        });
        
        setTimeout(() => tabs[0].click(), 1000);
        
        showNotification('Tab test completed. Check console.', 'info');
    });
    
    document.body.appendChild(debugBtn);
}

function loadSavedSettings() {
    console.log('📂 Loading saved settings...');
    
    const savedSettings = localStorage.getItem('cyberguard_settings');
    
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            console.log('Loaded settings:', settings);
            applySettingsToForm(settings);
            showNotification('Settings loaded from storage', 'success');
        } catch (error) {
            console.error('❌ Error loading settings:', error);
            loadDefaultSettings();
        }
    } else {
        console.log('No saved settings found, loading defaults');
        loadDefaultSettings();
    }
}

function loadDefaultSettings() {
    console.log('⚙️ Loading default settings...');
    
    const defaultSettings = {
        platformLanguage: 'en',
        timeZone: 'UTC',
        dateFormat: 'mm-dd-yyyy',
        autoRefresh: '60',
        autoSaveDrafts: true,
        dataRetention: '90',
        autoArchiveDays: '30',
        
        emailNewIncidents: true,
        emailStatusUpdates: true,
        emailDailySummary: true,
        emailWeeklyAnalytics: false,
        browserNotifications: true,
        alertSound: true,
        notificationSound: 'default',
        smsCriticalAlerts: false,
        smsPhoneNumber: '',
        
        passwordStrength: 'medium',
        sessionTimeout: '30',
        maxLoginAttempts: '5',
        loginNotifications: true,
        loginHistoryRetention: '90',
        dataEncryption: true,
        autoBackup: true,
        backupRetention: '7',
        
        themeMode: 'dark',
        accentColor: '#0066ff',
        fontSize: '16',
        animations: true,
        dashboardLayout: 'normal',
        showAvatars: true,
        tableDensity: 'normal',
        
        apiEnabled: false,
        apiRateLimit: '60',
        
        cacheDuration: '900',
        reconnectAttempts: '5',
        debugMode: false,
        exportFormat: 'json',
        backupSchedule: 'weekly'
    };
    
    applySettingsToForm(defaultSettings);
    console.log('✅ Default settings applied');
}

function applySettingsToForm(settings) {
    console.log('📝 Applying settings to form...');
    
    setSelectValue('platformLanguage', settings.platformLanguage);
    setSelectValue('timeZone', settings.timeZone);
    setRadioValue('dateFormat', settings.dateFormat);
    setSelectValue('autoRefresh', settings.autoRefresh);
    setCheckboxValue('autoSaveDrafts', settings.autoSaveDrafts);
    setSelectValue('dataRetention', settings.dataRetention);
    setSelectValue('autoArchiveDays', settings.autoArchiveDays);
    
    setCheckboxValue('emailNewIncidents', settings.emailNewIncidents);
    setCheckboxValue('emailStatusUpdates', settings.emailStatusUpdates);
    setCheckboxValue('emailDailySummary', settings.emailDailySummary);
    setCheckboxValue('emailWeeklyAnalytics', settings.emailWeeklyAnalytics);
    setCheckboxValue('browserNotifications', settings.browserNotifications);
    setCheckboxValue('alertSound', settings.alertSound);
    setSelectValue('notificationSound', settings.notificationSound);
    setCheckboxValue('smsCriticalAlerts', settings.smsCriticalAlerts);
    setInputValue('smsPhoneNumber', settings.smsPhoneNumber);
    
    setSelectValue('passwordStrength', settings.passwordStrength);
    setSelectValue('sessionTimeout', settings.sessionTimeout);
    setInputValue('maxLoginAttempts', settings.maxLoginAttempts);
    setCheckboxValue('loginNotifications', settings.loginNotifications);
    setSelectValue('loginHistoryRetention', settings.loginHistoryRetention);
    setCheckboxValue('dataEncryption', settings.dataEncryption);
    setCheckboxValue('autoBackup', settings.autoBackup);
    setInputValue('backupRetention', settings.backupRetention);
    
    setRadioValue('themeMode', settings.themeMode);
    setAccentColor(settings.accentColor);
    setInputValue('fontSize', settings.fontSize);
    setCheckboxValue('animations', settings.animations);
    setSelectValue('dashboardLayout', settings.dashboardLayout);
    setCheckboxValue('showAvatars', settings.showAvatars);
    setSelectValue('tableDensity', settings.tableDensity);
    
    setSelectValue('cacheDuration', settings.cacheDuration);
    setInputValue('reconnectAttempts', settings.reconnectAttempts);
    setCheckboxValue('debugMode', settings.debugMode);
    setSelectValue('exportFormat', settings.exportFormat);
    setSelectValue('backupSchedule', settings.backupSchedule);
    
    console.log('✅ Settings applied to form');
}

function setSelectValue(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
        element.value = value;
    }
}

function setCheckboxValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.checked = Boolean(value);
    }
}

function setRadioValue(name, value) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach(radio => {
        radio.checked = radio.value === value;
    });
}

function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
        element.value = value;
    }
}

function setAccentColor(color) {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-color') === color) {
            option.classList.add('active');
        }
    });
    
    document.documentElement.style.setProperty('--primary-color', color);
}

function collectAllSettings() {
    return {
        platformLanguage: getSelectValue('platformLanguage'),
        timeZone: getSelectValue('timeZone'),
        dateFormat: getRadioValue('dateFormat'),
        autoRefresh: getSelectValue('autoRefresh'),
        autoSaveDrafts: getCheckboxValue('autoSaveDrafts'),
        dataRetention: getSelectValue('dataRetention'),
        autoArchiveDays: getSelectValue('autoArchiveDays'),
        
        emailNewIncidents: getCheckboxValue('emailNewIncidents'),
        emailStatusUpdates: getCheckboxValue('emailStatusUpdates'),
        emailDailySummary: getCheckboxValue('emailDailySummary'),
        emailWeeklyAnalytics: getCheckboxValue('emailWeeklyAnalytics'),
        browserNotifications: getCheckboxValue('browserNotifications'),
        alertSound: getCheckboxValue('alertSound'),
        notificationSound: getSelectValue('notificationSound'),
        smsCriticalAlerts: getCheckboxValue('smsCriticalAlerts'),
        smsPhoneNumber: getInputValue('smsPhoneNumber'),
        
        passwordStrength: getSelectValue('passwordStrength'),
        sessionTimeout: getSelectValue('sessionTimeout'),
        maxLoginAttempts: getInputValue('maxLoginAttempts'),
        loginNotifications: getCheckboxValue('loginNotifications'),
        loginHistoryRetention: getSelectValue('loginHistoryRetention'),
        dataEncryption: getCheckboxValue('dataEncryption'),
        autoBackup: getCheckboxValue('autoBackup'),
        backupRetention: getInputValue('backupRetention'),
        
        themeMode: getRadioValue('themeMode'),
        accentColor: getActiveColor(),
        fontSize: getInputValue('fontSize'),
        animations: getCheckboxValue('animations'),
        dashboardLayout: getSelectValue('dashboardLayout'),
        showAvatars: getCheckboxValue('showAvatars'),
        tableDensity: getSelectValue('tableDensity'),
        
        cacheDuration: getSelectValue('cacheDuration'),
        reconnectAttempts: getInputValue('reconnectAttempts'),
        debugMode: getCheckboxValue('debugMode'),
        exportFormat: getSelectValue('exportFormat'),
        backupSchedule: getSelectValue('backupSchedule'),
        
        lastUpdated: new Date().toISOString()
    };
}

function getSelectValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

function getCheckboxValue(id) {
    const element = document.getElementById(id);
    return element ? element.checked : false;
}

function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : '';
}

function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

function getActiveColor() {
    const active = document.querySelector('.color-option.active');
    return active ? active.getAttribute('data-color') : '#0066ff';
}

function saveAllSettings() {
    console.log('💾 Saving all settings...');
    
    const settings = collectAllSettings();
    console.log('Collected settings:', settings);
    
    localStorage.setItem('cyberguard_settings', JSON.stringify(settings));
    
    if (typeof CyberGuardDB !== 'undefined') {
        CyberGuardDB.saveToLocalStorage();
    }
    
    showNotification('✅ All settings saved successfully', 'success');
    
    if (typeof CyberGuardDB !== 'undefined') {
        CyberGuardDB.logActivity({
            type: 'settings_updated',
            description: 'Updated platform settings',
            details: { settings: Object.keys(settings).length }
        });
    }
}

function applySettings() {
    saveAllSettings();
    showNotification('⚙️ Settings applied. Some changes may require page refresh.', 'info');
}

function resetToDefaults() {
    if (confirm('Reset all settings to default values?')) {
        localStorage.removeItem('cyberguard_settings');
        loadDefaultSettings();
        showNotification('🔧 Settings reset to defaults', 'success');
    }
}

function clearCache() {
    if (confirm('Clear all cached data?')) {
        const essential = ['cyberguard_settings', 'cyberguard_users'];
        Object.keys(localStorage).forEach(key => {
            if (!essential.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        sessionStorage.clear();
        
        showNotification('🗑️ Cache cleared successfully', 'success');
    }
}

function resetAllSettings() {
    localStorage.clear();
    sessionStorage.clear();
    
    showNotification('🔄 All settings reset. Page will reload...', 'warning');
    setTimeout(() => location.reload(), 1500);
}

function exportAllData() {
    if (typeof CyberGuardDB !== 'undefined') {
        CyberGuardDB.exportData('json').then(data => {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cyberguard_backup_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('📤 Data exported successfully', 'success');
        });
    } else {
        showNotification('❌ Database not available for export', 'error');
    }
}

function updateAccentColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    showNotification(`🎨 Accent color changed to ${color}`, 'info');
}

function showNotification(message, type = 'info') {
    document.querySelectorAll('.settings-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `settings-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 
                         type === 'warning' ? 'exclamation-triangle' : 
                         'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    if (!document.querySelector('#settings-notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'settings-notification-styles';
        styleSheet.textContent = `
            .settings-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--card-bg);
                border: 1px solid var(--card-border);
                border-radius: var(--radius);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 9999;
                box-shadow: var(--shadow-lg);
                max-width: 350px;
            }
            
            .settings-notification.show {
                transform: translateX(0);
            }
            
            .settings-notification.success {
                border-left: 4px solid var(--success-color);
            }
            
            .settings-notification.error {
                border-left: 4px solid var(--danger-color);
            }
            
            .settings-notification.warning {
                border-left: 4px solid var(--warning-color);
            }
            
            .settings-notification.info {
                border-left: 4px solid var(--primary-color);
            }
            
            .settings-notification i {
                font-size: 1.2rem;
            }
            
            .settings-notification.success i {
                color: var(--success-color);
            }
            
            .settings-notification.error i {
                color: var(--danger-color);
            }
            
            .settings-notification.warning i {
                color: var(--warning-color);
            }
            
            .settings-notification.info i {
                color: var(--primary-color);
            }
            
            .settings-notification span {
                color: var(--text-primary);
                font-size: 0.95rem;
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

window.debugSettings = {
    testTabs: function() {
        console.log('Testing tabs...');
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            console.log(`Clicking ${tab.getAttribute('data-tab')}`);
            tab.click();
        });
    },
    showAllSettings: function() {
        console.log('Current settings:', collectAllSettings());
    },
    resetNow: function() {
        resetToDefaults();
    }
};

console.log('🔧 settings.js loaded successfully');