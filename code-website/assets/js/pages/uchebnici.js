// ============================================================
// Филтриране по клас (табове) + търсачка
// ============================================================

(function () {
  'use strict';

  // ---- Elements ----
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const sections   = document.querySelectorAll('.class-section');
  const searchInput = document.getElementById('searchInput');
  const noResults  = document.getElementById('noResults');

  // ---- State ----
  let activeClass = 'all'; // 'all' | '1' … '10'
  let searchQuery = '';

  // ---- Helpers ----

  function normalize(str) {
    return str
      .toLowerCase()
      .replace(/[аАbб]/g, m => m) // keep as-is; just lower-case is enough
      .trim();
  }

  function applyFilters() {
    let anyVisible = false;

    sections.forEach(section => {
      const cls = section.dataset.class; // '1' … '10'

      // 1. Tab filter
      const classMatch = activeClass === 'all' || cls === activeClass;

      if (!classMatch) {
        section.classList.add('hidden');
        return;
      }

      section.classList.remove('hidden');

      // 2. Search filter — per card
      const cards = section.querySelectorAll('.book-card');
      let sectionHasVisible = false;

      cards.forEach(card => {
        if (!searchQuery) {
          card.classList.remove('search-hidden');
          sectionHasVisible = true;
          return;
        }

        const text = normalize(card.textContent);
        const matches = text.includes(normalize(searchQuery));

        card.classList.toggle('search-hidden', !matches);
        if (matches) sectionHasVisible = true;
      });

      // Hide entire section if search left nothing visible
      if (searchQuery && !sectionHasVisible) {
        section.classList.add('hidden');
      } else {
        anyVisible = true;
      }
    });

    // "No results" message
    if (noResults) {
      noResults.style.display = anyVisible ? 'none' : 'block';
    }
  }

  // ---- Tab clicks ----
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeClass = btn.dataset.class;
      applyFilters();

      // Scroll to first visible section on mobile
      if (activeClass !== 'all') {
        const target = document.getElementById('class-' + activeClass);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }
      }
    });
  });

  // ---- Search input ----
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;

      // When searching, reset tab to "all" so results from all classes show
      if (searchQuery) {
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('.tab-btn[data-class="all"]')?.classList.add('active');
        activeClass = 'all';
      }

      applyFilters();
    });
  }

  // ---- Reveal on scroll ----
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => observer.observe(el));

  // ---- Init ----
  applyFilters();

})();