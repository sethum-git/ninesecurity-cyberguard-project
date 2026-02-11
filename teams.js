document.addEventListener('DOMContentLoaded', function() {
    initTeamsPage();
    
    setTimeout(() => {
        const loader = document.getElementById('logoLoader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 500);
        }
    }, 2000);
});

function initTeamsPage() {
    const createTeamBtn = document.getElementById('createTeamBtn');
    const createTeamModal = document.getElementById('createTeamModal');
    const closeCreateTeamModal = document.getElementById('closeCreateTeamModal');
    const cancelCreateTeam = document.getElementById('cancelCreateTeam');
    
    const inviteMemberBtn = document.getElementById('inviteMemberBtn');
    const inviteMemberModal = document.getElementById('inviteMemberModal');
    const closeInviteMemberModal = document.getElementById('closeInviteMemberModal');
    const cancelInviteMember = document.getElementById('cancelInviteMember');
    
    if (createTeamBtn && createTeamModal) {
        createTeamBtn.addEventListener('click', () => {
            createTeamModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        const closeModal = () => {
            createTeamModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
        
        closeCreateTeamModal.addEventListener('click', closeModal);
        cancelCreateTeam.addEventListener('click', closeModal);
        
        createTeamModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        const createTeamForm = document.getElementById('createTeamForm');
        if (createTeamForm) {
            createTeamForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const teamName = document.getElementById('teamName').value;
                const teamType = document.getElementById('teamType').value;
                
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    showNotification(`Team "${teamName}" created successfully!`, 'success');
                    
                    closeModal();
                    
                    createTeamForm.reset();
                    
                    simulateNewTeam(teamName, teamType);
                    
                }, 1500);
            });
        }
    }
    
    if (inviteMemberBtn && inviteMemberModal) {
        inviteMemberBtn.addEventListener('click', () => {
            inviteMemberModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        const closeModal = () => {
            inviteMemberModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
        
        closeInviteMemberModal.addEventListener('click', closeModal);
        cancelInviteMember.addEventListener('click', closeModal);
        
        inviteMemberModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        const inviteMemberForm = document.getElementById('inviteMemberForm');
        if (inviteMemberForm) {
            inviteMemberForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('inviteEmail').value;
                const name = document.getElementById('inviteName').value;
                const team = document.getElementById('inviteTeam').value;
                
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    showNotification(`Invitation sent to ${email}`, 'success');
                    
                    closeModal();
                    
                    inviteMemberForm.reset();
                    
                    updatePendingInvitesCount();
                    
                }, 1500);
            });
        }
    }
    
    document.querySelectorAll('.view-team-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const teamCard = this.closest('.team-card');
            const teamName = teamCard.querySelector('h3').textContent;
            showNotification(`Opening ${teamName} details...`, 'info');
            
            setTimeout(() => {
                console.log(`Loading team: ${teamName}`);
            }, 500);
        });
    });
    
    document.querySelectorAll('.team-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.title;
            const teamCard = this.closest('.team-card');
            const teamName = teamCard.querySelector('h3').textContent;
            
            if (action === 'Edit Team') {
                showNotification(`Editing ${teamName}`, 'info');
            } else if (action === 'Manage Members') {
                showNotification(`Managing members for ${teamName}`, 'info');
            }
        });
    });
    
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.title;
            const row = this.closest('tr');
            const memberName = row.querySelector('strong').textContent;
            
            switch(action) {
                case 'Message':
                    showNotification(`Opening chat with ${memberName}`, 'info');
                    break;
                case 'Edit':
                    showNotification(`Editing ${memberName}'s profile`, 'info');
                    break;
                case 'Remove':
                    if (confirm(`Remove ${memberName} from team?`)) {
                        // Simulate removal
                        row.style.opacity = '0.5';
                        setTimeout(() => {
                            row.remove();
                            showNotification(`${memberName} removed from team`, 'success');
                            updateMembersCount();
                        }, 500);
                    }
                    break;
            }
        });
    });
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.members-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const filterValue = this.value;
            const rows = document.querySelectorAll('.members-table tbody tr');
            
            rows.forEach(row => {
                const teamCell = row.querySelector('td:nth-child(3)').textContent;
                const shouldShow = !filterValue || 
                    (filterValue === 'security' && teamCell.includes('Security Response')) ||
                    (filterValue === 'malware' && teamCell.includes('Malware')) ||
                    (filterValue === 'network' && teamCell.includes('Network')) ||
                    (filterValue === 'forensics' && teamCell.includes('Forensics'));
                
                row.style.display = shouldShow ? '' : 'none';
            });
        });
    }
}

function simulateNewTeam(name, type) {
    const teamsGrid = document.querySelector('.teams-grid');
    if (!teamsGrid) return;
    
    const newTeamCard = document.createElement('div');
    newTeamCard.className = 'team-card';
    newTeamCard.innerHTML = `
        <div class="team-header">
            <div class="team-icon">
                <i class="fas fa-users"></i>
            </div>
            <div class="team-info">
                <h3>${name}</h3>
                <p class="team-desc">New ${type} team</p>
            </div>
            <div class="team-actions">
                <button class="team-action-btn" title="Edit Team">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="team-action-btn" title="Manage Members">
                    <i class="fas fa-user-cog"></i>
                </button>
            </div>
        </div>
        <div class="team-stats">
            <div class="team-stat">
                <span class="stat-label">Members</span>
                <span class="stat-value">1</span>
            </div>
            <div class="team-stat">
                <span class="stat-label">Active</span>
                <span class="stat-value">1</span>
            </div>
            <div class="team-stat">
                <span class="stat-label">Incidents</span>
                <span class="stat-value">0</span>
            </div>
        </div>
        <div class="team-members">
            <div class="members-list">
                <div class="member-avatar" title="You">AF</div>
            </div>
            <span class="team-role">Team Lead: You</span>
        </div>
        <button class="btn btn-secondary btn-sm view-team-btn">
            <i class="fas fa-eye"></i> View Details
        </button>
    `;
    
    newTeamCard.style.opacity = '0';
    newTeamCard.style.transform = 'translateY(20px)';
    teamsGrid.insertBefore(newTeamCard, teamsGrid.firstChild);
    
    setTimeout(() => {
        newTeamCard.style.transition = 'all 0.5s ease';
        newTeamCard.style.opacity = '1';
        newTeamCard.style.transform = 'translateY(0)';
        
        newTeamCard.querySelectorAll('.view-team-btn, .team-action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('view-team-btn')) {
                    showNotification(`Opening ${name} details...`, 'info');
                } else {
                    showNotification(`Action on ${name}`, 'info');
                }
            });
        });
    }, 10);
    
    updateTeamsCount();
}

function updateTeamsCount() {
    const teamsCount = document.querySelectorAll('.team-card').length;
    const countElement = document.querySelector('.total-teams h3');
    if (countElement) {
        countElement.textContent = teamsCount;
    }
}

function updateMembersCount() {
    const membersCount = document.querySelectorAll('.members-table tbody tr').length;
    const countElement = document.querySelector('.total-members h3');
    if (countElement) {
        countElement.textContent = membersCount;
    }
}

function updatePendingInvitesCount() {
    const countElement = document.querySelector('.pending-invites h3');
    if (countElement) {
        let currentCount = parseInt(countElement.textContent);
        countElement.textContent = currentCount + 1;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `teams-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    if (!document.querySelector('#teams-notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'teams-notification-styles';
        styleSheet.textContent = `
            .teams-notification {
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
            }
            
            .teams-notification.show {
                transform: translateX(0);
            }
            
            .teams-notification.success {
                border-left: 4px solid var(--success-color);
            }
            
            .teams-notification.info {
                border-left: 4px solid var(--primary-color);
            }
            
            .teams-notification i {
                font-size: 1.2rem;
            }
            
            .teams-notification.success i {
                color: var(--success-color);
            }
            
            .teams-notification.info i {
                color: var(--primary-color);
            }
            
            .teams-notification span {
                color: var(--text-primary);
                font-size: 0.95rem;
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
});
async function loadTeamsData() {
    try {
        const teams = await db.getTeams();
        
        const members = await db.getAllMembers();
        
        updateTeamsGrid(teams);
        
        updateMembersTable(members);
        
        updateTeamsOverview(teams, members);
        
    } catch (error) {
        console.error('Error loading teams data:', error);
    }
}

function updateTeamsGrid(teams) {
    const grid = document.querySelector('.teams-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    teams.forEach(team => {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.innerHTML = `
            <div class="team-header">
                <div class="team-icon">
                    <i class="fas fa-${getTeamIcon(team.type)}"></i>
                </div>
                <div class="team-info">
                    <h3>${team.name}</h3>
                    <p class="team-desc">${team.description}</p>
                </div>
                <div class="team-actions">
                    <button class="team-action-btn" title="Edit Team" onclick="editTeam('${team.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="team-action-btn" title="Manage Members" onclick="manageTeamMembers('${team.id}')">
                        <i class="fas fa-user-cog"></i>
                    </button>
                </div>
            </div>
            <div class="team-stats">
                <div class="team-stat">
                    <span class="stat-label">Members</span>
                    <span class="stat-value">${team.members?.length || 0}</span>
                </div>
                <div class="team-stat">
                    <span class="stat-label">Active</span>
                    <span class="stat-value">${getActiveMembersCount(team.id)}</span>
                </div>
                <div class="team-stat">
                    <span class="stat-label">Incidents</span>
                    <span class="stat-value">${getTeamIncidentsCount(team.id)}</span>
                </div>
            </div>
            <div class="team-members">
                <div class="members-list">
                    ${renderMemberAvatars(team.members)}
                </div>
                <span class="team-role">Team Lead: ${team.teamLead}</span>
            </div>
            <button class="btn btn-secondary btn-sm view-team-btn" onclick="viewTeamDetails('${team.id}')">
                <i class="fas fa-eye"></i> View Details
            </button>
        `;
        grid.appendChild(card);
    });
}

async function createNewTeam(teamData) {
    try {
        const newTeam = await db.createTeam(teamData);
        
        await db.logActivity({
            type: 'team_created',
            description: `Created new team: ${teamData.name}`,
            details: { teamId: newTeam.id }
        });

        loadTeamsData();
        
        showNotification(`Team "${teamData.name}" created successfully`, 'success');
        
    } catch (error) {
        console.error('Error creating team:', error);
        showNotification('Error creating team', 'error');
    }
}