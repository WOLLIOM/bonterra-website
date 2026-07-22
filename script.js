window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const greetEl = document.getElementById('loaderGreet');
  const introShown = sessionStorage.getItem('bonterraIntroShown');
  if (loader && greetEl && !introShown && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
    sessionStorage.setItem('bonterraIntroShown', '1');
  } else if (greetEl) {
    greetEl.remove();
    if (loader) loader.classList.add('quick');
  }
  if (loader) setTimeout(() => loader.classList.add('done'), introShown ? 650 : 2600);
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

// header background on scroll (keeps nav legible over any content)
const siteHeader = document.querySelector('header');
if (siteHeader) {
  const setHeaderState = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 40);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });
}

// background music — on by default, with fallback for browsers that block autoplay
const musicToggle = document.getElementById('musicToggle');
const bgAudio = document.getElementById('bgAudio');
if (musicToggle && bgAudio) {
  bgAudio.volume = 0.22;

  const syncButton = () => {
    const playing = !bgAudio.paused;
    musicToggle.classList.toggle('playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
  };
  bgAudio.addEventListener('play', syncButton);
  bgAudio.addEventListener('pause', syncButton);

  const tryAutoplay = () => {
    bgAudio.play().catch(() => {
      // Autoplay blocked — start on the visitor's first interaction instead.
      const startOnInteract = () => {
        bgAudio.play().catch(() => {});
        window.removeEventListener('click', startOnInteract);
        window.removeEventListener('touchstart', startOnInteract);
        window.removeEventListener('keydown', startOnInteract);
      };
      window.addEventListener('click', startOnInteract, { once: true });
      window.addEventListener('touchstart', startOnInteract, { once: true });
      window.addEventListener('keydown', startOnInteract, { once: true });
    });
  };
  tryAutoplay();

  musicToggle.addEventListener('click', () => {
    if (bgAudio.paused) bgAudio.play().catch(() => {});
    else bgAudio.pause();
  });
}

// draggable, throwable, wall-bouncing olive — with a heavenly entrance
const olive = document.getElementById('driftOlive');
if (olive) {
  const W = () => olive.offsetWidth, H = () => olive.offsetHeight;
  let x = window.innerWidth * 0.82;
  let y = window.innerHeight * 0.35;
  let vx = 0, vy = 0;
  let dragging = false;
  let physicsActive = false;
  let history = [];

  const place = () => { olive.style.left = x + 'px'; olive.style.top = y + 'px'; };

  const showHint = () => {
    if (sessionStorage.getItem('oliveHintShown')) return;
    sessionStorage.setItem('oliveHintShown', '1');
    const hint = document.createElement('div');
    hint.className = 'olive-hint';
    hint.textContent = 'Drag me — try throwing me!';
    document.body.appendChild(hint);
    const r = olive.getBoundingClientRect();
    hint.style.left = (r.left - 30) + 'px';
    hint.style.top = (r.bottom + 10) + 'px';
    requestAnimationFrame(() => hint.classList.add('show'));
    setTimeout(() => { hint.classList.remove('show'); setTimeout(() => hint.remove(), 600); }, 4200);
  };

  // heavenly entrance: drop in from off-screen with a light beam
  olive.style.left = x + 'px';
  olive.style.top = '-200px';
  olive.style.opacity = '0';
  requestAnimationFrame(() => {
    olive.classList.add('beam');
    setTimeout(() => {
      olive.classList.add('falling');
      olive.style.opacity = '1';
      olive.style.top = y + 'px';
    }, 250);
  });
  setTimeout(() => {
    olive.classList.remove('falling');
    olive.classList.add('settled');
    physicsActive = true;
    showHint();
  }, 1500);

  function runPhysics() {
    if (!dragging && physicsActive && (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05)) {
      olive.classList.remove('settled');
      x += vx; y += vy;
      vx *= 0.985; vy *= 0.985;
      const maxX = window.innerWidth - W(), maxY = window.innerHeight - H();
      if (x <= 0) { x = 0; vx = -vx * 0.72; }
      if (x >= maxX) { x = maxX; vx = -vx * 0.72; }
      if (y <= 0) { y = 0; vy = -vy * 0.72; }
      if (y >= maxY) { y = maxY; vy = -vy * 0.72; }
      place();
    } else if (!dragging && physicsActive && !olive.classList.contains('settled')) {
      vx = 0; vy = 0;
      olive.classList.add('settled');
    }
    requestAnimationFrame(runPhysics);
  }
  requestAnimationFrame(runPhysics);

  const onDown = (clientX, clientY, pointerId, target) => {
    if (!physicsActive) return;
    dragging = true;
    vx = 0; vy = 0;
    olive.classList.remove('settled');
    olive.classList.add('dragging');
    history = [{ x: clientX, y: clientY, t: performance.now() }];
    if (pointerId !== undefined) target.setPointerCapture(pointerId);
  };
  const onMove = (clientX, clientY) => {
    if (!dragging) return;
    x = clientX - W() / 2;
    y = clientY - H() / 2;
    place();
    history.push({ x: clientX, y: clientY, t: performance.now() });
    if (history.length > 6) history.shift();
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    olive.classList.remove('dragging');
    if (history.length >= 2) {
      const a = history[0], b = history[history.length - 1];
      const dt = Math.max(b.t - a.t, 16);
      vx = ((b.x - a.x) / dt) * 16;
      vy = ((b.y - a.y) / dt) * 16;
    }
  };

  olive.addEventListener('pointerdown', (e) => onDown(e.clientX, e.clientY, e.pointerId, olive));
  window.addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY));
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);

  window.addEventListener('resize', () => {
    x = Math.min(x, window.innerWidth - W());
    y = Math.min(y, window.innerHeight - H());
  });
}

// interactive hover tilt on photos
const tiltTargets = document.querySelectorAll(
  '.about-grid img, .strip img, .gallery-grid img, .dish-photo, .review img, .menu-card, .info-card'
);
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  tiltTargets.forEach(el => {
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform, filter';
    el.style.transition = 'transform 0.3s ease, filter 0.3s ease';
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * 10;
      const ry = (px - 0.5) * 10;
      el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
      el.style.filter = `brightness(${1 + (0.5 - Math.abs(px - 0.5)) * 0.12})`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.filter = '';
    });
  });
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
    error: "Something went wrong sending that — please call (403) 903-0856 to book directly."
  });
}
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  submitToFormspree(contactForm, document.getElementById('contact-note'), {
    success: "Thanks for reaching out — we'll get back to you shortly.",
    error: "Something went wrong sending that — please email Simon0021maxam@gmail.com directly."
  });
}
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  submitToFormspree(newsletterForm, document.getElementById('newsletter-note'), {
    success: "You're on the list — thanks for signing up.",
    error: "Something went wrong signing up — please try again."
  });
}
const eventForm = document.getElementById('event-form');
if (eventForm) {
  submitToFormspree(eventForm, document.getElementById('event-note'), {
    success: "Thanks — we've got your inquiry and will follow up soon.",
    error: "Something went wrong sending that — please email Simon0021maxam@gmail.com directly."
  });
}
