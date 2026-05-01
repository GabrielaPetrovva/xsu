/**
 * Mobile Menu Initialization
 * Handles opening/closing the mobile menu on hamburger click
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  // Close when clicking a link
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (menuOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });
}

/**
 * toggleMobSub — Opens/closes submenu in mobile menu
 * Must be global because it's called with onclick="" in HTML
 */
window.toggleMobSub = function (btn) {
  const item = btn.closest('.mobile-menu-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.mobile-menu-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
};

/**
 * Initialize Components (Navbar and Footer)
 * Loads navbar and footer components into their respective containers
 */

async function loadComponents() {
  try {
    // Load Navbar
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      const navbarResponse = await fetch('assets/components/navbar.html');
      const navbarHTML = await navbarResponse.text();
      navbarContainer.innerHTML = navbarHTML;
      
      // Initialize mobile menu after navbar is loaded
      initMobileMenu();
    }

    // Load Footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      const footerResponse = await fetch('assets/components/footer.html');
      const footerHTML = await footerResponse.text();
      footerContainer.innerHTML = footerHTML;
    }
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadComponents);
} else {
  loadComponents();
}
