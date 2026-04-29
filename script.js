/* Krivvton — interactive behaviours */

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Nav scroll state
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 32) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

// Cursor glow
const glow = document.getElementById('cursorGlow');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let gx = mx, gy = my;
window.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
});
const renderGlow = () => {
  gx += (mx - gx) * 0.08;
  gy += (my - gy) * 0.08;
  if (glow) glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
  requestAnimationFrame(renderGlow);
};
renderGlow();

// Card spotlight follow
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// Stat counters
const counters = document.querySelectorAll('.stat-value');
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
};

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// Reveal on scroll
const revealEls = document.querySelectorAll(
  '.section-head, .card, .hw-card, .step, .partitions-copy, .partitions-visual, .quote, .logos, .contact-form, .contact-copy'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 60);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// Contact form (no backend — gracefully resolves)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  if (!name || !email) {
    form.querySelector(name ? '#email' : '#name').focus();
    return;
  }
  note.hidden = false;
  form.reset();
  setTimeout(() => { note.hidden = true; }, 6000);
});
