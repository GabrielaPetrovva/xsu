/**
 * team-filter.js — Филтриране на екипа по категория (ekip.html)
 */
export function initTeamFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const groups      = document.querySelectorAll('.member-group');
    const emptyState  = document.getElementById('empty-state');
    if (!filterBtns.length) return;
  
    // Show all groups by default on page load
    groups.forEach(g => g.classList.remove('hidden'));
  
    // Helper функция за преброяване на карти по филтър
    const countCardsByFilter = (filter) => {
      let count = 0;
      groups.forEach(g => {
        if (filter === 'all') {
          count += g.querySelectorAll('.member-card').length;
        } else if (g.dataset.group === filter) {
          count += g.querySelectorAll('.member-card').length;
        }
      });
      return count;
    };
  
    // Инициализация на броевете при зареждане
    filterBtns.forEach(btn => {
      const filter = btn.dataset.filter;
      const countSpan = btn.querySelector('.filter-count');
      if (countSpan) {
        const count = countCardsByFilter(filter);
        countSpan.textContent = count;
      }
    });
  
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
  
        const filter = btn.dataset.filter;
        let visibleCount = 0;
  
        groups.forEach(g => {
          if (filter === 'all' || g.dataset.group === filter) {
            g.classList.remove('hidden');
            visibleCount += g.querySelectorAll('.member-card').length;
            // Re-trigger card анимации
            g.querySelectorAll('.member-card').forEach((c, i) => {
              c.classList.remove('card-visible');
              void c.offsetWidth; // force reflow
              setTimeout(() => c.classList.add('card-visible'), i * 55);
            });
          } else {
            g.classList.add('hidden');
          }
        });
  
        if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      });
    });
  }