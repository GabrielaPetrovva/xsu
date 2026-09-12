(function () {
  'use strict';

  // ─────────────────────────────────────────────
  //  СТАИ
  //  tourUrl → пътят до твоята equirectangular
  //  снимка (напр. 'assets/images/panoramas/fasada.jpg')
  //  Остави null докато нямаш снимка за стаята.
  //  Ако Pannellum (CDN) не зареди, всички стаи
  //  показват placeholder вместо да счупят страницата.
  // ─────────────────────────────────────────────
  const rooms = [
    {
      id: 0, label: 'Поглед отвън', title: 'Фасада и двор', badge: 'Начална точка',
      desc: 'Добре дошли в СУ „Йордан Йовков"! Разгледайте фасадата на нашето училище и просторния двор, където учениците прекарват почивките си.',
      features: ['Просторен двор', 'Спортна площадка', 'Зелени площи', 'Паркинг'],
      emoji: ['🏫', '🌳', '⚽'],
      tourUrl: null   // ← смени с реалния файл
    },
    {
      id: 1, label: 'Учебна дейност', title: 'Класна стая', badge: 'I–XII клас',
      desc: 'Нашите класни стаи са просветли, удобни и оборудвани с модерни учебни помагала. Интерактивни дъски, проектори и комфортни чинове създават идеална среда за учене.',
      features: ['Интерактивна дъска', 'Проектор', 'Климатик', 'Натурална светлина'],
      emoji: ['📖', '✏️', '📐'],
      tourUrl: null
    },
    {
      id: 2, label: 'Учебна дейност', title: 'Компютърен кабинет', badge: 'ИТ & Програмиране',
      desc: 'Модерно оборудван компютърен кабинет с нови машини и бърз интернет. Тук се провеждат часовете по информационни технологии и програмиране.',
      features: ['30 работни места', 'Бърз интернет', 'Нови компютри', 'Специализиран софтуер'],
      emoji: ['💻', '🖥️', '⌨️'],
      tourUrl: null
    },
    {
      id: 3, label: 'Учебна дейност', title: 'Кабинети по науки', badge: 'Физика · Химия · Биология',
      desc: 'Напълно оборудвани лаборатории за практически опити по физика, химия и биология.',
      features: ['Лабораторно оборудване', 'Демонстрационна маса', 'Защитно оборудване', 'Реактиви и препарати'],
      emoji: ['🔬', '⚗️', '🧪'],
      tourUrl: null
    },
    {
      id: 4, label: 'Спорт', title: 'Физкултурен салон', badge: 'Спорт & Здраве',
      desc: 'Просторен физкултурен салон с модерен инвентар за различни спортове.',
      features: ['Паркет под', 'Оборудване за гимнастика', 'Баскетбол & Волейбол', 'Съблекални'],
      emoji: ['🏃', '⚽', '🏀'],
      tourUrl: null
    },
    {
      id: 5, label: 'Изкуство & Тържества', title: 'Актова зала', badge: 'Сцена & Концерти',
      desc: 'Красива актова зала с голяма сцена и зрителна зала. Тук се провеждат училищни тържества, театрални представления и концерти.',
      features: ['Голяма сцена', 'Озвучителна система', 'Прожекционен екран', '300 места'],
      emoji: ['🎭', '🎤', '🎬'],
      tourUrl: null
    },
    {
      id: 6, label: 'Изкуство', title: 'Творческо ателие', badge: 'Извънкласни дейности',
      desc: 'Пространство за творческо изразяване — рисуване, приложни изкуства и ръчна изработка.',
      features: ['Арт материали', 'Грънчарско колело', 'Изложбено пространство', 'Студио'],
      emoji: ['🎨', '✂️', '🖌️'],
      tourUrl: null
    },
    {
      id: 7, label: 'Общи пространства', title: 'Библиотека', badge: 'Знание & Четене',
      desc: 'Уютна библиотека с богат книжен фонд и тиха зона за самоподготовка.',
      features: ['5000+ книги', 'Компютри с интернет', 'Тиха зона', 'Читалня'],
      emoji: ['📚', '📖', '🗂️'],
      tourUrl: null
    },
    {
      id: 8, label: 'Общи пространства', title: 'Стол / Бюфет', badge: 'Хранене & Почивка',
      desc: 'Светлото хранилище предлага разнообразно и балансирано меню всеки ден.',
      features: ['Топла храна', 'Разнообразно меню', 'Чисто пространство', 'Бюфет с лека закуска'],
      emoji: ['🍽️', '🥗', '☕'],
      tourUrl: null
    },
    {
      id: 9, label: 'Администрация', title: 'Канцелария', badge: 'Администрация',
      desc: 'Административният център на училището — документи, прием на ученици и родители.',
      features: ['Прием пон–пет', '07:30 – 19:00', 'Документи & Прием', 'Консултации'],
      emoji: ['🏢', '📋', '🖊️'],
      tourUrl: null   // ← добави снимка когато имаш
    }
  ];

  // ─────────────────────────────────────────────
  //  PANNELLUM – инстанция
  // ─────────────────────────────────────────────
  let _viewer = null;   // текущ Pannellum viewer
  let currentRoom = 0;
  let autoTourInterval = null;
  let isAutoTour = false;

  /**
   * Зарежда 360° панорама чрез Pannellum.
   * Ако стаята няма tourUrl – показва placeholder.
   */
  function loadPanorama(room) {
    const viewerEl    = document.getElementById('panorama-viewer');
    const placeholder = document.getElementById('viewerPlaceholder');
    const loading     = document.getElementById('viewer-loading');

    // Унищожи предишния viewer
    if (_viewer) {
      try { _viewer.destroy(); } catch (_) {}
      _viewer = null;
    }

    // CDN на Pannellum не е зареден (офлайн / блокиран схрипт)
    const hasPannellum = typeof window.pannellum === 'object' && typeof window.pannellum.viewer === 'function';

    if (!room.tourUrl || !hasPannellum) {
      // Няма снимка или Pannellum → покажи placeholder
      if (viewerEl)    viewerEl.style.display    = 'none';
      if (loading)     loading.classList.remove('active');
      if (placeholder) {
        placeholder.style.display = 'flex';
        const t = document.getElementById('placeholderTitle');
        const d = document.getElementById('placeholderDesc');
        if (t) t.textContent = room.title;
        if (d) d.textContent = hasPannellum
          ? `360° панорамата за „${room.title}" предстои да бъде добавена.`
          : '3D панорамите не могат да се заредят в момента. Опитайте по-късно или се свържете с канцеларията.';
      }
      return;
    }

    // Има снимка → скрий placeholder, покажи loader
    if (placeholder) placeholder.style.display = 'none';
    if (viewerEl)    viewerEl.style.display    = 'block';
    if (loading)     loading.classList.add('active');

    _viewer = pannellum.viewer('panorama-viewer', {
      type: 'equirectangular',
      panorama: room.tourUrl,
      autoLoad: true,
      autoRotate: -1.5,       // бавно авто-въртене
      hfov: 100,
      minHfov: 50,
      maxHfov: 120,
      showZoomCtrl: true,
      showFullscreenCtrl: false,  // използваме собствения ни бутон
      compass: false,
      hotSpotDebug: false,
      strings: {
        loadButtonLabel: 'Зареди панорамата',
        loadingLabel:    'Зарежда се…',
        bylineLabel:     '',
        noPanoramaError: 'Панорамата не беше намерена.',
        fileAccessError: 'Грешка при зареждане на файла.',
        ctrlZoomMsg:     'За zoom: Ctrl + Scroll'
      }
    });

    // Скрий loader след зареждане
    _viewer.on('load', function () {
      if (loading) loading.classList.remove('active');
    });

    // Скрий loader и при грешка (да не виси вечно)
    _viewer.on('error', function () {
      if (loading) loading.classList.remove('active');
      if (placeholder) {
        placeholder.style.display = 'flex';
        const t = document.getElementById('placeholderTitle');
        const d = document.getElementById('placeholderDesc');
        if (t) t.textContent = room.title;
        if (d) d.textContent = `Панорамата за „${room.title}" не можа да се зареди. Моля, опитайте по-късно.`;
      }
    });
  }

  // ─────────────────────────────────────────────
  //  Progress dots
  // ─────────────────────────────────────────────
  function buildProgressDots() {
    const c = document.getElementById('progressDots');
    if (!c) return;
    c.innerHTML = '';
    rooms.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'progress-dot' + (i === 0 ? ' active' : '');
      c.appendChild(d);
    });
  }

  // ─────────────────────────────────────────────
  //  Gallery thumbnails
  // ─────────────────────────────────────────────
  function buildGallery(room) {
    const c = document.getElementById('galleryThumbs');
    if (!c) return;
    c.innerHTML = '';
    const count = Math.max(room.emoji.length, 4);
    for (let i = 0; i < count; i++) {
      const thumb = document.createElement('div');
      thumb.className = 'thumb' + (i === 0 ? ' active' : '');
      const inner = document.createElement('div');
      inner.className = 'thumb-placeholder';
      inner.textContent = room.emoji[i % room.emoji.length] || '📷';
      thumb.appendChild(inner);
      thumb.addEventListener('click', () => {
        c.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
      c.appendChild(thumb);
    }
  }

  // ─────────────────────────────────────────────
  //  selectRoom – главна функция
  // ─────────────────────────────────────────────
  function selectRoom(idx) {
    currentRoom = idx;
    const room = rooms[idx];

    // Активен бутон в sidebar
    document.querySelectorAll('.room-btn').forEach((btn, i) =>
      btn.classList.toggle('active', i === idx)
    );

    // Текстови полета
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setText('roomLabel',  room.label);
    setText('roomTitle',  room.title);
    setText('roomBadge',  room.badge);
    setText('roomDesc',   room.desc);
    setText('roomCounter', `${idx + 1} / ${rooms.length}`);

    // Features
    const featuresEl = document.getElementById('roomFeatures');
    if (featuresEl) {
      featuresEl.innerHTML = room.features
        .map(f => `<span class="feature-tag">${f}</span>`)
        .join('');
    }

    // Prev / Next бутони
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === rooms.length - 1;

    // Progress dots
    document.querySelectorAll('.progress-dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx)
    );

    // Gallery
    buildGallery(room);

    // 360° панорама
    loadPanorama(room);

    // На мобилно – скролирай до viewer-а
    if (window.innerWidth < 900) {
      const viewer = document.getElementById('tourViewer');
      if (viewer) viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ─────────────────────────────────────────────
  //  Публично API (извиква се от HTML onclick)
  // ─────────────────────────────────────────────
  window.selectRoom = selectRoom;

  window.prevRoom = function () {
    if (currentRoom > 0) selectRoom(currentRoom - 1);
  };

  window.nextRoom = function () {
    if (currentRoom < rooms.length - 1) selectRoom(currentRoom + 1);
  };

  window.toggleAutoTour = function () {
    isAutoTour ? stopAutoTour() : startAutoTour();
  };

  function startAutoTour() {
    isAutoTour = true;
    const btn = document.getElementById('autoTourBtn');
    if (btn) btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg> Пауза`;
    selectRoom(0);
    autoTourInterval = setInterval(() => {
      if (currentRoom < rooms.length - 1) {
        selectRoom(currentRoom + 1);
      } else {
        stopAutoTour();
      }
    }, 6000);   // 6 сек. на стая
  }

  function stopAutoTour() {
    isAutoTour = false;
    clearInterval(autoTourInterval);
    const btn = document.getElementById('autoTourBtn');
    if (btn) btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg> Обиколи с нас`;
  }

  // Fullscreen – опитва с Pannellum, после с browser API
  window.requestFullscreen = function () {
    if (_viewer) {
      try { _viewer.toggleFullscreen(); return; } catch (_) {}
    }
    const v = document.getElementById('tourViewer');
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
  };

  window.shareRoom = function () {
    const room = rooms[currentRoom];
    const shareData = {
      title: `СУ „Йордан Йовков" – ${room.title}`,
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert('Линкът е копиран!'))
        .catch(function () {});
    }
  };

  // ─────────────────────────────────────────────
  //  Инициализация
  // ─────────────────────────────────────────────
  buildProgressDots();
  selectRoom(0);

})();