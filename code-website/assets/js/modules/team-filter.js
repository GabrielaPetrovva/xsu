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
  
    // Helper функция за проверка на визуалност на група
    const countVisibleCards = (filter) => {
      let count = 0;
      groups.forEach(g => {
        if (filter === 'all' || g.dataset.group === filter) {
          count += g.querySelectorAll('.member-card').length;
        }
      });
      return count;
    };
  
    // Инициализация на броевете
    filterBtns.forEach(btn => {
      const filter = btn.dataset.filter;
      const count = countVisibleCards(filter);
      const countSpan = btn.querySelector('.filter-count');
      if (countSpan) countSpan.textContent = count;
    });
  
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
  
        const filter = btn.dataset.filter;
        let visible = 0;
  
        groups.forEach(g => {
          if (filter === 'all' || g.dataset.group === filter) {
            g.classList.remove('hidden');
            visible++;
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
  
        if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
      });
    });
  }