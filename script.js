// Product filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else {
                    const categories = card.getAttribute('data-category');
                    if (categories && categories.includes(filterValue)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Setup add to cart buttons
    setupAddToCartButtons();

    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Create WhatsApp message
            const whatsappMessage = `Hi Plantaria!

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message: ${message}

Thank you!`;

            const whatsappUrl = `https://wa.me/923089181414?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Show success message
            alert('Thank you for your message! You will be redirected to WhatsApp to complete your inquiry.');
            
            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            this.reset();
        });
    }

    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // Handle anchor links for product categories
    const categoryLinks = document.querySelectorAll('a[href*="#"]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's a same-page anchor link
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                
                // Handle filter activation on products page
                if (window.location.pathname.includes('products.html') || window.location.pathname.endsWith('/')) {
                    const filterBtn = document.querySelector(`[data-filter="${targetId}"]`);
                    if (filterBtn) {
                        filterBtn.click();
                    }
                }
            }
            // If it's a cross-page anchor link (like products.html#indoor)
            else if (href.includes('#')) {
                const [, anchor] = href.split('#');
                // Store the anchor to activate after page load
                sessionStorage.setItem('activateFilter', anchor);
            }
        });
    });

    // Activate filter from anchor on page load
    const filterToActivate = sessionStorage.getItem('activateFilter');
    if (filterToActivate) {
        const filterBtn = document.querySelector(`[data-filter="${filterToActivate}"]`);
        if (filterBtn) {
            setTimeout(() => {
                filterBtn.click();
            }, 100);
        }
        sessionStorage.removeItem('activateFilter');
    }

    // Search functionality (basic)
    const searchIcon = document.querySelector('.nav-icons .fa-search');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const searchTerm = prompt('What plants are you looking for?');
            if (searchTerm) {
                // Simple search - filter products by name
                const products = document.querySelectorAll('.product-card h3');
                let found = false;
                
                products.forEach(product => {
                    const productCard = product.closest('.product-card');
                    if (product.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                        productCard.style.display = 'block';
                        productCard.style.border = '2px solid #4CAF50';
                        found = true;
                    } else {
                        productCard.style.display = 'none';
                    }
                });
                
                if (!found) {
                    alert('No products found matching your search. Please try different keywords.');
                    // Reset display
                    products.forEach(product => {
                        const productCard = product.closest('.product-card');
                        productCard.style.display = 'block';
                        productCard.style.border = 'none';
                    });
                }
            }
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards and value cards
    const animatedElements = document.querySelectorAll('.product-card, .value-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Function to setup add to cart buttons
function setupAddToCartButtons() {
    // Regular add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add to cart button clicked'); // Debug log
            
            const productCard = this.closest('.product-card');
            if (!productCard) {
                console.error('Product card not found');
                return;
            }
            
            const productName = productCard.querySelector('h3')?.textContent || 'Unknown Product';
            const priceElement = productCard.querySelector('.price');
            let price = 'Rs.0.00';
            
            if (priceElement) {
                // Get the first price (before any old price)
                const priceText = priceElement.textContent;
                // Match pattern like Rs.2,199.00 or Rs.599.00
                const priceMatch = priceText.match(/Rs\.[\d,]+\.?\d*/);
                price = priceMatch ? priceMatch[0] : 'Rs.0.00';
            }
            
            const imageElement = productCard.querySelector('img');
            let image = 'https://via.placeholder.com/300x250/4CAF50/white?text=Plant';
            
            if (imageElement && imageElement.src && !imageElement.src.includes('placeholder')) {
                image = imageElement.src;
            }
            
            console.log('Product details:', { productName, price, image }); // Debug log
            
            // Add to cart using the shopping cart class
            if (window.shoppingCart) {
                window.shoppingCart.addToCart(productName, price, image);
                
                // Button animation
                const originalText = this.textContent;
                const originalBg = this.style.background;
                this.textContent = 'Added!';
                this.style.background = '#45a049';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = originalBg || '#4CAF50';
                    this.disabled = false;
                }, 2000);
            } else {
                console.error('Shopping cart not initialized');
                alert('Shopping cart is not ready. Please refresh the page.');
            }
        });
    });

    // Deal buttons functionality
    const dealButtons = document.querySelectorAll('.add-to-cart-deal');
    dealButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Deal button clicked'); // Debug log
            
            const productName = this.dataset.name || 'Unknown Product';
            const price = this.dataset.price || 'Rs.0.00';
            let image = this.dataset.image || 'https://via.placeholder.com/300x250/4CAF50/white?text=Plant';
            
            // If image is just a filename, create a placeholder
            if (image && !image.startsWith('http') && !image.startsWith('data:')) {
                image = 'https://via.placeholder.com/300x250/4CAF50/white?text=Plant';
            }
            
            console.log('Deal product details:', { productName, price, image }); // Debug log
            
            // Add to cart using the shopping cart class
            if (window.shoppingCart) {
                window.shoppingCart.addToCart(productName, price, image);
                
                // Button animation
                const originalText = this.textContent;
                const originalBg = this.style.background;
                this.textContent = 'Added!';
                this.style.background = '#45a049';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = originalBg || 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
                    this.disabled = false;
                }, 2000);
            } else {
                console.error('Shopping cart not initialized');
                alert('Shopping cart is not ready. Please refresh the page.');
            }
        });
    });
}

// Enhanced Shopping cart functionality
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('plantaria_cart')) || [];
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.createCartModal();
        this.bindEvents();
    }

    addToCart(productName, price, image = 'images/placeholder.jpg') {
        console.log('Adding to cart:', productName, price, image); // Debug log
        
        // Clean price - handle formats like "Rs.2,999.00 PKR" or "Rs.599.00"
        let cleanPrice = price;
        
        // Remove "Rs." and "PKR" and any extra spaces
        cleanPrice = cleanPrice.replace(/Rs\./gi, '').replace(/PKR/gi, '').trim();
        
        // Remove commas (thousands separators)
        cleanPrice = cleanPrice.replace(/,/g, '');
        
        // Convert to number
        cleanPrice = parseFloat(cleanPrice) || 0;
        
        console.log('Original price:', price, 'Cleaned price:', cleanPrice); // Debug log
        
        const item = {
            id: Date.now() + Math.random(),
            name: productName,
            price: cleanPrice,
            originalPrice: price,
            image: image,
            quantity: 1
        };
        
        console.log('Item to add:', item); // Debug log
        
        // Check if item already exists
        const existingItem = this.cart.find(cartItem => cartItem.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
            console.log('Updated existing item:', existingItem); // Debug log
        } else {
            this.cart.push(item);
            console.log('Added new item to cart'); // Debug log
        }
        
        console.log('Current cart:', this.cart); // Debug log
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddedToCartNotification(productName);
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartModal();
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartModal();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartModal();
    }

    saveCart() {
        localStorage.setItem('plantaria_cart', JSON.stringify(this.cart));
    }

    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    updateCartDisplay() {
        const cartIcon = document.querySelector('.fa-shopping-cart');
        if (!cartIcon) return;

        // Remove existing badge
        const existingBadge = cartIcon.parentElement.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        if (this.cart.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = this.getTotalItems();
            cartIcon.parentElement.style.position = 'relative';
            cartIcon.parentElement.appendChild(badge);
        }
    }

    showAddedToCartNotification(productName) {
        // Remove existing notification
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${productName} added to cart!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    createCartModal() {
        // Check if modal already exists
        if (document.querySelector('.cart-modal')) {
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h2><i class="fas fa-shopping-cart"></i> Shopping Cart</h2>
                    <button class="close-cart">&times;</button>
                </div>
                <div class="cart-items"></div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: Rs.<span class="total-amount">0</span> PKR</strong>
                    </div>
                    <div class="cart-actions">
                        <button class="clear-cart-btn">Clear Cart</button>
                        <button class="checkout-btn">Checkout via WhatsApp</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.updateCartModal();
    }

    updateCartModal() {
        const cartItems = document.querySelector('.cart-items');
        const totalAmount = document.querySelector('.total-amount');
        
        if (!cartItems || !totalAmount) {
            console.log('Cart modal elements not found'); // Debug log
            return;
        }

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            totalAmount.textContent = '0';
            return;
        }

        console.log('Updating cart modal with items:', this.cart); // Debug log

        cartItems.innerHTML = this.cart.map(item => {
            console.log('Rendering item:', item); // Debug log
            return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/60x60/4CAF50/white?text=Plant'">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">Rs.${item.price} PKR</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-id="${item.id}" type="button">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}" type="button">+</button>
                </div>
                <div class="cart-item-total">
                    Rs.${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" data-id="${item.id}" type="button">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        }).join('');

        totalAmount.textContent = this.getTotalPrice().toFixed(2);
        console.log('Cart modal updated successfully'); // Debug log
    }

    bindEvents() {
        // Cart icon click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-shopping-cart')) {
                console.log('Cart icon clicked'); // Debug log
                this.openCartModal();
            }
        });

        // Modal events - Use event delegation
        document.addEventListener('click', (e) => {
            console.log('Click event:', e.target.className); // Debug log
            
            // Close cart modal
            if (e.target.classList.contains('close-cart')) {
                console.log('Close cart clicked'); // Debug log
                this.closeCartModal();
                return;
            }
            
            // Close modal when clicking outside
            if (e.target.classList.contains('cart-modal')) {
                console.log('Modal background clicked'); // Debug log
                this.closeCartModal();
                return;
            }
            
            // Quantity buttons
            if (e.target.classList.contains('quantity-btn')) {
                console.log('Quantity button clicked'); // Debug log
                const itemId = parseFloat(e.target.dataset.id);
                const item = this.cart.find(item => item.id === itemId);
                console.log('Found item:', item); // Debug log
                
                if (item) {
                    if (e.target.classList.contains('plus')) {
                        console.log('Plus button - increasing quantity'); // Debug log
                        this.updateQuantity(itemId, item.quantity + 1);
                    } else if (e.target.classList.contains('minus')) {
                        console.log('Minus button - decreasing quantity'); // Debug log
                        this.updateQuantity(itemId, item.quantity - 1);
                    }
                }
                return;
            }
            
            // Remove item button
            if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                console.log('Remove item clicked'); // Debug log
                const button = e.target.closest('.remove-item') || e.target;
                const itemId = parseFloat(button.dataset.id);
                console.log('Removing item with ID:', itemId); // Debug log
                this.removeFromCart(itemId);
                return;
            }
            
            // Clear cart button
            if (e.target.classList.contains('clear-cart-btn')) {
                console.log('Clear cart clicked'); // Debug log
                if (confirm('Are you sure you want to clear your cart?')) {
                    this.clearCart();
                }
                return;
            }
            
            // Checkout button
            if (e.target.classList.contains('checkout-btn')) {
                console.log('Checkout button clicked'); // Debug log
                this.checkout();
                return;
            }
        });
    }

    openCartModal() {
        const modal = document.querySelector('.cart-modal');
        if (modal) {
            modal.classList.add('show');
            this.updateCartModal();
        }
    }

    closeCartModal() {
        const modal = document.querySelector('.cart-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        console.log('Starting checkout process'); // Debug log

        let message = `Hi Plantaria! I would like to place an order:\n\n`;
        
        this.cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price: Rs.${item.price} PKR each\n`;
            message += `   Subtotal: Rs.${(item.price * item.quantity).toFixed(2)} PKR\n\n`;
        });
        
        message += `Total Amount: Rs.${this.getTotalPrice().toFixed(2)} PKR\n\n`;
        message += `Please confirm availability and delivery details.\n\nThank you!`;

        console.log('WhatsApp message:', message); // Debug log

        const whatsappUrl = `https://wa.me/923089181414?text=${encodeURIComponent(message)}`;
        console.log('WhatsApp URL:', whatsappUrl); // Debug log
        
        // Try to open WhatsApp
        try {
            window.open(whatsappUrl, '_blank');
            console.log('WhatsApp opened successfully'); // Debug log
            
            // Ask if user wants to clear cart
            setTimeout(() => {
                if (confirm('Order sent to WhatsApp! Would you like to clear your cart?')) {
                    this.clearCart();
                    this.closeCartModal();
                }
            }, 1000);
        } catch (error) {
            console.error('Error opening WhatsApp:', error);
            alert('Could not open WhatsApp. Please copy this message and send manually:\n\n' + message);
        }
    }
}

// Initialize shopping cart globally
window.shoppingCart = new ShoppingCart();

// Debug function to test cart manually
function testCart() {
    console.log('Testing cart functionality...');
    if (window.shoppingCart) {
        // Test the exact problematic item
        window.shoppingCart.addToCart('Buy any 3 Products for 2999/-', 'Rs.2,999.00 PKR', 'https://via.placeholder.com/300x250/4CAF50/white?text=Test+Plant');
        
        // Test other formats
        window.shoppingCart.addToCart('Test Plant 1', 'Rs.500.00', 'https://via.placeholder.com/300x250/4CAF50/white?text=Test+Plant');
        window.shoppingCart.addToCart('Test Plant 2', 'Rs.2,199.00 PKR', 'https://via.placeholder.com/300x250/4CAF50/white?text=Test+Plant');
        
        console.log('Test items added to cart');
        window.shoppingCart.openCartModal();
    } else {
        console.error('Shopping cart not available');
    }
}

// Test price parsing function
function testPriceParsing() {
    const testPrices = [
        'Rs.500.00',
        'Rs.2,199.00 PKR',
        'Rs.2,999.00 PKR',
        'Rs.1,499.00',
        'From Rs.2,199.00 PKR',
        'Rs.599.00 Rs.899.00'
    ];
    
    console.log('Testing price parsing:');
    testPrices.forEach(price => {
        // Use the same logic as in addToCart
        let cleanPrice = price;
        cleanPrice = cleanPrice.replace(/Rs\./gi, '').replace(/PKR/gi, '').trim();
        cleanPrice = cleanPrice.replace(/,/g, '');
        cleanPrice = parseFloat(cleanPrice) || 0;
        
        console.log(`"${price}" -> ${cleanPrice}`);
    });
}

// Make test functions available globally
window.testCart = testCart;
window.testPriceParsing = testPriceParsing;