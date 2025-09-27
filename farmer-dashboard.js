// AyurTrace - Farmer Dashboard JavaScript

// Font Size Management
let currentFontSize = 100; // Default 100%
const minFontSize = 80;
const maxFontSize = 150;
const fontSizeStep = 10;

// Load saved font size preference
function loadFontSizePreference() {
    const saved = localStorage.getItem('farmerFontSizePreference');
    if (saved) {
        currentFontSize = parseInt(saved);
        applyFontSize(currentFontSize);
    }
}

// Apply font size to the document
function applyFontSize(size) {
    document.documentElement.style.fontSize = size + '%';
    currentFontSize = size;
    
    // Save preference
    localStorage.setItem('farmerFontSizePreference', size.toString());
    
    // Update button states
    updateFontSizeButtons();
}

// Increase font size
function increaseFontSize() {
    if (currentFontSize < maxFontSize) {
        applyFontSize(currentFontSize + fontSizeStep);
        showFontSizeNotification(`Font size increased to ${currentFontSize}%`);
    }
}

// Decrease font size
function decreaseFontSize() {
    if (currentFontSize > minFontSize) {
        applyFontSize(currentFontSize - fontSizeStep);
        showFontSizeNotification(`Font size decreased to ${currentFontSize}%`);
    }
}

// Reset font size to default
function resetFontSize() {
    applyFontSize(100);
    showFontSizeNotification('Font size reset to default');
}

// Update button states based on current font size
function updateFontSizeButtons() {
    const decreaseBtn = document.querySelector('.font-size-controls button[onclick="decreaseFontSize()"]');
    const increaseBtn = document.querySelector('.font-size-controls button[onclick="increaseFontSize()"]');
    
    if (decreaseBtn) {
        decreaseBtn.disabled = currentFontSize <= minFontSize;
        decreaseBtn.style.opacity = currentFontSize <= minFontSize ? '0.5' : '1';
    }
    
    if (increaseBtn) {
        increaseBtn.disabled = currentFontSize >= maxFontSize;
        increaseBtn.style.opacity = currentFontSize >= maxFontSize ? '0.5' : '1';
    }
}

// Show font size change notification
function showFontSizeNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'font-size-notification';
    notification.innerHTML = `
        <i class="fas fa-text-height"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        border: 1px solid #e0e0e0;
        border-left: 4px solid #4CAF50;
        border-radius: 8px;
        padding: 12px 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #333;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 2000);
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load font size preference
    loadFontSizePreference();
    
    // Initialize language manager
    if (window.languageManager) {
        console.log('Initializing language manager...');
        window.languageManager.init();
    } else {
        console.log('Language manager not found, retrying...');
        setTimeout(() => {
            if (window.languageManager) {
                window.languageManager.init();
            }
        }, 500);
    }
});

// Herb Selection Functions
function selectHerb(herbType) {
    // Remove active class from all cards
    document.querySelectorAll('.herb-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected card
    const selectedCard = document.querySelector(`[data-herb="${herbType}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    // Update hidden input and dropdown
    document.getElementById('selectedHerb').value = herbType;
    document.getElementById('speciesName').value = herbType;
    
    // Auto-fill quality assessment based on herb type
    autoFillQualityAssessment(herbType);
    
    // Update species info
    updateSpeciesInfo();
    
    // Show selection feedback
    showNotification(`Selected ${herbType.charAt(0).toUpperCase() + herbType.slice(1)} herb`, 'success');
}

// Auto-fill quality assessment based on herb type and location
function autoFillQualityAssessment(herbType) {
    const qualityData = getHerbQualityDefaults(herbType);
    
    document.getElementById('moistureContent').value = qualityData.moisture;
    document.getElementById('visualGrade').value = qualityData.grade;
    document.getElementById('contaminationLevel').value = qualityData.contamination;
    
    // Auto-fill harvest method based on herb type
    document.getElementById('harvestMethod').value = qualityData.harvestMethod;
    document.getElementById('plantAge').value = qualityData.plantAge;
}

// Get default quality parameters for each herb type
function getHerbQualityDefaults(herbType) {
    const herbDefaults = {
        ashwagandha: {
            moisture: 12.5,
            grade: 'A',
            contamination: 'none',
            harvestMethod: 'manual',
            plantAge: 8
        },
        turmeric: {
            moisture: 10.0,
            grade: 'A+',
            contamination: 'none',
            harvestMethod: 'manual',
            plantAge: 10
        },
        brahmi: {
            moisture: 15.0,
            grade: 'A',
            contamination: 'low',
            harvestMethod: 'selective',
            plantAge: 6
        },
        neem: {
            moisture: 8.5,
            grade: 'A',
            contamination: 'none',
            harvestMethod: 'manual',
            plantAge: 12
        },
        tulsi: {
            moisture: 14.0,
            grade: 'A+',
            contamination: 'none',
            harvestMethod: 'selective',
            plantAge: 4
        }
    };
    
    return herbDefaults[herbType] || {
        moisture: 12.0,
        grade: 'A',
        contamination: 'none',
        harvestMethod: 'manual',
        plantAge: 8
    };
}

// Auto-populate climate data based on location
async function getClimateData(lat, lng) {
    try {
        // Using OpenWeatherMap API (free tier)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=demo&units=metric`);
        
        if (response.ok) {
            const data = await response.json();
            
            // Update temperature and humidity fields
            document.getElementById('temperature').value = Math.round(data.main.temp);
            document.getElementById('humidity').value = Math.round(data.main.humidity);
            
            showNotification('Climate data updated automatically', 'success');
        }
    } catch (error) {
        console.log('Climate data fetch failed, using manual input');
        // Set default values based on location (India)
        document.getElementById('temperature').value = 28;
        document.getElementById('humidity').value = 65;
    }
}

// Enhanced getCurrentLocation function
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Update GPS fields
                document.getElementById('gpsLatitude').value = lat.toFixed(6);
                document.getElementById('gpsLongitude').value = lng.toFixed(6);
                
                // Auto-populate all location-based data
                await autoFillLocationData(lat, lng);
                
                showNotification('Location and environmental data updated automatically', 'success');
            },
            function(error) {
                showNotification('Unable to get location. Please enter manually.', 'warning');
                // Set default values for India
                autoFillDefaultData();
            }
        );
    } else {
        showNotification('Geolocation not supported by browser', 'warning');
        autoFillDefaultData();
    }
}

// Auto-fill all location-based data
async function autoFillLocationData(lat, lng) {
    try {
        // Get climate data
        await getClimateData(lat, lng);
        
        // Auto-fill soil type based on region
        const soilType = getSoilTypeByLocation(lat, lng);
        document.getElementById('soilType').value = soilType;
        
        // Auto-fill approved zone based on coordinates
        const geoZone = getGeoZoneByLocation(lat, lng);
        if (geoZone) {
            document.getElementById('geoZone').value = geoZone;
        }
        
    } catch (error) {
        console.log('Error auto-filling location data:', error);
        autoFillDefaultData();
    }
}

// Get soil type based on location (India regions)
function getSoilTypeByLocation(lat, lng) {
    // Simplified soil mapping for Indian regions
    if (lat >= 8 && lat <= 12 && lng >= 76 && lng <= 78) {
        return 'loam'; // Kerala/Tamil Nadu - typically loamy
    } else if (lat >= 24 && lat <= 30 && lng >= 70 && lng <= 78) {
        return 'sandy'; // Rajasthan - sandy soil
    } else if (lat >= 22 && lat <= 26 && lng >= 88 && lng <= 92) {
        return 'clay'; // West Bengal - clay soil
    } else if (lat >= 15 && lat <= 20 && lng >= 73 && lng <= 77) {
        return 'clay'; // Maharashtra - clay soil
    } else {
        return 'loam'; // Default to loam for other regions
    }
}

// Get geo zone based on location
function getGeoZoneByLocation(lat, lng) {
    // Map coordinates to approved zones
    if (lat >= 8 && lat <= 20 && lng >= 72 && lng <= 78) {
        return 'ZONE001'; // Western Ghats Protected Area
    } else if (lat >= 28 && lat <= 35 && lng >= 75 && lng <= 82) {
        return 'ZONE002'; // Himalayan Medicinal Zone
    } else if (lat >= 24 && lat <= 30 && lng >= 70 && lng <= 78) {
        return 'ZONE003'; // Rajasthan Desert Reserve
    }
    return null;
}

// Set default values when location is not available
function autoFillDefaultData() {
    document.getElementById('temperature').value = 28;
    document.getElementById('humidity').value = 65;
    document.getElementById('soilType').value = 'loam';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #e0e0e0;
        border-left: 4px solid ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
        border-radius: 8px;
        padding: 16px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

// Modal Management Functions
function showProfile() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    const modal = document.getElementById('farmerProfileModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeProfileModal() {
    const modal = document.getElementById('farmerProfileModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function showSettings() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    const modal = document.getElementById('farmerSettingsModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeSettingsModal() {
    const modal = document.getElementById('farmerSettingsModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function showHelp() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    const modal = document.getElementById('farmerHelpModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeHelpModal() {
    const modal = document.getElementById('farmerHelpModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Settings Tab Management
function switchSettingsTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    event.target.classList.add('active');
    document.getElementById(tabName + '-settings').classList.add('active');
}

function saveSettings() {
    // Collect all settings data
    const settings = {
        language: document.querySelector('#general-settings select').value,
        currency: document.querySelectorAll('#general-settings select')[1].value,
        dateFormat: document.querySelectorAll('#general-settings select')[2].value,
        theme: document.querySelectorAll('#general-settings select')[3].value,
        notifications: {
            email: document.querySelector('#notifications-settings input[type="checkbox"]').checked,
            sms: document.querySelectorAll('#notifications-settings input[type="checkbox"]')[1].checked,
            priceAlerts: document.querySelectorAll('#notifications-settings input[type="checkbox"]')[2].checked,
            harvestReminders: document.querySelectorAll('#notifications-settings input[type="checkbox"]')[3].checked,
            weatherAlerts: document.querySelectorAll('#notifications-settings input[type="checkbox"]')[4].checked
        },
        privacy: {
            profileVisibility: document.querySelector('#privacy-settings select').value,
            dataSharing: document.querySelector('#privacy-settings input[type="checkbox"]').checked,
            locationTracking: document.querySelectorAll('#privacy-settings input[type="checkbox"]')[1].checked
        }
    };
    
    // Save to localStorage
    localStorage.setItem('farmerSettings', JSON.stringify(settings));
    
    // Show success message
    showNotification('Settings saved successfully!', 'success');
    
    // Close modal
    closeSettingsModal();
}

// Help Tab Management
function switchHelpTab(tabName) {
    // Remove active class from all tabs and sections
    document.querySelectorAll('.help-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.help-section').forEach(section => section.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding section
    event.target.classList.add('active');
    document.getElementById(tabName + '-help').classList.add('active');
}

// FAQ Toggle Function
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('i');
    
    if (faqItem.classList.contains('active')) {
        faqItem.classList.remove('active');
        answer.style.maxHeight = null;
        icon.style.transform = 'rotate(0deg)';
    } else {
        // Close other open FAQs
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.maxHeight = null;
            item.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
        });
        
        // Open clicked FAQ
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    }
}

// Notification Function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Sample data for submissions
const submissionsData = [
    {
        batchId: 'ASH-2024-089',
        herbType: 'Ashwagandha',
        weight: 125,
        grade: 'A',
        submissionDate: '15/09/2024',
        status: 'approved',
        rate: 190,
        totalValue: 23750,
        farmer: 'Rajesh Kumar',
        location: 'Rajasthan',
        harvestDate: '10/09/2024',
        moistureContent: '8.5%',
        qualityNotes: 'Premium quality roots, well-dried'
    },
    {
        batchId: 'TUR-2024-067',
        herbType: 'Turmeric',
        weight: 200,
        grade: 'A',
        submissionDate: '14/09/2024',
        status: 'pending',
        rate: 180,
        totalValue: 36000,
        farmer: 'Rajesh Kumar',
        location: 'Rajasthan',
        harvestDate: '08/09/2024',
        moistureContent: '9.2%',
        qualityNotes: 'High curcumin content, bright color'
    },
    {
        batchId: 'BRA-2024-045',
        herbType: 'Brahmi',
        weight: 85,
        grade: 'B',
        submissionDate: '13/09/2024',
        status: 'approved',
        rate: 280,
        totalValue: 23800,
        farmer: 'Rajesh Kumar',
        location: 'Rajasthan',
        harvestDate: '07/09/2024',
        moistureContent: '10.1%',
        qualityNotes: 'Good quality leaves, minor discoloration'
    },
    {
        batchId: 'NEE-2024-023',
        herbType: 'Neem',
        weight: 150,
        grade: 'C',
        submissionDate: '12/09/2024',
        status: 'rejected',
        rate: 120,
        totalValue: 18000,
        farmer: 'Rajesh Kumar',
        location: 'Rajasthan',
        harvestDate: '05/09/2024',
        moistureContent: '15.2%',
        qualityNotes: 'High moisture content, requires re-drying'
    }
];

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadEarningsData();
    loadSubmissionsData();
    loadTraceabilityData();
    loadLossData();
    loadMarketData();
    loadCropData();
    initializeHarvestMaps();
});

// Interactive Harvest Location Maps
let harvestMap = null;
let harvestMarkers = [];

function initializeHarvestMaps() {
    // Add Leaflet CSS and JS if not already loaded
    if (!document.querySelector('link[href*="leaflet"]')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);
        
        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletJS.onload = () => {
            setTimeout(initializeMapAfterLibraryLoad, 100);
        };
        document.head.appendChild(leafletJS);
    } else {
        initializeMapAfterLibraryLoad();
    }
}

function initializeMapAfterLibraryLoad() {
    // Add harvest location map section to traceability
    addHarvestLocationMapSection();
}

function addHarvestLocationMapSection() {
    const traceabilitySection = document.getElementById('traceability');
    if (!traceabilitySection) return;
    
    // Check if map section already exists
    if (document.getElementById('harvestMapSection')) return;
    
    const mapSectionHTML = `
        <div class="dashboard-section" id="harvestMapSection">
            <div class="section-header">
                <h3>Harvest Location Tracking</h3>
                <div class="section-actions">
                    <button class="btn btn-secondary" onclick="exportHarvestLocations()">
                        <i class="fas fa-download"></i> Export Locations
                    </button>
                    <button class="btn btn-primary" onclick="showAddLocationModal()">
                        <i class="fas fa-map-marker-alt"></i> Add Location
                    </button>
                </div>
            </div>
            
            <div class="map-controls">
                <div class="control-group">
                    <label for="cropFilter">Filter by Crop:</label>
                    <select id="cropFilter" class="form-input" onchange="filterHarvestLocations()">
                        <option value="all">All Crops</option>
                        <option value="ashwagandha">Ashwagandha</option>
                        <option value="turmeric">Turmeric</option>
                        <option value="brahmi">Brahmi</option>
                        <option value="neem">Neem</option>
                        <option value="tulsi">Tulsi</option>
                    </select>
                </div>
                <div class="control-group">
                    <label for="seasonFilter">Filter by Season:</label>
                    <select id="seasonFilter" class="form-input" onchange="filterHarvestLocations()">
                        <option value="all">All Seasons</option>
                        <option value="2024-spring">Spring 2024</option>
                        <option value="2024-summer">Summer 2024</option>
                        <option value="2024-monsoon">Monsoon 2024</option>
                        <option value="2024-winter">Winter 2024</option>
                    </select>
                </div>
                <div class="control-group">
                    <button class="btn btn-outline" onclick="toggleHeatmap()">
                        <i class="fas fa-fire"></i> Toggle Heatmap
                    </button>
                </div>
            </div>
            
            <div class="map-container">
                <div id="harvestMap" class="harvest-map"></div>
                <div class="map-legend">
                    <h4>Legend</h4>
                    <div class="legend-items">
                        <div class="legend-item">
                            <div class="legend-marker active"></div>
                            <span>Active Harvest</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-marker completed"></div>
                            <span>Completed Harvest</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-marker planned"></div>
                            <span>Planned Harvest</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-marker organic"></div>
                            <span>Organic Certified</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="harvest-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-map-marked-alt"></i>
                    </div>
                    <div class="stat-content">
                        <h4 id="totalLocations">12</h4>
                        <p>Total Locations</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <div class="stat-content">
                        <h4 id="activeHarvests">5</h4>
                        <p>Active Harvests</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <div class="stat-content">
                        <h4 id="organicLocations">8</h4>
                        <p>Organic Certified</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-area"></i>
                    </div>
                    <div class="stat-content">
                        <h4 id="totalArea">45.2</h4>
                        <p>Total Area (Acres)</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert the map section after the existing traceability content
    const existingContent = traceabilitySection.querySelector('.dashboard-section');
    if (existingContent) {
        existingContent.insertAdjacentHTML('afterend', mapSectionHTML);
    } else {
        traceabilitySection.insertAdjacentHTML('beforeend', mapSectionHTML);
    }
    
    // Initialize the map after a short delay to ensure DOM is ready
    setTimeout(() => {
        initializeHarvestMap();
    }, 500);
}

function initializeHarvestMap() {
    if (typeof L === 'undefined') {
        console.log('Leaflet not loaded yet, retrying...');
        setTimeout(initializeHarvestMap, 1000);
        return;
    }
    
    const mapElement = document.getElementById('harvestMap');
    if (!mapElement || harvestMap) return;
    
    // Initialize map centered on India (Kerala region)
    harvestMap = L.map('harvestMap').setView([10.8505, 76.2711], 10);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(harvestMap);
    
    // Add harvest location markers
    addHarvestMarkers();
    
    // Add map event listeners
    harvestMap.on('click', onMapClick);
}

function addHarvestMarkers() {
    const harvestLocations = [
        {
            id: 'LOC001',
            name: 'Green Valley Farm - Field A',
            lat: 10.8505,
            lng: 76.2711,
            crop: 'ashwagandha',
            status: 'active',
            area: 5.2,
            harvestDate: '2024-10-15',
            season: '2024-winter',
            organic: true,
            yield: 850,
            quality: 'Premium'
        },
        {
            id: 'LOC002',
            name: 'Green Valley Farm - Field B',
            lat: 10.8520,
            lng: 76.2730,
            crop: 'turmeric',
            status: 'completed',
            area: 3.8,
            harvestDate: '2024-09-20',
            season: '2024-monsoon',
            organic: true,
            yield: 1200,
            quality: 'Premium'
        },
        {
            id: 'LOC003',
            name: 'Hillside Plot - Section 1',
            lat: 10.8490,
            lng: 76.2695,
            crop: 'brahmi',
            status: 'planned',
            area: 2.5,
            harvestDate: '2024-11-10',
            season: '2024-winter',
            organic: false,
            yield: 0,
            quality: 'Standard'
        },
        {
            id: 'LOC004',
            name: 'Riverside Garden',
            lat: 10.8535,
            lng: 76.2750,
            crop: 'neem',
            status: 'active',
            area: 4.1,
            harvestDate: '2024-10-25',
            season: '2024-winter',
            organic: true,
            yield: 950,
            quality: 'Premium'
        },
        {
            id: 'LOC005',
            name: 'Organic Patch - North',
            lat: 10.8475,
            lng: 76.2680,
            crop: 'tulsi',
            status: 'completed',
            area: 1.8,
            harvestDate: '2024-09-05',
            season: '2024-monsoon',
            organic: true,
            yield: 320,
            quality: 'Premium'
        }
    ];
    
    harvestLocations.forEach(location => {
        const marker = createHarvestMarker(location);
        harvestMarkers.push({ marker, data: location });
    });
}

function createHarvestMarker(location) {
    // Create custom icon based on status and crop
    const iconColor = getMarkerColor(location.status, location.organic);
    const iconSymbol = getCropIcon(location.crop);
    
    const customIcon = L.divIcon({
        className: 'custom-harvest-marker',
        html: `<div class="marker-icon ${location.status} ${location.organic ? 'organic' : ''}" title="${location.name}">
                   <i class="fas ${iconSymbol}"></i>
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    const marker = L.marker([location.lat, location.lng], { icon: customIcon })
        .addTo(harvestMap);
    
    // Create popup content
    const popupContent = `
        <div class="harvest-popup">
            <h4>${location.name}</h4>
            <div class="popup-details">
                <div class="detail-row">
                    <strong>Crop:</strong> ${location.crop.charAt(0).toUpperCase() + location.crop.slice(1)}
                </div>
                <div class="detail-row">
                    <strong>Status:</strong> 
                    <span class="status-badge status-${location.status}">${location.status.charAt(0).toUpperCase() + location.status.slice(1)}</span>
                </div>
                <div class="detail-row">
                    <strong>Area:</strong> ${location.area} acres
                </div>
                <div class="detail-row">
                    <strong>Harvest Date:</strong> ${new Date(location.harvestDate).toLocaleDateString()}
                </div>
                <div class="detail-row">
                    <strong>Certification:</strong> ${location.organic ? 'Organic' : 'Standard'}
                </div>
                ${location.yield > 0 ? `
                <div class="detail-row">
                    <strong>Yield:</strong> ${location.yield} kg
                </div>
                ` : ''}
                <div class="detail-row">
                    <strong>Quality:</strong> ${location.quality}
                </div>
            </div>
            <div class="popup-actions">
                <button class="btn btn-sm btn-primary" onclick="viewLocationDetails('${location.id}')">
                    View Details
                </button>
                <button class="btn btn-sm btn-outline" onclick="editLocation('${location.id}')">
                    Edit
                </button>
            </div>
        </div>
    `;
    
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'harvest-popup-container'
    });
    
    return marker;
}

function getMarkerColor(status, organic) {
    const colors = {
        active: organic ? '#28a745' : '#17a2b8',
        completed: organic ? '#6f42c1' : '#6c757d',
        planned: organic ? '#fd7e14' : '#ffc107'
    };
    return colors[status] || '#6c757d';
}

function getCropIcon(crop) {
    const icons = {
        ashwagandha: 'fa-seedling',
        turmeric: 'fa-pepper-hot',
        brahmi: 'fa-leaf',
        neem: 'fa-tree',
        tulsi: 'fa-spa'
    };
    return icons[crop] || 'fa-seedling';
}

function filterHarvestLocations() {
    const cropFilter = document.getElementById('cropFilter').value;
    const seasonFilter = document.getElementById('seasonFilter').value;
    
    harvestMarkers.forEach(({ marker, data }) => {
        let show = true;
        
        if (cropFilter !== 'all' && data.crop !== cropFilter) {
            show = false;
        }
        
        if (seasonFilter !== 'all' && data.season !== seasonFilter) {
            show = false;
        }
        
        if (show) {
            marker.addTo(harvestMap);
        } else {
            harvestMap.removeLayer(marker);
        }
    });
    
    showNotification(`Filtered harvest locations by ${cropFilter !== 'all' ? cropFilter : 'all crops'} and ${seasonFilter !== 'all' ? seasonFilter : 'all seasons'}`, 'info');
}

function toggleHeatmap() {
    // Simulate heatmap toggle
    showNotification('Heatmap view toggled', 'info');
}

function onMapClick(e) {
    const popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(`
            <div class="map-click-popup">
                <p><strong>Location:</strong> ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}</p>
                <button class="btn btn-sm btn-primary" onclick="addHarvestLocationHere(${e.latlng.lat}, ${e.latlng.lng})">
                    Add Harvest Location Here
                </button>
            </div>
        `)
        .openOn(harvestMap);
}

function addHarvestLocationHere(lat, lng) {
    harvestMap.closePopup();
    showAddLocationModal(lat, lng);
}

function showAddLocationModal(lat = null, lng = null) {
    const modalHTML = `
        <div class="modal-overlay" id="addLocationModal">
            <div class="modal">
                <div class="modal-header">
                    <h3>Add Harvest Location</h3>
                    <button class="modal-close" onclick="closeModal('addLocationModal')">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="addLocationForm">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="locationName">Location Name</label>
                                <input type="text" id="locationName" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="locationCrop">Crop Type</label>
                                <select id="locationCrop" class="form-input" required>
                                    <option value="">Select Crop</option>
                                    <option value="ashwagandha">Ashwagandha</option>
                                    <option value="turmeric">Turmeric</option>
                                    <option value="brahmi">Brahmi</option>
                                    <option value="neem">Neem</option>
                                    <option value="tulsi">Tulsi</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="locationLat">Latitude</label>
                                <input type="number" id="locationLat" class="form-input" step="0.000001" value="${lat || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="locationLng">Longitude</label>
                                <input type="number" id="locationLng" class="form-input" step="0.000001" value="${lng || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="locationArea">Area (Acres)</label>
                                <input type="number" id="locationArea" class="form-input" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label for="locationHarvestDate">Harvest Date</label>
                                <input type="date" id="locationHarvestDate" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label for="locationStatus">Status</label>
                                <select id="locationStatus" class="form-input" required>
                                    <option value="planned">Planned</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="locationOrganic">
                                    <span class="checkmark"></span>
                                    Organic Certified
                                </label>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" onclick="closeModal('addLocationModal')">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="addHarvestLocation()">Add Location</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('addLocationModal').style.display = 'flex';
}

function addHarvestLocation() {
    const formData = {
        name: document.getElementById('locationName').value,
        crop: document.getElementById('locationCrop').value,
        lat: parseFloat(document.getElementById('locationLat').value),
        lng: parseFloat(document.getElementById('locationLng').value),
        area: parseFloat(document.getElementById('locationArea').value),
        harvestDate: document.getElementById('locationHarvestDate').value,
        status: document.getElementById('locationStatus').value,
        organic: document.getElementById('locationOrganic').checked
    };
    
    if (!formData.name || !formData.crop || !formData.lat || !formData.lng || !formData.area || !formData.harvestDate) {
        showNotification('Please fill in all required fields', 'warning');
        return;
    }
    
    showNotification('Adding harvest location...', 'info');
    
    setTimeout(() => {
        const newLocation = {
            id: 'LOC' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
            name: formData.name,
            lat: formData.lat,
            lng: formData.lng,
            crop: formData.crop,
            status: formData.status,
            area: formData.area,
            harvestDate: formData.harvestDate,
            season: '2024-winter',
            organic: formData.organic,
            yield: 0,
            quality: formData.organic ? 'Premium' : 'Standard'
        };
        
        const marker = createHarvestMarker(newLocation);
        harvestMarkers.push({ marker, data: newLocation });
        
        closeModal('addLocationModal');
        showNotification('Harvest location added successfully', 'success');
        
        // Update stats
        updateHarvestStats();
    }, 1500);
}

function updateHarvestStats() {
    const totalLocations = harvestMarkers.length;
    const activeHarvests = harvestMarkers.filter(({ data }) => data.status === 'active').length;
    const organicLocations = harvestMarkers.filter(({ data }) => data.organic).length;
    const totalArea = harvestMarkers.reduce((sum, { data }) => sum + data.area, 0);
    
    document.getElementById('totalLocations').textContent = totalLocations;
    document.getElementById('activeHarvests').textContent = activeHarvests;
    document.getElementById('organicLocations').textContent = organicLocations;
    document.getElementById('totalArea').textContent = Math.round(totalArea);
}

function viewLocationDetails(locationId) {
    showNotification(`Loading details for location ${locationId}...`, 'info');
}

function editLocation(locationId) {
    showNotification(`Opening edit form for location ${locationId}...`, 'info');
}

function exportHarvestLocations() {
    showNotification('Preparing harvest locations export...', 'info');
    
    setTimeout(() => {
        const csvContent = [
            'Location ID,Name,Crop,Latitude,Longitude,Area (Acres),Status,Harvest Date,Organic,Quality',
            ...harvestMarkers.map(({ data }) => 
                `${data.id},${data.name},${data.crop},${data.lat},${data.lng},${data.area},${data.status},${data.harvestDate},${data.organic ? 'Yes' : 'No'},${data.quality}`
            )
        ].join('\n');
        
        downloadCSV(csvContent, 'harvest_locations.csv');
        showNotification('Harvest locations exported successfully', 'success');
    }, 1500);
}

// Initialize dashboard functionality
function initializeDashboard() {
    // Set up navigation
    setupNavigation();
    
    // Load user data
    loadUserData();
    
    // Initialize charts
    initializeCharts();
    
    // Set default active section
    showSection('earnings');
}

// Setup navigation between sections
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update page title based on section
    updatePageTitle(sectionId);
}

// Update page title
function updatePageTitle(sectionId) {
    const titles = {
        'earnings': 'Monthly Earnings Dashboard',
        'submissions': 'Herb Submissions',
        'traceability': 'Herb Traceability',
        'losses': 'Loss Tracking',
        'market': 'Market Analytics',
        'crops': 'Crop Management'
    };
    
    const titleElement = document.querySelector('.page-title');
    if (titleElement && titles[sectionId]) {
        titleElement.textContent = titles[sectionId];
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterSubmissions(this.value);
        });
    }
    
    // Filter dropdown
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            filterSubmissionsByHerb(this.value);
        });
    }
    
    // Submit herbs button
    const submitButton = document.querySelector('.btn-primary');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            showSubmissionForm();
        });
    }
}

// Load user data
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'Rajesh Kumar',
        email: 'demo.farmer@ayurtrace.com',
        role: 'farmer'
    };
    
    // Update user display
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = userData.name;
    });
}

// Load submissions data into table
function loadSubmissionsData() {
    const tbody = document.querySelector('.submissions-data-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    submissionsData.forEach(submission => {
        const row = createSubmissionRow(submission);
        tbody.appendChild(row);
    });
}

// Create submission table row
function createSubmissionRow(submission) {
    const row = document.createElement('tr');
    
    const statusClass = submission.status;
    const gradeClass = submission.grade.toLowerCase();
    
    row.innerHTML = `
        <td><span class="batch-id">${submission.batchId}</span></td>
        <td><span class="herb-type ${submission.herbType.toLowerCase()}">${submission.herbType}</span></td>
        <td>${submission.weight}</td>
        <td><span class="grade-badge ${gradeClass}">Grade ${submission.grade}</span></td>
        <td>${submission.submissionDate}</td>
        <td><span class="status-badge ${statusClass}">${capitalizeFirst(submission.status)}</span></td>
        <td>₹${submission.rate}</td>
        <td>₹${submission.totalValue.toLocaleString()}</td>
        <td>
            ${getActionButtons(submission)}
        </td>
    `;
    
    return row;
}

// Get action buttons based on submission status
function getActionButtons(submission) {
    let buttons = `
        <button class="action-btn view" onclick="viewSubmission('${submission.batchId}')" title="View Details">
            <i class="fas fa-eye"></i>
        </button>
    `;
    
    if (submission.status === 'approved') {
        buttons += `
            <button class="action-btn track" onclick="trackSubmission('${submission.batchId}')" title="Track Batch">
                <i class="fas fa-route"></i>
            </button>
        `;
    } else if (submission.status === 'pending') {
        buttons += `
            <button class="action-btn edit" onclick="editSubmission('${submission.batchId}')" title="Edit Submission">
                <i class="fas fa-edit"></i>
            </button>
        `;
    } else if (submission.status === 'rejected') {
        buttons += `
            <button class="action-btn resubmit" onclick="resubmitBatch('${submission.batchId}')" title="Resubmit">
                <i class="fas fa-redo"></i>
            </button>
        `;
    }
    
    return buttons;
}

// Filter submissions by search term
function filterSubmissions(searchTerm) {
    const rows = document.querySelectorAll('.submissions-data-table tbody tr');
    
    rows.forEach(row => {
        const batchId = row.querySelector('.batch-id').textContent.toLowerCase();
        const herbType = row.querySelector('.herb-type').textContent.toLowerCase();
        
        if (batchId.includes(searchTerm.toLowerCase()) || 
            herbType.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Filter submissions by herb type
function filterSubmissionsByHerb(herbType) {
    const rows = document.querySelectorAll('.submissions-data-table tbody tr');
    
    rows.forEach(row => {
        const rowHerbType = row.querySelector('.herb-type').textContent.toLowerCase();
        
        if (herbType === 'all' || rowHerbType === herbType.toLowerCase()) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// View submission details
function viewSubmission(batchId) {
    const submission = submissionsData.find(s => s.batchId === batchId);
    if (!submission) return;
    
    showModal('Submission Details', createSubmissionDetailsHTML(submission));
}

// Create submission details HTML
function createSubmissionDetailsHTML(submission) {
    return `
        <div class="submission-details">
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Batch ID:</label>
                    <span class="batch-id">${submission.batchId}</span>
                </div>
                <div class="detail-item">
                    <label>Herb Type:</label>
                    <span>${submission.herbType}</span>
                </div>
                <div class="detail-item">
                    <label>Weight:</label>
                    <span>${submission.weight} kg</span>
                </div>
                <div class="detail-item">
                    <label>Grade:</label>
                    <span class="grade-badge ${submission.grade.toLowerCase()}">Grade ${submission.grade}</span>
                </div>
                <div class="detail-item">
                    <label>Status:</label>
                    <span class="status-badge ${submission.status}">${capitalizeFirst(submission.status)}</span>
                </div>
                <div class="detail-item">
                    <label>Submission Date:</label>
                    <span>${submission.submissionDate}</span>
                </div>
                <div class="detail-item">
                    <label>Harvest Date:</label>
                    <span>${submission.harvestDate}</span>
                </div>
                <div class="detail-item">
                    <label>Rate per kg:</label>
                    <span>₹${submission.rate}</span>
                </div>
                <div class="detail-item">
                    <label>Total Value:</label>
                    <span class="total-value">₹${submission.totalValue.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <label>Moisture Content:</label>
                    <span>${submission.moistureContent}</span>
                </div>
                <div class="detail-item full-width">
                    <label>Quality Notes:</label>
                    <span>${submission.qualityNotes}</span>
                </div>
            </div>
        </div>
    `;
}

// Track submission
function trackSubmission(batchId) {
    // Switch to traceability section and search for batch
    showSection('traceability');
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('[data-section="traceability"]').classList.add('active');
    
    // Set batch ID in search
    setTimeout(() => {
        const batchSearch = document.querySelector('.batch-search');
        if (batchSearch) {
            batchSearch.value = batchId;
            // Trigger search
            searchBatch();
        }
    }, 100);
    
    showNotification('Redirected to traceability section', 'info');
}

// Edit submission
function editSubmission(batchId) {
    const submission = submissionsData.find(s => s.batchId === batchId);
    if (!submission) return;
    
    showModal('Edit Submission', createEditSubmissionHTML(submission));
}

// Create edit submission HTML
function createEditSubmissionHTML(submission) {
    return `
        <div class="edit-submission-form">
            <form onsubmit="updateSubmission(event, '${submission.batchId}')">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Batch ID:</label>
                        <input type="text" value="${submission.batchId}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Herb Type:</label>
                        <select name="herbType">
                            <option value="Ashwagandha" ${submission.herbType === 'Ashwagandha' ? 'selected' : ''}>Ashwagandha</option>
                            <option value="Turmeric" ${submission.herbType === 'Turmeric' ? 'selected' : ''}>Turmeric</option>
                            <option value="Brahmi" ${submission.herbType === 'Brahmi' ? 'selected' : ''}>Brahmi</option>
                            <option value="Neem" ${submission.herbType === 'Neem' ? 'selected' : ''}>Neem</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Weight (kg):</label>
                        <input type="number" name="weight" value="${submission.weight}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label>Moisture Content (%):</label>
                        <input type="text" name="moistureContent" value="${submission.moistureContent}" required>
                    </div>
                    <div class="form-group full-width">
                        <label>Quality Notes:</label>
                        <textarea name="qualityNotes" rows="3">${submission.qualityNotes}</textarea>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Submission</button>
                </div>
            </form>
        </div>
    `;
}

// Update submission
function updateSubmission(event, batchId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const updatedData = {
        herbType: formData.get('herbType'),
        weight: parseInt(formData.get('weight')),
        moistureContent: formData.get('moistureContent'),
        qualityNotes: formData.get('qualityNotes')
    };
    
    // Update in data array
    const submissionIndex = submissionsData.findIndex(s => s.batchId === batchId);
    if (submissionIndex !== -1) {
        Object.assign(submissionsData[submissionIndex], updatedData);
        
        // Recalculate total value if weight changed
        const submission = submissionsData[submissionIndex];
        submission.totalValue = submission.weight * submission.rate;
        
        // Reload table
        loadSubmissionsData();
        
        closeModal();
        showNotification('Submission updated successfully', 'success');
    }
}

// Resubmit batch
function resubmitBatch(batchId) {
    const submission = submissionsData.find(s => s.batchId === batchId);
    if (!submission) return;
    
    // Change status to pending
    submission.status = 'pending';
    
    // Reload table
    loadSubmissionsData();
    
    showNotification('Batch resubmitted for review', 'success');
}

// Show submission form
function showSubmissionForm() {
    const formHTML = `
        <div class="new-submission-form">
            <form onsubmit="submitNewBatch(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Herb Type:</label>
                        <select name="herbType" required>
                            <option value="">Select Herb Type</option>
                            <option value="Ashwagandha">Ashwagandha</option>
                            <option value="Turmeric">Turmeric</option>
                            <option value="Brahmi">Brahmi</option>
                            <option value="Neem">Neem</option>
                            <option value="Amla">Amla</option>
                            <option value="Tulsi">Tulsi</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Weight (kg):</label>
                        <input type="number" name="weight" min="1" step="0.1" required>
                    </div>
                    <div class="form-group">
                        <label>Harvest Date:</label>
                        <input type="date" name="harvestDate" required>
                    </div>
                    <div class="form-group">
                        <label>Moisture Content (%):</label>
                        <input type="number" name="moistureContent" min="0" max="100" step="0.1" required>
                    </div>
                    <div class="form-group full-width">
                        <label>Quality Notes:</label>
                        <textarea name="qualityNotes" rows="3" placeholder="Describe the quality, appearance, and any special characteristics..."></textarea>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Submit Batch</button>
                </div>
            </form>
        </div>
    `;
    
    showModal('Submit New Batch', formHTML);
}

// Submit new batch
function submitNewBatch(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const herbType = formData.get('herbType');
    
    // Generate batch ID
    const herbCode = herbType.substring(0, 3).toUpperCase();
    const batchNumber = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const batchId = `${herbCode}-2024-${batchNumber}`;
    
    // Get current market rate (simplified)
    const marketRates = {
        'Ashwagandha': 190,
        'Turmeric': 180,
        'Brahmi': 280,
        'Neem': 120,
        'Amla': 150,
        'Tulsi': 200
    };
    
    const weight = parseFloat(formData.get('weight'));
    const rate = marketRates[herbType] || 100;
    
    const newSubmission = {
        batchId: batchId,
        herbType: herbType,
        weight: weight,
        grade: 'A', // Default grade
        submissionDate: new Date().toLocaleDateString('en-GB'),
        status: 'pending',
        rate: rate,
        totalValue: weight * rate,
        farmer: 'Rajesh Kumar',
        location: 'Rajasthan',
        harvestDate: formData.get('harvestDate'),
        moistureContent: formData.get('moistureContent') + '%',
        qualityNotes: formData.get('qualityNotes') || 'Standard quality submission'
    };
    
    // Add to data array
    submissionsData.unshift(newSubmission);
    
    // Reload table
    loadSubmissionsData();
    
    closeModal();
    showNotification(`New batch ${batchId} submitted successfully`, 'success');
}

// Initialize charts
function initializeCharts() {
    initializeEarningsChart();
    initializeHerbBreakdownChart();
    initializeLossChart();
    initializeMarketTrendChart();
}

// Initialize earnings chart
function initializeEarningsChart() {
    const ctx = document.getElementById('earningsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [{
                label: 'Monthly Revenue',
                data: [185000, 192000, 198000, 188000, 205000, 212000, 208000, 218000, 225000],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3
            }, {
                label: 'Net Profit',
                data: [142000, 148000, 152000, 145000, 158000, 164000, 160000, 168000, 174000],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 130000,
                    max: 240000,
                    ticks: {
                        stepSize: 20000,
                        callback: function(value) {
                            return '₹' + Math.round(value / 1000) + 'K';
                        }
                    }
                }
            }
        }
    });
}

// Initialize herb breakdown chart
function initializeHerbBreakdownChart() {
    const ctx = document.getElementById('herbBreakdownChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ashwagandha', 'Turmeric', 'Brahmi', 'Neem', 'Amla', 'Tulsi'],
            datasets: [{
                data: [85000, 65000, 45000, 25000, 15000, 10000],
                backgroundColor: [
                    '#059669',
                    '#f59e0b',
                    '#3b82f6',
                    '#ef4444',
                    '#8b5cf6',
                    '#06b6d4'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ₹' + context.parsed.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize loss chart
function initializeLossChart() {
    const ctx = document.getElementById('lossChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Harvesting', 'Cleaning', 'Drying', 'Packaging', 'Storage', 'Transport'],
            datasets: [{
                label: 'Loss Percentage',
                data: [8.5, 5.2, 12.3, 3.1, 6.8, 2.4],
                backgroundColor: [
                    '#ef4444',
                    '#f59e0b',
                    '#3b82f6',
                    '#22c55e',
                    '#8b5cf6',
                    '#06b6d4'
                ],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 15,
                    ticks: {
                        stepSize: 2,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Initialize market trend chart
let marketChart = null;

function initializeMarketTrendChart() {
    const ctx = document.getElementById('marketTrendChart');
    if (!ctx) return;
    
    marketChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Ashwagandha',
                data: [185, 187, 190, 188, 192, 195, 190],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#059669',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: 'Turmeric',
                data: [175, 177, 180, 178, 179, 182, 180],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: 'Brahmi',
                data: [275, 278, 280, 285, 287, 290, 288],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: 'Neem',
                data: [120, 118, 115, 112, 110, 108, 105],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
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
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#059669',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.parsed.y + '/kg';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                },
                y: {
                    beginAtZero: false,
                    min: 100,
                    max: 300,
                    ticks: {
                        stepSize: 25,
                        callback: function(value) {
                            return '₹' + value;
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

// Update market chart based on time period
function updateMarketChart(period) {
    if (!marketChart) return;
    
    // Update active button
    document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-period="${period}"]`).classList.add('active');
    
    let labels, datasets;
    
    switch(period) {
        case '7d':
            labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
            datasets = [{
                label: 'Ashwagandha',
                data: [185, 187, 190, 188, 192, 195, 190],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#059669',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: 'Turmeric',
                data: [175, 177, 180, 178, 179, 182, 180],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: 'Brahmi',
                data: [275, 278, 280, 285, 287, 290, 288],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: 'Neem',
                data: [120, 118, 115, 112, 110, 108, 105],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }];
            break;
            
        case '30d':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            datasets = [{
                label: 'Ashwagandha',
                data: [180, 185, 190, 195],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#059669',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }, {
                label: 'Turmeric',
                data: [170, 175, 180, 182],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }, {
                label: 'Brahmi',
                data: [270, 275, 285, 290],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }, {
                label: 'Neem',
                data: [125, 120, 115, 108],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }];
            break;
            
        case '90d':
            labels = ['Month 1', 'Month 2', 'Month 3'];
            datasets = [{
                label: 'Ashwagandha',
                data: [175, 185, 195],
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#059669',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }, {
                label: 'Turmeric',
                data: [165, 175, 182],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }, {
                label: 'Brahmi',
                data: [260, 275, 290],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }, {
                label: 'Neem',
                data: [130, 120, 108],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }];
            break;
    }
    
    // Update chart data
    marketChart.data.labels = labels;
    marketChart.data.datasets = datasets;
    marketChart.update('active');
    
    // Update chart title
    const chartTitle = document.querySelector('.price-trend-chart .chart-header h3');
    if (chartTitle) {
        const titles = {
            '7d': '7-Day Price Trends',
            '30d': '30-Day Price Trends',
            '90d': '90-Day Price Trends'
        };
        chartTitle.textContent = titles[period];
    }
    
    showNotification(`Chart updated to show ${period.toUpperCase()} trends`, 'info');
}

// Refresh market rates
function refreshMarketRates() {
    showNotification('Refreshing market rates...', 'info');
    
    // Simulate API call delay
    setTimeout(() => {
        // Update rate values with small random changes
        const rateItems = document.querySelectorAll('.rate-item');
        rateItems.forEach(item => {
            const currentRateElement = item.querySelector('.current-rate');
            const changeElement = item.querySelector('.rate-change');
            
            if (currentRateElement && changeElement) {
                const currentRate = parseInt(currentRateElement.textContent.replace(/[₹\/kg]/g, ''));
                const change = Math.floor(Math.random() * 10) - 5; // Random change between -5 and +5
                const newRate = currentRate + change;
                const changePercent = Math.round((change / currentRate) * 100);
                
                currentRateElement.textContent = `₹${newRate}/kg`;
                
                if (change > 0) {
                    changeElement.textContent = `+₹${change} (+${changePercent}%)`;
                    changeElement.className = 'rate-change positive';
                    item.className = 'rate-item trending-up';
                    item.querySelector('.trend-indicator').className = 'trend-indicator up';
                    item.querySelector('.trend-indicator i').className = 'fas fa-arrow-up';
                } else if (change < 0) {
                    changeElement.textContent = `₹${change} (${changePercent}%)`;
                    changeElement.className = 'rate-change negative';
                    item.className = 'rate-item trending-down';
                    item.querySelector('.trend-indicator').className = 'trend-indicator down';
                    item.querySelector('.trend-indicator i').className = 'fas fa-arrow-down';
                } else {
                    changeElement.textContent = 'No change';
                    changeElement.className = 'rate-change neutral';
                    item.className = 'rate-item stable';
                    item.querySelector('.trend-indicator').className = 'trend-indicator stable';
                    item.querySelector('.trend-indicator i').className = 'fas fa-minus';
                }
            }
        });
        
        // Update chart with new data
        if (marketChart) {
            const activeButton = document.querySelector('.chart-btn.active');
            if (activeButton) {
                updateMarketChart(activeButton.getAttribute('data-period'));
            }
        }
        
        showNotification('Market rates updated successfully', 'success');
    }, 1500);
}
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.user-menu')) {
            dropdown.classList.remove('show');
        }
    });
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
    }
});

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
    if (settings.pushNotifications !== undefined) {
        document.getElementById('pushNotifications').checked = settings.pushNotifications;
    }
    
    // Apply dashboard preferences
    if (settings.defaultView) {
        document.getElementById('defaultView').value = settings.defaultView;
    }
    if (settings.currency) {
        document.getElementById('currency').value = settings.currency;
    }
    if (settings.language) {
        document.getElementById('language').value = settings.language;
    }
    
    // Apply privacy settings
    if (settings.profileVisibility !== undefined) {
        document.getElementById('profileVisibility').checked = settings.profileVisibility;
    }
    if (settings.dataSharing !== undefined) {
        document.getElementById('dataSharing').checked = settings.dataSharing;
    }
}

// Enhanced Profile and Settings Functions
function showProfile() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '9999';
        
        // Load existing user data from localStorage or use defaults
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const defaultData = {
            fullName: 'Rajesh Kumar',
            email: 'rajesh.kumar@ayurtrace.com',
            phone: '+91 98765 43210',
            location: 'Rajasthan, India',
            farmSize: '25',
            experience: '12',
            specialization: 'medicinal-herbs',
            bio: 'Experienced farmer specializing in organic medicinal herbs cultivation with focus on Ashwagandha, Turmeric, and Brahmi.'
        };
        
        // Merge current user data with defaults
        const userData = { ...defaultData, ...currentUser };
        
        // Populate form fields
        document.getElementById('fullName').value = userData.fullName || '';
        document.getElementById('email').value = userData.email || '';
        document.getElementById('phone').value = userData.phone || '';
        document.getElementById('location').value = userData.location || '';
        document.getElementById('farmSize').value = userData.farmSize || '';
        document.getElementById('experience').value = userData.experience || '';
        document.getElementById('specialization').value = userData.specialization || 'medicinal-herbs';
        document.getElementById('bio').value = userData.bio || '';
    }
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function showSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '9999';
    }
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function showHelp() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '9999';
    }
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Clear user session and settings
        localStorage.removeItem('userSession');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userSettings');
        
        // Show logout notification
        showNotification('Logging out...', 'info');
        
        // Redirect to auth page after short delay
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
    }
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
    
    // Validate required fields
    if (!profileData.fullName || !profileData.email || !profileData.phone) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Update user data in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    Object.assign(currentUser, profileData);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI elements
    updateProfileDisplay(profileData);
    
    showNotification('Profile updated successfully!', 'success');
    closeModal('profileModal');
}

function updateProfileDisplay(profileData) {
    // Update user name in header
    const userNameElements = document.querySelectorAll('.user-name, .farmer-name');
    userNameElements.forEach(element => {
        if (element) element.textContent = profileData.fullName || 'Rajesh Kumar';
    });
    
    // Update user details in dropdown
    const userDetailsElement = document.querySelector('.user-details h4');
    if (userDetailsElement) {
        userDetailsElement.textContent = profileData.fullName || 'Rajesh Kumar';
    }
    
    // Update any other profile displays
    const profileElements = document.querySelectorAll('[data-profile-field]');
    profileElements.forEach(element => {
        const field = element.getAttribute('data-profile-field');
        if (profileData[field]) {
            element.textContent = profileData[field];
        }
    });
    
    // Update avatar initials if name changed
    const avatarElements = document.querySelectorAll('.avatar-circle span, .user-avatar span');
    avatarElements.forEach(element => {
        if (profileData.fullName) {
            const initials = profileData.fullName.split(' ').map(name => name[0]).join('').toUpperCase();
            element.textContent = initials;
        }
    });
}

// Crop Management Functions
function addNewCrop() {
    const modal = document.getElementById('addCropModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '9999';
        
        // Reset form
        document.getElementById('addCropForm').reset();
        
        // Set default planting date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('plantingDate').value = today;
    }
}

function saveCrop(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const cropData = Object.fromEntries(formData);
    
    // Validate required fields
    if (!cropData.cropName || !cropData.cropType || !cropData.plantingDate || !cropData.areaSize) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Generate unique crop ID
    cropData.id = 'crop_' + Date.now();
    cropData.status = 'Active';
    cropData.dateAdded = new Date().toISOString();
    
    // Calculate days since planting
    const plantingDate = new Date(cropData.plantingDate);
    const today = new Date();
    const daysSincePlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));
    cropData.daysSincePlanting = daysSincePlanting;
    
    // Get existing crops from localStorage
    const existingCrops = JSON.parse(localStorage.getItem('farmerCrops') || '[]');
    
    // Add new crop
    existingCrops.push(cropData);
    
    // Save to localStorage
    localStorage.setItem('farmerCrops', JSON.stringify(existingCrops));
    
    // Update crop display
    updateCropDisplay();
    
    showNotification('Crop added successfully!', 'success');
    closeModal('addCropModal');
}

function updateCropDisplay() {
    const crops = JSON.parse(localStorage.getItem('farmerCrops') || '[]');
    
    // Update total cultivated area
    const totalArea = crops.reduce((sum, crop) => sum + parseFloat(crop.areaSize || 0), 0);
    const areaElement = document.querySelector('.crop-summary-card .summary-info h3');
    if (areaElement && areaElement.textContent.includes('acres')) {
        areaElement.textContent = `${Math.round(totalArea)} acres`;
    }
    
    // Update crop varieties count
    const varietiesElement = document.querySelectorAll('.crop-summary-card .summary-info h3')[1];
    if (varietiesElement) {
        varietiesElement.textContent = crops.length.toString();
    }
    
    // Update active crops count
    const activeCrops = crops.filter(crop => crop.status === 'Active').length;
    const activeElement = document.querySelectorAll('.crop-summary-card .summary-info h3')[2];
    if (activeElement) {
        activeElement.textContent = activeCrops.toString();
    }
    
    // Create or update crops table
    createCropsTable(crops);
}

function createCropsTable(crops) {
    // Find or create crops table container
    let tableContainer = document.querySelector('.crops-table-container');
    if (!tableContainer) {
        tableContainer = document.createElement('div');
        tableContainer.className = 'crops-table-container';
        
        const cropsOverview = document.querySelector('.crops-overview');
        if (cropsOverview) {
            cropsOverview.appendChild(tableContainer);
        }
    }
    
    if (crops.length === 0) {
        tableContainer.innerHTML = '<p class="no-crops">No crops added yet. Click "Add Crop" to get started.</p>';
        return;
    }
    
    const tableHTML = `
        <div class="table-header">
            <h3>Current Crops</h3>
            <div class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick="exportCropsData()">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="crops-table">
                <thead>
                    <tr>
                        <th>Crop Name</th>
                        <th>Type</th>
                        <th>Area (acres)</th>
                        <th>Planting Date</th>
                        <th>Days Since Planting</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${crops.map(crop => `
                        <tr>
                            <td>
                                <div class="crop-name">
                                    <strong>${crop.cropName}</strong>
                                    ${crop.seedVariety ? `<small>${crop.seedVariety}</small>` : ''}
                                </div>
                            </td>
                            <td><span class="crop-type-badge ${crop.cropType}">${formatCropType(crop.cropType)}</span></td>
                            <td>${crop.areaSize}</td>
                            <td>${formatDate(crop.plantingDate)}</td>
                            <td>${crop.daysSincePlanting} days</td>
                            <td><span class="status-badge ${crop.status.toLowerCase()}">${crop.status}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon" onclick="viewCropDetails('${crop.id}')" title="View Details">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon" onclick="editCrop('${crop.id}')" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon delete" onclick="deleteCrop('${crop.id}')" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

function formatCropType(type) {
    const types = {
        'medicinal': 'Medicinal Herb',
        'spice': 'Spice',
        'aromatic': 'Aromatic Plant',
        'vegetable': 'Vegetable',
        'other': 'Other'
    };
    return types[type] || type;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function viewCropDetails(cropId) {
    const crops = JSON.parse(localStorage.getItem('farmerCrops') || '[]');
    const crop = crops.find(c => c.id === cropId);
    if (crop) {
        showNotification(`Viewing details for ${crop.cropName}`, 'info');
        // Could implement a detailed view modal here
    }
}

function editCrop(cropId) {
    const crops = JSON.parse(localStorage.getItem('farmerCrops') || '[]');
    const crop = crops.find(c => c.id === cropId);
    if (crop) {
        // Populate form with existing data
        document.getElementById('cropName').value = crop.cropName;
        document.getElementById('cropType').value = crop.cropType;
        document.getElementById('plantingDate').value = crop.plantingDate;
        document.getElementById('expectedHarvest').value = crop.expectedHarvest || '';
        document.getElementById('areaSize').value = crop.areaSize;
        document.getElementById('seedVariety').value = crop.seedVariety || '';
        document.getElementById('irrigationType').value = crop.irrigationType || '';
        document.getElementById('soilType').value = crop.soilType || '';
        document.getElementById('cropNotes').value = crop.cropNotes || '';
        
        // Store crop ID for update
        document.getElementById('addCropForm').setAttribute('data-edit-id', cropId);
        
        // Show modal
        addNewCrop();
    }
}

function deleteCrop(cropId) {
    if (confirm('Are you sure you want to delete this crop?')) {
        const crops = JSON.parse(localStorage.getItem('farmerCrops') || '[]');
        const updatedCrops = crops.filter(c => c.id !== cropId);
        localStorage.setItem('farmerCrops', JSON.stringify(updatedCrops));
        updateCropDisplay();
        showNotification('Crop deleted successfully', 'success');
    }
}

function exportCropsData() {
    const crops = JSON.parse(localStorage.getItem('farmerCrops') || '[]');
    if (crops.length === 0) {
        showNotification('No crops data to export', 'info');
        return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Crop Name,Type,Area (acres),Planting Date,Expected Harvest,Seed Variety,Irrigation,Soil Type,Status,Notes\n"
        + crops.map(crop => 
            `"${crop.cropName}","${formatCropType(crop.cropType)}","${crop.areaSize}","${crop.plantingDate}","${crop.expectedHarvest || ''}","${crop.seedVariety || ''}","${crop.irrigationType || ''}","${crop.soilType || ''}","${crop.status}","${crop.cropNotes || ''}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `crops_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Crops data exported successfully', 'success');
}

// Initialize crop display on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCropDisplay();
});

function saveSettings(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const settingsData = Object.fromEntries(formData);
    
    // Handle checkboxes
    const checkboxes = ['emailNotifications', 'smsNotifications', 'pushNotifications', 'profileVisibility', 'dataSharing'];
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
    const userDetails = document.querySelector('.user-details h4');
    if (userDetails && profileData.fullName) {
        userDetails.textContent = profileData.fullName;
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

// Help and Support Functions
function showHelpTopic(topic) {
    const topics = {
        'getting-started': 'Welcome to AyurTrace! This guide will help you get started with submitting herbs, tracking earnings, and using all dashboard features.',
        'submissions': 'To submit herbs: 1) Click Submit Herbs button, 2) Fill in herb details, 3) Upload quality photos, 4) Submit for approval.',
        'earnings': 'Your earnings dashboard shows monthly revenue, herb-wise breakdown, and financial trends to help optimize your farming business.',
        'traceability': 'Track your herbs from farm to market using batch IDs. View the complete supply chain journey and quality checkpoints.'
    };
    
    alert(topics[topic] || 'Help topic not found.');
}

function openResource(resource) {
    const resources = {
        'user-guide': '#',
        'video-tutorials': '#',
        'faq': '#',
        'community': '#'
    };
    
    showNotification(`Opening ${resource.replace('-', ' ')}...`, 'info');
    // In a real app, this would open the actual resource
}

// Utility functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Modal functions
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on overlay click
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

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Search batch function for traceability
function searchBatch() {
    const batchInput = document.querySelector('.batch-search');
    if (!batchInput) return;
    
    const batchId = batchInput.value.trim();
    if (!batchId) return;
    
    // Find batch in submissions data
    const batch = submissionsData.find(s => s.batchId.toLowerCase() === batchId.toLowerCase());
    
    if (batch) {
        showTraceabilityResults(batch);
    } else {
        showNotification('Batch not found', 'error');
    }
}

// Show traceability results
function showTraceabilityResults(batch) {
    // This will be implemented when working on traceability section
    showNotification(`Traceability data loaded for ${batch.batchId}`, 'success');
}

// Advanced Features

// Export data functionality
function exportData() {
    const exportModal = `
        <div class="export-options">
            <h4>Export Data</h4>
            <div class="export-grid">
                <div class="export-option" onclick="exportSubmissions()">
                    <i class="fas fa-file-csv"></i>
                    <h5>Submissions Data</h5>
                    <p>Export all herb submissions as CSV</p>
                </div>
                <div class="export-option" onclick="exportEarnings()">
                    <i class="fas fa-chart-line"></i>
                    <h5>Earnings Report</h5>
                    <p>Monthly earnings and profit analysis</p>
                </div>
                <div class="export-option" onclick="exportLosses()">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h5>Loss Analysis</h5>
                    <p>Detailed loss tracking report</p>
                </div>
                <div class="export-option" onclick="exportFullReport()">
                    <i class="fas fa-file-pdf"></i>
                    <h5>Complete Report</h5>
                    <p>Comprehensive farming report</p>
                </div>
            </div>
        </div>
    `;
    
    showModal('Export Data', exportModal);
}

// Export submissions as CSV
function exportSubmissions() {
    const headers = ['Batch ID', 'Herb Type', 'Weight (kg)', 'Grade', 'Submission Date', 'Status', 'Rate (₹/kg)', 'Total Value'];
    const csvContent = [
        headers.join(','),
        ...submissionsData.map(row => [
            row.batchId,
            row.herbType,
            row.weight,
            `Grade ${row.grade}`,
            row.submissionDate,
            row.status,
            row.rate,
            row.totalValue
        ].join(','))
    ].join('\n');
    
    downloadCSV(csvContent, 'herb_submissions.csv');
    closeModal();
    showNotification('Submissions data exported successfully', 'success');
}

// Export earnings report
function exportEarnings() {
    const earningsData = [
        ['Month', 'Revenue', 'Profit', 'Submissions'],
        ['January', '180000', '135000', '42'],
        ['February', '195000', '146000', '45'],
        ['March', '210000', '158000', '48'],
        ['April', '185000', '139000', '41'],
        ['May', '225000', '169000', '52'],
        ['June', '240000', '180000', '55'],
        ['July', '220000', '165000', '49'],
        ['August', '235000', '176000', '53'],
        ['September', '245000', '185000', '55']
    ];
    
    const csvContent = earningsData.map(row => row.join(',')).join('\n');
    downloadCSV(csvContent, 'earnings_report.csv');
    closeModal();
    showNotification('Earnings report exported successfully', 'success');
}

// Export loss analysis
function exportLosses() {
    const lossData = [
        ['Stage', 'Loss Percentage', 'Weight Lost (kg)', 'Value Lost (₹)'],
        ['Harvesting', '8.5', '42.5', '8075'],
        ['Cleaning', '5.2', '26', '4940'],
        ['Drying', '12.3', '61.5', '11685'],
        ['Packaging', '3.1', '15.5', '2945'],
        ['Storage', '6.8', '34', '6460'],
        ['Transport', '2.4', '12', '2280']
    ];
    
    const csvContent = lossData.map(row => row.join(',')).join('\n');
    downloadCSV(csvContent, 'loss_analysis.csv');
    closeModal();
    showNotification('Loss analysis exported successfully', 'success');
}

// Export complete report
function exportFullReport() {
    // Simulate PDF generation
    showNotification('Generating comprehensive report...', 'info');
    
    setTimeout(() => {
        closeModal();
        showNotification('Complete farming report generated and downloaded', 'success');
    }, 2000);
}

// Download CSV helper
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

// Real-time notifications system
function initializeNotificationSystem() {
    // Simulate real-time updates
    setInterval(() => {
        const notifications = [
            { message: 'New market rate update for Ashwagandha: ₹195/kg', type: 'info' },
            { message: 'Batch TUR-2024-067 approved by quality team', type: 'success' },
            { message: 'Weather alert: Heavy rain expected tomorrow', type: 'warning' },
            { message: 'Monthly earnings target achieved!', type: 'success' },
            { message: 'New buyer inquiry for Brahmi herbs', type: 'info' }
        ];
        
        // Random notification every 30-60 seconds
        if (Math.random() < 0.3) {
            const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
            showNotification(randomNotification.message, randomNotification.type);
        }
    }, 45000); // Check every 45 seconds
}

// Advanced search functionality
function setupAdvancedSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    // Add search suggestions
    const searchContainer = searchInput.parentElement;
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'search-suggestions';
    suggestionsDiv.style.display = 'none';
    searchContainer.appendChild(suggestionsDiv);
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length < 2) {
            suggestionsDiv.style.display = 'none';
            return;
        }
        
        const suggestions = submissionsData
            .filter(item => 
                item.batchId.toLowerCase().includes(query) ||
                item.herbType.toLowerCase().includes(query)
            )
            .slice(0, 5)
            .map(item => `${item.batchId} - ${item.herbType}`);
        
        if (suggestions.length > 0) {
            suggestionsDiv.innerHTML = suggestions
                .map(suggestion => `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`)
                .join('');
            suggestionsDiv.style.display = 'block';
        } else {
            suggestionsDiv.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });
}

// Select search suggestion
function selectSuggestion(suggestion) {
    const searchInput = document.querySelector('.search-input');
    const batchId = suggestion.split(' - ')[0];
    searchInput.value = batchId;
    filterSubmissions(batchId);
    document.querySelector('.search-suggestions').style.display = 'none';
}

// Bulk operations
function setupBulkOperations() {
    // Add bulk action controls to submissions table
    const tableHeader = document.querySelector('.table-header');
    if (!tableHeader) return;
    
    const bulkControls = document.createElement('div');
    bulkControls.className = 'bulk-controls';
    bulkControls.innerHTML = `
        <label class="bulk-select-all">
            <input type="checkbox" onchange="toggleSelectAll(this)">
            Select All
        </label>
        <button class="btn btn-outline bulk-action" onclick="bulkExport()" disabled>
            <i class="fas fa-download"></i> Export Selected
        </button>
        <button class="btn btn-outline bulk-action" onclick="bulkDelete()" disabled>
            <i class="fas fa-trash"></i> Delete Selected
        </button>
    `;
    
    tableHeader.appendChild(bulkControls);
    
    // Add checkboxes to table rows
    addRowCheckboxes();
}

// Add checkboxes to table rows
function addRowCheckboxes() {
    const table = document.querySelector('.submissions-data-table');
    if (!table) return;
    
    // Add header checkbox column
    const headerRow = table.querySelector('thead tr');
    const headerCheckbox = document.createElement('th');
    headerCheckbox.innerHTML = '<input type="checkbox" onchange="toggleSelectAll(this)">';
    headerRow.insertBefore(headerCheckbox, headerRow.firstChild);
    
    // Add checkboxes to data rows
    const dataRows = table.querySelectorAll('tbody tr');
    dataRows.forEach(row => {
        const checkbox = document.createElement('td');
        checkbox.innerHTML = '<input type="checkbox" class="row-checkbox" onchange="updateBulkActions()">';
        row.insertBefore(checkbox, row.firstChild);
    });
}

// Toggle select all checkboxes
function toggleSelectAll(checkbox) {
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    rowCheckboxes.forEach(cb => cb.checked = checkbox.checked);
    updateBulkActions();
}

// Update bulk action buttons
function updateBulkActions() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const bulkButtons = document.querySelectorAll('.bulk-action');
    
    bulkButtons.forEach(button => {
        button.disabled = checkedBoxes.length === 0;
    });
}

// Bulk export selected rows
function bulkExport() {
    const checkedRows = document.querySelectorAll('.row-checkbox:checked');
    const selectedData = Array.from(checkedRows).map(checkbox => {
        const row = checkbox.closest('tr');
        const batchId = row.querySelector('.batch-id').textContent;
        return submissionsData.find(item => item.batchId === batchId);
    });
    
    const headers = ['Batch ID', 'Herb Type', 'Weight (kg)', 'Grade', 'Status', 'Total Value'];
    const csvContent = [
        headers.join(','),
        ...selectedData.map(row => [
            row.batchId,
            row.herbType,
            row.weight,
            `Grade ${row.grade}`,
            row.status,
            row.totalValue
        ].join(','))
    ].join('\n');
    
    downloadCSV(csvContent, 'selected_submissions.csv');
    showNotification(`${selectedData.length} submissions exported`, 'success');
}

// Bulk delete selected rows
function bulkDelete() {
    const checkedRows = document.querySelectorAll('.row-checkbox:checked');
    if (checkedRows.length === 0) return;
    
    const confirmModal = `
        <div class="confirm-dialog">
            <p>Are you sure you want to delete ${checkedRows.length} selected submissions?</p>
            <div class="confirm-actions">
                <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="confirmBulkDelete()">Delete</button>
            </div>
        </div>
    `;
    
    showModal('Confirm Deletion', confirmModal);
}

// Confirm bulk delete
function confirmBulkDelete() {
    const checkedRows = document.querySelectorAll('.row-checkbox:checked');
    const batchIds = Array.from(checkedRows).map(checkbox => {
        const row = checkbox.closest('tr');
        return row.querySelector('.batch-id').textContent;
    });
    
    // Remove from data array
    batchIds.forEach(batchId => {
        const index = submissionsData.findIndex(item => item.batchId === batchId);
        if (index !== -1) {
            submissionsData.splice(index, 1);
        }
    });
    
    // Reload table
    loadSubmissionsData();
    closeModal();
    showNotification(`${batchIds.length} submissions deleted`, 'success');
}

// Initialize advanced features
function initializeAdvancedFeatures() {
    setupAdvancedSearch();
    setupBulkOperations();
    initializeNotificationSystem();
    
    // Add export button functionality
    const exportButton = document.querySelector('.btn-outline');
    if (exportButton && exportButton.textContent.includes('Export')) {
        exportButton.onclick = exportData;
    }
}

// GPS and Location Functions
function getCurrentLocation() {
    if (navigator.geolocation) {
        showNotification('Getting your current location...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                document.getElementById('gpsLatitude').value = latitude.toFixed(6);
                document.getElementById('gpsLongitude').value = longitude.toFixed(6);
                
                updateLocationPreview(latitude, longitude);
                showNotification('Location obtained successfully', 'success');
            },
            function(error) {
                let errorMessage = 'Unable to get location: ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access denied by user';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out';
                        break;
                    default:
                        errorMessage += 'Unknown error occurred';
                        break;
                }
                showNotification(errorMessage, 'error');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } else {
        showNotification('Geolocation is not supported by this browser', 'error');
    }
}

function updateLocationPreview(latitude, longitude) {
    const mapContainer = document.getElementById('locationMap');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="location-coordinates">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>Coordinates:</strong><br>
                    Lat: ${latitude.toFixed(6)}<br>
                    Lng: ${longitude.toFixed(6)}
                </div>
            </div>
        `;
    }
    
    // Update location info
    document.getElementById('zoneStatus').textContent = 'Validating...';
    document.getElementById('zoneStatus').className = 'status-badge pending';
    
    // Simulate zone validation
    setTimeout(() => {
        validateGeoFencing();
    }, 1000);
}

function validateGeoFencing() {
    const latitude = parseFloat(document.getElementById('gpsLatitude').value);
    const longitude = parseFloat(document.getElementById('gpsLongitude').value);
    const selectedZone = document.getElementById('geoZone').value;
    
    if (!latitude || !longitude) {
        showNotification('Please enter valid GPS coordinates', 'error');
        return;
    }
    
    showNotification('Validating geo-fencing...', 'info');
    
    // Simulate geo-fencing validation
    setTimeout(() => {
        const isValidZone = Math.random() > 0.2; // 80% success rate for demo
        const zoneStatusElement = document.getElementById('zoneStatus');
        const seasonalStatusElement = document.getElementById('seasonalStatus');
        const conservationStatusElement = document.getElementById('conservationStatus');
        
        if (isValidZone && selectedZone) {
            zoneStatusElement.textContent = 'Approved Zone';
            zoneStatusElement.className = 'status-badge approved';
            
            seasonalStatusElement.textContent = 'Harvest Allowed';
            seasonalStatusElement.className = 'status-badge approved';
            
            conservationStatusElement.textContent = 'Within Limits';
            conservationStatusElement.className = 'status-badge approved';
            
            showNotification('Location validated successfully', 'success');
        } else {
            zoneStatusElement.textContent = 'Invalid Zone';
            zoneStatusElement.className = 'status-badge rejected';
            
            seasonalStatusElement.textContent = 'Restricted';
            seasonalStatusElement.className = 'status-badge rejected';
            
            showNotification('Location validation failed - outside approved zone', 'error');
        }
    }, 2000);
}

function updateSpeciesInfo() {
    const speciesSelect = document.getElementById('speciesName');
    const selectedSpecies = speciesSelect.value;
    
    if (!selectedSpecies) return;
    
    // Species-specific information
    const speciesInfo = {
        ashwagandha: {
            optimalHumidity: '60-70%',
            harvestSeason: 'October-December',
            soilType: 'Sandy loam',
            notes: 'Harvest roots after 150-180 days'
        },
        turmeric: {
            optimalHumidity: '65-75%',
            harvestSeason: 'January-March',
            soilType: 'Well-drained loam',
            notes: 'Harvest rhizomes after 7-10 months'
        },
        brahmi: {
            optimalHumidity: '70-80%',
            harvestSeason: 'Year-round',
            soilType: 'Moist clay',
            notes: 'Harvest leaves regularly for best quality'
        },
        neem: {
            optimalHumidity: '50-60%',
            harvestSeason: 'May-August',
            soilType: 'Any well-drained soil',
            notes: 'Harvest leaves and bark sustainably'
        },
        tulsi: {
            optimalHumidity: '60-70%',
            harvestSeason: 'Year-round',
            soilType: 'Rich loam',
            notes: 'Harvest leaves before flowering'
        }
    };
    
    const info = speciesInfo[selectedSpecies];
    if (info) {
        // Auto-fill some fields based on species
        const soilTypeSelect = document.getElementById('soilType');
        if (soilTypeSelect && info.soilType.toLowerCase().includes('loam')) {
            soilTypeSelect.value = 'loam';
        } else if (info.soilType.toLowerCase().includes('clay')) {
            soilTypeSelect.value = 'clay';
        } else if (info.soilType.toLowerCase().includes('sandy')) {
            soilTypeSelect.value = 'sandy';
        }
        
        showNotification(`Species information loaded for ${speciesSelect.options[speciesSelect.selectedIndex].text}`, 'info');
    }
}

function recordCollectionEvent() {
    // Validate required fields
    const requiredFields = [
        { id: 'gpsLatitude', name: 'GPS Latitude' },
        { id: 'gpsLongitude', name: 'GPS Longitude' },
        { id: 'collectionDate', name: 'Collection Date' },
        { id: 'geoZone', name: 'Approved Zone' },
        { id: 'speciesName', name: 'Species Name' },
        { id: 'harvestMethod', name: 'Harvest Method' },
        { id: 'visualGrade', name: 'Visual Grade' }
    ];
    
    const missingFields = [];
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element || !element.value.trim()) {
            missingFields.push(field.name);
        }
    });
    
    if (missingFields.length > 0) {
        showNotification(`Please fill in required fields: ${missingFields.join(', ')}`, 'error');
        return;
    }
    
    // Check if zone is validated
    const zoneStatus = document.getElementById('zoneStatus');
    if (!zoneStatus || !zoneStatus.textContent.includes('Approved')) {
        showNotification('Please validate the geo-fencing zone first', 'error');
        return;
    }
    
    showNotification('Recording collection event...', 'info');
    
    // Collect all form data
    const collectionData = {
        latitude: document.getElementById('gpsLatitude').value,
        longitude: document.getElementById('gpsLongitude').value,
        collectionDate: document.getElementById('collectionDate').value,
        collectorId: document.getElementById('collectorId').value,
        geoZone: document.getElementById('geoZone').value,
        temperature: document.getElementById('temperature').value,
        humidity: document.getElementById('humidity').value,
        soilType: document.getElementById('soilType').value,
        speciesName: document.getElementById('speciesName').value,
        harvestMethod: document.getElementById('harvestMethod').value,
        plantAge: document.getElementById('plantAge').value,
        moistureContent: document.getElementById('moistureContent').value,
        visualGrade: document.getElementById('visualGrade').value,
        contaminationLevel: document.getElementById('contaminationLevel').value,
        timestamp: new Date().toISOString(),
        blockchainHash: generateBlockchainHash()
    };
    
    // Simulate blockchain recording
    setTimeout(() => {
        // Update blockchain status
        const blockchainStatus = document.getElementById('blockchainStatus');
        if (blockchainStatus) {
            blockchainStatus.textContent = 'Recorded on Blockchain';
            blockchainStatus.className = 'status-badge approved';
        }
        
        // Generate batch ID
        const species = document.getElementById('speciesName').value.toUpperCase().substring(0, 3);
        const batchId = `${species}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        
        showNotification(`Collection event recorded successfully! Batch ID: ${batchId}`, 'success');
        
        // Reset form
        resetCollectionForm();
        
        // Add to submissions data
        const newSubmission = {
            batchId: batchId,
            herbType: document.getElementById('speciesName').options[document.getElementById('speciesName').selectedIndex].text.split('(')[0].trim(),
            weight: Math.floor(Math.random() * 200) + 50, // Random weight for demo
            grade: document.getElementById('visualGrade').value.replace('Grade ', ''),
            submissionDate: new Date().toLocaleDateString('en-GB'),
            status: 'pending',
            rate: Math.floor(Math.random() * 200) + 100,
            totalValue: 0,
            farmer: 'Rajesh Kumar',
            location: 'Rajasthan',
            harvestDate: new Date(document.getElementById('collectionDate').value).toLocaleDateString('en-GB'),
            moistureContent: document.getElementById('moistureContent').value + '%',
            qualityNotes: 'Freshly recorded collection event'
        };
        
        newSubmission.totalValue = newSubmission.weight * newSubmission.rate;
        submissionsData.unshift(newSubmission);
        
        // Reload submissions table if visible
        if (document.getElementById('submissions').classList.contains('active')) {
            loadSubmissionsData();
        }
        
    }, 3000);
}

function generateBlockchainHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

function resetCollectionForm() {
    const form = document.querySelector('.gps-form-container');
    if (form) {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.id !== 'collectorId') { // Keep collector ID
                input.value = '';
            }
        });
        
        // Reset status badges
        document.getElementById('zoneStatus').textContent = 'Not Validated';
        document.getElementById('zoneStatus').className = 'status-badge pending';
        
        document.getElementById('seasonalStatus').textContent = 'Checking...';
        document.getElementById('seasonalStatus').className = 'status-badge pending';
        
        document.getElementById('blockchainStatus').textContent = 'Ready to Record';
        document.getElementById('blockchainStatus').className = 'status-badge pending';
        
        // Reset map preview
        const mapContainer = document.getElementById('locationMap');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-placeholder">
                    <i class="fas fa-map"></i>
                    <p>Location Preview</p>
                    <small>Enter coordinates to see location</small>
                </div>
            `;
        }
    }
}

// Export farmer data functionality
function exportFarmerData() {
    showNotification('Preparing data export...', 'info');
    
    // Simulate data preparation
    setTimeout(() => {
        const exportData = {
            farmer: {
                name: 'Rajesh Kumar',
                id: 'FRM001',
                location: 'Rajasthan',
                exportDate: new Date().toLocaleDateString('en-GB')
            },
            submissions: submissionsData,
            earnings: {
                totalEarnings: submissionsData.reduce((sum, sub) => sum + sub.totalValue, 0),
                totalWeight: submissionsData.reduce((sum, sub) => sum + sub.weight, 0),
                averageRate: submissionsData.reduce((sum, sub) => sum + sub.rate, 0) / submissionsData.length
            },
            harvestLocations: harvestMarkers.map(marker => marker.data)
        };
        
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add farmer info header
        csvContent += "Farmer Data Export\n";
        csvContent += `Farmer Name,${exportData.farmer.name}\n`;
        csvContent += `Farmer ID,${exportData.farmer.id}\n`;
        csvContent += `Location,${exportData.farmer.location}\n`;
        csvContent += `Export Date,${exportData.farmer.exportDate}\n\n`;
        
        // Add submissions data
        csvContent += "Herb Submissions\n";
        csvContent += "Batch ID,Herb Type,Weight (kg),Grade,Submission Date,Status,Rate (₹/kg),Total Value (₹),Harvest Date,Moisture Content,Quality Notes\n";
        
        exportData.submissions.forEach(sub => {
            csvContent += `${sub.batchId},${sub.herbType},${sub.weight},${sub.grade},${sub.submissionDate},${sub.status},${sub.rate},${sub.totalValue},${sub.harvestDate},${sub.moistureContent},"${sub.qualityNotes}"\n`;
        });
        
        csvContent += "\n";
        
        // Add earnings summary
        csvContent += "Earnings Summary\n";
        csvContent += `Total Earnings,₹${exportData.earnings.totalEarnings.toLocaleString()}\n`;
        csvContent += `Total Weight Submitted,${exportData.earnings.totalWeight} kg\n`;
        csvContent += `Average Rate,₹${Math.round(exportData.earnings.averageRate)}/kg\n\n`;
        
        // Add harvest locations if available
        if (exportData.harvestLocations.length > 0) {
            csvContent += "Harvest Locations\n";
            csvContent += "Location ID,Name,Crop,Area (acres),Status,Organic,Season,Coordinates\n";
            
            exportData.harvestLocations.forEach(loc => {
                csvContent += `${loc.id},${loc.name},${loc.crop},${loc.area},${loc.status},${loc.organic ? 'Yes' : 'No'},${loc.season},"${loc.lat}, ${loc.lng}"\n`;
            });
        }
        
        // Create and download file
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `farmer_data_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Data exported successfully! Check your downloads folder.', 'success');
    }, 1500);
}
