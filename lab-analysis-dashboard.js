// Lab Analysis Dashboard JavaScript

// Global variables
let batchesData = [];
let testingData = [];
let lossReports = [];
let labReports = [];
let currentUser = null;


// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadSampleData();
    setupEventListeners();
    initializeCharts();
});

// Initialize dashboard
function initializeDashboard() {
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'Dr. Priya Patel',
        role: 'lab-analysis',
        email: 'demo.lab-analysis@ayurtrace.com'
    };
    
    // Set active section
    showSection('batches');
    
    // Load user settings
    loadUserSettings();
}

// Load sample data
function loadSampleData() {
    // Sample batches data
    batchesData = [
        {
            id: 'LAB001',
            batchId: 'MFG-2024-001',
            manufacturer: 'AyurMed Pharmaceuticals',
            productType: 'Ashwagandha Capsules',
            quantity: '500 units',
            receivedDate: '2024-01-15',
            status: 'pending',
            priority: 'high'
        },
        {
            id: 'LAB002',
            batchId: 'MFG-2024-002',
            manufacturer: 'Herbal Solutions Ltd',
            productType: 'Turmeric Extract',
            quantity: '2.5 kg',
            receivedDate: '2024-01-14',
            status: 'testing',
            priority: 'normal'
        },
        {
            id: 'LAB003',
            batchId: 'MFG-2024-003',
            manufacturer: 'Natural Wellness Co',
            productType: 'Brahmi Tablets',
            quantity: '1000 units',
            receivedDate: '2024-01-13',
            status: 'completed',
            priority: 'normal'
        },
        {
            id: 'LAB004',
            batchId: 'MFG-2024-004',
            manufacturer: 'Pure Ayurveda',
            productType: 'Triphala Powder',
            quantity: '5 kg',
            receivedDate: '2024-01-12',
            status: 'failed',
            priority: 'urgent'
        }
    ];

    // Sample testing data
    testingData = [
        {
            id: 'TEST001',
            batchId: 'MFG-2024-001',
            testType: 'Purity Testing',
            status: 'in-progress',
            startDate: '2024-01-15',
            estimatedCompletion: '2024-01-18',
            progress: 60
        },
        {
            id: 'TEST002',
            batchId: 'MFG-2024-002',
            testType: 'Contamination Test',
            status: 'in-progress',
            startDate: '2024-01-14',
            estimatedCompletion: '2024-01-16',
            progress: 80
        }
    ];

    // Sample loss reports
    lossReports = [
        {
            id: 'LOSS001',
            type: 'contamination',
            quantity: 50,
            value: 15000,
            method: 'destroy',
            description: 'Microbial contamination detected',
            date: '2024-01-10',
            status: 'processed'
        },
        {
            id: 'LOSS002',
            type: 'expired',
            quantity: 25,
            value: 8500,
            method: 'recycle',
            description: 'Products past expiry date',
            date: '2024-01-08',
            status: 'pending'
        }
    ];

    // Sample lab reports
    labReports = [
        {
            id: 'RPT001',
            batchId: 'MFG-2024-003',
            product: 'Brahmi Tablets',
            testType: 'Purity Analysis',
            purity: 96.5,
            status: 'approved',
            generatedDate: '2024-01-13'
        },
        {
            id: 'RPT002',
            batchId: 'MFG-2024-005',
            product: 'Neem Extract',
            testType: 'Contamination Test',
            purity: 94.2,
            status: 'pending',
            generatedDate: '2024-01-12'
        }
    ];

    // Populate tables
    populateBatchesTable();
    populateTestQueue();
    populateLossCards();
    populateReportsTable();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Search and filters
    document.getElementById('batchSearch')?.addEventListener('input', filterBatches);
    document.getElementById('statusFilter')?.addEventListener('change', filterBatches);

    // Form submissions
    document.getElementById('lossReportForm')?.addEventListener('submit', handleLossReportSubmission);

    // File upload
    document.getElementById('lossProof')?.addEventListener('change', handleFileUpload);
}

// Show section
function showSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    // Update title
    const titles = {
        'batches': 'Batches Received from Manufacturer',
        'testing': 'Medicine & Product Testing',
        'loss-report': 'Loss Report & Defective Product Recycling',
        'lab-reports': 'Lab Report Submission - Product Purity',
        'analytics': 'Quality Analytics Dashboard',
        'certification': 'Certification & Compliance'
    };
    document.getElementById('section-title').textContent = titles[sectionId];
}

// Populate batches table
function populateBatchesTable() {
    const tbody = document.getElementById('batchesTableBody');
    if (!tbody) return;

    tbody.innerHTML = batchesData.map(batch => `
        <tr>
            <td><input type="checkbox" class="batch-checkbox" data-id="${batch.id}"></td>
            <td>${batch.batchId}</td>
            <td>${batch.manufacturer}</td>
            <td>${batch.productType}</td>
            <td>${batch.quantity}</td>
            <td>${batch.receivedDate}</td>
            <td><span class="status-badge ${batch.status}">${batch.status}</span></td>
            <td><span class="priority-badge ${batch.priority}">${batch.priority}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewBatchDetails('${batch.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="processBatch('${batch.id}')">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="rejectBatch('${batch.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Populate test queue
function populateTestQueue() {
    const container = document.getElementById('testQueue');
    if (!container) return;

    container.innerHTML = testingData.map(test => `
        <div class="test-item">
            <div class="test-info">
                <h4>Batch: ${test.batchId}</h4>
                <p>${test.testType}</p>
                <div class="test-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${test.progress}%"></div>
                    </div>
                    <span>${test.progress}%</span>
                </div>
            </div>
            <div class="test-actions">
                <span class="test-status ${test.status}">${test.status}</span>
                <button class="btn btn-sm btn-primary" onclick="viewTestDetails('${test.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Populate loss cards
function populateLossCards() {
    const container = document.getElementById('lossCards');
    if (!container) return;

    container.innerHTML = lossReports.map(loss => `
        <div class="loss-card">
            <div class="loss-header">
                <h4>Loss Report #${loss.id}</h4>
                <span class="loss-status ${loss.status}">${loss.status}</span>
            </div>
            <div class="loss-details">
                <p><strong>Type:</strong> ${loss.type}</p>
                <p><strong>Quantity:</strong> ${loss.quantity} units</p>
                <p><strong>Value:</strong> ₹${loss.value.toLocaleString()}</p>
                <p><strong>Method:</strong> ${loss.method}</p>
                <p><strong>Date:</strong> ${loss.date}</p>
            </div>
            <div class="loss-description">
                <p>${loss.description}</p>
            </div>
        </div>
    `).join('');
}

// Populate reports table
function populateReportsTable() {
    const tbody = document.getElementById('reportsTableBody');
    if (!tbody) return;

    tbody.innerHTML = labReports.map(report => `
        <tr>
            <td>${report.id}</td>
            <td>${report.batchId}</td>
            <td>${report.product}</td>
            <td>${report.testType}</td>
            <td>${report.purity}%</td>
            <td><span class="status-badge ${report.status}">${report.status}</span></td>
            <td>${report.generatedDate}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewReport('${report.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-secondary" onclick="downloadReport('${report.id}')">
                    <i class="fas fa-download"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Filter batches
function filterBatches() {
    const searchTerm = document.getElementById('batchSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    let filteredData = batchesData.filter(batch => {
        const matchesSearch = batch.batchId.toLowerCase().includes(searchTerm) ||
                            batch.manufacturer.toLowerCase().includes(searchTerm) ||
                            batch.productType.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || batch.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Update table with filtered data
    const tbody = document.getElementById('batchesTableBody');
    tbody.innerHTML = filteredData.map(batch => `
        <tr>
            <td><input type="checkbox" class="batch-checkbox" data-id="${batch.id}"></td>
            <td>${batch.batchId}</td>
            <td>${batch.manufacturer}</td>
            <td>${batch.productType}</td>
            <td>${batch.quantity}</td>
            <td>${batch.receivedDate}</td>
            <td><span class="status-badge ${batch.status}">${batch.status}</span></td>
            <td><span class="priority-badge ${batch.priority}">${batch.priority}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewBatchDetails('${batch.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="processBatch('${batch.id}')">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="rejectBatch('${batch.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Handle loss report submission
function handleLossReportSubmission(e) {
    e.preventDefault();
    
    const formData = {
        type: document.getElementById('lossType').value,
        quantity: parseInt(document.getElementById('lossQuantity').value),
        value: parseInt(document.getElementById('lossValue').value),
        method: document.getElementById('disposalMethod').value,
        description: document.getElementById('lossDescription').value,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
    };

    // Add to loss reports
    const newId = 'LOSS' + String(lossReports.length + 1).padStart(3, '0');
    lossReports.unshift({ ...formData, id: newId });

    // Reset form
    document.getElementById('lossReportForm').reset();

    // Update display
    populateLossCards();
    showNotification('Loss report submitted successfully', 'success');
}

// Handle file upload
function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    const uploadArea = document.querySelector('.file-upload-area');
    
    if (files.length > 0) {
        uploadArea.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${files.length} file(s) selected</p>
            <small>${files.map(f => f.name).join(', ')}</small>
        `;
        uploadArea.classList.add('has-files');
    }
}

// Initialize charts
function initializeCharts() {
    // Success Rate Chart
    const successCtx = document.getElementById('successRateChart');
    if (successCtx) {
        new Chart(successCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Success Rate %',
                    data: [92, 94, 91, 96, 93, 95],
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
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
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Quality Distribution Chart
    const qualityCtx = document.getElementById('qualityDistributionChart');
    if (qualityCtx) {
        new Chart(qualityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Excellent (95-100%)', 'Good (90-94%)', 'Fair (85-89%)', 'Poor (<85%)'],
                datasets: [{
                    data: [45, 35, 15, 5],
                    backgroundColor: ['#059669', '#3B82F6', '#F59E0B', '#EF4444']
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
}

// Action functions
function viewBatchDetails(id) {
    const batch = batchesData.find(b => b.id === id);
    if (batch) {
        showModal('Batch Details', `
            <div class="batch-details">
                <h3>Batch: ${batch.batchId}</h3>
                <div class="detail-grid">
                    <div><strong>Manufacturer:</strong> ${batch.manufacturer}</div>
                    <div><strong>Product:</strong> ${batch.productType}</div>
                    <div><strong>Quantity:</strong> ${batch.quantity}</div>
                    <div><strong>Received:</strong> ${batch.receivedDate}</div>
                    <div><strong>Status:</strong> <span class="status-badge ${batch.status}">${batch.status}</span></div>
                    <div><strong>Priority:</strong> <span class="priority-badge ${batch.priority}">${batch.priority}</span></div>
                </div>
            </div>
        `);
    }
}

function processBatch(id) {
    const batch = batchesData.find(b => b.id === id);
    if (batch) {
        batch.status = 'testing';
        populateBatchesTable();
        showNotification(`Batch ${batch.batchId} moved to testing`, 'success');
    }
}

function rejectBatch(id) {
    const batch = batchesData.find(b => b.id === id);
    if (batch) {
        batch.status = 'failed';
        populateBatchesTable();
        showNotification(`Batch ${batch.batchId} rejected`, 'error');
    }
}

function startPurityTest() {
    showNotification('Purity test initiated', 'success');
}

function startContaminationTest() {
    showNotification('Contamination test initiated', 'success');
}

function startPotencyTest() {
    showNotification('Potency test initiated', 'success');
}

function startSafetyTest() {
    showNotification('Safety test initiated', 'success');
}

function viewReport(id) {
    const report = labReports.find(r => r.id === id);
    if (report) {
        showModal('Lab Report', `
            <div class="report-details">
                <h3>Report: ${report.id}</h3>
                <div class="detail-grid">
                    <div><strong>Batch ID:</strong> ${report.batchId}</div>
                    <div><strong>Product:</strong> ${report.product}</div>
                    <div><strong>Test Type:</strong> ${report.testType}</div>
                    <div><strong>Purity:</strong> ${report.purity}%</div>
                    <div><strong>Status:</strong> <span class="status-badge ${report.status}">${report.status}</span></div>
                    <div><strong>Generated:</strong> ${report.generatedDate}</div>
                </div>
            </div>
        `);
    }
}

function downloadReport(id) {
    showNotification('Report downloaded successfully', 'success');
}

// Export functions
function exportBatchData() {
    showNotification('Batch data exported successfully', 'success');
}

function exportTestData() {
    showNotification('Test data exported successfully', 'success');
}

function exportLossData() {
    showNotification('Loss data exported successfully', 'success');
}

function exportReportData() {
    showNotification('Report data exported successfully', 'success');
}

function exportAnalytics() {
    showNotification('Analytics data exported successfully', 'success');
}

function exportCertifications() {
    showNotification('Certification data exported successfully', 'success');
}

// Modal functions
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Notification functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('active');
    
    if (panel.classList.contains('active')) {
        loadNotifications();
    }
}

function loadNotifications() {
    const notifications = [
        { message: 'New batch received from AyurMed Pharmaceuticals', time: '5 min ago', type: 'info' },
        { message: 'Purity test completed for Batch MFG-2024-003', time: '1 hour ago', type: 'success' },
        { message: 'Contamination detected in Batch MFG-2024-004', time: '2 hours ago', type: 'warning' }
    ];
    
    const list = document.getElementById('notificationList');
    list.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.type}">
            <div class="notification-content">
                <p>${notif.message}</p>
                <span class="notification-time">${notif.time}</span>
            </div>
        </div>
    `).join('');
}

// User menu functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function showProfileModal() {
    document.getElementById('profileModal').style.display = 'flex';
    document.getElementById('userDropdown').classList.remove('show');
}

function showSettingsModal() {
    document.getElementById('settingsModal').style.display = 'flex';
    document.getElementById('userDropdown').classList.remove('show');
}

function showHelpModal() {
    document.getElementById('helpModal').style.display = 'flex';
    document.getElementById('userDropdown').classList.remove('show');
}

function closeModal(modalId) {
    if (modalId) {
        document.getElementById(modalId).style.display = 'none';
    } else {
        // Close all modals
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => modal.style.display = 'none');
    }
}

function saveProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const profileData = Object.fromEntries(formData);
    
    // Update user data in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    Object.assign(currentUser, profileData);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI elements
    updateProfileDisplay(profileData);
    
    showNotification('Profile updated successfully!', 'success');
    closeModal('profileModal');
}

function saveSettings(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const settingsData = Object.fromEntries(formData);
    
    // Handle checkboxes
    const checkboxes = ['emailNotifications', 'smsNotifications', 'testAlerts', 'urgentAlerts', 
                       'autoSaveReports', 'requireDigitalSignature', 'profileVisibility', 'dataSharing'];
    checkboxes.forEach(checkbox => {
        settingsData[checkbox] = document.getElementById(checkbox).checked;
    });
    
    // Save settings to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settingsData));
    
    showNotification('Settings saved successfully!', 'success');
    closeModal('settingsModal');
}

function updateProfileDisplay(profileData) {
    // Update header display if needed
    const userInfo = document.querySelector('.user-info strong');
    if (userInfo && profileData.fullName) {
        userInfo.textContent = profileData.fullName;
    }
}

function changePassword() {
    // Simple password change simulation
    const newPassword = prompt('Enter new password:');
    if (newPassword && newPassword.length >= 6) {
        showNotification('Password changed successfully!', 'success');
    } else if (newPassword) {
        showNotification('Password must be at least 6 characters long!', 'error');
    }
}

// Load user settings on page load
function loadUserSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Apply notification settings
    if (settings.emailNotifications !== undefined) {
        document.getElementById('emailNotifications').checked = settings.emailNotifications;
    }
    if (settings.smsNotifications !== undefined) {
        document.getElementById('smsNotifications').checked = settings.smsNotifications;
    }
    if (settings.testAlerts !== undefined) {
        document.getElementById('testAlerts').checked = settings.testAlerts;
    }
    if (settings.urgentAlerts !== undefined) {
        document.getElementById('urgentAlerts').checked = settings.urgentAlerts;
    }
    
    // Apply dashboard preferences
    if (settings.defaultView) {
        document.getElementById('defaultView').value = settings.defaultView;
    }
    if (settings.testResultsPerPage) {
        document.getElementById('testResultsPerPage').value = settings.testResultsPerPage;
    }
    if (settings.language) {
        document.getElementById('language').value = settings.language;
    }
    
    // Apply lab settings
    if (settings.autoSaveReports !== undefined) {
        document.getElementById('autoSaveReports').checked = settings.autoSaveReports;
    }
    if (settings.requireDigitalSignature !== undefined) {
        document.getElementById('requireDigitalSignature').checked = settings.requireDigitalSignature;
    }
    if (settings.reportTemplate) {
        document.getElementById('reportTemplate').value = settings.reportTemplate;
    }
    
    // Apply privacy settings
    if (settings.profileVisibility !== undefined) {
        document.getElementById('profileVisibility').checked = settings.profileVisibility;
    }
    if (settings.dataSharing !== undefined) {
        document.getElementById('dataSharing').checked = settings.dataSharing;
    }
}

// Help and Support Functions
function showHelpTopic(topic) {
    const topics = {
        'getting-started': 'Welcome to AyurTrace Lab Analysis! This guide will help you get started with batch processing, testing procedures, and report generation.',
        'testing': 'To conduct tests: 1) Select batch from received items, 2) Choose appropriate test protocols, 3) Record results accurately, 4) Generate reports.',
        'reports': 'Lab reports include purity analysis, contamination testing, and quality certification. Use digital signatures for authentication.',
        'quality-control': 'Follow ISO 17025 standards for quality assurance. Maintain proper documentation and calibration records.'
    };
    
    alert(topics[topic] || 'Help topic not found.');
}

function openResource(resource) {
    const resources = {
        'lab-manual': '#',
        'testing-protocols': '#',
        'quality-standards': '#',
        'regulatory-guidelines': '#',
        'training-videos': '#'
    };
    
    showNotification(`Opening ${resource.replace('-', ' ')}...`, 'info');
    // In a real app, this would open the actual resource
}

// Enhanced logout function
function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Logging out...', 'info');
    setTimeout(() => {
        window.location.href = 'auth.html';
    }, 1500);
}

// Missing Functions Implementation
function exportBatchData() {
    showNotification('Preparing batch data export...', 'info');
    
    setTimeout(() => {
        const batchData = [
            'Batch ID,Manufacturer,Product Type,Quantity,Received Date,Status,Priority',
            'MFG-001,AyurMed Manufacturing,Ashwagandha Extract,50kg,2024-10-15,Testing,High',
            'MFG-002,Herbal Solutions Ltd,Turmeric Powder,75kg,2024-10-14,Completed,Medium',
            'MFG-003,Natural Remedies Inc,Brahmi Oil,30kg,2024-10-13,Pending,Low'
        ].join('\n');
        
        downloadCSV(batchData, 'lab_batch_data.csv');
        showNotification('Batch data exported successfully', 'success');
    }, 1500);
}

function showReceiveBatchModal() {
    const modalHTML = `
        <div class="modal-overlay" id="receiveBatchModal">
            <div class="modal">
                <div class="modal-header">
                    <h3>Receive New Batch</h3>
                    <button class="modal-close" onclick="closeModal('receiveBatchModal')">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="receiveBatchForm" onsubmit="submitReceiveBatch(event)">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="batchId">Batch ID</label>
                                <input type="text" id="batchId" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="manufacturer">Manufacturer</label>
                                <select id="manufacturer" class="form-input" required>
                                    <option value="">Select Manufacturer</option>
                                    <option value="AyurMed Manufacturing">AyurMed Manufacturing</option>
                                    <option value="Herbal Solutions Ltd">Herbal Solutions Ltd</option>
                                    <option value="Natural Remedies Inc">Natural Remedies Inc</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="productType">Product Type</label>
                                <input type="text" id="productType" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="quantity">Quantity</label>
                                <input type="text" id="quantity" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="receivedDate">Received Date</label>
                                <input type="date" id="receivedDate" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="priority">Priority</label>
                                <select id="priority" class="form-input" required>
                                    <option value="">Select Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" onclick="closeModal('receiveBatchModal')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Receive Batch</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('receiveBatchModal').style.display = 'flex';
}

function submitReceiveBatch(event) {
    event.preventDefault();
    
    const batchData = {
        id: document.getElementById('batchId').value,
        manufacturer: document.getElementById('manufacturer').value,
        productType: document.getElementById('productType').value,
        quantity: document.getElementById('quantity').value,
        receivedDate: document.getElementById('receivedDate').value,
        priority: document.getElementById('priority').value,
        status: 'pending'
    };
    
    closeModal('receiveBatchModal');
    showNotification(`Batch ${batchData.id} received successfully`, 'success');
}

function selectAllBatches() {
    const checkboxes = document.querySelectorAll('.batch-checkbox');
    const selectAllBtn = event.target;
    const isSelectAll = selectAllBtn.textContent === 'Select All';
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isSelectAll;
    });
    
    selectAllBtn.textContent = isSelectAll ? 'Deselect All' : 'Select All';
}

function processBulkBatches() {
    const selectedBatches = document.querySelectorAll('.batch-checkbox:checked');
    
    if (selectedBatches.length === 0) {
        showNotification('Please select batches to process', 'warning');
        return;
    }
    
    const batchIds = Array.from(selectedBatches).map(cb => cb.dataset.batchId);
    
    showNotification(`Processing ${batchIds.length} batches...`, 'info');
    
    setTimeout(() => {
        selectedBatches.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = 'Testing';
                statusBadge.className = 'status-badge status-testing';
            }
        });
        
        showNotification(`${batchIds.length} batches moved to testing`, 'success');
        selectedBatches.forEach(cb => cb.checked = false);
    }, 2000);
}

function exportTestData() {
    showNotification('Preparing test data export...', 'info');
    
    setTimeout(() => {
        const testData = [
            'Test ID,Batch ID,Test Type,Status,Started Date,Completion Date,Result',
            'TST-001,MFG-001,Purity Testing,Completed,2024-10-15,2024-10-16,Pass',
            'TST-002,MFG-002,Contamination Test,In Progress,2024-10-16,,Pending',
            'TST-003,MFG-003,Potency Analysis,Completed,2024-10-14,2024-10-15,Pass'
        ].join('\n');
        
        downloadCSV(testData, 'lab_test_data.csv');
        showNotification('Test data exported successfully', 'success');
    }, 1500);
}

function showNewTestModal() {
    const modalHTML = `
        <div class="modal-overlay" id="newTestModal">
            <div class="modal">
                <div class="modal-header">
                    <h3>Start New Test</h3>
                    <button class="modal-close" onclick="closeModal('newTestModal')">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="newTestForm" onsubmit="submitNewTest(event)">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="testBatchId">Batch ID</label>
                                <select id="testBatchId" class="form-input" required>
                                    <option value="">Select Batch</option>
                                    <option value="MFG-001">MFG-001</option>
                                    <option value="MFG-002">MFG-002</option>
                                    <option value="MFG-003">MFG-003</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="testType">Test Type</label>
                                <select id="testType" class="form-input" required>
                                    <option value="">Select Test Type</option>
                                    <option value="Purity Testing">Purity Testing</option>
                                    <option value="Contamination Test">Contamination Test</option>
                                    <option value="Potency Analysis">Potency Analysis</option>
                                    <option value="Safety Testing">Safety Testing</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="testPriority">Priority</label>
                                <select id="testPriority" class="form-input" required>
                                    <option value="">Select Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="expectedDuration">Expected Duration (days)</label>
                                <input type="number" id="expectedDuration" class="form-input" min="1" max="30" required>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" onclick="closeModal('newTestModal')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Start Test</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('newTestModal').style.display = 'flex';
}

function submitNewTest(event) {
    event.preventDefault();
    
    const testData = {
        id: 'TST-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
        batchId: document.getElementById('testBatchId').value,
        testType: document.getElementById('testType').value,
        priority: document.getElementById('testPriority').value,
        duration: document.getElementById('expectedDuration').value,
        status: 'in-progress',
        startDate: new Date().toLocaleDateString()
    };
    
    closeModal('newTestModal');
    showNotification(`Test ${testData.id} started for batch ${testData.batchId}`, 'success');
}

function startPurityTest() {
    showNotification('Starting purity test...', 'info');
    setTimeout(() => {
        showNotification('Purity test initiated successfully', 'success');
    }, 1500);
}

function startContaminationTest() {
    showNotification('Starting contamination test...', 'info');
    setTimeout(() => {
        showNotification('Contamination test initiated successfully', 'success');
    }, 1500);
}

function startPotencyTest() {
    showNotification('Starting potency analysis...', 'info');
    setTimeout(() => {
        showNotification('Potency analysis initiated successfully', 'success');
    }, 1500);
}

function startSafetyTest() {
    showNotification('Starting safety test...', 'info');
    setTimeout(() => {
        showNotification('Safety test initiated successfully', 'success');
    }, 1500);
}

function exportLossData() {
    showNotification('Preparing loss data export...', 'info');
    
    setTimeout(() => {
        const lossData = [
            'Loss ID,Batch ID,Loss Type,Quantity Lost,Reason,Date Reported',
            'LSS-001,MFG-001,Contamination,5kg,Microbial contamination detected,2024-10-15',
            'LSS-002,MFG-002,Degradation,2kg,Storage temperature exceeded,2024-10-14'
        ].join('\n');
        
        downloadCSV(lossData, 'lab_loss_data.csv');
        showNotification('Loss data exported successfully', 'success');
    }, 1500);
}

function showLossReportModal() {
    showNotification('Opening loss report form...', 'info');
}

function exportReportData() {
    showNotification('Preparing report data export...', 'info');
    
    setTimeout(() => {
        const reportData = [
            'Report ID,Batch ID,Test Type,Result,Purity %,Date Generated',
            'RPT-001,MFG-001,Purity Testing,Pass,98.5%,2024-10-16',
            'RPT-002,MFG-002,Contamination Test,Pass,99.2%,2024-10-15'
        ].join('\n');
        
        downloadCSV(reportData, 'lab_reports.csv');
        showNotification('Report data exported successfully', 'success');
    }, 1500);
}

function showReportModal() {
    showNotification('Opening report generation form...', 'info');
}

function exportAnalytics() {
    showNotification('Preparing analytics export...', 'info');
    
    setTimeout(() => {
        const analyticsData = [
            'Metric,Value,Date',
            'Total Tests Completed,156,2024-10-16',
            'Average Test Duration,2.3 days,2024-10-16',
            'Pass Rate,94.2%,2024-10-16'
        ].join('\n');
        
        downloadCSV(analyticsData, 'lab_analytics.csv');
        showNotification('Analytics exported successfully', 'success');
    }, 1500);
}

function exportCertifications() {
    showNotification('Preparing certifications export...', 'info');
    
    setTimeout(() => {
        const certData = [
            'Certificate ID,Batch ID,Type,Status,Issue Date,Expiry Date',
            'CERT-001,MFG-001,Quality Certificate,Valid,2024-10-16,2025-10-16',
            'CERT-002,MFG-002,Purity Certificate,Valid,2024-10-15,2025-10-15'
        ].join('\n');
        
        downloadCSV(certData, 'lab_certifications.csv');
        showNotification('Certifications exported successfully', 'success');
    }, 1500);
}

function showCertificationModal() {
    const modalHTML = `
        <div class="modal-overlay" id="certificationModal">
            <div class="modal large-modal">
                <div class="modal-header">
                    <h3>Issue Laboratory Certificate</h3>
                    <button class="modal-close" onclick="closeModal('certificationModal')">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="certificationForm" onsubmit="submitCertification(event)">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="certBatchId">Batch ID</label>
                                <select id="certBatchId" class="form-input" required onchange="loadBatchDetails()">
                                    <option value="">Select Batch</option>
                                    <option value="MFG-001">MFG-001 - Ashwagandha Extract</option>
                                    <option value="MFG-002">MFG-002 - Turmeric Powder</option>
                                    <option value="MFG-003">MFG-003 - Brahmi Oil</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="certType">Certificate Type</label>
                                <select id="certType" class="form-input" required>
                                    <option value="">Select Certificate Type</option>
                                    <option value="Quality Certificate">Quality Certificate</option>
                                    <option value="Purity Certificate">Purity Certificate</option>
                                    <option value="Safety Certificate">Safety Certificate</option>
                                    <option value="Compliance Certificate">Compliance Certificate</option>
                                    <option value="Organic Certificate">Organic Certificate</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="testResults">Test Results Summary</label>
                                <textarea id="testResults" class="form-input" rows="3" placeholder="Enter key test results and findings..."></textarea>
                            </div>
                            <div class="form-group">
                                <label for="purityLevel">Purity Level (%)</label>
                                <input type="number" id="purityLevel" class="form-input" min="0" max="100" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label for="issueDate">Issue Date</label>
                                <input type="date" id="issueDate" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="expiryDate">Expiry Date</label>
                                <input type="date" id="expiryDate" class="form-input" required>
                            </div>
                        </div>
                        
                        <div class="certificate-upload-section">
                            <h4>Certificate Documents</h4>
                            <div class="upload-area" onclick="triggerCertificateUpload()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Click to upload certificate documents</p>
                                <small>Supported formats: PDF, JPG, PNG (Max 10MB each)</small>
                                <input type="file" id="certificateFiles" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                            </div>
                            <div id="uploadedCertificates" class="uploaded-files-list"></div>
                        </div>
                        
                        <div class="digital-signature-section">
                            <h4>Digital Signature</h4>
                            <div class="signature-grid">
                                <div class="form-group">
                                    <label for="signatoryName">Signatory Name</label>
                                    <input type="text" id="signatoryName" class="form-input" required>
                                </div>
                                <div class="form-group">
                                    <label for="signatoryTitle">Title/Position</label>
                                    <input type="text" id="signatoryTitle" class="form-input" required>
                                </div>
                                <div class="form-group">
                                    <label for="labLicense">Lab License Number</label>
                                    <input type="text" id="labLicense" class="form-input" required>
                                </div>
                                <div class="form-group">
                                    <label for="signatureDate">Signature Date</label>
                                    <input type="date" id="signatureDate" class="form-input" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" onclick="closeModal('certificationModal')">Cancel</button>
                            <button type="button" class="btn btn-secondary" onclick="previewCertificate()">Preview</button>
                            <button type="submit" class="btn btn-primary">Issue Certificate</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('certificationModal').style.display = 'flex';
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    document.getElementById('issueDate').value = today;
    document.getElementById('expiryDate').value = nextYear.toISOString().split('T')[0];
    document.getElementById('signatureDate').value = today;
}

function triggerCertificateUpload() {
    document.getElementById('certificateFiles').click();
}

function loadBatchDetails() {
    const batchId = document.getElementById('certBatchId').value;
    if (!batchId) return;
    
    // Simulate loading batch details
    const batchDetails = {
        'MFG-001': { purity: 98.5, results: 'All purity tests passed. No contamination detected. Heavy metals within acceptable limits.' },
        'MFG-002': { purity: 99.2, results: 'Excellent purity levels. Curcumin content verified. Microbiological tests clear.' },
        'MFG-003': { purity: 97.8, results: 'Good quality brahmi oil. Active compounds verified. Pesticide residue tests negative.' }
    };
    
    const details = batchDetails[batchId];
    if (details) {
        document.getElementById('purityLevel').value = details.purity;
        document.getElementById('testResults').value = details.results;
    }
}

function submitCertification(event) {
    event.preventDefault();
    
    const certData = {
        id: 'CERT-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
        batchId: document.getElementById('certBatchId').value,
        type: document.getElementById('certType').value,
        results: document.getElementById('testResults').value,
        purity: document.getElementById('purityLevel').value,
        issueDate: document.getElementById('issueDate').value,
        expiryDate: document.getElementById('expiryDate').value,
        signatory: document.getElementById('signatoryName').value,
        title: document.getElementById('signatoryTitle').value,
        license: document.getElementById('labLicense').value,
        signatureDate: document.getElementById('signatureDate').value,
        status: 'Valid'
    };
    
    // Add to certificates table if it exists
    addCertificateToTable(certData);
    
    // Store in blockchain simulation
    storeCertificateOnBlockchain(certData);
    
    closeModal('certificationModal');
    showNotification(`Certificate ${certData.id} issued successfully for batch ${certData.batchId}`, 'success');
}

function addCertificateToTable(certData) {
    // Find or create certificates table
    let certificatesTable = document.getElementById('certificatesTable');
    if (!certificatesTable) {
        // Create certificates section if it doesn't exist
        const certificatesSection = `
            <div class="dashboard-section" id="certificatesSection">
                <div class="section-header">
                    <h2>Issued Certificates</h2>
                    <div class="section-actions">
                        <button class="btn btn-secondary" onclick="exportCertifications()">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>
                <table class="data-table" id="certificatesTable">
                    <thead>
                        <tr>
                            <th>Certificate ID</th>
                            <th>Batch ID</th>
                            <th>Type</th>
                            <th>Purity %</th>
                            <th>Issue Date</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="certificatesTableBody">
                    </tbody>
                </table>
            </div>
        `;
        
        // Insert after compliance section
        const complianceSection = document.querySelector('.dashboard-section:last-child');
        if (complianceSection) {
            complianceSection.insertAdjacentHTML('afterend', certificatesSection);
        }
        
        certificatesTable = document.getElementById('certificatesTable');
    }
    
    const tbody = document.getElementById('certificatesTableBody');
    if (tbody) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${certData.id}</strong></td>
            <td>${certData.batchId}</td>
            <td>${certData.type}</td>
            <td>${certData.purity}%</td>
            <td>${certData.issueDate}</td>
            <td>${certData.expiryDate}</td>
            <td><span class="status-badge status-valid">${certData.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewCertificate('${certData.id}')" title="View Certificate">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="downloadCertificate('${certData.id}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon" onclick="verifyCertificate('${certData.id}')" title="Verify on Blockchain">
                        <i class="fas fa-shield-alt"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.insertBefore(row, tbody.firstChild);
    }
}

function storeCertificateOnBlockchain(certData) {
    showNotification('Storing certificate on blockchain...', 'info');
    
    setTimeout(() => {
        const blockchainHash = generateBlockchainHash();
        certData.blockchainHash = blockchainHash;
        
        // Store in localStorage for demo
        const certificates = JSON.parse(localStorage.getItem('labCertificates') || '[]');
        certificates.push(certData);
        localStorage.setItem('labCertificates', JSON.stringify(certificates));
        
        showNotification(`Certificate stored on blockchain. Hash: ${blockchainHash.substring(0, 16)}...`, 'success');
    }, 2000);
}

function previewCertificate() {
    const certData = {
        id: 'CERT-PREVIEW',
        batchId: document.getElementById('certBatchId').value,
        type: document.getElementById('certType').value,
        results: document.getElementById('testResults').value,
        purity: document.getElementById('purityLevel').value,
        issueDate: document.getElementById('issueDate').value,
        expiryDate: document.getElementById('expiryDate').value,
        signatory: document.getElementById('signatoryName').value,
        title: document.getElementById('signatoryTitle').value,
        license: document.getElementById('labLicense').value
    };
    
    if (!certData.batchId || !certData.type) {
        showNotification('Please fill in required fields before preview', 'warning');
        return;
    }
    
    generateCertificatePreview(certData);
}

function generateCertificatePreview(certData) {
    const previewHTML = `
        <div class="modal-overlay" id="certificatePreview">
            <div class="modal certificate-modal">
                <div class="modal-header">
                    <h3>Certificate Preview</h3>
                    <button class="modal-close" onclick="closeModal('certificatePreview')">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="certificate-document">
                        <div class="certificate-header">
                            <div class="lab-logo">
                                <i class="fas fa-flask"></i>
                                <h2>AyurTrace Laboratory</h2>
                            </div>
                            <div class="certificate-title">
                                <h1>${certData.type}</h1>
                                <p>Certificate ID: ${certData.id}</p>
                            </div>
                        </div>
                        
                        <div class="certificate-body">
                            <div class="cert-section">
                                <h3>Batch Information</h3>
                                <p><strong>Batch ID:</strong> ${certData.batchId}</p>
                                <p><strong>Test Date:</strong> ${certData.issueDate}</p>
                                <p><strong>Purity Level:</strong> ${certData.purity}%</p>
                            </div>
                            
                            <div class="cert-section">
                                <h3>Test Results</h3>
                                <p>${certData.results}</p>
                            </div>
                            
                            <div class="cert-section">
                                <h3>Certification</h3>
                                <p>This is to certify that the above mentioned batch has been tested and meets all quality standards as per regulatory requirements.</p>
                            </div>
                            
                            <div class="cert-signature">
                                <div class="signature-block">
                                    <div class="signature-line"></div>
                                    <p><strong>${certData.signatory}</strong></p>
                                    <p>${certData.title}</p>
                                    <p>License: ${certData.license}</p>
                                    <p>Date: ${certData.issueDate}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="certificate-footer">
                            <p>Valid until: ${certData.expiryDate}</p>
                            <div class="qr-placeholder">
                                <i class="fas fa-qrcode"></i>
                                <small>QR Code for Verification</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="closeModal('certificatePreview')">Close</button>
                    <button class="btn btn-primary" onclick="printCertificate()">Print Certificate</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', previewHTML);
    document.getElementById('certificatePreview').style.display = 'flex';
}

function viewCertificate(certId) {
    showNotification(`Loading certificate ${certId}...`, 'info');
    
    // Simulate loading certificate data
    setTimeout(() => {
        const sampleCertData = {
            id: certId,
            batchId: 'MFG-001',
            type: 'Quality Certificate',
            results: 'All tests passed successfully. Product meets quality standards.',
            purity: '98.5',
            issueDate: '2024-10-16',
            expiryDate: '2025-10-16',
            signatory: 'Dr. Rajesh Kumar',
            title: 'Chief Lab Analyst',
            license: 'LAB-2024-001'
        };
        
        generateCertificatePreview(sampleCertData);
    }, 1000);
}

function downloadCertificate(certId) {
    showNotification(`Generating PDF for certificate ${certId}...`, 'info');
    
    setTimeout(() => {
        showNotification('Certificate PDF downloaded successfully', 'success');
    }, 2000);
}

function verifyCertificate(certId) {
    showNotification(`Verifying certificate ${certId} on blockchain...`, 'info');
    
    setTimeout(() => {
        const verificationResult = Math.random() > 0.1; // 90% success rate
        
        if (verificationResult) {
            showNotification('Certificate verified successfully on blockchain', 'success');
        } else {
            showNotification('Certificate verification failed - not found on blockchain', 'error');
        }
    }, 2500);
}

function printCertificate() {
    window.print();
}

// Handle certificate file uploads
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'certificateFiles') {
            handleCertificateFileUpload(e.target.files);
        }
    });
});

function handleCertificateFileUpload(files) {
    const uploadedList = document.getElementById('uploadedCertificates');
    
    Array.from(files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showNotification(`File ${file.name} is too large. Maximum size is 10MB.`, 'warning');
            return;
        }
        
        const fileItem = document.createElement('div');
        fileItem.className = 'uploaded-file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-${getFileIcon(file.type)}"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <button class="remove-file-btn" onclick="removeUploadedFile(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        uploadedList.appendChild(fileItem);
    });
    
    showNotification(`${files.length} file(s) uploaded successfully`, 'success');
}

function getFileIcon(fileType) {
    if (fileType.includes('pdf')) return 'pdf';
    if (fileType.includes('image')) return 'image';
    return 'alt';
}

function removeUploadedFile(button) {
    button.parentElement.remove();
}

// Utility function for CSV download
function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
