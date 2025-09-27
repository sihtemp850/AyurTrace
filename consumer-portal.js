// Consumer Portal JavaScript


let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    name: 'Arjun Reddy',
    role: 'consumer',
    email: 'arjun.reddy@email.com',
    phone: '+91 9876543210'
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];


// Sample product data with detailed provenance information
const products = [
    {
        id: 1,
        name: 'Ashwagandha Capsules',
        brand: 'Himalaya',
        price: 450,
        originalPrice: 500,
        rating: 4.5,
        reviews: 1250,
        purity: 98,
        category: 'tablets',
        image: 'ashwagandha.jpg',
        features: ['Organic', 'Lab Tested', '98% Pure'],
        description: 'Premium quality Ashwagandha capsules for stress relief and energy boost.',
        batchId: 'ASH-2024-089',
        provenance: {
            farm: {
                name: 'Green Valley Organic Farm',
                location: 'Wayanad, Kerala',
                coordinates: { lat: 11.6854, lng: 76.1320 },
                farmer: 'Rajesh Kumar',
                farmerId: 'FRM001',
                certifications: ['Organic', 'Fair Trade', 'FSSAI'],
                harvestDate: '2024-08-15',
                soilType: 'Red Laterite',
                altitude: '800m above sea level'
            },
            processing: {
                facility: 'AyurTrace Processing Unit',
                location: 'Kochi, Kerala',
                processDate: '2024-08-20',
                method: 'Traditional Sun Drying',
                qualityGrade: 'Premium A+',
                moistureContent: '8.2%',
                activeCompounds: 'Withanolides: 5.2%'
            },
            laboratory: {
                name: 'Kerala Ayurveda Lab',
                testDate: '2024-08-25',
                certificateId: 'CERT-ASH-2024-089',
                purityLevel: 98.5,
                contaminants: 'None Detected',
                heavyMetals: 'Within Limits',
                microbiology: 'Passed',
                pesticides: 'Not Detected'
            },
            manufacturing: {
                facility: 'Himalaya Manufacturing',
                location: 'Bangalore, Karnataka',
                manufactureDate: '2024-09-01',
                batchSize: '10,000 units',
                expiryDate: '2026-09-01',
                packagingDate: '2024-09-05'
            },
            blockchain: {
                hash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c5f7',
                blockNumber: 15847,
                timestamp: '2024-09-05T10:30:00Z',
                verified: true
            }
        }
    },
    {
        id: 2,
        name: 'Turmeric Powder',
        brand: 'Patanjali',
        price: 180,
        originalPrice: 200,
        rating: 4.3,
        reviews: 890,
        purity: 95,
        category: 'powders',
        image: 'turmeric.jpg',
        features: ['Pure', 'Anti-inflammatory', '95% Pure'],
        description: 'Natural turmeric powder with high curcumin content.',
        batchId: 'TUR-2024-067',
        provenance: {
            farm: {
                name: 'Sunrise Spice Farm',
                location: 'Erode, Tamil Nadu',
                coordinates: { lat: 11.3410, lng: 77.7172 },
                farmer: 'Lakshmi Devi',
                farmerId: 'FRM002',
                certifications: ['Organic', 'FSSAI'],
                harvestDate: '2024-07-20',
                soilType: 'Black Cotton',
                altitude: '300m above sea level'
            },
            processing: {
                facility: 'Spice Processing Center',
                location: 'Erode, Tamil Nadu',
                processDate: '2024-07-25',
                method: 'Steam Sterilization',
                qualityGrade: 'Premium',
                moistureContent: '10.5%',
                activeCompounds: 'Curcumin: 6.8%'
            },
            laboratory: {
                name: 'Tamil Nadu Spice Lab',
                testDate: '2024-07-30',
                certificateId: 'CERT-TUR-2024-067',
                purityLevel: 95.2,
                contaminants: 'None Detected',
                heavyMetals: 'Within Limits',
                microbiology: 'Passed',
                pesticides: 'Not Detected'
            },
            manufacturing: {
                facility: 'Patanjali Ayurved',
                location: 'Haridwar, Uttarakhand',
                manufactureDate: '2024-08-10',
                batchSize: '50,000 units',
                expiryDate: '2026-08-10',
                packagingDate: '2024-08-15'
            },
            blockchain: {
                hash: '0x9f8fade2c1d58a8af77bc5ead80fade2c1d58a8af77bc5ead8c3c6f8',
                blockNumber: 15923,
                timestamp: '2024-08-15T14:20:00Z',
                verified: true
            }
        }
    },
    {
        id: 3,
        name: 'Brahmi Oil',
        brand: 'Dabur',
        price: 320,
        originalPrice: 350,
        rating: 4.7,
        reviews: 567,
        purity: 92,
        category: 'oils',
        image: 'brahmi-oil.jpg',
        features: ['Hair Care', 'Memory Boost', '92% Pure'],
        description: 'Ayurvedic Brahmi oil for hair growth and mental clarity.',
        batchId: 'BRA-2024-045',
        provenance: {
            farm: {
                name: 'Herbal Gardens Co-op',
                location: 'Coimbatore, Tamil Nadu',
                coordinates: { lat: 11.0168, lng: 76.9558 },
                farmer: 'Cooperative Society',
                farmerId: 'COOP001',
                certifications: ['Organic', 'Ayush Certified'],
                harvestDate: '2024-06-10',
                soilType: 'Alluvial',
                altitude: '400m above sea level'
            },
            processing: {
                facility: 'Ayurvedic Oil Extraction Unit',
                location: 'Coimbatore, Tamil Nadu',
                processDate: '2024-06-15',
                method: 'Cold Press Extraction',
                qualityGrade: 'Premium',
                moistureContent: '2.1%',
                activeCompounds: 'Bacosides: 12%'
            },
            laboratory: {
                name: 'Ayurvedic Research Lab',
                testDate: '2024-06-20',
                certificateId: 'CERT-BRA-2024-045',
                purityLevel: 92.8,
                contaminants: 'None Detected',
                heavyMetals: 'Within Limits',
                microbiology: 'Passed',
                pesticides: 'Not Detected'
            },
            manufacturing: {
                facility: 'Dabur India Ltd',
                location: 'Ghaziabad, Uttar Pradesh',
                manufactureDate: '2024-07-01',
                batchSize: '25,000 units',
                expiryDate: '2026-07-01',
                packagingDate: '2024-07-05'
            },
            blockchain: {
                hash: '0x8e7fade3c2d59a9af88cd6ead91fade3c2d59a9af88cd6ead9d4d7f9',
                blockNumber: 16001,
                timestamp: '2024-07-05T16:45:00Z',
                verified: true
            }
        }
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeConsumerPortal();
    loadProducts();
    loadCartItems();
    loadOrders();
    loadPurchaseHistory();
    loadTrendingProducts();
    loadWishlist();
    setupEventListeners();
});

function initializeConsumerPortal() {
    updateUserInfo();
    updateCartCount();
    showSection('products');
}

function updateUserInfo() {
    const userNameElements = document.querySelectorAll('.user-info strong');
    userNameElements.forEach(el => el.textContent = currentUser.name);
}

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Navigation
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
}

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}" data-purity="${product.purity}" data-brand="${product.brand}">
            <div class="product-image">
                <img src="images/${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7cHJvZHVjdC5uYW1lfTwvdGV4dD48L3N2Zz4='">
                <div class="product-badges">
                    ${product.features.map(feature => `<span class="badge">${feature}</span>`).join('')}
                    <span class="badge blockchain-verified" title="Blockchain Verified">
                        <i class="fas fa-shield-alt"></i> Verified
                    </span>
                </div>
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="brand">${product.brand}</p>
                <div class="rating">
                    ${generateStars(product.rating)}
                    <span class="rating-text">${product.rating} (${product.reviews})</span>
                </div>
                <div class="product-details">
                    <div class="purity-score">
                        <span class="purity-label">Purity:</span>
                        <span class="purity-value">${product.purity}%</span>
                    </div>
                    <div class="batch-info">
                        <span class="batch-label">Batch:</span>
                        <span class="batch-id">${product.batchId}</span>
                    </div>
                </div>
                <div class="price">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discount">${Math.round((1 - product.price/product.originalPrice) * 100)}% off</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-outline" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="btn btn-primary" onclick="buyNow(${product.id})">
                        Buy Now
                    </button>
                </div>
                <div class="provenance-actions">
                    <button class="btn btn-link" onclick="showProvenanceCard(${product.id})">
                        <i class="fas fa-route"></i>
                        View Provenance Journey
                    </button>
                    <button class="btn btn-link" onclick="showQRCode('${product.batchId}')">
                        <i class="fas fa-qrcode"></i>
                        QR Code
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Detailed Product Provenance Card System
function showProvenanceCard(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.provenance) {
        showNotification('Provenance information not available for this product', 'warning');
        return;
    }
    
    const modalHTML = `
        <div class="modal-overlay" id="provenanceModal">
            <div class="modal large-modal provenance-modal">
                <div class="modal-header">
                    <h3>Product Provenance Journey</h3>
                    <button class="modal-close" onclick="closeModal('provenanceModal')">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="provenance-container">
                        <div class="product-summary">
                            <div class="product-image-small">
                                <img src="images/${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+'">
                            </div>
                            <div class="product-details-summary">
                                <h4>${product.name}</h4>
                                <p class="brand">${product.brand}</p>
                                <div class="batch-info">
                                    <strong>Batch ID:</strong> ${product.batchId}
                                </div>
                                <div class="blockchain-status">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>Blockchain Verified</span>
                                    <small>Block #${product.provenance.blockchain.blockNumber}</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="provenance-timeline">
                            <div class="timeline-header">
                                <h4>Complete Journey from Farm to You</h4>
                                <div class="timeline-controls">
                                    <button class="btn btn-sm btn-outline" onclick="exportProvenance('${product.batchId}')">
                                        <i class="fas fa-download"></i> Export Report
                                    </button>
                                    <button class="btn btn-sm btn-outline" onclick="shareProvenance('${product.batchId}')">
                                        <i class="fas fa-share"></i> Share
                                    </button>
                                </div>
                            </div>
                            
                            <div class="timeline-steps">
                                <div class="timeline-step completed">
                                    <div class="step-icon">
                                        <i class="fas fa-seedling"></i>
                                    </div>
                                    <div class="step-content">
                                        <h5>Farm Origin</h5>
                                        <div class="step-details">
                                            <div class="detail-grid">
                                                <div class="detail-item">
                                                    <strong>Farm:</strong> ${product.provenance.farm.name}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Location:</strong> ${product.provenance.farm.location}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Farmer:</strong> ${product.provenance.farm.farmer}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Harvest Date:</strong> ${new Date(product.provenance.farm.harvestDate).toLocaleDateString()}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Soil Type:</strong> ${product.provenance.farm.soilType}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Altitude:</strong> ${product.provenance.farm.altitude}
                                                </div>
                                            </div>
                                            <div class="certifications">
                                                <strong>Certifications:</strong>
                                                ${product.provenance.farm.certifications.map(cert => 
                                                    `<span class="cert-badge">${cert}</span>`
                                                ).join('')}
                                            </div>
                                            <button class="btn btn-sm btn-link" onclick="showFarmLocation(${product.provenance.farm.coordinates.lat}, ${product.provenance.farm.coordinates.lng})">
                                                <i class="fas fa-map-marker-alt"></i> View on Map
                                            </button>
                                        </div>
                                    </div>
                                    <div class="step-date">${new Date(product.provenance.farm.harvestDate).toLocaleDateString()}</div>
                                </div>
                                
                                <div class="timeline-step completed">
                                    <div class="step-icon">
                                        <i class="fas fa-industry"></i>
                                    </div>
                                    <div class="step-content">
                                        <h5>Processing</h5>
                                        <div class="step-details">
                                            <div class="detail-grid">
                                                <div class="detail-item">
                                                    <strong>Facility:</strong> ${product.provenance.processing.facility}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Location:</strong> ${product.provenance.processing.location}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Method:</strong> ${product.provenance.processing.method}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Quality Grade:</strong> ${product.provenance.processing.qualityGrade}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Moisture Content:</strong> ${product.provenance.processing.moistureContent}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Active Compounds:</strong> ${product.provenance.processing.activeCompounds}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="step-date">${new Date(product.provenance.processing.processDate).toLocaleDateString()}</div>
                                </div>
                                
                                <div class="timeline-step completed">
                                    <div class="step-icon">
                                        <i class="fas fa-flask"></i>
                                    </div>
                                    <div class="step-content">
                                        <h5>Laboratory Testing</h5>
                                        <div class="step-details">
                                            <div class="detail-grid">
                                                <div class="detail-item">
                                                    <strong>Lab:</strong> ${product.provenance.laboratory.name}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Certificate ID:</strong> ${product.provenance.laboratory.certificateId}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Purity Level:</strong> ${product.provenance.laboratory.purityLevel}%
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Contaminants:</strong> ${product.provenance.laboratory.contaminants}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Heavy Metals:</strong> ${product.provenance.laboratory.heavyMetals}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Pesticides:</strong> ${product.provenance.laboratory.pesticides}
                                                </div>
                                            </div>
                                            <div class="test-results">
                                                <div class="test-result passed">
                                                    <i class="fas fa-check-circle"></i>
                                                    <span>Microbiology: ${product.provenance.laboratory.microbiology}</span>
                                                </div>
                                            </div>
                                            <button class="btn btn-sm btn-link" onclick="viewLabCertificate('${product.provenance.laboratory.certificateId}')">
                                                <i class="fas fa-certificate"></i> View Certificate
                                            </button>
                                        </div>
                                    </div>
                                    <div class="step-date">${new Date(product.provenance.laboratory.testDate).toLocaleDateString()}</div>
                                </div>
                                
                                <div class="timeline-step completed">
                                    <div class="step-icon">
                                        <i class="fas fa-cogs"></i>
                                    </div>
                                    <div class="step-content">
                                        <h5>Manufacturing</h5>
                                        <div class="step-details">
                                            <div class="detail-grid">
                                                <div class="detail-item">
                                                    <strong>Facility:</strong> ${product.provenance.manufacturing.facility}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Location:</strong> ${product.provenance.manufacturing.location}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Batch Size:</strong> ${product.provenance.manufacturing.batchSize}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Manufacture Date:</strong> ${new Date(product.provenance.manufacturing.manufactureDate).toLocaleDateString()}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Expiry Date:</strong> ${new Date(product.provenance.manufacturing.expiryDate).toLocaleDateString()}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Packaging Date:</strong> ${new Date(product.provenance.manufacturing.packagingDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="step-date">${new Date(product.provenance.manufacturing.manufactureDate).toLocaleDateString()}</div>
                                </div>
                                
                                <div class="timeline-step completed">
                                    <div class="step-icon">
                                        <i class="fas fa-cube"></i>
                                    </div>
                                    <div class="step-content">
                                        <h5>Blockchain Verification</h5>
                                        <div class="step-details">
                                            <div class="detail-grid">
                                                <div class="detail-item">
                                                    <strong>Block Number:</strong> #${product.provenance.blockchain.blockNumber}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Transaction Hash:</strong> 
                                                    <code class="hash-display">${product.provenance.blockchain.hash}</code>
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Timestamp:</strong> ${new Date(product.provenance.blockchain.timestamp).toLocaleString()}
                                                </div>
                                                <div class="detail-item">
                                                    <strong>Status:</strong> 
                                                    <span class="verification-status verified">
                                                        <i class="fas fa-shield-alt"></i> Verified
                                                    </span>
                                                </div>
                                            </div>
                                            <button class="btn btn-sm btn-link" onclick="verifyOnBlockchain('${product.provenance.blockchain.hash}')">
                                                <i class="fas fa-external-link-alt"></i> Verify on Blockchain
                                            </button>
                                        </div>
                                    </div>
                                    <div class="step-date">${new Date(product.provenance.blockchain.timestamp).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="provenance-summary">
                            <h4>Journey Summary</h4>
                            <div class="summary-stats">
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="fas fa-calendar-alt"></i>
                                    </div>
                                    <div class="stat-content">
                                        <span class="stat-value">${calculateJourneyDays(product.provenance.farm.harvestDate, product.provenance.manufacturing.packagingDate)}</span>
                                        <span class="stat-label">Days from Farm to Package</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="fas fa-map-marked-alt"></i>
                                    </div>
                                    <div class="stat-content">
                                        <span class="stat-value">4</span>
                                        <span class="stat-label">Locations Tracked</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="fas fa-shield-alt"></i>
                                    </div>
                                    <div class="stat-content">
                                        <span class="stat-value">100%</span>
                                        <span class="stat-label">Verification Score</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="fas fa-leaf"></i>
                                    </div>
                                    <div class="stat-content">
                                        <span class="stat-value">${product.provenance.laboratory.purityLevel}%</span>
                                        <span class="stat-label">Purity Level</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('provenanceModal').style.display = 'flex';
}

function calculateJourneyDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function showFarmLocation(lat, lng) {
    showNotification(`Opening farm location: ${lat}, ${lng}`, 'info');
    // In a real implementation, this would open a map modal
}

function viewLabCertificate(certificateId) {
    showNotification(`Loading certificate ${certificateId}...`, 'info');
    // In a real implementation, this would show the lab certificate
}

function verifyOnBlockchain(hash) {
    showNotification('Verifying on blockchain...', 'info');
    setTimeout(() => {
        showNotification('Blockchain verification successful!', 'success');
    }, 2000);
}

function exportProvenance(batchId) {
    showNotification(`Exporting provenance report for ${batchId}...`, 'info');
    setTimeout(() => {
        showNotification('Provenance report exported successfully', 'success');
    }, 1500);
}

function shareProvenance(batchId) {
    const shareUrl = `https://ayurtrace.com/provenance/${batchId}`;
    if (navigator.share) {
        navigator.share({
            title: 'Product Provenance Journey',
            text: `Check out the complete journey of this Ayurvedic product from farm to package!`,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl);
        showNotification('Provenance link copied to clipboard', 'success');
    }
}

function showQRCode(batchId) {
    const modalHTML = `
        <div class="modal-overlay" id="qrCodeModal">
            <div class="modal">
                <div class="modal-header">
                    <h3>Product QR Code</h3>
                    <button class="modal-close" onclick="closeModal('qrCodeModal')">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="qr-code-display">
                        <div class="qr-code-container">
                            <div class="qr-matrix">
                                ${generateQRMatrix()}
                            </div>
                            <div class="qr-info">
                                <h4>Batch ID: ${batchId}</h4>
                                <p>Scan this QR code to view the complete provenance journey</p>
                                <div class="qr-url">
                                    <strong>Verification URL:</strong>
                                    <code>https://ayurtrace.com/verify/${batchId}</code>
                                </div>
                            </div>
                        </div>
                        <div class="qr-actions">
                            <button class="btn btn-outline" onclick="downloadQRCode('${batchId}')">
                                <i class="fas fa-download"></i> Download QR Code
                            </button>
                            <button class="btn btn-primary" onclick="shareQRCode('${batchId}')">
                                <i class="fas fa-share"></i> Share QR Code
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('qrCodeModal').style.display = 'flex';
}

function generateQRMatrix() {
    // Generate a simplified QR code pattern for display
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

function downloadQRCode(batchId) {
    showNotification(`Downloading QR code for ${batchId}...`, 'info');
    setTimeout(() => {
        showNotification('QR code downloaded successfully', 'success');
    }, 1000);
}

function shareQRCode(batchId) {
    showNotification(`Sharing QR code for ${batchId}...`, 'info');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        stars += '<i class="fas fa-star star empty"></i>';
    }
    
    return stars;
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!', 'success');
}

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas fa-leaf" style="font-size: 24px; color: var(--primary-color);"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-brand">${item.brand}</div>
                <div class="cart-item-price">₹${item.price}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartItems();
            updateCartCount();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
    showNotification('Item removed from cart', 'info');
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('total').textContent = `₹${total}`;
}

// Wishlist functions
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(product);
        showNotification('Added to wishlist!', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadProducts(); // Refresh to update wishlist buttons
    loadWishlist();
}

function loadWishlist() {
    const wishlistGrid = document.getElementById('wishlistGrid');
    if (!wishlistGrid) return;
    
    if (wishlist.length === 0) {
        wishlistGrid.innerHTML = '<div class="empty-wishlist">Your wishlist is empty</div>';
        return;
    }
    
    wishlistGrid.innerHTML = wishlist.map(product => createProductCard(product)).join('');
}

// Order functions
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    const sampleOrders = [
        {
            id: 'ORD123456',
            date: '2024-01-15',
            status: 'delivered',
            items: [
                { name: 'Ashwagandha Capsules', brand: 'Himalaya', quantity: 2, price: 450 }
            ],
            total: 950
        },
        {
            id: 'ORD123457',
            date: '2024-01-10',
            status: 'shipped',
            items: [
                { name: 'Turmeric Powder', brand: 'Patanjali', quantity: 1, price: 180 }
            ],
            total: 230
        }
    ];
    
    ordersList.innerHTML = sampleOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">Placed on ${new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div class="order-status status-${order.status}">${order.status}</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="order-item-image">
                            <i class="fas fa-leaf"></i>
                        </div>
                        <div class="order-item-info">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-details">${item.brand} • Qty: ${item.quantity} • ₹${item.price}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-actions">
                <button class="order-action-btn" onclick="traceSpecificOrder('${order.id}')">Track Order</button>
                <button class="order-action-btn">Download Invoice</button>
                ${order.status === 'delivered' ? '<button class="order-action-btn">Rate & Review</button>' : ''}
            </div>
        </div>
    `).join('');
}

// Trace order functions
function traceOrder() {
    const orderId = document.getElementById('traceOrderId').value;
    if (!orderId) {
        showNotification('Please enter an order ID', 'error');
        return;
    }
    
    showTraceResults(orderId);
}

function traceSpecificOrder(orderId) {
    showSection('trace');
    document.getElementById('traceOrderId').value = orderId;
    showTraceResults(orderId);
}

function showTraceResults(orderId) {
    const traceResults = document.getElementById('traceResults');
    traceResults.style.display = 'block';
    
    const timelineData = [
        { title: 'Order Placed', description: 'Your order has been confirmed', time: '2024-01-15 10:30 AM', status: 'completed', icon: 'fas fa-check-circle' },
        { title: 'Farm Sourcing', description: 'Herbs sourced from certified organic farm', time: '2024-01-15 2:00 PM', status: 'completed', icon: 'fas fa-seedling' },
        { title: 'Quality Testing', description: 'Lab analysis completed - 98% purity confirmed', time: '2024-01-16 9:00 AM', status: 'completed', icon: 'fas fa-flask' },
        { title: 'Manufacturing', description: 'Product manufactured and packaged', time: '2024-01-16 4:00 PM', status: 'completed', icon: 'fas fa-industry' },
        { title: 'Shipped', description: 'Package dispatched from warehouse', time: '2024-01-17 8:00 AM', status: 'current', icon: 'fas fa-truck' },
        { title: 'Out for Delivery', description: 'Package is out for delivery', time: 'Expected today', status: 'pending', icon: 'fas fa-shipping-fast' }
    ];
    
    traceResults.innerHTML = `
        <div class="trace-timeline">
            <h3>Order Tracking - ${orderId}</h3>
            ${timelineData.map(item => `
                <div class="timeline-item">
                    <div class="timeline-icon ${item.status}">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-title">${item.title}</div>
                        <div class="timeline-description">${item.description}</div>
                        <div class="timeline-time">${item.time}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Purchase history
function loadPurchaseHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const sampleHistory = [
        { date: '2024-01-15', items: 3, amount: 950, rating: 5 },
        { date: '2024-01-10', items: 1, amount: 230, rating: 4 },
        { date: '2023-12-28', items: 2, amount: 670, rating: 5 }
    ];
    
    historyList.innerHTML = sampleHistory.map(order => `
        <div class="history-item">
            <div class="history-date">${new Date(order.date).toLocaleDateString()}</div>
            <div class="history-details">${order.items} items • ₹${order.amount}</div>
            <div class="history-rating">${generateStars(order.rating)}</div>
        </div>
    `).join('');
}

// Trending products
function loadTrendingProducts() {
    const trendingList = document.getElementById('trendingList');
    if (!trendingList) return;
    
    const trending = [
        { rank: 1, name: 'Ashwagandha Capsules', change: '+15%' },
        { rank: 2, name: 'Turmeric Powder', change: '+12%' },
        { rank: 3, name: 'Brahmi Oil', change: '+8%' },
        { rank: 4, name: 'Triphala Tablets', change: '+5%' },
        { rank: 5, name: 'Giloy Juice', change: '+3%' }
    ];
    
    trendingList.innerHTML = trending.map(item => `
        <div class="trending-item">
            <div class="trending-rank">${item.rank}</div>
            <div class="trending-info">
                <div class="trending-name">${item.name}</div>
                <div class="trending-change">${item.change}</div>
            </div>
        </div>
    `).join('');
}

// Search and filter functions
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function sortProducts(sortBy) {
    let sortedProducts = [...products];
    
    switch(sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'purity':
            sortedProducts.sort((a, b) => b.purity - a.purity);
            break;
    }
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = sortedProducts.map(product => createProductCard(product)).join('');
}

// Utility functions
function setupEventListeners() {
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            document.getElementById('priceValue').textContent = this.value;
        });
    }
    
    // Search on enter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    const chevron = document.querySelector('.user-chevron');
    dropdown.classList.toggle('show');
    
    // Close dropdown when clicking outside
    if (dropdown.classList.contains('show')) {
        document.addEventListener('click', function closeDropdown(e) {
            if (!e.target.closest('.user-menu')) {
                dropdown.classList.remove('show');
                document.removeEventListener('click', closeDropdown);
            }
        });
    }
}

function proceedToCheckout() {
    showNotification('Redirecting to checkout...', 'info');
    // Implement checkout logic
}

function exportHistory() {
    showNotification('Exporting purchase history...', 'info');
    // Implement export logic
}

function clearFilters() {
    // Reset all filter checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('priceRange').value = 2500;
    document.getElementById('priceValue').textContent = '2500';
    loadProducts();
}

// Profile and settings functions
function showProfileModal() {
    document.getElementById('profileModal').style.display = 'flex';
    // Load current user data
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profilePhone').value = currentUser.phone;
    document.getElementById('profileLocation').value = currentUser.location || 'Hyderabad, India';
}

function showSettingsModal() {
    document.getElementById('settingsModal').style.display = 'flex';
}

function showHelpModal() {
    document.getElementById('helpModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function saveProfile() {
    currentUser.name = document.getElementById('profileName').value;
    currentUser.email = document.getElementById('profileEmail').value;
    currentUser.phone = document.getElementById('profilePhone').value;
    currentUser.location = document.getElementById('profileLocation').value;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserInfo();
    closeModal('profileModal');
    showNotification('Profile updated successfully!', 'success');
}

function saveSettings() {
    const settings = {
        orderUpdates: document.querySelector('input[type="checkbox"]:nth-of-type(1)').checked,
        priceAlerts: document.querySelector('input[type="checkbox"]:nth-of-type(2)').checked,
        marketingEmails: document.querySelector('input[type="checkbox"]:nth-of-type(3)').checked,
        profileVisibility: document.querySelector('input[type="checkbox"]:nth-of-type(4)').checked,
        dataSharing: document.querySelector('input[type="checkbox"]:nth-of-type(5)').checked
    };
    
    localStorage.setItem('consumerSettings', JSON.stringify(settings));
    closeModal('settingsModal');
    showNotification('Settings saved successfully!', 'success');
}

function showHelpTopic(topic) {
    const topics = {
        ordering: 'To place an order: Browse products → Add to cart → Proceed to checkout → Complete payment',
        tracking: 'Track orders using your Order ID in the "Trace Order" section'
    };
    
    showNotification(topics[topic] || 'Help topic not found', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userSession');
        showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    }
}

// Initialize charts for trends section
function initializeCharts() {
    // Price trends chart
    const priceCtx = document.getElementById('priceChart');
    if (priceCtx) {
        new Chart(priceCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Average Price',
                    data: [320, 315, 325, 318],
                    borderColor: 'rgb(5, 150, 105)',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Purity chart
    const purityCtx = document.getElementById('purityChart');
    if (purityCtx) {
        new Chart(purityCtx, {
            type: 'doughnut',
            data: {
                labels: ['95%+', '90-95%', '85-90%', '<85%'],
                datasets: [{
                    data: [45, 30, 20, 5],
                    backgroundColor: [
                        'rgb(34, 197, 94)',
                        'rgb(59, 130, 246)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// Traceability and QR Code Functions
function traceOrder() {
    const orderId = document.getElementById('traceOrderId').value.trim();
    if (!orderId) {
        showNotification('Please enter an Order ID or Batch ID', 'warning');
        return;
    }
    
    showNotification('Tracing order...', 'info');
    
    // Simulate API call delay
    setTimeout(() => {
        displayProvenanceResults(orderId);
    }, 1500);
}

function traceById(id) {
    document.getElementById('traceOrderId').value = id;
    traceOrder();
}

function displayProvenanceResults(orderId) {
    const traceResults = document.getElementById('traceResults');
    traceResults.style.display = 'block';
    traceResults.scrollIntoView({ behavior: 'smooth' });
    
    // Update product information
    updateProductSummary(orderId);
    
    // Build interactive timeline
    buildInteractiveTimeline(orderId);
    
    // Update blockchain verification
    updateBlockchainVerification(orderId);
    
    // Update farmer story
    updateFarmerStory(orderId);
    
    showNotification('Provenance data loaded successfully!', 'success');
}

function updateProductSummary(orderId) {
    const productData = getProductData(orderId);
    
    document.getElementById('productName').textContent = productData.name;
    document.getElementById('productDescription').textContent = productData.description;
    document.getElementById('authenticityScore').textContent = productData.authenticityScore + '%';
    
    // Update product image if available
    const productImage = document.getElementById('productImage');
    if (productData.image) {
        productImage.src = productData.image;
        productImage.alt = productData.name;
    }
}

function buildInteractiveTimeline(orderId) {
    const timelineContainer = document.getElementById('provenanceTimeline');
    const timelineData = getTimelineData(orderId);
    
    timelineContainer.innerHTML = timelineData.map((item, index) => `
        <div class="timeline-item ${item.status}" data-stage="${item.stage}" onclick="showTimelineDetails('${item.id}')">
            <div class="timeline-marker">
                <i class="${item.icon}"></i>
            </div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <h5>${item.title}</h5>
                    <span class="timeline-date">${item.date}</span>
                </div>
                <div class="timeline-body">
                    <p>${item.description}</p>
                    <div class="timeline-metadata">
                        <div class="metadata-grid">
                            ${item.metadata.map(meta => `
                                <div class="metadata-item">
                                    <span class="metadata-label">${meta.label}:</span>
                                    <span class="metadata-value">${meta.value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ${item.location ? `
                        <div class="timeline-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${item.location}</span>
                            <button class="btn-small" onclick="showLocationMap('${item.coordinates}')">
                                <i class="fas fa-map"></i> View Map
                            </button>
                        </div>
                    ` : ''}
                    ${item.certificates ? `
                        <div class="timeline-certificates">
                            <h6>Certificates & Documents:</h6>
                            <div class="certificate-list">
                                ${item.certificates.map(cert => `
                                    <div class="certificate-item">
                                        <i class="fas fa-certificate"></i>
                                        <span>${cert.name}</span>
                                        <button class="btn-small" onclick="viewCertificate('${cert.id}')">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="timeline-actions">
                    <button class="btn-small" onclick="expandTimelineItem('${item.id}')">
                        <i class="fas fa-expand-alt"></i> Details
                    </button>
                    <button class="btn-small" onclick="verifyStage('${item.id}')">
                        <i class="fas fa-shield-check"></i> Verify
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Animate timeline items
    setTimeout(() => {
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-in');
            }, index * 200);
        });
    }, 100);
}

function getProductData(orderId) {
    // Sample product data based on order ID
    const productDatabase = {
        'ASH-2024-089': {
            name: 'Ashwagandha Premium Extract',
            description: 'Organic Ashwagandha root extract, sustainably sourced from certified farms in Karnataka',
            authenticityScore: 98,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzRmNzA0NiIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QXNod2FnYW5kaGE8L3RleHQ+PC9zdmc+'
        },
        'TUR-2024-067': {
            name: 'Turmeric Powder Premium',
            description: 'Pure turmeric powder from organic farms in Tamil Nadu',
            authenticityScore: 96,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1OWUwYiIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VHVybWVyaWM8L3RleHQ+PC9zdmc+'
        }
    };
    
    return productDatabase[orderId] || productDatabase['ASH-2024-089'];
}

function getTimelineData(orderId) {
    // Comprehensive timeline data with detailed metadata
    return [
        {
            id: 'farm-001',
            stage: 'farming',
            title: 'Seed Planting & Cultivation',
            date: '2024-03-15',
            description: 'Organic Ashwagandha seeds planted using traditional methods',
            icon: 'fas fa-seedling',
            status: 'completed',
            location: 'Mysore, Karnataka, India',
            coordinates: '12.2958,76.6394',
            metadata: [
                { label: 'Farmer', value: 'Rajesh Kumar' },
                { label: 'Farm Size', value: '5.2 acres' },
                { label: 'Seed Variety', value: 'Withania Somnifera' },
                { label: 'Planting Method', value: 'Organic Direct Seeding' },
                { label: 'Soil pH', value: '6.8' },
                { label: 'Weather Conditions', value: 'Optimal (22°C, 65% humidity)' }
            ],
            certificates: [
                { id: 'cert-001', name: 'Organic Certification' },
                { id: 'cert-002', name: 'Soil Quality Report' }
            ]
        },
        {
            id: 'grow-001',
            stage: 'growing',
            title: 'Growth & Monitoring',
            date: '2024-06-20',
            description: 'Regular monitoring and organic care throughout growing season',
            icon: 'fas fa-leaf',
            status: 'completed',
            location: 'Mysore, Karnataka, India',
            coordinates: '12.2958,76.6394',
            metadata: [
                { label: 'Growth Period', value: '120 days' },
                { label: 'Irrigation Method', value: 'Drip Irrigation' },
                { label: 'Fertilizer Used', value: 'Organic Compost' },
                { label: 'Pest Control', value: 'Neem-based Natural Pesticide' },
                { label: 'Plant Health Score', value: '95/100' },
                { label: 'Expected Yield', value: '2.5 tons/acre' }
            ],
            certificates: [
                { id: 'cert-003', name: 'Growth Monitoring Report' },
                { id: 'cert-004', name: 'Pesticide Residue Test' }
            ]
        },
        {
            id: 'harvest-001',
            stage: 'harvest',
            title: 'Harvest & Collection',
            date: '2024-09-10',
            description: 'Careful harvesting of mature Ashwagandha roots',
            icon: 'fas fa-cut',
            status: 'completed',
            location: 'Mysore, Karnataka, India',
            coordinates: '12.2958,76.6394',
            metadata: [
                { label: 'Harvest Date', value: 'September 10, 2024' },
                { label: 'Harvest Method', value: 'Manual Hand-picking' },
                { label: 'Total Yield', value: '12.8 tons' },
                { label: 'Quality Grade', value: 'Premium A+' },
                { label: 'Moisture Content', value: '8.2%' },
                { label: 'Active Compounds', value: 'Withanolides 3.2%' }
            ],
            certificates: [
                { id: 'cert-005', name: 'Harvest Quality Certificate' },
                { id: 'cert-006', name: 'Post-Harvest Analysis' }
            ]
        },
        {
            id: 'process-001',
            stage: 'processing',
            title: 'Manufacturing & Processing',
            date: '2024-09-25',
            description: 'Professional processing into standardized extract',
            icon: 'fas fa-industry',
            status: 'completed',
            location: 'Bangalore, Karnataka, India',
            coordinates: '12.9716,77.5946',
            metadata: [
                { label: 'Manufacturer', value: 'AyurMed Pharmaceuticals' },
                { label: 'Processing Method', value: 'CO2 Extraction' },
                { label: 'Input Weight', value: '500 kg' },
                { label: 'Output Weight', value: '125 kg extract' },
                { label: 'Extraction Ratio', value: '4:1' },
                { label: 'Standardization', value: '5% Withanolides' }
            ],
            certificates: [
                { id: 'cert-007', name: 'GMP Manufacturing Certificate' },
                { id: 'cert-008', name: 'Processing Quality Report' }
            ]
        },
        {
            id: 'test-001',
            stage: 'testing',
            title: 'Laboratory Testing',
            date: '2024-10-05',
            description: 'Comprehensive quality and purity testing',
            icon: 'fas fa-flask',
            status: 'completed',
            location: 'Chennai, Tamil Nadu, India',
            coordinates: '13.0827,80.2707',
            metadata: [
                { label: 'Lab', value: 'AyurTest Laboratories' },
                { label: 'Test Type', value: 'Complete Quality Analysis' },
                { label: 'Purity Score', value: '98.5%' },
                { label: 'Heavy Metals', value: 'Below Detection Limit' },
                { label: 'Microbial Count', value: 'Within Safe Limits' },
                { label: 'Withanolides Content', value: '5.2%' }
            ],
            certificates: [
                { id: 'cert-009', name: 'Laboratory Test Report' },
                { id: 'cert-010', name: 'Certificate of Analysis' }
            ]
        },
        {
            id: 'package-001',
            stage: 'packaging',
            title: 'Packaging & Labeling',
            date: '2024-10-12',
            description: 'Final packaging with QR code and batch information',
            icon: 'fas fa-box',
            status: 'completed',
            location: 'Bangalore, Karnataka, India',
            coordinates: '12.9716,77.5946',
            metadata: [
                { label: 'Package Type', value: 'Amber Glass Bottles' },
                { label: 'Package Size', value: '60 capsules' },
                { label: 'Batch Number', value: 'ASH-2024-089' },
                { label: 'Expiry Date', value: 'October 2026' },
                { label: 'QR Code', value: 'Generated' },
                { label: 'Packaging Date', value: 'October 12, 2024' }
            ],
            certificates: [
                { id: 'cert-011', name: 'Packaging Compliance Certificate' }
            ]
        },
        {
            id: 'ship-001',
            stage: 'shipping',
            title: 'Shipping & Distribution',
            date: '2024-10-15',
            description: 'Product shipped to consumer via verified logistics partner',
            icon: 'fas fa-shipping-fast',
            status: 'completed',
            location: 'Hyderabad, Telangana, India',
            coordinates: '17.3850,78.4867',
            metadata: [
                { label: 'Shipping Partner', value: 'AyurLogistics Express' },
                { label: 'Tracking Number', value: 'AL2024089456' },
                { label: 'Shipping Method', value: 'Temperature Controlled' },
                { label: 'Transit Time', value: '2 days' },
                { label: 'Delivery Status', value: 'Delivered' },
                { label: 'Customer', value: 'Arjun Reddy' }
            ]
        }
    ];
}

function updateBlockchainVerification(orderId) {
    // Update blockchain verification details
    document.getElementById('transactionHash').textContent = '0x7d4a2b8c9f1e3a5b...';
    document.getElementById('blockNumber').textContent = '#45,892';
    document.getElementById('blockTimestamp').textContent = new Date().toLocaleString('en-GB');
}

function updateFarmerStory(orderId) {
    // Update farmer information
    document.getElementById('farmerName').textContent = 'Rajesh Kumar';
    document.getElementById('farmerLocation').textContent = 'Mysore, Karnataka, India';
    document.getElementById('farmerStory').textContent = 'Third-generation organic farmer specializing in Ayurvedic herbs. Committed to sustainable farming practices and preserving traditional knowledge passed down through generations.';
}

// Interactive timeline functions
function showTimelineDetails(itemId) {
    showNotification(`Showing detailed information for ${itemId}`, 'info');
    // Could open a modal with more detailed information
}

function expandTimelineItem(itemId) {
    const item = document.querySelector(`[data-stage="${itemId.split('-')[0]}"]`);
    if (item) {
        item.classList.toggle('expanded');
    }
}

function verifyStage(itemId) {
    showNotification('Blockchain verification in progress...', 'info');
    setTimeout(() => {
        showNotification('Stage verified successfully on blockchain!', 'success');
    }, 2000);
}

function showLocationMap(coordinates) {
    const [lat, lng] = coordinates.split(',');
    showNotification(`Opening map for location: ${lat}, ${lng}`, 'info');
    // Could integrate with Google Maps or other mapping service
}

function viewCertificate(certId) {
    showNotification(`Opening certificate ${certId}`, 'info');
    // Could open certificate in new window or modal
}

// QR Code Scanner Functions
function startQRScanner() {
    const video = document.getElementById('qrVideo');
    const canvas = document.getElementById('qrCanvas');
    const placeholder = document.querySelector('.scanner-placeholder');
    const startBtn = document.querySelector('[onclick="startQRScanner()"]');
    const stopBtn = document.getElementById('stopScanBtn');
    
    // Show video, hide placeholder
    video.style.display = 'block';
    placeholder.style.display = 'none';
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    
    // Update scanner status
    document.getElementById('scannerStatus').textContent = 'Scanning...';
    document.getElementById('scannerStatus').className = 'status-badge warning';
    
    // Simulate camera access (in real implementation, use getUserMedia)
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            
            // Simulate QR code detection
            setTimeout(() => {
                const mockQRData = 'ASH-2024-089';
                processQRCode(mockQRData);
            }, 3000);
        })
        .catch(err => {
            showNotification('Camera access denied or not available', 'error');
            stopQRScanner();
        });
}

function stopQRScanner() {
    const video = document.getElementById('qrVideo');
    const placeholder = document.querySelector('.scanner-placeholder');
    const startBtn = document.querySelector('[onclick="startQRScanner()"]');
    const stopBtn = document.getElementById('stopScanBtn');
    
    // Stop video stream
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    
    // Reset UI
    video.style.display = 'none';
    placeholder.style.display = 'block';
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
    
    // Update scanner status
    document.getElementById('scannerStatus').textContent = 'Ready';
    document.getElementById('scannerStatus').className = 'status-badge';
}

function uploadQRImage() {
    document.getElementById('qrImageUpload').click();
}

function processQRImage(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        showNotification('Processing QR code image...', 'info');
        
        // Simulate QR code processing
        setTimeout(() => {
            const mockQRData = 'ASH-2024-089';
            processQRCode(mockQRData);
        }, 2000);
    }
}

function processQRCode(qrData) {
    document.getElementById('lastScanTime').textContent = new Date().toLocaleString('en-GB');
    document.getElementById('traceOrderId').value = qrData;
    
    showNotification(`QR Code detected: ${qrData}`, 'success');
    
    // Auto-trace the detected code
    setTimeout(() => {
        traceOrder();
    }, 1000);
    
    // Add to recent scans
    addToRecentScans(qrData);
}

function addToRecentScans(scanId) {
    const recentScans = document.getElementById('recentScans');
    const newScan = document.createElement('div');
    newScan.className = 'recent-item';
    newScan.innerHTML = `
        <span class="scan-id">${scanId}</span>
        <span class="scan-time">Just now</span>
        <button class="btn-small" onclick="traceById('${scanId}')">View</button>
    `;
    
    // Add to top of list
    const firstChild = recentScans.firstElementChild;
    if (firstChild) {
        recentScans.insertBefore(newScan, firstChild);
    } else {
        recentScans.appendChild(newScan);
    }
    
    // Keep only last 5 scans
    const items = recentScans.querySelectorAll('.recent-item');
    if (items.length > 5) {
        items[items.length - 1].remove();
    }
}

function downloadProvenance() {
    showNotification('Generating provenance report...', 'info');
    setTimeout(() => {
        showNotification('Provenance report downloaded successfully!', 'success');
    }, 2000);
}

function shareProvenance() {
    if (navigator.share) {
        navigator.share({
            title: 'Product Provenance Report',
            text: 'Check out the complete journey of this Ayurvedic product',
            url: window.location.href
        });
    } else {
        // Fallback for browsers without Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Provenance link copied to clipboard!', 'success');
        });
    }
}

// Initialize the consumer portal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language manager
    if (window.languageManager) {
        window.languageManager.init();
    }
    setTimeout(initializeCharts, 1000);
});
