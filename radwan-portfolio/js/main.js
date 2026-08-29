/* ==========================================================================
   RADWAN ELDALY — PORTFOLIO
   main.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ------------------------------------------------------------------
     Navigation: scroll state + mobile menu
     ------------------------------------------------------------------ */
  const nav = document.querySelector('[data-nav]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuLinks = document.querySelectorAll('[data-menu-link]');

  const setNavScrolled = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  setNavScrolled();
  window.addEventListener('scroll', setNavScrolled, { passive: true });

  const closeMenu = () => {
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    mobileMenu.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });
  menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

  /* ------------------------------------------------------------------
     Smooth anchor scrolling (native, works even without GSAP plugin)
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ------------------------------------------------------------------
     Custom cursor
     ------------------------------------------------------------------ */
  const cursor = document.querySelector('.cursor');
  if (cursor && !isTouch) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const renderCursor = () => {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.transform = `translate(${curX}px, ${curY}px)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    const interactiveSelector = 'a, button, .work-tile, input, textarea, [tabindex]';
    document.querySelectorAll(interactiveSelector).forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });
  } else if (cursor) {
    cursor.classList.add('is-hidden');
  }

  /* ------------------------------------------------------------------
     Work tiles: click/keyboard opens the project (placeholder behavior),
     and touch devices get a tap-to-reveal before following the link.
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-work-tile]').forEach((tile) => {
    tile.setAttribute('role', 'button');
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tile.classList.toggle('is-touch-visible');
      }
    });
  });

  /* ------------------------------------------------------------------
     Index rail — updates to the current section label on scroll
     ------------------------------------------------------------------ */
  const railLabel = document.querySelector('.index-rail__label');
  const sections = document.querySelectorAll('[data-section]');

  if (railLabel && sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            railLabel.textContent = entry.target.getAttribute('data-section');
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ------------------------------------------------------------------
     GSAP: hero entrance
     ------------------------------------------------------------------ */
  if (window.gsap) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (!prefersReducedMotion) {
      heroTl
        .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.1)
        .from('.hero__title .word', {
          yPercent: 130,
          opacity: 0,
          stagger: 0.045,
          duration: 0.9,
        }, 0.25)
        .to('.hero__text', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to('.hero__ctas', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
    } else {
      gsap.set(['.hero__eyebrow', '.hero__text', '.hero__ctas'], { opacity: 1, y: 0 });
      gsap.set('.hero__title .word', { opacity: 1, y: 0 });
    }

    /* ------------------------------------------------------------------
       GSAP + ScrollTrigger: generic reveal for [data-reveal] / [data-reveal-fade]
       ------------------------------------------------------------------ */
    if (window.ScrollTrigger && !prefersReducedMotion) {
      const revealGroups = new Map();

      document.querySelectorAll('[data-reveal], [data-reveal-fade]').forEach((el) => {
        const section = el.closest('section') || document.body;
        if (!revealGroups.has(section)) revealGroups.set(section, []);
        revealGroups.get(section).push(el);
      });

      revealGroups.forEach((els, section) => {
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true,
          },
        });
      });

      /* Subtle parallax on work tile images */
      document.querySelectorAll('.work-tile__media img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.work-tile'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    } else {
      document.querySelectorAll('[data-reveal], [data-reveal-fade]').forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0 });
      });
    }
  }

});
