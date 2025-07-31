// Sample product data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        price: 134900,
        originalPrice: 159900,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
        rating: 4.5,
        reviews: 12847,
        category: "mobiles"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        price: 124999,
        originalPrice: 149999,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
        rating: 4.4,
        reviews: 8934,
        category: "mobiles"
    },
    {
        id: 3,
        name: "MacBook Air M3",
        price: 114900,
        originalPrice: 134900,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 5623,
        category: "electronics"
    },
    {
        id: 4,
        name: "Sony WH-1000XM5 Headphones",
        price: 24990,
        originalPrice: 29990,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        rating: 4.3,
        reviews: 3421,
        category: "electronics"
    },
    {
        id: 5,
        name: "Nike Air Max 270",
        price: 12995,
        originalPrice: 16995,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        rating: 4.2,
        reviews: 2876,
        category: "fashion"
    },
    {
        id: 6,
        name: "Adidas Ultraboost 22",
        price: 15999,
        originalPrice: 18999,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop",
        rating: 4.4,
        reviews: 1987,
        category: "fashion"
    },
    {
        id: 7,
        name: "LG 55\" 4K Smart TV",
        price: 54999,
        originalPrice: 69999,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop",
        rating: 4.1,
        reviews: 1456,
        category: "electronics"
    },
    {
        id: 8,
        name: "Instant Pot Duo 7-in-1",
        price: 8999,
        originalPrice: 12999,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
        rating: 4.5,
        reviews: 9876,
        category: "home"
    }
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentSlide = 0;

// DOM elements
const productsGrid = document.getElementById('products-grid');
const cartCount = document.querySelector('.cart-count');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    setupEventListeners();
    startTimer();
    createScrollToTopButton();
});

// Load products into the grid
function loadProducts(productsToShow = products) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <h3>${product.name}</h3>
        <div class="product-rating">
            <span class="rating-stars">${generateStars(product.rating)}</span>
            <span class="rating-count">(${product.reviews.toLocaleString()})</span>
        </div>
        <div class="product-price">
            <span class="current-price">₹${product.price.toLocaleString()}</span>
            <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
            <span class="discount">${Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
        </div>
        <button class="add-to-cart" onclick="addToCart(${product.id})">
            <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
    `;
    
    // Add click event for product details
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-to-cart')) {
            showProductDetails(product);
        }
    });
    
    return card;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Search functionality
function setupEventListeners() {
    // Search
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
    
    // Category clicks
    document.querySelectorAll('.nav-links a, .category-card').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.currentTarget.textContent.toLowerCase().trim();
            filterByCategory(category);
        });
    });
    
    // Login button
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    // Cart button
    const cartBtn = document.querySelector('.cart');
    if (cartBtn) {
        cartBtn.addEventListener('click', showCartModal);
    }
    
    // Hero CTA button
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            document.querySelector('.featured-products').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
}

// Perform search
function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    
    loadProducts(filteredProducts);
    
    // Scroll to products section
    document.querySelector('.featured-products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Filter by category
function filterByCategory(category) {
    let filteredProducts = products;
    
    if (category.includes('electronics')) {
        filteredProducts = products.filter(p => p.category === 'electronics');
    } else if (category.includes('fashion')) {
        filteredProducts = products.filter(p => p.category === 'fashion');
    } else if (category.includes('mobile')) {
        filteredProducts = products.filter(p => p.category === 'mobiles');
    } else if (category.includes('home')) {
        filteredProducts = products.filter(p => p.category === 'home');
    }
    
    loadProducts(filteredProducts);
    document.querySelector('.featured-products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Show product details modal
function showProductDetails(product) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content product-modal">
            <button class="modal-close">&times;</button>
            <div class="product-details">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <div class="product-rating">
                        <span class="rating-stars">${generateStars(product.rating)}</span>
                        <span class="rating-count">(${product.reviews.toLocaleString()} reviews)</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">₹${product.price.toLocaleString()}</span>
                        <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
                        <span class="discount">${Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
                    </div>
                    <div class="product-features">
                        <h4>Key Features:</h4>
                        <ul>
                            <li>Premium Quality</li>
                            <li>Fast Delivery</li>
                            <li>1 Year Warranty</li>
                            <li>Easy Returns</li>
                        </ul>
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart-large" onclick="addToCart(${product.id}); closeModal()">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="buy-now">
                            <i class="fas fa-bolt"></i> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal events
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Show login modal
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content login-modal">
            <button class="modal-close">&times;</button>
            <div class="login-form">
                <h2>Login to FlipMart</h2>
                <form>
                    <div class="form-group">
                        <input type="email" placeholder="Email or Mobile Number" required>
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="login-submit">Login</button>
                </form>
                <div class="login-options">
                    <a href="#" class="forgot-password">Forgot Password?</a>
                    <p>New to FlipMart? <a href="#" class="create-account">Create an account</a></p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal events
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Show cart modal
function showCartModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    let cartHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartHTML = cart.map(item => {
            total += item.price * item.quantity;
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="item-price">₹${item.price.toLocaleString()}</p>
                    </div>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');
    }
    
    modal.innerHTML = `
        <div class="modal-content cart-modal">
            <button class="modal-close">&times;</button>
            <div class="cart-content">
                <h2>Shopping Cart</h2>
                <div class="cart-items">
                    ${cartHTML}
                </div>
                ${cart.length > 0 ? `
                    <div class="cart-total">
                        <h3>Total: ₹${total.toLocaleString()}</h3>
                        <button class="checkout-btn">Proceed to Checkout</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal events
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Update quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            // Refresh cart modal
            closeModal();
            showCartModal();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    // Refresh cart modal
    closeModal();
    showCartModal();
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Timer for deals
function startTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    
    let timeLeft = 24 * 60 * 60; // 24 hours in seconds
    
    function updateTimer() {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timeLeft--;
        
        if (timeLeft < 0) {
            timeLeft = 24 * 60 * 60; // Reset to 24 hours
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Create scroll to top button
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add modal styles
const modalStyles = `
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.8);
    animation: scaleIn 0.3s forwards;
}

.modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    z-index: 1;
    color: #666;
}

.product-modal {
    width: 800px;
    padding: 30px;
}

.product-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.product-image img {
    width: 100%;
    border-radius: 8px;
}

.product-info h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
}

.product-features {
    margin: 20px 0;
}

.product-features ul {
    list-style: none;
    padding-left: 0;
}

.product-features li {
    padding: 5px 0;
    color: #666;
}

.product-actions {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.add-to-cart-large, .buy-now {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.add-to-cart-large {
    background: #ff9f00;
    color: white;
}

.buy-now {
    background: #fb641b;
    color: white;
}

.login-modal {
    width: 400px;
    padding: 40px;
}

.login-form h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #2874f0;
}

.form-group {
    margin-bottom: 20px;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.login-submit {
    width: 100%;
    background: #fb641b;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 20px;
}

.login-options {
    text-align: center;
}

.login-options a {
    color: #2874f0;
    text-decoration: none;
}

.cart-modal {
    width: 600px;
    padding: 30px;
}

.cart-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
}

.cart-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
}

.item-details {
    flex: 1;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.quantity-controls button {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
}

.remove-item {
    background: #ff6161;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
}

.cart-total {
    margin-top: 20px;
    text-align: center;
}

.checkout-btn {
    background: #fb641b;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 15px;
}

.empty-cart {
    text-align: center;
    padding: 40px;
    color: #666;
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 15px 20px;
    border-radius: 6px;
    z-index: 10001;
    transform: translateX(100%);
    transition: transform 0.3s;
}

.notification.show {
    transform: translateX(0);
}

@keyframes fadeIn {
    to { opacity: 1; }
}

@keyframes scaleIn {
    to { transform: scale(1); }
}

@media (max-width: 768px) {
    .modal-content {
        width: 95vw;
        margin: 20px;
    }
    
    .product-details {
        grid-template-columns: 1fr;
    }
    
    .product-actions {
        flex-direction: column;
    }
}
`;

// Add modal styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);