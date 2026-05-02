export function initAudioPlayer() {
  let audio = null;
  let isMuted = false;
  let lastVol = 0.8;

  const AUDIO_PATH = "../../assets/audio/himn-xsu.mp3";

  function updateVolIcon(v) {
    const icon = document.getElementById('volIcon');
    if (!icon) return;
    if (v == 0) {
      icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
    } else {
      icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>';
    }
  }

  function updateTimeDisplay(cur, dur) {
    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    const el = document.getElementById('timeDisplay');
    if (el) el.textContent = `${fmt(cur)} / ${isNaN(dur) ? '0:00' : fmt(dur)}`;
  }

  function updateProgress() {
    if (!audio || !audio.duration) return;
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    updateTimeDisplay(audio.currentTime, audio.duration);
  }

  function initAudio(src) {
    const slider = document.getElementById('volumeSlider');
    audio = new Audio(src);
    audio.volume = slider ? parseFloat(slider.value) : lastVol;

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
      const btn = document.getElementById('playBtn');
      if (btn) btn.classList.remove('playing');
      const fill = document.getElementById('progressFill');
      if (fill) fill.style.width = '0%';
      updateTimeDisplay(0, audio.duration);
    });
    audio.addEventListener('loadedmetadata', () => updateTimeDisplay(0, audio.duration));
  }

  // Initialize immediately with file path
  initAudio(AUDIO_PATH);

  window.togglePlay = function () {
    if (!audio) return;
    const btn = document.getElementById('playBtn');
    if (audio.paused) { audio.play(); btn && btn.classList.add('playing'); }
    else              { audio.pause(); btn && btn.classList.remove('playing'); }
  };

  let isDragging = false;

  function seekFromPosition(clientX) {
    if (!audio || !audio.duration) return;
    const wrap = document.getElementById('progressWrap');
    const rect = wrap.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audio.currentTime = percent * audio.duration;
  }
  
  // Mouse events
  const progressWrap = document.getElementById('progressWrap');
  
  progressWrap.addEventListener('mousedown', (e) => {
    isDragging = true;
    seekFromPosition(e.clientX);
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    seekFromPosition(e.clientX);
  });
  
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Touch events (mobile)
  progressWrap.addEventListener('touchstart', (e) => {
    isDragging = true;
    seekFromPosition(e.touches[0].clientX);
  });
  
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    seekFromPosition(e.touches[0].clientX);
  });
  
  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.setVolume = function (v) {
    lastVol = parseFloat(v);
    if (audio) audio.volume = lastVol;
    updateVolIcon(lastVol);
    if (lastVol > 0) isMuted = false;
  };

  window.toggleMute = function () {
    if (!audio) return;
    const slider = document.getElementById('volumeSlider');
    if (isMuted) {
      audio.volume = lastVol;
      if (slider) slider.value = lastVol;
      isMuted = false;
    } else {
      audio.volume = 0;
      if (slider) slider.value = 0;
      isMuted = true;
    }
    updateVolIcon(audio.volume);
  };
}