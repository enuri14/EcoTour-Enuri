// DOM Elements
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const bookingModal = document.getElementById('booking-modal');
const closeModal = document.querySelector('.close');
const bookTourBtns = document.querySelectorAll('.book-tour-btn');
const bookNowBtns = document.querySelectorAll('.book-btn');
const contactForm = document.getElementById('contact-form');
const bookingForm = document.getElementById('booking-form');

// Mobile Menu Toggle
mobileMenu.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Booking Modal Functions
function openBookingModal(tourType = '') {
    bookingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Pre-select tour if specified
    if (tourType) {
        const tourSelect = document.getElementById('tour-select');
        tourSelect.value = tourType;
    }
    
    // Set minimum date to today
    const dateInput = document.getElementById('travel-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

function closeBookingModal() {
    bookingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    bookingForm.reset();
    clearMessages();
}

// Event listeners for booking buttons
bookTourBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const tourType = this.getAttribute('data-tour');
        openBookingModal(tourType);
    });
});

bookNowBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        openBookingModal();
    });
});

// Close modal events
closeModal.addEventListener('click', closeBookingModal);

window.addEventListener('click', function(e) {
    if (e.target === bookingModal) {
        closeBookingModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && bookingModal.style.display === 'block') {
        closeBookingModal();
    }
});

// Form Submissions
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        showMessage(this, 'Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage(this, 'Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showMessage(this, 'Thank you for your message! We\'ll get back to you soon.', 'success');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const tour = formData.get('tour');
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const date = formData.get('date');
    const participants = formData.get('participants');
    
    // Basic validation
    if (!tour || !name || !email || !phone || !date || !participants) {
        showMessage(this, 'Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage(this, 'Please enter a valid email address.', 'error');
        return;
    }
    
    // Check if date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showMessage(this, 'Please select a future date.', 'error');
        return;
    }
    
    // Simulate booking submission
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showMessage(this, 'Booking request submitted successfully! We\'ll contact you within 24 hours to confirm your reservation.', 'success');
        
        // Close modal after successful submission
        setTimeout(() => {
            closeBookingModal();
        }, 3000);
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(form, message, type) {
    // Remove existing messages
    clearMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    form.appendChild(messageDiv);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove message after 5 seconds for success, 8 seconds for error
    setTimeout(() => {
        messageDiv.remove();
    }, type === 'error' ? 8000 : 5000);
}

function clearMessages() {
    const messages = document.querySelectorAll('.success-message, .error-message');
    messages.forEach(message => message.remove());
}

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.tour-card, .value-item, .contact-item');
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Add staggered animation delay to tour cards
    const tourCards = document.querySelectorAll('.tour-card');
    tourCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
});

// Add loading state to buttons
document.querySelectorAll('button[type="submit"], .cta-button, .book-tour-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Add visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Update footer year
document.addEventListener('DOMContentLoaded', function() {
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        footerText.innerHTML = footerText.innerHTML.replace('2024', new Date().getFullYear());
    }
});

// Handle form input focus states
document.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Preload important resources
document.addEventListener('DOMContentLoaded', function() {
    // Preload Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'style';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap';
    document.head.appendChild(fontLink);
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Debounce scroll events
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

// Apply debounce to scroll event
const debouncedScroll = debounce(function() {
    // Any scroll-based animations or updates can go here
    console.log('Scroll event processed');
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScroll);

console.log('EcoTour website loaded successfully! 🌿');