(function () {
    'use strict';
  
    /* ─────────────────────────────────────────────
       1. ACCORDION
    ───────────────────────────────────────────── */
    function initAccordion() {
      const headers = document.querySelectorAll('.year-header');

      headers.forEach(function (header) {
        const docs = document.getElementById(header.getAttribute('data-target'));
        if (!docs) return;

        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', docs.classList.contains('year-docs--closed') ? 'false' : 'true');
        header.setAttribute('aria-controls', header.getAttribute('data-target'));

        const toggle = function () {
          const isOpen = !docs.classList.contains('year-docs--closed');

          if (isOpen) {
            docs.classList.add('year-docs--closed');
            header.classList.remove('year-header--open');
            header.setAttribute('aria-expanded', 'false');
            const chevron = header.querySelector('.year-chevron');
            if (chevron) chevron.classList.remove('year-chevron--open');
          } else {
            docs.classList.remove('year-docs--closed');
            header.classList.add('year-header--open');
            header.setAttribute('aria-expanded', 'true');
            const chevron = header.querySelector('.year-chevron');
            if (chevron) chevron.classList.add('year-chevron--open');
          }
        };

        header.addEventListener('click', toggle);
        header.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        });
      });
    }
  
    /* ─────────────────────────────────────────────
       2. ACTIVE YEAR PILL ON SCROLL
    ───────────────────────────────────────────── */
    function initYearPillHighlight() {
      const pills      = document.querySelectorAll('.year-pill');
      const yearBlocks = document.querySelectorAll('.year-block[id]');
  
      if (!pills.length || !yearBlocks.length) return;
  
      var navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 72;
  
      function getActiveYear() {
        var active = null;
        yearBlocks.forEach(function (block) {
          var rect = block.getBoundingClientRect();
          if (rect.top <= navH + 40) {
            active = block.id; // e.g. "y2025"
          }
        });
        return active;
      }
  
      function updatePills() {
        var activeId = getActiveYear();
        pills.forEach(function (pill) {
          var href = pill.getAttribute('href'); // e.g. "#y2025"
          if (href && href === '#' + activeId) {
            pill.classList.add('year-pill--active');
          } else {
            pill.classList.remove('year-pill--active');
          }
        });
      }
  
      window.addEventListener('scroll', updatePills, { passive: true });
      updatePills(); // initial call
    }
  
    /* ─────────────────────────────────────────────
       3. SMOOTH SCROLL FOR YEAR PILLS
          (native scroll-behavior may already handle
           this, but we also open the accordion)
    ───────────────────────────────────────────── */
    function initPillClick() {
      var navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 72;
  
      document.querySelectorAll('.year-pill').forEach(function (pill) {
        pill.addEventListener('click', function (e) {
          var href = this.getAttribute('href');
          if (!href || href === '#') return;
  
          var target = document.querySelector(href);
          if (!target) return;
  
          e.preventDefault();
  
          // Auto-open accordion for target year
          var header = target.querySelector('.year-header');
          if (header) {
            var targetId = header.getAttribute('data-target');
            var docs     = targetId ? document.getElementById(targetId) : null;
            if (docs && docs.classList.contains('year-docs--closed')) {
              header.click();
            }
          }
  
          // Scroll after a tiny delay (let accordion expand first)
          setTimeout(function () {
            var top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
            window.scrollTo({ top: top, behavior: 'smooth' });
          }, 50);
        });
      });
    }
  
    /* ─────────────────────────────────────────────
       BOOT
    ───────────────────────────────────────────── */
    function init() {
      initAccordion();
      initYearPillHighlight();
      initPillClick();
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();