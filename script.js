// Day Revest — Script principal
// Vanilla JS, progressivo e acessível

(function () {
  'use strict';

  // ==========================================================================
  // HEADER: sombra ao rolar
  // ==========================================================================
  const header = document.querySelector('[data-header]');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // inicial
  }

  // ==========================================================================
  // MENU MOBILE
  // ==========================================================================
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuList = document.querySelector('[data-menu]');

  if (menuToggle && menuList) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuList.classList.remove('is-open');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuList.classList.toggle('is-open', !isOpen);
    });

    // Fechar ao clicar em um link do menu
    menuList.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        closeMenu();
      }
    });

    // Fechar ao pressionar Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuList.classList.contains('is-open')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Fechar ao redimensionar para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });
  }

  // ==========================================================================
  // ANIMAÇÕES DE SCROLL (IntersectionObserver)
  // ==========================================================================
  const animateElements = document.querySelectorAll('[data-animate]');
  if (animateElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // anima uma vez
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback se não houver suporte ou elementos
    animateElements.forEach((el) => {
      el.classList.add('visible');
    });
  }

  // ==========================================================================
  // MODAL LGPD
  // ==========================================================================
  const lgpdModal = document.getElementById('lgpdModal');
  const lgpdAccept = document.querySelector('[data-lgpd-accept]');
  const lgpdReject = document.querySelector('[data-lgpd-reject]');
  const lgpdClose = document.querySelector('[data-lgpd-close]');
  const LGPD_KEY = 'lgpd_accepted';

  function showLgpdModal() {
    if (!lgpdModal) return;
    lgpdModal.hidden = false;
    document.body.style.overflow = 'hidden'; // trava scroll
  }

  function hideLgpdModal() {
    if (!lgpdModal) return;
    lgpdModal.hidden = true;
    document.body.style.overflow = ''; // libera scroll
  }

  if (lgpdModal && localStorage.getItem(LGPD_KEY) === null) {
    showLgpdModal();
  }

  if (lgpdAccept) {
    lgpdAccept.addEventListener('click', () => {
      localStorage.setItem(LGPD_KEY, 'true');
      hideLgpdModal();
    });
  }

  if (lgpdReject) {
    lgpdReject.addEventListener('click', () => {
      localStorage.setItem(LGPD_KEY, 'false');
      hideLgpdModal();
    });
  }

  if (lgpdClose) {
    lgpdClose.addEventListener('click', (e) => {
      if (e.target === lgpdClose) {
        hideLgpdModal();
      }
    });
  }

  // Fechar com ESC
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lgpdModal && !lgpdModal.hidden) {
      hideLgpdModal();
    }
  });

  // ==========================================================================
  // ROLAGEM SUAVE (fallback para navegadores antigos)
  // ==========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (event) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ==========================================================================
  // TRACKING DE MICROCONVERSÕES (MarTech)
  // ==========================================================================
  function trackEvent(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  }

  document.querySelectorAll('[data-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      trackEvent('cta_click', { cta_id: el.getAttribute('data-cta') });
    });
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        trackEvent('faq_open', { question: item.querySelector('.faq-question')?.textContent?.trim() });
      }
    });
  });

  const igGrid = document.querySelector('[data-ig-grid]');
  if (igGrid && 'IntersectionObserver' in window) {
    const igObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          trackEvent('portfolio_view', {});
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    igObserver.observe(igGrid);
  }

  // ==========================================================================
  // ANO ATUAL NO FOOTER
  // ==========================================================================
  const yearSpan = document.querySelector('[data-year]');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
})();