const CONSENT_KEY = "xsu-cookie-consent";

function siteConfig() {
  return window.__XSU_SITE__ || { origin: "", analyticsId: "" };
}

function resolveUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const origin = (siteConfig().origin || "").replace(/\/$/, "");
  if (!origin) return path;
  const clean = path.replace(/^\.\//, "").replace(/^\//, "");
  return `${origin}/${clean}`;
}

function absolutizeSeoUrls() {
  const origin = (siteConfig().origin || "").replace(/\/$/, "");
  if (!origin) return;

  document.querySelectorAll('link[rel="canonical"]').forEach((link) => {
    link.href = resolveUrl(link.getAttribute("href"));
  });
  document.querySelectorAll('meta[property="og:url"], meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
    const value = meta.getAttribute("content");
    if (value) meta.setAttribute("content", resolveUrl(value));
  });
}

function ensureSkipLink() {
  if (document.querySelector(".skip-link")) return;
  const link = document.createElement("a");
  link.className = "skip-link";
  link.href = "#main-content";
  link.textContent = "Към съдържанието";
  document.body.insertBefore(link, document.body.firstChild);
}

function ensureMainLandmark() {
  if (document.getElementById("main-content")) return;
  const main = document.querySelector("main");
  if (main) {
    main.id = "main-content";
    if (!main.getAttribute("tabindex")) main.setAttribute("tabindex", "-1");
    return;
  }
  const candidate = document.querySelector(".page-hero, .page-banner, .hero, .wip-wrapper, .layout");
  if (candidate) {
    candidate.id = "main-content";
    candidate.setAttribute("tabindex", "-1");
  }
}

function markDecorativeMedia() {
  document.querySelectorAll(".hero-bg, .news-img-inner, .page-hero-dots, .page-hero-deco, .wip-deco-text").forEach((el) => {
    el.setAttribute("aria-hidden", "true");
  });
}

function enhanceContentImages() {
  document.querySelectorAll("img").forEach((img, index) => {
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    const isAboveFold = index === 0 || img.closest(".hero, .nav-logo, .page-hero");
    if (!img.hasAttribute("loading") && !isAboveFold) {
      img.setAttribute("loading", "lazy");
    }
    if (img.classList.contains("img-hover")) {
      img.setAttribute("aria-hidden", "true");
    }
  });
}

function interceptMissingDownloads() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a.doc-download--missing");
    if (!link) return;
    event.preventDefault();
    window.location.href = link.getAttribute("href") || "kontakti.html";
  });
}

function loadAnalytics() {
  const { analyticsId, analyticsProvider } = siteConfig();
  if (!analyticsId) return;
  if (localStorage.getItem(CONSENT_KEY) !== "accepted") return;
  if (document.getElementById("xsu-analytics")) return;

  if (analyticsProvider === "gtag") {
    const script = document.createElement("script");
    script.id = "xsu-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", analyticsId, { anonymize_ip: true });
  }
}

function renderCookieBanner() {
  const { analyticsId } = siteConfig();
  if (!analyticsId) return;
  if (localStorage.getItem(CONSENT_KEY)) {
    loadAnalytics();
    return;
  }
  if (document.querySelector(".cookie-banner")) return;

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Съгласие за бисквитки");
  banner.innerHTML = `
    <p>Сайтът използва необходими бисквитки за навигация и търсене. Аналитични бисквитки се зареждат само със ваше съгласие.</p>
    <div class="cookie-banner-actions">
      <button type="button" class="btn-green" data-cookie="accepted">Приемам</button>
      <button type="button" class="btn-outline-cookie" data-cookie="rejected">Само необходими</button>
      <a href="poveritelnost.html">Политика за поверителност</a>
    </div>
  `;
  document.body.appendChild(banner);
  banner.addEventListener("click", (event) => {
    const choice = event.target.getAttribute("data-cookie");
    if (!choice) return;
    localStorage.setItem(CONSENT_KEY, choice);
    banner.remove();
    if (choice === "accepted") loadAnalytics();
  });
}

export function initSiteRuntime() {
  ensureSkipLink();
  ensureMainLandmark();
  absolutizeSeoUrls();
  markDecorativeMedia();
  enhanceContentImages();
  interceptMissingDownloads();
  renderCookieBanner();
}
