import { initSlider }  from '../modules/slider.js';
import { initCountUp } from '../modules/counters.js';

initSlider();
initCountUp();

// Back to Top button - появява се след скролване
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  // Показване/скриване на бутона при скролване
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Клик за връщане в начало
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
}

// Hero title анимация при начално зареждане
// Браузърът не вижда transition ако active е в HTML от старта —
// затова го премахваме, добавяме special клас "first-load" и го възстановяваме
const firstSlide = document.querySelector('.hero-slide.active');
if (firstSlide) {
  firstSlide.classList.remove('active');
  // forceReflow - браузърът преиграва CSS преди да добавим класовете
  void firstSlide.offsetWidth;
  firstSlide.classList.add('active');
  firstSlide.classList.add('first-load');
  // Премахни first-load класа след анимацията (3.2s)
  setTimeout(() => {
    firstSlide.classList.remove('first-load');
  }, 3200);
}

// Priem 8 video modal (fullscreen play)
const videoTrigger = document.querySelector('.priem8-video-link[data-video-url]');
const videoModal = document.getElementById('videoModal');
const videoModalFrame = document.getElementById('videoModalFrame');

function closeVideoModal() {
  if (!videoModal || !videoModalFrame) return;
  if (!videoModal.classList.contains('is-open')) return;
  videoModal.classList.remove('is-open');
  videoModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('video-modal-open');
  videoModalFrame.innerHTML = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

let lastFocus = null;

function openVideoModal(embedUrl) {
  if (!videoModal || !videoModalFrame) return;
  lastFocus = videoTrigger || document.activeElement;
  const src = `${embedUrl}?autoplay=1&rel=0&modestbranding=1`;
  videoModalFrame.innerHTML = `
    <iframe
      src="${src}"
      title="Видео"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
  `;
  videoModal.classList.add('is-open');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('video-modal-open');
}

if (videoTrigger && videoModal && videoModalFrame) {
  videoTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    const url = videoTrigger.getAttribute('data-video-url');
    if (url) openVideoModal(url);
  });

  videoModal.querySelectorAll('[data-video-close]').forEach((el) => {
    el.addEventListener('click', closeVideoModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('is-open')) {
      closeVideoModal();
    }
  });
}
