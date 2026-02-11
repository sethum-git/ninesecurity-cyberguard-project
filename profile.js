document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in real app, this would come from an API
    const userStats = {
        totalIncidents: 156,
        resolvedCases: 89,
        activeInvestigations: 42,
        pendingReview: 25,
        closedCases: 67
    };
    
    updateProfileStats(userStats);
    
    function updateProfileStats(stats) {
        const resolvedPercentage = Math.round((stats.resolvedCases / stats.totalIncidents) * 100);
        const activePercentage = Math.round((stats.activeInvestigations / stats.totalIncidents) * 100);
        const pendingPercentage = Math.round((stats.pendingReview / stats.totalIncidents) * 100);
        
        document.querySelectorAll('.stat-item h3').forEach((stat, index) => {
            switch(index) {
                case 0:
                    stat.textContent = stats.totalIncidents;
                    stat.nextElementSibling.textContent = 'Total Incidents';
                    break;
                case 1:
                    stat.textContent = stats.resolvedCases;
                    stat.nextElementSibling.textContent = `Resolved (${resolvedPercentage}%)`;
                    break;
                case 2:
                    stat.textContent = stats.activeInvestigations;
                    stat.nextElementSibling.textContent = `Investigating (${activePercentage}%)`;
                    break;
            }
        });
        
        addStatTooltips(stats);
    }
    
    function addStatTooltips(stats) {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach((item, index) => {
            let tooltipText = '';
            
            switch(index) {
                case 0:
                    tooltipText = `Total incidents reported by you`;
                    break;
                case 1:
                    tooltipText = `${stats.resolvedCases} out of ${stats.totalIncidents} incidents resolved`;
                    break;
                case 2:
                    tooltipText = `${stats.activeInvestigations} incidents currently under investigation`;
                    break;
            }
            
            item.setAttribute('title', tooltipText);
            item.style.cursor = 'help';
        });
    }
});