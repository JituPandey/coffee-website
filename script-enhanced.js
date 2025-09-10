// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(139, 69, 19, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(139, 69, 19, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Advanced Features for Resume Enhancement

    // 1. Intersection Observer for scroll animations
    const scrollObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, scrollObserverOptions);

    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        scrollObserver.observe(section);
    });

    // 2. Local Storage for user preferences
    const UserPreferences = {
        theme: localStorage.getItem('coffee-theme') || 'light',
        
        save: function() {
            localStorage.setItem('coffee-theme', this.theme);
        },
        
        toggle: function() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.save();
            this.apply();
        },
        
        apply: function() {
            document.body.setAttribute('data-theme', this.theme);
        }
    };

    // Apply saved theme
    UserPreferences.apply();

    // 3. Shopping Cart functionality (demonstrates state management)
    class CoffeeCart {
        constructor() {
            this.items = JSON.parse(localStorage.getItem('coffee-cart')) || [];
            this.init();
        }

        init() {
            this.createCartUI();
            this.attachEventListeners();
            this.updateCartCount();
        }

        createCartUI() {
            // Add cart icon to navigation
            const cartHTML = `
                <div class="cart-icon" id="cart-toggle">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                </div>
            `;
            document.querySelector('.nav-container').insertAdjacentHTML('beforeend', cartHTML);

            // Create cart sidebar
            const cartSidebar = `
                <div class="cart-sidebar" id="cart-sidebar">
                    <div class="cart-header">
                        <h3>Your Order</h3>
                        <button class="cart-close" id="cart-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="cart-items" id="cart-items">
                        <!-- Cart items will be populated here -->
                    </div>
                    <div class="cart-footer">
                        <div class="cart-total">
                            Total: $<span id="cart-total">0.00</span>
                        </div>
                        <button class="btn btn-primary" id="checkout-btn">Checkout</button>
                    </div>
                </div>
                <div class="cart-overlay" id="cart-overlay"></div>
            `;
            document.body.insertAdjacentHTML('beforeend', cartSidebar);
        }

        attachEventListeners() {
            // Add "Add to Cart" buttons to menu items
            document.querySelectorAll('.menu-card').forEach(card => {
                const button = document.createElement('button');
                button.classList.add('btn', 'btn-primary', 'add-to-cart');
                button.innerHTML = '<i class="fas fa-plus"></i> Add to Cart';
                button.onclick = () => this.addItem(card);
                card.querySelector('.menu-content').appendChild(button);
            });

            // Cart toggle
            document.getElementById('cart-toggle').onclick = () => this.toggleCart();
            document.getElementById('cart-close').onclick = () => this.closeCart();
            document.getElementById('cart-overlay').onclick = () => this.closeCart();
        }

        addItem(menuCard) {
            const name = menuCard.querySelector('h3').textContent;
            const price = parseFloat(menuCard.querySelector('.price').textContent.replace('$', ''));
            
            const existingItem = this.items.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({ name, price, quantity: 1 });
            }
            
            this.saveToStorage();
            this.updateCartUI();
            this.showAddedNotification(name);
        }

        updateCartUI() {
            this.updateCartCount();
            this.updateCartItems();
            this.updateCartTotal();
        }

        updateCartCount() {
            const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
            document.querySelector('.cart-count').textContent = count;
        }

        updateCartItems() {
            const cartItemsContainer = document.getElementById('cart-items');
            cartItemsContainer.innerHTML = '';
            
            this.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <span class="item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="coffeeCart.changeQuantity('${item.name}', -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="coffeeCart.changeQuantity('${item.name}', 1)">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        updateCartTotal() {
            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('cart-total').textContent = total.toFixed(2);
        }

        changeQuantity(itemName, change) {
            const item = this.items.find(item => item.name === itemName);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    this.items = this.items.filter(i => i.name !== itemName);
                }
                this.saveToStorage();
                this.updateCartUI();
            }
        }

        toggleCart() {
            document.getElementById('cart-sidebar').classList.toggle('open');
            document.getElementById('cart-overlay').classList.toggle('active');
        }

        closeCart() {
            document.getElementById('cart-sidebar').classList.remove('open');
            document.getElementById('cart-overlay').classList.remove('active');
        }

        saveToStorage() {
            localStorage.setItem('coffee-cart', JSON.stringify(this.items));
        }

        showAddedNotification(itemName) {
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `
                <i class="fas fa-check"></i>
                Added ${itemName} to cart!
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
    }

    // Initialize cart
    const coffeeCart = new CoffeeCart();

    // 4. Newsletter subscription with validation
    const newsletterFormElement = document.querySelector('.newsletter-form');
    if (newsletterFormElement) {
        newsletterFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate API call
            try {
                showNotification('Subscribing...', 'info');
                await simulateAPICall();
                showNotification('Successfully subscribed to newsletter!', 'success');
                this.reset();
            } catch (error) {
                showNotification('Subscription failed. Please try again.', 'error');
            }
        });
    }

    // 5. Performance optimization - Lazy loading images
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length) {
        const imageObserverOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, imageObserverOptions);

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // 6. Search functionality
    function createSearchFeature() {
        const searchHTML = `
            <div class="search-container">
                <input type="text" id="menu-search" placeholder="Search menu items...">
                <i class="fas fa-search"></i>
            </div>
        `;
        
        const menuSection = document.querySelector('#menu .section-header');
        menuSection.insertAdjacentHTML('afterend', searchHTML);

        document.getElementById('menu-search').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const menuCards = document.querySelectorAll('.menu-card');
            
            menuCards.forEach(card => {
                const itemName = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (itemName.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    createSearchFeature();

    // 7. Testimonials Slider with auto-play
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });

    // Auto-rotate testimonials every 5 seconds
    setInterval(nextTestimonial, 5000);

    // 8. Dark/Light theme toggle
    function createThemeToggle() {
        const themeToggle = `
            <button class="theme-toggle" id="theme-toggle" title="Toggle Dark Mode">
                <i class="fas fa-moon"></i>
            </button>
        `;
        document.querySelector('.nav-container').insertAdjacentHTML('beforeend', themeToggle);

        document.getElementById('theme-toggle').addEventListener('click', function() {
            UserPreferences.toggle();
            const icon = this.querySelector('i');
            icon.className = UserPreferences.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    createThemeToggle();

    // Utility functions
    async function simulateAPICall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.1 ? resolve() : reject();
            }, 1500);
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 9. Scroll-to-top button
    function createScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollButton);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });

        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    createScrollToTop();

    // 10. Form validation and enhancement
    function enhanceForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (this.value.trim() === '') {
                        this.classList.add('error');
                    } else {
                        this.classList.remove('error');
                    }
                });
            });
        });
    }

    enhanceForms();
});
