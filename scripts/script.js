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

    const wrap = photo.parentElement;
    if (!wrap) return;

    if (!wrap.querySelector('.team-photo--overlay')) {
      const overlayPhoto = document.createElement('img');
      overlayPhoto.className = `${photo.className} team-photo--overlay`;
      overlayPhoto.setAttribute('src', hoverSrc);
      overlayPhoto.setAttribute('alt', '');
      overlayPhoto.setAttribute('aria-hidden', 'true');
      overlayPhoto.setAttribute('loading', 'lazy');
      overlayPhoto.setAttribute('decoding', 'async');
      wrap.appendChild(overlayPhoto);
    }

    const preloaded = new Image();
    preloaded.src = hoverSrc;

    photo.setAttribute('src', defaultSrc);

    const activate = () => card.classList.add('team-member--active');
    const deactivate = () => card.classList.remove('team-member--active');

    card.addEventListener('mouseenter', activate);
    card.addEventListener('mouseleave', deactivate);
    card.addEventListener('focusin', activate);
    card.addEventListener('focusout', deactivate);
  });
}

// ─── MOBILE TEAM CAROUSEL ───────────────────
function initTeamMobileCarousel() {
  const slider = document.querySelector('.sobre-team-slider');
  const track = document.querySelector('.sobre-team-track');
  if (!slider || !track) return;

  const cards = Array.from(track.querySelectorAll('.team-member:not(.team-member--clone)'));
  if (cards.length < 2) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let autoPlayTimer = null;
  let resumeTimer = null;
  let sectionIsVisible = true;

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  const markActiveCard = (index) => {
    cards.forEach((card, cardIndex) => {
      card.classList.toggle('team-member--active', cardIndex === index);
    });
  };

  const getScrollLeftForIndex = (index) => {
    const safeIndex = Math.min(cards.length - 1, Math.max(0, index));
    const card = cards[safeIndex];
    const centeredLeft = card.offsetLeft - ((slider.clientWidth - card.offsetWidth) / 2);
    return Math.max(0, centeredLeft);
  };

  const scrollToIndex = (index, behavior = 'smooth') => {
    const safeIndex = Math.min(cards.length - 1, Math.max(0, index));
    slider.scrollTo({
      left: getScrollLeftForIndex(safeIndex),
      behavior
    });
    activeIndex = safeIndex;
    markActiveCard(activeIndex);
  };

  const getClosestIndex = () => {
    const centerX = slider.scrollLeft + (slider.clientWidth / 2);
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
      const distance = Math.abs(cardCenter - centerX);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    if (!mobileQuery.matches || reducedMotionQuery.matches || !sectionIsVisible) return;

    autoPlayTimer = setInterval(() => {
      if (document.hidden) return;
      const nextIndex = (activeIndex + 1) % cards.length;
      scrollToIndex(nextIndex);
    }, 3400);
  };

  const pauseAndResumeAutoPlay = () => {
    stopAutoPlay();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoPlay, 3600);
  };

  const handleScroll = () => {
    if (!mobileQuery.matches) return;
    activeIndex = getClosestIndex();
    markActiveCard(activeIndex);
  };

  const syncMode = () => {
    sectionIsVisible = slider.getBoundingClientRect().bottom > 0 && slider.getBoundingClientRect().top < window.innerHeight;

    if (!mobileQuery.matches) {
      stopAutoPlay();
      cards.forEach(card => card.classList.remove('team-member--active'));
      return;
    }

    activeIndex = getClosestIndex();
    markActiveCard(activeIndex);
    startAutoPlay();
  };

  slider.addEventListener('scroll', handleScroll, { passive: true });
  slider.addEventListener('touchstart', pauseAndResumeAutoPlay, { passive: true });
  slider.addEventListener('touchmove', pauseAndResumeAutoPlay, { passive: true });
  slider.addEventListener('touchend', pauseAndResumeAutoPlay, { passive: true });
  slider.addEventListener('pointerdown', pauseAndResumeAutoPlay);
  slider.addEventListener('pointerup', pauseAndResumeAutoPlay);
  slider.addEventListener('mouseenter', pauseAndResumeAutoPlay);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
      return;
    }
    startAutoPlay();
  });
  window.addEventListener('resize', syncMode);

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', syncMode);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(syncMode);
  }

  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', syncMode);
  } else if (typeof reducedMotionQuery.addListener === 'function') {
    reducedMotionQuery.addListener(syncMode);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      sectionIsVisible = Boolean(entry && entry.isIntersecting);
      if (!sectionIsVisible) {
        stopAutoPlay();
        return;
      }
      startAutoPlay();
    }, { threshold: 0.35 });

    observer.observe(slider);
  }

  syncMode();
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

// ─── MOBILE WHATSAPP FLOAT VISIBILITY ───────
function initMobileWhatsappFloat() {
  const floatButton = document.querySelector('.whatsapp-float');
  const startSection = document.querySelector('#sobre');
  const contactSection = document.querySelector('#contacto');
  if (!floatButton || !startSection || !contactSection) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');

  const updateVisibility = () => {
    if (!mobileQuery.matches) {
      floatButton.classList.remove('is-visible');
      return;
    }

    const showTriggerY = window.scrollY + window.innerHeight * 0.55;
    const hideTriggerY = window.scrollY + window.innerHeight * 0.65;
    const visibleFromSecondBlock = showTriggerY >= startSection.offsetTop;
    const hideAtContactBlock = hideTriggerY >= contactSection.offsetTop;

    floatButton.classList.toggle('is-visible', visibleFromSecondBlock && !hideAtContactBlock);
  };

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', updateVisibility);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(updateVisibility);
  }
}

// ─── MOBILE SERVICIOS CAROUSEL ──────────────
function initServiciosMobileCarousel() {
  const grid = document.querySelector('.servicios-grid');
  const dotsWrap = document.querySelector('.servicios-dots');
  if (!grid || !dotsWrap) return;

  const cards = Array.from(grid.querySelectorAll('.servicio-card'));
  if (cards.length < 2) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const dots = [];
  let activeIndex = 0;
  let autoPlayTimer = null;
  let resumeTimer = null;

  dotsWrap.innerHTML = '';
  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'servicios-dot';
    dot.setAttribute('aria-label', `Ir al servicio ${index + 1}`);
    dot.addEventListener('click', () => {
      scrollToIndex(index);
      pauseAndResumeAutoPlay();
    });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  const getStep = () => {
    if (cards.length < 2) return cards[0].getBoundingClientRect().width;
    const firstRect = cards[0].getBoundingClientRect();
    const secondRect = cards[1].getBoundingClientRect();
    return Math.max(1, secondRect.left - firstRect.left);
  };

  const updateDots = (index) => {
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
    });
  };

  const getIndexFromScroll = () => {
    const step = getStep();
    const rawIndex = Math.round(grid.scrollLeft / step);
    return Math.min(cards.length - 1, Math.max(0, rawIndex));
  };

  const scrollToIndex = (index, behavior = 'smooth') => {
    const safeIndex = Math.min(cards.length - 1, Math.max(0, index));
    const step = getStep();
    grid.scrollTo({ left: safeIndex * step, behavior });
    activeIndex = safeIndex;
    updateDots(activeIndex);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    if (!mobileQuery.matches) return;

    autoPlayTimer = setInterval(() => {
      if (document.hidden) return;

      const nextIndex = activeIndex + 1;
      if (nextIndex >= cards.length) {
        scrollToIndex(0);
        return;
      }
      scrollToIndex(nextIndex);
    }, 3600);
  };

  const pauseAndResumeAutoPlay = () => {
    stopAutoPlay();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoPlay, 4200);
  };

  const handleScroll = () => {
    if (!mobileQuery.matches) return;
    activeIndex = getIndexFromScroll();
    updateDots(activeIndex);
  };

  const syncMode = () => {
    if (!mobileQuery.matches) {
      stopAutoPlay();
      return;
    }
    activeIndex = getIndexFromScroll();
    updateDots(activeIndex);
    startAutoPlay();
  };

  grid.addEventListener('scroll', handleScroll, { passive: true });
  grid.addEventListener('touchstart', pauseAndResumeAutoPlay, { passive: true });
  grid.addEventListener('pointerdown', pauseAndResumeAutoPlay);
  grid.addEventListener('mouseenter', pauseAndResumeAutoPlay);
  window.addEventListener('resize', syncMode);

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', syncMode);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(syncMode);
  }

  syncMode();
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
  initTeamMobileCarousel();
  initMobileWhatsappFloat();
  initServiciosMobileCarousel();
});