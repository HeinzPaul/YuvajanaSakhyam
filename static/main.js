// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.event-slide');
const totalSlides = slides.length;

function showSlide(index) {
    const carousel = document.getElementById('eventsCarousel');
    carousel.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance carousel every 6 seconds
setInterval(nextSlide, 6000);

// Header scroll effect
let lastScrollY = window.scrollY;
let ticking = false;
const header = document.getElementById('header');

function handleNavbarVisibility() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down
        header.classList.add('navbar-hidden');
    } else {
        // Scrolling up
        header.classList.remove('navbar-hidden');
    }
    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(handleNavbarVisibility);
        ticking = true;
    }
    // Existing scrolled effect
    if (window.scrollY > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        // Close mobile nav if open
        if (document.body.classList.contains('mobile-nav-open')) {
            document.body.classList.remove('mobile-nav-open');
        }

        if (target) {
            // Adjust scroll position for fixed header
            const headerOffset = document.getElementById('header').offsetHeight;
            const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Start animation slightly before it's fully in view
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Staggered animation delays for grid items (applied via CSS)
// No need for JS here, as we can control this with CSS :nth-child and animation-delay

// Hero background slideshow
const heroImages = [
    '/static/image1.jpeg',
    '/static/image2.jpeg',
    '/static/image3.jpeg',
    '/static/image4.jpeg'
];
let heroImageIndex = 3;
const heroBg = document.querySelector('.hero-bg-slideshow');

function updateHeroBg() {
    heroBg.style.opacity = 0; // Fade out
    setTimeout(() => {
        heroBg.style.backgroundImage = `url('${heroImages[heroImageIndex]}')`;
        heroBg.style.opacity = 1; // Fade in
    }, 600); // Match half the CSS transition duration for smoothness
}

// Initialize first image immediately
updateHeroBg();

// Cycle images every 10 seconds
setInterval(() => {
    heroImageIndex = (heroImageIndex + 1) % heroImages.length;
    updateHeroBg();
}, 10000);

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const closeBtn = document.querySelector('.close-btn');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        document.body.classList.add('mobile-nav-open');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        document.body.classList.remove('mobile-nav-open');
    });
}

mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.body.classList.remove('mobile-nav-open');
    });
});

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Touch gestures for mobile carousel
let touchStartX = 0;
let touchEndX = 0;
const eventCarousel = document.getElementById('eventsCarousel');

if (eventCarousel) {
    eventCarousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    eventCarousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    });
}

function handleGesture() {
    if (touchEndX < touchStartX - 50) { // Swipe left
        nextSlide();
    }
    if (touchEndX > touchStartX + 50) { // Swipe right
        prevSlide();
    }
}
