// Simplified Crop Upload Wizard for Farmers
// Designed for minimal typing and maximum visual guidance

class FarmerWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.cropData = {};
        this.init();
    }

    init() {
        this.createWizardModal();
        this.setupVoiceSupport();
    }

    // Create the main wizard modal
    createWizardModal() {
        const modal = document.createElement('div');
        modal.id = 'cropWizardModal';
        modal.className = 'wizard-modal';
        modal.innerHTML = `
            <div class="wizard-overlay">
                <div class="wizard-container">
                    <div class="wizard-header">
                        <h2 data-translate="add_crop">Add Your Crop</h2>
                        <div class="wizard-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 25%"></div>
                            </div>
                            <span class="progress-text">Step 1 of 4</span>
                        </div>
                        <button class="wizard-close" onclick="farmerWizard.closeWizard()">&times;</button>
                    </div>
                    <div class="wizard-content" id="wizardContent">
                        <!-- Steps will be loaded here -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Show the wizard
    showWizard() {
        this.currentStep = 1;
        this.cropData = {};
        this.loadStep(1);
        document.getElementById('cropWizardModal').style.display = 'flex';
        this.updateProgress();
    }

    // Close wizard
    closeWizard() {
        document.getElementById('cropWizardModal').style.display = 'none';
    }

    // Load specific step
    loadStep(step) {
        const content = document.getElementById('wizardContent');
        
        switch(step) {
            case 1:
                content.innerHTML = this.getStep1HTML();
                break;
            case 2:
                content.innerHTML = this.getStep2HTML();
                break;
            case 3:
                content.innerHTML = this.getStep3HTML();
                break;
            case 4:
                content.innerHTML = this.getStep4HTML();
                break;
        }
        
        this.currentStep = step;
        this.updateProgress();
    }

    // Step 1: Visual Crop Selection
    getStep1HTML() {
        return `
            <div class="wizard-step">
                <div class="step-header">
                    <h3>Select Your Crop</h3>
                    <p>Choose the herb you want to add</p>
                </div>
                <div class="crop-selection-grid">
                    <div class="crop-card" onclick="farmerWizard.selectCrop('ashwagandha')">
                        <img src="images/ashwagandha-capsules.svg" alt="Ashwagandha">
                        <h4 data-translate="ashwagandha">Ashwagandha</h4>
                        <p>अश्वगंधा</p>
                    </div>
                    <div class="crop-card" onclick="farmerWizard.selectCrop('turmeric')">
                        <img src="images/turmeric-powder.svg" alt="Turmeric">
                        <h4 data-translate="turmeric">Turmeric</h4>
                        <p>हल्दी</p>
                    </div>
                    <div class="crop-card" onclick="farmerWizard.selectCrop('brahmi')">
                        <img src="images/brahmi-oil.svg" alt="Brahmi">
                        <h4 data-translate="brahmi">Brahmi</h4>
                        <p>ब्राह्मी</p>
                    </div>
                    <div class="crop-card" onclick="farmerWizard.selectCrop('neem')">
                        <img src="images/neem-leaves.svg" alt="Neem">
                        <h4 data-translate="neem">Neem</h4>
                        <p>नीम</p>
                    </div>
                    <div class="crop-card" onclick="farmerWizard.selectCrop('tulsi')">
                        <img src="images/mixed-herbs.svg" alt="Tulsi">
                        <h4 data-translate="tulsi">Tulsi</h4>
                        <p>तुलसी</p>
                    </div>
                </div>
                <div class="step-actions">
                    <button class="btn btn-outline" onclick="farmerWizard.closeWizard()">Cancel</button>
                    <button class="btn btn-primary" id="nextBtn1" onclick="farmerWizard.nextStep()" disabled>Next</button>
                </div>
            </div>
        `;
    }

    // Step 2: Quantity Input with Visual Helpers
    getStep2HTML() {
        return `
            <div class="wizard-step">
                <div class="step-header">
                    <h3>How much do you have?</h3>
                    <p>Tell us the quantity of ${this.cropData.cropName}</p>
                </div>
                <div class="quantity-input-section">
                    <div class="selected-crop-display">
                        <img src="images/${this.cropData.cropType}-capsules.svg" alt="${this.cropData.cropName}">
                        <h4>${this.cropData.cropName}</h4>
                    </div>
                    <div class="quantity-controls">
                        <div class="quantity-buttons">
                            <button class="qty-btn" onclick="farmerWizard.setQuantity(10)">10 kg</button>
                            <button class="qty-btn" onclick="farmerWizard.setQuantity(25)">25 kg</button>
                            <button class="qty-btn" onclick="farmerWizard.setQuantity(50)">50 kg</button>
                            <button class="qty-btn" onclick="farmerWizard.setQuantity(100)">100 kg</button>
                        </div>
                        <div class="custom-quantity">
                            <label>Custom Amount:</label>
                            <div class="quantity-input-group">
                                <input type="number" id="customQuantity" placeholder="Enter amount" min="1" max="1000">
                                <span class="unit">kg</span>
                                <button class="voice-btn" onclick="farmerWizard.startVoiceInput('quantity')">
                                    <i class="fas fa-microphone"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="step-actions">
                    <button class="btn btn-outline" onclick="farmerWizard.prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="farmerWizard.nextStep()">Next</button>
                </div>
            </div>
        `;
    }

    // Step 3: Quality and Location
    getStep3HTML() {
        return `
            <div class="wizard-step">
                <div class="step-header">
                    <h3>Quality & Location</h3>
                    <p>Help us understand your crop better</p>
                </div>
                <div class="quality-location-section">
                    <div class="quality-selection">
                        <h4>Quality Grade:</h4>
                        <div class="quality-options">
                            <div class="quality-card" onclick="farmerWizard.selectQuality('premium')">
                                <div class="quality-icon premium">⭐⭐⭐</div>
                                <h5>Premium</h5>
                                <p>Best quality, no damage</p>
                            </div>
                            <div class="quality-card" onclick="farmerWizard.selectQuality('good')">
                                <div class="quality-icon good">⭐⭐</div>
                                <h5>Good</h5>
                                <p>Good quality, minor issues</p>
                            </div>
                            <div class="quality-card" onclick="farmerWizard.selectQuality('standard')">
                                <div class="quality-icon standard">⭐</div>
                                <h5>Standard</h5>
                                <p>Average quality</p>
                            </div>
                        </div>
                    </div>
                    <div class="location-section">
                        <h4>Location:</h4>
                        <button class="btn btn-outline location-btn" onclick="farmerWizard.getCurrentLocation()">
                            <i class="fas fa-map-marker-alt"></i>
                            Use Current Location
                        </button>
                        <div class="location-display" id="locationDisplay">
                            <p>Click button to get your location</p>
                        </div>
                    </div>
                </div>
                <div class="step-actions">
                    <button class="btn btn-outline" onclick="farmerWizard.prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="farmerWizard.nextStep()">Next</button>
                </div>
            </div>
        `;
    }

    // Step 4: Review and Submit
    getStep4HTML() {
        return `
            <div class="wizard-step">
                <div class="step-header">
                    <h3>Review Your Submission</h3>
                    <p>Please check all details before submitting</p>
                </div>
                <div class="review-section">
                    <div class="review-card">
                        <div class="review-item">
                            <img src="images/${this.cropData.cropType}-capsules.svg" alt="${this.cropData.cropName}">
                            <div class="review-details">
                                <h4>${this.cropData.cropName}</h4>
                                <p><strong>Quantity:</strong> ${this.cropData.quantity} kg</p>
                                <p><strong>Quality:</strong> ${this.cropData.quality}</p>
                                <p><strong>Location:</strong> ${this.cropData.location || 'Not set'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="step-actions">
                    <button class="btn btn-outline" onclick="farmerWizard.prevStep()">Back</button>
                    <button class="btn btn-success" onclick="farmerWizard.submitCrop()">
                        <i class="fas fa-check"></i>
                        Submit Crop
                    </button>
                </div>
            </div>
        `;
    }

    // Select crop
    selectCrop(cropType) {
        this.cropData.cropType = cropType;
        this.cropData.cropName = this.getCropName(cropType);
        
        // Update UI
        document.querySelectorAll('.crop-card').forEach(card => card.classList.remove('selected'));
        event.target.closest('.crop-card').classList.add('selected');
        document.getElementById('nextBtn1').disabled = false;
    }

    // Set quantity
    setQuantity(amount) {
        this.cropData.quantity = amount;
        document.getElementById('customQuantity').value = amount;
        
        // Update UI
        document.querySelectorAll('.qty-btn').forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');
    }

    // Select quality
    selectQuality(quality) {
        this.cropData.quality = quality;
        
        // Update UI
        document.querySelectorAll('.quality-card').forEach(card => card.classList.remove('selected'));
        event.target.closest('.quality-card').classList.add('selected');
    }

    // Get current location
    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.cropData.location = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
                    document.getElementById('locationDisplay').innerHTML = `
                        <p><i class="fas fa-check-circle" style="color: green;"></i> Location captured</p>
                        <small>${this.cropData.location}</small>
                    `;
                },
                (error) => {
                    document.getElementById('locationDisplay').innerHTML = `
                        <p><i class="fas fa-exclamation-circle" style="color: red;"></i> Could not get location</p>
                    `;
                }
            );
        }
    }

    // Voice input support
    startVoiceInput(field) {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-IN';
            recognition.onresult = (event) => {
                const result = event.results[0][0].transcript;
                if (field === 'quantity') {
                    const quantity = parseInt(result.match(/\d+/)?.[0]);
                    if (quantity) {
                        document.getElementById('customQuantity').value = quantity;
                        this.cropData.quantity = quantity;
                    }
                }
            };
            recognition.start();
        }
    }

    // Navigation methods
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.loadStep(this.currentStep + 1);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.loadStep(this.currentStep - 1);
        }
    }

    // Update progress bar
    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.querySelector('.progress-fill').style.width = progress + '%';
        document.querySelector('.progress-text').textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }

    // Submit crop
    submitCrop() {
        // Validate data
        if (!this.cropData.quantity) {
            this.cropData.quantity = document.getElementById('customQuantity').value;
        }

        // Show loading
        const submitBtn = event.target;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        // Simulate submission
        setTimeout(() => {
            this.showSuccessMessage();
            this.closeWizard();
        }, 2000);
    }

    // Show success message
    showSuccessMessage() {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Crop Added Successfully!</h3>
                <p>Your ${this.cropData.cropName} (${this.cropData.quantity} kg) has been submitted for approval.</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        document.body.appendChild(notification);
    }

    // Helper methods
    getCropName(cropType) {
        const names = {
            'ashwagandha': 'Ashwagandha',
            'turmeric': 'Turmeric', 
            'brahmi': 'Brahmi',
            'neem': 'Neem',
            'tulsi': 'Tulsi'
        };
        return names[cropType] || cropType;
    }

    setupVoiceSupport() {
        // Voice commands setup would go here
    }
}

// Initialize wizard
const farmerWizard = new FarmerWizard();

// Override the existing showSubmissionForm function
function showSubmissionForm() {
    farmerWizard.showWizard();
}
