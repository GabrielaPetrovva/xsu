(function () {
  'use strict';

  const scenes = {
    fasada: {
      id:         'fasada',
      roomIdx:    0,
      panorama:   'images/tour-test.jpg',
      firstYaw:   0,
      firstPitch: 0
    },
    klasa: {
      id:         'klasa',
      roomIdx:    1,
      panorama:   'assets/images/panoramas/nauki.jpg',
      firstYaw:   0,
      firstPitch: 0
    },
    kompyutaren: {
      id:         'kompyutaren',
      roomIdx:    2,
      panorama:   'assets/images/panoramas/nauki.jpg',
      firstYaw:   0,
      firstPitch: 0
    },
    nauki: {
      id:         'nauki',
      roomIdx:    3,
      panorama:   'assets/images/panoramas/nauki.jpg',
      firstYaw:   0,
      firstPitch: 0
    }
  };

  const rooms = [
    {
      id: 0, sceneId: 'fasada', label: 'Поглед отвън', title: 'Фасада и двор', badge: 'Начална точка',
      desc: 'Добре дошли в СУ „Йордан Йовков"! Разгледайте фасадата на нашето училище и просторния двор, където учениците прекарват почивките си.',
      features: ['Просторен двор', 'Спортна площадка', 'Зелени площи', 'Паркинг'],
    },
    {
      id: 1, sceneId: 'klasa', label: 'Учебна дейност', title: 'Класна стая', badge: 'I–XII клас',
      desc: 'Нашите класни стаи са просветли, удобни и оборудвани с модерни учебни помагала.',
      features: ['Интерактивна дъска', 'Проектор', 'Климатик', 'Натурална светлина'],
    },
    {
      id: 2, sceneId: 'kompyutaren', label: 'Учебна дейност', title: 'Компютърен кабинет', badge: 'ИТ & Програмиране',
      desc: 'Модерно оборудван компютърен кабинет с нови машини и бърз интернет.',
      features: ['30 работни места', 'Бърз интернет', 'Нови компютри', 'Специализиран софтуер'],
    },
    {
      id: 3, sceneId: 'nauki', label: 'Учебна дейност', title: 'Кабинети по науки', badge: 'Физика · Химия · Биология',
      desc: 'Напълно оборудвани лаборатории за практически опити по физика, химия и биология.',
      features: ['Лабораторно оборудване', 'Демонстрационна маса', 'Защитно оборудване', 'Реактиви и препарати'],
    }
  ];

  let _viewer        = null;
  let currentRoomIdx = 0;
  let autoTourInterval = null;
  let isAutoTour     = false;

  function buildPannellumConfig() {
    const config = {
      default: {
        firstScene:         'fasada',
        sceneFadeDuration:  800,
        autoLoad:           true,
        showZoomCtrl:       true,
        showFullscreenCtrl: false,
        compass:            false,
        hotSpotDebug:       false,
        strings: {
          loadingLabel:    'Зарежда се…',
          noPanoramaError: 'Панорамата не беше намерена.',
          fileAccessError: 'Грешка при зареждане на файла.',
          ctrlZoomMsg:     'Ctrl + Scroll за zoom'
        }
      },
      scenes: {}
    };

    Object.values(scenes).forEach(scene => {
      config.scenes[scene.id] = {
        type:     'equirectangular',
        panorama: scene.panorama,
        yaw:      scene.firstYaw,
        pitch:    scene.firstPitch
      };
    });

    return config;
  }

  function initViewer() {
    const loading = document.getElementById('viewer-loading');
    if (loading) loading.classList.add('active');

    if (_viewer) {
      try { _viewer.destroy(); } catch (_) {}
      _viewer = null;
    }

    _viewer = pannellum.viewer('panorama-viewer', buildPannellumConfig());

    _viewer.on('load', () => {
      if (loading) loading.classList.remove('active');
      syncSidebarToScene(_viewer.getScene());
    });

    _viewer.on('scenechange', sceneId => {
      syncSidebarToScene(sceneId);
    });

    _viewer.on('error', () => {
      if (loading) loading.classList.remove('active');
    });
  }

  function syncSidebarToScene(sceneId) {
    const scene = scenes[sceneId];
    if (!scene) return;
    updateRoomInfo(scene.roomIdx, false);
  }

  function updateRoomInfo(idx, switchScene) {
    currentRoomIdx = idx;
    const room = rooms[idx];
    if (!room) return;

    document.querySelectorAll('.room-btn').forEach((btn, i) =>
      btn.classList.toggle('active', i === idx)
    );

    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setText('roomLabel',   room.label);
    setText('roomTitle',   room.title);
    setText('roomBadge',   room.badge);
    setText('roomDesc',    room.desc);
    setText('roomCounter', `${idx + 1} / ${rooms.length}`);

    const featuresEl = document.getElementById('roomFeatures');
    if (featuresEl && room.features) {
      featuresEl.innerHTML = room.features.map(f => `<span class="feature-tag">${f}</span>`).join('');
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === rooms.length - 1;

    document.querySelectorAll('.progress-dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx)
    );

    if (switchScene && _viewer && room.sceneId) {
      _viewer.loadScene(room.sceneId);
    }

    if (window.innerWidth < 900) {
      const viewer = document.getElementById('tourViewer');
      if (viewer) viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  window.selectRoom = function (idx) {
    updateRoomInfo(idx, true);
  };

  window.prevRoom = function () {
    if (currentRoomIdx > 0) updateRoomInfo(currentRoomIdx - 1, true);
  };

  window.nextRoom = function () {
    if (currentRoomIdx < rooms.length - 1) updateRoomInfo(currentRoomIdx + 1, true);
  };

  window.toggleAutoTour = function () {
    isAutoTour ? stopAutoTour() : startAutoTour();
  };

  function startAutoTour() {
    isAutoTour = true;
    const btn = document.getElementById('autoTourBtn');
    if (btn) btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px">
        <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
      </svg> Пауза`;
    updateRoomInfo(0, true);
    autoTourInterval = setInterval(() => {
      currentRoomIdx < rooms.length - 1
        ? updateRoomInfo(currentRoomIdx + 1, true)
        : stopAutoTour();
    }, 6000);
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

  window.requestFullscreen = function () {
    const el = document.getElementById('panorama-viewer') ||
               document.getElementById('tourViewer');
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen && document.exitFullscreen();
      return;
    }
    const enter = el.requestFullscreen || el.webkitRequestFullscreen
                || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (enter) enter.call(el).catch(err => console.warn('Fullscreen:', err));
  };

  window.shareRoom = function () {
    const room = rooms[currentRoomIdx];
    if (navigator.share) {
      navigator.share({ title: `СУ „Йордан Йовков" – ${room.title}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Линкът е копиран!'));
    }
  };

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

  buildProgressDots();
  updateRoomInfo(0, false);
  initViewer();

})();