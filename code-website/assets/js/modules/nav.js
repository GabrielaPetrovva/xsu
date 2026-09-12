export function initNav() {
  const navbar = document.getElementById("navbar");
  const topBar = document.querySelector(".top-bar");
  if (!navbar) return;

  let lastScrollY = 0;
  let isTopBarVisible = true;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;
      
      // Toggle navbar scrolled state
      navbar.classList.toggle("scrolled", currentScrollY > 40);

      // Hide/show top-bar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide top-bar
        if (isTopBarVisible && topBar) {
          topBar.classList.add("hidden");
          navbar.classList.add("top-bar-hidden");
          isTopBarVisible = false;
        }
      } else if (currentScrollY < lastScrollY || currentScrollY === 0) {
        // Scrolling up or at top - show top-bar
        if (!isTopBarVisible && topBar) {
          topBar.classList.remove("hidden");
          navbar.classList.remove("top-bar-hidden");
          isTopBarVisible = true;
        }
      }

      lastScrollY = currentScrollY;
    },
    { passive: true }
  );

  // Touch devices do not support hover menus reliably.
  // On first tap we open the dropdown, second tap follows the link.
  const touchMedia = window.matchMedia("(hover: none), (pointer: coarse)");
  const navItems = [...navbar.querySelectorAll(".nav-item")].filter((item) =>
    item.querySelector(".dropdown")
  );

  const closeTouchMenus = () => {
    navItems.forEach((item) => item.classList.remove("touch-open"));
  };

  navItems.forEach((item) => {
    const trigger = item.querySelector(":scope > a");
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      if (!touchMedia.matches || window.innerWidth <= 1100) return;
      const isOpen = item.classList.contains("touch-open");
      if (!isOpen) {
        event.preventDefault();
        closeTouchMenus();
        item.classList.add("touch-open");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!touchMedia.matches || window.innerWidth <= 1100) return;
    if (!navbar.contains(event.target)) closeTouchMenus();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 1100) closeTouchMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTouchMenus();
  });
}