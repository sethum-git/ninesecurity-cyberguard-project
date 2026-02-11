document.addEventListener('DOMContentLoaded', function() {

    setTimeout(initializeCharts, 100);
    
    document.getElementById('refreshAnalytics')?.addEventListener('click', function() {
        refreshCharts();
    });
    
    document.getElementById('exportAnalytics')?.addEventListener('click', function() {
        exportAnalyticsData();
    });
    
    document.getElementById('timeRange')?.addEventListener('change', function() {
        updateChartsForTimeRange(this.value);
    });
    
    document.querySelectorAll('.chart-control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-control-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateChartView(this.dataset.chart);
        });
    });
});

function initializeCharts() {
    const incidentTrendCtx = document.getElementById('incidentTrendChart').getContext('2d');
    new Chart(incidentTrendCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Incidents',
                data: [12, 19, 15, 25, 22, 18, 24],
                borderColor: '#0066ff',
                backgroundColor: 'rgba(0, 102, 255, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Resolved',
                data: [8, 15, 12, 18, 16, 14, 19],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
    
    const threatDistributionCtx = document.getElementById('threatDistributionChart').getContext('2d');
    new Chart(threatDistributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Phishing', 'Malware', 'DDoS', 'Data Breach', 'Insider Threat'],
            datasets: [{
                data: [45, 32, 28, 22, 18],
                backgroundColor: [
                    '#9b59b6',
                    '#e74c3c',
                    '#3498db',
                    '#e67e22',
                    '#2ecc71'
                ],
                borderWidth: 2,
                borderColor: '#1e293b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#94a3b8',
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            }
        }
    });
    

    const severityCtx = document.getElementById('severityChart').getContext('2d');
    new Chart(severityCtx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Critical',
                data: [3, 5, 4, 6],
                backgroundColor: '#ef4444'
            }, {
                label: 'High',
                data: [8, 6, 7, 9],
                backgroundColor: '#ff6b6b'
            }, {
                label: 'Medium',
                data: [12, 10, 14, 11],
                backgroundColor: '#f59e0b'
            }, {
                label: 'Low',
                data: [5, 7, 6, 8],
                backgroundColor: '#74b9ff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
    

    const responseTimeCtx = document.getElementById('responseTimeChart').getContext('2d');
    new Chart(responseTimeCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Response Time (hours)',
                data: [4.2, 3.8, 3.5, 2.9, 2.6, 2.4],
                borderColor: '#00d4aa',
                backgroundColor: 'rgba(0, 212, 170, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return value + 'h';
                        }
                    }
                }
            }
        }
    });
}

function refreshCharts() {

    console.log('Refreshing analytics data...');
    
    const refreshBtn = document.getElementById('refreshAnalytics');
    const originalHTML = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    refreshBtn.disabled = true;
    
    setTimeout(() => {
        refreshBtn.innerHTML = originalHTML;
        refreshBtn.disabled = false;
        
        showNotification('Analytics data refreshed successfully!', 'success');
    }, 1500);
}

function updateChartsForTimeRange(days) {
    console.log('Updating charts for', days, 'days');
}

function updateChartView(chartType) {
    console.log('Switching to', chartType, 'view');
}

function exportAnalyticsData() {

    console.log('Exporting analytics data...');
    
    showNotification('Exporting analytics report...', 'info');
    
    setTimeout(() => {
        showNotification('Report exported successfully!', 'success');
    }, 2000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `analytics-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const notificationStyles = `
    .analytics-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: var(--radius);
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .analytics-notification.show {
        transform: translateX(0);
    }
    
    .analytics-notification.success {
        border-left: 4px solid #10b981;
    }
    
    .analytics-notification.info {
        border-left: 4px solid #0066ff;
    }
    
    .analytics-notification i {
        font-size: 1.2rem;
    }
    
    .analytics-notification.success i {
        color: #10b981;
    }
    
    .analytics-notification.info i {
        color: #0066ff;
    }
    
    .analytics-notification span {
        color: #f8fafc;
        font-size: 0.95rem;
    }
`;
function initReportDownloads() {
    // Report buttons
    const reportButtons = document.querySelectorAll('.report-btn');
    const downloadModal = document.getElementById('downloadModal');
    const closeDownloadModal = document.getElementById('closeDownloadModal');
    const cancelDownload = document.getElementById('cancelDownload');
    const confirmDownload = document.getElementById('confirmDownload');
    const downloadProgressBar = document.getElementById('downloadProgressBar');
    const downloadSuccess = document.getElementById('downloadSuccess');
    const downloadProgress = document.getElementById('downloadProgress');
    
    let selectedReportType = '';
    
    reportButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedReportType = this.querySelector('span').textContent;
            downloadModal.classList.add('active');
            
            downloadProgress.style.display = 'none';
            downloadSuccess.classList.remove('show');
            downloadProgressBar.style.width = '0%';
        });
    });
    
    closeDownloadModal.addEventListener('click', closeModal);
    cancelDownload.addEventListener('click', closeModal);
    
    confirmDownload.addEventListener('click', startDownload);
    
    function closeModal() {
        downloadModal.classList.remove('active');
        selectedReportType = '';
    }
    
    function startDownload() {
        const format = document.querySelector('input[name="reportFormat"]:checked').value;
        
        downloadProgress.style.display = 'block';
        
        simulateDownloadProgress(format);
    }
    
    function simulateDownloadProgress(format) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    downloadSuccess.classList.add('show');
                    
                    setTimeout(() => {
                        closeModal();
                        
                        showDownloadNotification(selectedReportType, format);
                    }, 2000);
                }, 500);
            }
            downloadProgressBar.style.width = progress + '%';
        }, 200);
    }
    
    function showDownloadNotification(reportType, format) {
        const notification = document.createElement('div');
        notification.className = 'download-notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <strong>${reportType}</strong>
                <p>Downloaded as ${format.toUpperCase()} file</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        const styles = `
            .download-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--card-bg);
                border: 1px solid var(--card-border);
                border-left: 4px solid var(--success-color);
                border-radius: var(--radius);
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 12px;
                max-width: 350px;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 9999;
                box-shadow: var(--shadow-lg);
            }
            
            .download-notification.show {
                transform: translateX(0);
            }
            
            .download-notification i {
                font-size: 1.5rem;
                color: var(--success-color);
            }
            
            .download-notification strong {
                display: block;
                color: var(--text-primary);
                font-size: 0.95rem;
                margin-bottom: 3px;
            }
            
            .download-notification p {
                color: var(--text-secondary);
                font-size: 0.85rem;
                margin: 0;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 20px;
                cursor: pointer;
                margin-left: auto;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.05);
                color: var(--danger-color);
            }
        `;
        
        if (!document.querySelector('#download-notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'download-notification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    downloadModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && downloadModal.classList.contains('active')) {
            closeModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    initReportDownloads();
    
});
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
async function loadAnalyticsData() {
    try {
        const timeRange = document.getElementById('timeRange')?.value || '30';
        
        const analyticsData = await db.getAnalyticsData(timeRange);
        
        updateAnalyticsMetrics(analyticsData);
        
        updateCharts(analyticsData);
        
        updateThreatCategories(analyticsData.threatDistribution);
        
        updateDepartmentAnalysis();
        
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function updateAnalyticsMetrics(data) {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        if (title.includes('Total Threats')) {
            card.querySelector('.metric-value').textContent = data.totalIncidents;
        } else if (title.includes('Critical Incidents')) {
            card.querySelector('.metric-value').textContent = data.criticalIncidents;
        } else if (title.includes('Avg Response Time')) {
            card.querySelector('.metric-value').textContent = data.avgResponseTime + 'h';
        } else if (title.includes('Threats Blocked')) {
            card.querySelector('.metric-value').textContent = data.threatsBlocked + '%';
        }
    });
}

async function exportAnalyticsData() {
    try {
        const timeRange = document.getElementById('timeRange')?.value || '30';
        const analyticsData = await db.getAnalyticsData(timeRange);
        
        const format = getSelectedExportFormat(); // PDF, Excel, CSV, JSON
        
        switch(format) {
            case 'json':
                downloadJSON(analyticsData, `analytics_${timeRange}_days.json`);
                break;
            case 'csv':
                downloadCSV(analyticsData, `analytics_${timeRange}_days.csv`);
                break;
            case 'excel':
                break;
            case 'pdf':
                break;
        }
        
        await db.logActivity({
            type: 'analytics_exported',
            description: `Exported ${timeRange}-day analytics report`,
            details: { format, timeRange }
        });
        
        showNotification('Report exported successfully', 'success');
        
    } catch (error) {
        console.error('Error exporting analytics:', error);
        showNotification('Error exporting report', 'error');
    }
}