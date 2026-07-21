(function() {
    'use strict';

    // ---------- LOADER ----------
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 2200);
        });
    }

    // ---------- CUSTOM CURSOR ----------
    const cursor = document.getElementById('customCursor');
    if (cursor) {
        let mouseX = 0,
            mouseY = 0;
        let cursorX = 0,
            cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth cursor following
        function smoothCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(smoothCursor);
        }
        smoothCursor();

        const interactive = document.querySelectorAll(
            'a, button, .menu-category, .wine-card, .events-card, .g-item, .news-item, input, select, textarea, .btn-primary, .btn-secondary'
        );
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        if ('ontouchstart' in window) {
            cursor.style.display = 'none';
        }
    }

    // ---------- NAVBAR SCROLL ----------
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ---------- HAMBURGER ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', open);
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---------- SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealThreshold = 100;

        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const revealPoint = rect.top + rect.height * 0.15;

            if (revealPoint < windowHeight - revealThreshold) {
                el.classList.add('visible');
            }
        });
    }

    // Check on load, scroll, and resize
    window.addEventListener('load', checkReveal);
    window.addEventListener('scroll', checkReveal);
    window.addEventListener('resize', checkReveal);

    // ---------- FLOATING OLIVE LEAVES (Background) ----------
    function createFloatingLeaves() {
        const leafEmojis = ['🌿', '🍃', '🌱'];
        const leafCount = 8;

        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'floating-leaf';
            leaf.textContent = leafEmojis[i % leafEmojis.length];
            leaf.style.left = Math.random() * 100 + '%';
            leaf.style.top = Math.random() * 100 + '%';
            leaf.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
            leaf.style.animationDuration = (18 + Math.random() * 12) + 's';
            leaf.style.animationDelay = (Math.random() * 10) + 's';
            leaf.style.opacity = 0.04 + Math.random() * 0.06;
            document.body.appendChild(leaf);
        }
    }
    createFloatingLeaves();

    // ---------- EASTER EGG: Click olive logo 3x ----------
    const logo = document.querySelector('.logo-wrap');
    if (logo) {
        let logoClickCount = 0;
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            logoClickCount++;
            if (logoClickCount === 3) {
                for (let i = 0; i < 20; i++) {
                    const leaf = document.createElement('div');
                    leaf.textContent = ['🌿', '🍃', '🌱', '🫒'][Math.floor(Math.random() * 4)];
                    leaf.style.cssText = `
                                position: fixed;
                                left: ${Math.random() * 100}vw;
                                top: -20px;
                                font-size: ${1.2 + Math.random() * 1.8}rem;
                                pointer-events: none;
                                z-index: 9999;
                                opacity: 0.9;
                                animation: leafFall ${2 + Math.random() * 2.5}s ease forwards;
                                transform: rotate(${Math.random() * 360}deg);
                            `;
                    document.body.appendChild(leaf);
                    setTimeout(() => leaf.remove(), 5000);
                }
                if (!document.getElementById('leafFallStyle')) {
                    const style = document.createElement('style');
                    style.id = 'leafFallStyle';
                    style.textContent = `
                                @keyframes leafFall {
                                    0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.9; }
                                    100% { transform: translateY(110vh) rotate(720deg) scale(0.2); opacity: 0; }
                                }
                            `;
                    document.head.appendChild(style);
                }
                logoClickCount = 0;
            }
        });
    }

    // ---------- SMOOTH SCROLL FOR INTERNAL LINKS ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ---------- PARALLAX HERO (subtle) ----------
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                const rect = heroSection.getBoundingClientRect();
                if (rect.bottom > 0) {
                    const speed = 0.08;
                    const yPos = scrollY * speed;
                    heroBg.style.transform = `scale(1.05) translateY(${yPos}px)`;
                }
            }
        });
    }

    console.log('🇮🇹 Benvenuti a Bonterra Trattoria — Experience Tuscan Luxury.');
})();