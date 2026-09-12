export function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length || !dots.length) return;

  let cur = 0;
  let sliderTimer;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goTo(idx) {
    slides[cur].classList.remove('active');
    slides[cur].classList.remove('first-load');
    dots[cur].classList.remove('active');
    dots[cur].setAttribute('aria-pressed', 'false');
    cur = idx;
    slides[cur].classList.add('active');
    slides[cur].classList.add('first-load');
    dots[cur].classList.add('active');
    dots[cur].setAttribute('aria-pressed', 'true');
    setTimeout(() => {
      slides[cur].classList.remove('first-load');
    }, 3200);
  }

  function startSlider() {
    if (reduceMotion) return;
    sliderTimer = setInterval(() => goTo((cur + 1) % slides.length), 5500);
  }

  dots.forEach((d, index) => {
    d.setAttribute('aria-pressed', d.classList.contains('active') ? 'true' : 'false');
    d.addEventListener('click', () => {
      clearInterval(sliderTimer);
      goTo(Number(d.dataset.idx ?? index));
      startSlider();
    });
  });

  startSlider();
}
