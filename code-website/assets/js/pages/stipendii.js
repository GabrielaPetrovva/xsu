// FAQ accordion
function setFaqState(item) {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (q) q.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
  if (a) a.setAttribute('aria-hidden', item.classList.contains('open') ? 'false' : 'true');
}

window.toggleFaq = function (el) {
    const item = el.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      setFaqState(i);
    });
    if (!isOpen) item.classList.add('open');
    setFaqState(item);
  };

window.toggleFaqByKey = function (el, e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    window.toggleFaq(el);
  }
};

(function initFaqA11y() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.setAttribute('role', 'button');
    q.setAttribute('tabindex', '0');
    q.setAttribute('aria-expanded', 'false');
    const a = item.querySelector('.faq-a');
    if (a) a.setAttribute('aria-hidden', 'true');
    q.addEventListener('keydown', (e) => window.toggleFaqByKey(q, e));
  });
})();