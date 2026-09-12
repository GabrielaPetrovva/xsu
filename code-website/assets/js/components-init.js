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
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
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

  document.addEventListener('keydown', (e) => {
    if (menuOpen && e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menuOpen) closeMenu();
  });

  mobileMenu.setAttribute('aria-hidden', 'true');
}

function normalizeSearchValue(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function applyPendingSearchScroll() {
  let payload = null;
  try {
    const raw = sessionStorage.getItem('navSearchPending');
    payload = raw ? JSON.parse(raw) : null;
  } catch (error) {
    payload = null;
  }

  if (!payload || payload.path !== window.location.pathname) return;
  sessionStorage.removeItem('navSearchPending');

  const lookup = normalizeSearchValue(payload.target || payload.query || '');
  const targetText = normalizeSearchValue(payload.target || '');
  if (!lookup) return;

  const candidates = Array.from(document.querySelectorAll('main h1, main h2, main h3, main h4, main p, main li, .member-card, .news-card, section h1, section h2, section h3, section p'));
  if (!candidates.length) return;

  let bestElement = null;
  let bestScore = 0;

  candidates.forEach((element) => {
    const text = normalizeSearchValue((element.textContent || '').replace(/\s+/g, ' ').trim());
    if (!text) return;
    
    let score = 0;
    
    // Exact match on full text - highest priority
    if (text === targetText) {
      score = 300;
    }
    // Member card with matching name
    else if (element.classList.contains('member-card')) {
      const memberName = normalizeSearchValue((element.querySelector('.member-name')?.textContent || '').trim());
      if (memberName === targetText) {
        score = 280; // Direct name match in member card
      } else if (memberName.includes(lookup)) {
        score = 260;
      } else if (text.includes(lookup)) {
        score = 80;
      }
    }
    // News card with matching title
    else if (element.classList.contains('news-card')) {
      const cardTitle = normalizeSearchValue((element.querySelector('h3')?.textContent || '').trim());
      if (cardTitle === targetText) {
        score = 280;
      } else if (cardTitle.includes(lookup)) {
        score = 260;
      } else if (text.includes(lookup)) {
        score = 80;
      }
    }
    // Heading matches
    else if (element.tagName.match(/^H[1-4]$/)) {
      if (text === targetText) {
        score = 270;
      } else if (text.startsWith(lookup)) {
        score = 180;
      } else if (text.includes(lookup)) {
        score = 100;
      }
    }
    // General text search
    else if (text.includes(lookup)) {
      if (text.startsWith(lookup)) {
        score = 120;
      } else {
        score = 70;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestElement = element;
    }
  });

  if (!bestElement) return;

  bestElement.classList.add('nav-search-hit');
  bestElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

  window.setTimeout(() => {
    bestElement.classList.remove('nav-search-hit');
  }, 2600);
}

function initGlobalSearch() {
  const searchBtn = document.querySelector('#navbar .nav-search');
  const overlay = document.getElementById('navSearchOverlay');
  const form = document.getElementById('navSearchForm');
  const input = document.getElementById('navSearchInput');
  const closeBtn = document.getElementById('navSearchClose');
  const suggestionsBox = document.getElementById('navSearchSuggestions');
  if (!searchBtn || !overlay || !form || !input || !closeBtn || !suggestionsBox) return;
  const SEARCH_INDEX_CACHE_KEY = 'navSearchIndexCacheV1';

  const parseHtml = (html) => {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  };

  const resolveSearchHref = (baseHref) => {
    // Simply return the href as-is, preserving path and hash
    if (!baseHref) return '';
    return baseHref;
  };

  const storePendingSearchForPage = (href, rawQuery, targetText = '') => {
    try {
      const url = new URL(href, window.location.href);
      sessionStorage.setItem('navSearchPending', JSON.stringify({
        path: url.pathname,
        query: rawQuery || '',
        target: (targetText || '').slice(0, 280)
      }));
    } catch (error) {
      // ignore storage errors
    }
  };

  const buildNavSearchIndex = () => {
    const anchors = Array.from(document.querySelectorAll('#navbar a, #mobileMenu a'));
    const byHref = new Map();

    anchors.forEach((a) => {
      const href = (a.getAttribute('href') || '').trim();
      const title = (a.textContent || '').replace(/\s+/g, ' ').trim();
      if (!href || !title) return;
      if (href.startsWith('#') || href.startsWith('http')) return;
      if (!href.endsWith('.html')) return;

      const normalizedHref = href.toLowerCase();
      if (!byHref.has(normalizedHref)) {
        const inSubmenu = Boolean(a.closest('.dropdown, .mobile-submenu'));
        const category = href.includes('priem')
          ? 'Прием'
          : inSubmenu
            ? 'Подстраници'
            : 'Основни';
        byHref.set(normalizedHref, {
          href,
          title,
          category,
          type: 'page',
          keywords: [title, href.replace('.html', '').replace(/[-_]/g, ' ')],
          subtitle: category
        });
      } else {
        byHref.get(normalizedHref).keywords.push(title);
      }
    });

    if (!byHref.has('index.html')) {
      byHref.set('index.html', {
        href: 'index.html',
        title: 'Начало',
        category: 'Основни',
        type: 'page',
        keywords: ['начало', 'home', 'училище'],
        subtitle: 'Основни'
      });
    }

    return Array.from(byHref.values());
  };

  const buildNewsSearchIndex = async () => {
    try {
      const response = await fetch('novini.html');
      if (!response.ok) return [];
      const html = await response.text();
      const doc = parseHtml(html);
      const cards = Array.from(doc.querySelectorAll('.news-card'));
      return cards.map((card) => {
        const title = (card.querySelector('h3')?.textContent || '').trim();
        if (!title) return null;
        const tag = (card.querySelector('.tag')?.textContent || 'Новини').trim();
        const text = (card.querySelector('p')?.textContent || '').trim();
        const href = (card.querySelector('.btn-more')?.getAttribute('href') || 'novini.html').trim();
        const normalizedHref = href && href !== '#' ? href : 'novini.html';
        return {
          href: normalizedHref,
          title,
          category: 'Новини',
          type: 'news',
          subtitle: `${tag} • Новини`,
          keywords: [title, tag, text, 'новина', 'новини', 'събитие']
        };
      }).filter(Boolean);
    } catch (error) {
      return [];
    }
  };

  const buildTeamSearchIndex = async () => {
    try {
      const response = await fetch('ekip.html');
      if (!response.ok) return [];
      const html = await response.text();
      const doc = parseHtml(html);
      const members = Array.from(doc.querySelectorAll('.member-card'));
      return members.map((member) => {
        const name = (member.querySelector('.member-name')?.textContent || '').trim();
        if (!name) return null;
        const role = (member.querySelector('.role-badge')?.textContent || '').trim();
        const subject = (member.querySelector('.member-subject')?.textContent || '').trim();
        return {
          href: 'ekip.html',
          title: name,
          category: 'Училищен екип',
          type: 'team',
          subtitle: role || 'Училищен екип',
          keywords: [name, role, subject, 'учител', 'екип', 'педагогически екип']
        };
      }).filter(Boolean);
    } catch (error) {
      return [];
    }
  };

  const buildContentSearchIndex = async (hrefs) => {
    const htmlHrefs = Array.from(new Set(hrefs
      .filter(Boolean)
      .map((href) => href.split('#')[0])
      .filter((href) => href.endsWith('.html'))));

    const pageChunks = await Promise.all(htmlHrefs.map(async (href) => {
      try {
        const response = await fetch(href);
        if (!response.ok) return [];
        const html = await response.text();
        const doc = parseHtml(html);
        const pageTitle = (doc.querySelector('h1')?.textContent || doc.title || href).replace(/\s+/g, ' ').trim();
        const blocks = Array.from(doc.querySelectorAll('main h1, main h2, main h3, main p, main li, article h1, article h2, article h3, article p'))
          .map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim())
          .filter((text) => text.length >= 12)
          .slice(0, 80);

        return blocks.map((text) => ({
          href,
          title: text.slice(0, 96),
          category: 'Съдържание',
          type: 'content',
          subtitle: `В: ${pageTitle.slice(0, 60)}`,
          targetText: text,
          keywords: [text, pageTitle, href.replace('.html', '').replace(/[-_]/g, ' ')]
        }));
      } catch (error) {
        return [];
      }
    }));

    return pageChunks.flat();
  };

  const saveExtendedIndexCache = (records) => {
    try {
      sessionStorage.setItem(SEARCH_INDEX_CACHE_KEY, JSON.stringify({
        createdAt: Date.now(),
        records
      }));
    } catch (error) {
      // ignore storage errors
    }
  };

  const loadExtendedIndexCache = () => {
    try {
      const raw = sessionStorage.getItem(SEARCH_INDEX_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.records)) return null;
      return parsed.records;
    } catch (error) {
      return null;
    }
  };

  let pages = buildNavSearchIndex();
  let extendedIndexLoaded = false;
  let extendedIndexPromise = null;

  const scoreMatch = (item, query) => {
    const normalizedTitle = normalizeSearchValue(item.title);
    if (!query) return 1;
    let score = 0;
    if (normalizedTitle === query) score += 200;
    if (normalizedTitle.startsWith(query)) score += 120;
    if (normalizedTitle.includes(query)) score += 70;

    item.keywords.forEach((keyword) => {
      const normalizedKey = normalizeSearchValue(keyword || '');
      if (!normalizedKey) return;
      if (normalizedKey === query) score += 100;
      else if (normalizedKey.startsWith(query)) score += 60;
      else if (normalizedKey.includes(query)) score += 40;
      else if (query.includes(normalizedKey)) score += 20;
    });

    if (score > 0) {
      if (item.type === 'team') score += 5;
      if (item.type === 'news') score += 10;
    }
    return score;
  };

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const sanitizeHref = (value = '') => {
    const href = String(value).trim();
    if (!href) return '#';
    if (/^(javascript|data):/i.test(href)) return '#';
    return href;
  };

  const getMatches = (raw) => {
    const query = normalizeSearchValue(raw || '');
    if (!query) return pages.slice(0, 10);
    return pages
      .map((page) => ({
        ...page,
        score: scoreMatch(page, query),
        resolvedHref: resolveSearchHref(page.href)
      }))
      .filter((page) => page.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  };

  const renderSuggestions = (raw) => {
    const matches = getMatches(raw);
    if (!matches.length) {
      suggestionsBox.innerHTML = '<div class="nav-search-empty">Няма намерени съвпадения.</div>';
      return;
    }
    const groupsOrder = ['Новини', 'Училищен екип', 'Съдържание', 'Основни', 'Прием', 'Подстраници'];
    const grouped = new Map();
    matches.forEach((item) => {
      const key = item.category || 'Подстраници';
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(item);
    });

    const html = groupsOrder
      .filter((groupName) => grouped.has(groupName))
      .map((groupName) => {
        const items = grouped.get(groupName) || [];
        const itemsHtml = items.map((item) => {
          const safeHref = sanitizeHref(item.resolvedHref || item.href || '');
          const itemTitle = escapeHtml(item.title || '');
          return `
          <a class="nav-search-suggestion" href="${safeHref}" data-title="${itemTitle}" data-target-text="${escapeHtml(item.targetText || item.title || '')}">
            <span>
              <span class="nav-search-suggestion-title">${itemTitle}</span>
              <span class="nav-search-suggestion-meta">${escapeHtml(item.subtitle || item.category || '')}</span>
            </span>
            <span class="nav-search-suggestion-arrow">→</span>
          </a>
        `;
        }).join('');
        return `
          <div class="nav-search-group">
            <div class="nav-search-group-title">${groupName}</div>
            ${itemsHtml}
          </div>
        `;
      }).join('');

    suggestionsBox.innerHTML = html;
  };

  const runSearch = (raw) => {
    const query = normalizeSearchValue(raw || '');
  
    if (!query) {
      input.setCustomValidity('Моля, въведете текст за търсене.');
      input.reportValidity();
      return false;
    }
  
    input.setCustomValidity('');
    input.checkValidity();
  
    const [match] = getMatches(raw);
  
    if (!match) return false;
  
    input.setCustomValidity('');
    input.checkValidity();
  
    const destination = match.resolvedHref || match.href;
    // Use title as primary target (works for team members, news, etc), fallback to targetText
    const targetForScroll = match.title || match.targetText || '';
    storePendingSearchForPage(destination, raw, targetForScroll);
    window.location.href = destination;
  
    return true;
  };

  const openSearch = () => {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    renderSuggestions('');
    ensureExtendedIndexLoaded();
    window.requestAnimationFrame(() => input.focus());
  };

  const closeSearch = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    form.reset();
    suggestionsBox.innerHTML = '';
  };

  searchBtn.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const didNavigate = runSearch(input.value);
    if (!didNavigate) {
      renderSuggestions(input.value);
    }
  });

  input.addEventListener('input', () => {
    ensureExtendedIndexLoaded();
    renderSuggestions(input.value);
  });

  input.addEventListener('focus', () => {
    renderSuggestions(input.value);
  });

  suggestionsBox.addEventListener('click', (event) => {
    const link = event.target.closest('.nav-search-suggestion');
    if (!link) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const href = link.getAttribute('href');
    if (!href || href === '#') {
      return;
    }
    
    // Use data-title first (the suggestion title), then fallback to data-target-text
    const targetText = link.getAttribute('data-title') || link.getAttribute('data-target-text') || '';
    
    storePendingSearchForPage(href, input.value, targetText);
    
    // Use a small delay to ensure sessionStorage write completes
    setTimeout(() => {
      window.location.href = href;
    }, 50);
  });

  overlay.addEventListener('click', (event) => {
    // Only close if clicking directly on overlay background, not on elements inside
    if (event.target === overlay) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('open')) {
      closeSearch();
    }
  });

  const ensureExtendedIndexLoaded = () => {
    if (extendedIndexLoaded) return Promise.resolve();
    if (extendedIndexPromise) return extendedIndexPromise;

    const cached = loadExtendedIndexCache();
    if (cached && cached.length) {
      const combinedCached = [...pages, ...cached];
      const uniqueCached = new Map();
      combinedCached.forEach((item) => {
        const key = `${item.type || 'page'}::${item.href}::${normalizeSearchValue(item.title)}`;
        if (!uniqueCached.has(key)) uniqueCached.set(key, item);
      });
      pages = Array.from(uniqueCached.values());
      extendedIndexLoaded = true;
      renderSuggestions(input.value);
      return Promise.resolve();
    }

    extendedIndexPromise = Promise.all([buildNewsSearchIndex(), buildTeamSearchIndex()])
      .then(([newsIndex, teamIndex]) => {
        const baseCombined = [...pages, ...newsIndex, ...teamIndex];
        const pageHrefs = baseCombined.map((item) => item.href);
        return buildContentSearchIndex(pageHrefs).then((contentIndex) => {
          const extended = [...newsIndex, ...teamIndex, ...contentIndex];
          saveExtendedIndexCache(extended);
          const combined = [...pages, ...extended];
          const unique = new Map();
          combined.forEach((item) => {
            const key = `${item.type || 'page'}::${item.href}::${normalizeSearchValue(item.title)}`;
            if (!unique.has(key)) unique.set(key, item);
          });
          pages = Array.from(unique.values());
          extendedIndexLoaded = true;
          renderSuggestions(input.value);
        });
      })
      .finally(() => {
        extendedIndexPromise = null;
      });

    return extendedIndexPromise;
  };
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
      if (!navbarResponse.ok) throw new Error('navbar request failed');
      const navbarHTML = await navbarResponse.text();
      navbarContainer.innerHTML = navbarHTML;
      document.dispatchEvent(new CustomEvent('components:navbar-loaded'));
      
      // Initialize mobile menu after navbar is loaded
      initMobileMenu();
      initGlobalSearch();
    }

    // Load Footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      const footerResponse = await fetch('assets/components/footer.html');
      if (!footerResponse.ok) throw new Error('footer request failed');
      const footerHTML = await footerResponse.text();
      footerContainer.innerHTML = footerHTML;
    }
  } catch (error) {
    console.error('Error loading components:', error);
  } finally {
    applyPendingSearchScroll();
  }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadComponents);
} else {
  loadComponents();
}
