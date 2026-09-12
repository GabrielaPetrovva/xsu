function getScrollOffset() {
  const root = getComputedStyle(document.documentElement);
  const topBar = parseFloat(root.getPropertyValue('--top-bar-h')) || 0;
  const navH = parseFloat(root.getPropertyValue('--nav-h')) || 72;
  return topBar + navH + 16;
}

// Smooth scroll to decade section
window.scrollToSection = function(id) {
  const element = document.getElementById(id);
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - getScrollOffset();
  window.scrollTo({ top, behavior: 'smooth' });
};
  
  // Update active sidebar button on scroll
  const blocks = ['d1980', 'd1990', 'd2000', 'd2010'];
  const btns = document.querySelectorAll('.decade-btn');
  
  window.addEventListener('scroll', () => {
    let current = 0;
    blocks.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) current = i;
    });
    btns.forEach((b, i) => b.classList.toggle('active', i === current));
  });