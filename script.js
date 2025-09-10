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
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
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
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
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
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

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

    // Testimonials Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current testimonial
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

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                // Simulate subscription success
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.querySelector('input[type="email"]').value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Button Click Effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Menu Card Hover Effects
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animation for menu cards
                if (entry.target.classList.contains('menu-card')) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, Math.random() * 200);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.menu-card, .info-card, .about-text, .about-image');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        // Hide scroll indicator when scrolling
        if (scrollIndicator) {
            if (scrolled > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }
    });

    // Dynamic coffee cup animation
    const coffeeCup = document.querySelector('.coffee-cup');
    if (coffeeCup) {
        let mouseX = 0, mouseY = 0;
        let cupX = 0, cupY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.01;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.01;
        });

        function animateCup() {
            cupX += (mouseX - cupX) * 0.1;
            cupY += (mouseY - cupY) * 0.1;
            
            coffeeCup.style.transform = `translate(${cupX}px, ${cupY}px) rotate(${cupX * 0.5}deg)`;
            requestAnimationFrame(animateCup);
        }
        
        animateCup();
    }

    // Loading screen (optional)
    window.addEventListener('load', function() {
        const body = document.body;
        body.classList.add('loaded');
        
        // Add subtle entrance animation to main elements
        setTimeout(() => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }
        }, 100);
    });

    // Social links hover effects
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Counter animation for stats (if needed)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Menu item click tracking (analytics placeholder)
    const menuItems = document.querySelectorAll('.menu-card');
    menuItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const itemName = this.querySelector('h3').textContent;
            console.log(`Menu item clicked: ${itemName}`);
            
            // Add a subtle click feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Utility function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles for notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add ripple effect styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        pointer-events: none;
        animation: ripple-animation 0.6s ease-out;
    }
    
    @keyframes ripple-animation {
        from {
            opacity: 1;
            transform: scale(0);
        }
        to {
            opacity: 0;
            transform: scale(1);
        }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;

document.head.appendChild(rippleStyles);
