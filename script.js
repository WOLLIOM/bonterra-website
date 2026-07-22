window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const greetEl = document.getElementById('loaderGreet');
  if (loader && greetEl && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const greetings = ['Ciao', 'Hello', 'Bonjour', 'Hola', 'Buongiorno'];
    const step = 400;
    greetings.forEach((word, i) => {
      setTimeout(() => {
        greetEl.textContent = word;
        greetEl.classList.remove('show');
        void greetEl.offsetWidth;
        greetEl.classList.add('show');
      }, i * step);
    });
    setTimeout(() => { greetEl.style.opacity = '0'; }, greetings.length * step);
  } else if (greetEl) {
    greetEl.remove();
  }
  if (loader) setTimeout(() => loader.classList.add('done'), 2600);
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

// cursor glow + drifting olive-leaf trail
const glow = document.querySelector('.cursor-glow');
if (glow && matchMedia('(hover:hover) and (pointer:fine)').matches) {
  let gx = 0, gy = 0, tx = 0, ty = 0, lastLeaf = 0;
  const leafPath = 'M8,15 C1,11 1,4 8,1 C15,4 15,11 8,15 Z M8,1 L8,15';
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.classList.add('active');

    const now = performance.now();
    if (now - lastLeaf > 90) {
      lastLeaf = now;
      const leaf = document.createElement('div');
      leaf.className = 'olive-leaf';
      leaf.style.left = e.clientX + 'px';
      leaf.style.top = e.clientY + 'px';
      const angle = Math.random() * 360;
      const dist = 30 + Math.random() * 50;
      leaf.style.setProperty('--r0', angle + 'deg');
      leaf.style.setProperty('--r1', (angle + (Math.random() > 0.5 ? 90 : -90)) + 'deg');
      leaf.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
      leaf.style.setProperty('--dy', (Math.sin(angle) * dist - 20) + 'px');
      leaf.innerHTML = '<svg viewBox="0 0 16 16"><path d="' + leafPath + '"/></svg>';
      document.body.appendChild(leaf);
      requestAnimationFrame(() => leaf.classList.add('drift'));
      setTimeout(() => leaf.remove(), 1700);
    }
  });
  document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  (function loopGlow() {
    gx += (tx - gx) * 0.09; gy += (ty - gy) * 0.09;
    glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
    requestAnimationFrame(loopGlow);
  })();
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

// reservation form -> Formspree
function submitToFormspree(form, note, messages) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalLabel = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    if (note) { note.textContent = ''; note.style.color = ''; }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then((response) => {
      if (response.ok) {
        if (note) note.textContent = messages.success;
        form.reset();
      } else {
        response.json().then((data) => {
          if (note) {
            note.textContent = (data && data.errors)
              ? data.errors.map(err => err.message).join(', ')
              : messages.error;
            note.style.color = '#c96a5a';
          }
        }).catch(() => {
          if (note) { note.textContent = messages.error; note.style.color = '#c96a5a'; }
        });
      }
    }).catch(() => {
      if (note) { note.textContent = messages.error; note.style.color = '#c96a5a'; }
    }).finally(() => {
      if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
    });
  });
}

const resForm = document.getElementById('reservation-form');
if (resForm) {
  submitToFormspree(resForm, document.getElementById('reservation-note'), {
    success: "Thanks — your request is in. We'll confirm by phone or email within 24 hours.",
    error: "Something went wrong sending that — please call (403) 262-8480 to book directly."
  });
}
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  submitToFormspree(contactForm, document.getElementById('contact-note'), {
    success: "Thanks for reaching out — we'll get back to you shortly.",
    error: "Something went wrong sending that — please email info@bonterra.ca directly."
  });
}
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  submitToFormspree(newsletterForm, document.getElementById('newsletter-note'), {
    success: "You're on the list — thanks for signing up.",
    error: "Something went wrong signing up — please try again."
  });
}
