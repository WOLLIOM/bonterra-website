window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('done'), 1400);
});

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// custom cursor
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
if (dot && ring && matchMedia('(hover:hover) and (pointer:fine)').matches) {
  let rx = 0, ry = 0, mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
    mx = e.clientX; my = e.clientY;
  });
  (function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .menu-card, .hh-cta, .info-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = 1; ring.style.opacity = 1; });
}

// mobile nav
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open'); nav.classList.remove('open');
  }));
}

// reservation form (static demo — wire to OpenTable/your booking provider)
const resForm = document.getElementById('reservation-form');
if (resForm) {
  resForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = document.getElementById('reservation-note');
    if (note) note.textContent = "Thanks — for now please call (403) 262-8480 or book via OpenTable to confirm your table.";
  });
}
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = document.getElementById('contact-note');
    if (note) note.textContent = "Thanks for reaching out — we'll get back to you shortly.";
  });
}
