/* =============================================
   LUP LAB — JAVASCRIPT
   Laboratorio Creativo / IA Audiovisual
   ============================================= */

'use strict';

// ─── LOADER ───────────────────────────────────
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const hideDelay = window.matchMedia('(max-width: 768px)').matches ? 900 : 1200;
  let isHidden = false;

  const hideLoader = () => {
    if (isHidden) return;
    isHidden = true;
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  };

  const scheduleHide = () => {
    setTimeout(hideLoader, hideDelay);
  };

  // Safety net: avoids a stuck loader if some assets fail to load.
  setTimeout(hideLoader, 3500);

  if (document.readyState === 'complete') {
    scheduleHide();
  } else {
    window.addEventListener('load', scheduleHide, { once: true });
  }

  document.body.style.overflow = 'hidden';
}

// ─── NAVBAR ───────────────────────────────────
function initNavbar() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });
}

// ─── MOBILE MENU ──────────────────────────────
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu-close');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', openMobileMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
}

function openMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const hamburger = document.querySelector('.hamburger');
  if (mobileMenu) {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }
}

function closeMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const hamburger = document.querySelector('.hamburger');
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }
}

// ─── SCROLL REVEAL ────────────────────────────
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => observer.observe(el));
}

// ─── COUNTER ANIMATION ────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ─── PARALLAX HERO ────────────────────────────
function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroBg = document.querySelector('.hero-video-placeholder');
  if (!heroContent) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
      heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.7));
      if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  }, { passive: true });
}

// ─── SERVICIOS HOVER ──────────────────────────
function initServicioCards() {
  const cards = document.querySelectorAll('.servicio-card');
  cards.forEach(card => {
    const video = card.querySelector('.servicio-card-video');

    card.addEventListener('mouseenter', function() {
      cards.forEach(c => {
        if (c !== this) c.style.opacity = '0.55';
      });
      if (video) video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', function() {
      cards.forEach(c => c.style.opacity = '1');
      if (video && !video.classList.contains('video--active')) {
        video.pause();
        video.currentTime = 0;
      }
    });
  });
}

// ─── TEAM PHOTO SWAP ON HOVER ───────────────
function initTeamPhotoSwap() {
  const cards = document.querySelectorAll('.team-member');
  if (!cards.length) return;

  cards.forEach(card => {
    const photo = card.querySelector('.team-photo');
    if (!photo) return;

    const defaultSrc = photo.dataset.defaultSrc;
    const hoverSrc = photo.dataset.hoverSrc;
    if (!defaultSrc || !hoverSrc) return;

    const showDefault = () => {
      if (photo.getAttribute('src') !== defaultSrc) {
        photo.setAttribute('src', defaultSrc);
      }
    };

    const showHover = () => {
      if (photo.getAttribute('src') !== hoverSrc) {
        photo.setAttribute('src', hoverSrc);
      }
    };

    showDefault();
    card.addEventListener('mouseenter', showHover);
    card.addEventListener('mouseleave', showDefault);
    card.addEventListener('focusin', showHover);
    card.addEventListener('focusout', showDefault);
  });
}

// ─── CLIENTES TICKER DUPLICATE ───────────────
function initTicker() {
  const ticker = document.querySelector('.clientes-ticker');
  if (!ticker) return;
  const items = ticker.innerHTML;
  ticker.innerHTML = items + items;
}

// ─── LOOP TEXT TICKER DUPLICATE ──────────────
function initLoopDivider() {
  const divider = document.querySelector('.loop-divider-inner');
  if (!divider) return;
  const text = divider.textContent;
  divider.textContent = text + ' ' + text;
}

// ─── ACTIVE NAV LINK ON SCROLL ───────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// ─── HERO LOOP SVG ANIMATION ─────────────────
function initHeroLoops() {
  const loopSvgs = document.querySelectorAll('.hero-loop-bg svg');
  if (!loopSvgs.length) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    loopSvgs.forEach((svg, i) => {
      const factor = (i + 1) * 12;
      svg.style.transform = `translate(${dx * factor}px, ${dy * factor}px) rotate(${dx * 5}deg)`;
    });
  }, { passive: true });
}

// ─── INIT ALL ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initParallax();
  initServicioCards();
  initTeamPhotoSwap();
  initTicker();
  initLoopDivider();
  initActiveNav();
  initHeroLoops();
});