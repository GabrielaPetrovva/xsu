// Image switcher (brochure)
const img1 = document.getElementById('brochureImg1');
const img2 = document.getElementById('brochureImg2');
if (img1 && img2) {
  let showingFirst = true;
  setInterval(() => {
    if (showingFirst) {
      img1.classList.add('hidden');
      img2.classList.remove('hidden');
    } else {
      img2.classList.add('hidden');
      img1.classList.remove('hidden');
    }
    showingFirst = !showingFirst;
  }, 3000);
}

// Modal
window.openBrochure = function () {
  const modal = document.getElementById('brochureModal');
  if (!modal) return;
  modal.classList.add('open');
  const btn = modal.querySelector('.close-btn');
  if (btn) btn.focus();
};
window.closeBrochure = function () {
  const modal = document.getElementById('brochureModal');
  if (!modal) return;
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  const banner = document.querySelector('.brochure-banner');
  if (banner && banner.focus) {
    banner.setAttribute('tabindex', '-1');
    banner.focus();
    banner.removeAttribute('tabindex');
  }
};

document.addEventListener('keydown', function (e) {
  const modal = document.getElementById('brochureModal');
  if (!modal || !modal.classList.contains('open')) return;
  if (e.key === 'Escape') closeBrochure();
});