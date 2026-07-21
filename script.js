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
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

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

    // ---------- EASTER EGG: Click olive logo 3x ----------
    const logo = document.querySelector('.logo-wrap');
    if (logo) {
        let logoClickCount = 0;
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            logoClickCount++;
            if (logoClickCount === 3) {
                for (let i = 0; i < 16; i++) {
                    const leaf = document.createElement('div');
                    leaf.textContent = '🍃';
                    leaf.style.cssText = `
                                position: fixed;
                                left: ${Math.random() * 100}vw;
                                top: -20px;
                                font-size: ${1.2 + Math.random() * 1.6}rem;
                                pointer-events: none;
                                z-index: 9999;
                                opacity: 0.8;
                                animation: leafFall ${2.5 + Math.random() * 2}s ease forwards;
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
                                    100% { transform: translateY(110vh) rotate(720deg) scale(0.3); opacity: 0; }
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

    console.log('🇮🇹 Benvenuti a Bonterra Trattoria — Experience Tuscan Luxury.');
})();