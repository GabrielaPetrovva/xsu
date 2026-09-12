/**
 * main.js — Зарежда общите модули на всяка страница 
 */
import { initNav }    from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initFaqBot } from './modules/faq-bot.js';
import { initSiteRuntime } from './modules/site-runtime.js';

const MOBILE_BREAKPOINT = 768;

function syncMobileBreadcrumbWraps() {
  const breadcrumbs = Array.from(document.querySelectorAll('.hero-breadcrumb'));

  breadcrumbs.forEach((breadcrumb) => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      breadcrumb.classList.remove('auto-break-last');
      return;
    }

    const items = Array.from(breadcrumb.children);
    const lastItem = items[items.length - 1];
    if (!lastItem) return;

    const label = (lastItem.textContent || '').trim();
    const words = label.split(/\s+/).filter(Boolean);
    const longestWord = words.reduce((max, word) => Math.max(max, word.length), 0);
    const totalChars = label.length;
    const shouldWrap = longestWord >= 10 || totalChars >= 14;

    breadcrumb.classList.toggle('auto-break-last', shouldWrap);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSiteRuntime();
  initNav();
  initReveal();
  initFaqBot();
  syncMobileBreadcrumbWraps();
});

document.addEventListener('components:navbar-loaded', () => {
  initNav();
});

window.addEventListener('resize', syncMobileBreadcrumbWraps);