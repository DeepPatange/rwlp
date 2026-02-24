// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== MOBILE MENU TOGGLE ==========
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ========== EXPLORE CAROUSEL ==========
const exploreTrack = document.querySelector('.explore-track');
const exploreDots = document.querySelectorAll('.explore-dots .dot');
const exploreCards = document.querySelectorAll('.explore-card');
const carouselContainer = document.querySelector('.explore-carousel');
let currentSlide = 0;
const totalCards = exploreCards.length;

function getCarouselConfig() {
    const w = window.innerWidth;
    if (w <= 480) return { visible: 1, gap: 12 };
    if (w <= 768) return { visible: 2, gap: 16 };
    if (w <= 1024) return { visible: 3, gap: 32 };
    return { visible: 4, gap: 54 };
}

function getTotalSlides() {
    return Math.max(totalCards - getCarouselConfig().visible + 1, 1);
}

function goToSlide(index) {
    const config = getCarouselConfig();
    const totalSlides = Math.max(totalCards - config.visible + 1, 1);
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    currentSlide = index;
    const cardWidth = exploreCards[0].offsetWidth;
    const offset = currentSlide * (cardWidth + config.gap);
    exploreTrack.style.transform = `translateX(-${offset}px)`;

    // Update active cards
    exploreCards.forEach((card, i) => {
        const isVisible = i >= currentSlide && i < currentSlide + config.visible;
        card.classList.toggle('active-card', isVisible && config.visible > 2);
    });

    // Update dots
    const dotIndex = Math.round((currentSlide / Math.max(totalSlides - 1, 1)) * (exploreDots.length - 1));
    exploreDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === dotIndex);
    });
}

// Dot click navigation
exploreDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        const totalSlides = getTotalSlides();
        const slideIndex = Math.round((i / (exploreDots.length - 1)) * (totalSlides - 1));
        goToSlide(slideIndex);
    });
});

// Drag support
let isDragging = false;
let startX = 0;
let dragOffset = 0;

exploreTrack.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    exploreTrack.style.transition = 'none';
    exploreTrack.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    dragOffset = e.pageX - startX;
    const cardWidth = exploreCards[0].offsetWidth;
    const config = getCarouselConfig();
    const baseOffset = currentSlide * (cardWidth + config.gap);
    exploreTrack.style.transform = `translateX(-${baseOffset - dragOffset}px)`;
});

document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    exploreTrack.style.transition = 'transform 0.5s ease';
    exploreTrack.style.cursor = 'grab';
    const threshold = window.innerWidth <= 768 ? 40 : 60;
    if (dragOffset < -threshold) goToSlide(currentSlide + 1);
    else if (dragOffset > threshold) goToSlide(currentSlide - 1);
    else goToSlide(currentSlide);
    dragOffset = 0;
});

// Touch support
let touchStartX = 0;
let touchDragOffset = 0;

carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    exploreTrack.style.transition = 'none';
    stopAutoScroll();
}, { passive: true });

carouselContainer.addEventListener('touchmove', (e) => {
    touchDragOffset = e.touches[0].pageX - touchStartX;
    const cardWidth = exploreCards[0].offsetWidth;
    const config = getCarouselConfig();
    const baseOffset = currentSlide * (cardWidth + config.gap);
    exploreTrack.style.transform = `translateX(-${baseOffset - touchDragOffset}px)`;
}, { passive: true });

carouselContainer.addEventListener('touchend', () => {
    exploreTrack.style.transition = 'transform 0.5s ease';
    const threshold = window.innerWidth <= 768 ? 40 : 60;
    if (touchDragOffset < -threshold) goToSlide(currentSlide + 1);
    else if (touchDragOffset > threshold) goToSlide(currentSlide - 1);
    else goToSlide(currentSlide);
    touchDragOffset = 0;
    setTimeout(startAutoScroll, 2000);
}, { passive: true });

// Auto-scroll
let autoScrollInterval;
function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        const totalSlides = getTotalSlides();
        if (currentSlide >= totalSlides - 1) goToSlide(0);
        else goToSlide(currentSlide + 1);
    }, 3000);
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Recalculate on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        goToSlide(Math.min(currentSlide, getTotalSlides() - 1));
    }, 200);
});

goToSlide(0);
startAutoScroll();
carouselContainer.addEventListener('mouseenter', stopAutoScroll);
carouselContainer.addEventListener('mouseleave', startAutoScroll);

// ========== TESTIMONIALS SLIDER ==========
const testimonialsTrack = document.querySelector('.testimonials-track');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let testimonialIndex = 0;
const totalTestimonials = testimonialCards.length;

function getTestimonialGap() {
    return window.innerWidth <= 768 ? 16 : 20;
}

function goToTestimonial(index) {
    if (index < 0) index = 0;
    const maxIndex = Math.max(totalTestimonials - 1, 0);
    if (index > maxIndex) index = maxIndex;
    testimonialIndex = index;
    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = getTestimonialGap();
    const offset = testimonialIndex * (cardWidth + gap);
    testimonialsTrack.style.transform = `translateX(-${offset}px)`;
}

prevBtn.addEventListener('click', () => goToTestimonial(testimonialIndex - 1));
nextBtn.addEventListener('click', () => goToTestimonial(testimonialIndex + 1));

// Touch support for testimonials
let testimTouchStartX = 0;
let testimTouchDragOffset = 0;
const testimonialsSlider = document.querySelector('.testimonials-slider');

testimonialsSlider.addEventListener('touchstart', (e) => {
    testimTouchStartX = e.touches[0].pageX;
    testimonialsTrack.style.transition = 'none';
}, { passive: true });

testimonialsSlider.addEventListener('touchmove', (e) => {
    testimTouchDragOffset = e.touches[0].pageX - testimTouchStartX;
    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = getTestimonialGap();
    const baseOffset = testimonialIndex * (cardWidth + gap);
    testimonialsTrack.style.transform = `translateX(-${baseOffset - testimTouchDragOffset}px)`;
}, { passive: true });

testimonialsSlider.addEventListener('touchend', () => {
    testimonialsTrack.style.transition = 'transform 0.5s ease';
    if (testimTouchDragOffset < -40) goToTestimonial(testimonialIndex + 1);
    else if (testimTouchDragOffset > 40) goToTestimonial(testimonialIndex - 1);
    else goToTestimonial(testimonialIndex);
    testimTouchDragOffset = 0;
}, { passive: true });

// ========== FAQ ACCORDION ==========
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(i => i.classList.remove('active'));

        // Open clicked if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ========== SCROLL REVEAL ANIMATION ==========
const fadeElements = document.querySelectorAll(
    '.about-container, .advantages-container, .applications-container, ' +
    '.whatyousee-container, .whychoose-container, .trust-container, ' +
    '.faq-container, .cta-container'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));

// ========== SMOOTH SCROLL FOR NAV LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// (Explore dots handled in carousel section above)

// ========== CTA CAROUSEL ==========
const ctaTrack = document.querySelector('.cta-carousel-track');
const ctaDots = document.querySelectorAll('.cta-carousel-dots .dot');
const ctaCards = document.querySelectorAll('.cta-carousel-card');
const ctaCarouselContainer = document.querySelector('.cta-carousel');
let ctaCurrentSlide = 0;
const ctaTotalCards = ctaCards.length;

function getCtaCarouselConfig() {
    const w = window.innerWidth;
    if (w <= 480) return { visible: 1, gap: 12 };
    if (w <= 768) return { visible: 2, gap: 16 };
    if (w <= 1024) return { visible: 3, gap: 32 };
    return { visible: 4, gap: 54 };
}

function getCtaTotalSlides() {
    return Math.max(ctaTotalCards - getCtaCarouselConfig().visible + 1, 1);
}

function ctaGoToSlide(index) {
    const config = getCtaCarouselConfig();
    const totalSlides = Math.max(ctaTotalCards - config.visible + 1, 1);
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    ctaCurrentSlide = index;
    const cardWidth = ctaCards[0].offsetWidth;
    const offset = ctaCurrentSlide * (cardWidth + config.gap);
    ctaTrack.style.transform = `translateX(-${offset}px)`;

    ctaCards.forEach((card, i) => {
        const isVisible = i >= ctaCurrentSlide && i < ctaCurrentSlide + config.visible;
        card.classList.toggle('active-card', isVisible && config.visible > 2);
    });

    const dotIndex = Math.round((ctaCurrentSlide / Math.max(totalSlides - 1, 1)) * (ctaDots.length - 1));
    ctaDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === dotIndex);
    });
}

ctaDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        const totalSlides = getCtaTotalSlides();
        const slideIndex = Math.round((i / (ctaDots.length - 1)) * (totalSlides - 1));
        ctaGoToSlide(slideIndex);
    });
});

let ctaIsDragging = false;
let ctaStartX = 0;
let ctaDragOffset = 0;

ctaTrack.addEventListener('mousedown', (e) => {
    ctaIsDragging = true;
    ctaStartX = e.pageX;
    ctaTrack.style.transition = 'none';
    ctaTrack.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!ctaIsDragging) return;
    e.preventDefault();
    ctaDragOffset = e.pageX - ctaStartX;
    const cardWidth = ctaCards[0].offsetWidth;
    const config = getCtaCarouselConfig();
    const baseOffset = ctaCurrentSlide * (cardWidth + config.gap);
    ctaTrack.style.transform = `translateX(-${baseOffset - ctaDragOffset}px)`;
});

document.addEventListener('mouseup', () => {
    if (!ctaIsDragging) return;
    ctaIsDragging = false;
    ctaTrack.style.transition = 'transform 0.5s ease';
    ctaTrack.style.cursor = 'grab';
    const threshold = window.innerWidth <= 768 ? 40 : 60;
    if (ctaDragOffset < -threshold) ctaGoToSlide(ctaCurrentSlide + 1);
    else if (ctaDragOffset > threshold) ctaGoToSlide(ctaCurrentSlide - 1);
    else ctaGoToSlide(ctaCurrentSlide);
    ctaDragOffset = 0;
});

let ctaTouchStartX = 0;
let ctaTouchDragOffset = 0;

ctaCarouselContainer.addEventListener('touchstart', (e) => {
    ctaTouchStartX = e.touches[0].pageX;
    ctaTrack.style.transition = 'none';
    ctaStopAutoScroll();
}, { passive: true });

ctaCarouselContainer.addEventListener('touchmove', (e) => {
    ctaTouchDragOffset = e.touches[0].pageX - ctaTouchStartX;
    const cardWidth = ctaCards[0].offsetWidth;
    const config = getCtaCarouselConfig();
    const baseOffset = ctaCurrentSlide * (cardWidth + config.gap);
    ctaTrack.style.transform = `translateX(-${baseOffset - ctaTouchDragOffset}px)`;
}, { passive: true });

ctaCarouselContainer.addEventListener('touchend', () => {
    ctaTrack.style.transition = 'transform 0.5s ease';
    const threshold = window.innerWidth <= 768 ? 40 : 60;
    if (ctaTouchDragOffset < -threshold) ctaGoToSlide(ctaCurrentSlide + 1);
    else if (ctaTouchDragOffset > threshold) ctaGoToSlide(ctaCurrentSlide - 1);
    else ctaGoToSlide(ctaCurrentSlide);
    ctaTouchDragOffset = 0;
    setTimeout(ctaStartAutoScroll, 2000);
}, { passive: true });

let ctaAutoScrollInterval;
function ctaStartAutoScroll() {
    ctaAutoScrollInterval = setInterval(() => {
        const totalSlides = getCtaTotalSlides();
        if (ctaCurrentSlide >= totalSlides - 1) ctaGoToSlide(0);
        else ctaGoToSlide(ctaCurrentSlide + 1);
    }, 3000);
}

function ctaStopAutoScroll() {
    clearInterval(ctaAutoScrollInterval);
}

// Recalculate CTA carousel on resize
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ctaGoToSlide(Math.min(ctaCurrentSlide, getCtaTotalSlides() - 1));
    }, 200);
});

ctaGoToSlide(0);
ctaStartAutoScroll();
ctaCarouselContainer.addEventListener('mouseenter', ctaStopAutoScroll);
ctaCarouselContainer.addEventListener('mouseleave', ctaStartAutoScroll);

// ========== UTM & FORM SUBMISSION UTILITIES ==========

// Parse UTM parameters from URL
function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || ''
    };
}

// Get current timestamp in IST
function getTimestamp() {
    return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

// Submit form data to Google Sheets via Apps Script
// IMPORTANT: Replace the URL below with your deployed Google Apps Script web app URL
// Steps: 1) Create a Google Sheet  2) Extensions > Apps Script  3) Paste the doPost code
// 4) Deploy > Web App > Execute as Me > Access: Anyone  5) Copy the URL here
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

function submitToGoogleSheets(formData) {
    return fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
}

// Collect form fields + UTM + metadata, submit, then redirect
function handleFormSubmit(form, formSource) {
    const utmParams = getUTMParams();
    const formData = {
        timestamp: getTimestamp(),
        name: form.querySelector('[name="name"]').value,
        email: form.querySelector('[name="email"]').value,
        phone: form.querySelector('[name="phone"]').value,
        looking_for: form.querySelector('[name="looking_for"]').value,
        message: form.querySelector('[name="message"]').value,
        form_source: formSource,
        page_url: window.location.href,
        ...utmParams
    };

    submitToGoogleSheets(formData)
        .then(() => { window.location.href = 'thankyou.html'; })
        .catch(() => { window.location.href = 'thankyou.html'; });
}

// ========== HERO FORM SUBMISSION ==========
const heroForm = document.getElementById('heroForm');
heroForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit(heroForm, 'hero');
});

// ========== POPUP MODAL (50% scroll OR 5 seconds) ==========
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const popupForm = document.getElementById('popupForm');
let popupShown = false;

function showPopup() {
    if (popupShown) return;
    if (sessionStorage.getItem('rawoodPopupShown')) return;

    popupShown = true;
    sessionStorage.setItem('rawoodPopupShown', 'true');
    popupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    popupOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Trigger 1: After 5 seconds
setTimeout(showPopup, 5000);

// Trigger 2: After 50% scroll
window.addEventListener('scroll', function checkScroll() {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    if (scrollPercent >= 0.5) {
        showPopup();
        window.removeEventListener('scroll', checkScroll);
    }
});

// Close handlers
popupClose.addEventListener('click', closePopup);
popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) closePopup();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePopup();
});

// Popup form submission
popupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit(popupForm, 'popup');
});
