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