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
  if (window.innerWidth <= 600) {
    document.getElementById('brochureLightbox')?.classList.add('open');
  } else {
    document.getElementById('brochureModal')?.classList.add('open');
  }
  document.body.style.overflow = 'hidden';
};
window.closeBrochure = function () {
  document.getElementById('brochureModal')?.classList.remove('open');
  document.getElementById('brochureLightbox')?.classList.remove('open');
  document.body.style.overflow = '';
};
// Lightbox navigation
(function() {
  const lb = document.getElementById('brochureLightbox');
  if (!lb) return;
  const imgs = lb.querySelectorAll('.lightbox-img');
  let current = 0;
  function showImg(i) {
    imgs.forEach((img, idx) => img.classList.toggle('active', idx === i));
    lb.querySelector('.lightbox-counter').textContent = (i + 1) + ' / ' + imgs.length;
  }
  lb.querySelector('.lightbox-prev').addEventListener('click', function(e) {
    e.stopPropagation();
    current = (current - 1 + imgs.length) % imgs.length;
    showImg(current);
  });
  lb.querySelector('.lightbox-next').addEventListener('click', function(e) {
    e.stopPropagation();
    current = (current + 1) % imgs.length;
    showImg(current);
  });
  showImg(0);
})();