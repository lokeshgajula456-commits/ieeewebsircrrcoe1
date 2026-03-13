/* ========================================
   IEEE Student Branch — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    /* --- DOM Elements --- */
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const backToTop = document.getElementById('back-to-top');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const eventTabs = document.querySelectorAll('.events__tab');
    const eventCards = document.querySelectorAll('.event-card');
    const galleryItems = document.querySelectorAll('.gallery__item');

    /* ========================================
       HEADER SCROLL EFFECT
       ======================================== */
    let lastScrollY = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    /* ========================================
       HAMBURGER MENU
       ======================================== */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    /* ========================================
       ACTIVE NAV LINK ON SCROLL
       ======================================== */
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

    /* ========================================
       BACK TO TOP
       ======================================== */
    function toggleBackToTop() {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ========================================
       SCROLL REVEAL (IntersectionObserver)
       ======================================== */
    const extraRevealElements = document.querySelectorAll('.hero__logo, .hero__college-logo, .team-card, .gallery__item, .about__card, .resource-card');
    extraRevealElements.forEach(el => el.classList.add('reveal'));

    const revealElements = document.querySelectorAll('.reveal');

    let revealDelay = 0;
    let revealTimeout = null;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, revealDelay);
                
                revealDelay += 100;
                clearTimeout(revealTimeout);
                revealTimeout = setTimeout(() => { revealDelay = 0; }, 100);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ========================================
       COUNTER ANIMATION
       ======================================== */
    const statNumbers = document.querySelectorAll('.hero__stat-number');
    let counterDone = false;

    function animateCounters() {
        if (counterDone) return;
        counterDone = true;

        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-count'), 10);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += step;
                if (current >= target) {
                    num.textContent = target;
                } else {
                    num.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }

    /* ========================================
       EVENT FILTERING
       ======================================== */
    eventTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            eventTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            eventCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* ========================================
       TEAM TAB SWITCHING
       ======================================== */
    const teamTabs = document.querySelectorAll('.team__tab');
    const teamPanels = document.querySelectorAll('.team__panel');

    teamTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            teamTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show the target panel
            const target = tab.getAttribute('data-team-target');
            teamPanels.forEach(panel => {
                panel.classList.remove('team__panel--active');
            });
            const activePanel = document.getElementById('team-' + target);
            if (activePanel) {
                activePanel.classList.add('team__panel--active');

                // Re-trigger reveal animations for elements inside the new panel
                const revealEls = activePanel.querySelectorAll('.reveal');
                revealEls.forEach(el => el.classList.remove('visible'));
                revealEls.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, 50 + index * 80);
                });
            }
        });
    });

    /* ========================================
       TEAM SOCIETY SUB-TAB SWITCHING
       ======================================== */
    const teamSubtabs = document.querySelectorAll('.team__subtab');
    const teamSubpanels = document.querySelectorAll('.team__subpanel');

    teamSubtabs.forEach(tab => {
        tab.addEventListener('click', () => {
            teamSubtabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.getAttribute('data-subtab');
            teamSubpanels.forEach(panel => panel.classList.remove('team__subpanel--active'));

            const activePanel = document.getElementById('subtab-' + target);
            if (activePanel) {
                activePanel.classList.add('team__subpanel--active');
                const revealEls = activePanel.querySelectorAll('.reveal');
                revealEls.forEach(el => el.classList.remove('visible'));
                revealEls.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, 50 + index * 80);
                });
            }
        });
    });

    /* ========================================
       GALLERY LIGHTBOX
       ======================================== */
    let currentImageIndex = 0;
    const galleryImages = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || '';
        galleryImages.push({ src: img.src, caption });

        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        const { src, caption } = galleryImages[currentImageIndex];
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox();
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        openLightbox();
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    /* ========================================
       HERO PARTICLES
       ======================================== */
    const particlesContainer = document.getElementById('particles');

    function createParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 6 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 8 + 6}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();
});

/* Fade-in-up animation for filtered cards */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

