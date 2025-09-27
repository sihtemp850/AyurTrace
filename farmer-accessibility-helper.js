// Farmer Accessibility Helper - Voice Guidance & Smart Features
// Designed for farmers with limited technology experience

class FarmerAccessibilityHelper {
    constructor() {
        this.voiceEnabled = false;
        this.speechSynthesis = window.speechSynthesis;
        this.recognition = null;
        this.currentLanguage = 'en';
        this.helpTooltips = {};
        this.smartDefaults = {};
        this.init();
    }

    init() {
        this.setupVoiceRecognition();
        this.setupSmartDefaults();
        this.createHelpSystem();
        this.addAccessibilityFeatures();
        this.setupGuidedTour();
    }

    // Voice Recognition Setup
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'hi-IN'; // Default to Hindi for Indian farmers
            
            this.recognition.onresult = (event) => {
                const result = event.results[0][0].transcript;
                this.processVoiceCommand(result);
            };
            
            this.recognition.onerror = (event) => {
                console.log('Voice recognition error:', event.error);
                this.showNotification('Voice input failed. Please try again.', 'warning');
            };
        }
    }

    // Process voice commands
    processVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Navigation commands
        if (lowerCommand.includes('earnings') || lowerCommand.includes('आय')) {
            this.navigateToSection('earnings');
            this.speak('Opening earnings section');
        } else if (lowerCommand.includes('add crop') || lowerCommand.includes('फसल जोड़')) {
            this.openCropWizard();
            this.speak('Opening crop addition wizard');
        } else if (lowerCommand.includes('help') || lowerCommand.includes('मदद')) {
            this.showGuidedTour();
            this.speak('Starting help tour');
        } else if (lowerCommand.includes('language') || lowerCommand.includes('भाषा')) {
            this.openLanguageSelector();
            this.speak('Opening language settings');
        }
        // Quantity input
        else if (lowerCommand.match(/\d+/)) {
            const quantity = lowerCommand.match(/\d+/)[0];
            this.fillQuantityInput(quantity);
            this.speak(`Quantity set to ${quantity} kilograms`);
        }
    }

    // Text-to-Speech
    speak(text, lang = 'en') {
        if (this.voiceEnabled && this.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            this.speechSynthesis.speak(utterance);
        }
    }

    // Smart Defaults System
    setupSmartDefaults() {
        this.smartDefaults = {
            location: null,
            farmerId: 'FRM001',
            defaultCrops: ['ashwagandha', 'turmeric', 'neem'],
            seasonalSuggestions: this.getSeasonalSuggestions(),
            weatherData: null
        };
        
        // Get user's location for smart defaults
        this.getCurrentLocationForDefaults();
        this.loadFarmerProfile();
    }

    getCurrentLocationForDefaults() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.smartDefaults.location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.getWeatherData();
                    this.getLocationBasedSuggestions();
                },
                (error) => {
                    console.log('Location access denied or failed');
                }
            );
        }
    }

    getSeasonalSuggestions() {
        const month = new Date().getMonth() + 1;
        const seasonalCrops = {
            // Winter (Nov-Feb)
            winter: ['ashwagandha', 'brahmi', 'neem'],
            // Summer (Mar-Jun)  
            summer: ['turmeric', 'neem', 'tulsi'],
            // Monsoon (Jul-Oct)
            monsoon: ['brahmi', 'tulsi', 'ashwagandha']
        };
        
        if (month >= 11 || month <= 2) return seasonalCrops.winter;
        if (month >= 3 && month <= 6) return seasonalCrops.summer;
        return seasonalCrops.monsoon;
    }

    async getWeatherData() {
        if (!this.smartDefaults.location) return;
        
        try {
            // Using a free weather API
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.smartDefaults.location.lat}&lon=${this.smartDefaults.location.lng}&appid=demo&units=metric`);
            if (response.ok) {
                this.smartDefaults.weatherData = await response.json();
                this.showWeatherBasedSuggestions();
            }
        } catch (error) {
            console.log('Weather data unavailable');
        }
    }

    // Help System with Tooltips
    createHelpSystem() {
        this.helpTooltips = {
            'earnings': 'View your monthly income from herb sales',
            'submissions': 'Add new herbs or check submission status',
            'traceability': 'Track your herbs through the supply chain',
            'add-crop-btn': 'Click here to add a new crop easily',
            'language-btn': 'Change language based on your preference',
            'export-btn': 'Download your farming data as a file'
        };
        
        this.addTooltipsToElements();
        this.createFloatingHelpButton();
    }

    addTooltipsToElements() {
        // Add tooltips to navigation items
        document.querySelectorAll('.nav-item').forEach((item, index) => {
            const section = item.getAttribute('data-section');
            if (this.helpTooltips[section]) {
                this.addTooltip(item, this.helpTooltips[section]);
            }
        });
        
        // Add tooltips to action buttons
        const addCropBtn = document.querySelector('button[onclick="showSubmissionForm()"]');
        if (addCropBtn) {
            this.addTooltip(addCropBtn, this.helpTooltips['add-crop-btn']);
        }
    }

    addTooltip(element, text) {
        element.setAttribute('data-tooltip', text);
        element.addEventListener('mouseenter', (e) => this.showTooltip(e, text));
        element.addEventListener('mouseleave', () => this.hideTooltip());
        element.addEventListener('focus', (e) => this.showTooltip(e, text));
        element.addEventListener('blur', () => this.hideTooltip());
    }

    showTooltip(event, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'accessibility-tooltip';
        tooltip.textContent = text;
        tooltip.id = 'activeTooltip';
        
        document.body.appendChild(tooltip);
        
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        // Speak tooltip for voice assistance
        if (this.voiceEnabled) {
            this.speak(text);
        }
    }

    hideTooltip() {
        const tooltip = document.getElementById('activeTooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Floating Help Button
    createFloatingHelpButton() {
        const helpButton = document.createElement('div');
        helpButton.className = 'floating-help-button';
        helpButton.innerHTML = `
            <button onclick="accessibilityHelper.toggleHelpMenu()" class="help-btn">
                <i class="fas fa-question-circle"></i>
            </button>
            <div class="help-menu" id="helpMenu">
                <div class="help-option" onclick="accessibilityHelper.toggleVoiceAssistance()">
                    <i class="fas fa-microphone"></i>
                    <span>Voice Help</span>
                </div>
                <div class="help-option" onclick="accessibilityHelper.showGuidedTour()">
                    <i class="fas fa-route"></i>
                    <span>Guided Tour</span>
                </div>
                <div class="help-option" onclick="accessibilityHelper.showQuickActions()">
                    <i class="fas fa-bolt"></i>
                    <span>Quick Actions</span>
                </div>
                <div class="help-option" onclick="accessibilityHelper.showKeyboardShortcuts()">
                    <i class="fas fa-keyboard"></i>
                    <span>Shortcuts</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpButton);
    }

    toggleHelpMenu() {
        const menu = document.getElementById('helpMenu');
        menu.classList.toggle('show');
    }

    toggleVoiceAssistance() {
        this.voiceEnabled = !this.voiceEnabled;
        const status = this.voiceEnabled ? 'enabled' : 'disabled';
        this.showNotification(`Voice assistance ${status}`, 'info');
        
        if (this.voiceEnabled) {
            this.speak('Voice assistance is now active. You can say commands like add crop, show earnings, or help.');
        }
        
        // Add voice activation button to header
        this.addVoiceActivationButton();
    }

    addVoiceActivationButton() {
        if (this.voiceEnabled && !document.getElementById('voiceActivationBtn')) {
            const headerActions = document.querySelector('.header-actions');
            const voiceBtn = document.createElement('button');
            voiceBtn.id = 'voiceActivationBtn';
            voiceBtn.className = 'btn btn-outline voice-activation-btn';
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Speak';
            voiceBtn.onclick = () => this.startListening();
            
            headerActions.insertBefore(voiceBtn, headerActions.firstChild);
        }
    }

    startListening() {
        if (this.recognition) {
            this.recognition.start();
            this.showNotification('Listening... Speak your command', 'info');
            
            // Visual feedback
            const btn = document.getElementById('voiceActivationBtn');
            btn.classList.add('listening');
            btn.innerHTML = '<i class="fas fa-microphone pulse"></i> Listening...';
            
            setTimeout(() => {
                btn.classList.remove('listening');
                btn.innerHTML = '<i class="fas fa-microphone"></i> Speak';
            }, 5000);
        }
    }

    // Guided Tour System
    setupGuidedTour() {
        this.tourSteps = [
            {
                element: '.sidebar-nav',
                title: 'Navigation Menu',
                content: 'Use this menu to navigate between different sections of your dashboard.',
                position: 'right'
            },
            {
                element: 'button[onclick="showSubmissionForm()"]',
                title: 'Add New Crop',
                content: 'Click here to add a new crop. The wizard will guide you step by step.',
                position: 'bottom'
            },
            {
                element: '.language-selector-header',
                title: 'Language Settings',
                content: 'Change the language to your preferred local language.',
                position: 'bottom'
            },
            {
                element: '.user-menu',
                title: 'Profile Menu',
                content: 'Access your profile, settings, and help from here.',
                position: 'bottom'
            }
        ];
    }

    showGuidedTour() {
        this.currentTourStep = 0;
        this.showTourStep(0);
    }

    showTourStep(stepIndex) {
        if (stepIndex >= this.tourSteps.length) {
            this.endTour();
            return;
        }
        
        const step = this.tourSteps[stepIndex];
        const element = document.querySelector(step.element);
        
        if (!element) {
            this.showTourStep(stepIndex + 1);
            return;
        }
        
        this.createTourOverlay(element, step, stepIndex);
    }

    createTourOverlay(element, step, stepIndex) {
        // Remove existing tour overlay
        const existing = document.getElementById('tourOverlay');
        if (existing) existing.remove();
        
        const overlay = document.createElement('div');
        overlay.id = 'tourOverlay';
        overlay.className = 'tour-overlay';
        
        const rect = element.getBoundingClientRect();
        
        overlay.innerHTML = `
            <div class="tour-backdrop"></div>
            <div class="tour-highlight" style="
                top: ${rect.top - 10}px;
                left: ${rect.left - 10}px;
                width: ${rect.width + 20}px;
                height: ${rect.height + 20}px;
            "></div>
            <div class="tour-popup ${step.position}" style="
                top: ${step.position === 'bottom' ? rect.bottom + 20 : rect.top - 120}px;
                left: ${rect.left}px;
            ">
                <div class="tour-content">
                    <h4>${step.title}</h4>
                    <p>${step.content}</p>
                    <div class="tour-actions">
                        <button onclick="accessibilityHelper.skipTour()" class="btn btn-outline">Skip Tour</button>
                        <button onclick="accessibilityHelper.nextTourStep()" class="btn btn-primary">
                            ${stepIndex === this.tourSteps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                    <div class="tour-progress">
                        Step ${stepIndex + 1} of ${this.tourSteps.length}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Speak the tour step
        if (this.voiceEnabled) {
            this.speak(`${step.title}. ${step.content}`);
        }
    }

    nextTourStep() {
        this.currentTourStep++;
        this.showTourStep(this.currentTourStep);
    }

    skipTour() {
        this.endTour();
    }

    endTour() {
        const overlay = document.getElementById('tourOverlay');
        if (overlay) overlay.remove();
        
        this.showNotification('Tour completed! You can restart it anytime from the help menu.', 'success');
        
        if (this.voiceEnabled) {
            this.speak('Tour completed. You are now ready to use the dashboard.');
        }
    }

    // Quick Actions Menu
    showQuickActions() {
        const modal = document.createElement('div');
        modal.className = 'quick-actions-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Quick Actions</h3>
                        <button onclick="this.closest('.quick-actions-modal').remove()">&times;</button>
                    </div>
                    <div class="quick-actions-grid">
                        <div class="quick-action" onclick="farmerWizard.showWizard(); this.closest('.quick-actions-modal').remove();">
                            <i class="fas fa-plus-circle"></i>
                            <span>Add Crop</span>
                        </div>
                        <div class="quick-action" onclick="accessibilityHelper.navigateToSection('earnings'); this.closest('.quick-actions-modal').remove();">
                            <i class="fas fa-coins"></i>
                            <span>View Earnings</span>
                        </div>
                        <div class="quick-action" onclick="accessibilityHelper.navigateToSection('submissions'); this.closest('.quick-actions-modal').remove();">
                            <i class="fas fa-list"></i>
                            <span>Check Status</span>
                        </div>
                        <div class="quick-action" onclick="languageManager.toggleLanguageDropdown(); this.closest('.quick-actions-modal').remove();">
                            <i class="fas fa-globe"></i>
                            <span>Change Language</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Navigation helper
    navigateToSection(sectionId) {
        const navItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (navItem) {
            navItem.click();
        }
    }

    openCropWizard() {
        if (window.farmerWizard) {
            farmerWizard.showWizard();
        }
    }

    openLanguageSelector() {
        if (window.languageManager) {
            languageManager.toggleLanguageDropdown();
        }
    }

    fillQuantityInput(quantity) {
        const quantityInput = document.getElementById('customQuantity');
        if (quantityInput) {
            quantityInput.value = quantity;
            quantityInput.dispatchEvent(new Event('input'));
        }
    }

    // Smart auto-fill based on farmer profile
    loadFarmerProfile() {
        const profile = localStorage.getItem('farmerProfile');
        if (profile) {
            this.smartDefaults.profile = JSON.parse(profile);
        } else {
            // Create default profile
            this.smartDefaults.profile = {
                name: 'Rajesh Kumar',
                farmerId: 'FRM001',
                location: 'Rajasthan',
                preferredCrops: ['ashwagandha', 'turmeric'],
                farmSize: '5 acres',
                experience: '10 years'
            };
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `accessibility-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Keyboard shortcuts
    showKeyboardShortcuts() {
        const modal = document.createElement('div');
        modal.className = 'shortcuts-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Keyboard Shortcuts</h3>
                        <button onclick="this.closest('.shortcuts-modal').remove()">&times;</button>
                    </div>
                    <div class="shortcuts-list">
                        <div class="shortcut-item">
                            <kbd>Ctrl + A</kbd>
                            <span>Add new crop</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + E</kbd>
                            <span>View earnings</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + L</kbd>
                            <span>Change language</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>F1</kbd>
                            <span>Show help</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Space</kbd>
                            <span>Voice command</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Initialize keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                this.openCropWizard();
            } else if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.navigateToSection('earnings');
            } else if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                this.openLanguageSelector();
            } else if (e.key === 'F1') {
                e.preventDefault();
                this.showGuidedTour();
            } else if (e.key === ' ' && this.voiceEnabled) {
                e.preventDefault();
                this.startListening();
            }
        });
    }
}

// Initialize accessibility helper
const accessibilityHelper = new FarmerAccessibilityHelper();

// Export for global access
window.accessibilityHelper = accessibilityHelper;
