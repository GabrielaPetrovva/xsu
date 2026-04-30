import { initTeamFilter }  from '../modules/team-filter.js';
import { initStatCounters } from '../modules/counters.js';

document.addEventListener("DOMContentLoaded", () => {
  initTeamFilter();
  initStatCounters();

  // force initial state
  document.querySelector('.filter-btn.active')?.click();
});

// Scroll reveal за .reveal елементи
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObs.observe(el));

// Stagger анимация за картите при scroll
const cardObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.member-card');
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('card-visible'), i * 60);
      });
      cardObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.member-group').forEach(g => cardObs.observe(g));
