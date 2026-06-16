/**
 * Bibhuti Bhusan Barik — Portfolio
 * script.js  |  Vanilla JavaScript (no frameworks)
 * ============================================================
 *  1.  Theme  (dark / light, localStorage)
 *  2.  Navbar scroll + hamburger menu
 *  3.  Active nav-link highlight
 *  4.  Smooth scroll
 *  5.  Scroll-reveal animations (IntersectionObserver)
 *  6.  Animated counters
 *  7.  Typewriter effect (hero)
 *  8.  Skill-bar animation (IntersectionObserver)
 *  9.  Testimonials carousel (auto-play + drag/touch)
 * 10.  Contact form validation + fake submission
 * 11.  Back-to-top button
 * 12.  Lazy-image fallback
 * ============================================================
 */

'use strict';

/* ─── DOM READY ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initTypingEffect();
  initSkillBars();
  initTestimonials();
  initContactForm();
  initBackToTop();
  initLazyImages();
});

/* ============================================================
   1. THEME
   ============================================================ */
function initTheme() {
  const root   = document.documentElement;
  const btn    = document.getElementById('themeToggle');
  const icon   = document.getElementById('themeIcon');
  const stored = localStorage.getItem('bb-theme') || 'dark';

  apply(stored);

  btn.addEventListener('click', () => apply(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  function apply(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('bb-theme', t);
    icon.textContent = t === 'dark' ? '🌙' : '☀️';
    btn.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/* ============================================================
   2. NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = navMenu.querySelectorAll('.nav-link');

  // Scroll shrink
  window.addEventListener('scroll', throttle(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }, 60), { passive: true });

  // Mobile toggle
  hamburger.addEventListener('click', toggle);
  navLinks.forEach(l => l.addEventListener('click', close));
  document.addEventListener('click', e => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      close();
      hamburger.focus();
    }
  });

  function toggle() {
    const open = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  function close() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Active highlight
  const sections = [...document.querySelectorAll('section[id]')];
  const map = {};
  navLinks.forEach(l => {
    const h = l.getAttribute('href');
    if (h?.startsWith('#')) map[h.slice(1)] = l;
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        Object.values(map).forEach(l => l.classList.remove('active'));
        map[e.target.id]?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));
}

/* ============================================================
   3. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   4. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -72px 0px', threshold: 0.08 });

  els.forEach(el => io.observe(el));
}

/* ============================================================
   5. ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        runCount(e.target);
      });
    }, { threshold: 0.6 });
    io.observe(el);
  });
}

function runCount(el) {
  const end  = parseInt(el.dataset.target, 10);
  const dur  = 1700;
  const step = 16;
  const inc  = end / (dur / step);
  let cur    = 0;
  const t    = setInterval(() => {
    cur = Math.min(cur + inc, end);
    el.textContent = Math.round(cur);
    if (Math.round(cur) >= end) { el.textContent = end; clearInterval(t); }
  }, step);
}

/* ============================================================
   6. TYPEWRITER EFFECT
   ============================================================ */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const lines = [
    'Aspiring Software Developer',
    'Web Developer',
    'Firebase Enthusiast 🔥',
    'Flutter Developer',
    'Cricket Fan 🏏',
    'CS Graduate — 8.2 SGPA',
  ];

  let li = 0, ci = 0, del = false, timer = null;

  function tick() {
    const line = lines[li];
    el.textContent = del ? line.slice(0, --ci) : line.slice(0, ++ci);

    if (!del && ci === line.length) {
      del = true;
      timer = setTimeout(tick, 1900);
      return;
    }
    if (del && ci === 0) {
      del = false;
      li  = (li + 1) % lines.length;
    }

    timer = setTimeout(tick, del ? 42 : 78);
  }

  tick();
}

/* ============================================================
   7. SKILL BAR ANIMATION
   ============================================================ */
function initSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach(fill => {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        requestAnimationFrame(() => {
          e.target.style.width = (e.target.dataset.width || 0) + '%';
        });
      });
    }, { threshold: 0.3 });
    io.observe(fill);
  });
}

/* ============================================================
   8. TESTIMONIALS CAROUSEL
   ============================================================ */
function initTestimonials() {
  const track  = document.getElementById('testimonialsTrack');
  const dots   = document.getElementById('testimonialDots');
  const prev   = document.getElementById('testimonialPrev');
  const next   = document.getElementById('testimonialNext');
  if (!track) return;

  const cards = [...track.querySelectorAll('.testimonial-card')];
  let cur = 0, timer = null;
  let dragStart = 0, dragDelta = 0, dragging = false;

  function visible() {
    return window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  }
  function maxPage() {
    return Math.max(0, Math.ceil(cards.length / visible()) - 1);
  }

  /* Dots */
  function buildDots() {
    dots.innerHTML = '';
    for (let i = 0; i <= maxPage(); i++) {
      const d = Object.assign(document.createElement('button'), {
        className: `testimonial-dot${i === 0 ? ' active' : ''}`,
      });
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', `Slide group ${i + 1}`);
      d.addEventListener('click', () => { goTo(i); reset(); });
      dots.appendChild(d);
    }
  }

  /* Navigate */
  function goTo(idx) {
    cur = Math.max(0, Math.min(idx, maxPage()));
    const w   = cards[0].offsetWidth;
    const gap = 24;
    track.style.transform = `translateX(-${cur * visible() * (w + gap)}px)`;
    dots.querySelectorAll('.testimonial-dot').forEach((d, i) => {
      d.classList.toggle('active', i === cur);
      d.setAttribute('aria-selected', String(i === cur));
    });
  }

  function goNext() { goTo(cur >= maxPage() ? 0 : cur + 1); }
  function goPrev() { goTo(cur <= 0 ? maxPage() : cur - 1); }

  prev.addEventListener('click', () => { goPrev(); reset(); });
  next.addEventListener('click', () => { goNext(); reset(); });

  /* Auto-play */
  function start() { timer = setInterval(goNext, 4800); }
  function stop()  { clearInterval(timer); }
  function reset() { stop(); start(); }

  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);
  start();

  /* Drag / touch */
  function dStart(e) { dragging = true; dragStart = cx(e); dragDelta = 0; track.style.transition = 'none'; stop(); }
  function dMove(e)  { if (dragging) dragDelta = cx(e) - dragStart; }
  function dEnd()    {
    if (!dragging) return;
    dragging = false; track.style.transition = '';
    if      (dragDelta < -60) goNext();
    else if (dragDelta >  60) goPrev();
    else goTo(cur);
    start();
  }
  function cx(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

  track.addEventListener('mousedown',  dStart);
  track.addEventListener('touchstart', dStart, { passive: true });
  window.addEventListener('mousemove', dMove);
  window.addEventListener('touchmove', dMove, { passive: true });
  window.addEventListener('mouseup',   dEnd);
  window.addEventListener('touchend',  dEnd);

  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goPrev(); reset(); }
    if (e.key === 'ArrowRight') { goNext(); reset(); }
  });

  buildDots();
  window.addEventListener('resize', debounce(() => { buildDots(); goTo(0); }, 260));
}

/* ============================================================
   9. CONTACT FORM  —  Powered by Web3Forms (free, no backend)
   ============================================================ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const submitB = document.getElementById('submitBtn');
  const status  = document.getElementById('formStatus');
  if (!form) return;

  const flds = {
    name:    { el: document.getElementById('contactName'),    err: document.getElementById('nameError')    },
    email:   { el: document.getElementById('contactEmail'),   err: document.getElementById('emailError')   },
    message: { el: document.getElementById('contactMessage'), err: document.getElementById('messageError') },
  };

  Object.values(flds).forEach(({ el, err }) => {
    el.addEventListener('blur',  () => check(el, err));
    el.addEventListener('input', () => { if (el.classList.contains('error')) check(el, err); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    Object.values(flds).forEach(({ el, err }) => { if (!check(el, err)) ok = false; });
    if (!ok) return;

    const bTxt = submitB.querySelector('.btn-text');
    const bIco = submitB.querySelector('.btn-icon');
    submitB.disabled = true;
    bTxt.textContent = 'Sending…';
    bIco.textContent = '⏳';

    try {
      await sendMail();
      showStatus('success', '🎉 Message sent! I\'ll reply as soon as possible.');
      form.reset();
      Object.values(flds).forEach(({ el }) => el.classList.remove('error', 'valid'));
    } catch (err) {
      showStatus('error', err.message || '⚠️ Something went wrong. Email me directly at bhusanbibhuti2005@gmail.com');
    } finally {
      submitB.disabled = false;
      bTxt.textContent = 'Send Message';
      bIco.textContent = '→';
    }
  });

  function check(el, errEl) {
    const v = el.value.trim(); let msg = '';
    if (el.id === 'contactName')    { if (!v) msg='Please enter your name.'; else if (v.length<2) msg='At least 2 characters.'; }
    if (el.id === 'contactEmail')   { if (!v) msg='Please enter your email.'; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg='Enter a valid email.'; }
    if (el.id === 'contactMessage') { if (!v) msg='Please write a message.'; else if (v.length<10) msg='At least 10 characters.'; }
    errEl.textContent = msg;
    el.classList.toggle('error', !!msg);
    el.classList.toggle('valid', !msg && !!v);
    return !msg;
  }

  function showStatus(type, msg) {
    status.textContent = msg;
    status.className   = `form-status visible ${type}`;
    setTimeout(() => status.classList.remove('visible'), 7000);
  }

  // ── Real email via Web3Forms ─────────────────────────────────
  // FREE service: 250 emails/month, no backend, no account needed.
  // SETUP (takes ~30 seconds):
  //   1. Go to https://web3forms.com
  //   2. Enter:  bhusanbibhuti2005@gmail.com
  //   3. Click "Create Access Key"
  //   4. Check your Gmail for the key
  //   5. Paste it below replacing YOUR_ACCESS_KEY_HERE
  // ─────────────────────────────────────────────────────────────
  async function sendMail() {
    const ACCESS_KEY = '12469149-9b2b-452e-b3dc-398693b9a05e';

    const subject = (document.getElementById('contactSubject')?.value.trim()) || 'Portfolio Enquiry';

    const payload = {
      access_key: ACCESS_KEY,
      subject:    `[Portfolio] ${subject}`,
      from_name:  'Bibhuti Portfolio',
      name:       flds.name.el.value.trim(),
      email:      flds.email.el.value.trim(),
      message:    flds.message.el.value.trim(),
      botcheck:   '',   // honeypot anti-spam field — must stay empty
    };

    const res  = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || '⚠️ Submission failed. Please email bhusanbibhuti2005@gmail.com directly.');
    }

    return data;
  }
}

/* ============================================================
   10. BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', throttle(() => { btn.hidden = window.scrollY < 480; }, 100), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   11. LAZY IMAGES (fallback for older browsers)
   ============================================================ */
function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const img = e.target;
      if (img.dataset.src) img.src = img.dataset.src;
      obs.unobserve(img);
    });
  });
  document.querySelectorAll('img[loading="lazy"]').forEach(img => io.observe(img));
}

/* ============================================================
   UTILITIES
   ============================================================ */
function throttle(fn, ms) {
  let last = 0;
  return (...args) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...args); } };
}
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
