export function initNav() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
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
      if (!touchMedia.matches || window.innerWidth <= 768) return;
      const isOpen = item.classList.contains("touch-open");
      if (!isOpen) {
        event.preventDefault();
        closeTouchMenus();
        item.classList.add("touch-open");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!touchMedia.matches || window.innerWidth <= 768) return;
    if (!navbar.contains(event.target)) closeTouchMenus();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) closeTouchMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTouchMenus();
  });
}