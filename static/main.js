// --- About Vision Animation on Scroll ---
// --- About Vision Animation on Scroll (replayable) ---
function animateAboutVisionOnScroll() {
    const aboutSection = document.querySelector('#about');
    const visionTitle = document.querySelector('.about-visual-vision-title');
    const visionDesc = document.querySelector('.about-visual-vision-desc');
    if (!aboutSection || !visionTitle || !visionDesc) return;

    let timeoutId = null;

    function checkAndAnimate() {
        const rect = aboutSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.2;
        if (inView) {
            if (!visionTitle.classList.contains('visible') && !visionDesc.classList.contains('visible')) {
                timeoutId = setTimeout(() => {
                    visionTitle.classList.add('visible');
                    visionDesc.classList.add('visible');
                }, 200);
            }
        } else {
            // Remove animation classes and clear timeout if leaving section
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            visionTitle.classList.remove('visible');
            visionDesc.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', checkAndAnimate);
    window.addEventListener('resize', checkAndAnimate);
    // In case already in view on load
    checkAndAnimate();
}

document.addEventListener('DOMContentLoaded', animateAboutVisionOnScroll);
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
    '/static/slideShowImages/image1.jpeg',
    '/static/slideShowImages/image2.jpeg',
    '/static/slideShowImages/image3.jpeg',
    '/static/slideShowImages/image4.jpeg'
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

// On page load, set avatar images if present in localStorage
window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.member-card').forEach(function (card) {
        const member = card.querySelector('.member-avatar').textContent.trim();
        // Try to find an avatar image in static/avatars by convention
        const possibleExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        let found = false;
        for (let ext of possibleExtensions) {
            const url = `/static/avatars/${member}.${ext}`;
            const img = new window.Image();
            img.onload = function () {
                if (!found) {
                    const avatar = card.querySelector('.member-avatar');
                    avatar.style.backgroundImage = `url('${url}')`;
                    avatar.style.backgroundSize = 'cover';
                    avatar.style.backgroundPosition = 'center';
                    avatar.style.backgroundRepeat = 'no-repeat';
                    avatar.textContent = '';
                    found = true;
                }
            };
            img.onerror = function () { };
            img.src = url;
        }
    });
});

document.getElementById('showEditBtn').addEventListener('click', function () {
    document.querySelectorAll('.member-card').forEach(function (card) {
        if (!card.querySelector('.edit-pencil-btn')) {
            const btn = document.createElement('button');
            btn.className = 'edit-pencil-btn';
            btn.title = 'Edit';
            btn.innerHTML = '<svg width="20" height="20" fill="none" stroke="#0095ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>';
            btn.style.background = 'transparent';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.style.position = 'absolute';
            btn.style.top = '12px';
            btn.style.right = '12px';
            btn.style.padding = '4px';
            btn.style.borderRadius = '50%';
            btn.style.transition = 'background 0.2s';
            btn.onmouseover = function () { btn.style.background = '#e3f2fd'; };
            btn.onmouseout = function () { btn.style.background = 'transparent'; };
            card.style.position = 'relative';
            card.appendChild(btn);
        }
        // Add avatar hover overlay for image change
        const avatar = card.querySelector('.member-avatar');
        if (avatar && !avatar.classList.contains('edit-hover-enabled')) {
            avatar.classList.add('edit-hover-enabled');
            avatar.addEventListener('mouseenter', function () {
                avatar.classList.add('edit-hover');
            });
            avatar.addEventListener('mouseleave', function () {
                avatar.classList.remove('edit-hover');
            });
        }
        // Enable file input only after login
        card.classList.add('avatar-edit-enabled');
    });
});

document.querySelectorAll('.member-card').forEach(function (card) {
    // Add a hidden file input if not present
    if (!card.querySelector('.avatar-upload-input')) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        input.className = 'avatar-upload-input';
        card.appendChild(input);

        // When file is selected, upload it
        input.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('member', card.querySelector('.member-avatar').textContent.trim());

            fetch('/upload-avatar', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.url) {
                        const avatar = card.querySelector('.member-avatar');
                        avatar.style.backgroundImage = `url('${data.url}')`;
                        avatar.style.backgroundSize = 'cover';
                        avatar.style.backgroundPosition = 'center';
                        avatar.style.backgroundRepeat = 'no-repeat';
                        avatar.textContent = '';
                        // Store in localStorage for persistence
                        localStorage.setItem('avatar_' + card.querySelector('.member-avatar').textContent.trim(), data.url);
                    } else {
                        alert('Upload failed');
                    }
                })
                .catch(() => alert('Upload failed'));
        });
    }

    // When overlay or pencil is clicked, trigger file input
    card.addEventListener('click', function (e) {
        // Only allow editing if enabled
        if (!card.classList.contains('avatar-edit-enabled')) return;
        if (
            e.target.classList.contains('edit-pencil-btn') ||
            e.target.classList.contains('member-avatar') ||
            (e.target.closest('.member-avatar') && e.target.closest('.member-avatar').classList.contains('member-avatar'))
        ) {
            card.querySelector('.avatar-upload-input').click();
        }
    });
});