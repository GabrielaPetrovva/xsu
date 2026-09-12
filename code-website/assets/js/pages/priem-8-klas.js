// Stop sticky sidebar right before footer (prevents overlap)
const layout = document.querySelector('.content-layout');
const aside = document.querySelector('.priem-side-nav');
const footer = document.querySelector('footer.page-footer') || document.querySelector('footer');

function syncAside() {
  if (!layout || !aside || !footer) return;
  if (window.matchMedia('(max-width: 768px)').matches) {
    aside.classList.remove('is-stopped');
    aside.style.top = '';
    aside.style.left = '';
    aside.style.width = '';
    aside.style.position = '';
    return;
  }
  const layoutRect = layout.getBoundingClientRect();
  const asideRect = aside.getBoundingClientRect();
  const footerRect = footer.getBoundingClientRect();
  const margin = 24;
  const allowedTop = footerRect.top - margin - asideRect.height - layoutRect.top;
  const currentTop = asideRect.top - layoutRect.top;
  if (allowedTop < currentTop) {
    aside.classList.add('is-stopped');
    aside.style.top = Math.max(0, allowedTop) + 'px';
    aside.style.left = (asideRect.left - layoutRect.left) + 'px';
    aside.style.width = asideRect.width + 'px';
  } else {
    aside.classList.remove('is-stopped');
    aside.style.top = '';
    aside.style.left = '';
    aside.style.width = '';
  }
}

let rafId = 0;
const onScroll = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => { rafId = 0; syncAside(); });
};
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
syncAside();

function openBrochure() {
  if (window.innerWidth <= 600) {
    document.getElementById('brochureLightbox').classList.add('open');
  } else {
    document.getElementById('brochureModal').classList.add('open');
  }
  document.body.style.overflow = 'hidden';
}
function closeBrochure() {
  document.getElementById('brochureModal').classList.remove('open');
  document.getElementById('brochureLightbox').classList.remove('open');
  document.body.style.overflow = '';
}
// Image toggle for brochure thumbnail
(function() {
  const img1 = document.getElementById('brochureImg1');
  const img2 = document.getElementById('brochureImg2');
  if (img1 && img2) {
    setInterval(() => {
      img1.classList.toggle('hidden');
      img2.classList.toggle('hidden');
    }, 3000);
  }
})();
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