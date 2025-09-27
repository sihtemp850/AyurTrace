// AyurTrace - Authentication Script

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    initializePasswordStrength();
    initializeTabs();
});

// Initialize authentication functionality
function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Check URL parameters for role
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    if (role) {
        const roleSelects = document.querySelectorAll('#loginRole, #signupRole');
        roleSelects.forEach(select => {
            if (select) {
                select.value = role;
            }
        });
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const role = formData.get('role');
    const email = formData.get('email');
    const password = formData.get('password');
    
    if (!role || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading
    showLoadingOverlay('Authenticating...');
    
    // Simulate authentication
    setTimeout(() => {
        loginUser(role, email);
    }, 2000);
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const role = formData.get('role');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (!firstName || !lastName || !role || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // Show loading
    showLoadingOverlay('Creating your account...');
    
    // Simulate account creation
    setTimeout(() => {
        showNotification('Account created successfully!', 'success');
        hideLoadingOverlay();
        
        // Auto login after signup
        setTimeout(() => {
            loginUser(role, email, `${firstName} ${lastName}`);
        }, 1000);
    }, 2500);
}

// Login user and redirect to dashboard
function loginUser(role, email, name = null) {
    const userData = {
        role: role,
        email: email,
        name: name || getUserNameByRole(role),
        loginTime: new Date().toISOString(),
        permissions: getRolePermissions(role),
        dashboardUrl: getDashboardUrl(role)
    };
    
    // Store user session
    localStorage.setItem('ayurTrace_user', JSON.stringify(userData));
    localStorage.setItem('ayurTrace_session', 'active');
    
    hideLoadingOverlay();
    showNotification(`Welcome ${userData.name}!`, 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = userData.dashboardUrl;
    }, 1500);
}

// Demo login functions
function loginDemo(role) {
    showLoadingOverlay(`Logging in as Demo ${role.charAt(0).toUpperCase() + role.slice(1)}...`);
    
    setTimeout(() => {
        loginUser(role, `demo.${role}@ayurtrace.com`);
    }, 1500);
}

function demoLogin(role) {
    const demoUsers = {
        'farmer': {
            name: 'Rajesh Kumar',
            role: 'farmer',
            email: 'rajesh.kumar@farm.com',
            redirectUrl: 'farmer-dashboard.html'
        },
        'manufacturer': {
            name: 'Priya Sharma',
            role: 'manufacturer', 
            email: 'priya.sharma@manufacturer.com',
            redirectUrl: 'manufacturer-dashboard.html'
        },
        'lab-analysis': {
            name: 'Dr. Priya Patel',
            role: 'lab-analysis',
            email: 'priya.patel@ayurlab.com',
            redirectUrl: 'lab-analysis-dashboard.html'
        },
        consumer: {
            name: 'Arjun Reddy',
            role: 'consumer',
            email: 'arjun.reddy@email.com',
            redirectUrl: 'consumer-portal.html'
        },
        admin: {
            name: 'System Administrator',
            role: 'admin',
            email: 'admin@ayurtrace.com',
            redirectUrl: 'admin-dashboard.html'
        }
    };
    
    const user = demoUsers[role];
    if (!user) {
        showNotification('Demo user not found', 'error');
        return;
    }
    
    showLoadingOverlay(`Logging in as ${user.name}...`);
    
    setTimeout(() => {
        // Set user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userSession', JSON.stringify({
            userId: user.email,
            role: user.role,
            loginTime: new Date().toISOString(),
            permissions: getRolePermissions(user.role)
        }));
        
        hideLoadingOverlay();
        showNotification(`Welcome ${user.name}!`, 'success');
        
        setTimeout(() => {
            window.location.href = user.redirectUrl;
        }, 1000);
    }, 1500);
}

// Get user name by role (for demo purposes)
function getUserNameByRole(role) {
    const names = {
        farmer: 'Rajesh Kumar',
        manufacturer: 'Manoj Kumar',
        distributor: 'Amit Sharma',
        'lab-analysis': 'Dr. Priya Patel',
        consumer: 'Rahul Singh',
        admin: 'System Administrator'
    };
    return names[role] || 'Demo User';
}

// Get role permissions
function getRolePermissions(role) {
    const permissions = {
        farmer: ['view_crops', 'manage_harvest', 'view_earnings', 'submit_herbs', 'track_herbs'],
        manufacturer: ['process_batches', 'manage_production', 'quality_control', 'submit_testing', 'track_losses'],
        distributor: ['view_shipments', 'manage_fleet', 'track_quality', 'view_routes'],
        'lab-analysis': ['test_samples', 'generate_reports', 'quality_analysis', 'certification'],
        consumer: ['scan_products', 'view_trace', 'write_reviews', 'view_history'],
        admin: ['manage_network', 'user_management', 'system_settings', 'view_analytics', 'manage_compliance', 'emergency_controls']
    };
    return permissions[role] || [];
}

// Get dashboard URL by role
function getDashboardUrl(role) {
    const dashboards = {
        farmer: 'farmer-dashboard.html',
        manufacturer: 'manufacturer-dashboard.html',
        distributor: 'distributor-dashboard.html',
        'lab-analysis': 'lab-analysis-dashboard.html',
        consumer: 'consumer-portal.html',
        admin: 'admin-dashboard.html'
    };
    return dashboards[role] || 'index.html';
}

// Initialize tab switching
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Password strength indicator
function initializePasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        if (input.name === 'password') {
            input.addEventListener('input', updatePasswordStrength);
        }
    });
}

function updatePasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    const strength = calculatePasswordStrength(password);
    
    strengthBar.style.width = `${strength.percentage}%`;
    strengthBar.style.background = strength.color;
    strengthText.textContent = strength.text;
}

function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score += 25;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) score += 25;
    else feedback.push('Lowercase letter');
    
    if (/[A-Z]/.test(password)) score += 25;
    else feedback.push('Uppercase letter');
    
    if (/[0-9]/.test(password)) score += 25;
    else feedback.push('Number');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    
    let strength = {
        percentage: Math.min(score, 100),
        color: '#ef4444',
        text: 'Weak'
    };
    
    if (score >= 75) {
        strength.color = '#22c55e';
        strength.text = 'Strong';
    } else if (score >= 50) {
        strength.color = '#f59e0b';
        strength.text = 'Medium';
    }
    
    return strength;
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show loading overlay
function showLoadingOverlay(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const messageElement = overlay.querySelector('p');
    
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    overlay.style.display = 'flex';
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'none';
}

// Show notification
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
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

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}
