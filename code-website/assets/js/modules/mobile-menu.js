export function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!hamburger || !mobileMenu) return;

  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    menuOpen ? closeMenu() : openMenu();
  });

  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    if (menuOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (menuOpen && e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && menuOpen) closeMenu();
  });

  mobileMenu.setAttribute("aria-hidden", "true");
}
  
  /**
   * toggleMobSub — отваря/затваря субменю в мобилното меню.
   * Остава глобална функция, защото се извиква с onclick="" в HTML.
   */
  window.toggleMobSub = function (btn) {
  const item = btn.closest(".mobile-menu-item");
  const isOpen = item.classList.contains("open");
  document.querySelectorAll(".mobile-menu-item.open").forEach((i) => i.classList.remove("open"));
  if (!isOpen) item.classList.add("open");
};