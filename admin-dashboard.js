// Admin Dashboard JavaScript
// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
    loadNetworkOverview();
    loadUserManagement();
    loadGeoFencing();
    startRealTimeUpdates();
});


// Initialize admin dashboard
function initializeAdminDashboard() {
    // Set admin session
    const adminSession = {
        name: 'System Administrator',
        role: 'admin',
        id: 'ADMIN001',
        permissions: ['all']
    };
    localStorage.setItem('currentUser', JSON.stringify(adminSession));
    
    // Initialize navigation
    setupNavigation();
    
    // Initialize charts
    initializeCharts();
    
    // Initialize analytics charts
    initializeAnalyticsCharts();
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav item
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

// Network Overview Functions
function loadNetworkOverview() {
    loadRecentActivity();
    updateNetworkStats();
}

function loadRecentActivity() {
    const activities = [
        {
            type: 'user_joined',
            message: 'New farmer registered: Rajesh Kumar (Karnataka)',
            timestamp: '2 minutes ago',
            icon: 'fas fa-user-plus',
            status: 'success'
        },
        {
            type: 'transaction',
            message: 'Batch FB001 processed by AyurMed Manufacturing',
            timestamp: '5 minutes ago',
            icon: 'fas fa-exchange-alt',
            status: 'info'
        },
        {
            type: 'compliance',
            message: 'Quality test passed for batch TB002',
            timestamp: '12 minutes ago',
            icon: 'fas fa-shield-check',
            status: 'success'
        },
        {
            type: 'alert',
            message: 'Geo-fence violation detected in Zone 7',
            timestamp: '18 minutes ago',
            icon: 'fas fa-exclamation-triangle',
            status: 'warning'
        },
        {
            type: 'system',
            message: 'Smart contract updated: Quality validation rules',
            timestamp: '25 minutes ago',
            icon: 'fas fa-code',
            status: 'info'
        }
    ];

    const activityList = document.getElementById('recentActivityList');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${activity.status}`;
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-message">${activity.message}</p>
                <span class="activity-time">${activity.timestamp}</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

function updateNetworkStats() {
    // Simulate real-time updates
    setInterval(() => {
        const transactionCount = document.querySelector('.stat-card .stat-info h3');
        if (transactionCount) {
            const currentCount = parseInt(transactionCount.textContent.replace(',', ''));
            transactionCount.textContent = (currentCount + Math.floor(Math.random() * 5)).toLocaleString();
        }
    }, 30000); // Update every 30 seconds
}

// User Management Functions
function loadUserManagement() {
    loadUsersTable();
    loadPendingApprovals();
}

function loadUsersTable() {
    const users = [
        {
            id: 'FRM001',
            name: 'Rajesh Kumar',
            role: 'farmer',
            location: 'Karnataka, India',
            status: 'active',
            lastActive: '2 hours ago'
        },
        {
            id: 'MFG001',
            name: 'Manoj Kumar',
            role: 'manufacturer',
            location: 'Mumbai, India',
            status: 'active',
            lastActive: '30 minutes ago'
        },
        {
            id: 'LAB001',
            name: 'Dr. Priya Sharma',
            role: 'lab',
            location: 'Delhi, India',
            status: 'active',
            lastActive: '1 hour ago'
        },
        {
            id: 'CON001',
            name: 'Arjun Reddy',
            role: 'consumer',
            location: 'Hyderabad, India',
            status: 'active',
            lastActive: '15 minutes ago'
        },
        {
            id: 'FRM002',
            name: 'Sunita Devi',
            role: 'farmer',
            location: 'Rajasthan, India',
            status: 'pending',
            lastActive: 'Never'
        }
    ];

    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="user-checkbox" data-user-id="${user.id}"></td>
            <td><strong>${user.id}</strong></td>
            <td>${user.name}</td>
            <td><span class="role-badge role-${user.role}">${capitalizeFirst(user.role)}</span></td>
            <td>${user.location}</td>
            <td><span class="status-badge status-${user.status}">${capitalizeFirst(user.status)}</span></td>
            <td>${user.lastActive}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewUserDetails('${user.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editUser('${user.id}')" title="Edit User">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon ${user.status === 'active' ? 'danger' : 'success'}" 
                            onclick="toggleUserStatus('${user.id}')" 
                            title="${user.status === 'active' ? 'Suspend' : 'Activate'}">
                        <i class="fas fa-${user.status === 'active' ? 'ban' : 'check'}"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadPendingApprovals() {
    const pendingUsers = [
        {
            id: 'FRM003',
            name: 'Amit Singh',
            role: 'farmer',
            location: 'Punjab, India',
            submittedDate: '2024-01-15',
            documents: ['License', 'ID Proof', 'Land Certificate']
        },
        {
            id: 'LAB002',
            name: 'Green Labs Pvt Ltd',
            role: 'lab',
            location: 'Bangalore, India',
            submittedDate: '2024-01-14',
            documents: ['Lab License', 'Accreditation', 'Insurance']
        }
    ];

    const approvalsList = document.getElementById('pendingApprovalsList');
    approvalsList.innerHTML = '';

    pendingUsers.forEach(user => {
        const approvalItem = document.createElement('div');
        approvalItem.className = 'approval-item';
        approvalItem.innerHTML = `
            <div class="approval-info">
                <h4>${user.name}</h4>
                <p><strong>Role:</strong> ${capitalizeFirst(user.role)} | <strong>Location:</strong> ${user.location}</p>
                <p><strong>Submitted:</strong> ${user.submittedDate}</p>
                <div class="documents">
                    <strong>Documents:</strong>
                    ${user.documents.map(doc => `<span class="doc-badge">${doc}</span>`).join('')}
                </div>
            </div>
            <div class="approval-actions">
                <button class="btn btn-outline" onclick="reviewApplication('${user.id}')">
                    <i class="fas fa-eye"></i>
                    Review
                </button>
                <button class="btn btn-success" onclick="approveUser('${user.id}')">
                    <i class="fas fa-check"></i>
                    Approve
                </button>
                <button class="btn btn-danger" onclick="rejectUser('${user.id}')">
                    <i class="fas fa-times"></i>
                    Reject
                </button>
            </div>
        `;
        approvalsList.appendChild(approvalItem);
    });
}

// Geo-Location Tracking and Mapping Functions
let geoMap = null;
let trackingInterval = null;
let isTrackingActive = false;
let mapLayers = {
    zones: null,
    farmers: null,
    manufacturers: null,
    labs: null,
    heatmap: null
};

function loadGeoFencing() {
    loadZoneList();
    loadTrackingData();
    loadLocationAlerts();
}

function loadZoneList() {
    const zones = [
        {
            id: 'ZONE001',
            name: 'Western Ghats Protected Area',
            species: ['Ashwagandha', 'Brahmi', 'Turmeric'],
            area: '245.7 km²',
            status: 'active',
            compliance: '94%'
        },
        {
            id: 'ZONE002',
            name: 'Himalayan Medicinal Zone',
            species: ['Cordyceps', 'Rhodiola', 'Ginseng'],
            area: '189.3 km²',
            status: 'active',
            compliance: '87%'
        },
        {
            id: 'ZONE003',
            name: 'Rajasthan Desert Reserve',
            species: ['Aloe Vera', 'Commiphora', 'Guggul'],
            area: '156.8 km²',
            status: 'restricted',
            compliance: '98%'
        }
    ];

    const zoneList = document.getElementById('zoneList');
    zoneList.innerHTML = '';

    zones.forEach(zone => {
        const zoneItem = document.createElement('div');
        zoneItem.className = 'zone-item';
        zoneItem.innerHTML = `
            <div class="zone-header">
                <h4>${zone.name}</h4>
                <span class="zone-status status-${zone.status}">${capitalizeFirst(zone.status)}</span>
            </div>
            <div class="zone-details">
                <p><strong>Area:</strong> ${zone.area}</p>
                <p><strong>Species:</strong> ${zone.species.join(', ')}</p>
                <p><strong>Compliance:</strong> ${zone.compliance}</p>
            </div>
            <div class="zone-actions">
                <button class="btn-icon" onclick="viewZoneDetails('${zone.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" onclick="editZone('${zone.id}')" title="Edit Zone">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="toggleZoneStatus('${zone.id}')" title="Toggle Status">
                    <i class="fas fa-toggle-on"></i>
                </button>
            </div>
        `;
        zoneList.appendChild(zoneItem);
    });
}

// Chart Initialization
function initializeCharts() {
    initNetworkActivityChart();
    initParticipantChart();
}

function initNetworkActivityChart() {
    const ctx = document.getElementById('networkActivityChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
                label: 'Transactions',
                data: [45, 78, 123, 156, 189, 234],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initParticipantChart() {
    const ctx = document.getElementById('participantChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Farmers', 'Manufacturers', 'Labs', 'Consumers'],
            datasets: [{
                data: [45, 25, 15, 15],
                backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// User Management Actions
function viewUserDetails(userId) {
    showNotification(`Viewing details for user: ${userId}`, 'info');
}

function editUser(userId) {
    showNotification(`Editing user: ${userId}`, 'info');
}

function toggleUserStatus(userId) {
    showNotification(`Toggling status for user: ${userId}`, 'info');
}

function approveUser(userId) {
    showNotification(`User ${userId} approved successfully!`, 'success');
    setTimeout(() => {
        loadPendingApprovals(); // Refresh the list
    }, 1000);
}

function rejectUser(userId) {
    showNotification(`User ${userId} application rejected`, 'warning');
    setTimeout(() => {
        loadPendingApprovals(); // Refresh the list
    }, 1000);
}

// Geo-Fencing Actions
function createNewZone() {
    showNotification('Opening zone creation interface...', 'info');
}

function viewZoneDetails(zoneId) {
    showNotification(`Viewing details for zone: ${zoneId}`, 'info');
}

function editZone(zoneId) {
    showNotification(`Editing zone: ${zoneId}`, 'info');
}

function toggleZoneStatus(zoneId) {
    showNotification(`Toggling status for zone: ${zoneId}`, 'info');
}

// System Functions
function exportSystemReport() {
    showNotification('Generating system report...', 'info');
}

function showEmergencyPanel() {
    showNotification('Emergency panel activated!', 'warning');
}

function exportUserList() {
    showNotification('Exporting user list...', 'info');
}

function showAddUserModal() {
    showNotification('Opening add user modal...', 'info');
}

// Profile and Settings Functions
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    const chevron = document.querySelector('.user-avatar i');
    
    dropdown.classList.toggle('show');
    
    if (dropdown.classList.contains('show')) {
        chevron.style.transform = 'rotate(180deg)';
    } else {
        chevron.style.transform = 'rotate(0deg)';
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu')) {
            dropdown.classList.remove('show');
            chevron.style.transform = 'rotate(0deg)';
        }
    });
}

function showProfile() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
        const chevron = document.querySelector('.user-avatar i');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
    showModal('adminProfileModal');
}

function showSettings() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
        const chevron = document.querySelector('.user-avatar i');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
    showModal('systemSettingsModal');
}

function showAuditLogs() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
        const chevron = document.querySelector('.user-avatar i');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
    showModal('auditLogsModal');
    loadAuditLogs();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userSession');
        localStorage.removeItem('adminSettings');
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
    }
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
        const chevron = document.querySelector('.user-avatar i');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
}

// Real-time Updates
function startRealTimeUpdates() {
    // Simulate real-time network status updates
    setInterval(() => {
        loadRecentActivity();
    }, 60000); // Update every minute
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Modal Management Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Settings Tab Management
function showSettingsTab(tabName) {
    // Hide all panels
    document.querySelectorAll('.settings-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected panel
    const panel = document.getElementById(tabName + '-settings');
    if (panel) {
        panel.classList.add('active');
    }
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Save System Settings
function saveSystemSettings() {
    const settings = {
        general: {
            systemName: document.querySelector('#general-settings input[type="text"]').value,
            timeZone: document.querySelector('#general-settings select').value,
            language: document.querySelectorAll('#general-settings select')[1].value,
            autoRefresh: document.querySelectorAll('#general-settings select')[2].value
        },
        blockchain: {
            networkType: document.querySelector('#blockchain-settings select').value,
            blockTime: document.querySelector('#blockchain-settings input[type="number"]').value,
            gasLimit: document.querySelectorAll('#blockchain-settings input[type="number"]')[1].value,
            consensus: document.querySelectorAll('#blockchain-settings select')[1].value
        },
        security: {
            sessionTimeout: document.querySelector('#security-settings input[type="number"]').value,
            maxLoginAttempts: document.querySelectorAll('#security-settings input[type="number"]')[1].value,
            passwordPolicy: document.querySelector('#security-settings select').value,
            ipWhitelist: document.querySelector('#security-settings textarea').value
        },
        notifications: {
            nodeDown: document.getElementById('nodeDown').checked,
            highLoad: document.getElementById('highLoad').checked,
            newUsers: document.getElementById('newUsers').checked,
            suspiciousActivity: document.getElementById('suspiciousActivity').checked
        }
    };
    
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('System settings saved successfully!', 'success');
    closeModal('systemSettingsModal');
}

// Load Audit Logs
function loadAuditLogs() {
    const auditLogs = [
        {
            timestamp: '2024-01-15 14:32:15',
            user: 'ADMIN001',
            action: 'User Login',
            resource: 'Admin Dashboard',
            ipAddress: '192.168.1.100',
            status: 'Success',
            details: 'Successful admin login'
        },
        {
            timestamp: '2024-01-15 14:28:42',
            user: 'FRM001',
            action: 'Batch Submission',
            resource: 'Herb Batch ASH-2024-089',
            ipAddress: '203.192.45.67',
            status: 'Success',
            details: 'Ashwagandha batch submitted for approval'
        },
        {
            timestamp: '2024-01-15 14:25:18',
            user: 'MFG001',
            action: 'QR Code Generation',
            resource: 'Product PRD-2024-156',
            ipAddress: '172.16.0.45',
            status: 'Success',
            details: 'Generated 500 QR codes for product batch'
        },
        {
            timestamp: '2024-01-15 14:22:03',
            user: 'LAB001',
            action: 'Quality Test',
            resource: 'Batch TB-2024-067',
            ipAddress: '10.0.0.23',
            status: 'Success',
            details: 'Quality test completed - Grade A'
        },
        {
            timestamp: '2024-01-15 14:18:45',
            user: 'UNKNOWN',
            action: 'Failed Login',
            resource: 'Admin Dashboard',
            ipAddress: '45.123.67.89',
            status: 'Failed',
            details: 'Multiple failed login attempts detected'
        },
        {
            timestamp: '2024-01-15 14:15:22',
            user: 'ADMIN001',
            action: 'User Management',
            resource: 'User FRM002',
            ipAddress: '192.168.1.100',
            status: 'Success',
            details: 'User account suspended for policy violation'
        },
        {
            timestamp: '2024-01-15 14:12:08',
            user: 'SYS001',
            action: 'System Update',
            resource: 'Blockchain Network',
            ipAddress: '127.0.0.1',
            status: 'Success',
            details: 'Smart contract updated - version 2.1.3'
        },
        {
            timestamp: '2024-01-15 14:08:33',
            user: 'FRM003',
            action: 'Geo-fence Violation',
            resource: 'Zone ZONE001',
            ipAddress: '203.145.78.92',
            status: 'Warning',
            details: 'Harvesting detected outside approved zone'
        }
    ];
    
    const tbody = document.getElementById('auditTableBody');
    tbody.innerHTML = '';
    
    auditLogs.forEach(log => {
        const row = document.createElement('tr');
        row.className = `audit-row status-${log.status.toLowerCase()}`;
        row.innerHTML = `
            <td>${log.timestamp}</td>
            <td><strong>${log.user}</strong></td>
            <td>${log.action}</td>
            <td>${log.resource}</td>
            <td>${log.ipAddress}</td>
            <td><span class="status-badge status-${log.status.toLowerCase()}">${log.status}</span></td>
            <td>
                <button class="btn-icon" onclick="viewAuditDetails('${log.timestamp}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewAuditDetails(timestamp) {
    showNotification(`Viewing audit details for ${timestamp}`, 'info');
}

// Utility Functions
// Interactive Map Initialization
function initializeMap() {
    const mapContainer = document.getElementById('geoMap');
    const placeholder = document.getElementById('mapPlaceholder');
    
    // Hide placeholder and show map
    placeholder.style.display = 'none';
    
    // Create map container div if it doesn't exist
    let mapDiv = document.getElementById('leafletMap');
    if (!mapDiv) {
        mapDiv = document.createElement('div');
        mapDiv.id = 'leafletMap';
        mapDiv.style.width = '100%';
        mapDiv.style.height = '100%';
        mapDiv.style.minHeight = '500px';
        mapContainer.appendChild(mapDiv);
    }
    
    // Initialize Leaflet map centered on India
    geoMap = L.map('leafletMap').setView([20.5937, 78.9629], 5);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(geoMap);
    
    // Initialize map layers
    initializeMapLayers();
    
    // Load initial data
    loadMapData();
    
    showNotification('Interactive map initialized successfully!', 'success');
}

function initializeMapLayers() {
    // Initialize layer groups
    mapLayers.zones = L.layerGroup().addTo(geoMap);
    mapLayers.farmers = L.layerGroup().addTo(geoMap);
    mapLayers.manufacturers = L.layerGroup().addTo(geoMap);
    mapLayers.labs = L.layerGroup().addTo(geoMap);
}

function loadMapData() {
    loadGeoFencingZones();
    loadFarmersLocations();
    loadManufacturersLocations();
    loadLabsLocations();
}

function loadGeoFencingZones() {
    const zones = [
        {
            id: 'ZONE001',
            name: 'Western Ghats Protected Area',
            coordinates: [[11.5, 75.5], [12.5, 76.5], [11.8, 77.0], [11.2, 76.0]],
            center: [11.85, 76.25],
            status: 'active',
            compliance: '94%'
        },
        {
            id: 'ZONE002',
            name: 'Himalayan Medicinal Zone',
            coordinates: [[30.0, 78.0], [31.0, 79.0], [30.5, 79.5], [29.5, 78.5]],
            center: [30.25, 78.75],
            status: 'active',
            compliance: '87%'
        },
        {
            id: 'ZONE003',
            name: 'Rajasthan Desert Reserve',
            coordinates: [[26.0, 72.0], [27.0, 73.0], [26.5, 73.5], [25.5, 72.5]],
            center: [26.25, 72.75],
            status: 'restricted',
            compliance: '98%'
        }
    ];
    
    zones.forEach(zone => {
        // Create polygon for zone
        const polygon = L.polygon(zone.coordinates, {
            color: zone.status === 'active' ? '#22c55e' : zone.status === 'restricted' ? '#f59e0b' : '#ef4444',
            fillColor: zone.status === 'active' ? '#22c55e' : zone.status === 'restricted' ? '#f59e0b' : '#ef4444',
            fillOpacity: 0.2,
            weight: 2
        }).addTo(mapLayers.zones);
        
        // Add popup with zone information
        polygon.bindPopup(`
            <div class="map-popup">
                <h4>${zone.name}</h4>
                <p><strong>Status:</strong> ${zone.status}</p>
                <p><strong>Compliance:</strong> ${zone.compliance}</p>
                <button onclick="viewZoneDetails('${zone.id}')" class="btn btn-sm btn-primary">View Details</button>
            </div>
        `);
        
        // Add zone marker at center
        const marker = L.marker(zone.center, {
            icon: L.divIcon({
                className: 'zone-marker',
                html: `<div class="zone-icon ${zone.status}"><i class="fas fa-shield-alt"></i></div>`,
                iconSize: [30, 30]
            })
        }).addTo(mapLayers.zones);
        
        marker.bindPopup(`
            <div class="map-popup">
                <h4>${zone.name}</h4>
                <p><strong>Zone ID:</strong> ${zone.id}</p>
                <p><strong>Status:</strong> ${zone.status}</p>
                <p><strong>Compliance:</strong> ${zone.compliance}</p>
            </div>
        `);
    });
}

function loadFarmersLocations() {
    const farmers = [
        { id: 'FRM001', name: 'Rajesh Kumar', lat: 12.9716, lng: 77.5946, status: 'active', lastUpdate: '2 min ago' },
        { id: 'FRM002', name: 'Sunita Devi', lat: 26.9124, lng: 75.7873, status: 'active', lastUpdate: '5 min ago' },
        { id: 'FRM003', name: 'Amit Singh', lat: 30.7333, lng: 76.7794, status: 'offline', lastUpdate: '2 hours ago' },
        { id: 'FRM004', name: 'Priya Sharma', lat: 11.0168, lng: 76.9558, status: 'active', lastUpdate: '1 min ago' },
        { id: 'FRM005', name: 'Ravi Patel', lat: 23.0225, lng: 72.5714, status: 'active', lastUpdate: '3 min ago' }
    ];
    
    farmers.forEach(farmer => {
        const marker = L.marker([farmer.lat, farmer.lng], {
            icon: L.divIcon({
                className: 'farmer-marker',
                html: `<div class="farmer-icon ${farmer.status}"><i class="fas fa-tractor"></i></div>`,
                iconSize: [25, 25]
            })
        }).addTo(mapLayers.farmers);
        
        marker.bindPopup(`
            <div class="map-popup">
                <h4>${farmer.name}</h4>
                <p><strong>ID:</strong> ${farmer.id}</p>
                <p><strong>Status:</strong> ${farmer.status}</p>
                <p><strong>Last Update:</strong> ${farmer.lastUpdate}</p>
                <button onclick="trackFarmer('${farmer.id}')" class="btn btn-sm btn-primary">Track</button>
            </div>
        `);
    });
}

function loadManufacturersLocations() {
    const manufacturers = [
        { id: 'MFG001', name: 'AyurMed Manufacturing', lat: 19.0760, lng: 72.8777, status: 'active', batches: 24 },
        { id: 'MFG002', name: 'Herbal Solutions Ltd', lat: 13.0827, lng: 80.2707, status: 'active', batches: 18 },
        { id: 'MFG003', name: 'Natural Remedies Co', lat: 12.9716, lng: 77.5946, status: 'maintenance', batches: 0 }
    ];
    
    manufacturers.forEach(manufacturer => {
        const marker = L.marker([manufacturer.lat, manufacturer.lng], {
            icon: L.divIcon({
                className: 'manufacturer-marker',
                html: `<div class="manufacturer-icon ${manufacturer.status}"><i class="fas fa-industry"></i></div>`,
                iconSize: [25, 25]
            })
        }).addTo(mapLayers.manufacturers);
        
        marker.bindPopup(`
            <div class="map-popup">
                <h4>${manufacturer.name}</h4>
                <p><strong>ID:</strong> ${manufacturer.id}</p>
                <p><strong>Status:</strong> ${manufacturer.status}</p>
                <p><strong>Active Batches:</strong> ${manufacturer.batches}</p>
                <button onclick="viewManufacturerDetails('${manufacturer.id}')" class="btn btn-sm btn-primary">View Details</button>
            </div>
        `);
    });
}

function loadLabsLocations() {
    const labs = [
        { id: 'LAB001', name: 'Quality Assurance Lab', lat: 28.7041, lng: 77.1025, status: 'active', tests: 156 },
        { id: 'LAB002', name: 'Green Labs Pvt Ltd', lat: 12.9716, lng: 77.5946, status: 'active', tests: 89 },
        { id: 'LAB003', name: 'Herbal Testing Center', lat: 22.5726, lng: 88.3639, status: 'busy', tests: 234 }
    ];
    
    labs.forEach(lab => {
        const marker = L.marker([lab.lat, lab.lng], {
            icon: L.divIcon({
                className: 'lab-marker',
                html: `<div class="lab-icon ${lab.status}"><i class="fas fa-flask"></i></div>`,
                iconSize: [25, 25]
            })
        }).addTo(mapLayers.labs);
        
        marker.bindPopup(`
            <div class="map-popup">
                <h4>${lab.name}</h4>
                <p><strong>ID:</strong> ${lab.id}</p>
                <p><strong>Status:</strong> ${lab.status}</p>
                <p><strong>Active Tests:</strong> ${lab.tests}</p>
                <button onclick="viewLabDetails('${lab.id}')" class="btn btn-sm btn-primary">View Details</button>
            </div>
        `);
    });
}

// Map Control Functions
function changeMapView(viewType) {
    if (!geoMap) return;
    
    // Remove existing tile layers
    geoMap.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
            geoMap.removeLayer(layer);
        }
    });
    
    let tileUrl = '';
    switch(viewType) {
        case 'satellite':
            tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
            break;
        case 'terrain':
            tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
            break;
        case 'hybrid':
            tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
            break;
        default:
            tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
    
    L.tileLayer(tileUrl, {
        attribution: '© Map contributors'
    }).addTo(geoMap);
    
    showNotification(`Map view changed to ${viewType}`, 'info');
}

function toggleRealTimeTracking() {
    const trackingBtn = document.getElementById('trackingBtn');
    
    if (!isTrackingActive) {
        // Start tracking
        isTrackingActive = true;
        trackingBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Tracking';
        trackingBtn.classList.add('active');
        
        trackingInterval = setInterval(() => {
            updateRealTimeLocations();
        }, 5000); // Update every 5 seconds
        
        showNotification('Real-time tracking started', 'success');
    } else {
        // Stop tracking
        isTrackingActive = false;
        trackingBtn.innerHTML = '<i class="fas fa-satellite-dish"></i> Start Tracking';
        trackingBtn.classList.remove('active');
        
        if (trackingInterval) {
            clearInterval(trackingInterval);
        }
        
        showNotification('Real-time tracking stopped', 'info');
    }
}

function updateRealTimeLocations() {
    // Simulate real-time location updates
    const farmers = document.querySelectorAll('.farmer-marker');
    farmers.forEach(marker => {
        // Add subtle animation to show activity
        marker.style.animation = 'pulse 1s ease-in-out';
        setTimeout(() => {
            marker.style.animation = '';
        }, 1000);
    });
    
    // Update tracking statistics
    updateTrackingStats();
}

function updateTrackingStats() {
    const activeFarmers = document.getElementById('activeFarmers');
    const activeVehicles = document.getElementById('activeVehicles');
    const activeBatches = document.getElementById('activeBatches');
    
    if (activeFarmers) {
        const currentCount = parseInt(activeFarmers.textContent);
        activeFarmers.textContent = currentCount + Math.floor(Math.random() * 3) - 1;
    }
    
    if (activeVehicles) {
        const currentCount = parseInt(activeVehicles.textContent);
        activeVehicles.textContent = Math.max(0, currentCount + Math.floor(Math.random() * 2) - 1);
    }
    
    if (activeBatches) {
        const currentCount = parseInt(activeBatches.textContent);
        activeBatches.textContent = currentCount + Math.floor(Math.random() * 5) - 2;
    }
}

// Layer Toggle Functions
function toggleZoneVisibility() {
    const btn = document.getElementById('zonesBtn');
    if (geoMap && mapLayers.zones) {
        if (geoMap.hasLayer(mapLayers.zones)) {
            geoMap.removeLayer(mapLayers.zones);
            btn.classList.remove('active');
        } else {
            geoMap.addLayer(mapLayers.zones);
            btn.classList.add('active');
        }
    }
}

function toggleFarmersLayer() {
    const btn = document.getElementById('farmersBtn');
    if (geoMap && mapLayers.farmers) {
        if (geoMap.hasLayer(mapLayers.farmers)) {
            geoMap.removeLayer(mapLayers.farmers);
            btn.classList.remove('active');
        } else {
            geoMap.addLayer(mapLayers.farmers);
            btn.classList.add('active');
        }
    }
}

function toggleManufacturersLayer() {
    const btn = document.getElementById('manufacturersBtn');
    if (geoMap && mapLayers.manufacturers) {
        if (geoMap.hasLayer(mapLayers.manufacturers)) {
            geoMap.removeLayer(mapLayers.manufacturers);
            btn.classList.remove('active');
        } else {
            geoMap.addLayer(mapLayers.manufacturers);
            btn.classList.add('active');
        }
    }
}

function toggleLabsLayer() {
    const btn = document.getElementById('labsBtn');
    if (geoMap && mapLayers.labs) {
        if (geoMap.hasLayer(mapLayers.labs)) {
            geoMap.removeLayer(mapLayers.labs);
            btn.classList.remove('active');
        } else {
            geoMap.addLayer(mapLayers.labs);
            btn.classList.add('active');
        }
    }
}

// Analysis Functions
function showHeatmap() {
    if (!geoMap) return;
    
    // Simulate heatmap data
    const heatmapData = [
        [12.9716, 77.5946, 0.8], // Bangalore
        [19.0760, 72.8777, 0.6], // Mumbai
        [28.7041, 77.1025, 0.9], // Delhi
        [13.0827, 80.2707, 0.7], // Chennai
        [22.5726, 88.3639, 0.5]  // Kolkata
    ];
    
    // Create heatmap overlay (simplified visualization)
    heatmapData.forEach(point => {
        const circle = L.circle([point[0], point[1]], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: point[2] * 0.5,
            radius: point[2] * 50000
        }).addTo(geoMap);
        
        circle.bindPopup(`Activity Level: ${(point[2] * 100).toFixed(0)}%`);
    });
    
    showNotification('Activity heatmap displayed', 'info');
}

function showRouteAnalysis() {
    if (!geoMap) return;
    
    // Sample route data
    const routes = [
        {
            name: 'Karnataka → Bangalore',
            coordinates: [[12.2958, 76.6394], [12.9716, 77.5946]],
            color: '#22c55e',
            efficiency: '94%'
        },
        {
            name: 'Tamil Nadu → Chennai',
            coordinates: [[11.1271, 78.6569], [13.0827, 80.2707]],
            color: '#3b82f6',
            efficiency: '97%'
        },
        {
            name: 'Kerala → Kochi',
            coordinates: [[10.8505, 76.2711], [9.9312, 76.2673]],
            color: '#f59e0b',
            efficiency: '87%'
        }
    ];
    
    routes.forEach(route => {
        const polyline = L.polyline(route.coordinates, {
            color: route.color,
            weight: 4,
            opacity: 0.8
        }).addTo(geoMap);
        
        polyline.bindPopup(`
            <div class="map-popup">
                <h4>${route.name}</h4>
                <p><strong>Efficiency:</strong> ${route.efficiency}</p>
            </div>
        `);
    });
    
    showNotification('Supply chain routes displayed', 'info');
}

function exportMapData() {
    showNotification('Exporting map data...', 'info');
    
    // Simulate export functionality
    setTimeout(() => {
        showNotification('Map data exported successfully!', 'success');
    }, 2000);
}

// Tab Management Functions
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    
    // Add active class to clicked tab button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Load tracking and alert data
function loadTrackingData() {
    const trackingItems = [
        {
            id: 'TRK001',
            type: 'farmer',
            name: 'Rajesh Kumar',
            location: 'Mysore, Karnataka',
            status: 'harvesting',
            lastUpdate: '2 min ago',
            coordinates: [12.2958, 76.6394]
        },
        {
            id: 'TRK002',
            type: 'vehicle',
            name: 'Transport Vehicle #247',
            location: 'En route to Bangalore',
            status: 'in_transit',
            lastUpdate: '1 min ago',
            coordinates: [12.5, 77.0]
        },
        {
            id: 'TRK003',
            type: 'batch',
            name: 'Batch TB002',
            location: 'Quality Lab, Delhi',
            status: 'testing',
            lastUpdate: '5 min ago',
            coordinates: [28.7041, 77.1025]
        }
    ];
    
    const trackingList = document.getElementById('trackingList');
    if (trackingList) {
        trackingList.innerHTML = '';
        
        trackingItems.forEach(item => {
            const trackingItem = document.createElement('div');
            trackingItem.className = 'tracking-item';
            trackingItem.innerHTML = `
                <div class="tracking-info">
                    <div class="tracking-header">
                        <h5>${item.name}</h5>
                        <span class="tracking-status ${item.status}">${item.status.replace('_', ' ')}</span>
                    </div>
                    <p class="tracking-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${item.location}
                    </p>
                    <p class="tracking-time">Last update: ${item.lastUpdate}</p>
                </div>
                <div class="tracking-actions">
                    <button class="btn-icon" onclick="focusOnLocation(${item.coordinates[0]}, ${item.coordinates[1]})" title="Show on Map">
                        <i class="fas fa-crosshairs"></i>
                    </button>
                </div>
            `;
            trackingList.appendChild(trackingItem);
        });
    }
}

function loadLocationAlerts() {
    const alerts = [
        {
            id: 'ALT001',
            type: 'geofence',
            title: 'Geo-fence Violation',
            message: 'Farmer FRM003 detected outside authorized zone',
            severity: 'high',
            timestamp: '5 min ago',
            location: 'Zone 7, Western Ghats'
        },
        {
            id: 'ALT002',
            type: 'route',
            title: 'Route Deviation',
            message: 'Transport vehicle #247 deviated from planned route',
            severity: 'medium',
            timestamp: '12 min ago',
            location: 'Highway NH-48'
        },
        {
            id: 'ALT003',
            type: 'delay',
            title: 'Delivery Delay',
            message: 'Batch TB002 delayed by 2 hours at checkpoint',
            severity: 'low',
            timestamp: '25 min ago',
            location: 'Chennai Processing Center'
        }
    ];
    
    const alertList = document.getElementById('alertList');
    if (alertList) {
        alertList.innerHTML = '';
        
        alerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${alert.severity}`;
            alertItem.innerHTML = `
                <div class="alert-icon">
                    <i class="fas fa-${alert.type === 'geofence' ? 'shield-alt' : alert.type === 'route' ? 'route' : 'clock'}"></i>
                </div>
                <div class="alert-content">
                    <h5>${alert.title}</h5>
                    <p>${alert.message}</p>
                    <div class="alert-meta">
                        <span class="alert-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${alert.location}
                        </span>
                        <span class="alert-time">${alert.timestamp}</span>
                    </div>
                </div>
                <div class="alert-actions">
                    <button class="btn-icon" onclick="resolveAlert('${alert.id}')" title="Resolve">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            `;
            alertList.appendChild(alertItem);
        });
    }
}

// Additional tracking functions
function focusOnLocation(lat, lng) {
    if (geoMap) {
        geoMap.setView([lat, lng], 12);
        showNotification('Map focused on location', 'info');
    }
}

function trackFarmer(farmerId) {
    showNotification(`Tracking farmer ${farmerId}`, 'info');
}

function viewManufacturerDetails(manufacturerId) {
    showNotification(`Viewing manufacturer details: ${manufacturerId}`, 'info');
}

function viewLabDetails(labId) {
    showNotification(`Viewing lab details: ${labId}`, 'info');
}

function resolveAlert(alertId) {
    showNotification(`Alert ${alertId} resolved`, 'success');
    setTimeout(() => {
        loadLocationAlerts(); // Refresh alerts
    }, 1000);
}

function filterAlerts(type) {
    const alerts = document.querySelectorAll('.alert-item');
    alerts.forEach(alert => {
        if (type === 'all') {
            alert.style.display = 'flex';
        } else {
            const alertType = alert.querySelector('.alert-icon i').className;
            const shouldShow = (
                (type === 'geofence' && alertType.includes('shield-alt')) ||
                (type === 'route' && alertType.includes('route')) ||
                (type === 'delay' && alertType.includes('clock')) ||
                (type === 'unauthorized' && alertType.includes('ban'))
            );
            alert.style.display = shouldShow ? 'flex' : 'none';
        }
    });
}

function refreshLocationData() {
    showNotification('Refreshing location data...', 'info');
    
    if (geoMap) {
        // Clear existing data
        Object.values(mapLayers).forEach(layer => {
            if (layer) layer.clearLayers();
        });
        
        // Reload data
        loadMapData();
        loadTrackingData();
        loadLocationAlerts();
    }
    
    setTimeout(() => {
        showNotification('Location data refreshed successfully!', 'success');
    }, 1500);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize Charts Function
function initializeCharts() {
    // Network Activity Chart
    const networkActivityCtx = document.getElementById('networkActivityChart');
    if (networkActivityCtx) {
        new Chart(networkActivityCtx, {
            type: 'line',
            data: {
                labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'],
                datasets: [{
                    label: 'Transactions',
                    data: [120, 180, 350, 480, 620, 450, 280],
                    borderColor: '#4a90e2',
                    backgroundColor: 'rgba(74, 144, 226, 0.15)',
                    borderWidth: 3,
                    pointBackgroundColor: '#4a90e2',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Active Users',
                    data: [45, 65, 120, 180, 220, 165, 95],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    borderWidth: 3,
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4a90e2',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 700,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.08)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#6b7280',
                            padding: 10
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#6b7280',
                            padding: 10
                        }
                    }
                }
            }
        });
    }

    // Participant Distribution Chart
    const participantCtx = document.getElementById('participantChart');
    if (participantCtx) {
        new Chart(participantCtx, {
            type: 'doughnut',
            data: {
                labels: ['Farmers', 'Manufacturers', 'Labs', 'Consumers'],
                datasets: [{
                    data: [485, 156, 89, 517],
                    backgroundColor: [
                        '#4a90e2',
                        '#22c55e', 
                        '#f59e0b',
                        '#8b5cf6'
                    ],
                    borderWidth: 4,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 6,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 25,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4a90e2',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed * 100) / total).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500
                }
            }
        });
    }
}

// Initialize Analytics Charts Function
function initializeAnalyticsCharts() {
    // Transaction Volume Chart
    const transactionVolumeCtx = document.getElementById('transactionVolumeChart');
    if (transactionVolumeCtx) {
        new Chart(transactionVolumeCtx, {
            type: 'bar',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{
                    label: 'Transaction Volume',
                    data: [2400, 3200, 4800, 6200, 5400, 3800, 2900],
                    backgroundColor: [
                        'rgba(74, 144, 226, 0.8)',
                        'rgba(74, 144, 226, 0.8)',
                        'rgba(74, 144, 226, 0.8)',
                        'rgba(74, 144, 226, 0.9)',
                        'rgba(74, 144, 226, 0.8)',
                        'rgba(74, 144, 226, 0.7)',
                        'rgba(74, 144, 226, 0.7)'
                    ],
                    borderColor: '#4a90e2',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                    hoverBackgroundColor: 'rgba(74, 144, 226, 1)',
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4a90e2',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Transactions: ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 7000,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.08)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#6b7280',
                            padding: 10,
                            callback: function(value) {
                                return value >= 1000 ? (value/1000) + 'k' : value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#6b7280',
                            padding: 10
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart');
    if (userGrowthCtx) {
        new Chart(userGrowthCtx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'New Users',
                    data: [145, 189, 267, 356, 445, 578, 689],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    borderWidth: 3,
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#22c55e',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `New Users: ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 800,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.08)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#6b7280',
                            padding: 10
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#6b7280',
                            padding: 10
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Geographic Distribution Chart
    const geoDistributionCtx = document.getElementById('geoDistributionChart');
    if (geoDistributionCtx) {
        new Chart(geoDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Maharashtra', 'Gujarat', 'Others'],
                datasets: [{
                    data: [28, 22, 18, 16, 11, 5],
                    backgroundColor: [
                        '#4a90e2',
                        '#22c55e',
                        '#f59e0b',
                        '#8b5cf6',
                        '#ef4444',
                        '#6b7280'
                    ],
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 4,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4a90e2',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed * 100) / total).toFixed(1);
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500
                }
            }
        });
    }

    // Supply Chain Efficiency Chart
    const efficiencyCtx = document.getElementById('efficiencyChart');
    if (efficiencyCtx) {
        new Chart(efficiencyCtx, {
            type: 'radar',
            data: {
                labels: ['Farm Collection', 'Processing', 'Quality Testing', 'Manufacturing', 'Distribution', 'Retail'],
                datasets: [{
                    label: 'Current Efficiency',
                    data: [88, 94, 91, 96, 82, 85],
                    borderColor: '#4a90e2',
                    backgroundColor: 'rgba(74, 144, 226, 0.25)',
                    pointBackgroundColor: '#4a90e2',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    borderWidth: 3
                }, {
                    label: 'Target Efficiency',
                    data: [95, 98, 96, 99, 90, 92],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    borderWidth: 3,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4a90e2',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.r}%`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 70,
                        max: 100,
                        ticks: {
                            stepSize: 5,
                            font: {
                                size: 10
                            },
                            color: '#6b7280',
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            lineWidth: 1
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            lineWidth: 1
                        },
                        pointLabels: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#374151'
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}
