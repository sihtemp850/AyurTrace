// Manufacturer Dashboard JavaScript


// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeManufacturerDashboard();
    loadBatchData();
    loadLossHistory();
    loadProductionBatches();
    loadTestingHistory();
    startNotificationSystem();
});

// Initialize dashboard
function initializeManufacturerDashboard() {
    // Set user session
    const userSession = {
        name: 'Manoj Kumar',
        role: 'manufacturer',
        id: 'MFG001',
        company: 'AyurMed Manufacturing'
    };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    
    // Initialize file upload handlers
    setupFileUploadHandlers();
    
    // Initialize form handlers
    setupFormHandlers();
}

// Navigation
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
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
}

// Load batch data
function loadBatchData() {
    const sampleBatches = [
        {
            id: 'FB001',
            farmer: 'Rajesh Kumar',
            herb: 'Ashwagandha',
            weight: '50kg',
            grade: 'A',
            receivedDate: '2024-10-15',
            status: 'pending'
        },
        {
            id: 'FB002',
            farmer: 'Priya Sharma',
            herb: 'Turmeric',
            weight: '75kg',
            grade: 'A+',
            receivedDate: '2024-10-14',
            status: 'processing'
        },
        {
            id: 'FB003',
            farmer: 'Amit Singh',
            herb: 'Brahmi',
            weight: '30kg',
            grade: 'B+',
            receivedDate: '2024-10-13',
            status: 'completed'
        }
    ];
    
    const tbody = document.getElementById('batchTableBody');
    tbody.innerHTML = '';
    
    sampleBatches.forEach(batch => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="batch-checkbox" data-batch-id="${batch.id}"></td>
            <td><strong>${batch.id}</strong></td>
            <td>${batch.farmer}</td>
            <td>${batch.herb}</td>
            <td>${batch.weight}</td>
            <td><span class="grade-badge grade-${batch.grade.toLowerCase().replace('+', 'plus')}">${batch.grade}</span></td>
            <td>${batch.receivedDate}</td>
            <td><span class="status-badge status-${batch.status}">${capitalizeFirst(batch.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewBatchDetails('${batch.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="processBatch('${batch.id}')" title="Process">
                        <i class="fas fa-cogs"></i>
                    </button>
                    <button class="btn-icon" onclick="rejectBatch('${batch.id}')" title="Reject">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load loss history
function loadLossHistory() {
    const sampleLosses = [
        {
            id: 'LOSS001',
            batchId: 'MFG001',
            type: 'Processing Loss',
            weight: '2.5kg',
            value: '₹1,250',
            date: '2024-10-14',
            status: 'approved'
        },
        {
            id: 'LOSS002',
            batchId: 'MFG002',
            type: 'Contamination',
            weight: '5.0kg',
            value: '₹3,500',
            date: '2024-10-13',
            status: 'pending'
        }
    ];
    
    const container = document.getElementById('lossCards');
    container.innerHTML = '';
    
    sampleLosses.forEach(loss => {
        const card = document.createElement('div');
        card.className = 'loss-card';
        card.innerHTML = `
            <div class="loss-card-header">
                <h4>${loss.id}</h4>
                <span class="status-badge status-${loss.status}">${capitalizeFirst(loss.status)}</span>
            </div>
            <div class="loss-card-body">
                <p><strong>Batch:</strong> ${loss.batchId}</p>
                <p><strong>Type:</strong> ${loss.type}</p>
                <p><strong>Weight Lost:</strong> ${loss.weight}</p>
                <p><strong>Value:</strong> ${loss.value}</p>
                <p><strong>Date:</strong> ${loss.date}</p>
            </div>
            <div class="loss-card-actions">
                <button class="btn btn-outline btn-sm" onclick="viewLossDetails('${loss.id}')">View Details</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Load production batches
function loadProductionBatches() {
    const sampleProduction = [
        {
            id: 'PROD001',
            product: 'Ashwagandha Powder',
            inputWeight: '50kg',
            outputWeight: '45kg',
            efficiency: '90%',
            date: '2024-10-15',
            status: 'completed'
        },
        {
            id: 'PROD002',
            product: 'Turmeric Extract',
            inputWeight: '75kg',
            outputWeight: '15kg',
            efficiency: '20%',
            date: '2024-10-14',
            status: 'in-progress'
        }
    ];
    
    const container = document.getElementById('productionBatches');
    container.innerHTML = '';
    
    sampleProduction.forEach(batch => {
        const card = document.createElement('div');
        card.className = 'production-card';
        card.innerHTML = `
            <div class="production-card-header">
                <h4>${batch.id}</h4>
                <span class="status-badge status-${batch.status.replace('-', '')}">${capitalizeFirst(batch.status)}</span>
            </div>
            <div class="production-card-body">
                <p><strong>Product:</strong> ${batch.product}</p>
                <p><strong>Input:</strong> ${batch.inputWeight}</p>
                <p><strong>Output:</strong> ${batch.outputWeight}</p>
                <p><strong>Efficiency:</strong> ${batch.efficiency}</p>
                <p><strong>Date:</strong> ${batch.date}</p>
            </div>
            <div class="production-card-actions">
                <button class="btn btn-outline btn-sm" onclick="viewProductionDetails('${batch.id}')">Details</button>
                <button class="btn btn-primary btn-sm" onclick="sendToTesting('${batch.id}')">Send to Testing</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Load testing history
function loadTestingHistory() {
    const sampleTests = [
        {
            testId: 'TEST001',
            batchId: 'PROD001',
            testType: 'Quality Analysis',
            submittedDate: '2024-10-15',
            status: 'completed',
            result: 'Pass'
        },
        {
            testId: 'TEST002',
            batchId: 'PROD002',
            testType: 'Purity Test',
            submittedDate: '2024-10-14',
            status: 'in-progress',
            result: 'Pending'
        }
    ];
    
    const tbody = document.getElementById('testingTableBody');
    tbody.innerHTML = '';
    
    sampleTests.forEach(test => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${test.testId}</strong></td>
            <td>${test.batchId}</td>
            <td>${test.testType}</td>
            <td>${test.submittedDate}</td>
            <td><span class="status-badge status-${test.status.replace('-', '')}">${capitalizeFirst(test.status)}</span></td>
            <td><span class="result-badge result-${test.result.toLowerCase()}">${test.result}</span></td>
            <td>
                <button class="btn-icon" onclick="viewTestResults('${test.testId}')" title="View Results">
                    <i class="fas fa-chart-line"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// File upload handlers
function setupFileUploadHandlers() {
    // Loss proof files
    document.getElementById('lossProofFiles').addEventListener('change', function(e) {
        handleFileUpload(e.target.files, 'uploadedFiles');
    });
    
    // Defective proof files
    document.getElementById('defectiveProofFiles').addEventListener('change', function(e) {
        handleFileUpload(e.target.files, 'defectiveUploadedFiles');
    });
}

function triggerFileUpload() {
    document.getElementById('lossProofFiles').click();
}

function triggerDefectiveFileUpload() {
    document.getElementById('defectiveProofFiles').click();
}

function handleFileUpload(files, containerId) {
    const container = document.getElementById(containerId) || createUploadContainer(containerId);
    container.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'uploaded-file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <span class="file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <button class="remove-file" onclick="removeFile(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(fileItem);
    });
}

function createUploadContainer(containerId) {
    const container = document.createElement('div');
    container.id = containerId;
    container.className = 'uploaded-files';
    document.querySelector('.file-upload-area').parentNode.appendChild(container);
    return container;
}

function removeFile(button) {
    button.parentElement.remove();
}

// Form handlers
function setupFormHandlers() {
    // Loss form
    document.getElementById('lossForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitLossReport();
    });
    
    // Defective form
    document.getElementById('defectiveForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitDefectiveHerbs();
    });
    
    // Production form
    document.getElementById('productionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createProductionBatch();
    });
    
    // Testing form
    document.getElementById('testingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitForTesting();
    });
}

// Action functions
function viewBatchDetails(batchId) {
    showNotification(`Viewing details for batch ${batchId}`, 'info');
    // Implementation for viewing batch details
}

function processBatch(batchId) {
    showNotification(`Processing batch ${batchId}`, 'success');
    // Implementation for processing batch
}

function rejectBatch(batchId) {
    if (confirm(`Are you sure you want to reject batch ${batchId}?`)) {
        showNotification(`Batch ${batchId} rejected`, 'warning');
    }
}

function submitLossReport() {
    showNotification('Loss report submitted successfully', 'success');
    document.getElementById('lossForm').reset();
    document.getElementById('uploadedFiles').innerHTML = '';
}

function submitDefectiveHerbs() {
    showNotification('Defective herbs submitted for processing', 'success');
    document.getElementById('defectiveForm').reset();
}

function createProductionBatch() {
    showNotification('Production batch created successfully', 'success');
    document.getElementById('productionForm').reset();
    loadProductionBatches(); // Refresh the list
}

function submitForTesting() {
    showNotification('Batch submitted for lab testing', 'success');
    document.getElementById('testingForm').reset();
    loadTestingHistory(); // Refresh the list
}

function sendToTesting(batchId) {
    showNotification(`Batch ${batchId} sent to testing`, 'info');
    // Auto-fill testing form
    document.querySelector('#testingForm select').value = batchId;
    showSection('labtesting');
}

// Export functionality
function exportManufacturerData() {
    const exportOptions = [
        'Batch Records',
        'Loss Reports',
        'Production Data',
        'Testing Results'
    ];
    
    // Show export modal (simplified)
    showNotification('Export functionality - select data type to export', 'info');
}

// Bulk operations
function selectAllBatches() {
    const checkboxes = document.querySelectorAll('.batch-checkbox');
    const selectAll = document.getElementById('selectAllCheckbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

function processBulkBatches() {
    const selectedBatches = Array.from(document.querySelectorAll('.batch-checkbox:checked'))
        .map(cb => cb.dataset.batchId);
    
    if (selectedBatches.length === 0) {
        showNotification('Please select batches to process', 'warning');
        return;
    }
    
    showNotification(`Processing ${selectedBatches.length} batches`, 'success');
}

// User profile functions
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
    }
    
    // Create and show a clean profile modal
    const profileModal = document.createElement('div');
    profileModal.className = 'modal show';
    profileModal.id = 'manufacturerProfileModal';
    profileModal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3><i class="fas fa-industry"></i> Manufacturer Profile</h3>
                <button class="modal-close" onclick="closeProfileModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="profile-container">
                    <div class="profile-sidebar">
                        <div class="profile-avatar">
                            <div class="avatar-circle large manufacturer">
                                <span>MK</span>
                            </div>
                            <button class="btn btn-outline btn-sm">Change Photo</button>
                        </div>
                        <div class="profile-stats">
                            <div class="stat-item">
                                <span class="stat-value">156</span>
                                <span class="stat-label">Batches Processed</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">2,847</span>
                                <span class="stat-label">Products Manufactured</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">98.5%</span>
                                <span class="stat-label">Quality Rating</span>
                            </div>
                        </div>
                    </div>
                    <div class="profile-content">
                        <form class="profile-form">
                            <div class="form-section">
                                <h4>Company Information</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Company Name</label>
                                        <input type="text" value="AyurVeda Manufacturing Ltd." class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label>Manufacturer ID</label>
                                        <input type="text" value="MFG001" class="form-control" readonly>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Contact Person</label>
                                        <input type="text" value="Manoj Kumar" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label>License Number</label>
                                        <input type="text" value="AYUR-MFG-2024-001" class="form-control">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Email</label>
                                        <input type="email" value="manoj@ayurvedamfg.com" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label>Phone</label>
                                        <input type="tel" value="+91 98765 12345" class="form-control">
                                    </div>
                                </div>
                            </div>
                            <div class="form-section">
                                <h4>Facility Details</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Facility Address</label>
                                        <textarea class="form-control" rows="3">Industrial Area, Phase-2
Sector 15, Gurugram
Haryana - 122001</textarea>
                                    </div>
                                    <div class="form-group">
                                        <label>Certifications</label>
                                        <div class="certification-tags">
                                            <span class="cert-tag">ISO 9001:2015</span>
                                            <span class="cert-tag">GMP Certified</span>
                                            <span class="cert-tag">AYUSH Approved</span>
                                            <span class="cert-tag">WHO-GMP</span>
                                        </div>
                                        <button type="button" class="btn btn-outline btn-sm mt-2">Add Certification</button>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Production Capacity (kg/month)</label>
                                        <input type="number" value="5000" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label>Established Year</label>
                                        <input type="number" value="2018" class="form-control">
                                    </div>
                                </div>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-outline" onclick="closeProfileModal()">Cancel</button>
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(profileModal);
    document.body.style.overflow = 'hidden';
}

function closeProfileModal() {
    const modal = document.getElementById('manufacturerProfileModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }, 300);
    }
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

function showSettings() {
    showNotification('Opening settings...', 'info');
}

function showHelp() {
    showNotification('Opening help & support...', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userSession');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('manufacturerSettings');
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
    }
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function saveProfile() {
    showNotification('Profile updated successfully!', 'success');
    closeModal();
}

function saveSettings() {
    showNotification('Settings saved successfully!', 'success');
    closeModal();
}

// Notification system
function startNotificationSystem() {
    setInterval(() => {
        const notifications = [
            'New batch FB004 received from Farmer Suresh',
            'Quality test results available for PROD001',
            'Production line 3 completed processing',
            'Lab testing scheduled for batch PROD003',
            'Loss report LOSS003 approved by supervisor'
        ];
        
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        showNotification(randomNotification, 'info');
    }, 60000); // Every minute
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button class="close-notification" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Modal functions
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = content;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Utility functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showNewBatchModal() {
    showNotification('New batch creation modal would open here', 'info');
}

// Profile and Settings Functions - Enhanced
function showProfile() {
    const profileModal = `
        <div class="profile-info">
            <div class="avatar-large">
                <span>MK</span>
            </div>
            <div class="profile-details">
                <h3>Manoj Kumar</h3>
                <p>Demo Manufacturer</p>
                <span class="user-id">ID: MFG001</span>
            </div>
        </div>
        <form class="profile-form">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" value="Manoj Kumar" readonly>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" value="manoj.kumar@ayurmed.com" readonly>
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" value="AyurMed Manufacturing" readonly>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" value="+91 98765 43210" readonly>
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" value="Mumbai, Maharashtra" readonly>
            </div>
            <div class="form-group">
                <label>License Number</label>
                <input type="text" value="MFG-LIC-2024-001" readonly>
            </div>
        </form>
    `;
    showModal('My Profile', profileModal);
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.remove('show');
}

function showSettings() {
    const settingsModal = `
        <div class="settings-section">
            <h4>Notifications</h4>
            <label class="checkbox-label">
                <input type="checkbox" id="emailNotifications" checked> 
                <span>Email notifications</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" id="smsNotifications" checked> 
                <span>SMS alerts</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" id="pushNotifications" checked> 
                <span>Push notifications</span>
            </label>
        </div>
        
        <div class="settings-section">
            <h4>Display Preferences</h4>
            <div class="form-group">
                <label>Language</label>
                <select id="language">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                </select>
            </div>
            <div class="form-group">
                <label>Currency</label>
                <select id="currency">
                    <option value="inr">Indian Rupee (₹)</option>
                    <option value="usd">US Dollar ($)</option>
                    <option value="eur">Euro (€)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date Format</label>
                <select id="dateFormat">
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </select>
            </div>
        </div>
        
        <div class="settings-section">
            <h4>Privacy & Security</h4>
            <label class="checkbox-label">
                <input type="checkbox" id="profileVisibility" checked> 
                <span>Make profile visible to partners</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" id="dataSharing"> 
                <span>Allow data sharing for analytics</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" id="twoFactorAuth"> 
                <span>Enable two-factor authentication</span>
            </label>
        </div>
        
        <div class="settings-section">
            <h4>Manufacturing Preferences</h4>
            <div class="form-group">
                <label>Default Quality Standard</label>
                <select id="qualityStandard">
                    <option value="ayush">AYUSH Guidelines</option>
                    <option value="who">WHO-GMP</option>
                    <option value="iso">ISO 22000</option>
                </select>
            </div>
            <div class="form-group">
                <label>Batch Size Unit</label>
                <select id="batchUnit">
                    <option value="kg">Kilograms (kg)</option>
                    <option value="tons">Metric Tons</option>
                    <option value="lbs">Pounds (lbs)</option>
                </select>
            </div>
        </div>
        
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal('dynamicModal')">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="saveManufacturerSettings()">Save Settings</button>
        </div>
    `;
    showModal('Settings', settingsModal);
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.remove('show');
}

function showHelp() {
    const helpModal = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Help & Support</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="help-section">
                    <h4>Contact Support</h4>
                    <p>Email: support@ayurchain.com</p>
                    <p>Phone: +91 1800-123-4567</p>
                </div>
                <div class="help-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#">User Guide</a></li>
                        <li><a href="#">Video Tutorials</a></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    showModal('Help & Support', helpModal);
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.remove('show');
}

function showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('dynamicModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dynamicModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle">${title}</h2>
                    <button class="modal-close" onclick="closeModal('dynamicModal')">&times;</button>
                </div>
                <div class="modal-body" id="modalBody">
                    ${content}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
    }
    
    modal.style.display = 'flex';
    modal.style.zIndex = '9999';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId || 'dynamicModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Save manufacturer settings
function saveManufacturerSettings() {
    const settingsData = {
        notifications: {
            email: document.getElementById('emailNotifications')?.checked || false,
            sms: document.getElementById('smsNotifications')?.checked || false,
            push: document.getElementById('pushNotifications')?.checked || false
        },
        display: {
            language: document.getElementById('language')?.value || 'en',
            currency: document.getElementById('currency')?.value || 'inr',
            dateFormat: document.getElementById('dateFormat')?.value || 'dd/mm/yyyy'
        },
        privacy: {
            profileVisibility: document.getElementById('profileVisibility')?.checked || false,
            dataSharing: document.getElementById('dataSharing')?.checked || false,
            twoFactorAuth: document.getElementById('twoFactorAuth')?.checked || false
        },
        manufacturing: {
            qualityStandard: document.getElementById('qualityStandard')?.value || 'ayush',
            batchUnit: document.getElementById('batchUnit')?.value || 'kg'
        },
        lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('manufacturerSettings', JSON.stringify(settingsData));
    
    // Show success notification
    showNotification('Settings saved successfully!', 'success');
    
    // Close modal
    closeModal('dynamicModal');
}

function saveProfile() {
    const profileData = {
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        company: document.getElementById('profileCompany').value,
        location: document.getElementById('profileLocation').value,
        license: document.getElementById('profileLicense').value
    };
    
    // Update user session
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    Object.assign(currentUser, profileData);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    document.querySelector('.user-details h4').textContent = profileData.name;
    
    showNotification('Profile updated successfully!', 'success');
    closeModal('profileModal');
}

function saveSettings() {
    const settings = {
        notifications: {
            batchArrivals: document.querySelector('input[type="checkbox"]:nth-of-type(1)').checked,
            qualityAlerts: document.querySelector('input[type="checkbox"]:nth-of-type(2)').checked,
            labResults: document.querySelector('input[type="checkbox"]:nth-of-type(3)').checked,
            productionReminders: document.querySelector('input[type="checkbox"]:nth-of-type(4)').checked
        },
        dashboard: {
            autoRefresh: document.querySelector('input[type="checkbox"]:nth-of-type(5)').checked,
            darkMode: document.querySelector('input[type="checkbox"]:nth-of-type(6)').checked,
            advancedMetrics: document.querySelector('input[type="checkbox"]:nth-of-type(7)').checked
        },
        exportFormat: document.querySelector('select.form-input').value
    };
    
    localStorage.setItem('manufacturerSettings', JSON.stringify(settings));
    showNotification('Settings saved successfully!', 'success');
    closeModal('settingsModal');
}

function showHelpTopic(topic) {
    const topics = {
        'batches': 'Learn how to efficiently manage incoming herb batches, including quality inspection, weight verification, and batch processing workflows.',
        'quality': 'Understand quality control procedures, including visual inspection, contamination checks, and grade classification standards.',
        'production': 'Manufacturing process guidelines covering batch preparation, processing stages, and final product packaging.',
        'testing': 'Step-by-step guide for submitting samples to laboratories, tracking test results, and managing quality certifications.'
    };
    
    showNotification(topics[topic] || 'Help topic not found', 'info');
}

function openDocumentation(docType) {
    const docs = {
        'user-guide': 'Opening User Guide...',
        'api-docs': 'Opening API Documentation...',
        'compliance': 'Opening Compliance Guidelines...',
        'troubleshooting': 'Opening Troubleshooting Guide...'
    };
    
    showNotification(docs[docType] || 'Documentation not found', 'info');
}


// Missing Functions Implementation
function exportManufacturerData() {
    showNotification('Preparing data export...', 'info');
    
    // Simulate data collection
    setTimeout(() => {
        const exportData = {
            batches: document.querySelectorAll('#batchTableBody tr').length,
            losses: document.querySelectorAll('.loss-entry').length || 0,
            production: document.querySelectorAll('.production-batch').length || 0,
            timestamp: new Date().toISOString()
        };
        
        const csvContent = [
            'Export Type,Count,Date',
            `Batches,${exportData.batches},${new Date().toLocaleDateString()}`,
            `Losses,${exportData.losses},${new Date().toLocaleDateString()}`,
            `Production,${exportData.production},${new Date().toLocaleDateString()}`
        ].join('\n');
        
        downloadCSV(csvContent, 'manufacturer_data_export.csv');
        showNotification('Data exported successfully', 'success');
    }, 1500);
}

function showNewBatchModal() {
    const modalHTML = `
        <div class="modal-overlay" id="newBatchModal">
            <div class="modal">
                <div class="modal-header">
                    <h3>Receive New Batch</h3>
                    <button class="modal-close" onclick="closeModal('newBatchModal')">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="newBatchForm" onsubmit="submitNewBatch(event)">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="batchId">Batch ID</label>
                                <input type="text" id="batchId" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="farmerName">Farmer Name</label>
                                <input type="text" id="farmerName" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="herbType">Herb Type</label>
                                <select id="herbType" class="form-input" required>
                                    <option value="">Select Herb</option>
                                    <option value="Ashwagandha">Ashwagandha</option>
                                    <option value="Turmeric">Turmeric</option>
                                    <option value="Brahmi">Brahmi</option>
                                    <option value="Neem">Neem</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="batchWeight">Weight (kg)</label>
                                <input type="number" id="batchWeight" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="batchGrade">Grade</label>
                                <select id="batchGrade" class="form-input" required>
                                    <option value="">Select Grade</option>
                                    <option value="A+">Grade A+</option>
                                    <option value="A">Grade A</option>
                                    <option value="B+">Grade B+</option>
                                    <option value="B">Grade B</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="receivedDate">Received Date</label>
                                <input type="date" id="receivedDate" class="form-input" required>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" onclick="closeModal('newBatchModal')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Receive Batch</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('newBatchModal').style.display = 'flex';
}

function submitNewBatch(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const batchData = {
        id: document.getElementById('batchId').value,
        farmer: document.getElementById('farmerName').value,
        herb: document.getElementById('herbType').value,
        weight: document.getElementById('batchWeight').value + 'kg',
        grade: document.getElementById('batchGrade').value,
        receivedDate: document.getElementById('receivedDate').value,
        status: 'pending'
    };
    
    // Add to batch table
    const tbody = document.getElementById('batchTableBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox" class="batch-checkbox" data-batch-id="${batchData.id}"></td>
        <td><strong>${batchData.id}</strong></td>
        <td>${batchData.farmer}</td>
        <td>${batchData.herb}</td>
        <td>${batchData.weight}</td>
        <td><span class="grade-badge grade-${batchData.grade.toLowerCase().replace('+', 'plus')}">${batchData.grade}</span></td>
        <td>${batchData.receivedDate}</td>
        <td><span class="status-badge status-${batchData.status}">${capitalizeFirst(batchData.status)}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon" onclick="viewBatchDetails('${batchData.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" onclick="processBatch('${batchData.id}')" title="Process">
                    <i class="fas fa-cogs"></i>
                </button>
            </div>
        </td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
    
    closeModal('newBatchModal');
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
    updateBulkActionButtons();
}

function processBulkBatches() {
    const selectedBatches = document.querySelectorAll('.batch-checkbox:checked');
    
    if (selectedBatches.length === 0) {
        showNotification('Please select batches to process', 'warning');
        return;
    }
    
    const batchIds = Array.from(selectedBatches).map(cb => cb.dataset.batchId);
    
    showNotification(`Processing ${batchIds.length} batches...`, 'info');
    
    // Simulate processing
    setTimeout(() => {
        selectedBatches.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const statusBadge = row.querySelector('.status-badge');
            statusBadge.textContent = 'Processing';
            statusBadge.className = 'status-badge status-processing';
        });
        
        showNotification(`${batchIds.length} batches moved to processing`, 'success');
        
        // Uncheck all
        selectedBatches.forEach(cb => cb.checked = false);
        updateBulkActionButtons();
    }, 2000);
}

function updateBulkActionButtons() {
    const selectedCount = document.querySelectorAll('.batch-checkbox:checked').length;
    const bulkButtons = document.querySelectorAll('.bulk-actions .btn');
    
    bulkButtons.forEach(btn => {
        if (btn.textContent.includes('Process')) {
            btn.disabled = selectedCount === 0;
        }
    });
}

function triggerFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*,.pdf';
    
    fileInput.onchange = function(e) {
        const files = Array.from(e.target.files);
        handleFileUpload(files, 'loss-proof');
    };
    
    fileInput.click();
}

function triggerDefectiveFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*,.pdf';
    
    fileInput.onchange = function(e) {
        const files = Array.from(e.target.files);
        handleFileUpload(files, 'defective-proof');
    };
    
    fileInput.click();
}

function handleFileUpload(files, type) {
    if (files.length === 0) return;
    
    showNotification(`Uploading ${files.length} file(s)...`, 'info');
    
    // Simulate file upload
    setTimeout(() => {
        const fileList = files.map(file => `
            <div class="uploaded-file">
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <button onclick="removeFile(this)" class="remove-file">×</button>
            </div>
        `).join('');
        
        const container = type === 'loss-proof' ? 
            document.querySelector('.file-upload-area') : 
            document.querySelector('#defectiveProofFiles').parentElement;
            
        if (container) {
            container.insertAdjacentHTML('afterend', `<div class="file-list">${fileList}</div>`);
        }
        
        showNotification('Files uploaded successfully', 'success');
    }, 1500);
}

function removeFile(button) {
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

// QR Code Generation System
function showQRGenerationModal() {
    const modalHTML = `
        <div class="modal-overlay" id="qrGenerationModal">
            <div class="modal large-modal">
                <div class="modal-header">
                    <h3>Generate Product QR Codes</h3>
                    <button class="modal-close" onclick="closeModal('qrGenerationModal')">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="qr-generation-container">
                        <div class="qr-form-section">
                            <h4>Product Information</h4>
                            <form id="qrGenerationForm">
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="qrBatchId">Batch ID</label>
                                        <select id="qrBatchId" class="form-input" required onchange="loadBatchForQR()">
                                            <option value="">Select Batch</option>
                                            <option value="MFG-001">MFG-001 - Ashwagandha Extract</option>
                                            <option value="MFG-002">MFG-002 - Turmeric Powder</option>
                                            <option value="MFG-003">MFG-003 - Brahmi Oil</option>
                                            <option value="MFG-004">MFG-004 - Neem Capsules</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="qrProductName">Product Name</label>
                                        <input type="text" id="qrProductName" class="form-input" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="qrManufacturer">Manufacturer</label>
                                        <input type="text" id="qrManufacturer" class="form-input" value="AyurTrace Manufacturing" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="qrManufactureDate">Manufacture Date</label>
                                        <input type="date" id="qrManufactureDate" class="form-input" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="qrExpiryDate">Expiry Date</label>
                                        <input type="date" id="qrExpiryDate" class="form-input" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="qrQuantity">Quantity per Unit</label>
                                        <input type="text" id="qrQuantity" class="form-input" placeholder="e.g., 500mg, 100ml" required>
                                    </div>
                                </div>
                                
                                <div class="traceability-section">
                                    <h4>Traceability Information</h4>
                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label for="qrFarmerInfo">Source Farm</label>
                                            <input type="text" id="qrFarmerInfo" class="form-input" placeholder="Farm name and location">
                                        </div>
                                        <div class="form-group">
                                            <label for="qrHarvestDate">Harvest Date</label>
                                            <input type="date" id="qrHarvestDate" class="form-input">
                                        </div>
                                        <div class="form-group">
                                            <label for="qrCertifications">Certifications</label>
                                            <input type="text" id="qrCertifications" class="form-input" placeholder="Organic, Fair Trade, etc.">
                                        </div>
                                        <div class="form-group">
                                            <label for="qrGeoLocation">Geo Location</label>
                                            <input type="text" id="qrGeoLocation" class="form-input" placeholder="Latitude, Longitude">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="qr-options-section">
                                    <h4>QR Code Options</h4>
                                    <div class="form-grid">
                                        <div class="form-group">
                                            <label for="qrSize">QR Code Size</label>
                                            <select id="qrSize" class="form-input">
                                                <option value="small">Small (2x2 cm)</option>
                                                <option value="medium" selected>Medium (3x3 cm)</option>
                                                <option value="large">Large (4x4 cm)</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="qrFormat">Output Format</label>
                                            <select id="qrFormat" class="form-input">
                                                <option value="png">PNG Image</option>
                                                <option value="svg">SVG Vector</option>
                                                <option value="pdf">PDF Document</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="qrQuantityToPrint">Quantity to Generate</label>
                                            <input type="number" id="qrQuantityToPrint" class="form-input" min="1" max="10000" value="100">
                                        </div>
                                        <div class="form-group">
                                            <label for="qrIncludeText">Include Text Below QR</label>
                                            <select id="qrIncludeText" class="form-input">
                                                <option value="batch">Batch ID Only</option>
                                                <option value="product">Product Name</option>
                                                <option value="both" selected>Both</option>
                                                <option value="none">No Text</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="button" class="btn btn-outline" onclick="closeModal('qrGenerationModal')">Cancel</button>
                                    <button type="button" class="btn btn-secondary" onclick="previewQRCode()">Preview</button>
                                    <button type="button" class="btn btn-primary" onclick="generateQRCodes()">Generate QR Codes</button>
                                </div>
                            </form>
                        </div>
                        
                        <div class="qr-preview-section">
                            <h4>QR Code Preview</h4>
                            <div id="qrPreviewContainer" class="qr-preview-container">
                                <div class="qr-placeholder">
                                    <i class="fas fa-qrcode"></i>
                                    <p>QR Code preview will appear here</p>
                                    <small>Click "Preview" to generate sample QR code</small>
                                </div>
                            </div>
                            
                            <div class="qr-info-panel">
                                <h5>QR Code Information</h5>
                                <div id="qrInfoContent" class="qr-info-content">
                                    <p>Select a batch and fill in the details to see QR code information</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('qrGenerationModal').style.display = 'flex';
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);
    
    document.getElementById('qrManufactureDate').value = today;
    document.getElementById('qrExpiryDate').value = futureDate.toISOString().split('T')[0];
}

function loadBatchForQR() {
    const batchId = document.getElementById('qrBatchId').value;
    if (!batchId) return;
    
    // Simulate loading batch details for QR generation
    const batchDetails = {
        'MFG-001': {
            productName: 'Premium Ashwagandha Extract',
            quantity: '500mg',
            farmer: 'Green Valley Organic Farm, Kerala',
            harvestDate: '2024-09-15',
            certifications: 'Organic, FSSAI Certified',
            geoLocation: '10.8505° N, 76.2711° E'
        },
        'MFG-002': {
            productName: 'Pure Turmeric Powder',
            quantity: '100g',
            farmer: 'Sunrise Spice Farm, Karnataka',
            harvestDate: '2024-08-20',
            certifications: 'Organic, Fair Trade',
            geoLocation: '12.9716° N, 77.5946° E'
        },
        'MFG-003': {
            productName: 'Brahmi Hair Oil',
            quantity: '100ml',
            farmer: 'Herbal Gardens Co-op, Tamil Nadu',
            harvestDate: '2024-09-10',
            certifications: 'Organic, Ayush Certified',
            geoLocation: '11.1271° N, 78.6569° E'
        },
        'MFG-004': {
            productName: 'Neem Leaf Capsules',
            quantity: '60 capsules',
            farmer: 'Natural Herbs Farm, Rajasthan',
            harvestDate: '2024-08-25',
            certifications: 'Organic, GMP Certified',
            geoLocation: '26.9124° N, 75.7873° E'
        }
    };
    
    const details = batchDetails[batchId];
    if (details) {
        document.getElementById('qrProductName').value = details.productName;
        document.getElementById('qrQuantity').value = details.quantity;
        document.getElementById('qrFarmerInfo').value = details.farmer;
        document.getElementById('qrHarvestDate').value = details.harvestDate;
        document.getElementById('qrCertifications').value = details.certifications;
        document.getElementById('qrGeoLocation').value = details.geoLocation;
    }
}

function previewQRCode() {
    const batchId = document.getElementById('qrBatchId').value;
    const productName = document.getElementById('qrProductName').value;
    
    if (!batchId || !productName) {
        showNotification('Please select a batch and enter product name', 'warning');
        return;
    }
    
    showNotification('Generating QR code preview...', 'info');
    
    // Simulate QR code generation
    setTimeout(() => {
        const qrData = generateQRData();
        displayQRPreview(qrData);
        showNotification('QR code preview generated successfully', 'success');
    }, 1500);
}

function generateQRData() {
    const formData = {
        batchId: document.getElementById('qrBatchId').value,
        productName: document.getElementById('qrProductName').value,
        manufacturer: document.getElementById('qrManufacturer').value,
        manufactureDate: document.getElementById('qrManufactureDate').value,
        expiryDate: document.getElementById('qrExpiryDate').value,
        quantity: document.getElementById('qrQuantity').value,
        farmer: document.getElementById('qrFarmerInfo').value,
        harvestDate: document.getElementById('qrHarvestDate').value,
        certifications: document.getElementById('qrCertifications').value,
        geoLocation: document.getElementById('qrGeoLocation').value
    };
    
    // Generate blockchain hash for traceability
    const blockchainHash = generateBlockchainHash();
    
    // Create QR data URL (in real implementation, this would be a proper traceability URL)
    const qrDataUrl = `https://ayurtrace.com/verify/${formData.batchId}?hash=${blockchainHash}`;
    
    return {
        url: qrDataUrl,
        data: formData,
        hash: blockchainHash
    };
}

function displayQRPreview(qrData) {
    const previewContainer = document.getElementById('qrPreviewContainer');
    const infoContent = document.getElementById('qrInfoContent');
    
    // Generate QR code visual (simplified representation)
    previewContainer.innerHTML = `
        <div class="qr-code-preview">
            <div class="qr-matrix">
                ${generateQRMatrix()}
            </div>
            <div class="qr-text-label">
                <strong>${qrData.data.batchId}</strong><br>
                <small>${qrData.data.productName}</small>
            </div>
        </div>
    `;
    
    // Display QR information
    infoContent.innerHTML = `
        <div class="qr-info-item">
            <strong>QR Data URL:</strong>
            <code>${qrData.url}</code>
        </div>
        <div class="qr-info-item">
            <strong>Blockchain Hash:</strong>
            <code>${qrData.hash.substring(0, 32)}...</code>
        </div>
        <div class="qr-info-item">
            <strong>Product:</strong> ${qrData.data.productName}
        </div>
        <div class="qr-info-item">
            <strong>Batch:</strong> ${qrData.data.batchId}
        </div>
        <div class="qr-info-item">
            <strong>Expiry:</strong> ${qrData.data.expiryDate}
        </div>
        <div class="qr-info-item">
            <strong>Source:</strong> ${qrData.data.farmer}
        </div>
    `;
}

function generateQRMatrix() {
    // Generate a simplified QR code pattern for preview
    let matrix = '';
    for (let i = 0; i < 21; i++) {
        matrix += '<div class="qr-row">';
        for (let j = 0; j < 21; j++) {
            const isBlack = Math.random() > 0.5;
            matrix += `<div class="qr-cell ${isBlack ? 'black' : 'white'}"></div>`;
        }
        matrix += '</div>';
    }
    return matrix;
}

function generateQRCodes() {
    const batchId = document.getElementById('qrBatchId').value;
    const quantity = document.getElementById('qrQuantityToPrint').value;
    const format = document.getElementById('qrFormat').value;
    
    if (!batchId) {
        showNotification('Please select a batch', 'warning');
        return;
    }
    
    showNotification(`Generating ${quantity} QR codes in ${format.toUpperCase()} format...`, 'info');
    
    // Simulate QR code generation process
    setTimeout(() => {
        const qrData = generateQRData();
        
        // Store QR generation record
        storeQRGenerationRecord(qrData, quantity, format);
        
        // Simulate file download
        downloadQRCodes(qrData, quantity, format);
        
        closeModal('qrGenerationModal');
        showNotification(`${quantity} QR codes generated and downloaded successfully`, 'success');
        
        // Add to QR generation history
        addToQRHistory(qrData, quantity, format);
        
    }, 3000);
}

function storeQRGenerationRecord(qrData, quantity, format) {
    const record = {
        id: 'QR-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
        batchId: qrData.data.batchId,
        productName: qrData.data.productName,
        quantity: quantity,
        format: format,
        generatedDate: new Date().toISOString(),
        blockchainHash: qrData.hash,
        status: 'Generated'
    };
    
    // Store in localStorage for demo
    const qrRecords = JSON.parse(localStorage.getItem('qrGenerationRecords') || '[]');
    qrRecords.push(record);
    localStorage.setItem('qrGenerationRecords', JSON.stringify(qrRecords));
    
    return record;
}

function downloadQRCodes(qrData, quantity, format) {
    // Simulate file download based on format
    const filename = `QR_Codes_${qrData.data.batchId}_${quantity}pcs.${format}`;
    
    // In a real implementation, this would generate actual QR code files
    showNotification(`Downloading ${filename}...`, 'info');
}

function addToQRHistory(qrData, quantity, format) {
    // Find or create QR history section
    let qrHistorySection = document.getElementById('qrHistorySection');
    
    if (!qrHistorySection) {
        // Create QR history section if it doesn't exist
        const historyHTML = `
            <div class="dashboard-section" id="qrHistorySection">
                <div class="section-header">
                    <h2>QR Code Generation History</h2>
                    <div class="section-actions">
                        <button class="btn btn-secondary" onclick="exportQRHistory()">
                            <i class="fas fa-download"></i> Export History
                        </button>
                        <button class="btn btn-primary" onclick="showQRGenerationModal()">
                            <i class="fas fa-qrcode"></i> Generate QR Codes
                        </button>
                    </div>
                </div>
                <table class="data-table" id="qrHistoryTable">
                    <thead>
                        <tr>
                            <th>Generation ID</th>
                            <th>Batch ID</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Format</th>
                            <th>Generated Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="qrHistoryTableBody">
                    </tbody>
                </table>
            </div>
        `;
        
        // Insert after the last dashboard section
        const lastSection = document.querySelector('.dashboard-section:last-child');
        if (lastSection) {
            lastSection.insertAdjacentHTML('afterend', historyHTML);
        }
    }
    
    // Add new record to table
    const tbody = document.getElementById('qrHistoryTableBody');
    if (tbody) {
        const record = storeQRGenerationRecord(qrData, quantity, format);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${record.id}</strong></td>
            <td>${record.batchId}</td>
            <td>${record.productName}</td>
            <td>${record.quantity}</td>
            <td>${record.format.toUpperCase()}</td>
            <td>${new Date(record.generatedDate).toLocaleDateString()}</td>
            <td><span class="status-badge status-generated">${record.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="regenerateQRCodes('${record.id}')" title="Regenerate">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn-icon" onclick="viewQRDetails('${record.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="downloadQRRecord('${record.id}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.insertBefore(row, tbody.firstChild);
    }
}

function exportQRHistory() {
    showNotification('Preparing QR generation history export...', 'info');
    
    setTimeout(() => {
        const qrRecords = JSON.parse(localStorage.getItem('qrGenerationRecords') || '[]');
        
        const csvContent = [
            'Generation ID,Batch ID,Product Name,Quantity,Format,Generated Date,Status',
            ...qrRecords.map(record => 
                `${record.id},${record.batchId},${record.productName},${record.quantity},${record.format},${new Date(record.generatedDate).toLocaleDateString()},${record.status}`
            )
        ].join('\n');
        
        downloadCSV(csvContent, 'qr_generation_history.csv');
        showNotification('QR generation history exported successfully', 'success');
    }, 1500);
}

function regenerateQRCodes(recordId) {
    showNotification(`Regenerating QR codes for record ${recordId}...`, 'info');
    
    setTimeout(() => {
        showNotification('QR codes regenerated successfully', 'success');
    }, 2000);
}

function viewQRDetails(recordId) {
    showNotification(`Loading QR generation details for ${recordId}...`, 'info');
    
    setTimeout(() => {
        showNotification('QR details loaded', 'success');
    }, 1000);
}

function downloadQRRecord(recordId) {
    showNotification(`Downloading QR codes for record ${recordId}...`, 'info');
    
    setTimeout(() => {
        showNotification('QR codes downloaded successfully', 'success');
    }, 1500);
}
