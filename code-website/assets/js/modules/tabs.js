/**
 * Tab switcher за ДЗИ сесии
 * Бутоните са 2: [0]=май, [1]=юни
 */
export function initDziTabs() {
  const tabs = document.querySelectorAll(".session-tab");
  if (!tabs.length) return;

  window.switchTab = function (id) {
    tabs.forEach((t, i) => t.classList.toggle("active", i === (id === "may" ? 0 : 1)));
    document.querySelectorAll(".session-content").forEach((c) => c.classList.remove("active"));
    const target = document.getElementById("tab-" + id);
    if (target) target.classList.add("active");
  };
}
  
  /**
   * Tab switcher за дневно разписание по клас
   */
  export function initGradeTabs() {
  const tabs = document.querySelectorAll(".grade-tab");
  if (!tabs.length) return;

  window.switchGrade = function (id, triggerEl) {
    tabs.forEach((t) => t.classList.remove("active"));

    const fallbackEventTarget =
      typeof window !== "undefined" && window.event && window.event.target ? window.event.target : null;
    const activeTrigger = triggerEl || fallbackEventTarget;
    if (activeTrigger && activeTrigger.classList) activeTrigger.classList.add("active");

    document.querySelectorAll(".grade-content").forEach((c) => c.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("active");
  };
}