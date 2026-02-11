async function loadDashboardData() {
    try {
        const stats = await db.getStatistics();
        
        updateDashboardStats(stats);
        
        const recentIncidents = await db.getIncidents({ limit: 5 });
        updateRecentIncidents(recentIncidents);
        
        const activities = await db.getActivities(5);
        updateRecentActivity(activities);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateDashboardStats(stats) {
    document.querySelectorAll('.stat-card').forEach(card => {
        const type = card.classList[1]; // total, critical, etc.
        switch(type) {
            case 'total':
                card.querySelector('.stat-number').textContent = stats.totalIncidents;
                break;
            case 'critical':
                card.querySelector('.stat-number').textContent = stats.criticalIncidents;
                break;
            case 'investigating':
                card.querySelector('.stat-number').textContent = stats.investigating;
                break;
            case 'resolved':
                card.querySelector('.stat-number').textContent = stats.resolved;
                break;
        }
    });
}

function updateRecentIncidents(incidents) {
    const container = document.querySelector('.recent-incidents-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    incidents.forEach(incident => {
        const item = document.createElement('div');
        item.className = 'incident-item';
        item.innerHTML = `
            <div class="incident-info">
                <h4>${incident.title}</h4>
                <span class="incident-id">${incident.id}</span>
                <span class="incident-time">${formatDate(incident.date)}</span>
            </div>
            <span class="severity-badge ${incident.severity}">${incident.severity}</span>
        `;
        container.appendChild(item);
    });
}